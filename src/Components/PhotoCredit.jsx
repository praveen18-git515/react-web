import "./PhotoCredit.css";

export default function PhotoCredit({ bike }) {
  const credit = bike.imageCredit;
  if (!credit) return <span className="photo-credit missing">No verified model photo available</span>;

  return <span className="photo-credit">
    <a href={credit.source} target="_blank" rel="noreferrer" title={credit.title}>Photo: {credit.creator}</a>
    <a href={credit.licenseUrl} target="_blank" rel="noreferrer">{credit.license}</a>
  </span>;
}
