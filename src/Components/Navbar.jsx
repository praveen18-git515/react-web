import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Heart, Menu, Search, X } from "lucide-react";
import { useStore } from "../context/StoreContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { wishlist, compare } = useStore();
  const links = [["/", "Home"],["/bikes","Explore Bikes"],["/brands","Brands"],["/compare","Compare"],["/customize","Build Your Ride"],["/test-ride","Test Ride"]];

  return (
    <>
      <header className="navbar">
        <Link className="brand" to="/" aria-label="RIDEVERSE home"><span>RIDE</span>VERSE</Link>
        <nav className="nav-links" aria-label="Main navigation">
          {links.map(([to,label]) => <NavLink key={to} to={to}>{label}</NavLink>)}
        </nav>
        <div className="nav-actions">
          <button className="icon-button" aria-label="Open search" onClick={() => setSearchOpen(true)}><Search size={20}/></button>
          <Link className="icon-button count-button" aria-label="Wishlist" to="/wishlist"><Heart size={20}/>{wishlist.length > 0 && <b>{wishlist.length}</b>}</Link>
          {compare.length > 0 && <Link className="nav-compare" to="/compare">{compare.length}/3 Compare</Link>}
          <button className="icon-button menu-button" aria-label="Open menu" onClick={() => setOpen(true)}><Menu size={23}/></button>
        </div>
      </header>
      {open && <div className="mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation menu">
        <button className="icon-button close-menu" aria-label="Close menu" onClick={() => setOpen(false)}><X/></button>
        <Link className="brand" to="/" onClick={() => setOpen(false)}><span>RIDE</span>VERSE</Link>
        {links.map(([to,label]) => <NavLink key={to} to={to} onClick={() => setOpen(false)}>{label}</NavLink>)}
        <Link to="/wishlist" onClick={() => setOpen(false)}>Wishlist ({wishlist.length})</Link>
      </div>}
      {searchOpen && <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Search motorcycles">
        <button className="icon-button search-close" aria-label="Close search" onClick={() => setSearchOpen(false)}><X/></button>
        <form onSubmit={(event) => { event.preventDefault(); if (query.trim()) { setSearchOpen(false); navigate(`/bikes?q=${encodeURIComponent(query.trim())}`); } }}>
          <Search size={24}/>
          <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search brand or motorcycle..." />
          <button type="submit">Search</button>
        </form>
      </div>}
    </>
  );
}
