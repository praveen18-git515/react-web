import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Grid2X2, List, SlidersHorizontal, X } from "lucide-react";
import bikes from "../data/bikes";
import { categories, brands } from "../data/catalog";
import BikeCard from "../Components/BikeCard";

export default function Bikes() {
  const [params, setParams] = useSearchParams();
  const [query,setQuery] = useState(params.get("q") || "");
  const [category,setCategory] = useState(params.get("category") || "");
  const [brand,setBrand] = useState(params.get("brand") || "");
  const [fuel,setFuel] = useState(params.get("fuel") || "");
  const [maxPrice,setMaxPrice] = useState(4000000);
  const [engine,setEngine] = useState("");
  const [sort,setSort] = useState("featured");
  const [layout,setLayout] = useState("grid");
  const [filtersOpen,setFiltersOpen] = useState(false);

  useEffect(() => {
    setQuery(params.get("q") || "");
    setCategory(params.get("category") || "");
    setBrand(params.get("brand") || "");
    setFuel(params.get("fuel") || "");
  }, [params]);

  const filtered = useMemo(() => {
    let result = bikes.filter((bike) => {
      const haystack = `${bike.brand} ${bike.name} ${bike.category}`.toLowerCase();
      if (query && !haystack.includes(query.toLowerCase())) return false;
      if (category && bike.category !== category) return false;
      if (brand && bike.brand !== brand) return false;
      if (fuel && bike.fuel !== fuel) return false;
      if (bike.price > maxPrice) return false;
      if (engine === "under300" && bike.engine !== "N/A" && parseInt(bike.engine.replace(/,/g,"")) >= 300) return false;
      if (engine === "300to600" && (bike.engine === "N/A" || parseInt(bike.engine.replace(/,/g,"")) < 300 || parseInt(bike.engine.replace(/,/g,"")) >= 600)) return false;
      if (engine === "over600" && (bike.engine === "N/A" || parseInt(bike.engine.replace(/,/g,"")) < 600)) return false;
      return true;
    });
    if (sort === "price-low") result.sort((a,b)=>a.price-b.price);
    if (sort === "price-high") result.sort((a,b)=>b.price-a.price);
    if (sort === "name") result.sort((a,b)=>a.name.localeCompare(b.name));
    if (sort === "newest") result.sort((a,b)=>Number(b.newArrival)-Number(a.newArrival));
    return result;
  }, [query,category,brand,fuel,maxPrice,engine,sort]);

  function clearFilters(){ setQuery("");setCategory("");setBrand("");setFuel("");setMaxPrice(4000000);setEngine("");setSort("featured");setParams({}); }

  const FilterPanel = () => <aside className="catalog-filters">
    <div className="filter-heading"><h3>Filters</h3><button aria-label="Close filters" className="filter-close" onClick={()=>setFiltersOpen(false)}><X/></button></div>
    <label>Search<input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Brand or model"/></label>
    <label>Category<select value={category} onChange={(e)=>setCategory(e.target.value)}><option value="">All categories</option>{categories.map((item)=><option key={item}>{item}</option>)}</select></label>
    <label>Brand<select value={brand} onChange={(e)=>setBrand(e.target.value)}><option value="">All brands</option>{brands.map((item)=><option key={item}>{item}</option>)}</select></label>
    <label>Powertrain<select value={fuel} onChange={(e)=>setFuel(e.target.value)}><option value="">Petrol & Electric</option><option>Petrol</option><option>Electric</option></select></label>
    <label>Engine capacity<select value={engine} onChange={(e)=>setEngine(e.target.value)}><option value="">Any capacity</option><option value="under300">Under 300 cc</option><option value="300to600">300–600 cc</option><option value="over600">Over 600 cc</option></select></label>
    <label>Maximum estimate <strong>₹{(maxPrice/100000).toFixed(1)}L</strong><input type="range" min="150000" max="4000000" step="50000" value={maxPrice} onChange={(e)=>setMaxPrice(Number(e.target.value))}/></label>
    <button className="clear-button" onClick={clearFilters}>Clear all filters</button>
  </aside>;

  return <main className="catalog-page">
    <section className="catalog-hero"><p className="eyebrow">THE COLLECTION</p><h1>Explore Bikes</h1><p>Discover a curated range of performance, adventure and everyday machines.</p></section>
    <div className="catalog-toolbar"><button className="mobile-filter-button" onClick={()=>setFiltersOpen(true)}><SlidersHorizontal size={18}/> Filters</button><p><strong>{filtered.length}</strong> motorcycles</p><div><label className="visually-hidden" htmlFor="sort">Sort motorcycles</label><select id="sort" value={sort} onChange={(e)=>setSort(e.target.value)}><option value="featured">Featured</option><option value="price-low">Price: Low to high</option><option value="price-high">Price: High to low</option><option value="name">Name: A–Z</option><option value="newest">Newest arrivals</option></select><button className={layout==="grid"?"active":""} aria-label="Grid view" onClick={()=>setLayout("grid")}><Grid2X2 size={18}/></button><button className={layout==="list"?"active":""} aria-label="List view" onClick={()=>setLayout("list")}><List size={18}/></button></div></div>
    <div className="catalog-layout"><div className="desktop-filters"><FilterPanel/></div>
      <div className={`catalog-results ${layout==="list"?"list-layout":""}`}>{filtered.map((bike)=><BikeCard key={bike.id} bike={bike} list={layout==="list"}/>)}{filtered.length===0&&<div className="empty-state"><h2>No motorcycles found</h2><p>Try widening your category, brand or price filters.</p><button onClick={clearFilters}>Reset filters</button></div>}</div>
    </div>
    {filtersOpen&&<div className="filter-drawer-backdrop" onClick={()=>setFiltersOpen(false)}><div className="filter-drawer" onClick={(e)=>e.stopPropagation()}><FilterPanel/></div></div>}
  </main>;
}
