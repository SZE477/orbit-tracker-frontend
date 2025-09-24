# Realistic Earth Implementation Guide

## Root Cause of Flat Blue Sphere

The original flat blue sphere was caused by:

1. **Missing textures** - Only using a solid color material (`color="royalblue"`)
2. **Incorrect color spaces** - Textures need proper sRGB/Linear encoding
3. **Poor lighting setup** - Single ambient light creates flat shading  
4. **Low geometry resolution** - 64x64 sphere segments cause visible faceting
5. **No physically-based materials** - Missing normal, roughness, and emissive maps

## Complete Solution

### Texture Requirements

Place these textures in `/public/textures/`:

- `earth_day.jpg` - Daytime surface (sRGB colorSpace)
- `earth_night.jpg` - City lights at night (sRGB colorSpace)  
- `earth_normal.jpg` - Surface normals for detail (LinearSRGBColorSpace)
- `earth_roughness.jpg` - Surface roughness variation (LinearSRGBColorSpace)
- `earth_clouds.png` - Cloud layer with alpha (sRGB colorSpace)

### Color Space Configuration

```typescript
// Color textures use sRGB color space
dayTexture.colorSpace = SRGBColorSpace;
nightTexture.colorSpace = SRGBColorSpace;
cloudsTexture.colorSpace = SRGBColorSpace;

// Data textures use linear color space
normalTexture.colorSpace = LinearSRGBColorSpace;
roughnessTexture.colorSpace = LinearSRGBColorSpace;
```

### Material Setup

```typescript
<meshStandardMaterial
  map={dayTexture}           // Daytime colors
  normalMap={normalTexture}   // Surface detail
  roughnessMap={roughnessTexture} // Varying surface roughness
  emissiveMap={nightTexture} // City lights
  emissiveIntensity={0.6}    // Night light brightness
  roughness={0.8}            // Base roughness
  metalness={0.1}            // Non-metallic surface
/>
```

### Lighting Configuration

```typescript
// Low ambient light for space
<ambientLight intensity={0.1} color="#404080" />

// Strong directional light as sun
<directionalLight 
  position={[10, 0, 5]} 
  intensity={3.0}
  color="#fff8e1"  // Warm sunlight
  castShadow
/>

// Environment lighting for reflections
<Environment preset="city" background={false} />
```

### Geometry Requirements

- Use **128x128 segments** minimum to avoid faceting
- Clouds layer at radius **2.005** (slightly larger than Earth)
- Enable shadows: `castShadow` and `receiveShadow`

## Sanity Checklist

✅ **Sphere segments ≥ 64** to avoid faceting (128x128 recommended)
✅ **Texture encodings correct**: color maps = sRGB, data maps = Linear
✅ **Image optimization**: 4K max resolution, JPG for color, PNG for alpha
✅ **Environment intensity** controlled via props
✅ **Shadows enabled** for realistic lighting
✅ **Progressive loading** with Suspense fallback

## Advanced: Day/Night Terminator Shader

For physically accurate day/night transitions, replace the emissiveMap approach with a custom shader:

```typescript
const dayNightShader = {
  uniforms: {
    dayTexture: { value: dayTexture },
    nightTexture: { value: nightTexture },
    sunDirection: { value: new Vector3(1, 0, 0) }
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec2 vUv;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D dayTexture;
    uniform sampler2D nightTexture;
    uniform vec3 sunDirection;
    varying vec3 vNormal;
    varying vec2 vUv;
    
    void main() {
      float NdotL = max(dot(vNormal, sunDirection), 0.0);
      vec3 day = texture2D(dayTexture, vUv).rgb;
      vec3 night = texture2D(nightTexture, vUv).rgb;
      
      // Smooth transition at terminator
      float dayFactor = smoothstep(0.0, 0.1, NdotL);
      vec3 color = mix(night * 0.3, day, dayFactor);
      
      gl_FragColor = vec4(color, 1.0);
    }
  `
};
```

## Apply Instructions

1. **Replace** `GlobeScene.tsx` with the complete version
2. **Download** Earth texture maps to `/public/textures/`
3. **Update** Canvas configuration in `App.tsx` with shadows
4. **Install** dependencies: `npm install @react-three/fiber@^8.17.0 @react-three/drei@^9.122.0`
5. **Test** the blue sphere renders first, then add textures progressively
6. **Optimize** texture sizes (2K-4K recommended for web)

The result: A realistic, rotating Earth with day/night lighting, clouds, and proper physically-based materials!