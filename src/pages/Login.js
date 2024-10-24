import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Snackbar } from '@mui/material';
import { useMutation, gql } from '@apollo/client';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// GraphQL mutation for user login
const USER_LOGIN = gql`
  mutation UserLogin($username: String!, $password: String!) {
    userLogin(username: $username, password: $password) {
      token
      user {
        _id
        username
        fullname
        role
      }
    }
  }
`;

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');

  const navigate = useNavigate(); // Initialize the navigate hook

  const [userLogin] = useMutation(USER_LOGIN, {
    onCompleted: (data) => {
      const { token, user } = data.userLogin;
      localStorage.setItem('token', token);  // Store token
      localStorage.setItem('user', JSON.stringify(user));  // Store user info including role
      console.log("Token stored:", localStorage.getItem('token'));
      setLoginSuccess(true);
      setLoginMessage('Login successful!');
      
      // Redirect to home page after successful login
      navigate('/'); // Programmatically navigate to home page
    },
    onError: (error) => {
      setLoginError(true);
      setLoginMessage(error.message);
    },
  });
  

  const handleSubmit = (e) => {
    e.preventDefault();
    userLogin({ variables: { username, password } });
    
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setLoginError(false);
    setLoginSuccess(false);
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
      </form>
      <Snackbar open={loginError} autoHideDuration={6000} onClose={handleClose}>
        <MuiAlert onClose={handleClose} severity="error">
          {loginMessage}
        </MuiAlert>
      </Snackbar>
      <Snackbar open={loginSuccess} autoHideDuration={6000} onClose={handleClose}>
        <MuiAlert onClose={handleClose} severity="success">
          {loginMessage}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
};

export default LoginPage;
