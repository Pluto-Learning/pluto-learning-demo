"use client"
import { fetchAllUserSetupByUserId, fetchUserProfileById, saveUserProfile, UserImageUpload } from '@/app/api/crud';
import HomeLayout from '@/layouts/homeLayout/HomeLayout'
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

export default function Page() {
    const { data: session } = useSession(); // Get session data
    const [singleUserProfile, setSingleUserProfile] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [userDataByUserId, setUserDataByUserId] = useState(null)

    const [formData, setFormData] = useState({
        "userID": "",
        "gender": "",
        "mobile": "",
        "dateOfBirth": "",
        "studentYear": "",
        "status": "",
        "profilePictureName": "",
        "awsFileUrl": ""
    });

    useEffect(() => {
        if (session) {
            setCurrentUserId(session.user.id); // Set currentUserId from session
            setFormData((prev) => ({
                ...prev,
                userID: session.user.id, // Set userID in formData
            }));
        }
    }, [session]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Format date when the dateOfBirth field is changed
        if (name === "dateOfBirth") {
            const date = new Date(value);
            const formattedDate = date.toISOString(); // Converts to ISO format
            setFormData((prev) => ({
                ...prev,
                [name]: formattedDate, // Set the formatted date
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleUserProfileSave();
        getUserData()
        console.log(formData);
    };

    const handleUserProfileSave = async () => {
        try {
            await saveUserProfile(formData, session?.user?.token);
            resetForm();
        } catch (error) {
            console.error("Error saving user profile:", error);
        }
    };

    const resetForm = () => {
        setFormData({
            "userID": session?.user.id || "", // Reset to current user ID if available
            "gender": "",
            "mobile": "",
            "dateOfBirth": "",
            "studentYear": "",
            "status": "",
            "profilePictureName": "",
            "awsFileUrl": ""
        });
    };

    const getUserData = async () => {
        if (currentUserId) {
            const data = await fetchUserProfileById(currentUserId, session?.user?.token);
            setSingleUserProfile(data);

            const userData = await fetchAllUserSetupByUserId(currentUserId, session?.user?.token)
            setUserDataByUserId(userData)
        }
    };

    useEffect(() => {
        getUserData();
    }, [currentUserId]);

    console.log('SingleUserProfile: ', singleUserProfile)
    console.log('userDataByUserId: ', userDataByUserId)

    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        } else {
            console.error("No file selected or the file is invalid");
        }
    };

    const handleImgSubmit = async (e) => {
        e.preventDefault();

        if (!selectedFile) {
            alert('Please select an image first');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile); // Change 'image' to 'file' or whatever is expected by the API

        try {
            const response = await axios.put(
                'http://192.168.1.225:3232/api/UserProfile/UpdateProfilePicture/' + session?.user?.id,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            getUserData()
            console.log('Image uploaded successfully:', response.data);
            toast.success('Image uploaded successfully!');
        } catch (error) {
            console.error('Error uploading image:', error.response ? error.response.data : error);
            toast.error('Error uploading image: ' + (error.response ? error.response.data.title : error.message));
        }
    };


    // Clean up URL on unmount
    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    const [showImageUpload, setShowImageUpload] = useState(false)

    function formatReadableDate(isoDateString) {
        const date = new Date(isoDateString);

        const day = String(date.getDate()).padStart(2, '0');
        const month = date.toLocaleString('en-US', { month: 'long' });
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    }

    console.log('formatReadableDate: ', formatReadableDate(singleUserProfile?.dateOfBirth)); // Output: 01-Jan-0001



    return (
        <HomeLayout><>

            <div className="container">
            </div>

            <div className='profile pt_50 pb_50'>
                <div className="container my-5">
                    <div className="row g-4">
                        <div className="col-lg-3">
                            <div className="card shadow h-100">
                                <div className="card-body">
                                    <h2 className='text-center mb-xxl-4'>Profile Picture</h2>

                                    <div className="profile-image-wrapper">

                                        <div className="edit-image-icon">
                                            <Link href={'/profile/edit/picture'}>
                                                <i class="fa-solid fa-camera"></i>
                                            </Link>
                                        </div>
                                        <div className="profile-image"
                                        >

                                            <img
                                                src={singleUserProfile?.awsFileUrl ?? '/assets/images/image-placeholder.jpg'}
                                                className=" img-fluid"
                                                alt="Profile"
                                            // style={{
                                            //     borderRadius: '50%',
                                            //     marginTop: '15px',
                                            //     width: '150px',
                                            //     height: '150px',
                                            //     objectFit: 'cover',
                                            //     display: 'block',
                                            //     marginLeft: 'auto',
                                            //     marginRight: 'auto',
                                            // }}
                                            />
                                        </div>
                                    </div>

                                    <h5 className='text-center text-capitalize mt-2 mb-0 fw-light'>{singleUserProfile?.userID}</h5>
                                    <small className='d-block text-center text-capitalize fw-light'>({userDataByUserId?.userType})</small>

                                </div>
                            </div>
                        </div>
                        <div className="col-lg-9">
                            <div className="card shadow h-100">
                                <div className="card-body">
                                    <div className="title-wrapper position-relative">
                                        <h2 className='text-center mb-xxl-4'>User Info</h2>
                                        <Link href={`profile/edit/info`} className="edit-btn text-end position-absolute z-3 top-50 end-0">
                                            <i class="fa-regular fa-pen-to-square"></i>
                                        </Link>
                                    </div>
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item">
                                            <strong>User ID: </strong> {singleUserProfile?.userID}
                                        </li>
                                        <li className="list-group-item">
                                            <strong>User Type: </strong> {userDataByUserId?.userType}
                                        </li>
                                        <li className="list-group-item">
                                            <strong>Name: </strong> {userDataByUserId?.firstName + " " + userDataByUserId?.lastName}
                                        </li>
                                        <li className="list-group-item">
                                            <strong>Gender: </strong> {singleUserProfile?.gender}
                                        </li>
                                        <li className="list-group-item">
                                            <strong>Mobile: </strong> {singleUserProfile?.mobile}
                                        </li>
                                        <li className="list-group-item">
                                            <strong>Email: </strong> {userDataByUserId?.email}
                                        </li>
                                        <li className="list-group-item d-none">
                                            <strong>Date of Birth: </strong> {formatReadableDate(singleUserProfile?.dateOfBirth)}
                                        </li>
                                        <li className="list-group-item">
                                            <strong>College: </strong> {userDataByUserId?.college}
                                        </li>
                                        <li className="list-group-item">
                                            <strong>Student Year: </strong> {singleUserProfile?.studentYear}
                                        </li>
                                        <li className="list-group-item">
                                            <strong>Status: </strong> {singleUserProfile?.status}
                                        </li>
                                        
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card mx-auto d-none" style={{ width: '24rem' }}>
                        <div className="card-body">
                            <small className='text-muted'><i>Please at first Set info by clicking set info Button then set profile picture</i></small>
                            {/* Profile Picture */}
                            <div
                                className="profile-image text-end position-relative"
                            >
                                <button
                                    className="btn btn-success btn-sm"
                                    onClick={() => setShowImageUpload((prev) => !prev)}
                                >
                                    <i class="fa-regular fa-pen-to-square"></i> Edit Image
                                </button>
                                <div className="image"
                                    style={{
                                        borderRadius: '100%',
                                        // marginTop: '15px',
                                        width: '150px',
                                        height: '150px',
                                        // objectFit: 'cover',
                                        // display: 'block',
                                        marginLeft: 'auto',
                                        marginRight: 'auto',
                                        overflow: 'hidden'
                                    }}
                                >

                                    <img
                                        src={singleUserProfile?.awsFileUrl ?? '/assets/images/image-placeholder.jpg'}
                                        className=" img-fluid"
                                        alt="Profile"
                                    // style={{
                                    //     borderRadius: '50%',
                                    //     marginTop: '15px',
                                    //     width: '150px',
                                    //     height: '150px',
                                    //     objectFit: 'cover',
                                    //     display: 'block',
                                    //     marginLeft: 'auto',
                                    //     marginRight: 'auto',
                                    // }}
                                    />
                                </div>
                            </div>

                            {
                                showImageUpload && <div className='image-upload'>
                                    <h5>Image Uploads</h5>
                                    <form onSubmit={handleImgSubmit}>
                                        <input type="file" accept="image/*" onChange={handleFileChange} className='form-control mb-2' />
                                        <button type="submit" className='btn btn-secondary'>Upload</button>
                                    </form>
                                    {/* {preview && (
                            <div>
                                <h3>Image Preview:</h3>
                                <img src={preview} alt="Image Preview" style={{ width: '200px' }} />
                            </div>
                        )} */}
                                </div>
                            }


                            <div className="card-body text-center">
                                <h4 className="card-title">User Profile</h4>
                            </div>

                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">
                                    <strong>User ID: </strong> {singleUserProfile?.userID}
                                </li>
                                <li className="list-group-item">
                                    <strong>Gender: </strong> {singleUserProfile?.gender}
                                </li>
                                <li className="list-group-item">
                                    <strong>Mobile: </strong> {singleUserProfile?.mobile}
                                </li>
                                <li className="list-group-item ">
                                    <strong>Date of Birth: </strong> {singleUserProfile?.dateOfBirth}
                                </li>
                                <li className="list-group-item">
                                    <strong>Student Year: </strong> {singleUserProfile?.studentYear}
                                </li>
                                <li className="list-group-item">
                                    <strong>Status: </strong> {singleUserProfile?.status}
                                </li>
                            </ul>

                            <div class="d-grid gap-2">
                                <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                    Set Info
                                </button>
                                <a type="button" href="/" class="btn btn-primary">
                                    Back to Home
                                </a>
                            </div>


                        </div>
                    </div>
                </div>

                <div className="container">
                    {/* <h1>User Profile</h1> */}
                    {/* <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="userID" className="form-label">User ID</label>
                        <input
                            type="text"
                            className="form-control"
                            id="userID"
                            name="userID"
                            value={formData.userID}
                            readOnly // Make it read-only since it's set from session
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="gender" className="form-label">Gender</label>
                        <select
                            className="form-select"
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="mobile" className="form-label">Mobile</label>
                        <input
                            type="tel"
                            className="form-control"
                            id="mobile"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
                        <input
                            type="date"
                            className="form-control"
                            id="dateOfBirth"
                            name="dateOfBirth"
                            value={formData.dateOfBirth ? formData.dateOfBirth.split("T")[0] : ""} // Display date correctly
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="studentYear" className="form-label">Student Year</label>
                        <input
                            type="text"
                            className="form-control"
                            id="studentYear"
                            name="studentYear"
                            value={formData.studentYear}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="status" className="form-label">Status</label>
                        <input
                            type="text"
                            className="form-control"
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form> */}
                    {/* <br /><br /> */}

                    {/* <div>
                    <h2>Image Upload</h2>
                    <form onSubmit={handleImgSubmit}>
                        <input type="file" accept="image/*" onChange={handleFileChange} />
                        <button type="submit">Upload</button>
                    </form>
                    {preview && (
                        <div>
                            <h3>Image Preview:</h3>
                            <img src={preview} alt="Image Preview" style={{ width: '200px' }} />
                        </div>
                    )}
                </div> */}


                    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label htmlFor="userID" className="form-label">User ID</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="userID"
                                                name="userID"
                                                value={formData.userID}
                                                readOnly // Make it read-only since it's set from session
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="gender" className="form-label">Gender</label>
                                            <select
                                                className="form-select"
                                                id="gender"
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="mobile" className="form-label">Mobile</label>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                id="mobile"
                                                name="mobile"
                                                value={formData.mobile}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                id="dateOfBirth"
                                                name="dateOfBirth"
                                                value={formData.dateOfBirth ? formData.dateOfBirth.split("T")[0] : ""} // Display date correctly
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="studentYear" className="form-label">Student Year</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="studentYear"
                                                name="studentYear"
                                                value={formData.studentYear}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="status" className="form-label">Status</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="status"
                                                name="status"
                                                value={formData.status}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-primary">Submit</button>
                                    </form>
                                </div>
                                {/* <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary">Save changes</button>
                        </div> */}
                            </div>
                        </div>
                    </div>


                </div>


            </div>
        </>
        </HomeLayout>
    )
}
