import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import LandingLayout from './components/layouts/landing/LandingLayout';
import AboutPage from './pages/landing/about/page';
import BlogPage from './pages/landing/blog/page';
import ContactPage from './pages/landing/contact/page';
import HomePage from './pages/landing/home/page';
import ProjectPage from './pages/landing/projects/page';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LandingLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectPage />} />
          <Route path="/projects/:id" element={<ProjectPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
