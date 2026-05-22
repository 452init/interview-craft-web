import { useState, useEffect } from 'react';
import axios from 'axios';

interface JobFormProps {
  onQuestionsGenerated: (questions: string[]) => void;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function JobForm({ onQuestionsGenerated }: JobFormProps) {
  const [position, setPosition] = useState('Customer Success Manager');
  const [seniority, setSeniority] = useState('Mid-level');
  const [focusArea, setFocusArea] = useState('');

  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  // Debounce for fetching focus areas
  useEffect(() => {
    const fetchFocusAreas = async () => {
      if (!position.trim()) return;

      setLoadingAreas(true);
      setError('');
      try {
        const response = await axios.get(`${API_BASE_URL}/api/focus-areas`, {
          params: { position }
        });
        setFocusAreas(response.data.focus_areas || []);
        if (response.data.focus_areas && response.data.focus_areas.length > 0) {
          setFocusArea(response.data.focus_areas[0]);
        }
      } catch (err) {
        console.error('Error fetching focus areas:', err);
        setError('Failed to fetch focus areas. Please try again.');
      } finally {
        setLoadingAreas(false);
      }
    };

    const timerId = setTimeout(() => {
      fetchFocusAreas();
    }, 800); // 800ms debounce

    return () => clearTimeout(timerId);
  }, [position]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!focusArea) {
      setError('Please select a focus area.');
      return;
    }

    setGenerating(true);
    setError('');
    onQuestionsGenerated([]); // Clear previous questions

    try {
      const response = await axios.post(`${API_BASE_URL}/api/generate-questions`, {
        position,
        seniority,
        focus_area: focusArea
      });

      if (response.data.questions && response.data.questions.length === 3) {
        onQuestionsGenerated(response.data.questions);
      } else {
        setError('Failed to generate questions please try again.');
      }
    } catch (err) {
      console.error('Error generating questions:', err);
      setError('An error occurred while generating questions.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="glass-card">
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="position">Job Position</label>
          <input
            id="position"
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="Customer Success Manager"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="seniority">Seniority Level</label>
          <div className="select-wrapper">
            <select
              id="seniority"
              value={seniority}
              onChange={(e) => setSeniority(e.target.value)}
              required
            >
              <option value="Junior">Junior</option>
              <option value="Mid-level">Mid-level</option>
              <option value="Senior">Senior</option>
              <option value="Executive">Executive</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="focusArea">
            Focus Area {loadingAreas && <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>(Loading...)</span>}
          </label>
          <div className="select-wrapper">
            <select
              id="focusArea"
              value={focusArea}
              onChange={(e) => setFocusArea(e.target.value)}
              required
              disabled={loadingAreas || focusAreas.length === 0}
            >
              {focusAreas.length === 0 && !loadingAreas && (
                <option value="">No focus areas found</option>
              )}
              {focusAreas.map((area, idx) => (
                <option key={idx} value={area}>{area}</option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={generating || loadingAreas || focusAreas.length === 0}>
          {generating ? <div className="loader"></div> : 'Generate 3 Questions'}
        </button>
      </form>
    </div>
  );
}
