import React, { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, IconButton, Avatar, Menu, MenuItem } from "@mui/material";

const Layout = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Fetch the logged-in user information from localStorage
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser)); 
      console.log(currentUser) 
    }
  }, []);

  // Handle opening/closing of the menu
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Clear user information and tokens on logout
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    handleClose();
    window.location.href = "/login";  // Redirect to login page
  };

  

  // Safely handle user avatar, providing a fallback letter
  const avatarLetter = currentUser?.fullname?.charAt(0).toUpperCase() || "U";

  // Determine if the current user is an admin
  const isAdmin = currentUser?.role === "admin";

  return (
    <>
      <AppBar position="static" style={{ background: "#333" }}>
        <Toolbar>
          {/* Left Side: Task Management */}
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            <Link to="/" style={{ color: "white", textDecoration: "none" }}>
              Task Management
            </Link>
          </Typography>

          {/* Right Side: Profile Icon */}
          {currentUser && (
            <IconButton color="inherit" onClick={handleClick}>
              <Avatar>{avatarLetter}</Avatar>
            </IconButton>
          )}

          {/* Dropdown Menu for Profile Options */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {isAdmin ? [
              <MenuItem key="register" onClick={handleClose}>
                <Link to="/register-user" style={{ textDecoration: "none", color: "inherit" }}>
                  Register a user
                </Link>
              </MenuItem>,
              <MenuItem key="add-task" onClick={handleClose}>
                <Link to="/add-task" style={{ textDecoration: "none", color: "inherit" }}>
                  Add task
                </Link>
              </MenuItem>
            ] : null}
            <MenuItem key="logout" onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Main content from routing */}
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
