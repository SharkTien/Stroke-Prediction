import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import "./header.css";
import logo from "../../assets/logo.png";

const Header = () => {
    const location = useLocation();
    const [toggle, setToggle] = useState(false);
    const [activeNav, setActiveNav] = useState(location.pathname);
    const [scrollHeader, setScrollHeader] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrollHeader(window.scrollY >= 80);
        };
        
        window.addEventListener("scroll", handleScroll);
        
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        setActiveNav(location.pathname);
    }, [location]);

    const handleNavLinkClick = (path) => {
        setActiveNav(path);
        setToggle(false);
    };

    return (
        <header className={scrollHeader ? "header scroll-header" : "header"}>
            <div className="header__bg"></div>
            
            <nav className="nav container">
                <Link to="/" className="nav__logo">
                    <img src={logo} alt="logo" />
                    <span className="nav__logo-text">CS114<span className="highlight">.P23</span></span>
                </Link>
                
                <div className={toggle ? "nav__menu show-menu" : "nav__menu"}>
                    <div className="nav__menu-bg"></div>
                    
                    <ul className="nav__list">
                        <li className="nav__item">
                            <Link 
                                to="/" 
                                onClick={() => handleNavLinkClick('/')} 
                                className={activeNav === "/" ? "nav__link active-link" : "nav__link"}
                            >
                                <i className="uil uil-estate nav__icon"></i>
                                <span>Trang chủ</span>
                            </Link>
                        </li>
                        <li className="nav__item">
                            <Link 
                                to="/assessment" 
                                onClick={() => handleNavLinkClick('/assessment')} 
                                className={activeNav === "/assessment" ? "nav__link active-link" : "nav__link"}
                            >
                                <i className="uil uil-brain nav__icon"></i>
                                <span>Đánh giá</span>
                            </Link>
                        </li>
                        <li className="nav__item">
                            <Link 
                                to="/about" 
                                onClick={() => handleNavLinkClick('/about')} 
                                className={activeNav === "/about" ? "nav__link active-link" : "nav__link"}
                            >
                                <i className="uil uil-users-alt nav__icon"></i>
                                <span>Về chúng tôi</span>
                            </Link>
                        </li>
                    </ul>

                    <i className="uil uil-times nav__close" onClick={() => setToggle(false)}></i>
                </div>

                <div className="nav__toggle" onClick={() => setToggle(!toggle)}>
                    <i className="uil uil-apps"></i>
                </div>
                
                <div className="header__shapes">
                    <div className="header__shape shape1"></div>
                    <div className="header__shape shape2"></div>
                </div>
            </nav>
        </header>
    );
};

export default Header;