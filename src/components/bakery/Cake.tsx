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

/**
 * Adjust hex color brightness by a specified integer amount (-255 to +255).
 * Used to dynamically compute harmonious 3D lighting tones (highlights, shadows, speculars).
 */
function adjustColor(hex: string, amount: number): string {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map((c) => c + c).join('');
  }
  const num = parseInt(cleanHex, 16);
  if (isNaN(num)) return hex;
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
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

  // Derived 3D lighting colors for Base
  const baseColors = baseData
    ? {
        highlight: adjustColor(baseData.color, 35),
        specular: adjustColor(baseData.color, 55),
        core: baseData.color,
        shadow: baseData.secondaryColor,
        deepShadow: adjustColor(baseData.secondaryColor, -40),
        ambientRim: adjustColor(baseData.secondaryColor, -12)
      }
    : null;

  // Derived 3D lighting colors for Filling
  const fillColors = fillingData
    ? {
        highlight: adjustColor(fillingData.color, 45),
        specular: adjustColor(fillingData.color, 65),
        core: fillingData.color,
        shadow: fillingData.secondaryColor,
        deepShadow: adjustColor(fillingData.secondaryColor, -35),
        ambientRim: adjustColor(fillingData.secondaryColor, -10)
      }
    : null;

  // Derived 3D lighting colors for Frosting
  const frostColors = frostingData
    ? {
        highlight: adjustColor(frostingData.color, 45),
        specular: adjustColor(frostingData.color, 70),
        core: frostingData.color,
        shadow: frostingData.secondaryColor,
        deepShadow: adjustColor(frostingData.secondaryColor, -40),
        ambientRim: adjustColor(frostingData.secondaryColor, -15)
      }
    : null;

  const shape = cake.shape || 'round';

  return (
    <div
      className={`cake-display cake-${size} ${className}`}
      style={{ width: dimensions.width, height: dimensions.height, display: 'inline-block' }}
    >
      <svg
        viewBox={dimensions.viewBox}
        width="100%"
        height="100%"
        style={{
          overflow: 'visible',
          filter: 'drop-shadow(0px 10px 20px rgba(50, 25, 10, 0.22))'
        }}
      >
        <defs>
          {/* 1. Metallic & Porcelain Plate Gradients */}
          <linearGradient id="plateShadowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="plateChromeRim" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#CBD5E1" />
            <stop offset="25%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#E2E8F0" />
            <stop offset="75%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>

          <linearGradient id="plateSurfaceGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>

          {/* Ambient occlusion shadow under cake on plate */}
          <radialGradient id="cakePlateContactShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1E120A" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#2D1A0E" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#2D1A0E" stopOpacity="0" />
          </radialGradient>

          {/* 2. Dynamic 3D Base Gradients */}
          {baseColors && baseData && (
            <>
              {/* Directional 3D cylinder lighting: light glances at ~20%, deep falloff at ~85% */}
              <linearGradient id={`baseCylinder_${baseData.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={baseColors.shadow} />
                <stop offset="14%" stopColor={baseColors.highlight} />
                <stop offset="35%" stopColor={baseColors.core} />
                <stop offset="70%" stopColor={baseColors.shadow} />
                <stop offset="90%" stopColor={baseColors.deepShadow} />
                <stop offset="100%" stopColor={baseColors.ambientRim} />
              </linearGradient>

              {/* Top baked sponge ellipse with crust edge */}
              <radialGradient id={`baseTop_${baseData.id}`} cx="40%" cy="38%" r="65%">
                <stop offset="0%" stopColor={baseColors.highlight} />
                <stop offset="60%" stopColor={baseColors.core} />
                <stop offset="100%" stopColor={baseColors.shadow} />
              </radialGradient>
            </>
          )}

          {/* 3. Dynamic 3D Filling Gradients */}
          {fillColors && fillingData && (
            <>
              <linearGradient id={`fillCylinder_${fillingData.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={fillColors.shadow} />
                <stop offset="16%" stopColor={fillColors.highlight} />
                <stop offset="40%" stopColor={fillColors.core} />
                <stop offset="75%" stopColor={fillColors.shadow} />
                <stop offset="92%" stopColor={fillColors.deepShadow} />
                <stop offset="100%" stopColor={fillColors.ambientRim} />
              </linearGradient>

              <radialGradient id={`fillDollop_${fillingData.id}`} cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor={fillColors.specular} />
                <stop offset="30%" stopColor={fillColors.highlight} />
                <stop offset="70%" stopColor={fillColors.core} />
                <stop offset="100%" stopColor={fillColors.shadow} />
              </radialGradient>

              <radialGradient id={`fillTop_${fillingData.id}`} cx="42%" cy="36%" r="65%">
                <stop offset="0%" stopColor={fillColors.highlight} />
                <stop offset="65%" stopColor={fillColors.core} />
                <stop offset="100%" stopColor={fillColors.shadow} />
              </radialGradient>
            </>
          )}

          {/* 4. Dynamic 3D Frosting Gradients */}
          {frostColors && frostingData && (
            <>
              <linearGradient id={`frostCylinder_${frostingData.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={frostColors.shadow} />
                <stop offset="15%" stopColor={frostColors.highlight} />
                <stop offset="38%" stopColor={frostColors.core} />
                <stop offset="72%" stopColor={frostColors.shadow} />
                <stop offset="92%" stopColor={frostColors.deepShadow} />
                <stop offset="100%" stopColor={frostColors.ambientRim} />
              </linearGradient>

              <radialGradient id={`frostTop_${frostingData.id}`} cx="40%" cy="32%" r="68%">
                <stop offset="0%" stopColor={frostColors.specular} />
                <stop offset="25%" stopColor={frostColors.highlight} />
                <stop offset="65%" stopColor={frostColors.core} />
                <stop offset="95%" stopColor={frostColors.shadow} />
                <stop offset="100%" stopColor={frostColors.deepShadow} />
              </radialGradient>

              <radialGradient id={`frostRosette_${frostingData.id}`} cx="38%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                <stop offset="20%" stopColor={frostColors.highlight} />
                <stop offset="70%" stopColor={frostColors.core} />
                <stop offset="100%" stopColor={frostColors.shadow} />
              </radialGradient>
            </>
          )}

          {/* 5. Shading & Lighting Filters */}
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ============================================================ */}
        {/* 1. CAKE PEDESTAL / PLATTER                                  */}
        {/* ============================================================ */}
        {showPlate && (
          <g id="platter-group">
            {/* Cast shadow under platter on table/conveyor */}
            <ellipse cx="120" cy="206" rx="98" ry="14" fill="url(#plateShadowGrad)" />
            {/* Outer silver platter rim */}
            <ellipse cx="120" cy="198" rx="94" ry="18" fill="url(#plateChromeRim)" stroke="#94A3B8" strokeWidth="1.5" />
            {/* Inner bevel ring */}
            <ellipse cx="120" cy="196" rx="86" ry="15" fill="#E2E8F0" />
            {/* Porcelain / silver platter top face */}
            <ellipse cx="120" cy="194" rx="82" ry="13" fill="url(#plateSurfaceGrad)" />
            {/* Inner decorative rim ring */}
            <ellipse cx="120" cy="193" rx="72" ry="10.5" fill="none" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="4 2" />
            {/* Ambient occlusion shadow directly beneath the cake cylinder */}
            <ellipse cx="120" cy="180" rx="70" ry="12" fill="url(#cakePlateContactShadow)" />
          </g>
        )}

        {/* ============================================================ */}
        {/* EMPTY PLACEHOLDER GUIDE (When no base is chosen yet)         */}
        {/* ============================================================ */}
        {!cake.base && (
          <g id="empty-cake-guide" opacity="0.5">
            {/* 3D wireframe cylinder */}
            <ellipse cx="120" cy="170" rx="66" ry="17" fill="none" stroke="#94A3B8" strokeWidth="2" strokeDasharray="6 4" />
            <path d="M 54,126 L 54,170 C 54,192 186,192 186,170 L 186,126" fill="none" stroke="#94A3B8" strokeWidth="2" strokeDasharray="6 4" />
            <ellipse cx="120" cy="126" rx="66" ry="17" fill="none" stroke="#94A3B8" strokeWidth="2" strokeDasharray="6 4" />
            <text x="120" y="152" textAnchor="middle" fill="#64748B" fontSize="13" fontWeight="bold" fontFamily="Fredoka, sans-serif">
              Add Cake Base
            </text>
          </g>
        )}

        {/* ============================================================ */}
        {/* 2. 3D CAKE BASE                                             */}
        {/* ============================================================ */}
        {baseData && baseColors && (
          <g id="base-tier" className={animateLayer === 'base' ? 'layer-bounce' : ''}>
            {shape === 'round' && (
              <>
                {/* 2a. Bottom Sponge Layer (y: 152 -> 170 with curved bottom arc dipping to 187) */}
                <path
                  d="M 52,150 L 52,170 C 52,194 188,194 188,170 L 188,150 C 188,170 52,170 52,150 Z"
                  fill={`url(#baseCylinder_${baseData.id})`}
                  stroke={baseColors.shadow}
                  strokeWidth="0.8"
                />

                {/* Bottom rim shadow contour against plate */}
                <path
                  d="M 54,171 C 70,192 170,192 186,171"
                  fill="none"
                  stroke={baseColors.deepShadow}
                  strokeWidth="2"
                  opacity="0.75"
                />

                {/* Baked crumb texture specks (3D pores with tiny shadow and highlight) */}
                <g id="sponge-crumbs" opacity="0.65">
                  <circle cx="70" cy="168" r="1.2" fill={baseColors.deepShadow} />
                  <circle cx="70.5" cy="168.5" r="0.8" fill={baseColors.highlight} />
                  <circle cx="92" cy="176" r="1.4" fill={baseColors.deepShadow} />
                  <circle cx="92.6" cy="176.6" r="0.9" fill={baseColors.highlight} />
                  <circle cx="118" cy="178" r="1.2" fill={baseColors.deepShadow} />
                  <circle cx="118.5" cy="178.5" r="0.8" fill={baseColors.highlight} />
                  <circle cx="144" cy="176" r="1.4" fill={baseColors.deepShadow} />
                  <circle cx="166" cy="166" r="1.2" fill={baseColors.deepShadow} />
                  <circle cx="82" cy="142" r="1.1" fill={baseColors.deepShadow} />
                  <circle cx="152" cy="142" r="1.2" fill={baseColors.deepShadow} />
                </g>

                {/* 2b. Upper Sponge Layer (y: 126 -> 150) */}
                <path
                  d="M 52,126 L 52,150 C 52,170 188,170 188,150 L 188,126 Z"
                  fill={`url(#baseCylinder_${baseData.id})`}
                  stroke={baseColors.shadow}
                  strokeWidth="0.8"
                />

                {/* Baked crust rim highlight on left flank */}
                <path
                  d="M 53,127 L 53,168"
                  fill="none"
                  stroke={baseColors.highlight}
                  strokeWidth="1.2"
                  opacity="0.8"
                />

                {/* 2c. Top Ellipse of Sponge Tier */}
                <ellipse
                  cx="120"
                  cy="126"
                  rx="68"
                  ry="18"
                  fill={`url(#baseTop_${baseData.id})`}
                  stroke={baseColors.shadow}
                  strokeWidth="1.2"
                />

                {/* Baked crust edge rim definition */}
                <ellipse
                  cx="120"
                  cy="126"
                  rx="66.5"
                  ry="17"
                  fill="none"
                  stroke={baseColors.highlight}
                  strokeWidth="1"
                  opacity="0.75"
                />
              </>
            )}

            {shape === 'square' && (
              <>
                {/* 3D Isometric Square Sponge Cake */}
                {/* Left Face (in soft key light) */}
                <polygon
                  points="52,138 120,166 120,202 52,174"
                  fill={baseColors.core}
                  stroke={baseColors.shadow}
                  strokeWidth="1"
                />
                {/* Right Face (in shadow) */}
                <polygon
                  points="120,166 188,138 188,174 120,202"
                  fill={baseColors.deepShadow}
                  stroke={baseColors.shadow}
                  strokeWidth="1"
                />
                {/* Top Rhombus Face */}
                <polygon
                  points="120,110 188,138 120,166 52,138"
                  fill={baseColors.highlight}
                  stroke={baseColors.shadow}
                  strokeWidth="1.2"
                />
              </>
            )}

            {shape === 'heart' && (
              <>
                {/* 3D Isometric Heart Sponge Cake */}
                <path
                  d="M 120,138 C 105,116 52,120 52,148 C 52,174 100,192 120,202 C 140,192 188,174 188,148 C 188,120 135,116 120,138 Z"
                  fill={`url(#baseCylinder_${baseData.id})`}
                  stroke={baseColors.shadow}
                  strokeWidth="1.2"
                />
                <path
                  d="M 120,118 C 105,96 56,102 56,130 C 56,156 100,174 120,184 C 140,174 184,156 184,130 C 184,102 135,96 120,118 Z"
                  fill={`url(#baseTop_${baseData.id})`}
                  stroke={baseColors.shadow}
                  strokeWidth="1"
                />
              </>
            )}
          </g>
        )}

        {/* ============================================================ */}
        {/* 3. 3D SANDWICHED FILLING LAYER                              */}
        {/* ============================================================ */}
        {cake.base && fillingData && fillColors && (
          <g id="filling-tier" className={animateLayer === 'filling' ? 'layer-bounce' : ''}>
            {/* Seam groove shadow in the sponge */}
            <path
              d="M 51,146 C 51,168 189,168 189,146 L 189,155 C 189,175 51,175 51,155 Z"
              fill="rgba(20, 10, 5, 0.45)"
            />

            {/* Bulging 3D cream ribbon across the cake waist */}
            <path
              d="M 50,147 C 50,171 190,171 190,147 C 190,163 50,163 50,147 Z"
              fill={`url(#fillCylinder_${fillingData.id})`}
            />

            {/* Glossy highlight bead along the curved cream waist */}
            <path
              d="M 64,156 C 88,164 152,164 176,156"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.2"
              strokeLinecap="round"
              opacity="0.6"
            />
            <path
              d="M 72,157 C 92,163 145,163 166,157"
              fill="none"
              stroke={fillColors.specular}
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.8"
            />

            {/* 3D Oozing Cream/Jam Dollops along the middle seam */}
            {/* Left Dollop */}
            <ellipse cx="76" cy="159" rx="8" ry="5.5" fill="rgba(0,0,0,0.22)" />
            <ellipse cx="76" cy="157" rx="7.5" ry="5" fill={`url(#fillDollop_${fillingData.id})`} />
            <ellipse cx="74.5" cy="155" rx="3" ry="1.8" fill="#FFFFFF" opacity="0.75" />

            {/* Center-Left Dollop */}
            <ellipse cx="106" cy="164" rx="10" ry="6.5" fill="rgba(0,0,0,0.22)" />
            <ellipse cx="106" cy="162" rx="9.5" ry="6" fill={`url(#fillDollop_${fillingData.id})`} />
            <ellipse cx="104" cy="159.5" rx="3.8" ry="2" fill="#FFFFFF" opacity="0.8" />

            {/* Center-Right Dollop */}
            <ellipse cx="138" cy="164" rx="9" ry="6" fill="rgba(0,0,0,0.22)" />
            <ellipse cx="138" cy="162" rx="8.5" ry="5.5" fill={`url(#fillDollop_${fillingData.id})`} />
            <ellipse cx="136" cy="160" rx="3.5" ry="1.8" fill="#FFFFFF" opacity="0.75" />

            {/* Right Dollop */}
            <ellipse cx="166" cy="158" rx="8" ry="5" fill="rgba(0,0,0,0.22)" />
            <ellipse cx="166" cy="156" rx="7.5" ry="4.5" fill={`url(#fillDollop_${fillingData.id})`} />
            <ellipse cx="164.5" cy="154.5" rx="2.8" ry="1.5" fill="#FFFFFF" opacity="0.65" />

            {/* Top cream bed (visible before frosting is applied) */}
            {!cake.frosting && (
              <g id="top-filling-spread">
                <ellipse cx="120" cy="125" rx="63" ry="15.5" fill={`url(#fillTop_${fillingData.id})`} />
                <path
                  d="M 80,121 C 98,116 142,116 160,121"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity="0.5"
                />
              </g>
            )}
          </g>
        )}

        {/* ============================================================ */}
        {/* 4. 3D VOLUMETRIC FROSTING CAP (PURBLE PLACE SIGNATURE LOOK)   */}
        {/* ============================================================ */}
        {cake.base && frostingData && frostColors && (
          <g id="frosting-tier" className={animateLayer === 'frosting' ? 'layer-bounce' : ''}>
            {/* 4a. Ambient Occlusion Drop Shadow onto Sponge Below Drips */}
            <path
              d="M 50,129
                 C 50,147 58,157 64,147
                 C 68,138 72,158 80,163
                 C 88,168 94,143 102,152
                 C 110,161 116,168 126,164
                 C 134,160 140,142 148,154
                 C 156,164 162,156 168,145
                 C 174,136 182,154 190,129
                 C 190,135 50,135 50,129 Z"
              fill="rgba(35, 15, 5, 0.38)"
              transform="translate(1, 3)"
            />

            {/* 4b. Volumetric Front Frosting Curtain & Dripping Scallops */}
            <path
              d="M 50,125
                 C 50,145 58,154 64,144
                 C 68,135 72,155 80,160
                 C 88,165 94,140 102,149
                 C 110,158 116,165 126,161
                 C 134,157 140,139 148,151
                 C 156,161 162,153 168,142
                 C 174,133 182,151 190,125
                 C 190,142 50,142 50,125 Z"
              fill={`url(#frostCylinder_${frostingData.id})`}
              stroke={frostColors.shadow}
              strokeWidth="0.8"
            />

            {/* 4c. Bulbous 3D droplet bulbs at tips of major drips */}
            {/* Drip Bulb 1 (left) */}
            <ellipse cx="80" cy="158" rx="7" ry="5.5" fill={`url(#frostCylinder_${frostingData.id})`} />
            <circle cx="78.5" cy="156" r="2.2" fill="#FFFFFF" opacity="0.7" />

            {/* Drip Bulb 2 (center-left) */}
            <ellipse cx="125" cy="160" rx="8" ry="6" fill={`url(#frostCylinder_${frostingData.id})`} />
            <circle cx="123" cy="157.5" r="2.8" fill="#FFFFFF" opacity="0.8" />

            {/* Drip Bulb 3 (center-right) */}
            <ellipse cx="152" cy="150" rx="6.5" ry="5" fill={`url(#frostCylinder_${frostingData.id})`} />
            <circle cx="150.5" cy="148" r="2" fill="#FFFFFF" opacity="0.65" />

            {/* 4d. Frosting Top Dome Ellipse */}
            <ellipse
              cx="120"
              cy="124"
              rx="70"
              ry="19"
              fill={`url(#frostTop_${frostingData.id})`}
              stroke={frostColors.shadow}
              strokeWidth="1.2"
            />

            {/* 4e. Dual-Layer Confectionery Gloss / Specular Sheen */}
            {/* Broad soft glaze highlight */}
            <path
              d="M 68,118 C 90,111 150,111 172,118 C 152,122 88,122 68,118 Z"
              fill="#FFFFFF"
              opacity="0.32"
            />
            {/* Crisp intense specular reflection curve */}
            <path
              d="M 78,116 C 96,111 144,111 162,116"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="3.2"
              strokeLinecap="round"
              opacity="0.85"
            />
            <path
              d="M 88,121 C 104,117 136,117 152,121"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.9"
            />

            {/* 4f. Classic Comfy Cakes Whipped Cream Rosettes / Piped Peaks along Rim */}
            <g id="piped-rosettes">
              {[
                { cx: 58, cy: 125, r: 5.5 },
                { cx: 78, cy: 118, r: 6 },
                { cx: 104, cy: 113, r: 6.5 },
                { cx: 136, cy: 113, r: 6.5 },
                { cx: 162, cy: 118, r: 6 },
                { cx: 182, cy: 125, r: 5.5 }
              ].map((rosette, i) => (
                <g key={`rosette-${i}`}>
                  {/* Rosette base shadow */}
                  <ellipse cx={rosette.cx} cy={rosette.cy + 1} rx={rosette.r} ry={rosette.r * 0.55} fill="rgba(0,0,0,0.15)" />
                  {/* Rosette whipped dollop */}
                  <ellipse
                    cx={rosette.cx}
                    cy={rosette.cy}
                    rx={rosette.r}
                    ry={rosette.r * 0.65}
                    fill={`url(#frostRosette_${frostingData.id})`}
                    stroke={frostColors.shadow}
                    strokeWidth="0.6"
                  />
                  {/* Swirl ridge */}
                  <path
                    d={`M ${rosette.cx - rosette.r * 0.5},${rosette.cy} Q ${rosette.cx},${rosette.cy - rosette.r * 0.4} ${rosette.cx + rosette.r * 0.5},${rosette.cy}`}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    opacity="0.75"
                  />
                </g>
              ))}
            </g>
          </g>
        )}

        {/* ============================================================ */}
        {/* 5. 3D DECORATIONS (PERSPECTIVE TILTED & BEVELED)              */}
        {/* ============================================================ */}
        {cake.base && cake.decoration && (
          <g id="decoration-tier" className={animateLayer === 'decoration' ? 'layer-bounce' : ''}>
            {/* 5a. SPRINKLES: 3D Cylindrical Sugar Jimmies with Drop Shadows */}
            {cake.decoration === 'sprinkles' && (
              <g id="decor-sprinkles">
                {[
                  { x: 80, y: 122, angle: 18, color: '#FF3366', shadowColor: '#B3003B' },
                  { x: 100, y: 117, angle: -25, color: '#3399FF', shadowColor: '#0059B3' },
                  { x: 120, y: 123, angle: 35, color: '#FFCC00', shadowColor: '#B38F00' },
                  { x: 142, y: 116, angle: -15, color: '#33CC66', shadowColor: '#1F803E' },
                  { x: 160, y: 122, angle: 22, color: '#CC33FF', shadowColor: '#8000B3' },
                  { x: 92, y: 128, angle: -40, color: '#FF8800', shadowColor: '#B35F00' },
                  { x: 114, y: 127, angle: 12, color: '#00D9D9', shadowColor: '#008C8C' },
                  { x: 134, y: 128, angle: -30, color: '#FF3366', shadowColor: '#B3003B' },
                  { x: 152, y: 128, angle: 45, color: '#FFCC00', shadowColor: '#B38F00' },
                  { x: 74, y: 127, angle: -10, color: '#3399FF', shadowColor: '#0059B3' },
                  { x: 166, y: 125, angle: -20, color: '#33CC66', shadowColor: '#1F803E' }
                ].map((s, idx) => (
                  <g key={`sprinkle-${idx}`} transform={`translate(${s.x}, ${s.y}) rotate(${s.angle})`}>
                    {/* Drop shadow */}
                    <rect x="-6" y="-0.5" width="12" height="3.5" rx="1.7" fill="rgba(0,0,0,0.25)" />
                    {/* 3D Cylindrical body */}
                    <rect x="-6" y="-2" width="12" height="3.5" rx="1.7" fill={s.color} stroke={s.shadowColor} strokeWidth="0.6" />
                    {/* Top specular highlight line */}
                    <line x1="-4" y1="-1.2" x2="4" y2="-1.2" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
                  </g>
                ))}
              </g>
            )}

            {/* 5b. STARS: 3D Faceted Gold Sugar Candies */}
            {cake.decoration === 'stars' && (
              <g id="decor-stars">
                {[
                  { cx: 86, cy: 122, scale: 1.1 },
                  { cx: 110, cy: 118, scale: 1.3 },
                  { cx: 138, cy: 118, scale: 1.2 },
                  { cx: 158, cy: 122, scale: 1.0 },
                  { cx: 98, cy: 129, scale: 1.0 },
                  { cx: 126, cy: 129, scale: 1.1 }
                ].map((st, i) => (
                  <g key={`star-${i}`} transform={`translate(${st.cx}, ${st.cy}) scale(${st.scale})`}>
                    {/* Drop shadow */}
                    <polygon points="0,-7 2,-2 7,-2 3,1 5,6 0,3 -5,6 -3,1 -7,-2 -2,-2" fill="rgba(0,0,0,0.22)" transform="translate(1, 2)" />
                    {/* Shaded base facet */}
                    <polygon points="0,-7 2,-2 7,-2 3,1 5,6 0,3 -5,6 -3,1 -7,-2 -2,-2" fill="#FFA000" stroke="#FF8F00" strokeWidth="0.6" />
                    {/* Highlighted left facets */}
                    <polygon points="0,-7 0,3 -5,6 -3,1 -7,-2 -2,-2" fill="#FFD54F" />
                    <polygon points="0,-7 0,3 2,-2" fill="#FFF176" />
                    {/* Center glint */}
                    <circle cx="-0.8" cy="-1.5" r="1.2" fill="#FFFFFF" />
                  </g>
                ))}
              </g>
            )}

            {/* 5c. HEARTS: 3D Puffy Fondant Hearts */}
            {cake.decoration === 'hearts' && (
              <g id="decor-hearts">
                {[
                  { cx: 82, cy: 123, scale: 1.0, rot: -10 },
                  { cx: 106, cy: 118, scale: 1.2, rot: 5 },
                  { cx: 134, cy: 118, scale: 1.2, rot: -8 },
                  { cx: 158, cy: 123, scale: 1.0, rot: 12 },
                  { cx: 120, cy: 128, scale: 1.1, rot: 0 }
                ].map((h, i) => (
                  <g key={`heart-${i}`} transform={`translate(${h.cx}, ${h.cy}) rotate(${h.rot}) scale(${h.scale})`}>
                    {/* Drop shadow */}
                    <path
                      d="M 0,4 C -6,-1 -8,-6 -3,-7 C -1,-7 0,-4 0,-4 C 0,-4 1,-7 3,-7 C 8,-6 6,-1 0,4 Z"
                      fill="rgba(0,0,0,0.22)"
                      transform="translate(1, 2)"
                    />
                    {/* Puffy 3D heart body */}
                    <path
                      d="M 0,4 C -6,-1 -8,-6 -3,-7 C -1,-7 0,-4 0,-4 C 0,-4 1,-7 3,-7 C 8,-6 6,-1 0,4 Z"
                      fill="#FF4081"
                      stroke="#C2185B"
                      strokeWidth="0.8"
                    />
                    {/* Specular gloss sheen on lobes */}
                    <ellipse cx="-2.5" cy="-5" rx="1.8" ry="1.2" fill="#FFFFFF" opacity="0.8" />
                    <ellipse cx="2.5" cy="-5" rx="1.4" ry="0.9" fill="#FFFFFF" opacity="0.6" />
                  </g>
                ))}
              </g>
            )}

            {/* 5d. DOTS: 3D Iridescent Sugar Pearls */}
            {cake.decoration === 'dots' && (
              <g id="decor-pearls">
                {[
                  { cx: 80, cy: 124, r: 4.8 },
                  { cx: 96, cy: 119, r: 5.2 },
                  { cx: 114, cy: 117, r: 5.5 },
                  { cx: 132, cy: 117, r: 5.5 },
                  { cx: 150, cy: 119, r: 5.2 },
                  { cx: 164, cy: 124, r: 4.8 },
                  { cx: 104, cy: 128, r: 5.0 },
                  { cx: 124, cy: 128, r: 5.0 },
                  { cx: 142, cy: 128, r: 5.0 }
                ].map((p, i) => (
                  <g key={`pearl-${i}`}>
                    {/* Contact shadow */}
                    <ellipse cx={p.cx + 0.8} cy={p.cy + 1.2} rx={p.r} ry={p.r * 0.7} fill="rgba(0,0,0,0.22)" />
                    {/* 3D Sphere gradient */}
                    <circle cx={p.cx} cy={p.cy} r={p.r} fill="#E0F7FA" stroke="#80DEEA" strokeWidth="0.8" />
                    {/* Shaded crescent underside */}
                    <path
                      d={`M ${p.cx - p.r * 0.7},${p.cy + p.r * 0.5} A ${p.r},${p.r} 0 0,0 ${p.cx + p.r * 0.7},${p.cy + p.r * 0.5} A ${p.r * 0.8},${p.r * 0.5} 0 0,1 ${p.cx - p.r * 0.7},${p.cy + p.r * 0.5}`}
                      fill="#4DD0E1"
                      opacity="0.85"
                    />
                    {/* Brilliant white specular gleam */}
                    <circle cx={p.cx - p.r * 0.35} cy={p.cy - p.r * 0.35} r={p.r * 0.32} fill="#FFFFFF" />
                  </g>
                ))}
              </g>
            )}

            {/* 5e. SWIRLS: 3D Piped Ganache / Drizzle Ribbons */}
            {cake.decoration === 'swirls' && (
              <g id="decor-swirls">
                {/* Shadow stroke */}
                <path
                  d="M 80,125 Q 95,116 110,124 T 135,123 T 155,124 T 166,122"
                  fill="none"
                  stroke="rgba(20,10,5,0.3)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  transform="translate(1, 2)"
                />
                {/* Rich chocolate ganache body */}
                <path
                  d="M 80,125 Q 95,116 110,124 T 135,123 T 155,124 T 166,122"
                  fill="none"
                  stroke="#3E2723"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
                {/* Raised 3D glossy spine highlight */}
                <path
                  d="M 81,124.2 Q 95,115.5 110,123.2 T 135,122.2 T 155,123.2 T 165,121.2"
                  fill="none"
                  stroke="#8D6E63"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  opacity="0.85"
                />
                {/* Secondary drizzle accent */}
                <path
                  d="M 88,130 Q 104,123 120,131 T 142,129 T 156,130"
                  fill="none"
                  stroke="#4E342E"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 89,129.5 Q 104,122.5 120,130.5 T 142,128.5 T 155,129.5"
                  fill="none"
                  stroke="#A1887F"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                  opacity="0.8"
                />
              </g>
            )}

            {/* 5f. CANDIES: 3D Jewel Jelly Drops / Dragees */}
            {cake.decoration === 'candies' && (
              <g id="decor-candies">
                {[
                  { cx: 86, cy: 123, color: '#9C27B0', strokeColor: '#6A1B9A', rot: -15 },
                  { cx: 104, cy: 118, color: '#4CAF50', strokeColor: '#2E7D32', rot: 10 },
                  { cx: 122, cy: 122, color: '#FF9800', strokeColor: '#E65100', rot: -8 },
                  { cx: 140, cy: 118, color: '#E91E63', strokeColor: '#AD1457', rot: 15 },
                  { cx: 158, cy: 123, color: '#00BCD4', strokeColor: '#00838F', rot: -12 }
                ].map((c, i) => (
                  <g key={`candy-${i}`} transform={`translate(${c.cx}, ${c.cy}) rotate(${c.rot})`}>
                    {/* Shadow */}
                    <ellipse cx="1" cy="2" rx="5.5" ry="4" fill="rgba(0,0,0,0.22)" />
                    {/* 3D Jelly drop body */}
                    <ellipse cx="0" cy="0" rx="5.5" ry="4" fill={c.color} stroke={c.strokeColor} strokeWidth="0.8" />
                    {/* Internal glow */}
                    <ellipse cx="-1" cy="-0.8" rx="3.5" ry="2" fill="#FFFFFF" opacity="0.45" />
                    {/* Curved glossy highlight spot */}
                    <ellipse cx="-1.8" cy="-1.5" rx="1.8" ry="1" fill="#FFFFFF" opacity="0.9" />
                  </g>
                ))}
              </g>
            )}
          </g>
        )}

        {/* ============================================================ */}
        {/* 6. 3D TOPPINGS (REALISTIC SHADING & CONTACT SHADOWS)          */}
        {/* ============================================================ */}
        {cake.base && cake.topping && (
          <g id="topping-tier" className={animateLayer === 'topping' ? 'layer-bounce' : ''}>
            {/* 6a. CHERRY: Glossy Maraschino Cherry with Stem & Leaf */}
            {cake.topping === 'cherry' && (
              <g id="topping-cherry">
                {/* Contact shadow on frosting */}
                <ellipse cx="123" cy="116" rx="14" ry="5" fill="rgba(20, 10, 5, 0.35)" />

                {/* Plump 3D Cherry Body */}
                <circle cx="120" cy="103" r="14.5" fill="#D50000" stroke="#8B0000" strokeWidth="1.2" />
                {/* Shaded underside crescent */}
                <path
                  d="M 106,104 A 14.5,14.5 0 0,0 134,104 A 14.5,11 0 0,1 106,104 Z"
                  fill="#5C0000"
                  opacity="0.85"
                />
                {/* Warm ambient bounce reflection on bottom right */}
                <path
                  d="M 124,115 A 14.5,14.5 0 0,0 133,107"
                  fill="none"
                  stroke="#FF5252"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.6"
                />
                {/* Primary curved specular gloss */}
                <ellipse cx="114.5" cy="97" rx="4.5" ry="3" fill="#FFFFFF" opacity="0.85" transform="rotate(-25 114.5 97)" />
                {/* Secondary pinpoint glint */}
                <circle cx="111.5" cy="101.5" r="1.5" fill="#FFFFFF" opacity="0.95" />

                {/* Cherry stem indentation pit */}
                <ellipse cx="120" cy="94" rx="3.5" ry="1.5" fill="#5C0000" />

                {/* Curved woody green stem */}
                <path
                  d="M 120,94 C 122,78 136,68 144,63"
                  fill="none"
                  stroke="#2E7D32"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
                <path
                  d="M 120,94 C 122,78 136,68 144,63"
                  fill="none"
                  stroke="#66BB6A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />

                {/* 3D Folded green leaf with vein */}
                <g transform="translate(136, 70) rotate(-15)">
                  {/* Leaf drop shadow */}
                  <path d="M 0,0 Q 12,-3 14,8 Q 5,9 0,0 Z" fill="rgba(0,0,0,0.18)" transform="translate(1, 2)" />
                  {/* Leaf upper half (light) */}
                  <path d="M 0,0 Q 12,-5 14,6 L 0,0 Z" fill="#81C784" stroke="#2E7D32" strokeWidth="0.8" />
                  {/* Leaf lower half (shadow) */}
                  <path d="M 0,0 L 14,6 Q 5,10 0,0 Z" fill="#388E3C" stroke="#2E7D32" strokeWidth="0.8" />
                  {/* Center vein */}
                  <line x1="0" y1="0" x2="13" y2="5.5" stroke="#1B5E20" strokeWidth="0.8" />
                </g>
              </g>
            )}

            {/* 6b. STRAWBERRY: 3D Berry with Gold Seeds & Calyx Crown */}
            {cake.topping === 'strawberry' && (
              <g id="topping-strawberry">
                {/* Contact shadow */}
                <ellipse cx="121" cy="118" rx="15" ry="5.5" fill="rgba(20, 10, 5, 0.35)" />

                {/* Tapered 3D Berry Body */}
                <path
                  d="M 108,95 C 104,105 113,121 120,123 C 127,121 136,105 132,95 C 129,90 111,90 108,95 Z"
                  fill="#E91E63"
                  stroke="#880E4F"
                  strokeWidth="1.2"
                />
                {/* Shadow flank on right side */}
                <path
                  d="M 120,92 C 128,92 133,103 131,114 C 127,121 120,123 120,123 Z"
                  fill="#AD1457"
                  opacity="0.8"
                />
                {/* Left shoulder highlight */}
                <path
                  d="M 110,96 C 108,102 112,112 116,117"
                  fill="none"
                  stroke="#FF80AB"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  opacity="0.6"
                />

                {/* Golden Seeds with micro-indentation shadows */}
                {[
                  { cx: 114, cy: 98 },
                  { cx: 122, cy: 99 },
                  { cx: 116, cy: 105 },
                  { cx: 124, cy: 107 },
                  { cx: 112, cy: 102 },
                  { cx: 128, cy: 103 },
                  { cx: 119, cy: 112 },
                  { cx: 123, cy: 116 }
                ].map((seed, idx) => (
                  <g key={`seed-${idx}`}>
                    <ellipse cx={seed.cx} cy={seed.cy + 0.6} rx="1.2" ry="0.8" fill="#560027" />
                    <ellipse cx={seed.cx} cy={seed.cy} rx="0.9" ry="1.2" fill="#FFF59D" />
                  </g>
                ))}

                {/* Flaring green calyx crown leaves */}
                <path
                  d="M 120,91 L 112,85 L 115,92 L 105,92 L 114,95 L 118,97 L 122,97 L 126,95 L 135,92 L 125,92 L 128,85 Z"
                  fill="#4CAF50"
                  stroke="#1B5E20"
                  strokeWidth="0.8"
                />
                <circle cx="120" cy="91" r="2" fill="#2E7D32" />
              </g>
            )}

            {/* 6c. BLUEBERRY: Overlapping Trio of 3D Berries with Bloom */}
            {cake.topping === 'blueberry' && (
              <g id="topping-blueberry">
                {/* Contact shadow */}
                <ellipse cx="121" cy="117" rx="18" ry="6" fill="rgba(10, 10, 30, 0.35)" />

                {/* Back Left Berry */}
                <circle cx="111" cy="107" r="10.5" fill="#283593" stroke="#1A237E" strokeWidth="1" />
                <circle cx="109" cy="104" r="3" fill="#7986CB" opacity="0.6" />
                <circle cx="108" cy="103" r="1.2" fill="#FFFFFF" opacity="0.85" />

                {/* Back Right Berry */}
                <circle cx="130" cy="107" r="10.5" fill="#303F9F" stroke="#1A237E" strokeWidth="1" />
                <circle cx="128" cy="104" r="3" fill="#7986CB" opacity="0.6" />
                <circle cx="127" cy="103" r="1.2" fill="#FFFFFF" opacity="0.85" />

                {/* Front Center Berry */}
                <circle cx="120" cy="99" r="12" fill="#3F51B5" stroke="#1A237E" strokeWidth="1.2" />
                {/* Velvety bloom highlight */}
                <circle cx="116.5" cy="95.5" r="4.5" fill="#9FA8DA" opacity="0.75" />
                <circle cx="115" cy="94" r="1.8" fill="#FFFFFF" opacity="0.95" />
                {/* Star blossom calyx indent on top */}
                <polygon
                  points="120,97 121.5,99.5 124,99.5 122,101 123,103.5 120,102 117,103.5 118,101 116,99.5 118.5,99.5"
                  fill="#1A237E"
                />
              </g>
            )}

            {/* 6d. WAFER: 3D Pirouline Cylinder with Hollow Chocolate Core */}
            {cake.topping === 'wafer' && (
              <g id="topping-wafer" transform="rotate(-24 120 100)">
                {/* Contact shadow at insertion into cake */}
                <ellipse cx="120" cy="116" rx="8" ry="3.5" fill="rgba(20, 10, 5, 0.4)" />

                {/* 3D Wafer Cylinder Body */}
                <rect x="113" y="62" width="14" height="54" rx="1" fill="#D7CCC8" stroke="#8D6E63" strokeWidth="1" />
                {/* Shaded right flank */}
                <rect x="120" y="62" width="7" height="54" fill="#A1887F" opacity="0.6" />

                {/* Spiraling Chocolate Ganache Ribbons */}
                {[70, 80, 90, 100, 110].map((y, idx) => (
                  <g key={`stripe-${idx}`}>
                    <line x1="113" y1={y} x2="127" y2={y + 5} stroke="#4E342E" strokeWidth="3.5" />
                    <line x1="113" y1={y - 0.5} x2="127" y2={y + 4.5} stroke="#6D4C41" strokeWidth="1.2" opacity="0.8" />
                  </g>
                ))}

                {/* Hollow Top Ellipse showing chocolate ganache inside */}
                <ellipse cx="120" cy="62" rx="7" ry="3" fill="#EFEBE9" stroke="#8D6E63" strokeWidth="1" />
                <ellipse cx="120" cy="62" rx="4.5" ry="1.8" fill="#3E2723" />
              </g>
            )}

            {/* 6e. CHOC PIECE: 3D Beveled Chocolate Plaque with Heart */}
            {cake.topping === 'choc_piece' && (
              <g id="topping-choc" transform="rotate(10 120 100)">
                {/* Contact shadow */}
                <ellipse cx="120" cy="116" rx="16" ry="5" fill="rgba(20, 10, 5, 0.4)" />

                {/* 3D Thickness Extrusion (bottom & right side) */}
                <polygon points="106,112 134,112 137,115 109,115" fill="#20120E" />
                <polygon points="134,84 137,87 137,115 134,112" fill="#2D1913" />

                {/* Front Beveled Face */}
                <rect x="106" y="84" width="28" height="28" rx="3" fill="#3E2723" stroke="#271612" strokeWidth="1.2" />
                {/* Inner beveled frame border */}
                <rect x="109.5" y="87.5" width="21" height="21" rx="2" fill="none" stroke="#5D4037" strokeWidth="1.5" />
                <line x1="110" y1="88" x2="130" y2="88" stroke="#8D6E63" strokeWidth="1" opacity="0.8" />

                {/* Embossed Gold Heart Motif */}
                <path
                  d="M 120,102 C 117,99 114,96 117,94 C 119,94 120,96 120,96 C 120,96 121,94 123,94 C 126,96 123,99 120,102 Z"
                  fill="#FFB300"
                  stroke="#FFA000"
                  strokeWidth="0.8"
                />
              </g>
            )}

            {/* 6f. CANDY: 3D Swirl Lollipop with Translucent Sheen */}
            {cake.topping === 'candy' && (
              <g id="topping-candy">
                {/* Insertion shadow */}
                <ellipse cx="120" cy="116" rx="8" ry="3.5" fill="rgba(20, 10, 5, 0.35)" />

                {/* 3D Stick */}
                <line x1="120" y1="88" x2="120" y2="122" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
                <line x1="119.2" y1="88" x2="119.2" y2="122" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />

                {/* Lollipop Disc Body */}
                <circle cx="120" cy="85" r="15" fill="#FF4081" stroke="#C2185B" strokeWidth="1.5" />
                {/* Candy-cane spiral ribbons */}
                <path
                  d="M 120,85 A 6,6 0 0,1 126,85 A 6,6 0 0,1 120,91 A 10,10 0 0,1 110,85"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M 120,85 A 12,12 0 0,1 132,85"
                  fill="none"
                  stroke="#00E676"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                {/* Glassy specular shine curve */}
                <path
                  d="M 112,75 A 12,12 0 0,1 128,75"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity="0.8"
                />
              </g>
            )}
          </g>
        )}
      </svg>
    </div>
  );
};
