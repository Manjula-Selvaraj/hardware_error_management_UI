import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const UserForm = ({ onSubmit, activeTab }) => {
  const [formData, setFormData] = useState({
    comments: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(activeTab, formData); 
    setFormData({ comments: '' }); 
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Comments</Form.Label>
        <Form.Control as="textarea" name="comments" rows={3} value={formData.comments} onChange={handleChange} />
      </Form.Group>
      <Button type="submit" className="mt-2">Send</Button>
    </Form>
  );
};

export default UserForm;
