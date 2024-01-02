import React, { useContext } from 'react'
import { applyFormCardNumberContext } from '../../Context'
import EducationForm from './educationForm'
import WorkHistory from './workHistory'
import SkillsForm from './skillsForm'
import UserDetails from './userDetails'
import UploadFileForm from './uploadFileForm'
import ResumeOptionsForm from './resumeOptionsForm'
import "../../styles/jobApplyForm.css"
import NavBar from '../NavBar';
import Footer from '../Footer';
import { Card, Container, Form } from 'react-bootstrap';

export function JobApplyForm() {
    const { applyFormCardNumber, setApplyFormCardNumber} = useContext(applyFormCardNumberContext)

    return (
        <>
        <NavBar />
        <br/><br/><br/>
        <Container className='job_apply_form'>            
            {applyFormCardNumber === 1 && <UserDetails />}
            {applyFormCardNumber === 2 && <ResumeOptionsForm />}
            {applyFormCardNumber === 3 && <UploadFileForm />}
            {applyFormCardNumber === 4 && <EducationForm />}
            {applyFormCardNumber === 5 && <WorkHistory />}
            {applyFormCardNumber === 6 && <SkillsForm />}
        </Container>
        <Footer/>
        </>
    )
}
