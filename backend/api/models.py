from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone

db = SQLAlchemy()

class GeneratedQuestion(db.Model):
    __tablename__ = 'generated_questions'
    id = db.Column(db.Integer, primary_key=True)
    position = db.Column(db.String(255), nullable=False)
    seniority = db.Column(db.String(50), nullable=False)
    focus_area = db.Column(db.String(255), nullable=False)
    questions = db.Column(db.JSON, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            'id': self.id,
            'position': self.position,
            'seniority': self.seniority,
            'focus_area': self.focus_area,
            'questions': self.questions,
            'created_at': self.created_at.isoformat()
        }
