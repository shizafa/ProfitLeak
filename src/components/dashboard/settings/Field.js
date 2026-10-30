export default function Field({ label, id, col = 6, type = "text", ...props }) {
  return (
    <div className={`col-lg-${col}`}>
      <div className="mb-3">
        <label htmlFor={id} className="form-label">{label}</label>
        <input type={type} className="form-control" id={id} {...props} />
      </div>
    </div>
  );
}