import { Link } from "react-router-dom";

export default function NotFound(){
 return <main className="not-found"><p className="eyebrow">404 / LOST ON THE ROAD</p><h1>Wrong turn.</h1><p>This route does not lead to any motorcycle in RIDEVERSE.</p><Link className="primary-button" to="/">Return Home</Link></main>;
}
