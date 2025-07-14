"use client";
import { fetchUserProfileById, saveUserProfile } from '@/app/api/crud';
import HomeLayout from '@/layouts/homeLayout/HomeLayout';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Page() {
    const router = useRouter();
    const { data: session } = useSession();
    const [singleUserProfile, setSingleUserProfile] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);

    const [formData, setFormData] = useState({
        userID: "",
        gender: "not given",
        mobile: "",
        dateOfBirth: "",
        studentYear: "",
        status: "active",
        profilePictureName: "",
        awsFileUrl: ""
    });

    useEffect(() => {
        if (session) {
            setCurrentUserId(session.user.id);
            setFormData((prev) => ({
                ...prev,
                userID: session.user.id,
            }));
        }
    }, [session]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "dateOfBirth") {
            const date = new Date(value);
            const formattedDate = date.toISOString();
            setFormData((prev) => ({
                ...prev,
                [name]: formattedDate,
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
            const updatedFormData = {
                ...formData,
                mobile: formData.mobile?.trim() || "0000",
                dateOfBirth: formData.dateOfBirth || new Date().toISOString(),
            };

            await saveUserProfile(updatedFormData, session?.user?.token);
            toast.success("User profile saved successfully!");
            resetForm();
        } catch (error) {
            console.error("Error saving user profile:", error);
            toast.error("Failed to save user profile");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleUserProfileSave();
        getUserData();
        console.log(formData);
        router.push('/profile/edit/picture');
    };

    const resetForm = () => {
        setFormData({
            userID: session?.user.id || "",
            gender: "",
            mobile: "",
            dateOfBirth: "",
            studentYear: "",
            status: "",
            profilePictureName: "",
            awsFileUrl: ""
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
        formData.append('file', selectedFile);

        try {
            const response = await axios.put(
                `http://192.168.1.225:3232/api/UserProfile/UpdateProfilePicture/${session?.user?.id}`,
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
        } catch (error) {
            console.error('Error uploading image:', error.response ? error.response.data : error);
            toast.error('Error uploading image: ' + (error.response ? error.response.data.title : error.message));
        }
    };

    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    return (
        <HomeLayout>
            <div className="profile-edit pt_50 pb_50">
                <div className="container">
                    <h1 className='text-center'>Edit Profile Info</h1>

                    <div className="card mx-auto" style={{ maxWidth: '500px' }}>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="userID" className="form-label">Username</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="userID"
                                        name="userID"
                                        value={formData.userID}
                                        readOnly
                                        disabled
                                    />
                                </div>
                                <div className="mb-3 d-none">
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
                                        placeholder="Enter mobile or leave blank"
                                    />
                                </div>
                                <div className="mb-3 d-none">
                                    <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="dateOfBirth"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth ? formData.dateOfBirth.split("T")[0] : ""}
                                        onChange={handleChange}
                                    />
                                </div>
                                {
                                    session?.user?.userType === "student" &&
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
                                }
                                <button type="submit" className="btn pluto-deep-blue-btn btn-lg w-100">Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </HomeLayout>
    );
}
