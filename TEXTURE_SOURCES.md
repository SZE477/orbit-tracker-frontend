# Earth Texture Sources

## High-Quality Free Earth Textures

Download these textures and place them in `/public/textures/`:

### NASA Blue Marble Textures
- **earth_day.jpg**: https://visibleearth.nasa.gov/images/57752/blue-marble-land-surface-shallow-water-and-shaded-topography
- **earth_night.jpg**: https://visibleearth.nasa.gov/images/55167/earths-city-lights
- **earth_normal.jpg**: https://www.solarsystemscope.com/textures/ (Earth Normal Map)
- **earth_roughness.jpg**: Use inverted specular map or create from day texture
- **earth_clouds.png**: https://www.solarsystemscope.com/textures/ (Earth Clouds)

### Alternative Sources
- **Solar System Scope**: https://www.solarsystemscope.com/textures/
- **Planetary Pixel Emporium**: http://planetpixelemporium.com/earth.html
- **Natural Earth**: https://www.naturalearthdata.com/

### Texture Specifications
- **Resolution**: 2K (2048x1024) to 4K (4096x2048)
- **Format**: JPG for color maps, PNG for clouds (needs alpha)
- **Color Space**: sRGB for day/night/clouds, Linear for normal/roughness

## Quick Start
1. Download 2K textures from Solar System Scope
2. Rename files to match the expected names
3. Place in `/public/textures/` directory
4. Restart development server