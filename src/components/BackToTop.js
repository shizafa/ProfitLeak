'use client';
export default function BackToTop() {
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        window.topFunction?.();
      }}
      id="back-to-top"
      className="back-to-top rounded-pill fs-5"
    >
      <i data-feather="arrow-up" className="fea icon-sm icons align-middle"></i>
    </a>
  );
}
