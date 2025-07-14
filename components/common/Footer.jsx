import Link from 'next/link'
import React from 'react'

export default function Footer() {
    return (
        <div className="footer-main pt_50 pb_50">
            <div className="container">
                <div className="row g-4">
                    <div className="col-lg-4">
                        <div className="footer-logo">
                            <img src="/assets/images/Pluto-footer-logo.png" alt="" className="img-fluid" />
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="footer-widgets">
                            <h5 className="footer-widgets-title">Websites</h5>
                            <ul class="nav flex-column">
                                <li class="nav-item">
                                    <Link class="nav-link ps-0" href="#">Home</Link>
                                </li>
                                <li class="nav-item">
                                    <Link class="nav-link ps-0" href="#">About</Link>
                                </li>
                                <li class="nav-item">
                                    <Link class="nav-link ps-0" href="#">Contact</Link>
                                </li>
                                <li class="nav-item">
                                    <Link class="nav-link ps-0" href="#">Premium</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="footer-widgets">
                            <h5 className="footer-widgets-title">
                                Get in Touch
                            </h5>
                            <ul class="nav flex-column">
                                <li class="nav-item">
                                    <Link class="nav-link ps-0" href="mailto:contact@plutolearning.com">Email: contact@plutolearning.com</Link>
                                </li>
                                <li class="nav-item">
                                    <Link class="nav-link ps-0" href="tel:+6822193176">Phone: (682) 219 3176</Link>
                                </li>
                                <li class="nav-item">
                                    <div className="social-icons d-flex">
                                        <Link class="nav-link ps-0" href="#">
                                            <div className="social-icon rounded-pill">
                                                <i class="fa-brands fa-linkedin-in"></i>
                                            </div>
                                        </Link>
                                        <Link class="nav-link ps-0" href="#">
                                            <div className="social-icon rounded-pill">
                                                <i class="fa-brands fa-facebook-f"></i>
                                            </div>
                                        </Link>
                                        <Link class="nav-link ps-0" href="#">
                                            <div className="social-icon rounded-pill">
                                                <i class="fa-brands fa-instagram"></i>
                                            </div>
                                        </Link>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
