import { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { addTableMember, createTable, fetchCourse } from '@/app/api/crud';
import { useSession } from 'next-auth/react';

export default function StepOne({ onNextStep, updateAllTableDetails }) {

  const { data: session } = useSession()
  console.log('session: ', session)

  const [formData, setFormData] = useState({
    roomId: 'string',
    roomName: '',
    courseId: '',
    meetingTime: '',
    meetingDay: '',
    privacyStatus: 'string',
    tableType: '',
    shortDescription: '',
    longDescription: '',
    roomImg: '',
    lastActive: new Date().toISOString(), // Automatically set lastActive to the current date in ISO 8601
    status: 'active',
    visibilityType: ""
  });

  const [courses, setCourses] = useState([]); // For storing courses from the API
  const tableTypes = ['Study Group', 'Organization Event', 'Professor Specific']; // Example table types
  const tableVisibilityTypes = ['public', 'private']; // Example table visibility types

  // Function to format the date to the required format for 'datetime-local'
  const formatDateForInput = (date) => {
    const d = new Date(date);
    const formattedDate = d.toISOString().slice(0, 16); // Slice to get "YYYY-MM-DDTHH:MM"
    return formattedDate;
  };

  // Fetch course options from external API
  useEffect(() => {
    const getAllCourse = async () => {
      try {
        const response = await fetchCourse(session?.user?.token); // Replace with your API endpoint
        setCourses(response);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    getAllCourse();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'meetingTime') {
      // Set meetingDay based on meetingTime and format meetingTime correctly
      const meetingDay = new Date(value).toLocaleDateString('en-US', { weekday: 'long' });
      setFormData({
        ...formData,
        meetingTime: formatDateForInput(value), // Format meetingTime to "YYYY-MM-DDTHH:MM"
        meetingDay,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle Create Table
  const handleCreateTable = async () => {
    try {
      if (!session || !session?.user?.token) {
        toast.error('User not authenticated.');
        return; // Prevent submission if not authenticated
      }

      // Pass the token to createTable
      const responseData = await createTable(formData, session?.user?.token);
      console.log('Response Data:', responseData);

      // Ensure addTableMember is defined and handles the token appropriately
      await addTableMember({
        memberId: session.user.id,
        roomId: responseData?.roomId,
        role: "student",
        // token: session.token // If addTableMember needs the token, pass it
      }, session?.user?.token);

      onNextStep(); // Proceed to step 2 on success
      updateAllTableDetails()
    } catch (error) {
      console.error("Error creating Table:", error);
      // toast.error('Error creating the table.'); // Notify user of the error
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    handleCreateTable();
  };

  return (
    <form onSubmit={handleSubmit} className="">
      <div className="mb-3">
        <label htmlFor="roomName" className="form-label">Table Name</label>
        <input type="text" className="form-control" id="roomName" name="roomName" value={formData.roomName} onChange={handleChange} required />
      </div>

      <div className="mb-3">
        <label htmlFor="courseId" className="form-label">Course</label>
        <select className="form-select" id="courseId" name="courseId" value={formData.courseId} onChange={handleChange} required>
          <option value="" disabled>Select Course</option>
          {courses.map(course => (
            <option key={course.courseId} value={course.courseId}>{course.courseName}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="meetingTime" className="form-label">Meeting Time</label>
        <input
          type="datetime-local"
          className="form-control"
          id="meetingTime"
          name="meetingTime"
          value={formData.meetingTime}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="meetingDay" className="form-label">Meeting Day (Auto-set)</label>
        <input type="text" className="form-control" id="meetingDay" name="meetingDay" value={formData.meetingDay} readOnly disabled />
      </div>

      <div className="mb-3">
        <label htmlFor="tableType" className="form-label">Table Type</label>
        <select className="form-select" id="tableType" name="tableType" value={formData.tableType} onChange={handleChange} required>
          <option value="" disabled>Select Table Type</option>
          {tableTypes.map(type => (
            <option key={type} value={type} className='text-capitalize'>{type}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="tableType" className="form-label">Table Visibility Type</label>
        <select className="form-select" id="visibilityType" name="visibilityType" value={formData.visibilityType} onChange={handleChange} required>
          <option value="" disabled>Select Table Visibility Type</option>
          {tableVisibilityTypes.map(type => (
            <option key={type} value={type} className='text-capitalize'>{type}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="shortDescription" className="form-label">Summary</label>
        <textarea className="form-control" id="shortDescription" name="shortDescription" value={formData.shortDescription} onChange={handleChange} required placeholder="Summary of the table here" />
      </div>

      <div className="mb-3">
        <label htmlFor="longDescription" className="form-label">Description</label>
        <textarea className="form-control" id="longDescription" name="longDescription" value={formData.longDescription} onChange={handleChange} required placeholder="Who's the instructor, class location, etc." />
      </div>

      <button type="submit" className="btn pluto-pink-btn">Submit</button>
    </form>
  );
}