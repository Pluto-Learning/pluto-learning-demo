import Link from 'next/link'
import React from 'react'

export default function Hero() {
    return (
        <div className="hero-main">
            <div className="container h-100">
                <div className="hero-content-wrapper">
                    <div className="hero-content text-center">
                        <h1 className="title">This is <img src="/assets/images/plutologo.svg" alt="" className="img-fluid logo" /></h1>
                        <p className="subtitle">connect. grow. explore.</p>
                    </div>
                    <div className="link-down">
                        <Link href="#community">
                            <i class="fa-solid fa-chevron-down"></i>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
