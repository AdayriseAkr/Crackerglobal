import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import SmoothScrollProvider from "./Components/Lenis.jsx"
createRoot(document.getElementById('root')).render(

   <BrowserRouter>
      <SmoothScrollProvider>
         <App />
      </SmoothScrollProvider>
    </BrowserRouter>
  
)
