"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { fetchAllTable } from '@/app/api/crud';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import HomeLayout from '@/layouts/homeLayout/HomeLayout';
import { useSession } from 'next-auth/react';

export default function StepTwo({ updateAllTableDetails, setCurrentStep }) {
    const router = useRouter();
    const { data: session } = useSession();

    const [tableImage, setTableImage] = useState(null);
    const [preview, setPreview] = useState(null); // For image preview
    const [allTable, setAllTable] = useState([]);
    const [latestAddedTable, setLatestAddedTable] = useState(null); // Latest added table
    const [isLoading, setIsLoading] = useState(true); // loading state

    const getLastAddedElement = (arr) => {
        return arr.length > 0 ? arr[arr.length - 1] : null;
    };

    const getAllTable = async () => {
        try {
            const data = await fetchAllTable(session?.user?.token);
            setAllTable(data);
            const lastAdded = getLastAddedElement(data);
            console.log("Fetched tables:", data);
            console.log("Last added table:", lastAdded);
            setLatestAddedTable(lastAdded);
        } catch (error) {
            console.error("Error fetching tables:", error);
        } finally {
            setIsLoading(false);
        }
    };

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
            toast.error('Please select an image first');
            return;
        }

        if (!latestAddedTable?.roomId) {
            toast.error("Room ID not available. Please wait for the tables to load.");
            return;
        }

        const formData = new FormData();
        formData.append('file', tableImage);

        try {
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/Table/UpdateTablePicture/${latestAddedTable.roomId}`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );

            toast.success('Image uploaded successfully!');
            setPreview(null); // Clear preview after successful upload
            setCurrentStep(1);
            updateAllTableDetails();
        } catch (error) {
            console.error('Error updating table picture:', error);
            toast.error('Error uploading image: ' + (error.response?.data?.title || error.message));
        }
    };

    useEffect(() => {
        if (session?.user?.token) {
            getAllTable();
        }
    }, [session]);

    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview); // Clean up URL on unmount
            }
        };
    }, [preview]);

    return (
        <>
            <h1 className='text-center mb-4'>Upload Table Picture</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <input
                        className='form-control'
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                        disabled={isLoading}
                    />
                </div>

                <button
                    type="submit"
                    className='btn pluto-pink-btn me-2'
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    disabled={isLoading || !latestAddedTable}
                >
                    {isLoading ? 'Loading...' : 'Upload'}
                </button>

                <button
                    className='btn pluto-blue-btn'
                    onClick={() => {
                        updateAllTableDetails();
                        setCurrentStep(1);
                    }}
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    type="button"
                >
                    Skip
                </button>

                {preview && (
                    <div className='mt-3'>
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
