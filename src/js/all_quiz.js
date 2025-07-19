// Quiz Questions
const questions = [
    {
        question: "In the Bisection method, what determines the initial interval [a,b]?",
        options: [
            "Any two random numbers",
            "Two points where f(a) and f(b) have opposite signs",
            "Two consecutive integers",
            "Points where derivative is zero"
        ],
        correct: 1
    },
    {
        question: "What is the main advantage of Newton-Raphson method over Bisection method?",
        options: [
            "It always converges",
            "It's easier to implement",
            "It has quadratic convergence",
            "It doesn't require derivatives"
        ],
        correct: 2
    },
    {
        question: "The Secant method is similar to Newton-Raphson method, but what does it eliminate?",
        options: [
            "The need for initial guesses",
            "The need for iterations",
            "The need for function evaluation",
            "The need for derivative calculation"
        ],
        correct: 3
    }
];

// Quiz state
let currentQuestion = 0;
let score = 0;
let timeLeft = 30;
let timer;
let countdownTimer;
let selectedAnswer = null;
let totalScore = 0;
let questionsAnswered = 0;
let shuffledQuestions = [];

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Initialize particles.js
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: '#ffffff' },
            shape: { type: 'circle' },
            opacity: {
                value: 0.2,
                random: true,
                animation: { enable: true, speed: 1, minimumValue: 0.1, sync: false }
            },
            size: {
                value: 3,
                random: true,
                animation: { enable: true, speed: 2, minimumValue: 0.1, sync: false }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#ffffff',
                opacity: 0.1,
                width: 1
            },
            move: {
                enable: true,
                speed: 1,
                direction: 'none',
                random: true,
                straight: false,
                outMode: 'out',
                bounce: false,
            }
        },
        interactivity: {
            detectsOn: 'canvas',
            events: {
                onhover: { enable: true, mode: 'grab' },
                onclick: { enable: true, mode: 'push' },
                resize: true
            },
            modes: {
                grab: { distance: 140, line_linked: { opacity: 0.5 } },
                push: { particles_nb: 4 }
            }
        },
        retina_detect: true
    });

        // Reset all displays
    countdownContainer.style.display = 'block';
    questionContainer.style.display = 'none';
    document.getElementById('set-info').style.display = 'none';
    scoreContainer.style.display = 'none';
    
    // Start countdown
    startCountdown();
});

// DOM Elements
const countdownContainer = document.getElementById('countdown-container');
const questionContainer = document.getElementById('question-container');
const scoreContainer = document.getElementById('score-container');
const timerElement = document.querySelector('.timer');
const questionElement = document.querySelector('.question');
const optionsElement = document.querySelector('.options');
const submitButton = document.getElementById('submit-btn');
const nextSetButton = document.getElementById('next-set-btn');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    initializeQuiz();
});

function initializeQuiz() {
    // Initialize particles.js
    particlesJS('particles-js', {
        particles: {
            number: { value: 30, density: { enable: true, value_area: 800 } },
            color: { value: ['#2c3e50', '#3498db', '#2ecc71'] },
            shape: { type: 'circle' },
            opacity: {
                value: 0.1,
                random: true,
                anim: { enable: true, speed: 0.5, opacity_min: 0.05, sync: false }
            },
            size: {
                value: 2,
                random: true,
                anim: { enable: true, speed: 1, size_min: 0.1, sync: false }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#2c3e50',
                opacity: 0.1,
                width: 1
            },
            move: {
                enable: true,
                speed: 0.5,
                direction: 'none',
                random: true,
                straight: false,
                out_mode: 'out',
                bounce: false
            }
        }
    });

    // Start countdown
    startCountdown();
}

function startCountdown() {
    let countdown = 10;
    const countdownElement = document.querySelector('.countdown-number');
    
    countdownTimer = setInterval(() => {
        countdown--;
        countdownElement.textContent = countdown;
        
        if (countdown <= 0) {
            clearInterval(countdownTimer);
            startQuiz();
        }
    }, 1000);
}

function startQuiz() {
    countdownContainer.style.display = 'none';
    questionContainer.style.display = 'block';
    document.getElementById('set-info').style.display = 'block';
    
    // Shuffle questions
    shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
    
    // Start question timer
    startTimer();
    
    // Display first question
    displayQuestion();
}

