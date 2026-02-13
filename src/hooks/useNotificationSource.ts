
import { useEffect, useState } from 'react';
import EventSource, { EventSourceListener } from 'react-native-sse';
import { useQueryClient } from '@tanstack/react-query';
import { Platform, ToastAndroid, Alert } from 'react-native';

// Adjust URL based on environment
// For Android Emulator: 10.0.2.2
// For iOS Simulator: localhost
// Use your machine's IP if unsure
const SSE_URL = 'http://localhost:3000/notifications/sse'; 

export const useNotificationSource = () => {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let eventSource: EventSource | null = null;

    try {
      console.log('Connecting to SSE:', SSE_URL);
      eventSource = new EventSource(SSE_URL);

      const listener: EventSourceListener = (event) => {
        if (event.type === 'open') {
          console.log('Open SSE connection.');
          setIsConnected(true);
        } else if (event.type === 'message') {
          try {
            // Check if event.data is a string before parsing
            if (typeof event.data === 'string') {
               // NestJS @Sse wraps data in "data" field of MessageEvent. 
               // Standard SSE format: 
               // data: {"type":"OCR_COMPLETE", ...}
               const parsedData = JSON.parse(event.data);
               
               if (parsedData.type === 'OCR_COMPLETE') {
                  console.log('OCR Complete Event:', parsedData);
                  
                  // 1. Invalidate Query to refresh list
                  queryClient.invalidateQueries({ queryKey: ['cards'] });

                  // 2. Show Toast/Alert
                  const message = 'Business card analysis complete!';
                  if (Platform.OS === 'android') {
                    ToastAndroid.show(message, ToastAndroid.SHORT);
                  } else {
                     Alert.alert("MoCa", message);
                  }
               }
            }
          } catch (e) {
            console.error('Failed to parse SSE data', e);
          }
        } else if (event.type === 'error') {
          // console.error('SSE Connection error:', event.message || event);
          setIsConnected(false);
        }
      };

      eventSource.addEventListener('open', listener);
      eventSource.addEventListener('message', listener);
      eventSource.addEventListener('error', listener);

    } catch (err) {
      console.error("Failed to create EventSource", err);
    }

    return () => {
      if (eventSource) {
        eventSource.removeAllEventListeners();
        eventSource.close();
      }
    };
  }, [queryClient]);

  return { isConnected };
};
