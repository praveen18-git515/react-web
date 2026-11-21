import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Heart, Scale, ChevronRight, ArrowLeft } from "lucide-react";
import bikes, { formatRupees } from "../data/bikes";
import { useStore } from "../context/StoreContext";
import BikeCard from "../components/BikeCard";
import EngineSoundStudio from "../components/EngineSoundStudio";
import PhotoCredit from "../components/PhotoCredit";

export default function BikeDetails() {
  const { id } = useParams();
  const bike = bikes.find((item)=>item.id===id);
  const [selectedColor,setSelectedColor]=useState("");
  const [selectedVariant,setSelectedVariant]=useState("");
  const {wishlist,compare,toggleWishlist,toggleCompare,markRecent}=useStore();
  useEffect(()=>{ if(bike){ setSelectedColor(bike.colors[0]);setSelectedVariant(bike.variant);markRecent(bike.id); } },[bike?.id]);
  const similar=useMemo(()=>bike?bikes.filter((item)=>item.category===bike.category&&item.id!==bike.id).slice(0,3):[],[bike]);
  if(!bike) return <main className="not-found"><h1>Motorcycle unavailable</h1><Link className="primary-button" to="/bikes">Explore collection</Link></main>;

  return <main className="details-page">
    <div className="breadcrumbs"><Link to="/bikes">Explore Bikes</Link><ChevronRight/><span>{bike.brand}</span><ChevronRight/><strong>{bike.name}</strong></div>
    <div className="details-layout">
      <section className="details-gallery"><Link className="back-link" to="/bikes"><ArrowLeft/> Back to collection</Link><div className="main-bike-image"><img src={bike.image} alt={bike.imageCredit ? `${bike.brand} ${bike.name}` : `Model photo unavailable for ${bike.brand} ${bike.name}`}/><span>{selectedColor}</span><PhotoCredit bike={bike}/></div><div className="gallery-thumbs">{[bike,bike,bike].map((item,index)=><button key={index} className={index===0?"active":""}><img src={item.image} alt="" /></button>)}</div></section>
      <section className="details-info"><p className="eyebrow">{bike.category} / {bike.year}</p><h1>{bike.brand}<br/><em>{bike.name}</em></h1><p className="details-description">{bike.description}</p><div className="details-price"><small>Illustrative estimate</small><strong>{formatRupees(bike.price)}</strong></div>
        <div className="option-group"><div><strong>Variant</strong><span>{selectedVariant}</span></div><div className="variant-options"><button className="active" onClick={()=>setSelectedVariant(bike.variant)}>{bike.variant}</button></div></div>
        <div className="option-group"><div><strong>Color</strong><span>{selectedColor}</span></div><div className="color-options">{bike.colors.map((color)=><button key={color} className={selectedColor===color?"active":""} aria-label={`Select ${color}`} onClick={()=>setSelectedColor(color)}><i style={{background:color.toLowerCase()}}/><span>{color}</span></button>)}</div></div>
        <div className="details-actions"><Link className="primary-button" to={`/test-ride?bike=${encodeURIComponent(bike.id)}`}>Book Test Ride</Link><Link className="secondary-button" to={`/purchase-enquiry?bike=${encodeURIComponent(bike.id)}`}>Purchase Enquiry</Link></div>
        <div className="details-shortcuts"><button className={wishlist.includes(bike.id)?"active":""} onClick={()=>toggleWishlist(bike.id)}><Heart fill={wishlist.includes(bike.id)?"currentColor":"none"} size={18}/> Wishlist</button><button className={compare.includes(bike.id)?"active":""} onClick={()=>toggleCompare(bike.id)}><Scale size={18}/> Compare</button></div>
      </section>
    </div>
    <EngineSoundStudio bike={bike}/>
    <section className="spec-section"><div className="section-heading"><div><p className="eyebrow">TECHNICAL OVERVIEW</p><h2>Specifications</h2></div></div><div className="spec-grid"><div><small>Engine / Powertrain</small><strong>{bike.engine}</strong></div><div><small>Mileage / Range</small><strong>{bike.mileage}</strong></div><div><small>Power</small><strong>{bike.power}</strong></div><div><small>Torque</small><strong>{bike.torque}</strong></div><div><small>Transmission</small><strong>{bike.transmission}</strong></div><div><small>Fuel</small><strong>{bike.fuel}</strong></div></div></section>
    <section className="highlights"><h2>Key highlights</h2>{bike.features.map((feature)=><div key={feature}><span>✓</span><strong>{feature}</strong></div>)}</section>
    {similar.length>0&&<section className="section"><div className="section-heading"><div><p className="eyebrow">YOU MAY ALSO LIKE</p><h2>Similar Motorcycles</h2></div></div><div className="bike-grid">{similar.map((item)=><BikeCard bike={item} key={item.id}/>)}</div></section>}
  </main>;
}