function startTimer() {
    timeLeft = 30;
    updateTimerDisplay();
    
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            handleTimeUp();
        }
    }, 1000);
}

function updateTimerDisplay() {
    timerElement.textContent = timeLeft + 's';
}

function displayQuestion() {
    const question = shuffledQuestions[currentQuestion];
    questionElement.textContent = question.question;
    
    optionsElement.innerHTML = '';
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option;
        button.addEventListener('click', () => selectAnswer(index));
        optionsElement.appendChild(button);
    });
    
    selectedAnswer = null;
    submitButton.disabled = true;
}

function selectAnswer(index) {
    const options = document.querySelectorAll('.option-btn');
    options.forEach(option => option.classList.remove('selected'));
    options[index].classList.add('selected');
    selectedAnswer = index;
    submitButton.disabled = false;
}

function handleTimeUp() {
    if (selectedAnswer === null) {
        checkAnswer();
    }
}

function checkAnswer() {
    clearInterval(timer);
    
    const correct = shuffledQuestions[currentQuestion].correct;
    if (selectedAnswer === correct) {
        score++;
    }
    
    const options = document.querySelectorAll('.option-btn');
    options.forEach((option, index) => {
        if (index === correct) {
            option.classList.add('correct');
        } else if (index === selectedAnswer) {
            option.classList.add('incorrect');
        }
    });
    
    questionsAnswered++;
    updateProgress();
    
    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < shuffledQuestions.length) {
            startTimer();
            displayQuestion();
        } else {
            showScore();
        }
    }, 2000);
}

function updateProgress() {
    const progress = (questionsAnswered / shuffledQuestions.length) * 100;
    document.querySelector('.progress').style.width = progress + '%';
}

function showScore() {
    questionContainer.style.display = 'none';
    scoreContainer.style.display = 'block';
    
    const scorePercentage = (score / shuffledQuestions.length) * 100;
    document.querySelector('.score').textContent = Math.round(scorePercentage) + '%';
    
    const message = scorePercentage >= 70 ? 
        'Great job! You have a good understanding of root-finding methods!' :
        'Keep practicing! Review the concepts and try again.';
    document.querySelector('.score-message').textContent = message;
}

// Event Listeners
submitButton.addEventListener('click', checkAnswer);
nextSetButton.addEventListener('click', () => {
    currentQuestion = 0;
    score = 0;
    startQuiz();
});

// Initialize particles.js
particlesJS('particles-js', {
    particles: {
        number: { value: 30, density: { enable: true, value_area: 800 } },
        color: { value: ['#2c3e50', '#3498db', '#2ecc71'] },
        shape: { type: 'circle' },
        opacity: {
            value: 0.1,
            random: true,
            anim: { enable: true, speed: 0.5, opacity_min: 0.05, sync: false }
        },
        size: {
            value: 2,
            random: true,
            anim: { enable: true, speed: 1, size_min: 0.1, sync: false }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#2c3e50',
            opacity: 0.1,
            width: 1
        },
        move: {
            enable: true,
            speed: 0.5,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: { enable: true, mode: 'grab' },
            onclick: { enable: true, mode: 'push' },
            resize: true
        },
        modes: {
            grab: { distance: 180, line_linked: { opacity: 0.25 } },
            push: { particles_nb: 2 }
        }
    },
    retina_detect: true
});

// Start the quiz
document.addEventListener('DOMContentLoaded', () => {
    startCountdown();
});

function startCountdown() {
    const countdownElement = document.querySelector('.countdown-number');
    const countdownContainer = document.getElementById('countdown-container');
    const questionContainer = document.getElementById('question-container');
    const setInfo = document.getElementById('set-info');
    
    let count = 10;
    countdownElement.textContent = count;
    
    countdownTimer = setInterval(() => {
        count--;
        countdownElement.textContent = count;
        
        if (count <= 0) {
            clearInterval(countdownTimer);
            countdownContainer.style.display = 'none';
            questionContainer.style.display = 'flex';
            setInfo.style.display = 'block';
            shuffleQuestions();
            startQuiz();
        }
    }, 1000);
}

