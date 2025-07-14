"use client";
import { useSession } from "next-auth/react";
import { createUniversity, deleteUniversity, fetchUniversity, fetchUniversityById, updateUniversity } from "../../../../api/crud";
import React, { useEffect, useState } from "react";

export default function Page() {
  const { data: session } = useSession();
  const [isUpdateing, setIsUpdateing] = useState(false);
  const [universities, setUniversities] = useState([]);
  const [currentUniversityId, setCurrentUniversityId] = useState(null);

  const [formData, setFormData] = useState({
    universityName: "",
    location: "",
    yearEstablished: "",
    emailDomain: "",
    universityType: "",
    contactInfo: "",
    websiteUrl: "",
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
      await createUniversity(formData, session?.user?.token);
      resetForm();
      getAllUniversities();
    } catch (error) {
      console.error("Error creating university:", error);
    }
  };

  const handleDelete = async (id) => {
    await deleteUniversity(id, session?.user?.token);
    getAllUniversities();
  };

  const handleUpdate = async () => {
    try {
      await updateUniversity(currentUniversityId, formData, session?.user?.token); // Pass the selected university's ID
      resetForm();
      getAllUniversities();
    } catch (error) {
      console.error("Error updating university:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      universityName: "",
      location: "",
      yearEstablished: "",
      emailDomain: "",
      universityType: "",
      contactInfo: "",
      websiteUrl: "",
    });
    setIsUpdateing(false);
    setCurrentUniversityId(null);
  };

  const getAllUniversities = async () => {
    try {
      const data = await fetchUniversity(session?.user?.token);
      setUniversities(data);
    } catch (error) {
      console.error("Error fetching universities:", error);
    }
  };

  const getUniversityById = async (id) => {
    try {
      setIsUpdateing(true);
      setCurrentUniversityId(id);
      const data = await fetchUniversityById(id, session?.user?.token);
      setFormData({
        universityId: id,
        universityName: data?.universityName,
        location: data?.location,
        yearEstablished: data?.yearEstablished,
        emailDomain: data?.emailDomain,
        universityType: data?.universityType,
        contactInfo: data?.contactInfo,
        websiteUrl: data?.websiteUrl,
      });
    } catch (error) {
      console.error("Error fetching university by ID:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isUpdateing) {
      await handleUpdate();
    } else {
      await handleCreate();
    }

    // Close the modal after submission
    // const modalElement = document.getElementById('exampleModal');
    // const modalInstance = bootstrap.Modal.getInstance(modalElement); // Get the modal instance
    // modalInstance.hide(); // Hide the modal
  };

  useEffect(() => {
    getAllUniversities();
  }, []);

  return (
    <div className="university-list">
      <h1>University</h1>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4>University</h4>
              <button
                className="btn btn-sm pluto-blue-btn"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                onClick={() => resetForm()}
              >
                Create +
              </button>
            </div>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th className="text-center">SL</th>
                    <th className="text-center">Name</th>
                    <th className="text-center">Id</th>
                    <th className="text-center">Location</th>
                    <th className="text-center">Year Established</th>
                    <th className="text-center">Email</th>
                    <th className="text-center">University Type</th>
                    <th className="text-center">Contact</th>
                    <th className="text-center">Website</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {universities?.map((item, index) => (
                    <tr key={item.id}>
                      <td className="text-center">{index + 1}</td>
                      <td className="text-center">{item.universityName}</td>
                      <td className="text-center">{item.universityId}</td>
                      <td className="text-center">{item.location}</td>
                      <td className="text-center">{item.yearEstablished}</td>
                      <td className="text-center">{item.emailDomain}</td>
                      <td className="text-center">{item.universityType}</td>
                      <td className="text-center">{item.contactInfo}</td>
                      <td className="text-center">{item.websiteUrl}</td>
                      <td className="text-center">
                        <div className="btn-wrapper d-grid gap-2 d-md-block">
                          <button
                            className="btn btn-sm pluto-yellow-btn me-md-2"
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal"
                            onClick={() => getUniversityById(item.universityId)}
                          >
                            Update
                          </button>
                          <button
                            className="btn btn-sm pluto-pink-btn"
                            onClick={() => handleDelete(item.universityId)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bootstrap Modal */}
          <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">
                    {isUpdateing ? "Update University" : "Create University"}
                  </h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    {
                      isUpdateing && <div className="mb-3">
                        <label htmlFor="university-name" className="form-label">University ID</label>
                        <input type="text" className="form-control" id="university-name" name="universityName" value={formData.universityId} required readOnly />
                      </div>
                    }

                    <div className="mb-3">
                      <label htmlFor="university-name" className="form-label">University Name</label>
                      <input type="text" className="form-control" id="university-name" name="universityName" onChange={handleChange} value={formData.universityName} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="university-location" className="form-label">University Location</label>
                      <input type="text" className="form-control" id="university-location" name="location" onChange={handleChange} value={formData.location} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="university-established" className="form-label">Year Established</label>
                      <input type="text" className="form-control" id="university-established" name="yearEstablished" onChange={handleChange} value={formData.yearEstablished} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="university-email" className="form-label">Email Domain</label>
                      <input type="email" className="form-control" id="university-email" name="emailDomain" onChange={handleChange} value={formData.emailDomain} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="university-type" className="form-label">University Type</label>
                      <input type="text" className="form-control" id="university-type" name="universityType" onChange={handleChange} value={formData.universityType} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="university-contact" className="form-label">Contact Info</label>
                      <input type="text" className="form-control" id="university-contact" name="contactInfo" onChange={handleChange} value={formData.contactInfo} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="university-website" className="form-label">Website URL</label>
                      <input type="text" className="form-control" id="university-website" name="websiteUrl" onChange={handleChange} value={formData.websiteUrl} required />
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
  );
}
