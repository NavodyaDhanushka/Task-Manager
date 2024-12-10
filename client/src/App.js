import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from './pages/MainPage';

function App() {
  return (
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<MainPage />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
