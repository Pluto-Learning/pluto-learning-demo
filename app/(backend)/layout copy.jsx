"use client"
// app/admin/layout.jsx
import React, { useState } from 'react';
import Link from 'next/link';
import { Avatar, Badge, styled } from '@mui/material';

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

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const toggleSettingsDropdown = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  console.log('isSettingsOpen: ', isSettingsOpen)


  const [collapse, setCollapse] = useState(false)

  console.log('collapse: ', collapse)

  return (
    <div className="backendLayout">
      {/* Left Sidebar */}
      <aside className={`sidebar ${collapse ? 'hide-sidebar' : ''}`}>
        <button className="btn toggle-btn shadow-none" onClick={()=>setCollapse((prev)=>!prev)}>
          <i className='fa-solid fa-bars-staggered'></i>
        </button>
        <div className="sidebar-logo">
          <Link href="/">
            <img src="/assets/images/pluto-profile-logo.png" alt="" className='img-fluid' />
          </Link>
        </div>
        <ul class="nav flex-column">
          <li class="nav-item">
            <Link class="nav-link" href="#">Dashboard</Link>
          </li>
          <li class="nav-item" onClick={() => setIsSettingsOpen((prev) => !prev)}>
            <Link
              class={`nav-link ${isSettingsOpen ? 'open' : ''}`}
              data-bs-toggle="collapse"
              href="#collapseExample"
              role="button"
              aria-expanded="false"
              aria-controls="collapseExample"

            >Settings</Link>
            <div class="collapse" id="collapseExample">
              <ul className="nav flex-column">
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
                <li className="nav-item">
                  <Link href="/admin/settings/course-section" className="nav-link ps-4">
                    Course Section Bind
                  </Link>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </aside>

      {/* Main Content Area */}
      <div className={`main-content ${collapse ? 'full-width' : ''}`}>
        <header>
          <nav class="navbar bg-white">
            <div class="container-fluid">
              <form class="d-flex" role="search">
                <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                <button class="btn btn-outline-success" type="submit">Search</button>
              </form>
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
              >
                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
              </StyledBadge>
            </div>
          </nav>
        </header>
        <main>
          {children}
        </main>
      </div>
    </div>
  );
};

export default BackendLayout;
