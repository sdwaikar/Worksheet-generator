import React, { useState } from 'react';
import { Form, Button, Col, Row } from 'react-bootstrap';

const WorksheetForm = ({ onGenerate }) => {
  const [gradeLevel, setGradeLevel] = useState('University');
  const [topic, setTopic] = useState('');
  const [questionTypes, setQuestionTypes] = useState([]);
  const [difficulty, setDifficulty] = useState(3);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);
  const [content, setContent] = useState('');

  const handleQuestionTypeChange = (e) => {
    const value = e.target.value;
    setQuestionTypes(prev => 
      prev.includes(value) ? prev.filter(type => type !== value) : [...prev, value]
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!topic) {
      setError('Please enter a topic or text.');
    } else if (questionTypes.length === 0) {
      setError('Please select at least one question type.');
    } else {
      setError('');
      const difficultyLabel = difficulty === 1 ? 'Simple' : difficulty === 3 ? 'Medium' : 'Difficult';
      onGenerate({ gradeLevel, topic, questionTypes, difficulty: difficultyLabel, file, content });
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="form-container">
      <Form.Group as={Row} controlId="formGradeLevel" className="form-group">
        <Form.Label column sm="4">Grade Level</Form.Label>
        <Col sm="8">
          <Form.Control as="select" value={gradeLevel} onChange={(e) => setGradeLevel(e.target.value)}>
            <option>Primary</option>
            <option>Secondary</option>
            <option>High School</option>
            <option>University</option>
          </Form.Control>
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="formTopic" className="form-group">
        <Form.Label column sm="4">Topic</Form.Label>
        <Col sm="8">
          <Form.Control type="text" placeholder="Enter topic" value={topic} onChange={(e) => setTopic(e.target.value)} />
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="formQuestionTypes" className="form-group">
        <Form.Label column sm="4">Question Types</Form.Label>
        <Col sm="8">
          <Form.Check 
            type="checkbox" 
            label="Fill in the Blank" 
            value="Fill in the Blank" 
            onChange={handleQuestionTypeChange}
          />
          <Form.Check 
            type="checkbox" 
            label="Multiple Choice" 
            value="Multiple Choice" 
            onChange={handleQuestionTypeChange}
          />
          <Form.Check 
            type="checkbox" 
            label="True/False" 
            value="True/False" 
            onChange={handleQuestionTypeChange}
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="formDifficulty" className="form-group">
        <Form.Label column sm="4">Difficulty</Form.Label>
        <Col sm="8">
          <Form.Control 
            type="range" 
            min="1" 
            max="5" 
            step="1" 
            value={difficulty} 
            onChange={(e) => setDifficulty(parseInt(e.target.value))} 
          />
          <div className="d-flex justify-content-between">
            <span>Simple</span>
            <span>Medium</span>
            <span>Difficult</span>
          </div>
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="formFile" className="form-group">
        <Form.Label column sm="4">Upload PDF</Form.Label>
        <Col sm="8">
          <Form.Control type="file" onChange={(e) => setFile(e.target.files[0])} />
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="formContent" className="form-group">
        <Form.Label column sm="4">Content</Form.Label>
        <Col sm="8">
          <Form.Control as="textarea" rows={3} placeholder="Paste content here" value={content} onChange={(e) => setContent(e.target.value)} />
        </Col>
      </Form.Group>

      {error && <div className="error-message">{error}</div>}

      <Button variant="primary" type="submit">
        Generate
      </Button>
    </Form>
  );
};

export default WorksheetForm;
