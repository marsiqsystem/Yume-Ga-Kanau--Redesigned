import { WHATSAPP } from "@/lib/seo";

/* The floating WhatsApp button. In the original build it sat outside the app
   root so the runtime's re-renders could never wipe it; here it is simply a
   sibling of {children} in the root layout, which achieves the same thing
   without the trick. Server-rendered — it has no state, only CSS hover. */
export default function WhatsAppFab() {
  return (
    <a
      id="wa-fab"
      href={WHATSAPP.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Parveen Sensei on WhatsApp"
    >
      <span className="wa-ic" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z" />
          <path d="M12.04 2.5C6.79 2.5 2.53 6.76 2.53 12.01c0 1.68.44 3.32 1.28 4.77L2.5 21.5l4.85-1.27a9.46 9.46 0 0 0 4.69 1.23h.01c5.24 0 9.5-4.26 9.5-9.51 0-2.54-.99-4.93-2.78-6.72a9.44 9.44 0 0 0-6.73-2.79zm5.55 15.05a7.87 7.87 0 0 1-5.55 2.3h-.01a7.9 7.9 0 0 1-4.02-1.1l-.29-.17-2.98.78.8-2.91-.19-.3a7.85 7.85 0 0 1-1.21-4.19c0-4.36 3.55-7.9 7.91-7.9a7.85 7.85 0 0 1 5.59 2.32 7.85 7.85 0 0 1 2.31 5.59c0 4.36-3.55 7.9-7.9 7.9z" />
        </svg>
      </span>
      <span className="wa-tx">Chat with Sensei</span>
    </a>
  );
}
