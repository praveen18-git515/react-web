import { useState } from "react";
import { Volume2 } from "lucide-react";
import bikes from "../data/bikes";
import { useAudioEngine } from "../audio/audioEngine";
import BikeSoundPlayer from "./BikeSoundPlayer";
import SoundVisualizer from "./SoundVisualizer";
import PhotoCredit from "./PhotoCredit";

export default function SoundComparison() {
  const firstDefault = bikes[0];
  const secondDefault = bikes.find((bike)=>bike.fuel==="Electric");
  const [firstId,setFirstId]=useState(firstDefault.id);
  const [secondId,setSecondId]=useState(secondDefault.id);
  const { bikeId,running,throttle,volume,setVolume }=useAudioEngine();
  const selected=[bikes.find((bike)=>bike.id===firstId),bikes.find((bike)=>bike.id===secondId)];

  return <section className="sound-comparison">
    <div className="section-heading"><div><p className="eyebrow">LISTEN & COMPARE</p><h2>Hear the Difference</h2><p className="sound-comparison-intro">Compare generated sound profiles. Only one simulation plays at a time.</p></div><label className="comparison-volume"><Volume2 size={17}/><input aria-label="Comparison audio volume" type="range" min="0" max="1" step=".01" value={volume} onChange={(event)=>setVolume(event.target.value)}/></label></div>
    <div className="sound-compare-grid">{selected.map((bike,index)=>{
      const active=running&&bikeId===bike.id;
      return <article className={`sound-compare-card ${active?"active":""}`} key={index}>
        <div className="sound-compare-image"><img src={bike.image} alt={bike.imageCredit ? `${bike.brand} ${bike.name}` : `Model photo unavailable for ${bike.brand} ${bike.name}`}/><span>{bike.fuel==="Electric"?"ELECTRIC":"PETROL"}</span><PhotoCredit bike={bike}/></div>
        <div className="sound-compare-info"><label>{index===0?"MOTORCYCLE A":"MOTORCYCLE B"}<select value={bike.id} onChange={(event)=>index===0?setFirstId(event.target.value):setSecondId(event.target.value)}>{bikes.map((option)=><option key={option.id} value={option.id}>{option.brand} {option.name}</option>)}</select></label><div className="sound-compare-meta"><strong>{bike.brand} {bike.name}</strong><span>{bike.engine==="N/A"?"Electric motor":bike.engine+" / petrol"}</span></div><div className="sound-compare-play"><BikeSoundPlayer bike={bike}/><SoundVisualizer active={active} throttle={throttle}/></div><small>{active?"SIMULATED SOUND PLAYING":"SIMULATION READY"} · No authentic sample</small></div>
      </article>;
    })}</div>
  </section>;
}
