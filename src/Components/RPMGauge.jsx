const TICK_COUNT = 29;

export default function RPMGauge({ throttle, running, electric }) {
  const maximum = electric ? 12000 : 14000;
  const value = running ? Math.round((electric ? 900 : 900) + throttle * (maximum - 900)) : 0;
  const angle = -135 + (running ? throttle * 270 : 0);

  return <div className={`rpm-gauge ${running ? "running" : ""} ${electric ? "electric" : ""}`} role="img" aria-label={`${running ? value.toLocaleString("en-US") : 0} simulated RPM`}>
    <svg viewBox="0 0 220 220" aria-hidden="true">
      <circle className="gauge-track" cx="110" cy="110" r="92"/>
      {Array.from({ length:TICK_COUNT },(_,index)=>{
        const tickAngle=-135+index*(270/(TICK_COUNT-1));
        const radians=(tickAngle-90)*Math.PI/180;
        const inner=index%4===0?78:84;
        const outer=94;
        return <line key={index} className={index/TICK_COUNT<=throttle&&running?"tick active":"tick"} x1={110+Math.cos(radians)*inner} y1={110+Math.sin(radians)*inner} x2={110+Math.cos(radians)*outer} y2={110+Math.sin(radians)*outer}/>;
      })}
      <g transform={`rotate(${angle} 110 110)`}><line className="gauge-needle" x1="110" y1="119" x2="110" y2="39"/></g>
      <circle className="gauge-hub" cx="110" cy="110" r="8"/>
    </svg>
    <div className="gauge-readout"><strong>{value.toLocaleString("en-US")}</strong><span>SIMULATED RPM</span></div>
    <div className="gauge-label gauge-label-low">0</div><div className="gauge-label gauge-label-high">{electric?"12":"14"}k</div>
  </div>;
}
