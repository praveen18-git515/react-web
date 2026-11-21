import { Link } from "react-router-dom";
import bikes, { formatRupees } from "../data/bikes";
import { useStore } from "../context/StoreContext";
import BikeCard from "../components/BikeCard";
import PhotoCredit from "../components/PhotoCredit";

export default function Wishlist() {
  const { wishlist, recent, configurations }=useStore();
  const saved=bikes.filter((bike)=>wishlist.includes(bike.id));
  const recentBikes=bikes.filter((bike)=>recent.includes(bike.id)).slice(0,4);
  return <main className="inner-page"><header className="page-heading"><div><p className="eyebrow">MY GARAGE</p><h1>Wishlist</h1></div><Link className="secondary-button" to="/compare">Compare shortlist</Link></header>
    {saved.length===0?<div className="empty-state"><h2>Your garage is empty</h2><p>Tap the heart on a motorcycle to save it here.</p><Link className="primary-button" to="/bikes">Explore bikes</Link></div>:<div className="bike-grid">{saved.map((bike)=><BikeCard bike={bike} key={bike.id}/>)}</div>}
    {configurations.length>0&&<section className="section"><div className="section-heading"><div><p className="eyebrow">SAVED BUILDS</p><h2>Custom Configurations</h2></div></div><div className="saved-configs">{configurations.map((config)=><article key={config.id}><p>{config.brand} {config.name}</p><h3>{config.variant} / {config.color}</h3><strong>{formatRupees(config.total)}</strong><span>{config.accessories.length?config.accessories.join(", "):"No accessories"}</span><Link to={`/bikes/${config.bikeId}`}>View motorcycle</Link></article>)}</div></section>}
    {recentBikes.length>0&&<section className="section"><div className="section-heading"><div><p className="eyebrow">CONTINUE EXPLORING</p><h2>Recently Viewed</h2></div></div><div className="recent-grid">{recentBikes.map((bike)=><article key={bike.id}><Link to={`/bikes/${bike.id}`}><img src={bike.image} alt={bike.imageCredit ? bike.name : `Model photo unavailable for ${bike.name}`}/><span>{bike.brand}<strong>{bike.name}</strong></span></Link><PhotoCredit bike={bike}/></article>)}</div></section>}
  </main>;
}
