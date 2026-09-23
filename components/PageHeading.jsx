export default function PageHeading({ title, subtitle }) {
  return (
    <div className="hero-copy">
      <h1 className="hero-display">{title}</h1>
      <p className="hero-subtitle">{subtitle}</p>
    </div>
  );
}
