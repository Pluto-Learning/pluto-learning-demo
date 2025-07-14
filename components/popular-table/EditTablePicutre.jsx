"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { fetchAllTable, fetchTableById } from '@/app/api/crud';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import HomeLayout from '@/layouts/homeLayout/HomeLayout';

export default function EditTablePicture({ tableData, updateAllTableDetails }) {

    const {
        roomId,
        roomName,
        meetingTime,
        meetingDay,
        privacyStatus,
        tableType,
        shortDescription,
        longDescription,
        roomImg,
        // status,
        courseId,
        courseName,
        courseNumber,
        college,
        yearOfCourse,
        description1,
        description2,
        description3,
        description4
    } = tableData;

    console.log('tableData edit profile picture: ', tableData)


    const router = useRouter();
    const [tableImage, setTableImage] = useState(null);
    const [preview, setPreview] = useState(null); // For image preview
    const [table, setTable] = useState([]);
    const [latestAddedTable, setLatestAddedTable] = useState(null); // Latest added table

    const getTableById = async () => {
        try {
            const data = await fetchTableById(roomId, session?.user?.token);
            setTable(data);

        } catch (error) {
            console.error("Error fetching tables:", error);
        }
    };

    console.log('EditTablePicture: ', table)


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setTableImage(file);
            setPreview(URL.createObjectURL(file)); // Set image preview
        } else {
            console.error("No file selected or the file is invalid");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!tableImage) {
            toast.warning('Please select an image first');
            return;
        }

        const formData = new FormData();
        formData.append('file', tableImage);
        try {
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/Table/UpdateTablePicture/${roomId}`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );
            // Handle success, maybe go to next step or show success message
            toast.success('Image uploaded successfully!');
            setPreview(null); // Clear preview after successful upload
            // router.push('/table-discovery');
            // window.location.reload();
            updateAllTableDetails()
        } catch (error) {
            console.error('Error updating table picture:', error);
            toast.error('Error uploading image: ' + (error.response ? error.response.data.title : error.message));
        }
    };

    useEffect(() => {
        getTableById();
    }, []);

    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview); // Clean up URL on unmount
            }
        };
    }, [preview]);

    return (
        <>
            <h4 className='text-center mb-4'>Upload Table Picture</h4>
            <div className="table-picture">
                <img src={roomImg} alt="" />
            </div>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <input className='form-control' type="file" onChange={handleFileChange} accept="image/*" />
                </div>
                <button type="submit" className='btn pluto-pink-btn' data-bs-dismiss="modal" aria-label="Close">Upload</button>

                {preview && (
                    <div className='mt-3 image-preview'>
                        <h6>Image Preview:</h6>
                        <div className='mx-auto'>
                            <img src={preview} alt="Image Preview" className='img-fluid' />
                        </div>
                    </div>
                )}
            </form>
        </>
    );
}
