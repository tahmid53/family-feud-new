"use client";

import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

// Mobile device detection
export default function MobileRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // Check if user is on a mobile device
    const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    
    // Redirect to appropriate version
    if (isMobile) {
      router.replace('/game/buzzer/mobile');
    } else {
      router.replace('/game/buzzer');
    }
  }, [router]);
  
  return (
    <>
      <Head>
        <title>Family Feud - Redirecting</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
      </Head>
      <div className="min-h-screen bg-blue-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-xl">Redirecting to the appropriate version...</p>
        </div>
      </div>
    </>
  );
}
