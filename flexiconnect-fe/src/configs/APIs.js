import axios from "axios";
import cookie from 'react-cookies'

const BASE_URL = 'http://localhost:8080/api';

export const endpoints = {
    'register': '/auth/register/candidate',
    'register-employer': '/auth/register/employer',
    'login': '/auth/login',
    'current-user': '/auth/current-user',
    'profile': "/users/candidate/profile",
    'update-profile': "/users/candidate/profile",
    'education': "/users/candidate/education",
    'education-id': (id) => `/users/candidate/education/${id}`,

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