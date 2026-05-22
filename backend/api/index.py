import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
# pyrefly: ignore [missing-import]
import google.generativeai as genai
from sqlalchemy.exc import SQLAlchemyError
try:
    from .models import db, GeneratedQuestion
except ImportError:
    from models import db, GeneratedQuestion

load_dotenv()

app = Flask(__name__)
CORS(app)

# Database configuration
database_url = os.environ.get('DATABASE_URL') or 'sqlite:///local.db'
if database_url.startswith('postgres://'):
    database_url = database_url.replace('postgres://', 'postgresql://', 1)

app.config['SQLALCHEMY_DATABASE_URI'] = database_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# Initialize database tables
try:
    with app.app_context():
        db.create_all()
except SQLAlchemyError as e:
    print(f"Database initialization skipped: {e}")

# Configure Gemini AI
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
else:
    model = None

@app.route('/', methods=['GET'])
def home():
    return jsonify({"status": "Flask API is running"})

@app.route('/api/focus-areas', methods=['GET'])
def get_focus_areas():
    position = request.args.get('position', '').strip()
    if not position:
        return jsonify({"error": "Position is required"}), 400
        
    if not model:
        return jsonify({"error": "Gemini API key not configured"}), 500

    prompt = (
        f"Given the job title '{position}', generate a list of 5 key interview focus areas "
        f"(e.g., if software engineer, 'Data Structures and Algorithms', 'System Design'). "
        f"Return only a comma-separated list of 5 areas, no extra text, no bullet points."
    )
    
    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        # Clean up in case Gemini returns something like '1. Area 1, 2. Area 2'
        areas = [area.strip().lstrip('0123456789.-* ') for area in text.split(',')]
        # Filter out empties and take top 5
        areas = [a for a in areas if a][:5]
        
        # Fallback if the comma separation failed and returned newlines instead
        if len(areas) < 3 and '\n' in text:
            areas = [area.strip().lstrip('0123456789.-* ') for area in text.split('\n')]
            areas = [a for a in areas if a][:5]
            
        return jsonify({"focus_areas": areas})
    except Exception as e:
        print(f"Error generating focus areas: {e}")
        return jsonify({"error": "Failed to generate focus areas"}), 500

@app.route('/api/generate-questions', methods=['POST'])
def generate_questions():
    data = request.json
    position = data.get('position', '').strip()
    seniority = data.get('seniority', '').strip()
    focus_area = data.get('focus_area', '').strip()
    
    if not all([position, seniority, focus_area]):
        return jsonify({"error": "Missing required fields"}), 400
        
    if not model:
        return jsonify({"error": "Gemini API key not configured"}), 500

    prompt = (
        f"Generate exactly 8 interview questions for a {position} position at {seniority} level, focusing on {focus_area} aspects. "
        f"Respond ONLY with a valid JSON array. Each object must have: \"question\" (string) and \"difficulty\" (\"Easy\",\"Medium\",\"Hard\"). "
        f"No markdown, no preamble."
    )

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        if text.startswith('```json'):
            text = text[7:]
        if text.startswith('```'):
            text = text[3:]
        if text.endswith('```'):
            text = text[:-3]
        text = text.strip()
        
        questions = json.loads(text)
        
        if not isinstance(questions, list) or len(questions) != 8:
            raise ValueError("Invalid format returned by AI")
            
        record = None
        try:
            new_entry = GeneratedQuestion(
                position=position,
                seniority=seniority,
                focus_area=focus_area,
                questions=questions
            )
            db.session.add(new_entry)
            db.session.commit()
            record = new_entry.to_dict()
        except SQLAlchemyError as e:
            db.session.rollback()
            print(f"Question persistence skipped: {e}")
        
        return jsonify({"questions": questions, "record": record})
        
    except Exception as e:
        print(f"Error generating questions: {e}")
        return jsonify({"error": "Failed to generate questions"}), 500

# Vercel serverless function entrypoint
if __name__ == '__main__':
    app.run(port=5000, debug=True)
