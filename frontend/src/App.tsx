import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import LandingLayout from './components/layouts/landing/LandingLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LandingLayout />}>
          <Route path="/" element={<div>Home page</div>} />
          <Route path="/about" element={<div>About page</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
