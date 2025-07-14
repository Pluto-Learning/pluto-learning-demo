"use client"
import { createCourse, createCourseSectionBinding, deleteCourse, fetchAllCourseSectionDetails, fetchCourse, fetchCourseById, fetchCourseSectionDetailsById, fetchGetAllCourseSectionMapping, fetchSection, updateCourse, updateCourseSection } from '@/app/api/crud';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'

export default function page() {

    const { data: session } = useSession()
    console.log('session: ', session)

    const [isUpdateing, setIsUpdateing] = useState(false);
    // const [currentCourseId, setCurrentCourseId] = useState(null);
    const [currentCourseSectionId, setCurrentCourseSectionId] = useState(null);
    const [allCourseSectionDetails, setAllCourseSectionDetails] = useState([]);

    const [course, setCourse] = useState([])
    const [sections, setSections] = useState([])
    console.log('alllcourse: ', course)
    console.log('alllsections: ', sections)

    const [formData, setFormData] = useState({
        // courseSectionId: '',
        courseId: '',
        sectionId: '',
        createBy: '',
        updateBy: '',
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
            await createCourseSectionBinding(formData, session?.user?.token);  // Pass the form data and user token
            resetForm();
            getAllCourseSectionDetails();
        } catch (error) {
            console.error("Error Course Sectin Binding:", error);
        }
    };

    const handleDelete = async (id) => {
        await deleteCourse(id, session?.user?.token);
        console.log(id)
        // getAllCourse();
    }

    const handleUpdate = async () => {
        try {
            await updateCourseSection(currentCourseSectionId, formData, session?.user?.token);  // Pass the current course ID and form data
            resetForm();   // Reset the form after update
            getAllCourseSectionDetails();  // Refresh the course list
            console.log('sssssssssssssss', currentCourseSectionId, formData)
        } catch (error) {
            console.error("Error updating course:", error);
        }
    };

    const getAllCourseSectionDetails = async () => {
        try {
            const data = await fetchAllCourseSectionDetails(session?.user?.token);
            setAllCourseSectionDetails(data);
            setCourseSectionBindings(data); // save bindings
        } catch (error) {
            console.error('Error fetching course-section details:', error);
        }
    }


    const getCourseSectionBindingById = async (id) => {
        try {
            setIsUpdateing(true);
            setCurrentCourseSectionId(id);
            const data = await fetchCourseSectionDetailsById(id, session?.user?.token);
            console.log(id)
            console.log(data)

            setFormData({
                courseSectionId: data?.courseSectionId,
                courseId: data?.courseId,
                sectionId: data?.sectionId,
                createBy: '',
                updateBy: '',
            });

        } catch (error) {
            console.error("Error fetching university by ID:", error);
        }
    };

    const getAllCourse = async () => {
        try {
            const data = await fetchCourse(session?.user?.token);
            setCourse(data);
        } catch (error) {
            console.error('Error fetching Course:', error);
        }
    }

    const getAllSection = async () => {
        try {
            const data = await fetchSection(session?.user?.token);
            setSections(data);
        } catch (error) {
            console.error('Error fetching universities:', error);
        }
    }

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
        getAllCourseSectionDetails();
        getAllCourse();
        getAllSection();
    }, []);

    // useEffect(() => {
    //     setFormData((prev) => ({
    //         ...prev,
    //         createBy: session?.user?.id,
    //         updateBy: session?.user?.id,
    //     }));
    // }, [session]);

    const resetForm = () => {
        setFormData({
            courseSectionId: '',
            courseId: '',
            sectionId: '',
            createBy: '',
            updateBy: '',
        });
        setIsUpdateing(false);
        setCurrentCourseSectionId(null);
        setAvailableSections([]);
    };


    console.log('formData: ', formData)



    const [courseSectionBindings, setCourseSectionBindings] = useState([]);
    const [availableSections, setAvailableSections] = useState([]);

    console.log('availableSections: ', availableSections)


    useEffect(() => {
        if (formData.courseId) {
            const boundSectionIds = courseSectionBindings
                .filter(binding => binding.courseId === formData.courseId)
                .map(binding => binding.sectionId);

            const unboundSections = sections.filter(
                section => !boundSectionIds.includes(section.sectionId)
            );

            setAvailableSections(unboundSections);
        } else {
            setAvailableSections(sections); // show all if no course selected
        }
    }, [formData.courseId, courseSectionBindings, sections]);





    return (
        <div className='university-list'>
            <h1>Course Section Details</h1>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h4>Course Section Details</h4>
                            <div>
                                <button className='btn btn-sm pluto-blue-btn' data-bs-toggle="modal" data-bs-target="#exampleModal">
                                    Create +
                                </button>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th className='text-center'>SL</th>
                                        <th className='text-center'>Course Section ID</th>
                                        <th className='text-center'>Course ID</th>
                                        <th className='text-center'>Section ID</th>
                                        <th className='text-center'>Course Name</th>
                                        <th className='text-center'>Course Number</th>
                                        <th className='text-center'>College</th>
                                        <th className='text-center'>Year Of Course</th>
                                        <th className='text-center'>Section Number</th>
                                        <th className='text-center'>Section Name</th>
                                        <th className='text-center'>Start Time</th>
                                        <th className='text-center'>End Time</th>
                                        <th className='text-center'>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        allCourseSectionDetails?.length > 0 ? (
                                            allCourseSectionDetails.map((item, index) => {
                                                const {
                                                    courseSectionId,
                                                    courseId,
                                                    sectionId,
                                                    courseName,
                                                    courseNumber,
                                                    college,
                                                    yearOfCourse,
                                                    sectionNumber,
                                                    sectionName,
                                                    sectionStartTime,
                                                    sectionEndTime
                                                } = item;

                                                return (
                                                    <tr key={courseSectionId}>
                                                        <td className='text-center'>{index + 1}</td>
                                                        <td className='text-center'>{courseSectionId}</td>
                                                        <td className='text-center'>{courseId}</td>
                                                        <td className='text-center'>{sectionId}</td>
                                                        <td className='text-center'>{courseName}</td>
                                                        <td className='text-center'>{courseNumber}</td>
                                                        <td className='text-center'>{college}</td>
                                                        <td className='text-center'>{yearOfCourse}</td>
                                                        <td className='text-center'>{sectionNumber}</td>
                                                        <td className='text-center'>{sectionName}</td>
                                                        <td className='text-center'>{sectionStartTime}</td>
                                                        <td className='text-center'>{sectionEndTime}</td>
                                                        <td className='text-center'>
                                                            <div className="btn-wrapper d-grid gap-2 d-md-block">
                                                                <button
                                                                    className='btn btn-sm pluto-yellow-btn me-md-2'
                                                                    data-bs-toggle="modal"
                                                                    data-bs-target="#exampleModal"
                                                                    onClick={() => getCourseSectionBindingById(courseSectionId)}
                                                                >
                                                                    Update
                                                                </button>
                                                                <button
                                                                    className='btn btn-sm pluto-pink-btn'
                                                                    onClick={() => handleDelete(courseSectionId)} // FIX: use courseSectionId
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td className='text-center' colSpan="13">No data available</td>
                                            </tr>
                                        )
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
                                            <label for="course-id" class="form-label" >Course Section ID</label>
                                            <input type="text" class="form-control" id="course-id" aria-describedby="emailHelp" onChange={handleChange} value={formData.courseSectionId} name={'courseSectionId'} />
                                        </div> */}
                                        <div class="mb-3">
                                            <label htmlFor="course-name" class="form-label">Course</label>
                                            <select class="form-select" onChange={handleChange} value={formData.courseId} name="courseId">
                                                <option value="">Select Course</option>
                                                {
                                                    course?.map((item) => (
                                                        <option key={item.courseId} value={item.courseId}>{item.courseName}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>

                                        <div class="mb-3">
                                            <label htmlFor="course-number" class="form-label">Section</label>
                                            <select class="form-select" onChange={handleChange} value={formData.sectionId} name="sectionId">
                                                <option value="">Select Section</option>
                                                {
                                                    availableSections?.map((item) => (
                                                        <option key={item.sectionId} value={item.sectionId}>{item.sectionName} - {item.sectionNumber}  ({new Date(item.sectionStartTime).toLocaleString('en-GB', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            hour12: true
                                                        })} - {" "}
                                                            {new Date(item.sectionEndTime).toLocaleString('en-GB', {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                                hour12: true
                                                            })})</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                        {/* <div class="mb-3">
                                            <label for="college" class="form-label" >college</label>
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
                                        </div> */}
                                        <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">{isUpdateing ? "Update" : "Create"}</button>
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
