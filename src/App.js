import React from 'react';
import Home from './components/Home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Books from './components/Books';
import Houses from './components/Houses';
import Characters from './components/Characters';
import CharaPage from './components/CharaPage';
import BookPage from './components/BookPage';
import HousePage from './components/HousePage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<Books />} />
        <Route path="/book/:id" element={<BookPage />} />
        <Route path="/houses" element={<Houses />} />
        <Route path="/house/:id" element={<HousePage />} />
        <Route path="/characters" element={<Characters />} />
        <Route path="/character/:id" element={<CharaPage />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;