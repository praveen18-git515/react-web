const BARS = Array.from({length:34},(_,index)=>0.22+((index*17)%13)/16);

export default function SoundVisualizer({ active, throttle=0 }) {
  return <div className={`sound-visualizer ${active?"active":""}`} aria-hidden="true">
    {BARS.map((height,index)=><i key={index} style={{"--bar-height":`${height*(0.6+throttle)}em`,"--bar-delay":`${(index%9)*-0.09}s`}}/>)}
  </div>;
}
