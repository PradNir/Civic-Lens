import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import SubmitReport from './pages/SubmitReport';
import TrackReport from './pages/TrackReport';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report" element={<SubmitReport />} />
        <Route path="/track" element={<TrackReport />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
