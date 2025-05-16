import React from "react"

const Data = () => {
    return (
        <div className="home__data">
            <div className="home__badge">Đồ án cuối kỳ</div>
            <h1 className="home__title">
                CS114 - Máy học
                <span className="home__title-highlight"> & AI</span>
            </h1>
            
            <div className="home__title-animation">
                <span className="text-rotate">Dự đoán</span>
                <span className="text-rotate">Phân tích</span>
                <span className="text-rotate">Phòng ngừa</span>
            </div>
            
            <h3 className="home__subtitle">
                <span className="gradient-text">Dự đoán đột quỵ</span> với Machine Learninng
            </h3>
            
            <p className="home__description">
                Hệ thống phân tích dữ liệu y tế sử dụng các thuật toán học máy tiên tiến để 
                dự đoán nguy cơ đột quỵ dựa trên các chỉ số sức khỏe, lối sống và tiền sử bệnh của cá nhân.
            </p>
            
            <div className="home__stats">
                <div className="home__stat">
                    <span className="home__stat-number">90%</span>
                    <span className="home__stat-text">Độ chính xác</span>
                </div>
                <div className="home__stat">
                    <span className="home__stat-number">10+</span>
                    <span className="home__stat-text">Chỉ số</span>
                </div>
            </div>
        </div>
    )
}

export default Data