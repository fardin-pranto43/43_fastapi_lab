import React, { useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ heading: '', description: '' });
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);

  const handleAddTask = () => {
    if (newTask.heading && newTask.description) {
      setTasks([...tasks, { ...newTask }]);
      setNewTask({ heading: '', description: '' });
    }
  };

  const handleEditTask = (index) => {
    setEditingTaskIndex(index);
    setNewTask(tasks[index]);
  };

  const handleUpdateTask = () => {
    if (newTask.heading && newTask.description) {
      const updatedTasks = [...tasks];
      updatedTasks[editingTaskIndex] = { ...newTask };
      setTasks(updatedTasks);
      setNewTask({ heading: '', description: '' });
      setEditingTaskIndex(null);
    }
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
    setEditingTaskIndex(null);
  };

  return (
    <div className="container text-center mt-5">
      <h1 className="mb-4">Tasks </h1>

      <Form>
        <Form.Group controlId="taskHeading">
          <Form.Label>Task Heading</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter task heading"
            value={newTask.heading}
            onChange={(e) => setNewTask({ ...newTask, heading: e.target.value })}
          />
        </Form.Group>

        <Form.Group controlId="taskDescription">
          <Form.Label>Task Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter task description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
        </Form.Group>

        {editingTaskIndex === null ? (
          <Button variant="primary" onClick={handleAddTask}>
            Add New Task
          </Button>
        ) : (
          <Button variant="success" onClick={handleUpdateTask}>
            Update Task
          </Button>
        )}
      </Form>

      <div className="mt-4">
        {tasks.map((task, index) => (
          <Card key={index} className="mb-3">
            <Card.Body>
              <Card.Title>{task.heading}</Card.Title>
              <Card.Text className="text-muted">{task.description}</Card.Text>
              <Button variant="info" className="mr-2" onClick={() => handleEditTask(index)}>
                Edit
              </Button>
              <Button variant="danger" onClick={() => handleDeleteTask(index)}>
                Delete
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TaskManager;
