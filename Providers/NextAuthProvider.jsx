"use client"
import React from 'react'
import { SessionProvider } from "next-auth/react"
// import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Ensure this line is added

export default function NextAuthProvider({ children }) {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}
