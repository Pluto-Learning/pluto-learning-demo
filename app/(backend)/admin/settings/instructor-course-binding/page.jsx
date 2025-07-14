"use client"
import {
    createCourseInstructor,
    deleteCourse,
    fetchAllCourseInstructors,
    fetchAllCourseInstructorSection,
    fetchAllCourseSectionDetails,
    fetchCourse,
    fetchSection,
    updateCourseSection,
} from '@/app/api/crud';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

export default function Page() {

    const { data: session } = useSession();
    console.log('session: ', session);

    const [isUpdateing, setIsUpdateing] = useState(false);
    const [currentCourseSectionId, setCurrentCourseSectionId] = useState(null);

    const [allCourseInstructors, setAllCourseInstructors] = useState([]);
    const [allCourseSectionDetails, setAllCourseSectionDetails] = useState([]);
    
    const [course, setCourse] = useState([]);
    const [sections, setSections] = useState([]);
    console.log('allcoursed: ', course)
    
    const [formData, setFormData] = useState({
        courseId: '',
        instructorId: '',
    });

    useEffect(() => {
        // Set instructorId after session is loaded
        if (session?.user?.id) {
            setFormData(prev => ({
                ...prev,
                instructorId: session?.user?.id
            }));
        }
    }, [session]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCreate = async () => {
        try {
            await createCourseInstructor(formData, session?.user?.token);
            resetForm();
            getAllCourseInstructors();
        } catch (error) {
            console.error("Error Course Section Binding:", error);
        }
    };

    const handleDelete = async (id) => {
        await deleteCourse(id, session?.user?.token);
    };

    const handleUpdate = async () => {
        try {
            await updateCourseSection(currentCourseSectionId, formData, session?.user?.token);
            resetForm();
            getAllCourseInstructors();
        } catch (error) {
            console.error("Error updating course:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isUpdateing) {
            await handleUpdate();
        } else {
            await handleCreate();
        }
    };


    const getAllCourse = async () => {
        try {
            const data = await fetchCourse(session?.user?.token);
            setCourse(data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const getAllSection = async () => {
        try {
            const data = await fetchSection(session?.user?.token);
            setSections(data);
        } catch (error) {
            console.error('Error fetching sections:', error);
        }
    };


    const getAllCourseInstructors = async () => {
        try {
            const data = await fetchAllCourseInstructorSection(session?.user?.token);
            setAllCourseInstructors(data);
        } catch (error) {
            console.error('Error fetching instructors:', error);
        }
    };

    const getAllCourseSectionDetails = async () => {
        try {
            const data = await fetchAllCourseSectionDetails(session?.user?.token);
            setAllCourseSectionDetails(data);
        } catch (error) {
            console.error('Error fetching universities:', error);
        }
    }

    const resetForm = () => {
        setFormData({
            courseId: '',
            instructorId: session?.user?.id || '',
        });
        setIsUpdateing(false);
        setCurrentCourseSectionId(null);
    };

    useEffect(() => {
        getAllCourseInstructors();
        getAllCourse();
        getAllSection();
        getAllCourseSectionDetails()
    }, [session]);

    console.log('allCourseSectionDetails: ', allCourseSectionDetails);

    return (
        <div className='university-list'>
            <h1>Instructor Course Details</h1>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h4>Course Section Details</h4>
                            <button className='btn btn-sm pluto-blue-btn' data-bs-toggle="modal" data-bs-target="#exampleModal">Create +</button>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th className='text-center'>SL</th>
                                        <th className='text-center'>Instructor ID</th>
                                        <th className='text-center'>First Name</th>
                                        <th className='text-center'>Last Name</th>
                                        <th className='text-center'>Course Name</th>
                                        <th className='text-center'>Section Name</th>
                                        <th className='text-center'>Section Start Time</th>
                                        <th className='text-center'>Section End Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        allCourseInstructors?.map((item, index) => (
                                            <tr key={item.id}>
                                                <td className='text-center'>{index + 1}</td>
                                                <td className='text-center'>{item.instructorId}</td>
                                                <td className='text-center'>{item.firstName}</td>
                                                <td className='text-center'>{item.lastName}</td>
                                                <td className='text-center'>{item.courseName}</td>
                                                <td className='text-center'>{item.sectionName}</td>
                                                <td className='text-center'>{new Date(item.sectionStartTime).toLocaleString('en-GB', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: true
                                                })}</td>
                                                <td className='text-center'>{new Date(item.sectionEndTime).toLocaleString('en-GB', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: true
                                                })}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="exampleModalLabel">
                                        {isUpdateing ? "Update Course" : "Select Course"}
                                    </h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label htmlFor="instructor-id" className="form-label">Instructor</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="instructor-id"
                                                name="instructorId"
                                                value={formData.instructorId}
                                                onChange={handleChange}
                                                disabled
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="course-name" className="form-label">Course</label>
                                            <select
                                                className="form-select"
                                                name="courseId"
                                                value={formData.courseId}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select Course</option>
                                                {/* {
                                                    course?.map(item => (
                                                        <option key={item.courseId} value={item.courseId}>
                                                            {item.courseName}
                                                        </option>

                                                    ))
                                                } */}

                                                {/* {
                                                    allCourseSectionDetails?.map(item => (
                                                        <option key={item.courseId} value={item.courseId}>
                                                            {item.courseName} - {item.sectionName} -{" "}
                                                            {new Date(item.sectionStartTime).toLocaleString('en-GB', {
                                                                day: '2-digit',
                                                                month: 'short',
                                                                year: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                                hour12: true
                                                            })} -{" "}
                                                            {new Date(item.sectionEndTime).toLocaleString('en-GB', {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                                hour12: true
                                                            })}
                                                        </option>

                                                    ))
                                                } */}

                                                {
                                                    allCourseSectionDetails
                                                        ?.filter((section) => {
                                                            return !allCourseInstructors.some((instructor) =>
                                                                instructor.courseName === section.courseName &&
                                                                instructor.sectionName === section.sectionName &&
                                                                new Date(instructor.sectionStartTime).getTime() === new Date(section.sectionStartTime).getTime() &&
                                                                new Date(instructor.sectionEndTime).getTime() === new Date(section.sectionEndTime).getTime()
                                                            );
                                                        })
                                                        .map((item) => (
                                                            <option key={item.courseId} value={item.courseId}>
                                                                {item.courseName} - {item.sectionName} - {" "}
                                                                ({new Date(item.sectionStartTime).toLocaleString('en-GB', {
                                                                    day: '2-digit',
                                                                    month: 'short',
                                                                    year: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                    hour12: true
                                                                })} -{" "}
                                                                {new Date(item.sectionEndTime).toLocaleString('en-GB', {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                    hour12: true
                                                                })})
                                                            </option>
                                                        ))
                                                }


                                            </select>
                                        </div>

                                        <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">
                                            {isUpdateing ? "Update" : "Create"}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
