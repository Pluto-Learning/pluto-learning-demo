"use client"
import JoinATablePopup from '@/components/JoinATablePopup'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import AvatarGroup from '@mui/material/AvatarGroup';
import PopularTableSlider from '@/components/popular-table/PopularTableSlider';
import VirtualTableCard from '@/components/popular-table/VirtualTableCard';
import HomeLayout from '@/layouts/homeLayout/HomeLayout';
import { fetchAllTable, fetchAllTableDetails, fetchAllTableWithMembers, fetchRecentTableMembersByUserId, fetchTableDesilsByUserId, FetchTableMembersDetailsById } from '@/app/api/crud';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import StepOne from '@/components/popular-table/createTable/StepOne';
import StepTwo from '@/components/popular-table/createTable/StepTwo';
import VerticalStepper from '@/components/VerticalStepper';
import EditTablePicture from '@/components/popular-table/EditTablePicutre';
import EditTableInfo from '@/components/popular-table/EditTableInfo';
import InviteFriendsPopup from '@/components/InviteFriendsPopup';
import VirtualCardSkeleton from '@/components/skeleton/VirtualCardSkeleton';

export default function () {

    const { data: session } = useSession();
    console.log('session: ', session?.user);

    // const token = useSelector((state) => state.auth.token);
    // const user = useSelector((state) => state.auth.user);
    const [alltable, setAllTable] = useState(null);
    const [allTableDetails, setAllTableDetails] = useState(null);
    const [allTableWithMember, setAllTableWithMember] = useState(null);
    const [getTableMemberById, setGetTableMemberById] = useState([])
    const [recentTable, setRecentTable] = useState([]);
    const [tableDetailsByUserId, setTableDetailsByUserId] = useState([])
    const [searchQuery, setSearchQuery] = useState('');
    const [courseFilter, setCourseFilter] = useState(''); // For dropdown filter

    const getAllTable = async () => {
        try {
            const data = await fetchAllTable(session?.user?.token);
            setAllTable(data);
        } catch (error) {
            console.error("Error fetching universities:", error);
        }
    };

    const GetAllTableDetails = async () => {
        try {
            const data = await fetchAllTableDetails(session?.user?.token);
            setAllTableDetails(data);
        } catch (error) {
            console.error("Error fetching universities:", error);
        }
    };

    const GetAllTableWithMember = async () => {
        try {
            const data = await fetchAllTableWithMembers(session?.user?.token);
            setAllTableWithMember(data);
        } catch (error) {
            console.error("Error fetching universities:", error);
        }
    };

    const GetRecentTableMembersByUserId = async () => {
        try {
            const data = await fetchRecentTableMembersByUserId(session?.user?.id, session?.user?.token);
            const sortedData = data.sort((a, b) => new Date(b.lastActiveDtTime) - new Date(a.lastActiveDtTime));
            setRecentTable(sortedData.slice(0, 3));
        } catch (error) {
            console.log('Error GetRecentTableMembersByUserId: ', error)
        }
    }

    const GetTableDetailsByUserId = async () => {
        try {
            const data = await fetchTableDesilsByUserId(session?.user?.id, session?.user?.token);
            setTableDetailsByUserId(data)
        } catch (error) {
            console.error("Error fetching Table Details By ID:", error);
        }
    }


    // Filter table details based on search query and selected course filter
    const filteredTableDetails = tableDetailsByUserId.filter((item) => {
        const matchesSearch = searchQuery
            ? item?.table?.roomName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item?.table?.courseName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item?.table?.yearOfCourse?.toLowerCase().includes(searchQuery.toLowerCase())
            : true;

        const matchesCourseFilter = courseFilter ? item?.table?.courseName === courseFilter : true;

        return matchesSearch && matchesCourseFilter;
    });

    // Handle input change for the search field
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Handle change for course filter
    const handleCourseFilterChange = (e) => {
        setCourseFilter(e.target.value);
    };

    useEffect(() => {
        getAllTable()
        GetAllTableDetails()
        GetAllTableWithMember()
    }, [])

    useEffect(() => {
        GetRecentTableMembersByUserId()

        // Initial call
        GetTableDetailsByUserId();

        // Set up interval to call every minute
        const intervalId = setInterval(() => {
            GetTableDetailsByUserId();
        }, 10000); // 60000 milliseconds = 1 minute

        // Cleanup function to clear interval when component unmounts
        return () => clearInterval(intervalId);

    }, [session]);

    console.log('table: ', alltable)
    console.log('recentTable: ', recentTable)
    console.log('allTableDetails: ', allTableDetails)
    console.log('tableDetailsByUserId: ', tableDetailsByUserId)

    // =========================================
    const [currentStep, setCurrentStep] = useState(1);

    const handleNextStep = () => {
        setCurrentStep(currentStep + 1);
    };

    const getTableMember = async (e) => {
        try {
            const response = await FetchTableMembersDetailsById(roomId, session?.user?.token);
            setGetTableMemberById(response)
        } catch (error) {
            console.log('Error Fetching Table Member By Id', error)
        }
    }

    useEffect(() => {
        getTableMember()
    }, [])



    return (
        <HomeLayout>
            <div className='popular-tables'>

                <div className="popular-table-slider-wrapper"
                    style={{
                        background: `linear-gradient(180deg, rgba(127, 0, 255, 0.5) 0%, rgba(225, 0, 255, 0.5) 100%), url('/assets/images/popular-tables/background.png')`,
                        backgroundSize: 'cover', // Optional: Ensures the image covers the div
                        backgroundPosition: 'center' // Optional: Centers the background image
                    }}
                >
                    <div className='popular-table-slider-content'>
                        <h1>Popular Tables</h1>
                        {
                            allTableDetails?.length > 0 && <PopularTableSlider table={tableDetailsByUserId} updateAllTableDetails={GetTableDetailsByUserId} />
                        }
                    </div>

                </div>

                <div className="recent-table-wrapper" style={{ background: "url('/assets/images/recent-tables/recent-table-bg.png')" }}>
                    <div className="container">
                        <h2 className='text-center'>Recent Tables</h2>
                        {/* <div className="recent-tables" > */}
                        <div className="row g-4" >
                            {
                                recentTable && recentTable?.length > 0 &&
                                recentTable?.map((item) => {

                                    const {
                                        roomId,
                                        roomName,
                                        meetingTime,
                                        meetingDay,
                                        visibilityType,
                                        tableType,
                                        shortDescription,
                                        longDescription,
                                        roomImg,
                                        status,
                                        firstName,
                                        lastName,
                                        userID,
                                        email,
                                        userType,
                                        gender,
                                        mobile,
                                        dateOfBirth,
                                        studentYear,
                                        profilePicture,
                                        lastActiveDtTime
                                    } = item;

                                    return (
                                        <>
                                            <div className="col-lg-4">
                                                <div className="popular-table-card recent-card card h-100" >
                                                    <div className="card-body">
                                                        {/* <div className="status">
                                                            <span className="status-light available"></span>
                                                            <span className='status-title'>Availabe</span>
                                                        </div> */}
                                                        <div className="card-img">
                                                            <img src={!roomImg ? "/assets/images/table-default-img.png" : roomImg} alt="" className='img-fluid card-img-top' />
                                                        </div>
                                                        <div className="card-info">
                                                            <div className="title-wrapper">
                                                                <h4 className="card-title table-name">{roomName}</h4>
                                                                {
                                                                    session?.user?.token && <button className="btn btn-sm pluto-pink-btn join" data-bs-toggle="modal" data-bs-target={`#joinTable-${roomId}`}>Join +</button>
                                                                }
                                                            </div>
                                                            <p className="college-name">{shortDescription}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )
                                })
                            }

                        </div>
                    </div>
                </div>

                <div className="all-popular-table-main">
                    <div className="container">
                        <div className="top">
                            <div className="single">
                                <div className="icon">
                                    <img src="/assets/images/popular-tables/classes.png" alt="" />
                                </div>
                                <div className="info">
                                    <h6>Classes</h6>
                                </div>
                            </div>
                            <div className="single">
                                <div className="icon">
                                    <img src="/assets/images/popular-tables/social.png" alt="" />
                                </div>
                                <div className="info">
                                    <h6>Social</h6>
                                </div>
                            </div>
                            <div className="single">
                                <div className="icon">
                                    <img src="/assets/images/popular-tables/meetings.png" alt="" />
                                </div>
                                <div className="info">
                                    <h6>Meetings</h6>
                                </div>
                            </div>
                        </div>
                        <div className="all-popular-table-card-wrapper">
                            <div className="filter-section">
                                <div className="row align-items-center g-md-0 g-4">
                                    <div className="col-md-6">
                                        <div className="search">
                                            <input
                                                type="search"
                                                className='form-control rounded-pill'
                                                placeholder='Search Course, Table, College, years of course etc.'
                                                value={searchQuery}
                                                onChange={handleSearchChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="sort">
                                            <select
                                                className="form-select rounded-pill"
                                                aria-label="Course filter"
                                                value={courseFilter}
                                                onChange={handleCourseFilterChange}
                                            >
                                                <option value="">Filter by Course</option>
                                                {/* Map unique course names as options */}
                                                {[...new Set(tableDetailsByUserId.map((item) => item.table.courseName))].map((course) => (
                                                    <option key={course} value={course}>
                                                        {course}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row g-lg-4 g-md-3 g-3">
                                {
                                    (session?.user?.userType.toLowerCase() == 'admin' || session?.user?.userType.toLowerCase() == 'instructor') &&

                                    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                                        {/* <Link href={`/popular-table/create`} prefetch={true}> */}
                                        <div class="popular-table-card card create-card h-100" data-bs-toggle="modal" data-bs-target="#createTableModal">
                                            <div class="card-body">
                                                <div className="create-info">
                                                    <div className="icon">
                                                        <svg width="57" height="57" viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M21.873 31.2224H3.20633C2.38121 31.2224 1.58988 31.5502 1.00644 32.1337C0.422992 32.7171 0.0952148 33.5084 0.0952148 34.3335V53.0002C0.0952148 53.8253 0.422992 54.6167 1.00644 55.2001C1.58988 55.7836 2.38121 56.1113 3.20633 56.1113H21.873C22.6981 56.1113 23.4894 55.7836 24.0729 55.2001C24.6563 54.6167 24.9841 53.8253 24.9841 53.0002V34.3335C24.9841 33.5084 24.6563 32.7171 24.0729 32.1337C23.4894 31.5502 22.6981 31.2224 21.873 31.2224ZM18.7619 49.8891H6.31744V37.4447H18.7619V49.8891ZM52.9841 0.111328H34.3174C33.4923 0.111328 32.701 0.439105 32.1175 1.02255C31.5341 1.606 31.2063 2.39732 31.2063 3.22244V21.8891C31.2063 22.7142 31.5341 23.5055 32.1175 24.089C32.701 24.6724 33.4923 25.0002 34.3174 25.0002H52.9841C53.8092 25.0002 54.6005 24.6724 55.184 24.089C55.7674 23.5055 56.0952 22.7142 56.0952 21.8891V3.22244C56.0952 2.39732 55.7674 1.606 55.184 1.02255C54.6005 0.439105 53.8092 0.111328 52.9841 0.111328ZM49.873 18.778H37.4286V6.33355H49.873V18.778ZM52.9841 40.5558H46.7619V34.3335C46.7619 33.5084 46.4341 32.7171 45.8507 32.1337C45.2672 31.5502 44.4759 31.2224 43.6508 31.2224C42.8257 31.2224 42.0343 31.5502 41.4509 32.1337C40.8674 32.7171 40.5397 33.5084 40.5397 34.3335V40.5558H34.3174C33.4923 40.5558 32.701 40.8835 32.1175 41.467C31.5341 42.0504 31.2063 42.8418 31.2063 43.6669C31.2063 44.492 31.5341 45.2833 32.1175 45.8668C32.701 46.4502 33.4923 46.778 34.3174 46.778H40.5397V53.0002C40.5397 53.8253 40.8674 54.6167 41.4509 55.2001C42.0343 55.7836 42.8257 56.1113 43.6508 56.1113C44.4759 56.1113 45.2672 55.7836 45.8507 55.2001C46.4341 54.6167 46.7619 53.8253 46.7619 53.0002V46.778H52.9841C53.8092 46.778 54.6005 46.4502 55.184 45.8668C55.7674 45.2833 56.0952 44.492 56.0952 43.6669C56.0952 42.8418 55.7674 42.0504 55.184 41.467C54.6005 40.8835 53.8092 40.5558 52.9841 40.5558ZM21.873 0.111328H3.20633C2.38121 0.111328 1.58988 0.439105 1.00644 1.02255C0.422992 1.606 0.0952148 2.39732 0.0952148 3.22244V21.8891C0.0952148 22.7142 0.422992 23.5055 1.00644 24.089C1.58988 24.6724 2.38121 25.0002 3.20633 25.0002H21.873C22.6981 25.0002 23.4894 24.6724 24.0729 24.089C24.6563 23.5055 24.9841 22.7142 24.9841 21.8891V3.22244C24.9841 2.39732 24.6563 1.606 24.0729 1.02255C23.4894 0.439105 22.6981 0.111328 21.873 0.111328ZM18.7619 18.778H6.31744V6.33355H18.7619V18.778Z" fill="#E5E5E5" />
                                                        </svg>
                                                    </div>
                                                    <h4 className="card-title table-name">Create new Table</h4>
                                                </div>
                                            </div>
                                        </div>
                                        {/* </Link> */}
                                    </div>
                                }

                                {filteredTableDetails.length > 0 ? (
                                    filteredTableDetails.map((item) => (
                                        <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6" key={item.table.roomId}>
                                            <VirtualTableCard
                                                tableData={item.table}
                                                tableMember={item.tableMembers}
                                                updateAllTableDetails={GetTableDetailsByUserId}
                                            />

                                            {/* Join Table Modal */}
                                            <div className="modal fade join-table-modal" id={`joinTable-${item.table.roomId}`} tabIndex="-1">
                                                <div className="modal-dialog modal-xl modal-dialog-centered">
                                                    <div className="modal-content">
                                                        <div className="modal-header">
                                                            <h5 className="modal-title">Welcome Back, {session?.user?.name}</h5>
                                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                        </div>
                                                        <div className="modal-body">
                                                            <JoinATablePopup tableData={item.table} session={session} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Edit Table Info Modal */}
                                            <div className="modal fade" id={`editTable-${item.table.roomId}`} tabIndex="-1">
                                                <div className="modal-dialog">
                                                    <div className="modal-content">
                                                        <div className="modal-header">
                                                            <h1 className="modal-title fs-5">Edit Table Info</h1>
                                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                        </div>
                                                        <div className="modal-body">
                                                            <EditTableInfo tableData={item.table} updateAllTableDetails={GetTableDetailsByUserId} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Edit Profile Picture Modal */}
                                            <div className="modal fade edit-table-picture-modal" id={`editTableImage-${item.table.roomId}`} tabIndex="-1">
                                                <div className="modal-dialog">
                                                    <div className="modal-content">
                                                        <div className="modal-header">
                                                            <h1 className="modal-title fs-5">{item.table.roomName}</h1>
                                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                        </div>
                                                        <div className="modal-body">
                                                            <EditTablePicture tableData={item.table} updateAllTableDetails={GetTableDetailsByUserId} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Invite Friends Modal */}
                                            <div className="modal fade invite-friends-modal" id={`inviteFriendsModal-${item.table.roomId}`} tabIndex="-1">
                                                <div className="modal-dialog modal-dialog-centered modal-xl">
                                                    <div className="modal-content">
                                                        <div className="modal-header border-0">
                                                            <img src="/assets/images/pluto-profile-logo.png" alt="" className="img-fluid" />
                                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                        </div>
                                                        <div className="modal-body">
                                                            <div className="invite-friends">
                                                                <div className="invite-friends-title">
                                                                    <h4>Find your people</h4>
                                                                    <p>Start here for information, connection, and community.</p>
                                                                </div>
                                                                <InviteFriendsPopup tableData={item.table} tableMember={item.tableMembers} updateAllTableDetails={GetTableDetailsByUserId} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-lg-3">
                                        <h4>No Table Found</h4>
                                    </div>
                                )}

                                {/* <div className="col-lg-3">
                                    <VirtualTableCard />
                                </div>
                                <div className="col-lg-3">
                                    <VirtualTableCard />
                                </div>
                                <div className="col-lg-3">
                                    <VirtualTableCard />
                                </div> */}



                            </div>

                        </div>
                    </div>
                </div>

                {/* <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#joinTable">
                    Launch demo modal
                </button> */}

                {/* <div class="modal fade join-table-modal" id="joinTable" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-xl">
                        <div class="modal-content">
                            <div class="modal-header">
                                <div>
                                    <h5 class="modal-title" id="exampleModalLabel">Welcome Back, {session?.user?.name}</h5>
                                    <p>Take a look your learning progress for today September 22, 2024</p>
                                </div>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <JoinATablePopup session={session} />
                            </div>
                        </div>
                    </div>
                </div> */}

                {/* <JoinATablePopup /> */}

                {/* ================== Create Table ================ */}

                <div class="modal fade table-create-modal" id="createTableModal" tabindex="-1" aria-labelledby="createTableModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered modal-lg ">
                        <div class="modal-content">
                            {/* <div class="modal-header">
                                <h1 class="modal-title fs-5" id="createTableModalLabel">Create Table</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div> */}
                            <div class="modal-body">
                                <div className='table-create-form'>
                                    <div className="left">
                                        <div className="step-wrapper">
                                            <ul className='nav flex-column step-info'>
                                                <li className='nav-item'>
                                                    <div className='step-count'>
                                                        <p className="title">Enter Table Info</p>
                                                        <p className={`number ${currentStep === 1 || currentStep === 2 && 'acive'}`}>
                                                            {
                                                                currentStep === 2 ?
                                                                    <i class="fa-solid fa-check"></i> : '1'
                                                            }

                                                        </p>
                                                    </div>
                                                </li>
                                                <li className='nav-item'>
                                                    <div className='step-count'>
                                                        <p className="title">Upload Image</p>
                                                        <p className={`number ${currentStep === 2 && 'acive'}`}>2</p>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="right">
                                        <div className="title-wrapper">
                                            <h4 class="modal-title text-center" id="createTableModalLabel">Create Table</h4>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        {currentStep === 1 && <StepOne onNextStep={handleNextStep} updateAllTableDetails={GetTableDetailsByUserId} />}
                                        {currentStep === 2 && <StepTwo setCurrentStep={setCurrentStep} updateAllTableDetails={GetTableDetailsByUserId} />}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </HomeLayout>
    )
}
