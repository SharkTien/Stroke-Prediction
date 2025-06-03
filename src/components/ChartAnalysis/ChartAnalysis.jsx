import React, { useState } from 'react';
import './ChartAnalysis.css';
import matran from '../../assets/Matran.png';
import age from '../../assets/age.png';
import Phanphoi from '../../assets/Phanphoi.png';
import smote from '../../assets/smote.png';
import others from '../../assets/others.png';

const ChartAnalysis = () => {
  const [selected, setSelected] = useState(null);

  return (
    <div className="chart-analysis-container">
      <div className="report-paper">
        <div className="report-paper-title">BÁO CÁO PHÂN TÍCH DỮ LIỆU VÀ TIỀN XỬ LÝ</div>
        <a
          href="/stroke_risk_dataset_v2.csv"
          download="stroke_risk_dataset_v2.csv"
          className="download-dataset-btn"
        >
          Kiểm chứng dữ liệu
        </a>
        <div className="report-paper-content">
          <figure className="report-figure-full">
            <img src={matran} alt="Ma trận tương quan" className="report-img-full" onClick={() => setSelected({src: matran, title: 'Ma trận tương quan'})} tabIndex={0} style={{ cursor: 'zoom-in' }} />
            <figcaption className="report-caption">Hình 3. Ma trận tương quan giữa các đặc trưng đầu vào.</figcaption>
          </figure>
          <figure className="report-figure-full">
            <img src={others} alt="Các biểu đồ khác" className="report-img-full" onClick={() => setSelected({src: others, title: 'Các biểu đồ khác'})} tabIndex={0} style={{ cursor: 'zoom-in' }} />
            <figcaption className="report-caption">Hình 1. Một số biểu đồ phân tích dữ liệu bổ sung.</figcaption>
          </figure>
          <h3 className="report-title">1. Tổng quan quy trình tiền xử lý và phân tích dữ liệu</h3>
          <ol className="report-list">
            <li>
              <b>Loại bỏ các đặc trưng không cần thiết:</b> Các đặc trưng <code>stroke_risk_percentage</code> và <code>age_group</code> được loại bỏ nhằm giảm nhiễu và tập trung vào các biến thực sự ảnh hưởng đến dự đoán nguy cơ đột quỵ.
            </li>
            <li>
              <b>Mã hóa và chuyển đổi:</b> Biến phân loại <code>gender</code> (giới tính) được mã hóa nhị phân (Male → 1, Female → 0) để phù hợp với các thuật toán học máy.
            </li>
            <li>
              <b>Chuẩn hóa đặc trưng:</b> Đặc trưng <code>age</code> được chuẩn hóa bằng <b>RobustScaler</b> do phân phối tuổi lệch phải và xuất hiện nhiều giá trị ngoại lai, đặc biệt ở nhóm có nguy cơ đột quỵ (tuổi trung bình khoảng 49).
            </li>
            <div className="report-img-group">
              <figure className="report-figure">
                <img src={age} alt="Phân bố tuổi & nguy cơ" className="report-img" onClick={() => setSelected({src: age, title: 'Phân bố tuổi & nguy cơ'})} tabIndex={0} style={{ cursor: 'zoom-in' }} />
                <figcaption className="report-caption">Hình 2. Phân bố tuổi và nguy cơ đột quỵ theo nhóm tuổi.</figcaption>
              </figure>
            </div>
            <div className="report-img-group report-img-group-large">
              <figure className="report-figure report-figure-large">
                <img src={Phanphoi} alt="Phân tích đơn biến" className="report-img report-img-large" onClick={() => setSelected({src: Phanphoi, title: 'Phân tích đơn biến'})} tabIndex={0} style={{ cursor: 'zoom-in' }} />
                <figcaption className="report-caption">Hình 4. Phân tích đơn biến các đặc trưng quan trọng.</figcaption>
              </figure>
            </div>
            <li>
              <b>Chia tập huấn luyện/kiểm tra:</b> Dữ liệu được chia thành hai phần: 70% (13.096 mẫu) dùng để huấn luyện mô hình và 30% (5.613 mẫu) để đánh giá kết quả (kiểm tra độc lập), đảm bảo tính khách quan trong đánh giá hiệu quả mô hình.
            </li>
            <li>
              <b>Xử lý dữ liệu mất cân bằng:</b> Do sự chênh lệch tỷ lệ giữa hai lớp <code>at_risk</code>, kỹ thuật <b>SMOTE</b> được áp dụng để tăng cường dữ liệu cho lớp thiểu số trong tập huấn luyện, giúp mô hình học tốt hơn và giảm thiểu hiện tượng bias.
            </li>
            <div className="report-img-group">
              <figure className="report-figure">
                <img src={smote} alt="SMOTE - Cân bằng dữ liệu" className="report-img" onClick={() => setSelected({src: smote, title: 'SMOTE - Cân bằng dữ liệu'})} tabIndex={0} style={{ cursor: 'zoom-in' }} />
                <figcaption className="report-caption">Hình 5. Hiệu quả cân bằng dữ liệu bằng kỹ thuật SMOTE.</figcaption>
              </figure>
            </div>
          </ol>
        </div>
      </div>
      {selected && (
        <div className="modal" onClick={() => setSelected(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <img src={selected.src} alt={selected.title} className="modal-img" />
            <div className="modal-title">{selected.title}</div>
            <button className="close-btn" onClick={() => setSelected(null)}>&times;</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartAnalysis; 