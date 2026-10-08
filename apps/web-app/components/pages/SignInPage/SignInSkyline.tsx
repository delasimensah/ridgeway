import React from "react";

/**
 * Flat buildings drawn for the sign-in panel. We own this artwork.
 * The product does not store photographs of buildings.
 */
const SignInSkyline: React.FC = () => {
  return (
    <svg
      viewBox="0 0 520 280"
      role="img"
      aria-label="Three buildings"
      className="w-full max-w-[460px]"
    >
      <rect x="0" y="248" width="520" height="2" fill="#E8E4DA" />
      <rect x="36" y="118" width="120" height="130" rx="4" fill="#1A3636" />
      <rect x="196" y="36" width="140" height="212" rx="4" fill="#1A3636" />
      <rect x="364" y="88" width="120" height="160" rx="4" fill="#40534C" />
      <rect x="56" y="98" width="80" height="10" rx="2" fill="#D6BD98" />
      <rect x="216" y="16" width="100" height="10" rx="2" fill="#D6BD98" />
      <rect x="384" y="68" width="80" height="10" rx="2" fill="#D6BD98" />
      {[0, 1, 2].map((row) =>
        [0, 1].map((column) => (
          <rect
            key={`left-${row}-${column}`}
            x={52 + column * 44}
            y={142 + row * 28}
            width="28"
            height="16"
            rx="2"
            fill="#F7F5F0"
          />
        ))
      )}
      {[0, 1, 2, 3, 4].map((row) =>
        [0, 1, 2].map((column) => (
          <rect
            key={`center-${row}-${column}`}
            x={212 + column * 36}
            y={56 + row * 32}
            width="24"
            height="16"
            rx="2"
            fill={row === 1 && column === 1 ? "#D6BD98" : "#F7F5F0"}
          />
        ))
      )}
      {[0, 1, 2, 3].map((row) =>
        [0, 1].map((column) => (
          <rect
            key={`right-${row}-${column}`}
            x={384 + column * 44}
            y={108 + row * 30}
            width="28"
            height="16"
            rx="2"
            fill="#F7F5F0"
          />
        ))
      )}
    </svg>
  );
};

export default SignInSkyline;
