# 🧠 Stroke Risk Prediction Application

<div align="center">
  <img src="src/assets/logo.png" alt="Stroke Prediction Logo" width="150" />
  <h3>Modern AI-powered Stroke Risk Assessment Tool</h3>
  
  ![GitHub](https://img.shields.io/github/license/SharkTien/Stroke-Prediction?style=flat-square)
  ![React](https://img.shields.io/badge/React-v18-blue?style=flat-square&logo=react)
  ![Python](https://img.shields.io/badge/Python-3.10+-green?style=flat-square&logo=python)
  ![Vite](https://img.shields.io/badge/Vite-latest-purple?style=flat-square&logo=vite)
</div>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-demo">Demo</a> •
  <a href="#-technologies">Technologies</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-usage">Usage</a> •
  <a href="#-contributors">Contributors</a> •
  <a href="#-license">License</a>
</p>

<div align="center">
  <img src="src/assets/stroke-bg.jpg" alt="Stroke Prediction App" width="80%" style="border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.2);" />
</div>

## ✨ Features

- **Interactive Risk Assessment Form**: Multi-step form with smooth transitions and progress tracking
- **Advanced Data Processing**: Uses machine learning models to analyze risk factors
- **Personalized Results**: Detailed report on individual stroke risk assessment
- **Modern UI Design**: Beautiful interface with animations, gradients, and responsive layout
- **Multilingual Support**: Available in multiple languages (Vietnamese and English)
- **Accessible Design**: Optimized for all users including those with disabilities

## 🎮 Demo

Check out our live demo at: [Stroke Prediction App](https://sharktien.github.io/Stroke-Prediction/)

## 🚀 Technologies

### Frontend
- **React** - Modern component-based UI library
- **Ant Design** - High-quality UI components
- **Styled Components** - CSS-in-JS for dynamic styling
- **React Router** - For navigation between app sections

### Backend
- **Python** - For machine learning models and data processing
- **Scikit-learn** - Machine learning algorithms
- **Flask** - API service for model predictions

### DevOps
- **Vite** - Next generation frontend tooling
- **GitHub Actions** - CI/CD workflows
- **GitHub Pages** - Deployment and hosting

## 💻 Installation

### Prerequisites
- Node.js (v14 or higher)
- Python 3.10+ (for the API)
- Git

### Frontend Setup
```bash
# Clone the repository
git clone https://github.com/SharkTien/Stroke-Prediction.git

# Navigate to project directory
cd Stroke-Prediction

# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to API directory
cd src/api

# Install Python dependencies
pip install -r requirements.txt

# Start the API server
python predict.py
```

## 📖 Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Fill out the assessment form with your health information
3. Submit the form to receive your stroke risk prediction
4. View detailed results and recommendations

## 💡 How It Works

Our application uses a machine learning model trained on medical data to assess stroke risk based on several factors:

- Age
- Gender
- Heart health indicators
- Lifestyle factors
- Medical history
- Physical symptoms

The model processes this information to generate a personalized risk assessment and provides tailored recommendations.

## 👨‍💻 Contributors

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/SharkTien">
        <img src="src/assets/Tien.jpg" width="100px;" alt="Tien's photo" style="border-radius:50%"/><br />
        <b>SharkTien</b>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/SharkTien">
        <img src="src/assets/Tran.jpg" width="100px;" alt="Tran's photo" style="border-radius:50%"/><br />
        <b>Tran</b>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/SharkTien">
        <img src="src/assets/unknown.png" width="100px;" alt="Team member" style="border-radius:50%"/><br />
        <b>Team Member</b>
      </a>
    </td>
  </tr>
</table>

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Made with ❤️ by CS114.P23 Team</p>
  <p>HCMUS - Vietnam National University</p>
</div>
