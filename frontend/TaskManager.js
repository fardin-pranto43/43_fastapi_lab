import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

const TaskManager = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    phoneNumber: ''
  });
  const [errorMessages, setErrorMessages] = useState({});
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    clearErrors(name);
  };

  const clearErrors = (fieldName) => {
    setErrorMessages(prevState => ({
      ...prevState,
      [fieldName]: undefined
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    if (formData.username.length < 5) {
      errors.username = 'Username must be at least 5 characters long.';
    }
    if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long.';
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }
    if (!formData.email.includes('@')) {
      errors.email = 'Invalid email address.';
    }
    if (formData.phoneNumber.length !== 11 || isNaN(formData.phoneNumber)) {
      errors.phoneNumber = 'Phone number must be exactly 11 digits.';
    }

    if (Object.keys(errors).length === 0) {
      try {
        const response = await fetch('http://localhost:8000/register/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          console.log('User registered successfully');
          setRegistrationSuccess(true);
          setErrorMessages({});
        } else if (response.status === 400) {
          const data = await response.json();
          if (data.detail === "Username already exists") {
            setErrorMessages({ username: "Username already exists" });
          } else {
            console.error('Registration failed:', data.detail);
            setErrorMessages({}); // Clear previous error messages
          }
          setRegistrationSuccess(false);
        } else {
          console.error('Registration failed:', await response.text());
          setRegistrationSuccess(false);
        }
      } catch (error) {
        console.error('Error:', error);
        setRegistrationSuccess(false);
      }
    } else {
      setErrorMessages(errors);
      setRegistrationSuccess(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Register</h1>
      {registrationSuccess && (
        <Alert variant="success">User registered successfully!</Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            isInvalid={!!errorMessages.username}
          />
          <Form.Control.Feedback type="invalid">{errorMessages.username}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            isInvalid={!!errorMessages.password}
          />
          {errorMessages.password && (
            <Form.Control.Feedback type="invalid">{errorMessages.password}</Form.Control.Feedback>
          )}
        </Form.Group>

        <Form.Group controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            isInvalid={!!errorMessages.confirmPassword}
          />
          <Form.Control.Feedback type="invalid">{errorMessages.confirmPassword}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            isInvalid={!!errorMessages.email}
          />
          <Form.Control.Feedback type="invalid">{errorMessages.email}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="phoneNumber">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            isInvalid={!!errorMessages.phoneNumber}
          />
          <Form.Control.Feedback type="invalid">{errorMessages.phoneNumber}</Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit">
          Register
        </Button>
      </Form>
    </div>
  );
};

export default TaskManager;
