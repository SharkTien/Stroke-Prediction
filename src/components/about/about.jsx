import React from 'react';
import "./about.css";
import Tran from "../../assets/Tran.jpg";
import unknown from "../../assets/unknown.png";
import Tien from "../../assets/Tien.jpg";
const About = () => {
    const teamMembers = [
        {
            name: "Trịnh Trân Trân",
            role: "23521624",
            email: "23521624@gm.uit.edu.vn",
            image: Tran
        },
        {
            name: "Ngô Minh Trí",
            role: "23521640",
            email: "23521640@gm.uit.edu.vn",
            image: unknown
        },
        {
            name: "Nguyễn Minh Triết",
            role: "23521652",
            email: "23521652@gm.uit.edu.vn",
            image: unknown
        },
        {
            name: "Huỳnh Việt Tiến",
            role: "23521570",
            email: "23521570@gm.uit.edu.vn",
            image: Tien
        }
    ];

    return (
        <section className="about section" id="about">
            <h2 className="section__title">Mem nhiệt huyết của Nhóm 10</h2>
            <span className="section__subtitle">Giới thiệu</span>

            <div className="about__container container">
                <div className="team__grid">
                    {teamMembers.map((member, index) => (
                        <div className="team__card" key={index}>
                            <div className="team__image-wrapper">
                                <img src={member.image} alt={member.name} className="team__image" />
                            </div>
                            <div className="team__info">
                                <h3 className="team__name">{member.name}</h3>
                                <p className="team__role">{member.role}</p>
                                <a href={`mailto:${member.email}`} className="team__email">{member.email}</a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default About;