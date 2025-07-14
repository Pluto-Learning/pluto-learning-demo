"use client"
import DashboardNavbar from '@/components/Dashboard/DashboardNavbar'
import DashboardSidebar from '@/components/Dashboard/DashboardSidebar'
import React, { useState } from 'react'

export default function DashboardLayout({ children }) {

    const [collapse, setCollapse] = useState(false)

    return (

        <div className="dashboard-area">
            <div className='dashboard-wrapper'>
                <div className={`dashboard-left ${collapse ? 'sidebar-hide' : ''}`} >
                    {/* <button className="btn toggle-btn shadow-none d-lg-none" onClick={() => {setCollapse(!collapse) }}><i class="fa-solid fa-bars-staggered"></i></button> */}
                    <DashboardSidebar setCollapse={setCollapse}/>
                </div>
                <div className={`dashboard-right ${collapse ? 'full-width' : ''}`} >
                    <DashboardNavbar />
                    {children}
                </div>
            </div>
        </div>
    )
}
