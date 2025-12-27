import { createRoot } from 'react-dom/client'
import './index.css'

import { BrowserRouter, Routes, Route } from "react-router";
import Home from './pages/Home';
import Login from './pages/Login';
import Chatbot from './pages/Chatbot';
import Register from './pages/Register';
import { Flip, ToastContainer} from 'react-toastify';

createRoot(document.getElementById('root')!).render(

    <BrowserRouter>
      <ToastContainer
          position="top-center"
          autoClose={5000}
          limit={3}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          transition={Flip}
        />
      <Routes>

          <Route path="/" element={<Home/>} />

          <Route path="/chatbot" element={<Chatbot/>} />

          <Route path="/login" element={<Login/>} />

           <Route path="/register" element={<Register/>}/>

           </Routes>
   </BrowserRouter>
    

)
