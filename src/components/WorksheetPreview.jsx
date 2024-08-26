import React from 'react';
import { Card } from 'react-bootstrap';

const WorksheetPreview = ({ worksheet }) => {
  return (
    <Card>
      <Card.Body>
        <Card.Title>Worksheet Preview</Card.Title>
        <Card.Text>
          {worksheet ? worksheet : 'No preview available.'}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default WorksheetPreview;

