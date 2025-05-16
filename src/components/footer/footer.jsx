import React from "react";
import "./footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="footer" id="footer">
            <div className="footer__bg"></div>
            
            <div className="footer__container container">
                <div className="footer__content">
                    <div className="footer__info">
                        <h2 className="footer__title"><span className="footer__title-highlight">CS114</span>.P23</h2>
                        <p className="footer__description">
                            Đồ án cuối kỳ - Ứng dụng Machine Learning <br/>
                            trong dự đoán nguy cơ đột quỵ.
                        </p>
                    </div>
                    
                    <div className="footer__links">
                        <div className="footer__link-group">
                            <h3 className="footer__link-title">Chức năng</h3>
                            <ul className="footer__link-list">
                                <li><Link to="/" className="footer__link">Trang chủ</Link></li>
                                <li><Link to="/assessment" className="footer__link">Đánh giá</Link></li>
                                <li><Link to="/about" className="footer__link">Thành viên</Link></li>
                            </ul>
                        </div>
                        
                        <div className="footer__link-group">
                            <h3 className="footer__link-title">Thông tin</h3>
                            <ul className="footer__link-list">
                                <li><a href="https://uit.edu.vn" target="_blank" className="footer__link">UIT</a></li>
                                <li><a href="https://courses.uit.edu.vn" target="_blank" className="footer__link">Khoa học máy tính</a></li>
                            </ul>
                        </div>
                        
                        <div className="footer__link-group">
                            <h3 className="footer__link-title">Liên hệ</h3>
                            <ul className="footer__link-list footer__contact">
                                <li>
                                    <i className="uil uil-envelope-alt footer__icon"></i>
                                    23521570@gm.uit.edu.vn
                                </li>
                                <li>
                                    <i className="uil uil-map-marker footer__icon"></i>
                                    ĐHCNTT - ĐHQG TPHCM
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div className="footer__bottom">
                    <span className="footer__copy">
                        &#169; Nhóm 10 - CS114.P23. All rights reserved
                    </span>
                    
                    <div className="footer__social">
                        <a href="https://github.com" target="_blank" className="footer__social-link">
                            <i className="uil uil-github"></i>
                        </a>
                        <a href="https://facebook.com" target="_blank" className="footer__social-link">
                            <i className="uil uil-facebook"></i>
                        </a>
                        <a href="https://uit.edu.vn" target="_blank" className="footer__social-link">
                            <i className="uil uil-graduation-cap"></i>
                        </a>
                    </div>
                </div>
            </div>
            
            <div className="footer__shapes">
                <div className="footer__shape shape1"></div>
                <div className="footer__shape shape2"></div>
            </div>
        </footer>
    );
};

export default Footer;