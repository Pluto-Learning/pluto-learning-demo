"use client"
import { createCourse, deleteCourse, fetchAllCourseSectionDetails, fetchAllStudentCourseSectionDetails, fetchCourse, fetchCourseById, updateCourse } from '@/app/api/crud';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'

export default function page() {

    const { data: session } = useSession();
    const [isUpdateing, setIsUpdateing] = useState(false);
    const [currentCourseId, setCurrentCourseId] = useState(null);
    const [allStudentCourseSectionDetails, setAllStudentCourseSectionDetails] = useState([]);

    const [formData, setFormData] = useState({
        courseId: '',
        courseName: '',
        courseNumber: '',
        college: '',
        yearOfCourse: '',

    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCreate = async (e) => {
        try {
            await createCourse(formData, session?.user?.token);
            resetForm();
            getAllCourse();
        } catch (error) {
            console.error("Error creating university:", error);
        }
    };

    const handleDelete = async (id) => {
        await deleteCourse(id, session?.user?.token);
        console.log(id)
        getAllCourse();
    }

    const handleUpdate = async () => {
        try {
            await updateCourse(currentCourseId, formData, session?.user?.token);  // Pass the current course ID and form data
            resetForm();   // Reset the form after update
            getAllCourse();  // Refresh the course list

            console.log(currentCourseId, formData)
        } catch (error) {
            console.error("Error updating course:", error);
        }
    };

    const GetAllStudentCourseSectionDetails = async () => {
        try {
            const data = await fetchAllStudentCourseSectionDetails(session?.user?.token);
            setAllStudentCourseSectionDetails(data);
        } catch (error) {
            console.error('Error fetching universities:', error);
        }
    }

    // const getCourseById = async (id) => {
    //     try {
    //         setIsUpdateing(true);
    //         setCurrentCourseId(id);
    //         const data = await fetchCourseById(id, session?.user?.token);
    //         console.log(data)
    //         setFormData({
    //             courseId: data?.courseId,
    //             courseName: data?.courseName,
    //             courseNumber: data?.courseNumber,
    //             college: data?.college,
    //             yearOfCourse: data?.yearOfCourse,
    //         });
    //     } catch (error) {
    //         console.error("Error fetching university by ID:", error);
    //     }
    // };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isUpdateing) {
            await handleUpdate();
        } else {
            await handleCreate();
        }

        // console.log(formData)

        // Close the modal after submission
        // const modalElement = document.getElementById('exampleModal');
        // const modalInstance = bootstrap.Modal.getInstance(modalElement); // Get the modal instance
        // modalInstance.hide(); // Hide the modal
    };

    useEffect(() => {
        GetAllStudentCourseSectionDetails();
    }, []);

    const resetForm = () => {
        setFormData({
            courseId: '',
            courseName: '',
            courseNumber: '',
            college: '',
            yearOfCourse: '',
        });
        setIsUpdateing(false);
        setCurrentCourseId(null);
    };


    return (
        <div className='university-list'>
            <h1>All Student Course Section Details</h1>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h4>All Student Course Section Details</h4>
                            <div>
                                <button className='btn btn-sm pluto-blue-btn' data-bs-toggle="modal" data-bs-target="#exampleModal">Create +</button>
                            </div>
                        </div>
                        <div className=" table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th scope="col" className='text-center'>SL</th>
                                        <th scope="col" className='text-center'>section Course Id</th>
                                        <th scope="col" className='text-center'>user ID</th>
                                        <th scope="col" className='text-center'>course Id</th>
                                        <th scope="col" className='text-center'>course Number</th>
                                        <th scope="col" className='text-center'>section Id</th>
                                        <th scope="col" className='text-center'>section Number</th>
                                        <th scope="col" className='text-center'>course Name</th>
                                        <th scope="col" className='text-center'>college</th>
                                        <th scope="col" className='text-center'>year Of Course</th>
                                        <th scope="col" className='text-center'>section Name</th>
                                        <th scope="col" className='text-center'>section Start Time</th>
                                        <th scope="col" className='text-center'>section End Time</th>
                                        <th scope="col" className='text-center'>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        allStudentCourseSectionDetails && allStudentCourseSectionDetails?.length > 0 &&
                                        allStudentCourseSectionDetails?.map((item, index) => {
                                            const { id,
                                                sectionCourseId,
                                                userID,
                                                courseId,
                                                courseNumber,
                                                sectionId,
                                                sectionNumber,
                                                courseName,
                                                college,
                                                yearOfCourse,
                                                sectionName,
                                                sectionStartTime,
                                                sectionEndTime,
                                            } = item;
                                            return (
                                                <tr>
                                                    <td scope="row" className='text-center'>{index + 1}</td>
                                                    <td className='text-center'>{sectionCourseId}</td>
                                                    <td className='text-center'>{userID}</td>
                                                    <td className='text-center'>{courseId}</td>
                                                    <td className='text-center'>{courseNumber}</td>
                                                    <td className='text-center'>{sectionId}</td>
                                                    <td className='text-center'>{sectionNumber}</td>
                                                    <td className='text-center'>{courseName}</td>
                                                    <td className='text-center'>{college}</td>
                                                    <td className='text-center'>{yearOfCourse}</td>
                                                    <td className='text-center'>{sectionName}</td>
                                                    <td className='text-center'>{sectionStartTime}</td>
                                                    <td className='text-center'>{sectionEndTime}</td>
                                                    <td className='text-center'>
                                                        <div className="btn-wrapper d-grid gap-2 d-md-block">
                                                            <button
                                                                className='btn btn-sm pluto-yellow-btn me-md-2'
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#exampleModal"
                                                                onClick={() => getCourseById(item.courseId)}
                                                            >Update</button>
                                                            <button className='btn btn-sm pluto-pink-btn' onClick={() => handleDelete(courseId)}>Delete</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>


                    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h1 className="modal-title fs-5" id="exampleModalLabel">
                                        {isUpdateing ? "Update Course" : "Create Course"}
                                    </h1>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <form onSubmit={handleSubmit}>
                                        {/* <div class="mb-3">
                      <label for="course-id" class="form-label" >Course ID</label>
                      <input type="text" class="form-control" id="course-id" aria-describedby="emailHelp" onChange={handleChange} value={formData.courseId} name={'courseId'} />
                    </div> */}
                                        <div class="mb-3">
                                            <label for="course-name" class="form-label" >Course Name</label>
                                            <input type="text" class="form-control" id="course-name" aria-describedby="emailHelp" onChange={handleChange} value={formData.courseName} name={'courseName'} />
                                        </div>
                                        <div class="mb-3">
                                            <label for="course-number" class="form-label" >Course Number</label>
                                            <input type="text" class="form-control" id="course-number" aria-describedby="emailHelp" onChange={handleChange} value={formData.courseNumber} name={'courseNumber'} />
                                        </div>
                                        <div class="mb-3">
                                            <label for="college" class="form-label" >College</label>
                                            <input type="text" class="form-control" id="college" aria-describedby="emailHelp" onChange={handleChange} value={formData.college} name={'college'} />
                                        </div>
                                        <div class="mb-3">
                                            <label for="yearOfCourse" class="form-label">Year of Course</label>
                                            <select class="form-select" id="yearOfCourse" aria-label="Select year of course" onChange={handleChange} value={formData.yearOfCourse} name="yearOfCourse">
                                                <option value="">Year of Course</option>
                                                <option value="freshman">Freshman</option>
                                                <option value="sophomore">Sophomore</option>
                                                <option value="junior">Junior</option>
                                                <option value="senior">Senior</option>
                                            </select>
                                        </div>
                                        <button type="submit" className="btn btn-primary">{isUpdateing ? "Update" : "Create"}</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
