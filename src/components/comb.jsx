import React, { useState } from "react";
import {
  Container,
  Alert,
  Card,
  Form,
  Button,
  Col,
  Row,
} from "react-bootstrap";
import axios from "axios";

const WorksheetGenerator = () => {
  const [gradeLevel, setGradeLevel] = useState("University");
  const [topic, setTopic] = useState("");
  const [questionTypes, setQuestionTypes] = useState([]);
  const [difficulty, setDifficulty] = useState(3);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [content, setContent] = useState("");
  const [worksheet, setWorksheet] = useState("");
  const [answerKey, setAnswerKey] = useState("");

  const handleQuestionTypeChange = (e) => {
    const value = e.target.value;
    setQuestionTypes((prev) =>
      prev.includes(value)
        ? prev.filter((type) => type !== value)
        : [...prev, value]
    );
  };

  const handleGenerate = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/generate-worksheet",
        data
      );
      setWorksheet(response.data.worksheet);
      setAnswerKey(response.data.answerKey);
      setError("");
    } catch (err) {
      setError("There was an error generating the worksheet.");
      setWorksheet("");
      setAnswerKey("");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!topic) {
      setError("Please enter a topic or text.");
    } else if (questionTypes.length === 0) {
      setError("Please select at least one question type.");
    } else {
      setError("");
      const difficultyLabel =
        difficulty === 1 ? "Simple" : difficulty === 3 ? "Medium" : "Difficult";
      handleGenerate({
        gradeLevel,
        topic,
        questionTypes,
        difficulty: difficultyLabel,
        file,
        content,
      });
    }
  };

  return (
    <Container className="py-5">
      <h1>Worksheet Generator</h1>
      <Form onSubmit={handleSubmit} className="form-container">
        {/* All form groups similar to the one defined in WorksheetForm */}
      </Form>
      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}
      <Card>
        <Card.Body>
          <Card.Title>Worksheet Preview</Card.Title>
          <Card.Text>
            {worksheet ? worksheet : "No preview available."}
          </Card.Text>
        </Card.Body>
      </Card>
      <Card className="mt-3">
        <Card.Body>
          <Card.Title>Answer Key</Card.Title>
          <Card.Text>
            {answerKey ? answerKey : "No answer key available."}
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default WorksheetGenerator;
