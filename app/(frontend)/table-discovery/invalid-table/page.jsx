import HomeLayout from '@/layouts/homeLayout/HomeLayout'
import Link from 'next/link'
import React from 'react'

export default function page() {
    return (
        <>
            <HomeLayout>
                <div className="table-not-found">
                    <div className="content">
                        <h2 className='mb-4'>Table Not Found</h2>
                        <Link href={'/table-discovery'} className="btn pluto-pink-btn">Back to table</Link>
                    </div>
                </div>
            </HomeLayout>
        </>
    )
}
