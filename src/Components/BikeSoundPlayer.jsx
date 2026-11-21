import { Pause, Play, Zap } from "lucide-react";
import { useAudioEngine } from "../audio/audioEngine";

export default function BikeSoundPlayer({ bike, compact=false }) {
  const { bikeId, running, startBikeSound, stopBikeSound } = useAudioEngine();
  const active = running && bikeId === bike.id;
  const electric = bike.fuel === "Electric";
  const action = () => active ? stopBikeSound() : startBikeSound(bike);
  return <button type="button" className={`sound-play-button ${compact?"compact":""} ${active?"playing":""}`} onClick={action} aria-label={`${active?"Stop":"Play"} simulated ${electric?"electric motor":"engine"} sound for ${bike.brand} ${bike.name}`} title={bike.audio?.attribution}>
    {active?<Pause size={compact?15:17}/>:electric?<Zap size={compact?15:17}/>:<Play size={compact?15:17}/>}
    {!compact&&<span>{active?"Stop sound":"Hear sound"}</span>}
  </button>;
}
