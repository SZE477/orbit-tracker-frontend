import React, { useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface PerformanceStats {
  fps: number;
  frameTime: number;
  triangles: number;
  drawCalls: number;
  memoryUsage: number;
}

interface PerformanceMonitorProps {
  visible?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  visible = false,
  position = 'top-right',
}) => {
  const { gl } = useThree();
  const [stats, setStats] = useState<PerformanceStats>({
    fps: 0,
    frameTime: 0,
    triangles: 0,
    drawCalls: 0,
    memoryUsage: 0,
  });

  const [frameCount, setFrameCount] = useState(0);
  const [lastTime, setLastTime] = useState(performance.now());

  useFrame(() => {
    const now = performance.now();
    const delta = now - lastTime;
    
    setFrameCount(prev => prev + 1);

    // Update stats every 60 frames (roughly once per second at 60fps)
    if (frameCount % 60 === 0) {
      const fps = Math.round(1000 / (delta / 60));
      const frameTime = delta / 60;
      
      // Get renderer info
      const info = gl.info;
      
      setStats({
        fps,
        frameTime: Math.round(frameTime * 100) / 100,
        triangles: info.render.triangles,
        drawCalls: info.render.calls,
        memoryUsage: info.memory.geometries + info.memory.textures,
      });
      
      setLastTime(now);
    }
  });

  const getPerformanceColor = (fps: number) => {
    if (fps >= 55) return 'bg-green-500';
    if (fps >= 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      default:
        return 'top-4 right-4';
    }
  };

  if (!visible) return null;

  return (
    <div className={`absolute ${getPositionClasses()} z-50`}>
      <Card className="glass-panel">
        <CardContent className="p-3 space-y-2">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getPerformanceColor(stats.fps)}`} />
            <span className="text-sm font-mono">Performance</span>
          </div>
          
          <div className="space-y-1 text-xs font-mono">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">FPS:</span>
              <span>{stats.fps}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Frame:</span>
              <span>{stats.frameTime}ms</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Triangles:</span>
              <span>{stats.triangles.toLocaleString()}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Draw Calls:</span>
              <span>{stats.drawCalls}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Memory:</span>
              <span>{stats.memoryUsage}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

/**
 * Hook for performance monitoring and adaptive quality
 */
export const useAdaptiveQuality = () => {
  const [quality, setQuality] = useState<'high' | 'medium' | 'low'>('high');
  const [fps, setFps] = useState(60);
  
  const frameCount = React.useRef(0);
  const lastTime = React.useRef(performance.now());
  const fpsHistory = React.useRef<number[]>([]);

  useFrame(() => {
    const now = performance.now();
    frameCount.current++;

    // Calculate FPS every 60 frames
    if (frameCount.current % 60 === 0) {
      const delta = now - lastTime.current;
      const currentFps = Math.round(60000 / delta);
      
      setFps(currentFps);
      fpsHistory.current.push(currentFps);
      
      // Keep only last 10 measurements
      if (fpsHistory.current.length > 10) {
        fpsHistory.current.shift();
      }
      
      // Calculate average FPS
      const avgFps = fpsHistory.current.reduce((a, b) => a + b, 0) / fpsHistory.current.length;
      
      // Adjust quality based on performance
      if (avgFps < 25 && quality !== 'low') {
        setQuality('low');
        console.log('Switching to low quality due to poor performance');
      } else if (avgFps < 45 && quality === 'high') {
        setQuality('medium');
        console.log('Switching to medium quality due to moderate performance');
      } else if (avgFps > 55 && quality !== 'high') {
        setQuality('high');
        console.log('Switching to high quality due to good performance');
      }
      
      lastTime.current = now;
    }
  });

  return { quality, fps };
};

/**
 * Quality settings for different performance levels
 */
export const getQualitySettings = (quality: 'high' | 'medium' | 'low') => {
  switch (quality) {
    case 'high':
      return {
        earthSegments: 64,
        satelliteInstances: 1000,
        shadowMapSize: 2048,
        enableAtmosphere: true,
        enableClouds: true,
        enableOrbitPaths: true,
      };
    case 'medium':
      return {
        earthSegments: 32,
        satelliteInstances: 500,
        shadowMapSize: 1024,
        enableAtmosphere: true,
        enableClouds: false,
        enableOrbitPaths: false,
      };
    case 'low':
      return {
        earthSegments: 16,
        satelliteInstances: 200,
        shadowMapSize: 512,
        enableAtmosphere: false,
        enableClouds: false,
        enableOrbitPaths: false,
      };
  }
};
