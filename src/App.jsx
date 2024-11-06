import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home/:idglass">
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;