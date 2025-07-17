import { routes } from "@/utils/route";
import { toast } from "react-toastify";
import { getCookie } from "cookies-next"; // Import cookies-next to retrieve the token

const { default: axios } = require("axios");

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Axios instance with Bearer token
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add Bearer token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = getCookie('token'); // Get the token from cookies
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach token to headers
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//==================== CRUD FOR UNIVERSITY ====================

// ✅ Fetch all universities
export const fetchUniversity = async (token) => {
  try {
    const response = await apiClient.get(routes.GetAllUniversity, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ✅ Fetch university by ID
export const fetchUniversityById = async (id, token) => {
  try {
    const response = await apiClient.get(`${routes.GetUniversityById}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ✅ Create a new university
export const createUniversity = async (data, token) => {
  try {
    const response = await apiClient.post(routes.CreateUniversity, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    toast.success('University created successfully!');
    return response.data;
  } catch (error) {
    toast.error('Error creating the university.');
    throw error;
  }
};

// ✅ Update university by ID
export const updateUniversity = async (id, itemData, token) => {
  try {
    const response = await apiClient.put(`${routes.UpdateUniversity}/${id}`, itemData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    toast.success('University updated successfully!');
    return response.data;
  } catch (error) {
    toast.error('Error updating the university.');
    throw error;
  }
};

// ✅ Delete university by ID
export const deleteUniversity = async (id, token) => {
  try {
    await apiClient.delete(`${routes.DeleteUniversity}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    toast.success('University deleted successfully!');
  } catch (error) {
    toast.error('Error deleting the university.');
    throw error;
  }
};

//==================== CRUD FOR SECTIONS ====================
// ✅ Fetch all sections
export const fetchSection = async (token) => {
  try {
    const response = await apiClient.get(routes.GetAllSection, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ✅ Fetch section by ID
export const fetchSectionById = async (id, token) => {
  try {
    const response = await apiClient.get(`${routes.GetSectionById}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ✅ Create a new section
export const createSection = async (data, token) => {
  try {
    const response = await apiClient.post(routes.CreateSection, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    toast.success('Section created successfully!');
    return response.data;
  } catch (error) {
    toast.error('Error creating the section.');
    throw error;
  }
};

// ✅ Update section by ID
export const updateSection = async (id, itemData, token) => {
  try {
    const response = await apiClient.put(`${routes.UpdateSection}/${id}`, itemData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    toast.success('Section updated successfully!');
    return response.data;
  } catch (error) {
    toast.error('Error updating the section.');
    throw error;
  }
};

// ✅ Delete section by ID
export const deleteSection = async (id, token) => {
  try {
    await apiClient.delete(`${routes.DeleteSection}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    toast.success('Section deleted successfully!');
  } catch (error) {
    toast.error('Error deleting the section.');
    throw error;
  }
};

//==================== CRUD FOR COURSE ====================

// ✅ Fetch all courses
export const fetchCourse = async (token) => {
  try {
    const response = await apiClient.get(routes.GetAllCourse, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ✅ Fetch course by ID
export const fetchCourseById = async (id, token) => {
  try {
    const response = await apiClient.get(`${routes.GetCourseById}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ✅ Create a course
export const createCourse = async (data, token) => {
  try {
    const response = await apiClient.post(routes.CreateCourse, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    toast.success('Course created successfully!');
    return response.data;
  } catch (error) {
    console.error('Error creating Course:', error);
    toast.error('Error creating Course');
    throw error;
  }
};

// ✅ Update a course
export const updateCourse = async (id, data, token) => {
  try {
    const response = await apiClient.put(`${routes.UpdateCourse}/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    toast.success('Course updated successfully!');
    return response.data;
  } catch (error) {
    toast.error('Error updating the course.');
    throw error;
  }
};

// ✅ Delete a course
export const deleteCourse = async (id, token) => {
  try {
    await apiClient.delete(`${routes.DeleteCourse}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    toast.success('Course deleted successfully!');
  } catch (error) {
    toast.error('Error deleting the course.');
    throw error;
  }
};

// //==================== CRUD FOR COURSE SECTION MAPPING ====================
// export const fetchGetAllCourseSectionMapping = async () => {
//   try {
//     const response = await apiClient.get(routes.GetAllCourseSectionMapping);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const createCourseSectionMapping = async (data) => {
//   try {
//     const response = await apiClient.post(routes.saveCourseSectionMapping, data);
//     toast.success('Section created successfully!');
//     return response.data;
//   } catch (error) {
//     toast.error('Error creating the section.');
//     throw error;
//   }
// };

// export const updateCourseSectionData = async (id, data) => {
//   try {
//     const response = await apiClient.put(`${routes.updateCourseSectionData}/${id}`, data);
//     toast.success('Section updated successfully!');
//     return response.data;
//   } catch (error) {
//     toast.error('Error updating the section.');
//     throw error;
//   }
// };

//==================== CRUD FOR COURSE SECTION DETAILS ====================

// ✅ Fetch all course section details
export const fetchAllCourseSectionDetails = async (token) => {
  try {
    const response = await apiClient.get(routes.GetAllCourseSectionDetails, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ✅ Fetch course section details by ID
export const fetchCourseSectionDetailsById = async (id, token) => {
  try {
    const response = await apiClient.get(`${routes.GetCourseSectionDetailsById}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ✅ Create course section binding
export const createCourseSectionBinding = async (data, token) => {
  try {
    const response = await apiClient.post(routes.saveCourseSectionBinding, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    toast.success('Successfully bound Course Section');
    return response.data;
  } catch (error) {
    toast.error('Error binding the course section.');
    throw error;
  }
};

// ✅ Update course section binding
export const updateCourseSection = async (id, data, token) => {
  try {
    const response = await apiClient.put(`${routes.updateCourseSectionBinding}/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    toast.success('Successfully updated Course Section Binding');
    return response.data;
  } catch (error) {
    toast.error('Error updating Course Section Binding');
    throw error;
  }
};



//==================== CRUD FOR STUDENT COURSE SECTION DETAILS ====================

// ✅ Fetch all student course section details
export const fetchAllStudentCourseSectionDetails = async (token) => {
  try {
    const response = await apiClient.get(routes.GetAllStudentCourseSectionDetails, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ✅ Fetch student course section details by ID
export const fetchStudentCourseSectionDetailsById = async (id, token) => {
  try {
    const response = await apiClient.get(`${routes.GetStudentCourseSectionBindingDetailsById}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ✅ Create student course section binding
export const createStudentCourseSectionBinding = async (data, token) => {
  try {
    const response = await apiClient.post(routes.SaveStudentCourseSectionBinding, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    toast.success('Student Course Section Binding successful');
    return response.data;
  } catch (error) {
    toast.error('Error creating Student Course Section Binding.');
    console.log(error);
    throw error;
  }
};


//==================== CRUD FOR INSTRUCTOR COURSE BINDING ====================
// ✅ Fetch all student course section details
export const fetchAllCourseInstructors = async (token) => {
  try {
    const response = await apiClient.get(routes.GetAllCourseInstructors, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ✅ Create student course section binding
export const createCourseInstructor = async (data, token) => {
  try {
    const response = await apiClient.post(routes.SaveCourseInstructor, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    toast.success('Course Instructor Binding successful');
    return response.data;
  } catch (error) {
    toast.error('Error creating Course Instructor Binding.');
    console.log(error);
    throw error;
  }
};

// ✅ Fetch all student course section details
export const fetchAllCourseInstructorSection = async (token) => {
  try {
    const response = await apiClient.get(routes.GetAllCourseInstructorSection, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ✅ Fetch all student course section details
export const fetchCourseInstructorSectionByInstructorId = async (id, token) => {
  try {
    const response = await apiClient.get(routes.GetCourseInstructorSectionByInstructorId + '?id=' + id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};




//==================== CRUD FOR USER REGISTRATION ====================

export const createUser = async (data) => {
  try {
    const response = await apiClient.post(routes.CreateUser, data);
    const { success, message } = response.data;

    if (success === true) {
      toast.success(message || 'Successfully Registered');
    }
    if (success === false) {
      toast.error(message || 'Registration failed');
    }

    return response.data;
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message || 'User Registration Failed';
    toast.error(errorMessage);
    throw error;
  }
};


export const updateUserRegistrationData = async (id, data) => {
  try {
    const response = await apiClient.put(routes.UpdateRegistrationUserRegistrationData + '/' + id, data);
    toast.success('Successfully Updated User Data');
    return response.data;
  } catch (error) {
    toast.error('Error Updating User Data.');
    throw error;
  }
}

//==================== CRUD FOR USER PROFILE SETUP ====================

// ✅ Fetch user profile by ID
export const fetchUserProfileById = async (id, token) => {
  try {
    const response = await apiClient.get(`${routes.GetUserProfileById}${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ✅ Save user profile
export const saveUserProfile = async (data, token) => {
  try {
    const response = await apiClient.post(routes.SaveUserProfile, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    toast.success('Profile saved successfully');
    return response.data;
  } catch (error) {
    toast.error('Error saving the profile.');
    console.log(error);
    throw error;
  }
};

// ✅ Upload user image
export const UserImageUpload = async (userID, imageFile, token) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const response = await apiClient.put(`${routes.UpdateProfilePicture}${userID}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    toast.success('Profile image uploaded successfully');
    return response.data;
  } catch (error) {
    toast.error('Error uploading profile image.');
    throw error;
  }
};

//==================== CRUD FOR USER SETUP ====================

export const fetchAllUserSetupByUserId = async (id, token) => {
  try {
    const response = await apiClient.get(`${routes.GetAllUserSetupByUserId}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add token in header
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


//==================== CRUD FOR TABLE ====================


// ✅ Fetch all tables
export const fetchAllTable = async (token) => {
  try {
    const response = await apiClient.get(routes.GetAllTable, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

// ✅ Fetch table by ID
export const fetchTableById = async (id, token) => {
  try {
    const response = await apiClient.get(`${routes.GetTableByRoomId}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

// ✅ Fetch all table details
export const fetchAllTableDetails = async (token) => {
  try {
    const response = await apiClient.get(routes.GetAllTableDetails, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

// ✅ Create table
export const createTable = async (data, token) => {
  try {
    const response = await apiClient.post(routes.SaveTableInformation, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    toast.success('Table created successfully');
    return response.data;
  } catch (error) {
    toast.error('Error creating table.');
    console.log('Error creating table.', error);
    throw error;
  }
};

// ✅ Update table
export const updateTable = async (id, data, token) => {
  try {
    const response = await apiClient.put(`${routes.UpdateTableInformation}/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    toast.success('Table updated successfully');
    return response.data;
  } catch (error) {
    toast.error('Error updating table.');
    console.log(error);
    throw error;
  }
};

// ✅ Fetch table details by user ID
export const fetchTableDesilsByUserId = async (id, token) => {
  try {
    const response = await apiClient.get(`${routes.GetTableDetailByUserId}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const fetchAllmessagesByGroupId = async (groupId, token) => {
  try {
    const response = await apiClient.get(`${routes.GetAllMessagesByGroupId}${groupId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


export const fetchAllmessagesByGroupIdForChatWithAi = async (groupId, token) => {
  try {
    const response = await apiClient.get(`${routes.GetAllMessagesByGroupIdForAiChat}${groupId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// ✅ Fetch all tables with members
export const fetchAllTableWithMembers = async (token) => {
  try {
    const response = await apiClient.get(routes.GetAllTableWithMembers, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

// ✅ Fetch recent table members by user ID
export const fetchRecentTableMembersByUserId = async (id, token) => {
  try {
    const response = await apiClient.get(`${routes.GetRecentTableMembersByUserId}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};


//==================== TABLE ACTIVE STATUS ====================
// ✅ Update Table Last Active Time Status (PUT)
export const updateTableLastTime = async (id, token) => {
  try {
    const response = await apiClient.put(
      `${routes.UpdateTableLastActiveTimeStatus}/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // toast.success('Table Time Updated successfully');
    return response;
  } catch (error) {
    // toast.error('Error updating table time status.');
    console.log(error);
    throw error;
  }
};

// ✅ Update Table Member Last Active Status (PUT)
export const updateTableMemberLastActiveStatus = async (memberId, roomId, token) => {
  try {
    const response = await apiClient.put(
      `${routes.UpdateTableMemberLastActiveStatus}/${memberId}/${roomId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // toast.success('Table Member Last Active Status Updated successfully');
    return response;
  } catch (error) {
    // toast.error('Error updating table member last active status.');
    console.log(error);
    throw error;
  }
};

//==================== CRUD FOR TABLE MEMBER ====================
// ✅ Fetch Table Members Details by Room ID (GET)
export const FetchTableMembersDetailsById = async (id, token) => {
  try {
    const response = await apiClient.get(`${routes.GetTableMembersDetailsByRoomId}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

// ✅ Add Table Member (POST)
export const addTableMember = async (data, token) => {
  try {
    const response = await apiClient.post(routes.AddTableMember, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

// ✅ Remove Table Member (DELETE)
export const removeTableMember = async (memberId, roomId, token) => {
  try {
    await apiClient.delete(`${routes.RemoveTableMember}/${memberId}/${roomId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    toast.success('Successfully left the table!');
  } catch (error) {
    toast.error('Error leaving the table');
    throw error;
  }
};

//==================== CRUD FOR FRIEND ====================


// ✅ Add Friend (POST)
export const addFriend = async (data, token) => {
  try {
    const response = await apiClient.post(routes.AddFriend, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    toast.success(`Successfully friend request sent`);
    return response?.data;
  } catch (error) {
    toast.error(`Error sending friend request`);
    throw error;
  }
};

// ✅ Get Pending Friend List by Main ID (GET)
export const pendingFriendListByMainId = async (id, token) => {
  try {
    const response = await apiClient.get(`${routes.GetPendingFriendListByMainId}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

// ✅ Suggested Person List by Main ID (GET)
export const suggestedPersonListByMainId = async (id, token) => {
  try {
    const response = await apiClient.get(`${routes.GetSuggestPersonListByMainId}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

// ✅ Update Friend Request (PUT)
export const updateFriendRequest = async (mainPersonId, friendId, status, token) => {
  try {
    const response = await apiClient.put(
      `${routes.UpdateFriendRequest}/${mainPersonId}/${friendId}/${status}`,
      {}, // optional empty body
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    toast.success(`You have ${status} ${friendId}'s friend request`);
    return response;
  } catch (error) {
    toast.error('Error updating friend request');
    console.log(error);
    throw error;
  }
};

// ✅ Accepted Friend List by Main ID (GET)
export const acceptedFriendListByMainId = async (id, token) => {
  try {
    const response = await apiClient.get(`${routes.GetAcceptedFriendListByMainId}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

// ✅ Accepted Friend List by Course ID and Main Person ID (GET)
export const GetAcceptedFriendListByCourseIdMainPersonId = async (mainPersonId, courseId, token) => {
  try {
    const response = await apiClient.get(
      `${routes.GetAcceptedFriendListByCourseIdMainPersonId}/${mainPersonId}/${courseId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
};


//==================== NOTIFICATION ====================
export const fetchNotifications = async (id, token) => {
  try {
    const response = await apiClient.get(`${routes.Notification}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add token in the request header
      },
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};


//==================== CRUD FOR MESSAGE ====================
// ✅ Send Message (POST)
export const postMessage = async (data, token) => {
  try {
    const response = await apiClient.post(routes.SendMessageNormal, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response?.data == 1) {
      // toast.success("Message sent successfully");
    }

    return response?.data;
  } catch (error) {
    toast.error("Message send failed");
    throw error;
  }
};

export const postMessageForGroup = async (data, token) => {
  try {
    const response = await apiClient.post(routes.SendMessageForGroup, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response?.data == 1) {
      // toast.success("Message sent successfully");
    }

    return response?.data;
  } catch (error) {
    toast.error("Message send failed");
    throw error;
  }
};


export const postMessageForGroupAI = async (data, token) => {
  try {
    const response = await apiClient.post(routes.SendMessageForGroupAI, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response?.data == 1) {
      // toast.success("Message sent successfully");
    }

    return response?.data;
  } catch (error) {
    toast.error("Message send failed");
    throw error;
  }
};

// ✅ Get All Messages by Main Person ID (GET)
export const fetchAllMessageByMainPersonId = async (id, token) => {
  try {
    const response = await apiClient.get(`${routes.GetUserMessageByMainPersonId}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response?.data;
  } catch (error) {
    throw error;
  }
};

// ✅ Get Messages by Sender & Receiver ID (GET)
export const fetchAllMessageBySenderIdReceiverId = async (senderId, receiverId, token) => {
  try {
    const response = await apiClient.get(
      `${routes.GetUserMessageBySenderIdReceiverId}/${senderId}/${receiverId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response?.data;
  } catch (error) {
    throw error;
  }
};

//==================== CRUD FOR FILE UPLOAD ====================

export const fileUploadByUser = async (data, token) => {
  try {
    // Create FormData to send file and additional data
    const formData = new FormData();

    // Append the file with fieldname 'file'
    formData.append('file', data.file);



    const response = await apiClient.put(
      routes.fileUpload + '/' + data.roomName + '/' + data.userName + '/' + "math",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // Important for file upload
        },
      }
    );
    toast.success('File uploaded successfully!');
    return response?.data;
  } catch (error) {
    toast.success('File uploaded successfully!');
    throw error;
  }
};

export const fetchTableMemberFilesByUserId = async (id, token) => {
  try {
    const response = await apiClient.get(routes.GetTableMemberFilesByUserId + '/' + id, {
      headers: {
        Authorization: `Bearer ${token}`, // Use the token from the session
      },
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
}


//==================== FORGOT PASSWORD ====================
export const forgotPassword = async (data) => {
  try {
    const response = await apiClient.put(`${routes.UpdateForgetUserPassword}/${data?.userId}/${data?.oldPassword}/${data?.newPassword}`);
    return response?.data;
  } catch (error) {
    throw error;
  }
};
