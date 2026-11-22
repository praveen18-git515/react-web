import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import "./App.css";
import { StoreProvider, useStore } from "./context/StoreContext";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Home from "./pages/Home";
import Bikes from "./pages/Bikes";
import BikeDetails from "./pages/BikeDetails";
import Brands from "./pages/Brands";
import Compare from "./pages/Compare";
import Wishlist from "./pages/Wishlist";
import Customize from "./pages/Customize";
import TestRide from "./pages/TestRide";
import PurchaseEnquiry from "./pages/PurchaseEnquiry";
import EMICalculator from "./pages/EMICalculator";
import NotFound from "./pages/NotFound";
import { stopBikeSound } from "./audio/audioEngine";
import "./Sound.css";

function AppShell() {
  const location = useLocation();
  const [progress,setProgress]=useState(0);
  const [showTop,setShowTop]=useState(false);
  const { toast } = useStore();

  useEffect(() => {
    stopBikeSound();
    window.scrollTo({top:0,behavior:"smooth"});
  }, [location.pathname]);

  useEffect(() => {
    const update=()=>{const scrollable=document.documentElement.scrollHeight-window.innerHeight;setProgress(scrollable>0?window.scrollY/scrollable*100:0);setShowTop(window.scrollY>700);};
    update();window.addEventListener("scroll",update,{passive:true});return()=>window.removeEventListener("scroll",update);
  }, []);

  return (
    <div className="app">
      <div className="scroll-progress" style={{width:`${progress}%`}}/>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/bikes" element={<Bikes/>}/>
        <Route path="/bikes/:id" element={<BikeDetails/>}/>
        <Route path="/brands" element={<Brands/>}/>
        <Route path="/compare" element={<Compare/>}/>
        <Route path="/wishlist" element={<Wishlist/>}/>
        <Route path="/customize" element={<Customize/>}/>
        <Route path="/test-ride" element={<TestRide/>}/>
        <Route path="/purchase-enquiry" element={<PurchaseEnquiry/>}/>
        <Route path="/emi-calculator" element={<EMICalculator/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
      <Footer/>
      {showTop&&<button className="back-top" aria-label="Back to top" onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}><ArrowUp/></button>}
      {toast&&<div className="toast" role="status">{toast}</div>}
    </div>
  );
}

export default function App(){return <StoreProvider><AppShell/></StoreProvider>;}
