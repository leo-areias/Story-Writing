import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { StoryDetail } from './pages/StoryDetail';
import { StoryReader } from './pages/StoryReader';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/stories/:id" element={<StoryDetail />} />
          <Route path="/stories/:id/read" element={<StoryReader />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;