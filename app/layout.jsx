'use client'
// import localFont from "next/font/local";
import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-loading-skeleton/dist/skeleton.css'

import 'remixicon/fonts/remixicon.css'
import NextAuthProvider from "../Providers/NextAuthProvider";

import { RoomProvider } from "../utils/liveblocks.config";
import { ToastContainer } from "react-toastify";
import { createClient } from "@liveblocks/client";
import { useEffect } from 'react';

const client = createClient({
  publicApiKey: process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY
});

export default function RootLayout({ children }) {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);


  // // Turn Off Inspect
  // const handleContextMenu = (e) => {
  //   e.preventDefault(); // Prevent the right-click menu
  // };

  // const handleKeyDown = (e) => {
  //   if (
  //     e.key === "F12" || // F12 Key
  //     (e.ctrlKey && e.shiftKey && ["I", "C", "J"].includes(e.key)) || // Ctrl+Shift+I, Ctrl+Shift+C, Ctrl+Shift+J
  //     (e.ctrlKey && e.key === "U") // Ctrl+U
  //   ) {
  //     e.preventDefault();
  //   }
  // };

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" sizes="any" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css"
        />
        <link rel="stylesheet" href="/assets/styles/style.css" />
      </head>
      <body
        // onContextMenu={handleContextMenu}
        // tabIndex={0}
        // onKeyDown={handleKeyDown}
      >
        <NextAuthProvider>
          <main>
            {children}
            <ToastContainer />
          </main>
        </NextAuthProvider>
      </body>
    </html>
  );
}
