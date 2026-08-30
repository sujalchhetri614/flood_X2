/**
 * Subtle GIS / flood-themed background.
 * Layered: soft gradient + faint grid + contour blobs + SVG topographic lines.
 * Never overpowers content. Purely decorative.
 */
export default function GisBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-surface" aria-hidden="true">
      <div className="absolute inset-0 fx-grid-bg" />
      <div className="absolute inset-0 fx-contour-bg" />
      <svg
        className="absolute left-0 top-0 h-full w-full opacity-[0.07]"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        stroke="#1D5FA7"
        strokeWidth="1"
      >
        <path d="M-50 180 C 200 120, 350 220, 600 160 S 950 100, 1250 180" />
        <path d="M-50 260 C 220 200, 380 300, 620 240 S 980 180, 1250 260" />
        <path d="M-50 340 C 240 280, 410 380, 640 320 S 1010 260, 1250 340" />
        <path d="M-50 420 C 260 360, 440 460, 660 400 S 1040 340, 1250 420" />
        <path d="M-50 500 C 280 440, 470 540, 680 480 S 1070 420, 1250 500" />
        <path d="M-50 580 C 300 520, 500 620, 700 560 S 1100 500, 1250 580" />
        <path d="M-50 660 C 320 600, 530 700, 720 640 S 1130 580, 1250 660" />
      </svg>
      <svg
        className="absolute bottom-0 left-0 w-full opacity-[0.06]"
        viewBox="0 0 1200 200"
        preserveAspectRatio="xMidYMax slice"
        fill="#0B2545"
      >
        <path d="M0 200 L0 140 L60 130 L120 150 L180 110 L240 135 L300 100 L360 125 L420 95 L480 120 L540 80 L600 110 L660 90 L720 115 L780 70 L840 100 L900 85 L960 110 L1020 75 L1080 105 L1140 90 L1200 115 L1200 200 Z" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/60" />
    </div>
  );
}
