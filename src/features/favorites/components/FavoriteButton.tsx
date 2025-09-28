import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useFavorites, useAddFavorite, useRemoveFavorite } from '@/shared/api/hooks/useFavoriteQueries';
import { useAuth } from '@/shared/contexts/AuthContext';

interface FavoriteButtonProps {
  satelliteId: number;
  satelliteName: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showText?: boolean;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  satelliteId,
  satelliteName,
  variant = 'ghost',
  size = 'icon',
  showText = false,
}) => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const { data: favoritesData } = useFavorites();
  const addFavoriteMutation = useAddFavorite();
  const removeFavoriteMutation = useRemoveFavorite();

  const favorites = favoritesData?.results ?? [];
  const isFavorite = favorites.some(fav => fav.satellite.id === satelliteId);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to save favorites',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (isFavorite) {
        const favorite = favorites.find(fav => fav.satellite.id === satelliteId);
        if (favorite) {
          await removeFavoriteMutation.mutateAsync(favorite.id);
          toast({
            title: 'Removed from Favorites',
            description: `${satelliteName} has been removed from your favorites`,
          });
        }
      } else {
        await addFavoriteMutation.mutateAsync({
          satellite: satelliteId,
          notes: '',
        });
        toast({
          title: 'Added to Favorites',
          description: `${satelliteName} has been added to your favorites`,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update favorites. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const isLoading = addFavoriteMutation.isPending || removeFavoriteMutation.isPending;

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`${isFavorite ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-foreground'} transition-colors`}
    >
      <Heart 
        className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''} ${isLoading ? 'animate-pulse' : ''}`} 
      />
      {showText && (
        <span className="ml-2">
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </span>
      )}
    </Button>
  );
};
