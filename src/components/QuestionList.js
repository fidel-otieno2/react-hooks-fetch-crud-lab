// src/components/QuestionList.js
import React, { useEffect, useState } from "react";
import QuestionItem from "./QuestionItem";

function QuestionList() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/questions")
      .then((res) => res.json())
      .then(setQuestions);
  }, []);

  function handleDelete(deletedId) {
    setQuestions((questions) =>
      questions.filter((q) => q.id !== deletedId)
    );
  }

  function handleUpdate(updatedQuestion) {
    setQuestions((questions) =>
      questions.map((q) =>
        q.id === updatedQuestion.id ? updatedQuestion : q
      )
    );
  }

  return (
    <section>
      <h1>Quiz Questions</h1>
      <ul>
        {questions.map((q) => (
          <QuestionItem
            key={q.id}
            question={q}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        ))}
      </ul>
    </section>
  );
}

export default QuestionList;
