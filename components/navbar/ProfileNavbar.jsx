"use client"
import { fetchUserProfileById } from '@/app/api/crud';
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'


export default function ProfileNavbar() {

    const [userData, setUserData] = useState([]);
    const {data: session} = useSession()
    const [currentUserId, setCurrentUserId] = useState(null);

    console.log('sessionsession ', session)

    useEffect(() => {
        if (session) {
            setCurrentUserId(session?.user?.id); // Set currentUserId from session
        }
    }, [session]);

    const getUserData = async () => {
        if (currentUserId) {
            const data = await fetchUserProfileById(currentUserId, session?.user?.token);
            setUserData(data);
        }
    };

    useEffect(() => {
        getUserData();
    }, [currentUserId]);

    return (
        <>
            <div className="container">
                <div className='profile-navbar'>
                    <div className="logo">
                        <img src={'/assets/images/pluto-profile-logo.png'} alt="" className='img-fluid' />
                    </div>
                    <div className='user-dropdown'>
                        <div class="dropdown">
                            <button class="btn dropdown-toggle " type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <div className="user-img rounded-pill">
                                    <img src={userData?.awsFileUrl} alt="" className='img-fluid rounded-pill' />
                                </div>
                                <span className='user-name'>{session?.user?.id}</span>
                            </button>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="#">Action</a></li>
                                <li><a class="dropdown-item" href="#">Another action</a></li>
                                <li><a class="dropdown-item" href="#">Something else here</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
