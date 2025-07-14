"use client"
import { fetchAllStudentCourseSectionDetails, fetchCourse, fetchSection, fetchStudentCourseSectionDetailsById } from '@/app/api/crud'
import CourseSelection from '@/components/CourseSelection'
import FullCalendarIo from '@/components/FullCalendarIo'
import InviteFriendsPopup from '@/components/InviteFriendsPopup'
import MultiStepForm from '@/components/MultiStepForm'
import MyCalendar from '@/components/MyCalendar'
import HomeLayout from '@/layouts/homeLayout/HomeLayout'
import ProfileLayout from '@/layouts/profileLayout/ProfileLayout'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function page() {

    const { data: session } = useSession();
    const [course, setAllCourse] = useState([])
    const [section, setAllSection] = useState([])
    const [studentCourseSection, setStudentCourseSection] = useState([])
    const [myEvent, setMyEvent] = useState([])

    const [filteredCourses, setFilteredCourses] = useState([])
    const [searchTerm, setSearchTerm] = useState('')

    const [formData, setFormData] = useState({
        studentStatus: '',
        course: '',
        section: '',
        date: '',
        fromTime: '',
        toTime: '',
        purpose: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCourseSearch = (e) => {
        const searchValue = e.target.value;
        setSearchTerm(searchValue);

        // Filter the courses based on user input
        const filtered = course.filter((c) =>
            c.courseName.toLowerCase().includes(searchValue.toLowerCase()) ||
            c.courseNumber.toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredCourses(filtered);
    };

    const handleCourseSelect = (selectedCourse) => {
        setFormData({ ...formData, course: selectedCourse });
        setSearchTerm(selectedCourse.courseName); // Set the selected course name in the input
        setFilteredCourses([]); // Clear the dropdown
    };

    const handleSectionSelect = (selectedSection) => {
        // Update the formData with the selected section, start time, and end time
        setFormData({
            ...formData,
            section: selectedSection.sectionId,
            fromTime: selectedSection.sectionStartTime,
            toTime: selectedSection.sectionEndTime
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted', formData);
    };

    const getAllCourse = async () => {
        try {
            const response = await fetchCourse(session?.user?.token)
            setAllCourse(response)
        } catch (error) {
            toast.error('Error getting course')
            console.log('Error getting course ', error)
        }
    }

    const getAllSection = async () => {
        try {
            const response = await fetchSection(session?.user?.token)
            setAllSection(response)
        } catch (error) {
            toast.error('Error getting section')
            console.log('Error getting section ', error)
        }
    }

    const getAllStudentCourseSection = async () => {
        try {
            const data = await fetchStudentCourseSectionDetailsById(session?.user?.id, session?.user?.token);
            const formattedEvents = data.map(item => ({
                id: item.sectionCourseId || `${item.sectionStartTime}-${item.courseName || item.courseNumber}`,
                title: item.courseName || item.courseNumber,
                allDay: false,
                start: new Date(item.sectionStartTime),
                end: new Date(item.sectionEndTime),
            }));
            setStudentCourseSection(formattedEvents);
        } catch (error) {
            console.log('Error Fetching student course section details', error);
        }
    };
    

    useEffect(() => {
        getAllCourse()
        getAllSection()
        getAllStudentCourseSection()
    }, [])
    
    useEffect(() => {
        getAllStudentCourseSection()
    }, [session])


    // Helper function to format dates
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }


    console.log('session: ', session)
    console.log('studentCourseSection: ', studentCourseSection)

    return (
        <HomeLayout>
            <div className="profile-content pt_50 pb_50">
                <div className="container">
                    <div className="course-selection">
                        <div className="row">
                            <div className="col-lg-6">
                                <h5 className='greetings'>Hi <span className='text-capitalize'>{session?.user?.userName}</span>, lets start with telling us a bit about yourself</h5>
                                <h4 className='question'>What year are you in?</h4>
                                <div className="multistep-form">
                                    <CourseSelection updateStudentCourseSection={getAllStudentCourseSection}/>
                                </div>
                                <div className="btn-wrapper text-center d-none d-lg-block">
                                    <Link href={'/table-discovery'} type='button' className='btn pluto-deep-blue-btn w-50'>Next</Link>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                {/* <MyCalendar studentCourseSection={studentCourseSection} /> */}
                                <FullCalendarIo data={studentCourseSection} />
                                <div className="btn-wrapper text-center d-lg-none mt-3">
                                    <Link href={'/table-discovery'} type='button' className='btn pluto-deep-blue-btn w-50'>Next</Link>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div class="modal fade invite-friends-modal" id="invite-friends-modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div class="modal-dialog modal-xl">
                                        <div class="modal-content">
                                            <div class="modal-header border-0">
                                                <div className="pluto-logo">
                                                    <img src="/assets/images/pluto-profile-logo.png" alt="" className='img-fluid' />
                                                </div>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div class="modal-body">
                                                <div className="friend-request-header">
                                                    <h4>Find your people</h4>
                                                    <p>Start here for information, connection and community.</p>
                                                    <p>Follow 5 of your peers</p>
                                                </div>
                                                <InviteFriendsPopup />
                                            </div>
                                            <div class="modal-footer border-0 d-flex justify-content-center">
                                                <Link href={'/invite-friends'} type="button" class="btn find-more-people-btn">Find More People</Link>
                                            </div>
                                        </div>
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
