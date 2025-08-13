import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Study from './pages/Study';
import MockExam from './pages/MockExam';
import Progress from './pages/Progress';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/study" element={<Study />} />
            <Route path="/mock-exam" element={<MockExam />} />
            <Route path="/progress" element={<Progress />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
