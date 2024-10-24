import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Snackbar } from '@mui/material';
import { useMutation, gql } from '@apollo/client';
import MuiAlert from '@mui/material/Alert';

const USER_REGISTER = gql`
 mutation($username: String!, $fullname: String!, $password: String!, $email: String!, $role: String!){
  userRegister(username: $username, fullname: $fullname, password: $password, email: $email, role: $role) {
    fullname
    username
    role
  }
}
`;

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [fullname, setFullname] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [registerError, setRegisterError] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registerMessage, setRegisterMessage] = useState('');

  const [userRegister] = useMutation(USER_REGISTER, {
    onCompleted: (data) => {
      setRegisterSuccess(true);
      setRegisterMessage(`Registration successful! Welcome ${data.userRegister.username}`);
    },
    onError: (error) => {
      setRegisterError(true);
      setRegisterMessage(error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    userRegister({ variables: { username, password, email, role, fullname } });
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setRegisterError(false);
    setRegisterSuccess(false);
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" gutterBottom>
        Register
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
          label="Full Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
        />
        <TextField
          label="Password"
         
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Role"
          variant="outlined"
          fullWidth
          margin="normal"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Register
        </Button>
      </form>
      <Snackbar open={registerError} autoHideDuration={6000} onClose={handleClose}>
        <MuiAlert onClose={handleClose} severity="error">
          {registerMessage}
        </MuiAlert>
      </Snackbar>
      <Snackbar open={registerSuccess} autoHideDuration={6000} onClose={handleClose}>
        <MuiAlert onClose={handleClose} severity="success">
          {registerMessage}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
};

export default RegisterPage;
