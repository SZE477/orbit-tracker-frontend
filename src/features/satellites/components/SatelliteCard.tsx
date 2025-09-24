import React from 'react';
import type { Satellite, Category } from '../../../shared/api/types';

export type SatLite = {
  id: number;
  name: string;
  norad: string | number;
  country?: string | null;
  orbit?: string | null;
  color?: string | null;
  iconUrl?: string | null;
  active?: boolean;
};
const FALLBACK_COLOR = '#38bdf8'; // bright sky-400 fallback for visibility

function normalizeHex(input?: string | null): string {
  if (!input) return FALLBACK_COLOR;
  let hex = input.trim();
  if (!hex.startsWith('#')) hex = `#${hex}`;
  if (hex.length === 4) {
    // #abc -> #aabbcc
    hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }
  return hex.length === 7 ? hex : FALLBACK_COLOR;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return null;
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (v: number) => v.toString(16).padStart(2, '0');
  return `#${toHex(Math.max(0, Math.min(255, Math.round(r))))}${toHex(Math.max(0, Math.min(255, Math.round(g))))}${toHex(Math.max(0, Math.min(255, Math.round(b))))}`;
}

function luminance(rgb: { r: number; g: number; b: number }): number {
  // Relative luminance; simple sRGB approximation
  return (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255;
}

function lightenHex(hex: string, amount = 0.35): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return FALLBACK_COLOR;
  const r = rgb.r + (255 - rgb.r) * amount;
  const g = rgb.g + (255 - rgb.g) * amount;
  const b = rgb.b + (255 - rgb.b) * amount;
  return rgbToHex(r, g, b);
}

function getVisibleColor(input?: string | null): string {
  const hex = normalizeHex(input);
  const rgb = hexToRgb(hex);
  if (!rgb) return FALLBACK_COLOR;
  const y = luminance(rgb);
  // If too dark, lighten for contrast against dark background
  return y < 0.35 ? lightenHex(hex, 0.4) : hex;
}


export function SatelliteCard({ sat, onClick }: { sat: SatLite; onClick?: () => void }) {
  return (
    <li
      className="rounded-lg bg-slate-800/60 hover:bg-slate-800/80 transition p-2 cursor-pointer"
      onClick={onClick}
      title={sat.name}
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* Avatar/Icon */}
        {sat.iconUrl ? (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); alert(sat.name); }}
            aria-label={`Show satellite name: ${sat.name}`}
            className="h-6 w-6 md:h-7 md:w-7 shrink-0 ring-1 ring-white/20 ring-offset-[1px] ring-offset-slate-900/60 rounded overflow-hidden"
            title={sat.name}
          >
            <img
              src={sat.iconUrl}
              alt=""
              className="h-full w-full object-contain"
            />
          </button>
        ) : (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); alert(sat.name); }}
            aria-label={`Show satellite name: ${sat.name}`}
            className="h-6 w-6 md:h-7 md:w-7 rounded-full shrink-0 ring-1 ring-white/25 ring-offset-[1px] ring-offset-slate-900/60"
            style={{ backgroundColor: getVisibleColor(sat.color) }}
            title={sat.name}
          />
        )}

        {/* Text */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium truncate md:line-clamp-2" title={sat.name}>{sat.name}</p>
          <p className="text-xs text-slate-400 truncate" title={`NORAD ${sat.norad} • ${sat.country ?? ''} • ${sat.orbit ?? ''}`}>
            NORAD {sat.norad}{sat.country ? ` • ${sat.country}` : ''}{sat.orbit ? ` • ${sat.orbit}` : ''}
          </p>
        </div>

        {/* Optional status dot / chevron */}
        {typeof sat.active !== 'undefined' && (
          <span
            className={`h-2 w-2 rounded-full shrink-0 ${sat.active ? 'bg-emerald-400' : 'bg-slate-500'}`}
            aria-hidden
          />
        )}
        <button className="ml-1 shrink-0 text-slate-300 hover:text-white" aria-label="Focus">›</button>
      </div>
    </li>
  );
}

// Helper to adapt existing Satellite + Category types to SatLite
export function toSatLite(s: Satellite, categories: Category[]): SatLite {
  const cat = categories.find(c => c.id === s.category);
  return {
    id: s.id,
    name: s.name,
    norad: s.norad_id,
    country: s.country,
    orbit: cat?.display_name ?? null,
    color: cat?.color_hex ?? null,
    active: s.is_active,
  };
}

