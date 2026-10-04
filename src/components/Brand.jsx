function Brand({ className = "" }) {
  return (
    <a aria-label="EtFlix home" className={`brand ${className}`} href="#home">
      <svg
        aria-hidden="true"
        className="brand__mark"
        fill="none"
        viewBox="0 0 44 44"
      >
        <defs>
          <linearGradient id="etflix-mark-gradient" x1="7" x2="38" y1="5" y2="40">
            <stop stopColor="#D8FF9D" />
            <stop offset="1" stopColor="#A9E849" />
          </linearGradient>
        </defs>
        <rect
          fill="url(#etflix-mark-gradient)"
          height="40"
          rx="14"
          width="40"
          x="2"
          y="2"
        />
        <circle
          cx="22"
          cy="22"
          r="12.2"
          stroke="#17200E"
          strokeOpacity=".2"
          strokeWidth="1"
        />
        <path
          d="M19 15.7v12.6L29.2 22 19 15.7Z"
          fill="#17200E"
          stroke="#17200E"
          strokeLinejoin="round"
          strokeWidth="1.2"
        />
        <path
          d="M8.6 22h2.1M33.3 22h2.1"
          stroke="#17200E"
          strokeLinecap="round"
          strokeOpacity=".55"
          strokeWidth="1.4"
        />
      </svg>
      <span className="brand__wordmark">
        <strong>Et</strong><span>flix</span><i>.</i>
      </span>
    </a>
  );
}

export default Brand;
