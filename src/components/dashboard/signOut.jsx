import React, { useState } from 'react'
import { logoutIcon } from "../../assets";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

function SignOut() {

    const [userId, setUserId] = useState(() => {
        const storedUserId = sessionStorage.getItem('userId');
        return storedUserId || null;
    });

    const navigate = useNavigate()

    const handleSignOut = () => {
        setUserId(null);
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem("isEmployee")
        sessionStorage.removeItem("cardNumber")
        Cookies.remove('selectedShowPay');
        Cookies.remove('minPay');
        Cookies.remove('maxPay');
        Cookies.remove('selectedRatePer');
        Cookies.remove('location');
        Cookies.remove('jobTitle');
        Cookies.remove('selectedFullPart');
        Cookies.remove('selectedTime');
        Cookies.remove('startTime');
        Cookies.remove('endTime');
        Cookies.remove('description');
        Cookies.remove('skills');
        Cookies.remove('workHistory');
        Cookies.remove('education');
        Cookies.remove('firstName');
        Cookies.remove('lastName');
        Cookies.remove('email');
        Cookies.remove('city');
        Cookies.remove('phone');
        navigate('/', { replace: true }); // Redirect to login page (and the browser's history stack is completely replaced with the new one. )
    };


    return (
        <div className="dashboard_side_link dashboard_side_logout" onClick={() => { handleSignOut() }}>
            <img src={logoutIcon} alt="" />
            <span>Logout</span>
        </div>
    )
}

export default SignOut