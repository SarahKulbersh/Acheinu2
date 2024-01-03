import React, { useContext } from 'react'
import { applyFormCardNumberContext } from '../../Context';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { collection, setDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { database } from "../../firebaseConfig";
import Cookies from 'js-cookie';

function SubmitApplyForm() {

    const jobToApplyId = sessionStorage.getItem("jobId")
    const userId = sessionStorage.getItem("userId");
    const { applyFormCardNumber, setApplyFormCardNumber } = useContext(applyFormCardNumberContext)
    const navigate = useNavigate()


    function submitApply() {
        let education;
    
        const educationCookie = Cookies.get("education");
        if (educationCookie) {
          education = JSON.parse(educationCookie);
        } else {
          education = [];
        }
        let jobs;
    
        const jobsCookie = Cookies.get("workHistory");
        if (jobsCookie) {
          jobs = JSON.parse(jobsCookie);
        } else {
          jobs = [];
        }
    
        // const education = JSON.parse(Cookies.get("education"))
        // const jobs = JSON.parse(Cookies.get("workHistory"))
        console.log("jobs", jobs)
    
    
        JSON.parse(Cookies.get('skills'))?.map(s => (
          submitSkills(s)
        ))
        education?.map(e => (
          submitEducation(e)
        ))
        jobs?.map(job => (
          submitWorkHistory(job)
        ))
        submitUserDetails()
        updateApplyJobs()
        // updateIdentitiesUserApplies()
        addToApplicationsCollection()
        emailEmployer()
        Cookies.remove("workHistory")
        Cookies.remove("education")
        setApplyFormCardNumber(1)
        navigate(-1)
      }
      async function submitEducation(e) {
        const persons = collection(database, "person");
        const userRef = doc(persons, userId);
        const DocId = `${e.timeOfStudyFromYear}-${e.timeOfStudyToYear}`
        const subcollectionRef = collection(userRef, "educations");
    
        try {
          await setDoc(doc(subcollectionRef, DocId), {
            educationLevel: e.educationLevel,
            schoolName: e.schoolName,
            studyName: e.studyName,
            timeOfStudyFromMonth: e.timeOfStudyFromMonth,
            timeOfStudyFromYear: e.timeOfStudyFromYear,
            timeOfStudyToMonth: e.timeOfStudyToMonth,
            timeOfStudyToYear: e.timeOfStudyToYear
          });
        } catch (error) {
          console.error("Error adding document:", error);
        }
      }
      async function submitWorkHistory(job) {
    
        const persons = collection(database, "person");
        const userRef = doc(persons, userId);
        const docId = `${job.timeOfWorkFromYear}-${job.timeOfWorkToYear}`
        const subcollectionRef = collection(userRef, "workHistory");
        try {
          await setDoc(doc(subcollectionRef, docId), {
            company: job.company,
            description: job.description,
            title: job.title,
            timeOfWorkFromMonth: job.timeOfWorkFromMonth,
            timeOfWorkFromYear: job.timeOfWorkFromYear,
            timeOfWorkToMonth: job.timeOfWorkToMonth,
            timeOfWorkToYear: job.timeOfWorkToYear
          });
        } catch (error) {
          console.error("Error adding document:", error);
        }
      }
      async function submitUserDetails() {
    
        const userRef = doc(database, "person", userId)
        const additionalData = {
          city: Cookies.get('city'),
          firstName: Cookies.get('firstName'),
          lastName: Cookies.get('lastName'),
          isActive: true,
          phoneNumber: Cookies.get('phone'),
          updatedAt: serverTimestamp()
        }
        try {
          await updateDoc(userRef, additionalData);
        } catch (error) {
          console.error("Error submitUserDetails:", error);
        }
      }
      async function addToApplicationsCollection() {
        const employeeId = extractEmailFromDateString(sessionStorage.getItem("jobId"));
        const postDate = extractDateTime(sessionStorage.getItem("jobId"))
        const userId = sessionStorage.getItem("userId");
        const applicationDocId = employeeId + "_#_" + postDate + "_#_" + userId;
    
        try {
          await setDoc(doc(database, "jobApplications", applicationDocId), {
            createdAt: serverTimestamp(),
            firstName: Cookies.get('firstName'),
            lastName: Cookies.get('lastName'),
            jobTitle: sessionStorage.getItem("jobTitle"),
          });
        } catch (error) {
          console.error("Error submitUserDetails:", error);
        }
      }
      async function submitSkills(s) {
    
        const persons = collection(database, "person");
        const userRef = doc(persons, userId);
        const words = s.split(" ");
        const firstWord = words[0];
        const subcollectionRef = collection(userRef, "skills");
        try {
          await setDoc(doc(subcollectionRef, firstWord), {
            createdAt: serverTimestamp(),
            skillName: s
          });
    
        } catch (error) {
          console.error("Error adding document:", error);
        }
      }
      function extractDateTime(str) {
        const string = str + ''
        const dateTime = string.split("_");
        const timeAndDate = dateTime.slice(0, 6).join("_");
        return timeAndDate;
      }
      function extractEmailFromDateString(dateString) {
        const str = dateString + ''
        const substrings = str.split('_');
    
        const email = substrings[substrings.length - 1];
        return email;
      }
      async function updateApplyJobs() {
    
        const persons = collection(database, "person");
        const userRef = doc(persons, userId);
    
        const subcollectionRef = collection(userRef, "applyJobs");
        try {
          await setDoc(doc(subcollectionRef, getCurrentDateTimeString()), {
            applyId: getCurrentDateTimeString(),
            postJobId: jobToApplyId,
            updatedAt: serverTimestamp(),
          });
        } catch (error) {
          console.error("Error adding document:", error);
        }
      }
      const getCurrentDateTimeString = () => {
        const currentDate = new Date();
    
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
        const day = currentDate.getDate().toString().padStart(2, "0");
        const hours = currentDate.getHours().toString().padStart(2, "0");
        const minutes = currentDate.getMinutes().toString().padStart(2, "0");
        const seconds = currentDate.getSeconds().toString().padStart(2, "0");
    
        return `${hours}_${minutes}_${seconds}_${year}_${month}_${day}`;
      }
    
      const emailEmployer = async () => {
    
        const userId = sessionStorage.getItem("userId")
        const jobId = sessionStorage.getItem("jobId")
        const employerId = extractEmailFromDateString(jobId)
        const date = getCurrentDateTimeString()
        // Get user's details from cookies
        const firstName = Cookies.get("firstName");
        const lastName = Cookies.get("lastName");
        const phone = Cookies.get("phone");
        const city = Cookies.get("city");
    
        // Get user's education from cookies
        const education = Cookies.get("education") ? JSON.parse(Cookies.get("education")) : undefined;
    
        // Get user's skills from state
        const skills = JSON.parse(Cookies.get('skills'))

    
        const workHistory = Cookies.get("workHistory") ? JSON.parse(Cookies.get("workHistory")) : undefined;
    
        try {
          await setDoc(doc(database, "mail", `${userId}_#_${date}_#_${employerId}`), {
            to: [employerId],
            message: {
              subject: `${firstName} ${lastName} might be a good fit for ${sessionStorage.getItem("jobTitle")} `,
              text: 'This is the plaintext section of the email body.',
              html: `
              <div style="font-family: Raleway, sans-serif; font-size: 14px; padding: 30px; border: #2557A7 solid 4px; border-radius:4px; width: fit-content; ">
              <h1 style="font-size: 24px; margin-bottom: 10px; color: #2557A7">${firstName} ${lastName}</h1>
            
              <p style="font-size: 18px; margin-top: 20px;">Contact</p>
              <p style="margin: 0;">Email: ${userId}</p>
              <p style="margin: 0;">Phone: ${phone}</p>
            
              <p style="font-size: 18px; margin-top: 20px;">Work History</p>
              <ul style="list-style: none; padding: 0;">
                ${workHistory?.map((job) => `
                  <li style="margin-bottom: 10px;">
                    <strong>${job.title} at ${job.company}</strong><br/> ${job.timeOfWorkFromYear} - ${job.timeOfWorkToYear}
                    <p style="font-style: italic;">${job.description}</p>
                    </li>
                `).join("")}
              </ul>
              
              <p style="font-size: 18px; margin-top: 20px;">Education</p>
              <ul style="list-style: none; padding: 0;">
                ${education?.map((e) => `
                  <li style="margin-bottom: 10px;">
                    <strong>${e.educationLevel} in ${e.studyName}</strong> <br/>
                     ${e.schoolName} <br/> ${e.timeOfStudyFromYear} - ${e.timeOfStudyToYear}
                  </li>
                `).join("")}
              </ul>
              <h2 style="font-size: 18px; margin-top: 20px;">Skills</h2>
              <p style="margin-top: 10px;">${skills}</p>
            </div>
            `
              ,
            }
          });
        } catch (error) {
          console.error("Error submitUserDetails:", error);
        }
      }
    
  return (
    <Button className='job_form_submit skill_btn' onClick={submitApply}>Submit</Button>
    )
}

export default SubmitApplyForm
