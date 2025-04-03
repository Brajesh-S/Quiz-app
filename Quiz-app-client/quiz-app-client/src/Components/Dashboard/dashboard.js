import React, { useState, useRef, useEffect } from "react";
import Quizzes from "../Quiz/Quizzes";
import "./dashboard.css";

const Dashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const sidebarRef = useRef(null);
  const menuToggleRef = useRef(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuOpen &&
        sidebarRef.current &&
        menuToggleRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !menuToggleRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div className="quiz-app">
      <div className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`} ref={sidebarRef}>
        <h1 className="logo">Øendo</h1>
        <div className="menu-item">
          <span className="icon">⊞</span>
          Tests
        </div>
      </div>
      <div className="mobile-header">
        <div className="menu-toggle" onClick={toggleMenu} ref={menuToggleRef}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <h1 className="mobile-logo">Øendo</h1>
      </div>
      <div className="main-content">
        <div className="header-div">
          <h2>Quizzes for you!</h2>
        </div>
        <div className="quizzes-container">
          <Quizzes />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;