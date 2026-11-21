import { Link } from "react-router-dom";
import { Camera, Play, Users } from "lucide-react";

export default function Footer() {
  return <footer className="footer">
    <div className="footer-main">
      <div><Link className="brand" to="/"><span>RIDE</span>VERSE</Link><p>Ride Beyond Limits. Explore, configure and compare motorcycles from one premium showroom.</p></div>
      <div><h3>Discover</h3><Link to="/bikes">Explore Bikes</Link><Link to="/brands">Brands</Link><Link to="/customize">Build Your Ride</Link></div>
      <div><h3>Services</h3><Link to="/test-ride">Book Test Ride</Link><Link to="/purchase-enquiry">Purchase Enquiry</Link><Link to="/emi-calculator">EMI Calculator</Link></div>
      <div><h3>Connect</h3><div className="socials"><button aria-label="Instagram"><Camera/></button><button aria-label="YouTube"><Play/></button><button aria-label="Community"><Users/></button></div></div>
    </div>
    <div className="footer-bottom"><span>© 2026 RIDEVERSE. Frontend demo experience.</span><span>Illustrative data — no live dealer inventory.</span></div>
  </footer>;
}
