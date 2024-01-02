import React from 'react'
import { Route, Routes } from 'react-router-dom';
import "./styles/index.css";
import { PostJobForm } from './components/postJobForm';
import { JobApplyForm } from './components/applyForm/jobApplyForm';
import Home from './components/home/home';
import JobsList from './components/jobList/jobsList';
import { SignIn } from './components/signIn';
import Dashboard from './components/dashboard/dashboard';
import { SignUp } from './components/signUp';

export default function AllRoutes() {
  return (
    <Routes>
      <Route path='/post' element={<PostJobForm />} />
      <Route path='/apply' element={<JobApplyForm />} />
      <Route path='/' element={<Home />} />
      <Route path='jobsList/:searchTerm' element={<JobsList />} />
      <Route path='dashboard/:tab' element={<Dashboard />} />
      <Route path='/signin' element={<SignIn />} />
      <Route path='/signup' element={<SignUp />} />
    </Routes>

  )
}