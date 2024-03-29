import React from 'react'
import { applicationIcon, inboxIcon, logo2, logoutIcon, resumeIcon } from "../../assets";
import { Link, NavLink, useNavigate } from "react-router-dom";
import SignOut from './signOut';

export const UserSideBar = ({ selectedIndex = 0 }) => {

    const tabs = [
        { name: "My Resume", image: resumeIcon, link: "/dashboard/jobs" },
        { name: "My Applications", image: applicationIcon, link: "/dashboard/applications" },
        // {name: "Inbox", image: inboxIcon, link: "/dashboard/inbox"}
    ];

    return (
        <div className='dashboard_side_bar'>
            <div className="dashboard_side_bar_up">
                <img src={logo2} alt='' />
                <div className='dashboard_side_tabs'>
                    {tabs.map(({ image, name, link }, i) => (
                        <NavLink
                            to={link}
                            className={({ isActive }) => isActive ? "dashboard_side_link dashboard_side_link_active " : "dashboard_side_link"}
                            key={i}>
                            <img src={image} alt="" className='' />
                            <span>{name}</span>
                        </NavLink>
                    ))}
                </div>
            </div>
            <SignOut />
        </div>
    )
}