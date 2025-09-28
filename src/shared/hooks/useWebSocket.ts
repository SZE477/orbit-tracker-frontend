import { useEffect, useRef, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '@/shared/api/types';

interface WebSocketMessage {
  type: 'satellite_position' | 'satellite_status' | 'heartbeat';
  data: any;
  timestamp: string;
}

interface UseWebSocketOptions {
  url: string;
  onMessage?: (message: WebSocketMessage) => void;
  onError?: (error: Event) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  reconnectAttempts?: number;
  reconnectInterval?: number;
}

export const useWebSocket = ({
  url,
  onMessage,
  onError,
  onConnect,
  onDisconnect,
  reconnectAttempts = 5,
  reconnectInterval = 3000,
}: UseWebSocketOptions) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectCountRef = useRef(0);
  const queryClient = useQueryClient();

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setConnectionStatus('connecting');
    
    try {
      wsRef.current = new WebSocket(url);

      wsRef.current.onopen = () => {
        setIsConnected(true);
        setConnectionStatus('connected');
        reconnectCountRef.current = 0;
        onConnect?.();
        console.log('WebSocket connected');
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          
          // Handle different message types
          switch (message.type) {
            case 'satellite_position':
              // Update React Query cache with new position data
              queryClient.setQueryData(
                QueryKeys.satellitePositions(message.data.satellite_id),
                (oldData: any) => {
                  if (!oldData) return oldData;
                  return {
                    ...oldData,
                    results: [message.data, ...(oldData.results || [])].slice(0, 100), // Keep last 100 positions
                  };
                }
              );
              break;
              
            case 'satellite_status':
              // Update satellite status in cache
              queryClient.setQueryData(
                QueryKeys.satellite(message.data.satellite_id),
                (oldData: any) => {
                  if (!oldData) return oldData;
                  return {
                    ...oldData,
                    is_active: message.data.is_active,
                    last_updated: message.data.timestamp,
                  };
                }
              );
              break;
              
            case 'heartbeat':
              // Handle heartbeat - could update connection quality indicator
              break;
          }

          onMessage?.(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      wsRef.current.onclose = (event) => {
        setIsConnected(false);
        setConnectionStatus('disconnected');
        onDisconnect?.();
        
        // Attempt to reconnect if not a clean close
        if (!event.wasClean && reconnectCountRef.current < reconnectAttempts) {
          reconnectCountRef.current++;
          console.log(`WebSocket disconnected. Attempting to reconnect... (${reconnectCountRef.current}/${reconnectAttempts})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        } else {
          console.log('WebSocket connection closed');
        }
      };

      wsRef.current.onerror = (error) => {
        setConnectionStatus('error');
        onError?.(error);
        console.error('WebSocket error:', error);
      };

    } catch (error) {
      setConnectionStatus('error');
      console.error('Failed to create WebSocket connection:', error);
    }
  }, [url, onMessage, onError, onConnect, onDisconnect, reconnectAttempts, reconnectInterval, queryClient]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close(1000, 'Manual disconnect');
      wsRef.current = null;
    }
    
    setIsConnected(false);
    setConnectionStatus('disconnected');
  }, []);

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    connectionStatus,
    sendMessage,
    connect,
    disconnect,
  };
};

/**
 * Hook specifically for satellite real-time updates
 */
export const useSatelliteWebSocket = () => {
  const wsUrl = `${import.meta.env.VITE_WS_BASE}/satellites/`;
  
  return useWebSocket({
    url: wsUrl,
    onMessage: (message) => {
      console.log('Satellite update received:', message);
    },
    onConnect: () => {
      console.log('Connected to satellite WebSocket');
    },
    onDisconnect: () => {
      console.log('Disconnected from satellite WebSocket');
    },
  });
};
