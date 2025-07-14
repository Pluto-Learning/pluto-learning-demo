"use client"
import { fetchUserProfileById, saveUserProfile } from '@/app/api/crud';
import HomeLayout from '@/layouts/homeLayout/HomeLayout'
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

export default function page() {
    const router = useRouter()
    const { data: session } = useSession(); // Get session data
    const [singleUserProfile, setSingleUserProfile] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);

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
            toast.warning('Please select an image first');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/UserProfile/UpdateProfilePicture/${session?.user?.id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            getUserData();
            console.log('Image uploaded successfully:', response.data);
            toast.success('Image uploaded successfully!');
            setPreview(null);

            // ✅ Redirect based on user type
            const userType = session?.user?.userType?.toLowerCase();
            if (userType === 'student') {
                router.push('/profile/course-selection');
            } else if (userType === 'instructor') {
                router.push('/table-discovery');
            } else if (userType === 'admin') {
                router.push('/profile/course-selection');
            }

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
                <div className="profile profile-edit pt_50 pb_50">
                    <div className="container">
                        <h1 className='text-center mb-4'>Edit Profile Picture</h1>
                        <div className="card m-auto shadow" style={{ maxWidth: '500px' }}>
                            <div className="card-body p-4">
                                <div
                                    className="profile-image text-end position-relative"
                                >
                                    {/* <button
                                        className="btn btn-success btn-sm"
                                        onClick={() => setShowImageUpload((prev) => !prev)}
                                    >
                                        <i class="fa-regular fa-pen-to-square"></i> Edit Image
                                    </button> */}

                                    <div className="profile-image-wrapper">

                                        <div className="profile-image"
                                        >

                                            <img
                                                src={
                                                    singleUserProfile?.awsFileUrl ?
                                                        singleUserProfile?.awsFileUrl :
                                                        '/assets/images/image-placeholder.jpg'
                                                }
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
                                </div>

                                {/* {
                                    showImageUpload &&
                                    <div className='image-upload'>
                                        <h5>Image Upload</h5>
                                        <form onSubmit={handleImgSubmit}>
                                            <input type="file" accept="image/*" onChange={handleFileChange} className='form-control mb-2' />
                                            <button type="submit" className='btn btn-secondary'>Upload</button>
                                        </form>
                                        {preview && (
                                            <div>
                                                <h3>Image Preview:</h3>
                                                <img src={preview} alt="Image Preview" style={{ width: '200px' }} />
                                            </div>
                                        )}
                                    </div>
                                } */}

                                <div className='image-upload'>
                                    <h6>Image Upload</h6>
                                    <form onSubmit={handleImgSubmit} className=''>
                                        <input type="file" accept="image/*" onChange={handleFileChange} className='form-control mb-2' />
                                        <button type="submit" className='btn upload me-2'>Upload</button>
                                        <button
                                            type="button"
                                            className="btn skip"
                                            onClick={() => {
                                                const userType = session?.user?.userType?.toLowerCase();
                                                if (userType === 'student') {
                                                    router.push('/profile/course-selection');
                                                } else if (userType === 'instructor') {
                                                    router.push('/table-discovery');
                                                } else if (userType === 'admin') {
                                                    router.push('/profile/course-selection');
                                                }
                                            }}
                                        >
                                            Skip
                                        </button>
                                    </form>

                                    {preview && (
                                        <div className='mt-3'>
                                            <h6>Image Preview:</h6>
                                            <div className='mx-auto'>

                                                <img src={preview} alt="Image Preview" className='img-fluid' />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>




                    </div>
                </div>
            </HomeLayout>
        </>
    )
}
