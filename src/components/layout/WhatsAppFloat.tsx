"use client";

interface Props {
  number: string;
  message?: string;
}

export default function WhatsAppFloat({ number, message = "Zdravo, zanima me vaša ponuda za opremanje." }: Props) {
  // Format: strip non-digits, build wa.me URL
  const digits = number.replace(/\D/g, "");
  const url = `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;

  return (
    <>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Kontaktirajte nas na WhatsApp"
        className="wa-float"
      >
        {/* WhatsApp SVG icon */}
        <span className="wa-icon" aria-hidden="true">
          <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.04 4C9.44 4 4.08 9.36 4.08 15.96c0 2.11.55 4.17 1.6 5.99L4 28l6.21-1.63a11.93 11.93 0 0 0 5.82 1.49h.01c6.6 0 11.96-5.36 11.96-11.96S22.64 4 16.04 4zm0 21.86h-.01a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.69.97.98-3.6-.24-.37a9.86 9.86 0 0 1-1.51-5.27c0-5.46 4.45-9.9 9.92-9.9 2.65 0 5.14 1.03 7.01 2.9a9.84 9.84 0 0 1 2.9 7.01c0 5.47-4.45 9.92-9.91 9.92zm5.44-7.42c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35z"/>
          </svg>
        </span>

        {/* Desktop text */}
        <span className="wa-text">
          <strong>Kontaktirajte nas</strong>
          <span className="wa-num">{number}</span>
        </span>
      </a>

      <style>{`
        .wa-float {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 9000;
          display: flex;
          align-items: center;
          gap: 12px;
          background: #25D366;
          color: #fff;
          text-decoration: none;
          border-radius: 50px;
          padding: 10px 22px 10px 10px;
          box-shadow: 0 4px 20px rgba(37,211,102,0.35), 0 2px 8px rgba(0,0,0,0.15);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          font-family: 'Satoshi', sans-serif;
        }
        .wa-float:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 8px 28px rgba(37,211,102,0.45), 0 4px 12px rgba(0,0,0,0.2);
        }
        .wa-icon {
          width: 42px;
          height: 42px;
          background: rgba(255,255,255,0.22);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .wa-icon svg {
          width: 24px;
          height: 24px;
          fill: #fff;
        }
        .wa-text {
          display: flex;
          flex-direction: column;
          line-height: 1.25;
        }
        .wa-text strong {
          font-size: 14px;
          font-weight: 700;
          color: #fff;
        }
        .wa-num {
          font-size: 12px;
          color: rgba(255,255,255,0.88);
          font-weight: 500;
        }

        /* Mobile — samo ikonica */
        @media (max-width: 640px) {
          .wa-float {
            padding: 0;
            width: 56px;
            height: 56px;
            border-radius: 50%;
            justify-content: center;
            bottom: 20px;
            right: 16px;
          }
          .wa-text { display: none; }
          .wa-icon {
            width: 56px;
            height: 56px;
            background: transparent;
          }
          .wa-icon svg { width: 30px; height: 30px; }
        }
      `}</style>
    </>
  );
}
