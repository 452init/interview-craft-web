import pytest
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
