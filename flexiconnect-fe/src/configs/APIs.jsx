import axios from "axios";
import cookie from 'react-cookies'

const BASE_URL = 'http://localhost:8080/api';

export const endpoints = {
  /* Public*/
  'register': '/auth/register/candidate',
  'register-employer': '/auth/register/employer',
  'login': '/auth/login',
  'current-user': '/auth/current-user',
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
  'follow-employer': "/users/candidate/follow-employer/follow",
  'unfollow-employer': "/users/candidate/follow-employer/unfollow",
  'notify-employer': "/users/candidate/follow-employer/notify",
  'save-job': "/users/candidate/save-job",
  'un-save-job': "/users/candidate/un-save-job",
  

  /* Employer */
  'employer-profile': "/users/employer/profile",
  'employer-avatar': "/users/employer/profile/avatar",
  'jobposts': "/users/employer/job-posts",
  'jobpost': "/users/employer/job-post",
  'employer-jobpost-id': (id) => `/users/employer/job-post/${id}`,
  'employer-applications': "/users/employer/applications",
  "employer-send-email": "/users/employer/email/send",
  "employer-email-logs": (appId) => `/users/employer/email/logs?applicationId=${appId}`,

  "notifications": "users/notifications",
  "notification-mark-read": (id) => `users/notifications/${id}/read`,
  "notification-delete-user": (id) => `users/notifications/${id}/user`,
  "notification-delete": (id) => `users/notifications/${id}`,

}

export const publicApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const authApis = () => {
  const token = cookie.load('token');
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` })
    }
  });
};


export default axios.create({
  baseURL: BASE_URL
});