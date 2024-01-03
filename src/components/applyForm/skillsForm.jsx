import React, { useState, useEffect } from 'react'
import { addMore, deleteIcon } from "../../assets/index"
import { Card, Form } from 'react-bootstrap';
import Cookies from 'js-cookie';
import SaveAndExit from './saveAndExit';
import SubmitApplyForm from './submitApplyForm';

function SkillsForm() {

  const [skills, setSkills] = useState([])
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (Cookies.get('skills') !== undefined){
      setSkills(JSON.parse(Cookies.get('skills')))
    }
  },[])

  const handleSkillInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const addSkill = () => {
    if (inputValue !== '') {
      setSkills([...skills, inputValue]);
      setInputValue('');
      Cookies.set('skills', JSON.stringify([...skills, inputValue]))
    }
  };
  
  const removeSkill = (index) => {
    setSkills(skills.filter((item, i) => i !== index));
  };


  return (
    <Card>
      <Card.Body className='job_apply_form_body'>
        <SaveAndExit changeTo={5} />

        <Form className='job_form_apply_fields' >
          <div>
            <p className='job_form_upload_desc'>Build your resume (3 of 4)</p>
            <label htmlFor="phone">Do you want to share some of your skills?</label>
          </div>
          <Form.Text>we recommend adding at least 6 skills</Form.Text>
          <div className='job_form_field_box'>
            <input type="text" class="form-control" placeholder='Add a skill' value={inputValue} onChange={handleSkillInputChange} />
            <img src={addMore} alt="" className='add_skill_img' onClick={addSkill} />
          </div>
          {skills?.map((skill, index) => (
            <div className='job_form_field_dlt_box'>
              <input className='job_form_input' type="text" value={skill} />
              <img src={deleteIcon} alt="" onClick={() => { removeSkill(index) }} />
            </div>
          ))}
          <SubmitApplyForm/>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default SkillsForm
