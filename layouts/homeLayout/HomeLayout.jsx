'use client'
import Footer from '@/components/common/Footer'
import HomeNavbar from '@/components/navbar/HomeNavbar'
import React from 'react'
import { useRouter, usePathname } from 'next/navigation';

export default function HomeLayout({ children }) {
    const router = useRouter()
    const pathname = usePathname()

    console.log('router: ', router)

    return (
        <>
            <div className="home-layout">
                {
                    !pathname.includes('/virtual-table') && <HomeNavbar />
                }
                {/* <HomeNavbar /> */}


                {children}

                {
                    !pathname.includes('/virtual-table') && pathname !== '/virtual-table' && pathname !== '/chat' && <Footer />
                }
                

            </div>
        </>
    )
}
