import React, { useState } from 'react'
import { Card, Button, Form } from 'react-bootstrap';
import { addMore } from "../../../assets/index"
import { collection, setDoc, doc, deleteDoc } from "firebase/firestore";
import { database } from "../../../firebaseConfig";
import '../../../styles/inputError.css'

function UpdateEducation({ setPage }) {

  const storedItem = sessionStorage.getItem('editObject');
  const editedItem = JSON.parse(storedItem);

  const today = new Date();
  const currentYear = today.getFullYear();
  const years = [...Array(31).keys()].map((year) => currentYear - year);
  const [error, setError] = useState(''); // To store error messages

  const [education, setEducation] = useState([
    {
      educationLevel: editedItem?.educationLevel,
      schoolName: editedItem?.schoolName,
      studyName: editedItem?.studyName,
      timeOfStudyFromMonth: editedItem?.timeOfStudyFromMonth,
      timeOfStudyFromYear: editedItem?.timeOfStudyFromYear,
      timeOfStudyToMonth: editedItem?.timeOfStudyToMonth,
      timeOfStudyToYear: editedItem?.timeOfStudyToYear
    }])

  const handleEducationChange = (event, index) => {
    let { name, value } = event.target;
    let onChangeValue = [...education];
    onChangeValue[index][name] = value;
    setEducation(onChangeValue);
  };

  const submitEducation = () => {

    const filteredEducation = education.filter((e) => {
      return (
        e.educationLevel !== '' ||
        e.schoolName !== '' ||
        e.studyName !== '' ||
        e.timeOfStudyFromMonth !== 'Month' ||
        e.timeOfStudyFromYear !== 'Year' ||
        e.timeOfStudyToMonth !== 'Month' ||
        e.timeOfStudyToYear !== 'Year'
      );
    });

    const hasEmptyFields = filteredEducation.some((e) => {
      return (
        e.educationLevel === '' ||
        e.schoolName === '' ||
        e.studyName === '' ||
        e.timeOfStudyFromMonth === 'Month' ||
        e.timeOfStudyFromYear === 'Year' ||
        e.timeOfStudyToMonth === 'Month' ||
        e.timeOfStudyToYear === 'Year'
      );
    });

    const hasInvalidDates = filteredEducation.some((e) => {
      const fromYear = parseInt(e.timeOfStudyFromYear);
      const toYear = parseInt(e.timeOfStudyToYear);

      if (fromYear > toYear) {
        return true;
      }

      if (fromYear === toYear) {
        const fromMonth = parseInt(e.timeOfStudyFromMonth);
        const toMonth = parseInt(e.timeOfStudyToMonth);
        return fromMonth > toMonth;
      }

      return false;
    });

    if (hasEmptyFields) {
      setError("All fields must be filled to submit education")
    } else if (hasInvalidDates) {
      setError("Education dates are invalid")
    } else {
      setError('')
      filteredEducation.map((education) => updateEducation(education));
    }

  }

  async function updateEducation(e) {

    const userId = sessionStorage.getItem("userId")
    const persons = collection(database, "person");
    const userRef = doc(persons, userId);
    const storedItem = sessionStorage.getItem('editObject');
    const editedItem = JSON.parse(storedItem);
    const educationId = `${editedItem?.timeOfStudyFromYear}-${editedItem?.timeOfStudyToYear}`;
    console.log(educationId)
    const docRef = doc(collection(userRef, 'educations'), educationId);
    await deleteDoc(docRef);

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
    setPage(-1)
  }


  const handleDeleteInput = (index) => {
    const newArray = [...education];
    newArray.splice(index, 1);
    setEducation(newArray);
  };

  return (
    <Card>
      <Card.Body className='job_apply_form_body'>
        <Form className='job_form_apply_fields'>
          {education?.map((e, index) => (
            <div key={index}>
              { index >= 1 && <p style={{ color: "red", cursor: "pointer" }} onClick={() => { handleDeleteInput(index) }}>Remove Education</p> }
              <Form.Label className='job_form_field'>Level of education *</Form.Label>
              <Form.Control className='job_form_input' type='text' name='educationLevel' required value={e?.educationLevel} onChange={(e) => handleEducationChange(e, index)} />
              <Form.Label className='job_form_field'>Field of study</Form.Label>
              <Form.Control className='job_form_input' type='text' name='studyName' required value={e?.studyName} onChange={(e) => handleEducationChange(e, index)} />
              <Form.Label className='job_form_field'>Name of school</Form.Label>
              <Form.Control className='job_form_input' type='text' name='schoolName' required value={e?.schoolName} onChange={(e) => handleEducationChange(e, index)} />

              <Form.Text className='job_form_field'>Time period</Form.Text>
              <Form.Group className='job_edu_form_date'>
                <Form.Label>From</Form.Label>
                <div>
                  <Form.Select name='timeOfStudyFromMonth' value={e?.timeOfStudyFromMonth} onChange={(e) => handleEducationChange(e, index)}>
                    <option>Month</option>
                    {[...new Array(12).keys()].map((i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Select name='timeOfStudyFromYear' value={e?.timeOfStudyFromYear} onChange={(e) => handleEducationChange(e, index)}>
                    <option>Year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </Form.Group>
              <Form.Group className='job_edu_form_date'>
                <Form.Label>To</Form.Label>
                <div>
                  <Form.Select name='timeOfStudyToMonth' value={e?.timeOfStudyToMonth} onChange={(e) => handleEducationChange(e, index)}>
                    <option>Month</option>
                    {[...new Array(12).keys()].map((i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Select name='timeOfStudyToYear' value={e?.timeOfStudyToYear} onChange={(e) => handleEducationChange(e, index)}>
                    <option>Year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </Form.Group>
              <br />
            </div>
          ))}
          {error !== '' &&
            <p className='error-message'>{error}</p>
          }
          <Button onClick={(e) => submitEducation()} className='job_form_submit skill_btn'>Save changes</Button>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default UpdateEducation
