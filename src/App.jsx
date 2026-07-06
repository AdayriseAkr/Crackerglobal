import React, { useState } from 'react'
import './App.css'
import {  Route, Routes , useLocation } from 'react-router-dom'
import HeroSection from './Components/HeroSection/HeroSection'
import LiquidNav from './Components/LiquidNav/LiquidNav'
import CrackerLoading from './Components/CrackerLoading/CrackerLoading'
import CrackerLoading2 from './Components/CrackerLoading/CrackerLoading2'
import MainFeature from './Components/MainFeature/MainFeature'
import RobotScene from './Components/Robo3d/Robo3D'
import RobotHeadTest from './Components/Robo3d/RobotTest'
import AiBot from './Components/AiBot/Aibot'
import TopNav from './Components/NavBar/TopNav'
import RoboFix from './Components/Robo3d/RoboFix'
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
          <Route path='/contact' element={<RoboFix />} />
        </Routes>
        <Footer />
    {/* <AiBot /> */}
    </>
  )
}

export default App
