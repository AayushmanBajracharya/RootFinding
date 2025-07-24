# 🎯 Root Finding Methods - Interactive Learning Platform

<div align="center">

![Root Finding Methods](https://img.shields.io/badge/Subject-Numerical%20Analysis-blue?style=for-the-badge&logo=calculator)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chart.js&logoColor=white)

**A comprehensive educational web application for learning numerical root-finding methods with interactive visualizations, step-by-step explanations, and engaging quizzes.**

[🚀 Live Demo](#-live-demo) • [📚 Features](#-features) • [🛠️ Installation](#️-installation) • [📖 Usage](#-usage) • [🔬 Methods](#-numerical-methods)

</div>

---

## 📋 Table of Contents

- [✨ Overview](#-overview)
- [🎯 Features](#-features)
- [🔬 Numerical Methods](#-numerical-methods)
- [🛠️ Technologies Used](#️-technologies-used)
- [📁 Project Structure](#-project-structure)
- [🚀 Installation](#-installation)
- [📖 Usage Guide](#-usage-guide)
- [🎨 Screenshots](#-screenshots)
- [🧮 Mathematical Foundation](#-mathematical-foundation)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👨‍💻 Author](#-author)

---

## ✨ Overview

**Root Finding Methods** is an interactive educational platform designed to help students and professionals understand and master numerical methods for finding roots of mathematical functions. The application combines theoretical explanations with practical implementations, featuring real-time visualizations and comprehensive assessments.

### 🎓 Educational Objectives

- **Master Numerical Algorithms**: Learn bisection, Newton-Raphson, and secant methods
- **Visualize Convergence**: Interactive charts showing algorithm progression
- **Practical Application**: Real-world examples and problem-solving techniques
- **Assessment & Practice**: Comprehensive quizzes and challenges
- **Mathematical Understanding**: Deep dive into convergence theory and error analysis

---

## 🎯 Features

### 🧮 **Interactive Calculators**
- **Real-time Computation**: Step-by-step algorithm execution
- **Visual Convergence**: Live charts showing iteration progress
- **Function Parser**: Support for complex mathematical expressions
- **Error Analysis**: Detailed convergence and error tracking
- **Auto-suggestion**: Intelligent bound detection

### 📚 **Comprehensive Learning Materials**
- **Detailed Explanations**: Theory, algorithms, and mathematical foundations
- **Code Examples**: JavaScript, Python implementations
- **Academic References**: Citations and further reading materials
- **Historical Context**: Origins and evolution of methods
- **Practical Applications**: Real-world use cases and examples

### 🎮 **Interactive Assessments**
- **Method-specific Quizzes**: Targeted practice for each algorithm
- **Comprehensive Challenges**: Multi-method assessment
- **Timed Questions**: Skill-building under time pressure
- **Progress Tracking**: Performance analytics and scoring
- **Immediate Feedback**: Real-time answer validation

### 🎨 **Modern UI/UX**
- **Responsive Design**: Works seamlessly on all devices
- **Dark Theme**: Professional and eye-friendly interface
- **Smooth Animations**: Engaging particle effects and transitions
- **Interactive Elements**: 3D card effects and hover animations
- **Accessibility**: Semantic HTML and proper contrast ratios

---

## 🔬 Numerical Methods

### 1️⃣ **Bisection Method**
```
🔸 Type: Bracketing Method
🔸 Convergence: Linear (Guaranteed)
🔸 Requirements: Continuous function, sign change
🔸 Advantage: Always converges
🔸 Use Case: Reliable root finding
```

### 2️⃣ **Newton-Raphson Method**
```
🔸 Type: Open Method  
🔸 Convergence: Quadratic (Fast)
🔸 Requirements: Differentiable function
🔸 Advantage: Rapid convergence
🔸 Use Case: When derivatives are available
```

### 3️⃣ **Secant Method**
```
🔸 Type: Open Method
🔸 Convergence: Superlinear
🔸 Requirements: Two initial points
🔸 Advantage: No derivative needed
🔸 Use Case: Practical alternative to Newton-Raphson
```

---

## 🛠️ Technologies Used

<table>
<tr>
<td align="center" width="33%">

### **Frontend Core**
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

</td>
<td align="center" width="33%">

### **Visualization**
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=flat&logo=chart.js&logoColor=white)
![Plotly](https://img.shields.io/badge/Plotly-3F4F75?style=flat&logo=plotly&logoColor=white)
![Particles.js](https://img.shields.io/badge/Particles.js-000000?style=flat&logo=javascript&logoColor=white)

</td>
<td align="center" width="33%">

### **Libraries & Tools**
![Lucide](https://img.shields.io/badge/Lucide-000000?style=flat&logo=lucide&logoColor=white)
![Math.js](https://img.shields.io/badge/Math.js-FF6B6B?style=flat&logo=javascript&logoColor=white)
![Highlight.js](https://img.shields.io/badge/Highlight.js-002B36?style=flat&logo=javascript&logoColor=white)

</td>
</tr>
</table>

### **Detailed Technology Stack**

| **Category** | **Technology** | **Purpose** |
|--------------|----------------|-------------|
| **Core** | HTML5, CSS3, JavaScript ES6+ | Frontend foundation |
| **UI Framework** | Custom CSS with Grid/Flexbox | Responsive layouts |
| **Icons** | Lucide Icons | Modern iconography |
| **Typography** | Google Fonts (Inter) | Professional typography |
| **Animations** | CSS Animations + Particles.js | Interactive effects |
| **Visualization** | Chart.js + Plotly.js | Data plotting and charts |
| **Mathematics** | Math.js | Advanced calculations |
| **Code Highlighting** | Highlight.js | Syntax highlighting |
| **Version Control** | Git | Source code management |

---

## 📁 Project Structure

```
RootFinding/
├── 📄 index.html                 # Main landing page
├── 📄 README.md                  # Project documentation
├── 📁 src/                       # Source code directory
│   ├── 📁 css/                   # Stylesheets
│   │   ├── 🎨 quiz.css           # Quiz interface styles
│   │   ├── 🎨 bisection.css      # Bisection method styles
│   │   ├── 🎨 newton_raphson.css # Newton-Raphson styles
│   │   └── 🎨 ...                # Additional method styles
│   ├── 📁 html/                  # Web pages
│   │   ├── 📄 quiz.html          # Quiz selection dashboard
│   │   ├── 📄 bisection.html     # Bisection calculator
│   │   ├── 📄 newton_raphson.html # Newton-Raphson tool
│   │   ├── 📄 secant.html        # Secant method calculator
│   │   ├── 📄 *_explain.html     # Explanation pages
│   │   └── 📄 *_quiz.html        # Quiz pages
│   └── 📁 js/                    # JavaScript logic
│       ├── ⚙️ bisection.js       # Bisection algorithm
│       ├── ⚙️ newton_raphson.js  # Newton-Raphson logic
│       ├── ⚙️ secant.js          # Secant method
│       └── ⚙️ quiz-logic.js      # Quiz management
└── 📁 .git/                     # Git repository
```

---

## 🚀 Installation

### **Prerequisites**
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server setup required - runs entirely in browser

### **Quick Start**

1️⃣ **Clone the Repository**
```bash
git clone https://github.com/AayushmanBajracharya/RootFinding.git
cd RootFinding
```

2️⃣ **Launch the Application**
```bash
# Option 1: Direct file opening
open index.html

# Option 2: Using Python server
python -m http.server 8000

# Option 3: Using Node.js server  
npx serve .

# Option 4: Using PHP server
php -S localhost:8000
```

3️⃣ **Access the Application**
```
🌐 Open: http://localhost:8000 (if using server)
📂 Or: Double-click index.html (direct file access)
```

---

## 📖 Usage Guide

### **🏠 Main Navigation**
1. **Home Page**: Overview and method selection
2. **Interactive Tools**: Access calculators for each method
3. **Learning Materials**: Comprehensive explanations and theory
4. **Quiz Section**: Practice and assessment tools

### **🧮 Using the Calculators**

#### **Bisection Method**
```javascript
1. Enter function (e.g., x^3 - x - 2)
2. Set interval bounds [a, b]
3. Choose tolerance and max iterations
4. Click "Find Root" to start calculation
5. Watch real-time convergence visualization
```

#### **Newton-Raphson Method**
```javascript
1. Enter function and its derivative
2. Set initial guess x₀
3. Configure tolerance settings
4. Execute algorithm with step-by-step tracking
5. Analyze convergence rate and accuracy
```

#### **Secant Method**
```javascript
1. Input target function
2. Provide two initial estimates
3. Set convergence criteria
4. Run algorithm and observe iteration process
5. Compare with other methods
```

### **📚 Learning Resources**
- **Theory Pages**: Mathematical foundations and proofs
- **Code Examples**: Implementation in multiple languages
- **Interactive Demos**: Step-by-step algorithm visualization
- **Practice Problems**: Guided exercises with solutions

### **🎯 Assessment System**
- **Individual Quizzes**: Method-specific questions
- **Comprehensive Tests**: Multi-method challenges
- **Timed Assessments**: Skill evaluation under pressure
- **Progress Tracking**: Performance analytics and improvement suggestions

---

## 🎨 Screenshots

<div align="center">

### **🏠 Main Dashboard**
*Interactive landing page with method selection and animated backgrounds*

### **🧮 Calculator Interface**
*Real-time numerical computation with step-by-step visualization*

### **📊 Convergence Visualization**
*Live charts showing algorithm progression and error analysis*

### **🎯 Quiz Interface**
*Engaging assessment platform with immediate feedback*

</div>

---

## 🧮 Mathematical Foundation

### **Core Algorithms**

#### **Bisection Method Algorithm**
```
Input: Function f(x), interval [a,b], tolerance ε
Output: Approximate root

1. Verify f(a) × f(b) < 0
2. While |b - a| > ε:
   a. c = (a + b) / 2
   b. If f(c) × f(a) < 0: b = c
   c. Else: a = c
3. Return (a + b) / 2
```

#### **Newton-Raphson Method Algorithm**
```
Input: Function f(x), derivative f'(x), initial guess x₀, tolerance ε
Output: Approximate root

1. Set x = x₀
2. While |f(x)| > ε:
   a. x_new = x - f(x)/f'(x)
   b. x = x_new
3. Return x
```

#### **Secant Method Algorithm**
```
Input: Function f(x), initial points x₀, x₁, tolerance ε
Output: Approximate root

1. While |f(x₁)| > ε:
   a. x₂ = x₁ - f(x₁) × (x₁ - x₀)/(f(x₁) - f(x₀))
   b. x₀ = x₁
   c. x₁ = x₂
2. Return x₁
```

### **Convergence Analysis**

| **Method** | **Convergence Rate** | **Advantages** | **Limitations** |
|------------|---------------------|----------------|-----------------|
| **Bisection** | Linear (r = 0.5) | Always converges | Slow convergence |
| **Newton-Raphson** | Quadratic (r = 2) | Fast convergence | Requires derivative |
| **Secant** | Superlinear (r ≈ 1.618) | No derivative needed | May not converge |

---

## 🤝 Contributing

We welcome contributions to enhance the Root Finding Methods platform! Here's how you can help:

### **🔧 Areas for Contribution**
- **New Methods**: Implement additional root-finding algorithms
- **Enhanced Visualizations**: Improve charts and animations
- **Educational Content**: Add examples, exercises, and explanations
- **UI/UX Improvements**: Design enhancements and accessibility
- **Performance Optimization**: Code efficiency and loading speed
- **Mobile Experience**: Responsive design improvements

### **📝 Contribution Process**

1. **Fork the Repository**
   ```bash
   git fork https://github.com/AayushmanBajracharya/RootFinding.git
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make Changes**
   - Follow existing code style
   - Add comprehensive comments
   - Test thoroughly across browsers

4. **Commit Changes**
   ```bash
   git commit -m "Add amazing feature"
   ```

5. **Submit Pull Request**
   - Provide detailed description
   - Include screenshots if UI changes
   - Reference related issues

### **🐛 Bug Reports**
Found a bug? Please create an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Browser and system information
- Screenshots (if applicable)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License - Feel free to use, modify, and distribute
Personal and commercial use permitted
No warranty provided
```

---

## 👨‍💻 Author

<div align="center">

**Aayushman Bajracharya**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/AayushmanBajracharya)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/aayushmanbajracharya)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:aayushman.bajracharya@example.com)

*Passionate about numerical methods, educational technology, and interactive learning experiences.*

</div>

---

## 🙏 Acknowledgments

- **Mathematical References**: Classic numerical analysis textbooks and research papers
- **Open Source Libraries**: Chart.js, Particles.js, Lucide Icons, and other amazing tools
- **Educational Inspiration**: Academic courses and online learning platforms
- **Community Support**: Stack Overflow, GitHub, and mathematical computing communities

---

<div align="center">

### **⭐ Star this repository if you found it helpful!**

**Made with ❤️ for students and educators worldwide**

[🔝 Back to Top](#-root-finding-methods---interactive-learning-platform)

</div>