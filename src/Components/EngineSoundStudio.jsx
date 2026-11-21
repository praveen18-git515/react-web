import { useEffect, useRef } from "react";
import { AudioLines, Power, Volume2, VolumeX, Zap } from "lucide-react";
import { useAudioEngine } from "../audio/audioEngine";
import RPMGauge from "./RPMGauge";
import SoundVisualizer from "./SoundVisualizer";

export default function EngineSoundStudio({ bike }) {
  const { bikeId, running, starting, throttle, muted, volume, error, startBikeSound, stopBikeSound, setThrottle, revBikeSound, setMuted, setVolume } = useAudioEngine();
  const active = running && bikeId === bike.id;
  const electric = bike.fuel === "Electric";
  const revTimer = useRef(null);
  const engineName = electric ? "Electric motor" : "Combustion engine";

  useEffect(() => () => window.clearTimeout(revTimer.current), []);

  function start() {
    if (!active) startBikeSound(bike);
  }

  function rev() {
    if (!active) return;
    revBikeSound();
  }

  return <section className={`sound-studio ${active?"is-active":""} ${electric?"is-electric":""}`}>
    <div className="studio-heading"><div><p className="eyebrow"><AudioLines size={14}/> RIDEVERSE SOUND STUDIO</p><h2>Hear the <em>machine.</em></h2><p>{bike.brand} {bike.name} / {engineName}</p></div><span className="simulated-badge">BROWSER SIMULATION</span></div>
    <div className="studio-dashboard">
      <div className="studio-gauge"><RPMGauge throttle={throttle} running={active} electric={electric}/><span className={`engine-status ${active?"on":""}`}><i/>{active?(starting?"START SEQUENCE":throttle>.25?"REV SIMULATION":"RUNNING — SIMULATED"):"ENGINE OFF"}</span></div>
      <div className="studio-controls">
        <div className="studio-visual"><div className="visual-caption"><span>{active?"SIGNAL ACTIVE":"SIGNAL STANDBY"}</span><span>{active?`${Math.round(throttle*100)}% THROTTLE`:"NO AUDIO"}</span></div><SoundVisualizer active={active} throttle={throttle}/></div>
        <label className="throttle-control"><span><strong>Throttle</strong><small>SIMULATED OUTPUT</small></span><input type="range" min="0" max="1" step=".01" value={active?throttle:0} disabled={!active} onChange={(event)=>setThrottle(event.target.value)} aria-label="Simulated throttle control"/><b>{active?`${Math.round(throttle*100)}%`:"—"}</b></label>
        <div className="studio-buttons"><button className={`engine-start ${active?"started":""}`} onClick={start} disabled={active}><Power size={18}/>{active?"Engine Running":"Start Engine"}</button><button className="rev-button" onClick={rev} disabled={!active}><Zap size={17}/> Rev Engine</button><button className="engine-stop" onClick={stopBikeSound} disabled={!active}>Stop</button></div>
        <div className="volume-control"><button aria-label={muted?"Unmute":"Mute"} onClick={()=>setMuted(!muted)}>{muted?<VolumeX size={18}/>:<Volume2 size={18}/>}</button><input type="range" min="0" max="1" step=".01" value={volume} onChange={(event)=>setVolume(event.target.value)} aria-label="Simulation volume"/><span>{Math.round(volume*100)}%</span></div>
        {error&&<p className="audio-error" role="alert">{error}</p>}
      </div>
    </div>
    <p className="sound-disclaimer">{bike.audio?.attribution || "Sound sample unavailable."} Change models to hear a distinct generated profile. No authentic recordings are currently supplied.</p>
  </section>;
}
