import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header/header';
import Home from './components/home/home';
import Footer from './components/footer/footer';
import LinearRegressionForm from './components/LinearRegression/LinearRegressionForm';
import ResultPage from './components/LinearRegression/ResultPage';
import TestResult from './components/LinearRegression/TestResult';
import About from './components/about/about';

function App() {
  const [isDark, setIsDark] = useState(false)   

  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/assessment" element={<LinearRegressionForm />} />
            <Route path="/about" element={<About />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="/test-result" element={<TestResult />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
