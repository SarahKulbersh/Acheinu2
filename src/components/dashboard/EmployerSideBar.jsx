import {applicationIcon, inboxIcon, logo2, logoutIcon, myjobsIcon} from "../../assets";
import {Link, NavLink, useNavigate} from "react-router-dom";
import Cookies from 'js-cookie';
import React, { useState } from 'react'


export const SideBar = ({selectedIndex = 0}) => {
    const tabs = [
        {name: "My Jobs", image: myjobsIcon, link: "/dashboard/jobs"},
        {name: "Applications", image: applicationIcon, link: "/dashboard/applications"},
        // {name: "Inbox", image: inboxIcon, link: "/dashboard/inbox"}
    ];
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
        navigate('/', { replace: true }); // Redirect to login page (and the browser's history stack is completely replaced with the new one. )
    };


    return (
        <div className='dashboard_side_bar'>
            <div className="dashboard_side_bar_up">
                <img src={logo2} alt=''/>
                <div className='dashboard_side_tabs'>
                    {tabs.map(({image, name, link}, i) => (
                        <NavLink
                            to={link}
                            className={ ({isActive}) => isActive ? "dashboard_side_link dashboard_side_link_active " : "dashboard_side_link"}
                            key={i}>
                        <img src={image} alt="" className=''/>
                        <span>{name}</span>
                        </NavLink>
                        ))}
                </div>
            </div>
            <div className="dashboard_side_link dashboard_side_logout" onClick={() => {handleSignOut()}}>
                <img src={logoutIcon} alt=""/>
                <span>Logout</span>
            </div>
        </div>
    )
}