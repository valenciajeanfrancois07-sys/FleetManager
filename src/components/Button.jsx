export default function Button({ children, variant = "secondary", ...props }) {
  return (
    <button type="button" className={`ui-button ${variant}`} {...props}>
      {children}
    </button>
  );
}
