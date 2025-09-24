import React, { useState } from 'react';
import { useCategories } from '../../shared/api/hooks/useCategoryQueries';
import { useSatellites } from '../../shared/api/hooks/useSatelliteQueries';
import { useAppStore } from '../../shared/store/useAppStore';
import { StatusIndicator } from './components/StatusIndicator';
import { SatelliteDetail } from './components/SatelliteDetail';
import { SatelliteCard, toSatLite } from './components/SatelliteCard';
import type { Category, Satellite } from '../../shared/api/types';

const SatelliteList: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);

  // Get the selected satellite ID and setter from the store
  const selectedSatelliteId = useAppStore((state) => state.selectedSatelliteId);
  const setSelectedSatelliteId = useAppStore((state) => state.setSelectedSatelliteId);

  // Fetch categories and satellites using the API hooks
  const { data: categoriesData, isLoading: isLoadingCategories, isError: categoriesError } = useCategories();
  const { data: satellitesData, isLoading: isLoadingSatellites, isError: satellitesError } = useSatellites({
    category: selectedCategorySlug ? parseInt(selectedCategorySlug) : undefined,
    search: search.trim() || undefined,
  });

  const categories: Category[] = categoriesData?.results || [];
  const satellites: Satellite[] = satellitesData?.results || [];

  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategorySlug(categoryId.toString());
  };

  const handleClearFilter = () => {
    setSelectedCategorySlug(null);
  };

  const handleSatelliteClick = (satelliteId: number) => {
    setSelectedSatelliteId(satelliteId);
  };

  // Show satellite detail view if a satellite is selected
  if (selectedSatelliteId) {
    return <SatelliteDetail />;
  }

  return (
    <aside className="w-[280px] md:w-[320px] h-screen overflow-y-auto p-4 pr-3 bg-slate-900/80 text-slate-100 space-y-4 shrink-0">
      <h2 className="text-base font-semibold tracking-wide">Mission Control</h2>

      {/* Status */}
      <StatusIndicator />

      {/* Search */}
      <section className="space-y-2">
        <label htmlFor="satellite-search" className="text-xs font-medium uppercase tracking-wide">Search</label>
        <input
          id="satellite-search"
          className="w-full rounded-md bg-slate-800/80 px-3 py-2 text-sm outline-none focus:ring-2 ring-sky-500"
          placeholder="Search satellites, NORAD ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </section>

      {/* Categories */}
      <section className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide">Categories</h3>
        {isLoadingCategories && (
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <div className="w-4 h-4 border-2 border-sky-500/30 border-t-sky-500 rounded-full animate-spin" />
            Loading categories...
          </div>
        )}
        {categoriesError && (
          <div className="text-xs text-red-400">Failed to load categories</div>
        )}
        <div className="flex flex-wrap gap-2">
          {categories.map((category: Category) => {
            const active = selectedCategorySlug === category.id.toString();
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`px-2.5 py-1.5 rounded-md text-xs border transition ${
                  active
                    ? 'bg-sky-600 text-white border-transparent'
                    : 'bg-slate-800/70 text-slate-200 border-slate-700 hover:bg-slate-700/70'
                }`}
                style={!active ? { backgroundColor: `${category.color_hex}12`, borderColor: `${category.color_hex}33` } : undefined}
                aria-pressed={active}
                title={category.display_name}
              >
                <span className="inline-flex items-center gap-2 min-w-0">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: category.color_hex }} />
                  <span className="truncate max-w-[9rem] md:max-w-[12rem]">{category.display_name}</span>
                </span>
              </button>
            );
          })}
          {selectedCategorySlug && (
            <button onClick={handleClearFilter} className="px-2.5 py-1.5 rounded-md text-xs bg-slate-700/60 text-slate-300 border border-slate-600">
              Clear
            </button>
          )}
        </div>
      </section>

      {/* Satellites */}
      <section className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide">Satellites</h3>
        {isLoadingSatellites && (
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <div className="w-4 h-4 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
            Loading satellites...
          </div>
        )}
        {satellitesError && <div className="text-xs text-red-400">Failed to load satellites</div>}
        <ul className="space-y-2">
          {satellites.map((s) => (
            <SatelliteCard
              key={s.id}
              sat={toSatLite(s, categories)}
              onClick={() => handleSatelliteClick(s.id)}
            />
          ))}
          {satellites.length === 0 && !isLoadingSatellites && !satellitesError && (
            <li className="text-xs text-slate-400 py-4 text-center">No satellites found</li>
          )}
        </ul>
      </section>
    </aside>
  );
};

export default SatelliteList;