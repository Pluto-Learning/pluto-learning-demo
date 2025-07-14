"use client"
import { fetchNotifications, fetchUserProfileById } from '@/app/api/crud';
import { Avatar } from '@mui/material';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function HomeNavbar() {

    const [userData, setUserData] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [notification, setNotification] = useState(null);

    // const session = useSession();

    const { data: session, status } = useSession();


    console.log('session homenavbar: ', session, status);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            setIsScrolled(scrollY > 200); // Change 200 to the scroll threshold you want
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        if (session) {
            setCurrentUserId(session?.user?.id); // Set currentUserId from session
        }
    }, [session]);

    const router = useRouter()
    const pathname = usePathname()
    // console.log('pathname: ', pathname)

    const getUserData = async () => {
        if (currentUserId) {
            const data = await fetchUserProfileById(currentUserId, session?.user?.token);
            setUserData(data);
        }
    };

    const getNotifications = async () => {
        try {
            const data = await fetchNotifications(currentUserId, session?.user?.token)
            setNotification(data)
        } catch (error) {
            console.log('Error get notification ', error)
        }
    }

    useEffect(() => {
        getUserData();
        getNotifications();
    }, [currentUserId]);

    console.log('notification: ', notification)

    return (
        <>
            <div className={`nav-bar ${pathname == '/table-discovery' || pathname == '/' ? 'fixed-top' : 'navbar-scrolled home-navbar'} ${isScrolled && pathname !== '/virtual-table' ? 'navbar-scrolled home-navbar fixed-top' : ''}`}>
                <div className="container">
                    {/* <div className='nav-bar-links d-none'>
                        <div className='nav-bar_logo'>
                            <Link href="/">
                                <img src={'/assets/images/plutologowhite.svg'} alt='logo' className="img-fluid" />
                            </Link>
                        </div>

                        <ul className='nav nav-bar-links-container'>
                            <li class="nav-item">
                                <Link class="nav-link" href="/">Home</Link>
                            </li>
                            <li class="nav-item">
                                <Link class="nav-link" href="/about">About</Link>
                            </li>
                            <li class="nav-item">
                                <Link class="nav-link" href="/help">Help</Link>
                            </li>
                            <li class="nav-item">
                                <Link class="nav-link" href="/premium">Premium</Link>
                            </li>
                        </ul>


                        <div className='nav-bar-links-signup'>
                            <button type="button">
                                <Link href="/login">Sign in</Link>
                            </button>
                        </div>

                    </div> */}

                    <nav class="navbar navbar-expand-lg nav-bar-links">
                        <div class="container-fluid">
                            <Link class="navbar-brand nav-bar_logo" href="/">
                                <img src={'/assets/images/Pluto-footer-logo-white.png'} alt='logo' className="img-fluid" />
                            </Link>

                            <button class="navbar-toggler ms-auto" type="button" data-bs-toggle="offcanvas" data-bs-target="#navbar-offcanvas" aria-controls="offcanvasExample">
                                {/* <span class="navbar-toggler-icon"></span> */}
                                <i class="fa-solid fa-bars"></i>
                            </button>

                            <div class="offcanvas offcanvas-end navbar-offcanvas" tabindex="-1" id="navbar-offcanvas" aria-labelledby="offcanvasExampleLabel">
                                <div className="offcanvas-header">
                                    <Link class="navbar-brand" href="/">
                                        <img src={'/assets/images/pluto-profile-logo.svg'} alt='logo' className="img-fluid" />
                                    </Link>
                                    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                                </div>
                                <div className="offcanvas-body">
                                    <ul class="navbar-nav m-lg-auto nav-bar-links-container">


                                        {
                                            status === 'authenticated' &&
                                            <li class="nav-item ">
                                                <Link class={`nav-link ${pathname?.includes('/table-discovery') && 'active'}`} href="/table-discovery">For You</Link>
                                            </li>
                                        }

                                        {
                                            status === 'authenticated' &&
                                            <li class="nav-item ">
                                                <Link class={`nav-link ${pathname?.includes('/everyone') && 'active'}`} href="/everyone">Everyone</Link>
                                            </li>
                                        }
                                        {/* <li class="nav-item ">
                                            <Link class={`nav-link ${pathname?.includes('/your-files') && 'active'}`} href="#">Your Files</Link>
                                        </li> */}

                                        {
                                            status === 'authenticated' &&
                                            <li class="nav-item ">
                                                <Link class={`nav-link ${pathname?.includes('/calendar-schedule') && 'active'}`} href="/calendar-schedule">Calendar</Link>
                                            </li>
                                        }
                                        {/* {
                                            status === 'authenticated' &&
                                            (session?.user?.userType.toLowerCase() === 'admin' || session?.user?.userType.toLowerCase() === 'student') && (
                                                <li className="nav-item">
                                                    <Link className={`nav-link ${pathname?.includes('/profile/course-selection') ? 'active' : ''}`} href="/profile/course-selection">
                                                        Course Selection
                                                    </Link>
                                                </li>
                                            )
                                        } */}


                                        {
                                            status === 'authenticated' &&
                                            (session?.user?.userType.toLowerCase() === 'admin' || session?.user?.userType.toLowerCase() === 'student') && (
                                                <li className="nav-item">
                                                    <Link className={`nav-link ${pathname?.includes('/profile/course-selection') ? 'active' : ''}`} href="/profile/course-selection">
                                                        Course Selection
                                                    </Link>
                                                </li>
                                            )
                                        }

                                        {
                                            status === 'authenticated' &&
                                            (session?.user?.userType.toLowerCase() === 'admin' || session?.user?.userType.toLowerCase() === 'instructor') && (
                                                <li className="nav-item">
                                                    <a className={`nav-link ${pathname?.includes('/dashboard') ? 'active' : ''}`} href="/admin/dashboard">
                                                        Backpanel
                                                    </a>
                                                </li>
                                            )
                                        }

                                        {/* {
                                            status === 'authenticated' &&
                                            <li class="nav-item ">
                                                <Link class={`nav-link ${pathname?.includes('/course-selection') && 'active'}`} href="/profile/course-selection">Course Selection</Link>
                                            </li>
                                        } */}
                                    </ul>
                                    {/* <div className='nav-bar-links-signup d-lg-none'>
                                        <button type="button">
                                            <Link href="/login">Sign in</Link>
                                        </button>
                                    </div> */}
                                    <div className='nav-bar-links-signup '>
                                        {
                                            status === 'unauthenticated' ?
                                                <button type="button">
                                                    <Link href="/login">Sign in</Link>
                                                </button> :
                                                <button type="button">
                                                    <a href="javascript:void(0)" onClick={() => signOut()}>Sign out</a>
                                                </button>
                                        }

                                    </div>
                                </div>
                            </div>

                            {/* <div className='nav-bar-links-signup d-none d-lg-block'>
                                {
                                    status === 'unauthenticated' ?
                                        <button type="button">
                                            <Link href="/login">Sign in</Link>
                                        </button> :
                                        <button type="button">
                                            <a href="javascript:void(0)" onClick={() => signOut()}>Sign out</a>
                                        </button>
                                }
                            </div> */}
                            {
                                status === 'authenticated' && <div class="dropdown notification-dropdown">
                                    <button class="btn notification-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i class="fa-solid fa-bell"></i>
                                        <span className='notification-count'>{notification != null ? notification?.pendingPeople + notification?.unreadMessage : 0}</span>
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li>
                                            <Link class="dropdown-item" href="/everyone">
                                                <div className='d-flex justify-content-between align-items-center'>
                                                    <p className="mb-0 me-2 fw-bold">
                                                        Friend Request:
                                                    </p>
                                                    {/* <button type="button" class="btn border-0">
                                                        <span class="badge text-bg-warning">{notification?.pendingPeople}</span>
                                                    </button> */}
                                                    <button type="button" class="btn btn-sm btn-warning position-relative">
                                                        <i class="ri-user-fill"></i>
                                                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                                            {notification?.unreadMessage}
                                                            <span class="visually-hidden">unread messages</span>
                                                        </span>
                                                    </button>
                                                </div>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link class="dropdown-item" href="/chat">
                                                <div className='d-flex justify-content-between align-items-center'>
                                                    <p className="mb-0 me-2 fw-bold">
                                                        Message:
                                                    </p>
                                                    {/* <button type="button" class="btn border-0">
                                                        <span class="badge text-bg-warning">{notification?.unreadMessage}</span>
                                                    </button> */}

                                                    <button type="button" class="btn btn-sm btn-warning position-relative">
                                                        <i class="ri-question-answer-fill"></i>
                                                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                                            {notification?.unreadMessage}
                                                            <span class="visually-hidden">unread messages</span>
                                                        </span>
                                                    </button>
                                                </div>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            }




                            {
                                status === 'authenticated' &&
                                <div class="btn-group profile-avatar" style={{ cursor: "pointer" }}>
                                    {/* <button type="button" class="btn btn-danger dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                    Action
                                </button> */}
                                    <Avatar
                                        alt={userData?.userID}
                                        src={userData?.awsFileUrl}
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                        className='avatar '
                                        sx={{
                                            width: { xs: 35, sm: 48, md: 48, lg: 48, xl: 48 },
                                            height: { xs: 35, sm: 48, md: 48, lg: 48, xl: 48 },
                                        }}
                                    />
                                    <ul class="dropdown-menu">
                                        <li><a class="dropdown-item text-capitalize" href="javascript:void(0)"><strong>{userData?.userID}</strong></a></li>
                                        <li><Link class="dropdown-item" href="/profile">Profile</Link></li>
                                        <li><Link class="dropdown-item" href="/change-password">Change Password</Link></li>
                                    </ul>
                                </div>
                            }
                        </div>
                    </nav>
                </div>
            </div>
        </>
    )
}