function shuffleQuestions() {
    // Group questions by set
    let questionsBySet = {};
    questions.forEach(q => {
        if (!questionsBySet[q.set]) questionsBySet[q.set] = [];
        questionsBySet[q.set].push({...q});
    });

    // Shuffle questions within each set
    shuffledQuestions = [];
    for (let set = 1; set <= 5; set++) {
        if (questionsBySet[set]) {
            shuffledQuestions = shuffledQuestions.concat(shuffleArray(questionsBySet[set]));
        }
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startQuiz() {
    currentQuestion = 0;
    score = 0;
    showQuestion();
    startTimer();
}

function showQuestion() {
    const currentQ = shuffledQuestions[currentQuestion];
    if (!currentQ) return;

    const questionElement = document.querySelector('.question');
    const optionsContainer = document.querySelector('.options');
    const submitButton = document.getElementById('submit-btn');
    
    // Clear previous content
    questionElement.textContent = currentQ.question;
    optionsContainer.innerHTML = '';
    
    // Add options
    currentQ.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        optionDiv.textContent = option;
        optionDiv.addEventListener('click', () => selectOption(index, optionDiv));
        optionsContainer.appendChild(optionDiv);
    });

    // Update set info
    document.getElementById('set-info').textContent = `Set ${currentQ.set} of 5`;
    
    // Reset state
    selectedAnswer = null;
    submitButton.textContent = 'Submit Answer';
    submitButton.onclick = submitAnswer;
}

function selectOption(index, optionDiv) {
    const options = document.querySelectorAll('.option');
    options.forEach(opt => opt.classList.remove('selected'));
    optionDiv.classList.add('selected');
    selectedAnswer = index;
}

function startTimer() {
    clearInterval(timer);
    timeLeft = 30;
    updateTimerDisplay();
    
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            submitAnswer(true);
        }
    }, 1000);
}

function updateTimerDisplay() {
    const timerDisplay = document.querySelector('.timer');
    timerDisplay.textContent = `${timeLeft}s`;
    
    if (timeLeft <= 10) {
        timerDisplay.style.color = '#ff4757';
    } else {
        timerDisplay.style.color = '#fff';
    }
}

function submitAnswer(timeUp = false) {
    if (selectedAnswer === null && !timeUp) {
        alert("Please select an answer!");
        return;
    }

    clearInterval(timer);
    const currentQ = shuffledQuestions[currentQuestion];
    const options = document.querySelectorAll('.option');
    const feedback = document.querySelector('.feedback');
    
    if (selectedAnswer === currentQ.correct) {
        score++;
        feedback.textContent = "Correct! " + currentQ.feedback;
        feedback.className = 'feedback correct';
    } else {
        if (!timeUp) {
            feedback.textContent = "Incorrect. " + currentQ.feedback;
            feedback.className = 'feedback wrong';
        } else {
            feedback.textContent = "Time's up! " + currentQ.feedback;
            feedback.className = 'feedback wrong';
        }
    }

    options[currentQ.correct].classList.add('correct');
    if (selectedAnswer !== null && selectedAnswer !== currentQ.correct) {
        options[selectedAnswer].classList.add('wrong');
    }

    document.getElementById('submit-btn').textContent = 'Next Question';
    document.getElementById('submit-btn').onclick = nextQuestion;
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < shuffledQuestions.length) {
        showQuestion();
        startTimer();
    } else {
        endQuiz();
    }
}

function endQuiz() {
    clearInterval(timer);
    document.getElementById('question-container').style.display = 'none';
    document.getElementById('score-container').style.display = 'flex';

    const percentage = (score / shuffledQuestions.length) * 100;
    document.querySelector('.score').textContent = `${Math.round(percentage)}%`;
    
    let message;
    if (percentage >= 90) {
        message = "Outstanding! You have mastered root-finding methods!";
    } else if (percentage >= 80) {
        message = "Excellent! You have a strong understanding of the concepts!";
    } else if (percentage >= 70) {
        message = "Good job! You're getting there, keep practicing!";
    } else if (percentage >= 60) {
        message = "Not bad! Review the concepts you missed and try again!";
    } else {
        message = "Keep practicing! Focus on understanding the core concepts!";
    }
    
    document.querySelector('.score-message').textContent = message;
}
