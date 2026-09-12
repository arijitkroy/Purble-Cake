import React from 'react';
import { CUSTOMERS, Customer } from '../../data/customers';

interface AvatarProps {
  customerId: string;
  size?: number;
  mood?: 'happy' | 'thinking' | 'excited' | 'sad';
  className?: string;
}

export const CustomerAvatar: React.FC<AvatarProps> = ({
  customerId,
  size = 56,
  mood = 'happy',
  className = ''
}) => {
  const customer: Customer = CUSTOMERS.find((c) => c.id === customerId) || CUSTOMERS[0];

  return (
    <div
      className={`customer-avatar-wrapper ${className}`}
      style={{ width: size, height: size, position: 'relative', display: 'inline-block' }}
      title={`${customer.name}: "${customer.greeting}"`}
    >
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <defs>
          <linearGradient id={`critterGrad_${customer.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
            <stop offset="30%" stopColor={customer.color} />
            <stop offset="100%" stopColor={customer.earColor} />
          </linearGradient>
        </defs>

        {/* Ears */}
        {customer.species === 'bunny' && (
          <g id="bunny-ears">
            {/* Left ear */}
            <ellipse cx="32" cy="22" rx="9" ry="24" fill={customer.color} stroke={customer.earColor} strokeWidth="2" />
            <ellipse cx="32" cy="22" rx="5" ry="17" fill={customer.earColor} />
            {/* Right ear */}
            <ellipse cx="68" cy="22" rx="9" ry="24" fill={customer.color} stroke={customer.earColor} strokeWidth="2" />
            <ellipse cx="68" cy="22" rx="5" ry="17" fill={customer.earColor} />
          </g>
        )}

        {customer.species === 'bear' && (
          <g id="bear-ears">
            <circle cx="26" cy="30" r="14" fill={customer.earColor} />
            <circle cx="26" cy="30" r="8" fill="#D7CCC8" />
            <circle cx="74" cy="30" r="14" fill={customer.earColor} />
            <circle cx="74" cy="30" r="8" fill="#D7CCC8" />
          </g>
        )}

        {customer.species === 'cat' && (
          <g id="cat-ears">
            <polygon points="20,45 35,16 50,40" fill={customer.color} stroke={customer.earColor} strokeWidth="2" />
            <polygon points="26,42 35,24 44,38" fill={customer.earColor} />
            <polygon points="80,45 65,16 50,40" fill={customer.color} stroke={customer.earColor} strokeWidth="2" />
            <polygon points="74,42 65,24 56,38" fill={customer.earColor} />
          </g>
        )}

        {customer.species === 'fox' && (
          <g id="fox-ears">
            <polygon points="18,48 28,15 48,40" fill={customer.color} stroke={customer.earColor} strokeWidth="2" />
            <polygon points="24,44 28,24 40,38" fill="#FFFFFF" />
            <polygon points="82,48 72,15 52,40" fill={customer.color} stroke={customer.earColor} strokeWidth="2" />
            <polygon points="76,44 72,24 60,38" fill="#FFFFFF" />
          </g>
        )}

        {customer.species === 'panda' && (
          <g id="panda-ears">
            <circle cx="25" cy="30" r="13" fill="#263238" />
            <circle cx="75" cy="30" r="13" fill="#263238" />
          </g>
        )}

        {/* Head Base */}
        <circle
          cx="50"
          cy="60"
          r="34"
          fill={customer.color}
          stroke={customer.earColor}
          strokeWidth="2"
        />

        {/* Panda eye patches */}
        {customer.species === 'panda' && (
          <g id="panda-patches">
            <ellipse cx="38" cy="56" rx="9" ry="8" fill="#263238" transform="rotate(-15 38 56)" />
            <ellipse cx="62" cy="56" rx="9" ry="8" fill="#263238" transform="rotate(15 62 56)" />
          </g>
        )}

        {/* Eyes */}
        <g id="eyes">
          {mood === 'happy' || mood === 'excited' ? (
            <>
              <circle cx="38" cy="55" r="4" fill="#212121" />
              <circle cx="37" cy="53" r="1.5" fill="#FFFFFF" />
              <circle cx="62" cy="55" r="4" fill="#212121" />
              <circle cx="61" cy="53" r="1.5" fill="#FFFFFF" />
            </>
          ) : (
            <>
              <ellipse cx="38" cy="56" rx="4" ry="2" fill="#212121" />
              <ellipse cx="62" cy="56" rx="4" ry="2" fill="#212121" />
            </>
          )}
        </g>

        {/* Cute blush cheeks */}
        <ellipse cx="28" cy="65" rx="5" ry="3" fill="#FF80AB" opacity="0.65" />
        <ellipse cx="72" cy="65" rx="5" ry="3" fill="#FF80AB" opacity="0.65" />

        {/* Nose & Mouth */}
        <polygon points="47,62 53,62 50,65" fill="#C2185B" />
        {mood === 'excited' ? (
          <path d="M 45,67 Q 50,75 55,67 Z" fill="#E91E63" stroke="#212121" strokeWidth="1" />
        ) : (
          <path d="M 45,66 Q 50,71 55,66" fill="none" stroke="#212121" strokeWidth="1.5" strokeLinecap="round" />
        )}

        {/* Party / Baker Hat */}
        <g id="baker-hat">
          <polygon points="50,15 38,34 62,34" fill={customer.hatColor} stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="50" cy="14" r="4" fill="#FFD54F" />
          <line x1="42" y1="28" x2="58" y2="28" stroke="#FFFFFF" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
};
