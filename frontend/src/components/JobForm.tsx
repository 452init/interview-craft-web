import { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import { getProfessionProfile } from '../professionOptions';

interface JobFormProps {
  onQuestionsGenerated: (questions: string[]) => void;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function JobForm({ onQuestionsGenerated }: JobFormProps) {
  const [position, setPosition] = useState('Customer Success Manager');
  const [seniority, setSeniority] = useState('');
  const [focusArea, setFocusArea] = useState('');

  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const professionProfile = useMemo(() => getProfessionProfile(position), [position]);
  const focusAreas = professionProfile.areas;
  const seniorityLevels = professionProfile.seniorityLevels;

  useEffect(() => {
    if (!seniorityLevels.includes(seniority)) {
      setSeniority(seniorityLevels[0]);
    }

    if (!focusAreas.includes(focusArea)) {
      setFocusArea(focusAreas[0]);
    }
  }, [focusArea, focusAreas, seniority, seniorityLevels]);

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
              {seniorityLevels.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="focusArea">
            Focus Area
          </label>
          <div className="select-wrapper">
            <select
              id="focusArea"
              value={focusArea}
              onChange={(e) => setFocusArea(e.target.value)}
              required
              disabled={focusAreas.length === 0}
            >
              {focusAreas.length === 0 && (
                <option value="">No focus areas found</option>
              )}
              {focusAreas.map((area, idx) => (
                <option key={idx} value={area}>{area}</option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={generating || focusAreas.length === 0}>
          {generating ? <div className="loader"></div> : 'Generate 3 Questions'}
        </button>
      </form>
    </div>
  );
}
