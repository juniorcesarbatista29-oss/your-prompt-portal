export const FMark = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Red diagonal slash */}
    <rect
      x="-4"
      y="28"
      width="72"
      height="8"
      rx="1"
      fill="hsl(var(--brand-red))"
      transform="rotate(-35 32 32)"
    />
    {/* Letter F */}
    <path
      d="M16 8 H52 V20 H28 V30 H46 V40 H28 V56 H16 Z"
      fill="currentColor"
    />
  </svg>
);
