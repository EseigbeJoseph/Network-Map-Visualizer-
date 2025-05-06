import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const appVersion = "v1.0.0";

    const handleLogin = (e) => {
        e.preventDefault();

        if (username === "admin" && password === "secure123") {
            localStorage.setItem("authenticated", "true");
            onLogin(); 
            navigate("/home", { replace: true });
        } else {
            alert("Invalid credentials");
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <h2>Login</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
                <p className="app-version">App Version: {appVersion}</p>
            </form>
        </div>
    );
};

export default Login;
