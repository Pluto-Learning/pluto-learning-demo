"use client"
import { createSection, deleteSection, fetchSection, fetchSectionById, updateSection } from '@/app/api/crud';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'

export default function page() {

  const { data: session } = useSession();
  const [isUpdateing, setIsUpdateing] = useState(false);
  const [currentSectionId, setCurrentSectionId] = useState(null);
  const [sections, setSections] = useState([]);

  const [formData, setFormData] = useState({
    sectionId: '',
    sectionName: '',
    sectionNumber: '',
    sectionStartTime: '',
    sectionEndTime: ''
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
      await createSection(formData, session?.user?.token); // Pass the form data and token
      resetForm();
      getAllSection();
    } catch (error) {
      console.error("Error creating university:", error);
    }

    // console.log(formData)
  };

  const handleDelete = async (id) => {
    await deleteSection(id, session?.user?.token); // Pass the university ID and token
    getAllSection();
    console.log(id)
  }

  const getAllSection = async () => {
    try {
      const data = await fetchSection(session?.user?.token);
      setSections(data);
    } catch (error) {
      console.error('Error fetching universities:', error);
    }
  }

  const getSectionById = async (id) => {
    try {
      setIsUpdateing(true);
      setCurrentSectionId(id);
      const data = await fetchSectionById(id, session?.user?.token);
      console.log(data)
      setFormData({
        sectionId: data?.sectionId,
        sectionName: data?.sectionName,
        sectionNumber: data?.sectionNumber,
        sectionStartTime: data?.sectionStartTime,
        sectionEndTime: data?.sectionEndTime
      });
    } catch (error) {
      console.error("Error fetching university by ID:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateSection(currentSectionId, formData, session?.user?.token);  // Pass the current course ID and form data
      resetForm();   // Reset the form after update
      getAllSection();  // Refresh the course list

      console.log(currentSectionId, formData)
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

    // console.log(formData)

    // Close the modal after submission
    // const modalElement = document.getElementById('exampleModal');
    // const modalInstance = bootstrap.Modal.getInstance(modalElement); // Get the modal instance
    // modalInstance.hide(); // Hide the modal
  };

  const resetForm = () => {
    setFormData({
      sectionId: '',
      sectionName: '',
      sectionNumber: '',
      sectionStartTime: '',
      sectionEndTime: ''
    });
    setIsUpdateing(false);
    setCurrentSectionId(null);
  };

  useEffect(() => {
    getAllSection();
  }, []);

  console.log('sections: ', sections)

  return (
    <div className='university-list'>
      <h1>Section</h1>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4>Section</h4>
              <div>
                <button className='btn btn-sm pluto-blue-btn' data-bs-toggle="modal" data-bs-target="#exampleModal">Create +</button>
              </div>
            </div>
            <div className=" table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th scope="col" className='text-center'>SL</th>
                    <th scope="col" className='text-center'>sectionId</th>
                    <th scope="col" className='text-center'>sectionName</th>
                    <th scope="col" className='text-center'>sectionNumber</th>
                    <th scope="col" className='text-center'>section Start Time</th>
                    <th scope="col" className='text-center'>section End Time</th>
                    <th scope="col" className='text-center'>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    sections && sections?.length > 0 &&
                    sections?.map((item, index) => {
                      const { id, sectionId, sectionName, sectionNumber, sectionStartTime, sectionEndTime } = item;
                      return (
                        <tr>
                          <td scope="row" className='text-center'>{index + 1}</td>
                          <td className='text-center'>{sectionId}</td>
                          <td className='text-center'>{sectionName}</td>
                          <td className='text-center'>{sectionNumber}</td>
                          <td className='text-center'>{sectionStartTime}</td>
                          <td className='text-center'>{sectionEndTime}</td>
                          <td className='text-center'>
                            <div className="btn-wrapper d-grid gap-2 d-md-block">
                              <button className='btn btn-sm pluto-yellow-btn me-md-2' onClick={() => getSectionById(sectionId)} data-bs-toggle="modal" data-bs-target="#exampleModal">Update</button>
                              <button className='btn btn-sm pluto-pink-btn' onClick={() => handleDelete(sectionId)}>Delete</button>
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
                    {isUpdateing ? "Update Section" : "Create Section"}
                  </h1>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <form onSubmit={handleSubmit}>
                    <div class="mb-3">
                      <label for="sectionName" class="form-label" >Section Name</label>
                      <input type="text" class="form-control" id="sectionName" aria-describedby="emailHelp" onChange={handleChange} value={formData.sectionName} name={'sectionName'} />
                    </div>
                    <div class="mb-3">
                      <label for="sectionNumber" class="form-label" >Section Number</label>
                      <input type="text" class="form-control" id="sectionNumber" aria-describedby="emailHelp" onChange={handleChange} value={formData.sectionNumber} name={'sectionNumber'} />
                    </div>
                    <div class="mb-3">
                      <label for="sectionStartTime" class="form-label" >Section Start Time</label>
                      <input type="datetime-local" class="form-control" id="sectionStartTime" aria-describedby="emailHelp" onChange={handleChange} value={formData.sectionStartTime} name={'sectionStartTime'} />
                    </div>
                    <div class="mb-3">
                      <label for="sectionEndTime" class="form-label" >Section End Time</label>
                      <input type="datetime-local" class="form-control" id="sectionEndTime" aria-describedby="emailHelp" onChange={handleChange} value={formData.sectionEndTime} name={'sectionEndTime'} />
                    </div>
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
