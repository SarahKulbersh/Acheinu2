import React, { useContext, useEffect, useState } from 'react'
import { JobContext, EstPreviewContext } from '../../Context';
import { useNavigate, useLocation } from 'react-router-dom';
import "../../styles/recent_jobs.css";
import { Timestamp } from 'firebase/firestore';
import JobDetails from './jobDetails';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import parse from 'html-react-parser';

export default function JobCard({ postingJobsData }) {
  function handleApply() {
    const jobId = job.postingJobId
    const jobTitle = job.jobTitle
    sessionStorage.setItem("jobId", jobId)
    sessionStorage.setItem("jobTitle", jobTitle)
    if (sessionStorage.getItem("userId") === null) {
      sessionStorage.setItem("locationBeforeSignIn", location.pathname)
      setJob('')
      navigate('/signin')
    }
    else {
      setJob('')
      navigate('/apply')
    }
  }

  const handleClose = () => {
    setShowModal(false);
    setJob('')
  }
  const handleShow = () => setShowModal(true);

  const location = useLocation()

  const navigate = useNavigate();

  const { estPreview, setEstPreview } = useContext(EstPreviewContext)
  const userId = sessionStorage.getItem("userId") ?? null;
  const { job, setJob } = useContext(JobContext);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (postingJobsData && postingJobsData.length > 0) {
      setJob(postingJobsData[0]);
    }
  }, []);

  const openJob = (job) => {
    setJob(job);
    if (location.pathname === '/') {
      handleShow()
    }
  };

  // time comes from the database like this "20:00 PM" => "20:00"
  function convertTo24HourFormat(timeString) {
    const [time, modifier] = timeString.split(" ");
    let [hours, minutes] = time.split(":");

    if (hours === "12") {
      hours = "00";
    }

    if (modifier === "PM") {
      hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}`;
  }
  // depending if the user is viewing the jobs in EST or IST
  function convertTime(timeString, isEST) {
    const timeStr = convertTo24HourFormat(timeString)
    const [hours, minutes] = timeStr.split(":");
    const timeObj = new Date();
    timeObj.setHours(hours);
    timeObj.setMinutes("00");
    if (isEST) {
      if (estPreview === true) {
        return timeObj.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true });
      } else {
        timeObj.setHours(timeObj.getHours() + 7);
        return timeObj.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true });
      }
    } else {
      if (estPreview === true) {
        timeObj.setHours(timeObj.getHours() - 7);
        return timeObj.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true });
      } else {
        return timeObj.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true });
      }
    }
  }


  return (
    <>
      {postingJobsData?.map(Job => (
        <div type='button' onClick={() => openJob(Job)} key={Job.postingJobId} className={`recent_job_card ${job?.postingJobId === Job.postingJobId ? 'clicked-card' : ''}`}>
          <div className='recent_job_box_1' key={Job.postingJobId}>

            <h3 >{Job.jobTitle}</h3>
            {/* location causing error */}
            {/* <Card.Text>  {job.jobLocation}</Card.Text> */}
          </div>
          <div className='recent_job_company'>
            <h4>{Job.companyName}</h4>
            <h6>{Job.location}</h6>
          </div>

          <div className='recent_job_box_2'>
            <div className='recent_job_box_btn_1'> {Job.isFullTimeJob ? "Full Time" : "Part Time"}</div>

            <div className='recent_job_box_btn_1'>

              {Job.startedTimeFrom && Job.endedTimeIn ? (
                <>
                  {convertTime(Job.startedTimeFrom, Job.isEST).replace(" ", "")}{" - "}
                  {convertTime(Job.endedTimeIn, Job.isEST).replace(" ", "")}
                  {(Job.isEST && estPreview === null) || estPreview === true ? " EST" : " IST"}
                </>
              ) : null}
            </div>
          </div>

          <div className='recent_job_desc'>
            {Job?.jobDescription
              ?.replace(/<[^>]+>/gm, ' ') // Replace any HTML tag with ''
              ?.split("\n")
              ?.join(" ")
              ?.substring(0, 200) + "..."}
          </div>
          {/* <button className='recent_job_apply' onClick={() => handleApply(job.postingJobId)}>Apply</button> */}
        </div >
      ))
      }
      <Modal
        show={showModal}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        class="modal-dialog modal-dialog-scrollable modal-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>{job.jobTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {job.jobDescription && parse(job.jobDescription)}
          <p> Pay: {job.minPay}-{job.maxPay}{job.payCurrency} {job.jobPaymentPer}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleApply()}>Apply</Button>
        </Modal.Footer>
      </Modal>

    </>
  )
}
