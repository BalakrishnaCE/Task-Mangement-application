import React, { useState } from "react";
import {
  Box,
  Card,
  Typography,
  MenuItem,
  Select,
  List,
  ListItemText,
  Divider,
  ListItemButton,
  Button,
} from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useQuery, useMutation, gql } from "@apollo/client";

// GraphQL query to get tasks
const GET_TASKS = gql`
  query GetTasks {
    taskMany {
      _id
      title
      description
      assignedTo
      dueDate
      status
    }
  }
`;

// GraphQL query to get the current user
const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    currentUser {
      _id
      username
      role
    }
  }
`;

// GraphQL mutation to update task status
const UPDATE_TASK = gql`
  mutation TaskUpdate($id: MongoID!, $status: String!) {
    taskUpdate(_id: $id, status: $status) {
      _id
      status
    }
  }
`;

const COLORS = ["#FFA500", "#1E90FF", "#008000"];

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("pending");
  const [taskEdits, setTaskEdits] = useState({}); // Track task changes

  // Fetch tasks from the database
  const { data: tasksData, loading: loadingTasks, error: errorTasks } = useQuery(GET_TASKS);
  // Fetch current user information
  const { data: userData, loading: loadingUser, error: errorUser } = useQuery(GET_CURRENT_USER);

  const [updateTask] = useMutation(UPDATE_TASK, {
    onCompleted: () => {
      console.log("Task updated successfully!");
    },
    onError: (error) => {
      console.error("Error updating task:", error);
    },
  });

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleStatusChange = (taskId, newStatus) => {
    setTaskEdits((prevEdits) => ({
      ...prevEdits,
      [taskId]: newStatus, // Store updated status for the task
    }));
  };

  const handleSave = (taskId) => {
    if (taskEdits[taskId]) {
      updateTask({
        variables: {
          id: taskId,
          status: taskEdits[taskId],
        },
      });
    }
  };

  // Prepare data for the Pie Chart
  const taskSummary = tasksData ? [
    { name: "Pending", value: tasksData.taskMany.filter(task => task.status === "Pending" && task.assignedTo).length },
    { name: "In progress", value: tasksData.taskMany.filter(task => task.status === "In_progress" && task.assignedTo).length },
    { name: "Completed", value: tasksData.taskMany.filter(task => task.status === "Completed" && task.assignedTo).length },
  ] : [];

  const TaskDetails = ({ task }) => (
    <Card sx={{ mb: 2, p: 2 }}>
      <Typography variant="h6">{task.title}</Typography>
      <Typography variant="body2" color="text.secondary">{task.description}</Typography>
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
        <Typography variant="body2">Due Date: {task.dueDate}</Typography>
        <Select
          value={taskEdits[task._id] || task.status}
          sx={{ width: 120 }}
          onChange={(e) => handleStatusChange(task._id, e.target.value)}
        >
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="In_progress">In progress</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
        </Select>
        {taskEdits[task._id] && taskEdits[task._id] !== task.status && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleSave(task._id)}
            sx={{ ml: 2 }}
          >
            Save
          </Button>
        )}
      </Box>
    </Card>
  );

  const filterTasks = (status) => 
    tasksData?.taskMany.filter((task) => task.status === status && task.assignedTo) || [];

  if (loadingTasks || loadingUser) return <p>Loading...</p>;
  if (errorTasks) return <p>Error loading tasks: {errorTasks.message}</p>;
  if (errorUser) return <p>Error loading user: {errorUser.message}</p>;

  // Determine user's role
  const userRole = userData?.currentUser?.role;

  // Filter tasks based on user role
  const userTasks = userRole === "admin"
    ? tasksData.taskMany // Admin can see all tasks
    : tasksData.taskMany.filter(task => task.assignedTo === userData.currentUser._id); // Regular user sees only assigned tasks

  return (
    <Box p={3} display="flex">
      <Box sx={{ width: "30%" }}>
        <PieChart width={300} height={200}>
          <Pie
            data={taskSummary}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {taskSummary.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>

        <List component="nav">
          <ListItemButton
            selected={selectedCategory === "pending"}
            onClick={() => handleCategoryClick("pending")}
            sx={{
              backgroundColor: selectedCategory === "pending" ? "rgba(255,165,0,0.2)" : "transparent",
              "&:hover": { backgroundColor: "rgba(255,165,0,0.2)" },
            }}
          >
            <ListItemText primary={`Pending (${filterTasks("Pending").length})`} />
          </ListItemButton>
          <Divider />

          <ListItemButton
            selected={selectedCategory === "inProgress"}
            onClick={() => handleCategoryClick("inProgress")}
            sx={{
              backgroundColor: selectedCategory === "inProgress" ? "rgba(30,144,255,0.2)" : "transparent",
              "&:hover": { backgroundColor: "rgba(30,144,255,0.2)" },
            }}
          >
            <ListItemText primary={`In progress (${filterTasks("In_progress").length})`} />
          </ListItemButton>
          <Divider />

          <ListItemButton
            selected={selectedCategory === "completed"}
            onClick={() => handleCategoryClick("completed")}
            sx={{
              backgroundColor: selectedCategory === "completed" ? "rgba(0,128,0,0.2)" : "transparent",
              "&:hover": { backgroundColor: "rgba(0,128,0,0.2)" },
            }}
          >
            <ListItemText primary={`Completed (${filterTasks("Completed").length})`} />
          </ListItemButton>
          <Divider />
        </List>
      </Box>

      <Box sx={{ width: "70%", pl: 3 }}>
        {selectedCategory === "pending" && filterTasks("Pending").map((task) => <TaskDetails key={task._id} task={task} />)}
        {selectedCategory === "inProgress" && filterTasks("In_progress").map((task) => <TaskDetails key={task._id} task={task} />)}
        {selectedCategory === "completed" && filterTasks("Completed").map((task) => <TaskDetails key={task._id} task={task} />)}
      </Box>
    </Box>
  );
};

export default Home;
