import React from 'react';
import { CakeState } from '../../game/types';
import { BASE_OPTIONS, FILLING_OPTIONS, FROSTING_OPTIONS } from '../../data/ingredients';

interface CakeProps {
  cake: CakeState;
  size?: 'mini' | 'small' | 'medium' | 'large';
  animateLayer?: string | null;
  className?: string;
  showPlate?: boolean;
}

export const Cake: React.FC<CakeProps> = ({
  cake,
  size = 'medium',
  animateLayer = null,
  className = '',
  showPlate = true
}) => {
  const baseData = BASE_OPTIONS.find((b) => b.id === cake.base);
  const fillingData = FILLING_OPTIONS.find((f) => f.id === cake.filling);
  const frostingData = FROSTING_OPTIONS.find((fr) => fr.id === cake.frosting);

  // Dimension scaling
  const dimensions = {
    mini: { width: 90, height: 80, viewBox: '0 0 240 220' },
    small: { width: 140, height: 120, viewBox: '0 0 240 220' },
    medium: { width: 220, height: 190, viewBox: '0 0 240 220' },
    large: { width: 300, height: 260, viewBox: '0 0 240 220' }
  }[size];

  return (
    <div
      className={`cake-display cake-${size} ${className}`}
      style={{ width: dimensions.width, height: dimensions.height, display: 'inline-block' }}
    >
      <svg
        viewBox={dimensions.viewBox}
        width="100%"
        height="100%"
        style={{ overflow: 'visible', filter: 'drop-shadow(0px 8px 16px rgba(90, 45, 15, 0.15))' }}
      >
        <defs>
          {/* Plate Gradients */}
          <linearGradient id="plateGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>
          <linearGradient id="plateRim" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>

          {/* Dynamic Base Gradient */}
          {baseData && (
            <linearGradient id={`baseGrad_${baseData.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={baseData.secondaryColor} />
              <stop offset="25%" stopColor={baseData.color} />
              <stop offset="75%" stopColor={baseData.color} />
              <stop offset="100%" stopColor={baseData.secondaryColor} />
            </linearGradient>
          )}

          {/* Dynamic Frosting Gradient */}
          {frostingData && (
            <linearGradient id={`frostGrad_${frostingData.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
              <stop offset="20%" stopColor={frostingData.color} />
              <stop offset="100%" stopColor={frostingData.secondaryColor} />
            </linearGradient>
          )}

          {/* Filling Gradient */}
          {fillingData && (
            <linearGradient id={`fillGrad_${fillingData.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={fillingData.secondaryColor} />
              <stop offset="50%" stopColor={fillingData.color} />
              <stop offset="100%" stopColor={fillingData.secondaryColor} />
            </linearGradient>
          )}

          {/* Shadow Filter */}
          <filter id="cakeShadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* 1. Cake Plate / Tray */}
        {showPlate && (
          <g id="plate-group">
            {/* Stand shadow */}
            <ellipse cx="120" cy="204" rx="90" ry="14" fill="rgba(0, 0, 0, 0.12)" />
            {/* Plate rim */}
            <ellipse cx="120" cy="196" rx="88" ry="16" fill="url(#plateRim)" stroke="#CBD5E1" strokeWidth="2.5" />
            <ellipse cx="120" cy="194" rx="76" ry="12" fill="url(#plateGrad)" />
            <ellipse cx="120" cy="192" rx="66" ry="9" fill="#F1F5F9" />
          </g>
        )}

        {/* Empty placeholder guide if no base has been chosen yet */}
        {!cake.base && (
          <g id="empty-cake-guide" opacity="0.45">
            <ellipse cx="120" cy="170" rx="55" ry="14" fill="none" stroke="#94A3B8" strokeWidth="2" strokeDasharray="6 4" />
            <rect x="65" y="125" width="110" height="45" fill="none" stroke="#94A3B8" strokeWidth="2" strokeDasharray="6 4" />
            <ellipse cx="120" cy="125" rx="55" ry="14" fill="none" stroke="#94A3B8" strokeWidth="2" strokeDasharray="6 4" />
            <text x="120" y="152" textAnchor="middle" fill="#94A3B8" fontSize="13" fontWeight="bold" fontFamily="Fredoka, sans-serif">
              Add Base
            </text>
          </g>
        )}

        {/* 2. Cake Base (Bottom Tier) */}
        {baseData && (
          <g id="base-tier" className={animateLayer === 'base' ? 'layer-bounce' : ''}>
            {/* Base Body cylinder */}
            <path
              d="M 60,130 L 60,175 C 60,192 180,192 180,175 L 180,130 Z"
              fill={`url(#baseGrad_${baseData.id})`}
              stroke={baseData.secondaryColor}
              strokeWidth="1.5"
            />
            {/* Subtle baked sponge pores */}
            <circle cx="75" cy="165" r="1.5" fill={baseData.secondaryColor} opacity="0.6" />
            <circle cx="95" cy="174" r="1.5" fill={baseData.secondaryColor} opacity="0.6" />
            <circle cx="145" cy="172" r="1.5" fill={baseData.secondaryColor} opacity="0.6" />
            <circle cx="165" cy="160" r="1.5" fill={baseData.secondaryColor} opacity="0.6" />
            <circle cx="118" cy="177" r="1.5" fill={baseData.secondaryColor} opacity="0.6" />

            {/* Base Top Ellipse (visible before frosting) */}
            <ellipse
              cx="120"
              cy="130"
              rx="60"
              ry="16"
              fill={baseData.color}
              stroke={baseData.secondaryColor}
              strokeWidth="1.5"
            />
          </g>
        )}

        {/* 3. Filling Layer (Middle ribbon & dollop) */}
        {cake.base && fillingData && (
          <g id="filling-tier" className={animateLayer === 'filling' ? 'layer-bounce' : ''}>
            {/* Sandwiched cream line in the middle of sponge */}
            <path
              d="M 60,154 C 80,160 160,160 180,154 C 180,160 160,166 60,160 Z"
              fill={`url(#fillGrad_${fillingData.id})`}
            />
            {/* Little cream dollops oozing on side */}
            <ellipse cx="80" cy="158" rx="7" ry="4" fill={fillingData.color} />
            <ellipse cx="120" cy="160" rx="9" ry="5" fill={fillingData.color} />
            <ellipse cx="155" cy="158" rx="8" ry="4" fill={fillingData.color} />
            {/* Top cream bed before frosting */}
            {!cake.frosting && (
              <ellipse cx="120" cy="128" rx="54" ry="13" fill={fillingData.color} opacity="0.85" />
            )}
          </g>
        )}

        {/* 4. Frosting Layer (Rich glossy icing with luscious wavy drips) */}
        {cake.base && frostingData && (
          <g id="frosting-tier" className={animateLayer === 'frosting' ? 'layer-bounce' : ''}>
            {/* Top dome of icing */}
            <ellipse
              cx="120"
              cy="126"
              rx="62"
              ry="17"
              fill={`url(#frostGrad_${frostingData.id})`}
              stroke={frostingData.secondaryColor}
              strokeWidth="1"
            />

            {/* Frosting Drips hanging down the sides */}
            <path
              d="M 58,126
                 C 58,142 66,150 70,140
                 C 74,130 78,148 85,152
                 C 92,156 98,135 106,144
                 C 114,153 124,155 132,143
                 C 140,131 146,150 154,148
                 C 162,146 168,132 174,142
                 C 178,150 182,138 182,126
                 Z"
              fill={`url(#frostGrad_${frostingData.id})`}
            />

            {/* Glossy highlight curve on frosting */}
            <path
              d="M 78,121 C 95,114 140,114 158,120"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="3.5"
              strokeLinecap="round"
              opacity="0.65"
            />
            <path
              d="M 85,125 C 100,120 135,120 148,124"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.8"
            />
          </g>
        )}

        {/* 5. Decoration Layer (Sprinkles, Stars, Hearts, Dots, Swirls, Candies) */}
        {cake.base && cake.decoration && (
          <g id="decoration-tier" className={animateLayer === 'decoration' ? 'layer-bounce' : ''}>
            {cake.decoration === 'sprinkles' && (
              <g id="decor-sprinkles" strokeWidth="3" strokeLinecap="round">
                <line x1="85" y1="120" x2="95" y2="124" stroke="#FF5252" />
                <line x1="105" y1="116" x2="114" y2="122" stroke="#448AFF" />
                <line x1="125" y1="118" x2="135" y2="115" stroke="#FFD740" />
                <line x1="145" y1="122" x2="155" y2="119" stroke="#69F0AE" />
                <line x1="95" y1="129" x2="105" y2="132" stroke="#E040FB" />
                <line x1="118" y1="127" x2="128" y2="130" stroke="#FFAB40" />
                <line x1="138" y1="126" x2="146" y2="131" stroke="#FF5252" />
                <line x1="80" y1="125" x2="88" y2="128" stroke="#40C4FF" />
                <line x1="152" y1="127" x2="160" y2="123" stroke="#7C4DFF" />
              </g>
            )}

            {cake.decoration === 'stars' && (
              <g id="decor-stars" fill="#FFD700" stroke="#FFA000" strokeWidth="0.8">
                {/* 5-pointed star paths */}
                <polygon points="90,118 92,123 97,123 93,126 95,131 90,128 85,131 87,126 83,123 88,123" />
                <polygon points="115,115 117,120 122,120 118,123 120,128 115,125 110,128 112,123 108,120 113,120" transform="scale(1.1) translate(-10,-10)" />
                <polygon points="142,118 144,123 149,123 145,126 147,131 142,128 137,131 139,126 135,123 140,123" />
                <polygon points="102,126 104,130 108,130 105,132 106,136 102,134 98,136 100,132 96,130 100,130" />
                <polygon points="128,126 130,130 134,130 131,132 132,136 128,134 124,136 126,132 122,130 126,130" />
              </g>
            )}

            {cake.decoration === 'hearts' && (
              <g id="decor-hearts" fill="#FF4081" stroke="#C2185B" strokeWidth="0.8">
                <path d="M 90,120 C 90,116 85,114 82,117 C 79,114 74,116 74,120 C 74,125 82,129 82,129 C 82,129 90,125 90,120 Z" transform="scale(0.9) translate(10, 5)" />
                <path d="M 118,118 C 118,114 113,112 110,115 C 107,112 102,114 102,118 C 102,123 110,127 110,127 C 110,127 118,123 118,118 Z" transform="scale(1.0) translate(0, 0)" />
                <path d="M 146,120 C 146,116 141,114 138,117 C 135,114 130,116 130,120 C 130,125 138,129 138,129 C 138,129 146,125 146,120 Z" transform="scale(0.9) translate(15, 5)" />
                <path d="M 105,127 C 105,124 101,122 99,124 C 97,122 93,124 93,127 C 93,131 99,134 99,134 C 99,134 105,131 105,127 Z" transform="scale(0.8) translate(25, 25)" />
                <path d="M 135,127 C 135,124 131,122 129,124 C 127,122 123,124 123,127 C 123,131 129,134 129,134 C 129,134 135,131 135,127 Z" transform="scale(0.8) translate(25, 25)" />
              </g>
            )}

            {cake.decoration === 'dots' && (
              <g id="decor-dots">
                <circle cx="85" cy="122" r="4.5" fill="#E0F7FA" stroke="#80DEEA" strokeWidth="1" />
                <circle cx="83.5" cy="120.5" r="1.5" fill="#FFFFFF" />
                <circle cx="102" cy="118" r="5" fill="#E0F7FA" stroke="#80DEEA" strokeWidth="1" />
                <circle cx="100.5" cy="116.5" r="1.5" fill="#FFFFFF" />
                <circle cx="120" cy="121" r="5.5" fill="#E0F7FA" stroke="#80DEEA" strokeWidth="1" />
                <circle cx="118" cy="119" r="1.8" fill="#FFFFFF" />
                <circle cx="138" cy="118" r="5" fill="#E0F7FA" stroke="#80DEEA" strokeWidth="1" />
                <circle cx="136.5" cy="116.5" r="1.5" fill="#FFFFFF" />
                <circle cx="155" cy="122" r="4.5" fill="#E0F7FA" stroke="#80DEEA" strokeWidth="1" />
                <circle cx="153.5" cy="120.5" r="1.5" fill="#FFFFFF" />
              </g>
            )}

            {cake.decoration === 'swirls' && (
              <g id="decor-swirls" fill="none" stroke="#4E342E" strokeWidth="2.5" strokeLinecap="round">
                <path d="M 85,124 Q 95,116 105,124 T 125,123 T 145,124 T 158,122" />
                <path d="M 92,129 Q 104,122 116,130 T 136,128 T 150,129" strokeWidth="2" opacity="0.8" />
              </g>
            )}

            {cake.decoration === 'candies' && (
              <g id="decor-candies">
                <ellipse cx="88" cy="122" rx="5" ry="3.5" fill="#9C27B0" stroke="#7B1FA2" strokeWidth="0.8" transform="rotate(-15 88 122)" />
                <ellipse cx="106" cy="117" rx="5.5" ry="4" fill="#4CAF50" stroke="#388E3C" strokeWidth="0.8" transform="rotate(10 106 117)" />
                <ellipse cx="124" cy="121" rx="5.5" ry="4" fill="#FF9800" stroke="#F57C00" strokeWidth="0.8" transform="rotate(-8 124 121)" />
                <ellipse cx="142" cy="117" rx="5" ry="3.5" fill="#E91E63" stroke="#C2185B" strokeWidth="0.8" transform="rotate(15 142 117)" />
                <ellipse cx="156" cy="123" rx="4.5" ry="3" fill="#00BCD4" stroke="#0097A7" strokeWidth="0.8" transform="rotate(-12 156 123)" />
              </g>
            )}
          </g>
        )}

        {/* 6. Topping Layer (Cherry, Strawberry, Blueberry, Wafer, Choc Piece, Candy) */}
        {cake.base && cake.topping && (
          <g id="topping-tier" className={animateLayer === 'topping' ? 'layer-bounce' : ''}>
            {cake.topping === 'cherry' && (
              <g id="topping-cherry">
                {/* Green Cherry Stem with cute curve */}
                <path
                  d="M 120,95 C 122,80 135,70 142,66"
                  fill="none"
                  stroke="#4CAF50"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Small leaf */}
                <path d="M 135,74 Q 146,72 144,80 Q 138,82 135,74 Z" fill="#66BB6A" />
                {/* Glossy Red Maraschino Cherry */}
                <circle cx="120" cy="104" r="14" fill="#D50000" stroke="#B71C1C" strokeWidth="1.2" />
                {/* Specular gloss shines */}
                <circle cx="116" cy="99" r="3.5" fill="#FF8A80" opacity="0.9" />
                <circle cx="114" cy="97" r="1.5" fill="#FFFFFF" />
              </g>
            )}

            {cake.topping === 'strawberry' && (
              <g id="topping-strawberry">
                {/* Green leaves crown */}
                <path d="M 112,94 L 120,88 L 128,94 L 124,98 L 116,98 Z" fill="#4CAF50" />
                {/* Plump Strawberry body */}
                <path
                  d="M 108,96 C 106,104 114,118 120,121 C 126,118 134,104 132,96 C 130,92 110,92 108,96 Z"
                  fill="#E91E63"
                  stroke="#C2185B"
                  strokeWidth="1.2"
                />
                {/* Seeds */}
                <circle cx="116" cy="100" r="1" fill="#FFF59D" />
                <circle cx="124" cy="102" r="1" fill="#FFF59D" />
                <circle cx="118" cy="108" r="1" fill="#FFF59D" />
                <circle cx="122" cy="112" r="1" fill="#FFF59D" />
                <circle cx="112" cy="104" r="1" fill="#FFF59D" />
                <circle cx="128" cy="106" r="1" fill="#FFF59D" />
              </g>
            )}

            {cake.topping === 'blueberry' && (
              <g id="topping-blueberry">
                {/* Trio of blueberries */}
                <circle cx="112" cy="106" r="10" fill="#303F9F" stroke="#1A237E" strokeWidth="1" />
                <circle cx="110" cy="103" r="2.5" fill="#7986CB" opacity="0.8" />
                <circle cx="128" cy="106" r="10" fill="#3949AB" stroke="#1A237E" strokeWidth="1" />
                <circle cx="126" cy="103" r="2.5" fill="#7986CB" opacity="0.8" />
                <circle cx="120" cy="98" r="11" fill="#3F51B5" stroke="#1A237E" strokeWidth="1" />
                <circle cx="117" cy="95" r="3" fill="#9FA8DA" opacity="0.9" />
                <circle cx="116" cy="94" r="1.2" fill="#FFFFFF" />
                {/* Center blossom stars on berries */}
                <polygon points="120,96 121,98 123,98 121,99 122,101 120,100 118,101 119,99 117,98 119,98" fill="#1A237E" />
              </g>
            )}

            {cake.topping === 'wafer' && (
              <g id="topping-wafer" transform="rotate(-25 120 100)">
                {/* Diagonal Striped Wafer Stick */}
                <rect x="114" y="65" width="12" height="50" rx="4" fill="#D7CCC8" stroke="#8D6E63" strokeWidth="1" />
                <line x1="114" y1="72" x2="126" y2="76" stroke="#5D4037" strokeWidth="3" />
                <line x1="114" y1="82" x2="126" y2="86" stroke="#5D4037" strokeWidth="3" />
                <line x1="114" y1="92" x2="126" y2="96" stroke="#5D4037" strokeWidth="3" />
                <line x1="114" y1="102" x2="126" y2="106" stroke="#5D4037" strokeWidth="3" />
              </g>
            )}

            {cake.topping === 'choc_piece' && (
              <g id="topping-choc" transform="rotate(12 120 100)">
                {/* Elegant chocolate square medallion standing upright */}
                <rect x="106" y="86" width="28" height="28" rx="4" fill="#3E2723" stroke="#271612" strokeWidth="1.2" />
                <rect x="110" y="90" width="20" height="20" rx="2" fill="none" stroke="#5D4037" strokeWidth="1.5" />
                <text x="120" y="104" textAnchor="middle" fill="#8D6E63" fontSize="10" fontWeight="bold" fontFamily="Fredoka, sans-serif">
                  ♥
                </text>
              </g>
            )}

            {cake.topping === 'candy' && (
              <g id="topping-candy">
                {/* White stick */}
                <line x1="120" y1="92" x2="120" y2="122" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
                {/* Swirl Lollipop candy */}
                <circle cx="120" cy="88" r="14" fill="#FF4081" stroke="#C2185B" strokeWidth="1.5" />
                <path d="M 120,88 A 6,6 0 0,1 126,88 A 6,6 0 0,1 120,94 A 10,10 0 0,1 110,88" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 120,88 A 12,12 0 0,1 132,88" fill="none" stroke="#69F0AE" strokeWidth="2" strokeLinecap="round" />
              </g>
            )}
          </g>
        )}
      </svg>
    </div>
  );
};
