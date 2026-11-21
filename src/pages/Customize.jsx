import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import bikes, { formatRupees } from "../data/bikes";
import { useStore } from "../context/StoreContext";
import BikeSoundPlayer from "../components/BikeSoundPlayer";
import PhotoCredit from "../components/PhotoCredit";

const accessories=[["Premium helmet",25000],["Crash guards",12000],["Touring luggage",28000],["Phone navigation mount",4500],["Extended warranty",18000]];

export default function Customize(){
 const [bikeId,setBikeId]=useState(bikes[0].id);
 const bike=bikes.find((item)=>item.id===bikeId);
 const [variant,setVariant]=useState(bike.variant);
 const [color,setColor]=useState(bike.colors[0]);
 const [selected,setSelected]=useState([]);
 const {saveConfiguration}=useStore();
 const accessoriesTotal=useMemo(()=>accessories.reduce((sum,[name,price])=>sum+(selected.includes(name)?price:0),0),[selected]);
 const total=bike.price+accessoriesTotal;
 function chooseBike(id){const next=bikes.find((item)=>item.id===id);setBikeId(id);setVariant(next.variant);setColor(next.colors[0]);setSelected([]);}
 function toggleAccessory(name){setSelected((current)=>current.includes(name)?current.filter((item)=>item!==name):[...current,name]);}
 function reset(){setVariant(bike.variant);setColor(bike.colors[0]);setSelected([]);}
 return <main className="customize-page"><section className="catalog-hero"><p className="eyebrow">CONFIGURATION STUDIO</p><h1>Build Your Ride</h1></section><div className="customize-layout">
  <div className="custom-preview"><div className="preview-label"><span>YOUR BUILD</span><strong>{color}</strong></div><img src={bike.image} alt={bike.imageCredit ? `${bike.brand} ${bike.name}` : `Model photo unavailable for ${bike.brand} ${bike.name}`}/><PhotoCredit bike={bike}/><div className="preview-name"><p>{bike.brand}</p><h2>{bike.name}</h2></div></div>
  <aside className="custom-panel"><label>Choose motorcycle<select value={bikeId} onChange={(e)=>chooseBike(e.target.value)}>{bikes.map((item)=><option key={item.id} value={item.id}>{item.brand} {item.name}</option>)}</select></label><div className="custom-sound-row"><div><strong>Hear this build</strong><small>Generated sound profile</small></div><BikeSoundPlayer bike={bike}/></div><div className="option-group"><strong>Variant</strong><div className="variant-options"><button className="active" onClick={()=>setVariant(bike.variant)}>{bike.variant}</button></div></div><div className="option-group"><strong>Color</strong><div className="color-options">{bike.colors.map((item)=><button key={item} className={color===item?"active":""} onClick={()=>setColor(item)}><i style={{background:item.toLowerCase()}}/><span>{item}</span></button>)}</div></div><div className="accessory-list"><strong>Accessories</strong>{accessories.map(([name,price])=><label key={name}><input type="checkbox" checked={selected.includes(name)} onChange={()=>toggleAccessory(name)}/><span>{name}</span><b>{formatRupees(price)}</b></label>)}</div><div className="config-total"><div><span>Estimated total</span><strong>{formatRupees(total)}</strong></div><small>Illustrative estimate excludes additional charges.</small></div><div className="config-actions"><button onClick={reset}>Reset</button><button onClick={()=>saveConfiguration({bikeId,brand:bike.brand,name:bike.name,variant,color,accessories:selected,total})}>Save Build</button></div><Link className="primary-button" to={`/purchase-enquiry?bike=${encodeURIComponent(bike.id)}&variant=${encodeURIComponent(variant)}&color=${encodeURIComponent(color)}`}>Continue to Enquiry</Link></aside>
 </div></main>;
}
