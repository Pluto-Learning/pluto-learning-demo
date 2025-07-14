export const routes = {
  login: `${process.env.NEXT_PUBLIC_API_URL}/Login`,
  signup: `${process.env.NEXT_PUBLIC_API_URL}/UserSetup`,

  // University Routes
  GetAllUniversity: '/University/GetAllUniversityList',
  GetUniversityById: '/University/GetUniversityBy',
  CreateUniversity: '/University/SaveUniversityData',
  UpdateUniversity: '/University/UpdateUniversityData',
  DeleteUniversity: '/University/DeleteUniversityByUniversityId',

  // Section Routes
  GetAllSection: '/Section/GetAllSections',
  GetSectionById: '/Section/GetAllSectionsById',
  CreateSection: '/Section/SaveSectionData',
  UpdateSection: '/Section/UpdateSectionData',
  DeleteSection: '/Section/DeleteSectionData',

  // Course Routes
  GetAllCourse: '/Course/GetAllCourse',
  GetCourseById: '/Course/GetCourseByCourseId',
  CreateCourse: '/Course/SaveCourse',
  UpdateCourse: '/Course/UpdateCourse',
  DeleteCourse: '/Course/DeleteCourseByCourseId',

  // Course Section Binding Routes
  saveCourseSectionBinding: '/Course/SaveCourseSectionBinding',
  updateCourseSectionBinding: '/Course/UpdateCourseSectionBinding',
  GetAllCourseSectionDetails: '/Course/GetAllCourseSectionBindingDetails',
  GetCourseSectionDetailsById: '/Course/GetCourseSectionBindingDetailsById',

  // Student Course Section Binding Routes
  SaveStudentCourseSectionBinding: '/Course/SaveStudentCourseSectionBinding',
  GetAllStudentCourseSectionDetails: '/Course/GetAllStudentCourseSectionBindingDetails',
  GetStudentCourseSectionBindingDetailsById: '/Course/GetStudentCourseSectionBindingDetailsById',

    // Instructor Course Binding Routes
    SaveCourseInstructor: '/Course/SaveCourseInstructor',
    GetAllCourseInstructors: '/Course/GetAllCourseInstructors',
    GetCourseInstructorByCourseId: '/Course/GetCourseInstructorByCourseId',
    GetCourseInstructorByInstructorId: '/Course/GetCourseInstructorByInstructorId',
    GetAllCourseInstructorSection: '/Course/GetAllCourseInstructorSection',
    GetCourseInstructorSectionByInstructorId: '/Course/GetCourseInstructorSectionByInstructorId',

  // User Registration Routes
  GetAllUser: '/UserSetup/GetAllUserSetup',
  GetAllUserSetupByUserId: '/UserSetup/GetAllUserSetupByUserId',
  CreateUser: '/UserSetup/SaveRegistrationSetup',
  UpdateRegistrationUserRegistrationData: '/UserSetup/UpdateRegistrationUserRegistrationData',
  UpdateForgetUserPassword: '/UserSetup/UpdateForgetUserPassword',

  // User Profile Routes
  GetUserProfileById: '/UserProfile/GetUserProfileById?UserId=',
  SaveUserProfile: '/UserProfile/SaveUserProfile',
  UpdateProfilePicture: '/UserProfile/UpdateProfilePicture',

  // Tables Routes
  GetAllTable: '/Table/GetAllTable',
  GetTableByRoomId: '/Table/GetTableByRoomId',
  SaveTableInformation: '/Table/SaveTableInformation',
  UpdateTableInformation: '/Table/UpdateTableInformation',
  UpdateTablePicture: '/Table/UpdateTablePicture',
  DeleteTableData: '/Table/DeleteTableData',
  GetAllTableDetails: '/Table/GetAllTableDetails',
  GetTableDetailById: '/Table/GetTableDetailById',
  GetTableDetailByUserId: '/Table/GetTableDetailByUserId',
  GetAllTableWithMembers: '/Table/GetAllTableWithMembers',
  GetRecentTableMembersByUserId: '/Table/GetRecentTableMembersByUserId',

  // Table Last Active
  UpdateTableLastActiveTimeStatus: '/Table/UpdateTableLastActiveTimeStatus',
  UpdateTableMemberLastActiveStatus: '/Table/UpdateTableMemberLastActiveStatus',

  // Table Member Routes
  AddTableMember: '/Table/AddTableMember',
  UpdateAddTableMember: '/Table/UpdateTableMember',
  GetTableMembersDetailsByRoomId: '/Table/GetTableMembersDetailsById',
  RemoveTableMember: '/Table/RemoveTableMember',

  // Friends Routes
  AddFriend: '/Friend/AddFriend',
  GetPendingFriendListByMainId: '/Friend/GetPendingFriendListByMainId',
  UpdateFriendRequest: '/Friend/UpdateFriendRequest',
  GetAcceptedFriendListByMainId: '/Friend/GetAcceptedFriendListByMainId',
  GetSuggestPersonListByMainId: '/Friend/GetSuggestPersonListByMainId',
  GetAcceptedFriendListByCourseIdMainPersonId: 'Friend/GetAcceptedFriendListByCourseIdMainPersonId',

  // Notifications Routes
  Notification: '/Notification',

  // Message Routes
  SendMessageNormal: '/Messages/SendMessageNormal',
  SendMessageForGroup: '/Messages/SendMessageGroupChat',
  SendMessageForGroupAI: '/Messages/SendMessageAIChat',
  GetUserMessageByMainPersonId: '/Messages/GetUserMessageByMainPersonId',
  GetUserMessageBySenderIdReceiverId: '/Messages/GetUserMessageBySenderIdReceiverId',
  GetAllMessagesByGroupId: '/Messages/GetGroupMessageByGroupId?groupId=',
  GetAllMessagesByGroupIdForAiChat: '/Messages/GetMessagesAIsByTableId?tableId=',

  // File Upload Routes
  fileUpload:'/Table/UploadTableFilesBlob',
  GetTableMemberFilesByUserId:'Table/GetTableMemberFilesByUserId'

};
