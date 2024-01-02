import React, { useEffect, useState } from 'react'
import "../../styles/dashboard.css";
import { SideBar } from "./EmployerSideBar";
import { useParams } from "react-router-dom";
import { Header } from "./Header";
import { Inbox } from "./Inbox";
import { Jobs } from "./Jobs";
import { EmployeeApplication } from './EmployeeApplications';
import { EmployerApplications } from './EmployerApplications';
import { UserSideBar } from './EmployeeSidebar'
import { MyResume } from './MyResume'

export default function Dashboard() {

    const [isEmployee, setIsEmployee] = useState(sessionStorage.getItem("isEmployee"));

    const { tab = "jobs" } = useParams();

    useEffect(() => {
        const check = sessionStorage.getItem("isEmployee")
        if (check === "true")
            setIsEmployee(true);
        else
            setIsEmployee(false);
    }, [])

    return (<div className='dashboard'>
        {isEmployee ? <UserSideBar /> : <SideBar />}
        <Header />
        <div className="dashboard_content">
            {(() => {
                switch (tab) {
                    case "jobs":
                        return isEmployee ? <MyResume /> : <Jobs />
                    case "applications":
                        return isEmployee ? <EmployeeApplication /> : <EmployerApplications />
                    // case "inbox":
                    //     return isEmployee ? <Inbox /> : <Inbox />
                    default:
                        return <Jobs />
                }
            })()}
        </div>
    </div>)
}