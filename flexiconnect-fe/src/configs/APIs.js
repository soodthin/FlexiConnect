import axios from "axios";
import cookie from 'react-cookies'

const BASE_URL = 'http://localhost:8080/api';

export const endpoints = {
    /* Auth */
    'register': '/auth/register/candidate',
    'register-employer': '/auth/register/employer',
    'login': '/auth/login',
    'current-user': '/auth/current-user',

    /* Candidate */
    'candidate-profile': "/users/candidate/profile",
    'update-profile': "/users/candidate/profile",
    'education': "/candidate/education",
    'education-id': (id) => `/candidate/education/${id}`,
    'skills': "/candidate/skills",
    'workexperience': "/candidate/workexperience",

    /* Employer */
    'employer-profile': "/users/employer/profile",
    'employer-avatar': "/users/employer/profile/avatar",
    'jobposts': "/users/employer/job-posts",
    'jobpost': "/users/employer/job-post",
    'jobpost-id': (id) => `/users/employer/job-post/${id}`,

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
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  });
};


export default axios.create({
    baseURL: BASE_URL
});