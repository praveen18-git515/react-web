import { Link } from "react-router-dom";
import { Heart, Scale, ArrowUpRight } from "lucide-react";
import { formatRupees } from "../data/bikes";
import { useStore } from "../context/StoreContext";
import BikeSoundPlayer from "./BikeSoundPlayer";
import PhotoCredit from "./PhotoCredit";

export default function BikeCard({ bike, list = false }) {
  const { wishlist, compare, toggleWishlist, toggleCompare } = useStore();
  return <article className={`bike-card ${list ? "bike-card-list" : ""}`}>
    <div className="bike-card-media"><Link className="bike-card-image" to={`/bikes/${bike.id}`}>
      <img src={bike.image} alt={bike.imageCredit ? `${bike.brand} ${bike.name}` : `Model photo unavailable for ${bike.brand} ${bike.name}`} loading="lazy"/>
      <span className="category-pill">{bike.category}</span>
    </Link><PhotoCredit bike={bike}/></div>
    <div className="bike-card-body">
      <div className="bike-card-title"><div><p>{bike.brand}</p><h3>{bike.name}</h3></div>
        <button className={`heart-button ${wishlist.includes(bike.id) ? "active" : ""}`} aria-label={wishlist.includes(bike.id) ? "Remove from wishlist" : "Add to wishlist"} onClick={() => toggleWishlist(bike.id)}><Heart fill={wishlist.includes(bike.id) ? "currentColor" : "none"} size={20}/></button>
      </div>
      <div className="bike-spec-row"><span>{bike.engine === "N/A" ? bike.mileage : bike.engine}</span><i/><span>{bike.transmission}</span><i/><span>{bike.power}</span></div>
      <div className="bike-card-bottom"><div><small>Illustrative estimate</small><strong>{formatRupees(bike.price)}</strong></div><div className="card-actions">
        <BikeSoundPlayer bike={bike} compact/>
        <button className={compare.includes(bike.id) ? "active" : ""} aria-label="Compare motorcycle" onClick={() => toggleCompare(bike.id)}><Scale size={17}/></button>
        <Link className="detail-button" to={`/bikes/${bike.id}`}><ArrowUpRight size={18}/><span>Details</span></Link>
      </div></div>
    </div>
  </article>;
}
