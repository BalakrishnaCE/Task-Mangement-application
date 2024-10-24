import React, { useState, useEffect } from "react";
import { useMutation, useQuery, gql } from "@apollo/client";
import { TextField, Button, Container, Typography, MenuItem, Snackbar } from "@mui/material";
import { useNavigate } from 'react-router-dom'; // To redirect after task creation
import MuiAlert from "@mui/material/Alert";

// GraphQL query to fetch users
const GET_USERS = gql`
  query UserMany {
    userMany {
      _id
      fullname
    }
  }
`;

// GraphQL mutation to create a task
const CREATE_TASK = gql`
  mutation Mutation($title: String!, $description: String!, $assignedTo: MongoID!, $dueDate: Date!) {
    taskCreate(title: $title, description: $description, assignedTo: $assignedTo, dueDate: $dueDate) {
      title
      assignedTo
      dueDate
      status
    }
  }
`;

const AddTaskPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [taskCreated, setTaskCreated] = useState(false);
  const [taskError, setTaskError] = useState(false);
  const [taskMessage, setTaskMessage] = useState("");

  const navigate = useNavigate();

  // Fetch the list of users for assignment
  const { data: userData, loading: userLoading, error: userError } = useQuery(GET_USERS);

  const [createTask] = useMutation(CREATE_TASK, {
    onCompleted: (data) => {
      setTaskMessage("Task created successfully!");
      setTaskCreated(true);

      // Redirect to another page (e.g., task list page) after successful creation
      setTimeout(() => navigate("/"), 2000); // Redirect after 2 seconds
    },
    onError: (error) => {
      setTaskMessage(error.message);
      setTaskError(true);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createTask({
      variables: {
        title,
        description,
        assignedTo,
        dueDate
      }
    });
  };

  const handleClose = () => {
    setTaskCreated(false);
    setTaskError(false);
  };

  if (userLoading) return <p>Loading...</p>;
  if (userError) return <p>Error loading users: {userError.message}</p>;

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Add New Task
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          label="Assign To"
          variant="outlined"
          select
          fullWidth
          margin="normal"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
        >
          {userData.userMany.map((user) => (
            <MenuItem key={user._id} value={user._id}>
              {user.fullname}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Due Date"
          type="date"
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Create Task
        </Button>
      </form>

      {/* Snackbar for success/error messages */}
      <Snackbar open={taskCreated} autoHideDuration={6000} onClose={handleClose}>
        <MuiAlert onClose={handleClose} severity="success">
          {taskMessage}
        </MuiAlert>
      </Snackbar>
      <Snackbar open={taskError} autoHideDuration={6000} onClose={handleClose}>
        <MuiAlert onClose={handleClose} severity="error">
          {taskMessage}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
};

export default AddTaskPage;
