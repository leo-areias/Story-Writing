import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { StoryViewer } from './pages/StoryViewer';
import { StoryDetail } from './pages/StoryDetail';
import { StoryReader } from './pages/StoryReader';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/story/:id" element={<StoryViewer />} />
          <Route path="/stories/:id" element={<StoryDetail />} />
          <Route path="/stories/:id/read" element={<StoryReader />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;