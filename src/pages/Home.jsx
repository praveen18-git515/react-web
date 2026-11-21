import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight, Gauge, ShieldCheck, Zap, ChevronLeft, ChevronRight, Star } from "lucide-react";
import bikes, { formatRupees } from "../data/bikes";
import { categories, brands } from "../data/catalog";
import BikeCard from "../components/BikeCard";
import BikeSoundPlayer from "../components/BikeSoundPlayer";
import PhotoCredit from "../components/PhotoCredit";

export default function Home() {
  const featured = bikes.filter((bike) => bike.featured);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const featuredBike = featured[featuredIndex];
  const [color, setColor] = useState(featuredBike.colors[0]);

  useEffect(() => setColor(featured[featuredIndex].colors[0]), [featuredIndex]);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("revealed")), { threshold:.12 });
    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const moveFeatured = (direction) => setFeaturedIndex((current) => (current + direction + featured.length) % featured.length);

  return <>
    <section className="hero">
      <div className="hero-glow"/>
      <div className="hero-copy">
        <p className="eyebrow"><span/> THE NEXT GENERATION OF RIDING</p>
        <h1>UNLEASH<br/><em>THE RIDE</em></h1>
        <p className="hero-lead">Engineered for thrill. Designed for everywhere.</p>
        <div className="hero-buttons"><Link className="primary-button" to="/bikes">Explore Bikes <ArrowRight size={18}/></Link><Link className="secondary-button" to="/customize">Build Your Ride</Link></div>
      </div>
      <div className="hero-bike" key={featuredBike.id}>
        <div className="bike-number">0{featuredIndex + 1}</div>
        <img src={featuredBike.image} alt={featuredBike.imageCredit ? `${featuredBike.brand} ${featuredBike.name}` : `Model photo unavailable for ${featuredBike.brand} ${featuredBike.name}`}/>
        <PhotoCredit bike={featuredBike}/>
        <div className="hero-bike-info"><small>FEATURED / {featuredBike.category}</small><h2>{featuredBike.brand} {featuredBike.name}</h2><strong>{formatRupees(featuredBike.price)}</strong></div>
      </div>
      <div className="hero-selector">
        <button aria-label="Previous featured motorcycle" onClick={() => moveFeatured(-1)}><ChevronLeft/></button>
        <div className="featured-dots">{featured.map((bike,index)=><button key={bike.id} aria-label={`Show ${bike.name}`} className={index===featuredIndex?"active":""} onClick={()=>setFeaturedIndex(index)}/>)}</div>
        <button aria-label="Next featured motorcycle" onClick={() => moveFeatured(1)}><ChevronRight/></button>
        <div className="color-select">{featuredBike.colors.map((item)=><button key={item} aria-label={item} title={item} className={color===item?"active":""} style={{background:item.toLowerCase()}} onClick={()=>setColor(item)}/>)}</div>
        <BikeSoundPlayer bike={featuredBike} compact/>
        <Link to={`/bikes/${featuredBike.id}`}>View Motorcycle <ArrowUpRightIcon/></Link>
      </div>
      <a className="scroll-cue" href="#categories" aria-label="Scroll to categories"><ArrowDown size={18}/><span>EXPLORE</span></a>
    </section>

    <section className="section reveal" id="categories"><div className="section-heading"><div><p className="eyebrow">FIND YOUR MACHINE</p><h2>Explore Categories</h2></div><Link to="/bikes">View all bikes <ArrowRight size={17}/></Link></div>
      <div className="category-grid">{categories.map((category,index)=><Link key={category} className={`category-card category-${index%3}`} to={`/bikes?category=${encodeURIComponent(category)}`}><span>0{index+1}</span><h3>{category}</h3><ArrowRight/></Link>)}</div>
    </section>

    <section className="section reveal"><div className="section-heading"><div><p className="eyebrow">MOST WANTED</p><h2>Trending Motorcycles</h2></div></div><div className="bike-grid">{bikes.filter((bike)=>bike.featured).slice(0,4).map((bike)=><BikeCard bike={bike} key={bike.id}/>)}</div></section>

    <section className="collection-banner reveal"><div><p className="eyebrow">LIMITLESS ADVENTURE</p><h2>Built for the<br/><em>unwritten road.</em></h2><p>Discover motorcycles created to take you beyond the expected.</p><Link className="primary-button" to="/bikes?category=Adventure%20Bikes">Explore Adventure <ArrowRight size={18}/></Link></div></section>

    <section className="section reveal"><div className="section-heading"><div><p className="eyebrow">JUST LANDED</p><h2>New Arrivals</h2></div><Link to="/bikes?sort=newest">Discover new <ArrowRight size={17}/></Link></div><div className="bike-grid">{bikes.filter((bike)=>bike.newArrival).slice(0,4).map((bike)=><BikeCard bike={bike} key={bike.id}/>)}</div></section>

    <section className="electric-section reveal"><div><p className="eyebrow">SILENTLY POWERFUL</p><h2>Electric.<br/>Uncompromised.</h2><p>Instant torque, intelligent range and a new kind of two-wheeled thrill.</p><Link className="secondary-button" to="/bikes?fuel=Electric">Explore Electric <Zap size={18}/></Link></div><div className="electric-stat"><strong>211</strong><span>KM illustrative range</span></div></section>

    <section className="section brand-section reveal"><div className="section-heading centered"><div><p className="eyebrow">THE WORLD'S ICONIC NAMES</p><h2>Brands at RIDEVERSE</h2></div></div><div className="brand-grid">{brands.map((brand)=><Link key={brand} to={`/bikes?brand=${encodeURIComponent(brand)}`}><strong>{brand}</strong></Link>)}</div></section>

    <section className="section features-section reveal"><div className="feature"><Gauge/><h3>Curated Collection</h3><p>Explore machines across every riding category.</p></div><div className="feature"><ShieldCheck/><h3>Transparent Guidance</h3><p>Clear demo estimates and specification context.</p></div><div className="feature"><Zap/><h3>Built Around You</h3><p>Configure, compare and enquire in one experience.</p></div></section>

    <section className="comparison-promo reveal"><div><p className="eyebrow">MAKE THE RIGHT CALL</p><h2>Compare side by side.</h2></div><Link className="primary-button" to="/compare">Open Comparison <ArrowRight size={18}/></Link></section>

    <section className="testimonial section reveal"><div className="quote-mark">“</div><blockquote>RIDEVERSE made the whole experience feel considered — from discovery to my shortlist, every detail was easy to understand.</blockquote><div className="demo-person"><div>AK</div><span><strong>Arjun K.</strong><small>Demo customer story</small></span></div><div className="stars">{[1,2,3,4,5].map((star)=><Star key={star} fill="currentColor"/>)}</div></section>

    <section className="newsletter reveal"><div><p className="eyebrow">JOIN THE INNER CIRCLE</p><h2>New rides. First looks.</h2></div><form onSubmit={(event)=>event.preventDefault()}><input type="email" required placeholder="Email address" aria-label="Email address"/><button type="submit">Subscribe <ArrowRight size={17}/></button></form></section>
  </>;
}

function ArrowUpRightIcon() {
  return <ArrowRight size={16}/>;
}
