import React, {useState, useEffect} from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, Link, useNavigate} from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./i18n";
import Home from "./Home";
import NetworkMap from "./NetworkMap";
import SwitchInterface from "./SwitchInterface";
import Login from "./Login";
import logoImage from "./Cumucore Logo v3.png";
import "./App.css";

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(
        localStorage.getItem("authenticated") === "true"
    );
    useEffect(() => {
        const checkAuth = () => {
            setIsAuthenticated(localStorage.getItem("authenticated") === "true");
        };

        window.addEventListener("storage", checkAuth); 
        return () => window.removeEventListener("storage", checkAuth);
    }, []);

    return (
        <Router>
            <Routes>
            <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
            <Route path="*" element={isAuthenticated ? <MainApp onLogout={() => setIsAuthenticated(false)} /> : <Navigate to="/login" />} />
            </Routes>
        </Router>
    );
};

const MainApp = () => {
    const { t } = useTranslation();

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("authenticated");
        navigate("/login", { replace: true }); 
    };

    return (
        <div className="app-container">
            <div className="sidebar">
                <div className="logo">
                    <img alt="Logo" className="logo-image" src={logoImage} />
                </div>
                <nav>
                    <Link to="/home">{t("Home")}</Link>
                    <Link to="/network-map">{t("Network Map")}</Link>
                    <Link to="/switch-interface">{t("Switch Interfaces")}</Link>
                </nav>
                <div className="logout-container">
                    <button className="logout-button" onClick={handleLogout}>Logout</button>
                </div>

                <div className="footer">© 2024 All rights reserved</div>
            </div>

            <main>
                <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/network-map" element={<NetworkMap />} />
                    <Route path="/switch-interface" element={<SwitchInterface />} />
                    <Route path="*" element={<Navigate to="/home" />} />
                </Routes>
            </main>
        </div>
    );
};

export default App;
