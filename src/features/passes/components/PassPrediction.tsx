import React, { useState, useMemo } from 'react';
import { Clock, MapPin, Eye, Compass } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/shared/contexts/AuthContext';
import { usePasses } from '@/shared/api/hooks/usePassQueries';

interface Pass {
  id: number;
  satellite: {
    id: number;
    name: string;
    norad_id: number;
  };
  start_time: string;
  end_time: string;
  max_elevation: number;
  max_elevation_time: string;
  direction: string;
  magnitude?: number;
  is_visible: boolean;
}

interface PassPredictionProps {
  satelliteId?: number;
  maxPasses?: number;
  minElevation?: number;
}

export const PassPrediction: React.FC<PassPredictionProps> = ({
  satelliteId,
  maxPasses = 10,
  minElevation = 10,
}) => {
  const { user } = useAuth();
  const [selectedPass, setSelectedPass] = useState<Pass | null>(null);

  // Get user location from profile or use default
  const userLocation = user?.profile?.location || {
    latitude: 40.7128,
    longitude: -74.0060,
    city: 'New York',
    country: 'USA',
  };

  const { data: passesData, isLoading, error } = usePasses({
    satellite_id: satelliteId,
    latitude: userLocation.latitude,
    longitude: userLocation.longitude,
    min_elevation: minElevation,
    days_ahead: 7,
  });

  const passes = passesData?.results ?? [];

  // Group passes by date
  const passesByDate = useMemo(() => {
    const grouped: { [date: string]: Pass[] } = {};
    
    passes.forEach((pass) => {
      const date = new Date(pass.start_time).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(pass);
    });

    return grouped;
  }, [passes]);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end.getTime() - start.getTime();
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const getElevationColor = (elevation: number) => {
    if (elevation >= 60) return 'bg-green-500';
    if (elevation >= 30) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const getVisibilityBadge = (pass: Pass) => {
    if (pass.is_visible) {
      return (
        <Badge variant="default" className="bg-green-500">
          <Eye className="w-3 h-3 mr-1" />
          Visible
        </Badge>
      );
    }
    return (
      <Badge variant="secondary">
        <Eye className="w-3 h-3 mr-1" />
        Not Visible
      </Badge>
    );
  };

  if (!user?.profile?.location) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Location Required</h3>
          <p className="text-muted-foreground mb-4">
            Please set your location in your profile to see satellite pass predictions.
          </p>
          <Button>Update Location</Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Calculating pass predictions...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-destructive">Failed to load pass predictions</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Upcoming Passes
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            {userLocation.city}, {userLocation.country}
          </div>
        </CardHeader>
      </Card>

      {Object.keys(passesByDate).length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              No visible passes found for the next 7 days.
            </p>
          </CardContent>
        </Card>
      ) : (
        Object.entries(passesByDate).map(([date, datePasses]) => (
          <Card key={date}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">
                {new Date(date).toLocaleDateString([], {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {datePasses.map((pass, index) => (
                <div key={pass.id}>
                  <div
                    className={`p-4 rounded-lg border cursor-pointer transition-colors hover:bg-accent/10 ${
                      selectedPass?.id === pass.id ? 'bg-accent/20 border-accent' : ''
                    }`}
                    onClick={() => setSelectedPass(selectedPass?.id === pass.id ? null : pass)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="font-medium">{pass.satellite.name}</div>
                        {getVisibilityBadge(pass)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        NORAD: {pass.satellite.norad_id}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Start</div>
                        <div className="font-mono">{formatTime(pass.start_time)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Duration</div>
                        <div className="font-mono">{formatDuration(pass.start_time, pass.end_time)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Max Elevation</div>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${getElevationColor(pass.max_elevation)}`}
                          />
                          <span className="font-mono">{pass.max_elevation.toFixed(1)}°</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Direction</div>
                        <div className="flex items-center gap-1">
                          <Compass className="w-3 h-3" />
                          <span>{pass.direction}</span>
                        </div>
                      </div>
                    </div>

                    {selectedPass?.id === pass.id && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Peak Time</div>
                            <div className="font-mono">{formatTime(pass.max_elevation_time)}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">End Time</div>
                            <div className="font-mono">{formatTime(pass.end_time)}</div>
                          </div>
                          {pass.magnitude && (
                            <div>
                              <div className="text-muted-foreground">Magnitude</div>
                              <div className="font-mono">{pass.magnitude.toFixed(1)}</div>
                            </div>
                          )}
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Button size="sm" variant="outline">
                            Set Reminder
                          </Button>
                          <Button size="sm" variant="outline">
                            View on Map
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  {index < datePasses.length - 1 && <Separator className="my-3" />}
                </div>
              ))}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};
