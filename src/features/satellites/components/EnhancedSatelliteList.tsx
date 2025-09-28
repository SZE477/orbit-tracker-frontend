import React, { useState, useMemo } from 'react';
import { Search, Filter, Satellite, Globe, Zap } from 'lucide-react';
import { useSatellites } from '@/shared/api/hooks/useSatelliteQueries';
import { useCategories } from '@/shared/api/hooks/useCategoryQueries';
import { useAppStore } from '@/shared/store/useAppStore';
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';

// Shadcn/UI Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface SatelliteFilters {
  search: string;
  category: string;
  status: 'all' | 'active' | 'inactive';
  country: string;
}

const EnhancedSatelliteList: React.FC = () => {
  const [filters, setFilters] = useState<SatelliteFilters>({
    search: '',
    category: 'all',
    status: 'all',
    country: 'all',
  });

  const debouncedSearch = useDebouncedValue(filters.search, 300);
  const { setSelectedSatelliteId, selectedSatelliteId } = useAppStore();

  // API calls with filters
  const { data: categoriesData } = useCategories();
  const { data: satellitesData, isLoading, error } = useSatellites({
    search: debouncedSearch || undefined,
    category: filters.category !== 'all' ? parseInt(filters.category) : undefined,
    is_active: filters.status !== 'all' ? filters.status === 'active' : undefined,
  });

  const categories = categoriesData?.results ?? [];
  const satellites = satellitesData?.results ?? [];

  // Get unique countries for filter
  const countries = useMemo(() => {
    const countrySet = new Set(satellites.map(sat => sat.country).filter(Boolean));
    return Array.from(countrySet).sort();
  }, [satellites]);

  // Filter by country (client-side since API might not support it)
  const filteredSatellites = useMemo(() => {
    if (filters.country === 'all') return satellites;
    return satellites.filter(sat => sat.country === filters.country);
  }, [satellites, filters.country]);

  const getSatelliteIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'communication': return <Satellite className="h-4 w-4" />;
      case 'navigation': return <Globe className="h-4 w-4" />;
      case 'research': return <Zap className="h-4 w-4" />;
      default: return <Satellite className="h-4 w-4" />;
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-500' : 'bg-red-500';
  };

  if (error) {
    return (
      <Card className="glass-panel">
        <CardContent className="p-6">
          <p className="text-destructive">Failed to load satellites</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="glass-panel">
        <CardHeader className="pb-3">
          <CardTitle className="holographic-text">Mission Control</CardTitle>
          <p className="text-sm text-muted-foreground">
            Tracking {filteredSatellites.length} satellites
          </p>
        </CardHeader>
      </Card>

      {/* Search and Filters */}
      <Card className="glass-panel">
        <CardContent className="p-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search satellites..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="pl-10"
            />
          </div>

          {/* Filter Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full">
                <Filter className="mr-2 h-4 w-4" />
                Advanced Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Satellites</SheetTitle>
                <SheetDescription>
                  Refine your satellite search with advanced filters
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-4 mt-6">
                {/* Category Filter */}
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={filters.category}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.display_name || category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={filters.status}
                    onValueChange={(value: 'all' | 'active' | 'inactive') => 
                      setFilters(prev => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active Only</SelectItem>
                      <SelectItem value="inactive">Inactive Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Country Filter */}
                <div>
                  <label className="text-sm font-medium">Country</label>
                  <Select
                    value={filters.country}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, country: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Countries</SelectItem>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </CardContent>
      </Card>

      {/* Satellite List */}
      <Card className="glass-panel">
        <ScrollArea className="h-[600px]">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 text-center text-muted-foreground">
                Loading satellites...
              </div>
            ) : filteredSatellites.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                No satellites found matching your criteria
              </div>
            ) : (
              <div className="space-y-1">
                {filteredSatellites.map((satellite, index) => (
                  <div key={satellite.id}>
                    <div
                      className={`p-4 cursor-pointer transition-colors hover:bg-accent/10 ${
                        selectedSatelliteId === satellite.id ? 'bg-accent/20' : ''
                      }`}
                      onClick={() => setSelectedSatelliteId(satellite.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            {getSatelliteIcon(satellite.satellite_type)}
                            <div
                              className={`w-2 h-2 rounded-full ${getStatusColor(satellite.is_active)} ${
                                satellite.is_active ? 'satellite-pulse' : ''
                              }`}
                            />
                          </div>
                          <div>
                            <p className="font-medium">{satellite.name}</p>
                            <p className="text-sm text-muted-foreground">
                              NORAD: {satellite.norad_id}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {satellite.satellite_type && (
                            <Badge variant="outline" className="text-xs">
                              {satellite.satellite_type}
                            </Badge>
                          )}
                          <Badge 
                            variant={satellite.is_active ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {satellite.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    {index < filteredSatellites.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default EnhancedSatelliteList;
