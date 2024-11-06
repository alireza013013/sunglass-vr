import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home';

const Login = () => {
  return (
    <div>
      Test Page
    </div>
  )
}

const Dashboard = () => {
  return (
    <div>
      a
    </div>
  )
}

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Login />} />
          <Route path="idglass" element={<Dashboard />} />
          {/* <Route path="idglass" element={<Home />} />
          <Route path=":idglass" element={<Home />} /> */}
        </Route>
        {/* <Route path="/home" element={<Dashboard />}>
          <Route index path=":idglass" element={<Home />} />
        </Route> */}
        {/* <Route path="/home/:idglass" element={<Home />} /> */}
        {/* <Route path="/home/:idglass">
          <Route index element={<Home />} />
        </Route> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;