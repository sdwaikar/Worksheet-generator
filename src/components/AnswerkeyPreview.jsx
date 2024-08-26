import React from 'react';
import { Card } from 'react-bootstrap';

const AnswerKeyPreview = ({ answerKey }) => {
  return (
    <Card className="mt-3">
      <Card.Body>
        <Card.Title>Answer Key</Card.Title>
        <Card.Text>
          {answerKey ? answerKey : 'No answer key available.'}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default AnswerKeyPreview;
