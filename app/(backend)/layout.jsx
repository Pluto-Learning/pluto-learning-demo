"use client"
// app/admin/layout.jsx
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Avatar, Badge, styled } from '@mui/material';
import { signOut, useSession } from 'next-auth/react';
import { fetchUserProfileById } from '../api/crud';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));



const BackendLayout = ({ children }) => {

  const { data: session, status } = useSession();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const toggleSettingsDropdown = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  console.log('isSettingsOpen: ', isSettingsOpen)

  const [collapse, setCollapse] = useState(false)

  console.log('collapse: ', collapse)

  const [userData, setUserData] = useState([]);
  const getUserData = async () => {
    if (session?.user?.id) {
      const data = await fetchUserProfileById(session?.user?.id, session?.user?.token);
      setUserData(data);
    }
  };

  useEffect(() => {
    getUserData()
  }, [session?.user?.id])

  return (

    <div className='backendLayout'>
      <div class="wrapper">
        {/* <!-- Sidebar  --> */}
        <nav id="sidebar" class={` ${collapse ? 'active' : ''}`}>
          <div class="sidebar-header">
            <div className="sidebar-logo">
              <Link href="/">
                <img src="/assets/images/pluto-profile-logo.png" alt="" className='img-fluid' />
              </Link>
            </div>
          </div>

          <ul class="list-unstyled components">
            <li class="nav-item">
              <Link class="nav-link" href="/admin/dashboard">Backpanel</Link>
            </li>
            {/* <li class="">
              <a href="#homeSubmenu" data-bs-toggle="collapse" aria-expanded="false"
                class="dropdown-toggle d-flex justify-content-between">Home <i
                  class="fa-solid fa-chevron-down"></i></a>
              <ul class="collapse list-unstyled dropdown__lvl1" id="homeSubmenu">
                <li>
                  <a href="#">Home 1</a>
                </li>
                <li>
                  <a href="#">Home 2</a>
                </li>
                <li>
                  <a href="#">Home 3</a>
                </li>
              </ul>
            </li> */}
            <li>
              <a href="#pageSubmenu" data-bs-toggle="collapse" aria-expanded="false"
                class="dropdown-toggle d-flex justify-content-between align-items-center">Settings
                <i class="fa-solid fa-chevron-down"></i></a>
              <ul class="collapse list-unstyled dropdown__lvl1" id="pageSubmenu">
                <li className="nav-item">
                  <Link href="/admin/settings/university" className="nav-link ps-4">
                    University
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/admin/settings/section" className="nav-link ps-4">
                    Section
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/admin/settings/course" className="nav-link ps-4">
                    Course
                  </Link>
                </li>
                {/* <li className="nav-item">
                  <Link href="/admin/settings/course-section-mapping" className="nav-link ps-4">
                    Course Section Mapping
                  </Link>
                </li> */}
                <li className="nav-item">
                  <Link href="/admin/settings/course-section-binding-details" className="nav-link ps-4">
                    Course Section Binding
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/admin/settings/instructor-course-binding" className="nav-link ps-4">
                    Instructor Course Binding
                  </Link>
                </li>
                {/* <li className="nav-item">
                  <Link href="/admin/settings/student-course-section-binding-details" className="nav-link ps-4">
                    Student Course Section Binding Details
                  </Link>
                </li> */}

              </ul>
            </li>
          </ul>
        </nav>

        {/* <!-- Page Content  --> */}
        <div id="content" class={` ${collapse ? 'active' : ''}`}>

          <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid">

              <button type="button" id="sidebarCollapse" class={`btn toggle-btn`} onClick={() => setCollapse((prev) => !prev)}>
                <i class="fas fa-align-left me-2"></i>
                <span>Toggle Sidebar</span>
              </button>
              <button class="btn btn-dark d-inline-block d-lg-none ms-auto" type="button"
                data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <i class="fas fa-align-justify"></i>
              </button>

              <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav ms-auto">
                  <li class="nav-item">
                    <Link class="nav-link" href="/">Home</Link>
                  </li>
                  <li class="nav-item">
                    <Link class="nav-link" href="/admin/dashboard">Dashboard</Link>
                  </li>
                  <li class="nav-item">
                    <Link class="nav-link" href="/admin/settings/university">University</Link>
                  </li>
                  <li class="nav-item">
                    <Link class="nav-link" href="/admin/settings/course">Course</Link>
                  </li>
                  <li class="nav-item">
                    <Link class="nav-link" href="/admin/settings/section">Section</Link>
                  </li>
                  <li className="nav-item">
                    <div className='nav-bar-links-signup '>
                      {
                        status === 'authenticated' ? (
                          <button type="button" className='btn pluto-deep-blue-btn rounded' onClick={() => signOut()}>
                            Sign out
                          </button>
                        ) : (
                          <Link href="/login" className='btn pluto-deep-blue-btn rounded'>
                            <button type="button">
                              Sign in
                            </button>
                          </Link>
                        )
                      }

                    </div>
                  </li>
                </ul>
              </div>

              {/* {
                status === 'authenticated' &&
                <div class="btn-group profile-avatar" style={{ cursor: "pointer" }}>
                  <Avatar
                    alt={userData?.userID}
                    src={userData?.awsFileUrl}
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    className='avatar '
                    sx={{
                      width: { xs: 35, sm: 35, md: 35, lg: 35, xl: 35 },
                      height: { xs: 35, sm: 35, md: 35, lg: 35, xl: 35 },
                    }}
                  />
                  <ul class="dropdown-menu">
                    <li><a class="dropdown-item text-capitalize" href="javascript:void(0)"><strong>{userData?.userID}</strong></a></li>
                    <li><Link class="dropdown-item" href="/profile">Profile</Link></li>
                  </ul>
                </div>
              } */}
            </div>
          </nav>

          <main>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default BackendLayout;
