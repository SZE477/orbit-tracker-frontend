import { useCategories, useSatellites } from '@/shared/api/apiClient';
import { Input } from '@/shared/components/ui/input';
import { Category } from '@/shared/api/types';
import { useState } from 'react';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Label } from '@/shared/components/ui/label';
import { ScrollArea } from '@/shared/components/ui/scroll-area';

export const Sidebar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  const { data: satellites, isLoading: isLoadingSatellites } = useSatellites({
    search: debouncedSearch,
    category: selectedCategories,
  });

  const handleCategoryToggle = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  };

  return (
    <aside className="z-10 flex h-full w-80 flex-shrink-0 flex-col border-r bg-background/80 p-4 backdrop-blur-sm">
      <h1 className="text-2xl font-bold">SatViz</h1>
      <Input
        placeholder="Search by name or NORAD ID..."
        className="my-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <h2 className="mb-2 font-semibold">Categories</h2>
      <ScrollArea className="mb-4 flex-shrink">
        {isLoadingCategories && <p>Loading categories...</p>}
        {categories?.map((cat: Category) => (
          <div key={cat.id} className="flex items-center space-x-2 py-1">
            <Checkbox
              id={cat.slug}
              checked={selectedCategories.includes(cat.slug)}
              onCheckedChange={() => handleCategoryToggle(cat.slug)}
            />
            <Label htmlFor={cat.slug} className="flex items-center gap-2">
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{ backgroundColor: cat.color }}
              ></span>
              {cat.name}
            </Label>
          </div>
        ))}
      </ScrollArea>

      <h2 className="mb-2 font-semibold">Satellites</h2>
      <ScrollArea className="flex-grow">
        {isLoadingSatellites && <p>Loading satellites...</p>}
        {satellites?.map((sat) => (
          <div key={sat.norad_id} className="cursor-pointer rounded-md p-2 hover:bg-secondary">
            <p className="font-medium">{sat.name}</p>
            <p className="text-xs text-muted-foreground">NORAD: {sat.norad_id}</p>
          </div>
        ))}
      </ScrollArea>
    </aside>
  );
};