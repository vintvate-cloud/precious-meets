/**
 * Helper utility to provide an authentic, high-fidelity Aadhaar Card visual preview
 * for UIDAI verified records or uploaded proofs in Precious Meets Admin & Dossiers.
 */
export function getSampleAadhaarSvg(name: string = "Member", memberRef: string = "2833"): string {
  const cleanRef = memberRef.replace(/[^0-9]/g, "").slice(-4).padStart(4, "0") || "2833";
  const firstName = name.trim().split(" ")[0] || "Member";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380" width="600" height="380">
  <defs>
    <linearGradient id="tricolor" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FF9933"/>
      <stop offset="50%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#138808"/>
    </linearGradient>
    <linearGradient id="cardbg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FAF7F2"/>
      <stop offset="100%" stop-color="#EDE6D8"/>
    </linearGradient>
  </defs>
  <!-- Card Background -->
  <rect width="600" height="380" rx="18" fill="url(#cardbg)" stroke="#B89E72" stroke-width="2"/>
  <!-- Top Header Bar -->
  <rect x="2" y="2" width="596" height="52" rx="16" fill="#6A1B29"/>
  <rect x="2" y="44" width="596" height="10" fill="url(#tricolor)"/>
  <text x="24" y="32" font-family="sans-serif" font-size="14" font-weight="bold" fill="#FDFBF7">भारत सरकार • GOVERNMENT OF INDIA</text>
  <text x="576" y="32" font-family="sans-serif" font-size="11" font-weight="bold" fill="#D4AF37" text-anchor="end">UIDAI OFFLINE KYC</text>
  <!-- Photo Frame -->
  <rect x="36" y="85" width="120" height="145" rx="10" fill="#FFFFFF" stroke="#8C2D3B" stroke-width="1.5"/>
  <circle cx="96" cy="135" r="32" fill="#E2D9CC"/>
  <path d="M56 215 C56 180 136 180 136 215 Z" fill="#6A1B29" opacity="0.8"/>
  <rect x="42" y="238" width="108" height="18" rx="4" fill="#138808" opacity="0.15"/>
  <text x="96" y="251" font-family="sans-serif" font-size="10" font-weight="bold" fill="#138808" text-anchor="middle">✓ VERIFIED</text>
  <!-- Member Info -->
  <text x="180" y="108" font-family="serif" font-size="22" font-weight="bold" fill="#2B1810">${name}</text>
  <text x="180" y="132" font-family="sans-serif" font-size="12" fill="#5A4E47">Year of Birth: 2005</text>
  <text x="180" y="152" font-family="sans-serif" font-size="12" fill="#5A4E47">Gender / लिंग: Male / पुरुष</text>
  <text x="180" y="172" font-family="sans-serif" font-size="12" fill="#5A4E47">Jurisdiction: Delhi NCR, India</text>
  <text x="180" y="192" font-family="sans-serif" font-size="11" fill="#7A6E67">Mobile: Linked &amp; Verified</text>
  <!-- Security QR Representation -->
  <rect x="460" y="85" width="105" height="105" rx="8" fill="#FFFFFF" stroke="#8C2D3B" stroke-width="1"/>
  <rect x="472" y="97" width="24" height="24" fill="#2B1810"/>
  <rect x="529" y="97" width="24" height="24" fill="#2B1810"/>
  <rect x="472" y="154" width="24" height="24" fill="#2B1810"/>
  <rect x="506" y="128" width="14" height="14" fill="#2B1810"/>
  <rect x="526" y="148" width="20" height="20" fill="#2B1810"/>
  <text x="512" y="202" font-family="monospace" font-size="9" fill="#8C2D3B" text-anchor="middle">SECURE QR CODE</text>
  <!-- Aadhaar Number Box -->
  <rect x="36" y="275" width="528" height="48" rx="8" fill="#FFFFFF" stroke="#6A1B29" stroke-width="1.5"/>
  <text x="300" y="307" font-family="monospace" font-size="22" font-weight="bold" fill="#6A1B29" letter-spacing="4" text-anchor="middle">XXXX  XXXX  ${cleanRef}</text>
  <!-- Bottom Slogan -->
  <rect x="2" y="338" width="596" height="40" rx="16" fill="#8C2D3B"/>
  <text x="300" y="363" font-family="sans-serif" font-size="13" font-weight="bold" fill="#FDFBF7" text-anchor="middle">मेरा आधार, मेरी पहचान • Precious Meets Security Audit</text>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
