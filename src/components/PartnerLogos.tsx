import React from 'react';

interface PartnerLogoProps {
  name: string;
  className?: string;
}

export default function PartnerLogo({ name, className = "h-7 w-auto" }: PartnerLogoProps) {
  const lowercase = name.toLowerCase();

  // 1. NSE (National Stock Exchange)
  if (lowercase === 'nse' || lowercase.includes('national stock exchange')) {
    return (
      <svg 
        className={`${className} transition-all duration-300`} 
        viewBox="0 0 160 40" 
        width="160"
        height="40"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        aria-label="National Stock Exchange"
      >
        <title>National Stock Exchange (NSE)</title>
        <g transform="translate(6, 0)">
          {/* Stylized circular flower/globe representation of NSE in vibrant neon teal-blue */}
          <circle cx="28" cy="20" r="14" stroke="#00E5FF" strokeWidth="2.5" opacity="0.85" />
          <path d="M20 20C20 15.6 23.6 12 28 12C32.4 12 36 15.6 36 20C36 24.4 32.4 28 28 28" stroke="#00E676" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="28" cy="20" r="3" fill="#FFD600" />
          {/* Clean, high-impact vector typography */}
          <text x="56" y="21" fill="currentColor" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="15" letterSpacing="2">NSE</text>
          <text x="56" y="30" fill="currentColor" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="600" fontSize="7" letterSpacing="0.4" opacity="0.75">NATIONAL STOCK EXCHANGE</text>
        </g>
      </svg>
    );
  }

  // 2. BSE (Bombay Stock Exchange)
  if (lowercase === 'bse' || lowercase.includes('bombay stock exchange')) {
    return (
      <svg 
        className={`${className} transition-all duration-300`} 
        viewBox="0 0 160 40" 
        width="160"
        height="40"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Bombay Stock Exchange"
      >
        <title>Bombay Stock Exchange (BSE)</title>
        <g transform="translate(10, 0)">
          {/* Soaring corporate pillars and trend-arrow in gold and light sky blue */}
          <rect x="10" y="22" width="5" height="12" rx="1" fill="#00E5FF" />
          <rect x="18" y="15" width="5" height="19" rx="1" fill="#00E5FF" />
          <rect x="26" y="8" width="5" height="26" rx="1" fill="#00E5FF" />
          {/* Dynamic rising trend-arrow swooshing over the pillars */}
          <path d="M6 31L16 20L25 11L34 5M34 5H26M34 5V13" stroke="#FFD600" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="46" y="22" fill="currentColor" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="16" letterSpacing="1.5">BSE</text>
          <text x="46" y="30" fill="currentColor" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="600" fontSize="7" letterSpacing="0.3" opacity="0.75">BOMBAY STOCK EXCHANGE</text>
        </g>
      </svg>
    );
  }

  // 3. AMFI (Association of Mutual Funds in India)
  if (lowercase === 'amfi' || lowercase.includes('association of mutual funds')) {
    return (
      <svg 
        className={`${className} transition-all duration-300`} 
        viewBox="0 0 160 40" 
        width="160"
        height="40"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Association of Mutual Funds in India"
      >
        <title>Association of Mutual Funds in India (AMFI)</title>
        <g transform="translate(4, 0)">
          {/* Growth shield & Leaf emblem in vibrant green and electric blue */}
          <path d="M12 12C12 12 18 6 26 6C34 6 40 12 40 12C40 12 34 34 26 34C18 34 12 12 12 12Z" stroke="#2979FF" strokeWidth="2.5" />
          <path d="M26 11C22 14.5 22 21.5 26 27C30 21.5 30 14.5 26 11Z" fill="#00E676" />
          <text x="48" y="22" fill="currentColor" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="14" letterSpacing="1.5">AMFI</text>
          <text x="48" y="30" fill="currentColor" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="600" fontSize="6.5" letterSpacing="0.2" opacity="0.75">MUTUAL FUND ASSOCIATION</text>
        </g>
      </svg>
    );
  }

  // 4. IRDAI (Insurance Regulatory and Development Authority of India)
  if (lowercase === 'irdai' || lowercase.includes('insurance regulatory')) {
    return (
      <svg 
        className={`${className} transition-all duration-300`} 
        viewBox="0 0 160 40" 
        width="160"
        height="40"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Insurance Regulatory and Development Authority of India"
      >
        <title>Insurance Regulatory and Development Authority of India (IRDAI)</title>
        <g transform="translate(3.5, 0)">
          {/* Shield with protective umbrella/arch over a leaf of growth */}
          <path d="M26 6C18 6 13 11 13 18C13 25 18 34 26 34C34 34 39 25 39 18C39 11 34 6 26 6ZM26 10C30 10 33.5 13 34.8 17H17.2C18.5 13 22 10 26 10ZM26 30C21.5 30 18.2 26 17.1 20H34.9C33.8 26 30.5 30 26 30Z" fill="#00E676" />
          <path d="M22 17C22 17 24 19 26 19C28 19 30 17 30 17" stroke="#00B0FF" strokeWidth="2.5" strokeLinecap="round" />
          <text x="48" y="22" fill="currentColor" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="14" letterSpacing="1.5">IRDAI</text>
          <text x="48" y="30" fill="currentColor" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="600" fontSize="6.5" letterSpacing="0.2" opacity="0.75">INSURANCE REGULATOR</text>
        </g>
      </svg>
    );
  }

  // 5. TATA AIA
  if (lowercase.includes('tata aia')) {
    return (
      <svg 
        className={`${className} transition-all duration-300`} 
        viewBox="0 0 160 40" 
        width="160"
        height="40"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        aria-label="TATA AIA Life Insurance"
      >
        <title>TATA AIA Life Insurance</title>
        <g transform="translate(15, 0)">
          {/* Canopy in premium electric blue */}
          <path d="M18 5C18 5 16.5 13.5 10 17.5C12.5 17.5 14.8 16.2 16 14.5V23H19.8V14.5C21 16.2 23.3 17.5 25.8 17.5C19.3 13.5 18 5 18 5Z" fill="#00A2FF" />
          {/* Vibrant Brand Text */}
          <text x="32" y="19" fill="#00A2FF" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="13" letterSpacing="1.2">TATA</text>
          <text x="74" y="19" fill="#FF2D55" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="11" letterSpacing="0.8">AIA</text>
          <text x="100" y="19" fill="currentColor" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="600" fontSize="9" letterSpacing="0.5" opacity="0.8">LIFE</text>
        </g>
      </svg>
    );
  }

  // 6. TATA AIG
  if (lowercase.includes('tata aig')) {
    return (
      <svg 
        className={`${className} transition-all duration-300`} 
        viewBox="0 0 160 40" 
        width="160"
        height="40"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        aria-label="TATA AIG General Insurance"
      >
        <title>TATA AIG General Insurance</title>
        <g transform="translate(20, 0)">
          {/* Canopy in electric blue */}
          <path d="M18 5C18 5 16.5 13.5 10 17.5C12.5 17.5 14.8 16.2 16 14.5V23H19.8V14.5C21 16.2 23.3 17.5 25.8 17.5C19.3 13.5 18 5 18 5Z" fill="#00A2FF" />
          <text x="32" y="19" fill="#00A2FF" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="13" letterSpacing="1.2">TATA</text>
          <text x="74" y="19" fill="#33B5E5" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="11" letterSpacing="1">AIG</text>
        </g>
      </svg>
    );
  }

  // 7. ICICI PRUDENTIAL
  if (lowercase.includes('icici prudential') || lowercase.includes('icici pru')) {
    return (
      <svg 
        className={`${className} transition-all duration-300`} 
        viewBox="0 0 160 40" 
        width="160"
        height="40"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        aria-label="ICICI Prudential Mutual Funds"
      >
        <title>ICICI Prudential Mutual Funds</title>
        <g transform="translate(9.75, 0)">
          {/* Vibrant maroon-rose person spiral and orange circle */}
          <path d="M14 13C14 13 17 9.5 20.5 13C24 16.5 20.5 25.5 16.5 28.5C13.5 30.5 10.5 28.5 10.5 24C10.5 19.5 14 13 14 13Z" stroke="#FF453A" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="19.5" cy="8" r="2.5" fill="#FF9F0A" />
          <text x="30" y="20" fill="#FF453A" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="13" letterSpacing="1">ICICI</text>
          <text x="70" y="20" fill="currentColor" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="600" fontSize="8.5" letterSpacing="0.5" opacity="0.8">PRUDENTIAL</text>
        </g>
      </svg>
    );
  }

  // 8. ICICI LOMBARD
  if (lowercase.includes('icici lombard')) {
    return (
      <svg 
        className={`${className} transition-all duration-300`} 
        viewBox="0 0 160 40" 
        width="160"
        height="40"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        aria-label="ICICI Lombard General Insurance"
      >
        <title>ICICI Lombard General Insurance</title>
        <g transform="translate(9.75, 0)">
          <path d="M14 13C14 13 17 9.5 20.5 13C24 16.5 20.5 25.5 16.5 28.5C13.5 30.5 10.5 28.5 10.5 24C10.5 19.5 14 13 14 13Z" stroke="#FF453A" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="19.5" cy="8" r="2.5" fill="#FF9F0A" />
          <text x="30" y="20" fill="#FF453A" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="13" letterSpacing="1">ICICI</text>
          <text x="70" y="20" fill="currentColor" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="600" fontSize="8.5" letterSpacing="0.5" opacity="0.8">LOMBARD</text>
        </g>
      </svg>
    );
  }

  // 9. HDFC LIFE
  if (lowercase.includes('hdfc life')) {
    return (
      <svg 
        className={`${className} transition-all duration-300`} 
        viewBox="0 0 160 40" 
        width="160"
        height="40"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        aria-label="HDFC Life Insurance"
      >
        <title>HDFC Life Insurance</title>
        <g transform="translate(16, 0)">
          {/* HDFC Block in rich blue and red */}
          <rect x="8" y="9" width="22" height="22" rx="2" fill="none" stroke="#2979FF" strokeWidth="3" />
          <rect x="14" y="15" width="10" height="10" fill="#FF1744" />
          <text x="38" y="24" fill="#2979FF" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="13" letterSpacing="1">HDFC</text>
          <text x="82" y="24" fill="#FF1744" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700" fontSize="11" letterSpacing="0.8">LIFE</text>
        </g>
      </svg>
    );
  }

  // 10. HDFC ERGO
  if (lowercase.includes('hdfc ergo')) {
    return (
      <svg 
        className={`${className} transition-all duration-300`} 
        viewBox="0 0 160 40" 
        width="160"
        height="40"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        aria-label="HDFC Ergo General Insurance"
      >
        <title>HDFC Ergo General Insurance</title>
        <g transform="translate(16, 0)">
          <rect x="8" y="9" width="22" height="22" rx="2" fill="none" stroke="#2979FF" strokeWidth="3" />
          <rect x="14" y="15" width="10" height="10" fill="#FF1744" />
          <text x="38" y="24" fill="#2979FF" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="13" letterSpacing="1">HDFC</text>
          <text x="82" y="24" fill="#FF1744" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700" fontSize="11" letterSpacing="0.8">ERGO</text>
        </g>
      </svg>
    );
  }

  // 11. STAR HEALTH
  if (lowercase.includes('star health')) {
    return (
      <svg 
        className={`${className} transition-all duration-300`} 
        viewBox="0 0 160 40" 
        width="160"
        height="40"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Star Health Insurance"
      >
        <title>Star Health Insurance</title>
        <g transform="translate(16.5, 0)">
          {/* Star in glowing gold */}
          <path d="M18 8L21.5 15H29L23 20L25.5 27L18 22.5L10.5 27L13 20L7 15H14.5L18 8Z" fill="#FFD600" />
          <text x="38" y="23" fill="#00B0FF" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="13" letterSpacing="1.2">STAR</text>
          <text x="80" y="23" fill="currentColor" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="600" fontSize="10" letterSpacing="0.8" opacity="0.8">HEALTH</text>
        </g>
      </svg>
    );
  }

  // 12. CARE HEALTH
  if (lowercase.includes('care health')) {
    return (
      <svg 
        className={`${className} transition-all duration-300`} 
        viewBox="0 0 160 40" 
        width="160"
        height="40"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Care Health Insurance"
      >
        <title>Care Health Insurance</title>
        <g transform="translate(13, 0)">
          {/* Turquoise caring leaf/heart */}
          <path d="M18 24C23 24 25 19 25 15C20 15 18 19 18 24Z" fill="#00E676" />
          <path d="M16 24C11 24 9 19 9 15C14 15 16 19 16 24Z" fill="#00E676" opacity="0.6" />
          <text x="32" y="23" fill="#00E676" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="14" letterSpacing="0.5">care</text>
          <text x="70" y="23" fill="currentColor" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="600" fontSize="10" letterSpacing="0.8" opacity="0.8">HEALTH</text>
        </g>
      </svg>
    );
  }

  // 13. NIVA BUPA
  if (lowercase.includes('niva bupa')) {
    return (
      <svg 
        className={`${className} transition-all duration-300`} 
        viewBox="0 0 160 40" 
        width="160"
        height="40"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Niva Bupa Health Insurance"
      >
        <title>Niva Bupa Health Insurance</title>
        <g transform="translate(17.5, 0)">
          <path d="M14 12C14 12 18 16 22 12C26 8 22 4 18 8C14 4 10 8 14 12Z" fill="#00E5FF" />
          <path d="M18 26C18 26 14 22 10 26C6 30 10 34 14 30C18 34 22 30 18 26Z" fill="#2979FF" opacity="0.8" />
          <text x="32" y="23" fill="#2979FF" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="13" letterSpacing="1">NIVA</text>
          <text x="74" y="23" fill="#00E5FF" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700" fontSize="10" letterSpacing="0.8">BUPA</text>
        </g>
      </svg>
    );
  }

  // 14. PRUDENT CORPORATE / PRUDENT MUTUAL FUNDS
  if (lowercase.includes('prudent')) {
    return (
      <svg 
        className={`${className} transition-all duration-300`} 
        viewBox="0 0 160 40" 
        width="160"
        height="40"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Prudent Corporate"
      >
        <title>Prudent Corporate</title>
        <g transform="translate(19.5, 0)">
          <rect x="6" y="21" width="4" height="7" rx="1" fill="#FFD600" />
          <rect x="13" y="15" width="4" height="13" rx="1" fill="#2979FF" />
          <rect x="20" y="9" width="4" height="19" rx="1" fill="#2979FF" />
          <text x="32" y="24" fill="#2979FF" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="12" letterSpacing="1.2">PRUDENT</text>
        </g>
      </svg>
    );
  }

  // DEFAULT FALLBACK
  return (
    <svg 
      className={`${className} transition-all duration-300`} 
      viewBox="0 0 160 40" 
      width="160"
      height="40"
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-label={name}
    >
      <title>{name}</title>
      <circle cx="16" cy="20" r="8" stroke="currentColor" strokeWidth="2.5" />
      <text x="32" y="24" fill="currentColor" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="11" letterSpacing="0.8">{name}</text>
    </svg>
  );
}
