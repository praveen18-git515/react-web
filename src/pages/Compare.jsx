import { Link } from "react-router-dom";
import { X } from "lucide-react";
import bikes, { formatRupees } from "../data/bikes";
import { useStore } from "../context/StoreContext";
import SoundComparison from "../components/SoundComparison";
import PhotoCredit from "../components/PhotoCredit";

export default function Compare() {
  const { compare, setCompare } = useStore();
  const selected = compare.map((id)=>bikes.find((bike)=>bike.id===id)).filter(Boolean);
  const toggle=(id)=>setCompare((current)=>current.includes(id)?current.filter((item)=>item!==id):current.length<3?[...current,id]:current);
  const rows=[
    ["Brand",(bike)=>bike.brand],["Model",(bike)=>bike.name],["Category",(bike)=>bike.category],["Price",(bike)=>formatRupees(bike.price)],
    ["Engine / Powertrain",(bike)=>bike.engine],["Mileage / Range",(bike)=>bike.mileage],["Power",(bike)=>bike.power],["Torque",(bike)=>bike.torque],
    ["Transmission",(bike)=>bike.transmission],["Features",(bike)=>bike.features.join(", ")]
  ];
  return <main className="inner-page compare-page"><header className="page-heading"><div><p className="eyebrow">SIDE BY SIDE</p><h1>Bike Comparison</h1></div>{selected.length>0&&<button className="clear-button" onClick={()=>setCompare([])}>Clear comparison</button>}</header>
    {selected.length===0?<div className="empty-state"><h2>Build your shortlist</h2><p>Select up to three motorcycles to compare specifications and estimate details.</p><Link className="primary-button" to="/bikes">Choose motorcycles</Link></div>:<>
      <div className="compare-grid" style={{"--columns":selected.length+1}}><div className="compare-label corner"/>{selected.map((bike)=><article key={bike.id} className="compare-bike"><button aria-label={`Remove ${bike.name}`} onClick={()=>toggle(bike.id)}><X/></button><img src={bike.image} alt={bike.imageCredit ? bike.name : `Model photo unavailable for ${bike.name}`}/><PhotoCredit bike={bike}/><h3>{bike.brand}<br/>{bike.name}</h3></article>)}</div>
      {rows.map(([label,getValue])=><div className="compare-grid" style={{"--columns":selected.length+1}} key={label}><div className="compare-label">{label}</div>{selected.map((bike)=><div key={bike.id} className="compare-value">{getValue(bike)||"N/A"}</div>)}</div>)}
    </>}
    <SoundComparison/>
  </main>;
}
