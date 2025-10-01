// src/context/SocketProvider.tsx
"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { io as ClientIO, Socket } from 'socket.io-client';

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Use the current domain for socket connection
    const socketUrl = process.env.NODE_ENV === 'production' 
      ? window.location.origin 
      : 'http://localhost:3000';
    
    console.log('Attempting to connect to Socket.IO server at:', socketUrl);
    
    // Add a small delay to ensure server is ready
    const connectTimer = setTimeout(() => {
      const socketInstance = ClientIO(socketUrl, {
        transports: ['polling'], // Use polling only for now
        upgrade: false, // Disable upgrade to websocket
        rememberUpgrade: false,
        timeout: 20000,
        forceNew: true,
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });

      socketInstance.on('connect', () => {
        console.log('Socket connected!', socketInstance.id);
        setIsConnected(true);
      });

      socketInstance.on('disconnect', () => {
        console.log('Socket disconnected!');
        setIsConnected(false);
      });

      socketInstance.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        console.error('Socket URL:', socketUrl);
        console.error('Socket transport:', socketInstance.io.engine?.transport?.name);
        console.error('Error message:', error.message);
        setIsConnected(false);
      });
      
      socketInstance.on('error', (error) => {
        console.error('Socket general error:', error);
      });
      
      socketInstance.io.on('error', (error) => {
        console.error('Socket.IO engine error:', error);
      });
      
      socketInstance.on('reconnect', (attemptNumber) => {
        console.log('Socket reconnected after', attemptNumber, 'attempts');
      });
      
      socketInstance.on('reconnect_error', (error) => {
        console.error('Socket reconnection error:', error);
      });

      setSocket(socketInstance);
    }, 100); // Small delay to ensure server readiness



    return () => {
      clearTimeout(connectTimer);
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};