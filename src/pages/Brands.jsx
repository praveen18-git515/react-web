import { Link } from "react-router-dom";
import bikes from "../data/bikes";
import { brands } from "../data/catalog";

export default function Brands() {
  return <main className="brands-page">
    <section className="catalog-hero"><p className="eyebrow">MANUFACTURERS</p><h1>Iconic Brands</h1><p>Explore motorcycles by the names that shape every generation of riding.</p></section>
    <div className="brand-directory">{brands.map((brand)=>{const count=bikes.filter((bike)=>bike.brand===brand).length; return <Link key={brand} to={`/bikes?brand=${encodeURIComponent(brand)}`}><strong>{brand}</strong><span>{count || "Explore"} {count ? "models" : "collection"}</span></Link>;})}</div>
  </main>;
}
