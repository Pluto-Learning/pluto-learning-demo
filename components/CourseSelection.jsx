"use client"
import { createStudentCourseSectionBinding, fetchAllCourseSectionDetails, fetchCourse, fetchSection, fetchUserProfileById } from '@/app/api/crud'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function CourseSelection({ updateStudentCourseSection }) {

    const { data: session } = useSession();
    const [filteredCourses, setFilteredCourses] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [allCourseSectionDetails, setAllCourseSectionDetails] = useState([]);
    const [section, setSection] = useState([])
    const [userData, setUserData] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);


    const [formData, setFormData] = useState({
        sectionCourseId: "",
        userID: "",
        yearOfCourse: "",
        courseId: "",
        courseNumber: "",
        sectionId: "",
        sectionNumber: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCourseSearch = (e) => {
        const searchValue = e.target.value;
        setSearchTerm(searchValue);
    
        // Filter the courses based on user input
        const filtered = allCourseSectionDetails
            ?.filter((c) =>
                c.courseName.toLowerCase().includes(searchValue.toLowerCase()) ||
                c.courseNumber.toLowerCase().includes(searchValue.toLowerCase())
            )
            // Remove duplicates based on courseId
            .reduce((acc, current) => {
                const duplicate = acc.find(item => item.courseId === current.courseId);
                if (!duplicate) {
                    acc.push(current);
                }
                return acc;
            }, []);
            
        setFilteredCourses(filtered);
        setSection([]);
    };
    

    const handleCourseSelect = (selectedCourse) => {

        console.log(selectedCourse)
        console.log(allCourseSectionDetails)

        const getSection = allCourseSectionDetails?.filter((item) => item?.courseId === selectedCourse?.courseId)
        setSection(getSection)

        setFormData({
            ...formData,
            courseId: selectedCourse?.courseId,
            courseNumber: selectedCourse?.courseNumber,
            yearOfCourse: selectedCourse?.yearOfCourse,
            // sectionCourseId: selectedCourse?.sectionCourseId,
        });
        setSearchTerm(selectedCourse.courseName); // Set the selected course name in the input
        setFilteredCourses([]); // Clear the dropdown
    };

    const handleSectionSelect = (selectedSection) => {

        console.log(selectedSection)

        // Update the formData with the selected section, start time, and end time
        setFormData({
            ...formData,
            sectionId: selectedSection.sectionId,
            sectionNumber: selectedSection.sectionNumber
        });
    };

    const handleCreate = async (e) => {
        try {
            await createStudentCourseSectionBinding(formData, session?.user?.token)
            updateStudentCourseSection()
        } catch (error) {
            console.log("Error creating Student Course Section Binding: ", error)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate required fields
        if (!formData.courseId || !formData.sectionId) {
            toast.error("Please select both a course and a section before submitting.");
            return; // Don't submit if validation fails
        }

        handleCreate();
        resetForm();
        setSearchTerm('');
        console.log('Form submitted', formData);
    };

    const getAllCourseSectionDetails = async () => {
        try {
            const data = await fetchAllCourseSectionDetails(session?.user?.token);
            setAllCourseSectionDetails(data);
        } catch (error) {
            console.error('Error fetching universities:', error);
        }
    }

    const getUserData = async () => {
        if (currentUserId) {
            const data = await fetchUserProfileById(currentUserId, session?.user?.token);
            setUserData(data);
            setFormData({
                ...formData,
                userID: data?.userID,
                // yearOfCourse: data?.
            })
        }
    };

    useEffect(() => {
        if (session) {
            setCurrentUserId(session?.user?.id); // Set currentUserId from session
        }
    }, [session]);

    useEffect(() => {
        getUserData();
    }, [currentUserId]);

    useEffect(() => {
        getAllCourseSectionDetails()
    }, [])

    const resetForm = () => {
        setFormData({
            sectionCourseId: "",
            userID: "",
            yearOfCourse: "",
            courseId: "",
            courseNumber: "",
            sectionId: "",
            sectionNumber: ""
        });
    };

    // Helper function to format dates
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    console.log('allCourseSectionDetails: ', allCourseSectionDetails)
    console.log('getSection', section)
    console.log('formData', formData)
    console.log('userData', userData)

    return (
        <>
            <div className='multistep-form-step course'>
                <form onSubmit={handleSubmit}>
                    <div className="course-add-section">
                        <div className='course-input'>
                            <input
                                type="text"
                                className='form-control'
                                placeholder='Type your course name'
                                value={searchTerm}
                                onChange={handleCourseSearch}
                            />

                            {/* Render filtered courses as a dropdown */}
                            {filteredCourses.length > 0 && searchTerm?.length > 0 && (
                                <ul className="course-dropdown">
                                    {filteredCourses.map((c) => (
                                        <li
                                            key={c.courseId}
                                            onClick={() => handleCourseSelect(c)}
                                            className="dropdown-item"
                                        >
                                            {c.courseName} ({c.courseNumber})
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className='section-input'>
                            <select
                                className="form-select"
                                aria-label="Select section"
                                name="section"
                                value={formData.sectionId}
                                onChange={(e) => {
                                    const selectedSection = section.find(sec => sec.sectionId === e.target.value);
                                    handleSectionSelect(selectedSection);
                                }}
                            >
                                <option value="">Select Section</option>
                                {section.map(sec => (
                                    <option key={sec.sectionId} value={sec.sectionId}>
                                        {sec.sectionName} ({formatDate(sec.sectionStartTime)} - {formatDate(sec.sectionEndTime)})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* <div className='form-group'>
                                                        <label htmlFor="fromTime">From Time</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="fromTime"
                                                            value={formData.fromTime}
                                                            readOnly
                                                        />
                                                    </div>

                                                    <div className='form-group'>
                                                        <label htmlFor="toTime">To Time</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="toTime"
                                                            value={formData.toTime}
                                                            readOnly
                                                        />
                                                    </div> */}

                        <button className="btn pluto-pink-btn">Add</button>
                    </div>
                </form>
            </div>
        </>
    )
}
