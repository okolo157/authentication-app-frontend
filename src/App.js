import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });
      localStorage.setItem("token", response.data.token);
      onLoginSuccess(response.data.token);
      toast.success("Login successful!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}

function Signup({ onSignupSuccess }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/signup", {
        username,
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      onSignupSuccess(response.data.token);
      toast.success("Signup successful!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <h2>Sign Up</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Sign Up</button>
    </form>
  );
}

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLoginView, setIsLoginView] = useState(true);
  const [message, setMessage] = useState("");

  const fetchProtectedData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/protected", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Failed to fetch data");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <div>
      {!token ? (
        <div>
          {isLoginView ? (
            <Login onLoginSuccess={setToken} />
          ) : (
            <Signup onSignupSuccess={setToken} />
          )}
          <p onClick={() => setIsLoginView(!isLoginView)}>
            {isLoginView
              ? "Need an account? Sign Up"
              : "Already have an account? Login"}
          </p>
        </div>
      ) : (
        <div>
          <p>Logged In</p>
          <button onClick={fetchProtectedData}>Fetch Protected Data</button>
          <button onClick={handleLogout}>Logout</button>
          {message && <p>{message}</p>}
        </div>
      )}
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default App;
