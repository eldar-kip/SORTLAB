import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { LaboratoryPage } from './pages/LaboratoryPage';
import { AlgorithmsPage } from './pages/AlgorithmsPage';
import { AlgorithmDetailPage } from './pages/AlgorithmDetailPage';
import { ComparisonPage } from './pages/ComparisonPage';
import { TheoryPage } from './pages/TheoryPage';
import { PracticePage } from './pages/PracticePage';
import { QuizPage } from './pages/QuizPage';
import { AboutPage } from './pages/AboutPage';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-[#0B0D12] text-[#F3F4F6] overflow-x-hidden">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/lab" element={<LaboratoryPage />} />
            <Route path="/algorithms" element={<AlgorithmsPage />} />
            <Route path="/algorithms/:id" element={<AlgorithmDetailPage />} />
            <Route path="/comparison" element={<ComparisonPage />} />
            <Route path="/theory" element={<TheoryPage />} />
            <Route path="/practice" element={<PracticePage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;

