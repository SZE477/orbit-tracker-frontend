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
export declare function SatelliteCard({ sat, onClick }: {
    sat: SatLite;
    onClick?: () => void;
}): import("react/jsx-runtime").JSX.Element;
export declare function toSatLite(s: Satellite, categories: Category[]): SatLite;
