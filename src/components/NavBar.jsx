import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { logoIcon, navClose, navIcon } from "../assets/index";
import "../styles/navbar.css";
import Cookies from 'js-cookie';

export default function NavBar() {

    // for max-width: 768px navbar
    const [isNav, setNav] = useState(false);
    const [userId, setUserId] = useState(() => {
        const storedUserId = sessionStorage.getItem('userId');
        return storedUserId || null;
    });

    const location = useLocation();
    const navigate = useNavigate()

    const handleSignOut = (e) => {
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

    const handleSignIn = (e) => {
        sessionStorage.setItem("locationBeforeSignIn", location.pathname)
        navigate('/signin')
    };

    return (
        <div className='navigation_bar' style={{
            height: (isNav && (window.innerWidth < 758)) ? "100%" : "80px",
            backgroundColor: !isNav ? "white" : "rgba(0, 0, 0, 0.452)"
        }}>
            <div className='nav_bar'>
                <Link to="/"><img src={logoIcon} alt="" /></Link>
                <Link to="/" className='nav_about'>About Us</Link>
                <Link to="/">Contact Us </Link>
            </div>
            <div className='job_nav_left'>
                {/* <div className='flag'>
                    <img src={flagIcon} />
                    <select>
                        <option>English</option>
                    </select>
                </div> */}
                <Link to='/post'>{sessionStorage.getItem("isEmployee") !== "true" && <button className='signin submit_job_btn'>Submit job</button>}</Link>
                {!userId && <button className='signin' onClick={handleSignIn}>Sign In</button>}
                {userId &&
                    <div class="btn-group">
                        <button type="button" class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                            Hello {userId}
                        </button>
                        <ul className="dropdown-menu">
                            <li><Link to="/dashboard/jobs" className="dropdown-item">My Dashboard</Link></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li><button className="dropdown-item" style={{ color: "red" }} onClick={handleSignOut}>Log Out</button></li>
                        </ul>
                    </div>
                }
            </div>

            {/* Navbar for max-width: 768px: */}
            <div className='mob_nav'>
                <Link to="/" className='mob_nav_logo'>
                    <img src={logoIcon} alt="" />
                </Link>
                <img src={!isNav ? navIcon : navClose} alt="" className='nav_icon' onClick={() => setNav(c => !c)} />
                {isNav && <> <div className='mob_nav_left'>
                    <Link to='/post'><button className='signin submit_job_btn'>Submit job</button></Link>
                    {!userId &&  <button className='signin' onClick={handleSignIn}>Sign In</button> }
                    {userId &&
                        <div class="btn-group">
                            <button type="button" class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"> Hello {userId} </button>
                            <ul class="dropdown-menu">
                                <li><Link to="/dashboard/jobs" class="dropdown-item">My Dashboard</Link></li>
                                <li><hr class="dropdown-divider" /></li>
                                <li><button class="dropdown-item" href="#" style={{ color: "red" }} onClick={handleSignOut}>Log Out</button></li>
                            </ul>
                        </div>
                    }
                </div>
                    <div className='mob_nav_bar'>
                        <Link to="/" className='nav_about'>About Us</Link>
                        <Link to="/">Contact Us </Link>
                    </div>
                </>
                }
            </div>

        </div>
    )
}