import React, { useState, useEffect} from 'react';
import { Button, Card, CardBody, CardHeader, Form, FormGroup } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


const UserForm = ({ onSubmit, activeTab, selectedTask }) => {
  const [formData, setFormData] = useState({
    id: selectedTask.id,
    comments: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  useEffect(()=>{
    console.log(activeTab, formData);
  },[formData])

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(activeTab, formData); 
    setFormData({ id : '', comments: '' }); 
  };

  return (
    <>
    <Row>
      <Col>User Name : {selectedTask.user}</Col>
      <Col>ID: {selectedTask.id}</Col>
    </Row>
    <div  className="p-1">
       <Form onSubmit={handleSubmit}>
      <Form.Group className="p-1">
        <Form.Label className="align-text-left">Comments:</Form.Label>
        <Form.Control  as="textarea" name="comments" rows={3} value={formData.comments} onChange={handleChange} />
      </Form.Group>
      <Button type="submit" className="mt-2">Send</Button>
    </Form>
    </div>

    </>
  );
};

export default UserForm;
