'use client'
// app/backend/dashboard/page.jsx
import { useSession } from 'next-auth/react';
import React from 'react'

export default function page() {

  const { data: session } = useSession();

  return (
    <>
      <div className="backend-dashboard text-center">
        <div className="content-wrapper">
          <h1 className='text-capitalize'>{session?.user?.userType} Backpanel</h1>
          <p className='text-capitalize'>Welcome to the pluto {session?.user?.userType} Backpanel!</p>
        </div>
      </div>
    </>
  )
}

