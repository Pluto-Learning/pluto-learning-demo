import ProfileNavbar from '@/components/navbar/ProfileNavbar'
import React from 'react'

export default function ProfileLayout({ children }) {
    
    return (
        <div className='profile-layout'>
                <ProfileNavbar />
                {children}
        </div>
    )
}
