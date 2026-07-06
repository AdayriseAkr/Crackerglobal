import { useState , useRef, useEffect } from "react";
import Logo from "../../assets/Logo.png"
import "./CrackerLoading.css";
export default function CrackerLoading() {
   
    const [loaderInterval, setLoaderInterval] = useState(0);

useEffect(() => {
const interval = setInterval(() => {
    setLoaderInterval((prev) => {
        if (prev >= 100) {
            clearInterval(interval);
            return 100;
        }
        return prev + 1;
    });

}, 50);
return () => clearInterval(interval);


},[])
    

   

    
  return (
    <div className="CrackerLoadingParent">
        <img src={Logo} alt="LogoLoader" />

        <div style={loaderInterval === 100 ?{height:"100vh",borderRadius:"0px"} : {}} className="loader">
            <div style={{width:`${loaderInterval + 10}%` , backgroundColor:loaderInterval === 100 ?"#E8E7F2" : "" } } className="innerMover">

            </div>
        </div>
        </div>
  );
}