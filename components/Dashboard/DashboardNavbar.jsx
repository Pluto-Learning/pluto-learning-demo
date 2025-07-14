"use client"
import React, { useEffect, useState } from 'react'
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import MailIcon from '@mui/icons-material/Mail';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchUserProfileById } from '@/app/api/crud';


export default function DashboardNavbar() {

    const [userData, setUserData] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [notification, setNotification] = useState(null);

    // const session = useSession();

    const { data: session, status } = useSession();


    // console.log('session: ', session?.user?.id);
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
    console.log('pathname: ', pathname)

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
        <div>
            <nav class="navbar dashboard-navbar shadow-none  navbar-light bg-light">
                <div class="container-fluid">
                    <div className='ms-auto d-flex align-items-center' style={{ gap: "20px" }}>
                        <form class="d-flex align-items-center input-group w-auto" style={{ marginRight: "30px" }}>
                            <input
                                type="search"
                                class="form-control rounded-pill p-4 border-0 text-white fw-bold"
                                placeholder="Search"
                                aria-label="Search"
                                aria-describedby="search-addon"
                            />
                            <button class="search-btn border-0" id="search-addon">
                                <svg width="25" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.30542 8.45943C0.337091 8.313 0.383103 8.16764 0.398041 8.01958C0.467358 7.33693 0.650211 6.6715 0.94182 6.04861C1.26092 5.36811 1.63917 4.69891 2.08734 4.0814C2.48292 3.53657 2.97352 3.03481 3.48981 2.57612C4.2744 1.87893 5.17014 1.30287 6.183 0.891553C7.10504 0.516847 8.05097 0.211591 9.06622 0.118453C9.53949 0.0753831 10.0134 -0.00752597 10.4854 0.000549594C11.3561 0.0150856 12.2207 0.0883041 13.0764 0.276734C14.5076 0.591681 15.7864 1.15966 16.9468 1.97099C18.2716 2.89698 19.2845 4.04425 19.9908 5.40902C20.4222 6.24296 20.7294 7.11727 20.822 8.03789C20.8823 8.63817 20.9367 9.24384 20.9116 9.84466C20.8829 10.5392 20.7407 11.2267 20.5184 11.8969C20.1587 12.9812 19.6221 13.9837 18.8387 14.8736C18.7329 14.9936 18.6361 15.1207 18.5268 15.2548C18.5805 15.3064 18.6319 15.3587 18.6863 15.4076C20.5866 17.1197 22.4802 18.8381 24.3924 20.5394C24.9284 21.0164 24.776 21.8089 24.05 21.9682C24.0392 21.9704 24.0333 21.9892 24.0249 22H23.5953C23.376 21.8519 23.1327 21.7254 22.9403 21.5532C21.0903 19.8977 19.2474 18.2362 17.4081 16.5711C17.2635 16.4402 17.1709 16.4537 17.0167 16.5495C16.4771 16.8839 15.9465 17.2365 15.3746 17.5208C14.4401 17.9854 13.4421 18.3122 12.3737 18.4328C11.8257 18.4947 11.2784 18.5776 10.728 18.5948C10.2607 18.6099 9.78509 18.5727 9.32198 18.5076C8.73816 18.4258 8.15435 18.3197 7.58667 18.1743C6.49254 17.8938 5.50179 17.4217 4.57975 16.816C3.8334 16.3256 3.16653 15.7646 2.5863 15.1245C1.98277 14.4585 1.48679 13.7274 1.1187 12.9295C0.769723 12.1715 0.502017 11.3941 0.399237 10.5752C0.379517 10.4137 0.337688 10.2538 0.30542 10.0929C0.30542 9.54856 0.30542 9.00373 0.30542 8.45943ZM19.1148 9.30306C19.0933 7.20826 18.2925 5.39879 16.651 3.90481C15.0048 2.40599 12.985 1.65066 10.6629 1.63504C8.17586 1.61835 6.04616 2.44098 4.35926 4.10509C2.73868 5.70351 1.9738 7.59912 2.12558 9.76337C2.27796 11.9276 3.28604 13.7328 5.12294 15.1331C6.86362 16.4602 8.87978 17.0567 11.1768 16.9366C15.2629 16.7223 19.1285 13.5804 19.1154 9.30252L19.1148 9.30306Z" fill="white" />
                                    <path d="M4.74473 8.78164C4.72438 7.78757 5.07928 6.87785 5.71906 6.05102C5.98359 5.70914 6.33968 5.40919 6.69159 5.12108C6.93936 4.91832 7.48996 4.98788 7.78082 5.19903C8.04595 5.39143 8.17223 5.77969 7.97473 6.04905C7.79937 6.28881 7.55998 6.49601 7.35889 6.72344C6.86335 7.28387 6.58626 7.90893 6.56291 8.60502C6.55573 8.81469 6.55873 9.02436 6.56172 9.23354C6.5677 9.69382 6.17211 9.98341 5.77591 9.9987C5.16846 10.0224 4.76388 9.72046 4.74593 9.25327C4.73995 9.09589 4.74473 8.93852 4.74473 8.78115V8.78164Z" fill="white" />
                                </svg>

                            </button>
                        </form>

                        <div className='notification d-none'>
                            {/* <Badge
                                badgeContent={4}
                                color="primary"
                                style={{ fontSize: '1.5rem' }} 
                            >
                                <MailIcon style={{ fontSize: '2rem' }} /> 
                            </Badge> */}

                            {/* <Badge color="secondary" overlap="circular" badgeContent=" ">
                                            {circle}
                                        </Badge> */}
                            <div className="icon rounded-pill">
                                <svg width="33" height="20" viewBox="0 0 33 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M30.9379 0H2.45454C1.44201 0 0.63623 0.74813 0.63623 1.69576V18.3042C0.63623 19.2519 1.44201 20 2.45454 20H30.9909C32.0088 20 32.8093 19.2519 32.8093 18.3042V1.69576C32.7562 0.74813 31.9505 0 30.9326 0H30.9379ZM1.97213 2.09476L10.5919 9.77556L1.97213 17.8055V2.09476ZM18.8353 11.5711C17.6584 12.6185 15.7288 12.6185 14.5519 11.5711L2.93695 1.24688H30.4555L18.8353 11.5711ZM11.5514 10.6234L13.5871 12.4688C15.2994 14.015 18.0295 14.015 19.7418 12.4688L21.7774 10.6234L30.4502 18.7032H2.93695L11.5567 10.6234H11.5514ZM22.7953 9.77556L31.415 2.09476V17.8055L22.7953 9.77556Z" fill="white" />
                                </svg>
                                <span className='notification-light rounded-pill'></span>

                            </div>
                        </div>

                        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" style={{ width: '50px', height: '50px' }} className='d-none'/>

                        {
                            status === 'authenticated' && <div class="dropdown notification-dropdown">
                                <button class="btn notification-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="fa-solid fa-bell"></i>
                                    <span className='notification-count'>{notification != null ? notification?.pendingPeople + notification?.unreadMessage : 0}</span>
                                </button>
                                <ul class="dropdown-menu">
                                    <li><Link class="dropdown-item" href="/everyone">Friend Request: {notification?.pendingPeople}</Link></li>
                                    <li><Link class="dropdown-item" href="/chat">Message: {notification?.unreadMessage}</Link></li>
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
                                </ul>
                            </div>
                        }
                    </div>
                </div>
            </nav>
        </div>
    )
}
