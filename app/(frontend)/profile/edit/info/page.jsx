"use client"
import { fetchAllUserSetupByUserId, fetchUserProfileById, saveUserProfile, updateUserRegistrationData } from '@/app/api/crud';
import HomeLayout from '@/layouts/homeLayout/HomeLayout';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function page() {

    const router = useRouter()
    const { data: session } = useSession(); // Get session data
    const [singleUserProfile, setSingleUserProfile] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);

    const [formData, setFormData] = useState({
        "userID": "",
        "firstName": "",
        "lastName": "",
        "email": "",
        "userType": "",
        "password": "",
        "keepSignedIn": "",
        "college": "",
        
        // "gender": "",
        // "mobile": "",
        // "dateOfBirth": "",
        // "studentYear": "",
        // "status": "active",
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

    const handleUserProfileSave = async () => {
        try {
            await saveUserProfile(formData, session?.user?.token);
            resetForm();
        } catch (error) {
            console.error("Error saving user profile:", error);
        }
    };

    const handleUpdateUserData = async () => {
        try {
            await updateUserRegistrationData(session?.user?.id, formData)
        } catch (error) {
            console.error("Error Updating User Data:", error);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        // handleUserProfileSave();
        // getUserData()
        handleUpdateUserData()
        console.log('User Profile Data: ',formData);
        router.push('/profile')
    };



    const resetForm = () => {
        setFormData({
            userID: session?.user.id || "", // Reset to current user ID if available
            firstName: '',
            lastName: '',
            email: '',
            gender: '',
            userType: '',
            // password: data?.password,
            keepSignedIn: '',
            college: '',
        });
    };

    const getUserData = async () => {
        if (currentUserId) {
            const data = await fetchAllUserSetupByUserId(currentUserId, session?.user?.token);
            setSingleUserProfile(data);
            setFormData((prev) => ({
                ...prev,
                userID: session?.user.id,
                firstName: data?.firstName,
                lastName: data?.lastName,
                email: data?.email,
                userType: data?.userType,
                gender: data?.gender,
                password: data?.password,
                keepSignedIn: data?.keepSignedIn,
                college: data?.college,
            }));
        }
    };

    useEffect(() => {
        getUserData();
    }, [currentUserId]);

    console.log('SingleUserProfile: ', singleUserProfile)

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

    return (
        <>
            <HomeLayout>
                <div className="profile-edit pt_50 pb_50">
                    <div className="container">
                        <h1 className='text-center'>Edit Profile Picture</h1>




                        {/* <div className="card-body text-center">
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
                            <li className="list-group-item">
                                <strong>Date of Birth: </strong> {singleUserProfile?.dateOfBirth}
                            </li>
                            <li className="list-group-item">
                                <strong>Student Year: </strong> {singleUserProfile?.studentYear}
                            </li>
                            <li className="list-group-item">
                                <strong>Status: </strong> {singleUserProfile?.status}
                            </li>
                        </ul> */}

                        <div className="card mx-auto" >
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-lg-6">
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
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="mb-3">
                                                <label htmlFor="mobile" className="form-label">First Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="firstName"
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="mb-3">
                                                <label htmlFor="mobile" className="form-label">Last Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="lastName"
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="mb-3">
                                                <label htmlFor="mobile" className="form-label">Email</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="mb-3">
                                                <label htmlFor="mobile" className="form-label">College</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="college"
                                                    name="college"
                                                    value={formData.college}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        {/* <div className="col-lg-6">
                                            <div className="mb-3">
                                                <label htmlFor="mobile" className="form-label">Password</label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    id="password"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div> */}

                                        {/* <div className="col-lg-6">
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
                                        </div> */}
                                        {/* <div className="col-lg-6">
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
                                        </div> */}
                                        {/* <div className="col-lg-6">
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
                                        </div> */}
                                        {/* <div className="col-lg-6">
                                            <div className="mb-3">
                                                <label htmlFor="studentYear" className="form-label">Student Year</label>
                                                <select
                                                    className="form-select"
                                                    id="studentYear"
                                                    name="studentYear"
                                                    value={formData.studentYear}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Select Student Year</option>
                                                    <option value="freshman">Freshman</option>
                                                    <option value="sophomore">Sophomore</option>
                                                    <option value="junior">Junior</option>
                                                    <option value="senior">Senior</option>
                                                </select>
                                            </div>
                                        </div> */}

                                    </div>








                                    {/* <div className="mb-3">
                                        <label htmlFor="studentYear" className="form-label">Student Year</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="studentYear"
                                            name="studentYear"
                                            value={formData.studentYear}
                                            onChange={handleChange}
                                        />
                                    </div> */}



                                    {/* <div className="mb-3">
                                        <label htmlFor="status" className="form-label">Status</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="status"
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                        />
                                    </div> */}
                                    <div className="btn-wrapper text-center">
                                        <button type="submit" className="btn pluto-deep-blue-btn btn-lg ">Submit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                </div>
            </HomeLayout>
        </>
    )
}
