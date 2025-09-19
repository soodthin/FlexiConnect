import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const endpoints = {
  /* Public*/
  'register': '/auth/register/candidate',
  'register-employer': '/auth/register/employer',
  'login': '/auth/login',
  'current-user': '/auth/current-user',
  'job-posts': '/job-posts',
  'jobpost-id': (id) => `/job-posts/${id}`,

  /*Admnin*/
  'admin-dashboard': '/users/admin/dashboard/stats',
  "admin-employers": "/users/admin/employers",
  "admin-employer-verify": (id) => `/users/admin/employers/${id}/verify`,
  "admin-employer-reject": (id) => `/users/admin/employers/${id}/reject`,
  'admin-users-management': "/users/admin/users",
  'admin-jobposts': "/users/admin/jobposts",

  /* Candidate */
  'candidate-profile': "/users/candidate/profile",
  'update-profile': "/users/candidate/profile",
  'candidate-avatar': "/users/candidate/profile/avatar",
  'education': "/candidate/education",
  'education-id': (id) => `/candidate/education/${id}`,
  'skills': "/candidate/skills",
  'workexperience': "/candidate/workexperience",
  'apply-job': "/users/candidate/apply",
  "cv-suggestion": "/users/candidate/cv-suggestion",
  'candidate-applied': "/users/candidate/applied",
  "withdraw-application": (applicationId) => `users/candidate/applications/${applicationId}/withdraw`,
  'follow-employer': "/users/candidate/follow-employer/follow",
  'unfollow-employer': "/users/candidate/follow-employer/unfollow",
  'notify-employer': "/users/candidate/follow-employer/notify",
  'saved-job': "/users/candidate/saved-jobs/toggle",
  'saved-jobs-count': "/users/candidate/saved-jobs/count",
  "saved-jobs-list": "/users/candidate/saved-jobs/list",
  "unsaved-job": "/users/candidate/saved-jobs/unsave",
  'saved-job-check': `/users/candidate/saved-jobs/check`,

  /*Mock Interview*/
  "create-session": "interview/sessions",
  "current-question": (id) => `interview/sessions/${id}/current-question`,
  "submit-answer": (id) => `interview/sessions/${id}/answers`,
  "complete-session": (id) => `interview/sessions/${id}/complete`,
  'current-package': "/users/candidate/current-package",

  /* Employer */
  'employer-profile': "/users/employer/profile",
  'employer-avatar': "/users/employer/profile/avatar",
  'employer-jobposts': "/users/employer/job-posts",
  'employer-jobpost': "/users/employer/job-post",
  'employer-jobpost-id': (id) => `/users/employer/job-post/${id}`,
  'employer-applications': "/users/employer/applications",
  "employer-send-email": "/users/employer/email/send",
  "employer-email-logs": (appId) => `/users/employer/email/logs?applicationId=${appId}`,

  "notifications": "users/notifications",
  'momo': "/momo",

}

export const publicApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const authApis = () => {
  const savedUser = localStorage.getItem("user");
  const token = savedUser ? JSON.parse(savedUser).token : null;
  
  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return axios.create({
    baseURL: BASE_URL,
    headers: headers,
  });
};



export default axios.create({
  baseURL: BASE_URL
});