import React from 'react'
// import logo from '../../assets/login-page-logo.svg'
// import qrCode from '../../assets/qrcode.png'
import Link from 'next/link'

export default function Login() {
    return (
        <>
            <div className="login-container">
                <div className="row g-4">
                    <div className="col-lg-6">
                        <div className="login-bg" style={{background: "url('/assets/images/login-bg.svg')"}}>
                            <div className='login-welcome-content'>
                                <div>
                                    <div className='nav-bar-logo'>
                                        <a href="https://www.plutolearning.com/">
                                            <img src={'/assets/images/login-page-logo.svg'} alt='logo' className='img-fluid' />
                                        </a>
                                    </div>
                                    <div className="text">
                                        <h2 className='user-university'>University of Texas at Arlington</h2>
                                        {/* <p className='user-email'>sami.ali@mavs.uta.edu</p> */}
                                        {/* <h5 className='switch-account d-lg-none'>Is this not you? <Link href={'/signin'}>Switch Accounts.</Link></h5> */}
                                    </div>
                                </div>

                                {/* <h5 className='switch-account d-lg-block d-none'>Is this not you? <Link href={'/signin'}>Switch Accounts.</Link></h5> */}
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="form">
                            <div className="form-content">
                                <div className="form-content-text">
                                    <h1>Hello!</h1>
                                    <p>Click below to sign in your account</p>
                                </div>

                                <div class="login-btn-wrapper">
                                    <Link href="/signin">
                                        <div class="btn login-btn">
                                            <span>University of Texas at Arlington Email</span>
                                            <i class="fa-solid fa-chevron-right"></i>
                                        </div>
                                    </Link>
                                    <Link href="/signin">
                                        <div class="btn login-btn">
                                            <span>University of Texas at Arlington Pluto</span>
                                            <i class="fa-solid fa-chevron-right"></i>
                                        </div>
                                    </Link>
                                </div>

                                <div className="app-download-wrapper">
                                    <div className="app-download">
                                        <div className="app-download-text">
                                            <h3>Or, hop on a table with the Pluto app</h3>
                                            <p>Download the app on iPhone or Android to be the first to stay on top of classes</p>
                                        </div>
                                        <div className="app-download-qr">
                                            <img src={'/assets/images/qrcode.png'} alt="" className='img-fluid' />
                                        </div>
                                    </div>
                                </div>


                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
