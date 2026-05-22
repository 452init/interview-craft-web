import json
import pytest
from sqlalchemy.exc import SQLAlchemyError
from api.index import app
from api.models import db

@pytest.fixture
def client():
    # Use an in-memory SQLite database for testing
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['TESTING'] = True

    with app.test_client() as client:
        with app.app_context():
            db.create_all()
        yield client

def test_home(client):
    """Test the home route."""
    response = client.get('/')
    assert response.status_code == 200
    assert b"Flask API is running" in response.data

def test_focus_areas_no_position(client):
    """Test the focus-areas endpoint without a position parameter."""
    response = client.get('/api/focus-areas')
    assert response.status_code == 400
    assert b"Position is required" in response.data

def test_generate_questions_missing_fields(client):
    """Test the generate-questions endpoint with missing fields."""
    response = client.post('/api/generate-questions', json={
        "position": "Software Engineer",
        "seniority": "Mid-level"
        # missing focus_area
    })
    assert response.status_code == 400
    assert b"Missing required fields" in response.data

def test_generate_questions_returns_ai_output_when_database_commit_fails(client, mocker):
    """Question generation should not fail just because persistence is unavailable."""
    questions = [
        {"question": f"Question {index}", "difficulty": "Medium"}
        for index in range(1, 9)
    ]
    fake_response = mocker.Mock()
    fake_response.text = json.dumps(questions)

    fake_model = mocker.Mock()
    fake_model.generate_content.return_value = fake_response
    mocker.patch('api.index.model', fake_model)
    mocker.patch('api.index.db.session.commit', side_effect=SQLAlchemyError("database unavailable"))

    response = client.post('/api/generate-questions', json={
        "position": "Software Engineer",
        "seniority": "Mid-Level",
        "focus_area": "Technical"
    })

    assert response.status_code == 200
    assert response.json["questions"] == questions
    assert response.json["record"] is None
