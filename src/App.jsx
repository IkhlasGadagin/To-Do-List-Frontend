import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Select,
  MenuItem,
} from "@mui/material";

const BASE_URL = "http://localhost:5513/apiv1/todo"; // Make sure this matches your backend
//VITE_BACKEND_APP_URL=http://localhost:8001/api/v1


const App = () => {
  const [todos, setTodos] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "pending",
    remarks: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch all todos
  const fetchTodos = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/getalltodos`);
      setTodos(res.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Handle create/update
  const handleSubmit = async () => {
    try {
      if (editingId) {
        await axios.put(`${BASE_URL}/${editingId}`, form);
        setEditingId(null);
      } else {
        await axios.post(`${BASE_URL}/create`, form);
      }

      setForm({
        title: "",
        description: "",
        dueDate: "",
        status: "pending",
        remarks: "",
      });

      fetchTodos();
    } catch (error) {
      console.error("Error saving todo:", error);
    }
  };

  // Set form for editing
  const handleEdit = (todo) => {
    setForm({
      title: todo.title,
      description: todo.description,
      dueDate: todo.dueDate?.split("T")[0],
      status: todo.status,
      remarks: todo.remarks,
    });
    setEditingId(todo._id);
  };

  // Delete todo
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      fetchTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        To-Do List Manager
      </Typography>

      {/* Form */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <TextField
          label="Title"
          fullWidth
          margin="normal"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <TextField
          label="Description"
          fullWidth
          margin="normal"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <TextField
          label="Due Date"
          type="date"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={form.dueDate}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
        />
        <Select
          fullWidth
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          displayEmpty
          sx={{ my: 2 }}
        >
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="in-progress">In Progress</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
        </Select>
        <TextField
          label="Remarks"
          fullWidth
          margin="normal"
          value={form.remarks}
          onChange={(e) => setForm({ ...form, remarks: e.target.value })}
        />
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {editingId ? "Update Todo" : "Add Todo"}
        </Button>
      </Paper>

      {/* Display Todos */}
      {todos.map((todo) => (
        <Paper key={todo._id} sx={{ mb: 2, p: 2 }}>
          <Typography variant="h6">{todo.title}</Typography>
          <Typography>{todo.description}</Typography>
          <Typography>
            Due: {new Date(todo.dueDate).toLocaleDateString()}
          </Typography>
          <Typography>Status: {todo.status}</Typography>
          <Typography>Remarks: {todo.remarks}</Typography>
          <Box mt={1}>
            <Button
              onClick={() => handleEdit(todo)}
              size="small"
              variant="outlined"
              sx={{ mr: 1 }}
            >
              Edit
            </Button>
            <Button
              onClick={() => handleDelete(todo._id)}
              size="small"
              color="error"
              variant="outlined"
            >
              Delete
            </Button>
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

export default App;
