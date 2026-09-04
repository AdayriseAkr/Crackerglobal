import React, { lazy, Suspense, useState } from 'react'
import './App.css'
import {  Route, Routes , useLocation } from 'react-router-dom'
import HeroSection from './Components/HeroSection/HeroSection'
import LiquidNav from './Components/LiquidNav/LiquidNav'
import CrackerLoading2 from './Components/CrackerLoading/CrackerLoading2'
import TopNav from './Components/NavBar/TopNav'
// Its own chunk - see the note in Footer.jsx. This route is the only other
// place the robot appears.
const RoboFix = lazy(() => import('./Components/Robo3d/RoboFix'))
import Footer from './Components/Footer/Footer'




function App() {
  const [loaded, setLoaded] = useState(false)
   const location = useLocation();
  const isHome = location.pathname === "/";
  function handleLoad() {
    setLoaded(true)
  }

  return (
    <>
      
        
       {isHome ? (
        loaded && <><LiquidNav />
      <TopNav /></>
      ) : (
       <><LiquidNav />
      <TopNav /></>
      )}
        <Routes>
          <Route path='/' element={<HeroSection loadProp={handleLoad} />} />
          <Route path='/blogs' element={<CrackerLoading2 />} />
          <Route path='/contact' element={<Suspense fallback={null}><RoboFix /></Suspense>} />
        </Routes>
        <Footer />
    {/* <AiBot /> */}
    </>
  )
}

export default App
