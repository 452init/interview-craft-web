interface QuestionListProps {
  questions: string[];
}

export default function QuestionList({ questions }: QuestionListProps) {
  if (!questions || questions.length === 0) {
    return null;
  }

  return (
    <div className="questions-container">
      <h2>Generated Questions</h2>
      {questions.map((q, index) => (
        <div key={index} className="question-card">
          <h3>Question {index + 1}</h3>
          <p>{q}</p>
        </div>
      ))}
    </div>
  );
}
