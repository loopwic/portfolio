export const ProjectField = () => (
  <div aria-hidden="true" className="project-field">
    <svg
      className="h-full w-full"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 480 260"
    >
      <g className="project-field-wave">
        <path
          d="M-24 151 C 26 151 30 94 74 94 C 118 94 118 186 164 186 C 210 186 216 116 258 116 C 300 116 304 158 346 158 C 388 158 408 126 504 126"
          opacity="0.62"
          stroke="currentColor"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M-24 165 C 42 165 48 124 92 124 C 136 124 146 169 190 169 C 234 169 244 137 288 137 C 332 137 348 151 504 151"
          opacity="0.22"
          stroke="currentColor"
          strokeDasharray="5 9"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </g>

      <g className="project-field-orbit">
        <circle
          cx="372"
          cy="152"
          opacity="0.18"
          r="78"
          stroke="currentColor"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        <circle
          cx="372"
          cy="152"
          opacity="0.28"
          r="51"
          stroke="currentColor"
          strokeDasharray="2 6"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        <circle cx="427" cy="97" fill="currentColor" r="2.5" />
        <circle cx="372" cy="152" fill="currentColor" opacity="0.62" r="3" />
      </g>
    </svg>
  </div>
);
