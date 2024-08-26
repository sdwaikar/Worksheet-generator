import React, { useState } from "react";
import axios from "axios";
import { Container, Alert } from "react-bootstrap";
import WorksheetForm from "./WorksheetForm";
import WorksheetPreview from "./WorksheetPreview";
import AnswerKeyPreview from "./AnswerkeyPreview";

const WorksheetGenerator = () => {
  const [worksheet, setWorksheet] = useState("");
  const [answerKey, setAnswerKey] = useState("");
  const [error, setError] = useState("");

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

  return (
    <Container className="py-5">
      <h1>Worksheet Generator</h1>
      <WorksheetForm onGenerate={handleGenerate} />
      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}
      <WorksheetPreview worksheet={worksheet} />
      <AnswerKeyPreview answerKey={answerKey} />
    </Container>
  );
};

export default WorksheetGenerator;
