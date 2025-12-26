import { createRoot } from 'react-dom/client'
import './index.css'

import { BrowserRouter, Routes, Route } from "react-router";
import Home from './pages/Home';
import Login from './pages/Login';
import Chatbot from './pages/Chatbot';
import Register from './pages/Register';

createRoot(document.getElementById('root')!).render(

    <BrowserRouter>
      <Routes>

          <Route path="/" element={<Home/>} />

          <Route path="/chatbot" element={<Chatbot/>} />

          <Route path="/login" element={<Login/>} />

           <Route path="/register" element={<Register/>}/>

           </Routes>
   </BrowserRouter>
    

)
