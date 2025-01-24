import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

function App() {
  // State variables for input fields
  const [username, setUsername] = useState(""); // Tracks the username input
  const [email, setEmail] = useState(""); // Tracks the email input (only for signup)
  const [password, setPassword] = useState(""); // Tracks the password input
  const [isLogin, setIsLogin] = useState(true); // Tracks if the user is in login or signup mode
  const [token, setToken] = useState(localStorage.getItem("token")); // Gets the stored token from local storage (if any)
  const [message, setMessage] = useState(""); // Tracks messages to display to the user (success or error)

  // Handles form submission for login or signup
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents default form submission behavior

    try {
      // Determine the endpoint based on whether the user is logging in or signing up
      const endpoint = isLogin ? "/login" : "/signup";

      // Create the payload to send to the server
      const payload = isLogin
        ? { username, password } // Login requires only username and password
        : { username, email, password }; // Signup requires username, email, and password

      // Send a POST request to the server with the payload
      const response = await axios.post(
        `http://localhost:5000${endpoint}`,
        payload
      );

      // If successful, store the returned token in local storage and update the state
      localStorage.setItem("token", response.data.token);
      setToken(response.data.token);

      // Set a success message
      setMessage(isLogin ? "Login successful!" : "Signup successful!");
    } catch (error) {
      // Handle errors and display an error message
      setMessage(error.response?.data?.message || "Operation failed");
    }
  };

  // Fetches protected data from the server after the user logs in
  const fetchProtectedData = async () => {
    try {
      // Send a GET request with the token in the Authorization header
      const response = await axios.get("http://localhost:5000/protected", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Display the message returned from the server
      setMessage(response.data.message);
    } catch (error) {
      // Handle errors and display a failure message
      setMessage("Failed to fetch data");
    }
  };

  // Handles user logout
  const handleLogout = () => {
    // Remove the token from local storage
    localStorage.removeItem("token");

    // Clear the token from the state
    setToken(null);
  };

  return (
    <div>
      {/* If the user is not logged in, display the login or signup form */}
      {!token ? (
        <form onSubmit={handleSubmit}>
          <h2>{isLogin ? "Login" : "Sign Up"}</h2>

          {/* Input for username */}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />

          {/* Input for email (only visible in signup mode) */}
          {!isLogin && (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          )}

          {/* Input for password */}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />

          {/* Button to submit the form */}
          <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>

          {/* Toggle link to switch between login and signup */}
          <p onClick={() => setIsLogin(!isLogin)}>
            {isLogin
              ? "Need an account? Sign Up"
              : "Already have an account? Login"}
          </p>
        </form>
      ) : (
        // If the user is logged in, display options to fetch data or logout
        <div>
          <p>Logged In</p>

          {/* Button to fetch protected data */}
          <button onClick={fetchProtectedData}>Fetch Protected Data</button>

          {/* Button to log out */}
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}

      {/* Display any success or error message */}
      {message && <p>{toast(message)}</p>}
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default App;
