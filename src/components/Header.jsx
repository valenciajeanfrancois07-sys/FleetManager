export default function Header({ title, children }) {
  return (
    <header className="vehicles-header">
      <h1>{title}</h1>
      {children}
    </header>
  );
}