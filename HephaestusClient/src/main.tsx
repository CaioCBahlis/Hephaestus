import { createRoot } from 'react-dom/client'
import './index.css'

import { BrowserRouter, Routes, Route } from "react-router";
import Home from './pages/Home';
import Login from './pages/Login';

createRoot(document.getElementById('root')!).render(

    <BrowserRouter>
      <Routes>

          <Route path="/" element={<Home/>} />

          <Route path="/app" element={<Home/>} />

          <Route path="/login" element={<Login/>} />

      </Routes>
   </BrowserRouter>
    

)
