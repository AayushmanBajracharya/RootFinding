// Quiz state variables
let currentQuestion = 0;
let score = 0;
let timeLeft = 30;
let timer = null;
let countdownTimer = null;
let selectedAnswer = null;
let totalScore = 0;
let questionsAnswered = 0;
let currentSet = 0;
const questionsPerSet = 9;
const totalSets = 5;
let questions = [];
let allQuestions = [];

// Helper function to create questions
function createQuestion(question, options, correctIndex, explanation, method) {
    return {
        question: question,
        options: options,
        correct: correctIndex,
        explanation: explanation,
        method: method
    };
}

// All quiz questions
allQuestions = [
    // Bisection Method Questions
    createQuestion(
        "What is the key requirement for the Bisection Method?",
        [
            "Function must be linear",
            "Function values must have opposite signs at endpoints",
            "Function must be differentiable",
            "Function must be polynomial"
        ],
        1,
        "Bisection Method requires opposite signs at endpoints to guarantee a root in the interval.",
        "Bisection"
    ),
    createQuestion(
        "What is the error reduction rate in Bisection Method?",
        [
            "Reduces by 1/3 each iteration",
            "Reduces by 1/2 each iteration",
            "Reduces by 1/4 each iteration",
            "Reduces exponentially"
        ],
        1,
        "In Bisection Method, the error is halved with each iteration.",
        "Bisection"
    ),
    createQuestion(
        "How many iterations are needed in Bisection to reduce error by factor of 1000?",
        [
            "5 iterations",
            "10 iterations",
            "15 iterations",
            "20 iterations"
        ],
        1,
        "Since 2¹⁰ ≈ 1024, 10 iterations are needed to reduce error by factor of approximately 1000.",
        "Bisection"
    ),

    // Newton-Raphson Questions
    createQuestion(
        "What can cause Newton-Raphson Method to fail?",
        [
            "Function is too simple",
            "Derivative is zero at an iteration",
            "Function is continuous",
            "Interval is too small"
        ],
        1,
        "When the derivative becomes zero, Newton-Raphson Method fails due to division by zero.",
        "Newton"
    ),
    createQuestion(
        "What does Newton-Raphson Method use to find better approximations?",
        [
            "Midpoints of intervals",
            "Tangent lines at points",
            "Average of endpoints",
            "Random points"
        ],
        1,
        "Newton-Raphson Method uses tangent lines to find intersections with x-axis as next approximations.",
        "Newton"
    ),
    createQuestion(
        "How do multiple roots affect Newton-Raphson convergence?",
        [
            "No effect",
            "Reduces convergence rate",
            "Improves convergence",
            "Prevents convergence"
        ],
        1,
        "Multiple roots reduce Newton-Raphson's convergence rate from quadratic to linear.",
        "Newton"
    ),

    // Secant Method Questions
    createQuestion(
        "How does Secant Method approximate derivatives?",
        [
            "Using tangent lines",
            "Using difference quotients of two points",
            "Using integrals",
            "Using polynomials"
        ],
        1,
        "Secant Method uses difference quotients of two points to approximate derivatives.",
        "Secant"
    ),
    createQuestion(
        "What is the convergence rate of Secant Method?",
        [
            "Linear (1.0)",
            "Superlinear (≈1.618)",
            "Quadratic (2.0)",
            "Cubic (3.0)"
        ],
        1,
        "Secant Method has superlinear convergence with rate approximately equal to the golden ratio (1.618).",
        "Secant"
    ),
    createQuestion(
        "When is Secant Method particularly useful?",
        [
            "With polynomials only",
            "When derivatives are hard to compute",
            "With linear functions",
            "With simple functions"
        ],
        1,
        "Secant Method is particularly useful when derivative calculations are difficult or costly.",
        "Secant"
    ),

    // Comparison Questions
    createQuestion(
        "Which method guarantees convergence if initial conditions are met?",
        [
            "Newton-Raphson Method",
            "Bisection Method",
            "Secant Method",
            "All of the above"
        ],
        1,
        "The Bisection Method always converges when initial conditions (opposite signs at endpoints) are met.",
        "Comparison"
    ),
    createQuestion(
        "Which method has the fastest convergence rate?",
        [
            "Bisection Method",
            "Newton-Raphson Method",
            "Secant Method",
            "They all converge at the same rate"
        ],
        1,
        "Newton-Raphson Method has quadratic convergence, which is faster than both Bisection (linear) and Secant (≈1.618) methods.",
        "Comparison"
    ),
    createQuestion(
        "Which method is computationally least expensive per iteration?",
        [
            "Newton-Raphson Method",
            "Bisection Method",
            "Secant Method",
            "All have same cost"
        ],
        1,
        "Bisection Method only requires function evaluations, making it computationally simpler per iteration.",
        "Comparison"
    ),

    // General Questions
    createQuestion(
        "What is the main advantage of bracketing methods?",
        [
            "Fast convergence",
            "Guaranteed convergence",
            "Simple derivatives",
            "Less computation"
        ],
        1,
        "Bracketing methods guarantee convergence by maintaining a bracket around the root.",
        "General"
    ),
    createQuestion(
        "How do you verify a root is correct?",
        [
            "Check iteration count",
            "Substitute back into function",
            "Compare methods",
            "Check derivatives"
        ],
        1,
        "Verifying a root involves substituting it back into the original function to check if f(x) ≈ 0.",
        "General"
    ),
    createQuestion(
        "What determines Bisection Method's stopping point?",
        [
            "Number of iterations",
            "Desired accuracy or tolerance",
            "Function value",
            "Derivative value"
        ],
        1,
        "Bisection Method stops when the interval width is smaller than the desired tolerance.",
        "General"
    )
];

// Organize questions into sets
function organizeQuestions() {
    const organized = [];
    for (let setIndex = 0; setIndex < totalSets; setIndex++) {
        const start = setIndex * questionsPerSet;
        const end = start + questionsPerSet;
        organized.push(...allQuestions.slice(start, end));
    }
    return organized;
}

// Initialize countdown
function startCountdown() {
    let count = 10;
    const countdownElement = document.querySelector('.countdown-number');
    const countdownContainer = document.getElementById('countdown-container');
    
    countdownElement.textContent = count;
    
    countdownTimer = setInterval(() => {
        count--;
        countdownElement.textContent = count;
        countdownElement.classList.add('pulse');
        
        setTimeout(() => {
            countdownElement.classList.remove('pulse');
        }, 500);
        
        if (count <= 0) {
            clearInterval(countdownTimer);
            countdownContainer.classList.remove('active');
            countdownContainer.style.display = 'none';
            document.getElementById('set-info').style.display = 'block';
            document.getElementById('question-container').classList.add('active');
            startQuiz();
        }
    }, 1000);
}

// Start quiz
function startQuiz() {
    currentQuestion = 0;
    score = 0;
    selectedAnswer = null;
    
    // Get questions for current set
    const start = currentSet * questionsPerSet;
    questions = allQuestions.slice(start, start + questionsPerSet);
    
    // Update set info
    document.getElementById('current-set').textContent = currentSet + 1;
    document.getElementById('total-sets').textContent = totalSets;
    
    showQuestion();
    startTimer();
}

// Display current question
function showQuestion() {
    if (currentQuestion >= questions.length) {
        showScore();
        return;
    }

    const question = questions[currentQuestion];
    const questionElement = document.querySelector('.question');
    const optionsContainer = document.querySelector('.options');
    const feedbackElement = document.querySelector('.feedback');
    
    // Clear previous content
    questionElement.textContent = question.question;
    optionsContainer.innerHTML = '';
    feedbackElement.textContent = '';
    feedbackElement.className = 'feedback';
    selectedAnswer = null;
    
    // Create options
    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        optionDiv.textContent = option;
        optionDiv.addEventListener('click', () => selectOption(index));
        optionsContainer.appendChild(optionDiv);
    });
    
    // Update progress
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    document.querySelector('.progress').style.width = `${progress}%`;
    
    // Reset submit button
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.textContent = 'Submit Answer';
    submitBtn.onclick = checkAnswer;
}

// Select an option
function selectOption(index) {
    // Remove previous selection
    document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
    
    // Add selection to clicked option
    const options = document.querySelectorAll('.option');
    options[index].classList.add('selected');
    selectedAnswer = index;
}

// Start timer
function startTimer() {
    if (timer) {
        clearInterval(timer);
    }
    
    timeLeft = 30;
    updateTimerDisplay();
    
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            timer = null;
            checkAnswer();
        }
    }, 1000);
}

// Update timer display
function updateTimerDisplay() {
    const timerElement = document.querySelector('.timer');
    timerElement.textContent = `${timeLeft}s`;
    
    // Add warning colors
    if (timeLeft <= 5) {
        timerElement.className = 'timer danger';
    } else if (timeLeft <= 10) {
        timerElement.className = 'timer warning';
    } else {
        timerElement.className = 'timer';
    }
}

// Check answer
function checkAnswer() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
    
    const question = questions[currentQuestion];
    const options = document.querySelectorAll('.option');
    const feedback = document.querySelector('.feedback');
    
    // Disable all options
    options.forEach(option => option.classList.add('disabled'));
    
    // Show correct answer
    options[question.correct].classList.add('correct');
    
    if (selectedAnswer === null) {
        feedback.textContent = "Time's up! No answer selected.";
        feedback.className = 'feedback wrong';
    } else if (selectedAnswer === question.correct) {
        score++;
        feedback.textContent = `Correct! ${question.explanation}`;
        feedback.className = 'feedback correct';
    } else {
        options[selectedAnswer].classList.add('wrong');
        feedback.textContent = `Incorrect. ${question.explanation}`;
        feedback.className = 'feedback wrong';
    }
    
    // Update button
    const submitBtn = document.getElementById('submit-btn');
    if (currentQuestion < questions.length - 1) {
        submitBtn.textContent = 'Next Question';
        submitBtn.onclick = nextQuestion;
    } else {
        submitBtn.textContent = 'Show Score';
        submitBtn.onclick = showScore;
    }
}

// Go to next question
function nextQuestion() {
    currentQuestion++;
    showQuestion();
    startTimer();
}

// Show score
function showScore() {
    document.getElementById('question-container').classList.remove('active');
    const scoreContainer = document.getElementById('score-container');
    scoreContainer.classList.add('active');
    
    const percentage = Math.round((score / questions.length) * 100);
    scoreContainer.querySelector('.score').textContent = `${percentage}%`;
    
    totalScore += score;
    questionsAnswered += questions.length;
    
    let message;
    if (percentage >= 90) message = "Excellent! Keep going!";
    else if (percentage >= 70) message = "Good job! Ready for the next set?";
    else if (percentage >= 50) message = "Not bad! Let's try another set!";
    else message = "Keep practicing! Next set might be better!";
    
    scoreContainer.querySelector('.score-message').textContent = message;
    
    const nextSetBtn = document.getElementById('next-set-btn');
    if (currentSet < totalSets - 1) {
        nextSetBtn.style.display = 'block';
        nextSetBtn.onclick = loadNextSet;
    } else {
        nextSetBtn.style.display = 'none';
        scoreContainer.querySelector('h2').textContent = 'Quiz Complete!';
        const finalScore = Math.round((totalScore / questionsAnswered) * 100);
        scoreContainer.querySelector('.score-message').textContent = 
            `Final Score: ${finalScore}%\n` + 
            (finalScore >= 70 ? "Great job! You've mastered Root Finding Methods!" : 
             "Keep practicing to improve your understanding!");
    }
    
    updateOverallProgress();
}

// Load next set
function loadNextSet() {
    currentSet++;
    document.getElementById('score-container').classList.remove('active');
    document.getElementById('question-container').classList.add('active');
    startQuiz();
}

// Update overall progress
function updateOverallProgress() {
    if (questionsAnswered > 0) {
        const overallProgress = Math.round((totalScore / questionsAnswered) * 100);
        document.getElementById('overall-progress').textContent = overallProgress;
    }
}

// Initialize particles.js
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 60, density: { enable: true, value_area: 900 } },
                color: { value: '#4cd137' },
                shape: { type: 'circle' },
                opacity: { value: 0.15, random: true, anim: { enable: true, speed: 1, opacity_min: 0.05 } },
                size: { value: 3, random: true, anim: { enable: true, speed: 2, size_min: 0.1 } },
                line_linked: { enable: true, distance: 150, color: '#4cd137', opacity: 0.1, width: 1 },
                move: { enable: true, speed: 1.5, direction: 'none', random: true, straight: false, out_mode: 'out' }
            },
            interactivity: {
                detect_on: 'canvas',
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
    }
}

// Initialize Lucide icons
function initLucideIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Show quit confirmation dialog
function showQuitConfirmation() {
    const dialog = document.getElementById('quit-dialog');
    dialog.classList.add('active');
    
    // Pause any running timers
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
    if (countdownTimer) {
        clearInterval(countdownTimer);
        countdownTimer = null;
    }
}

// Hide quit confirmation dialog
function hideQuitConfirmation() {
    const dialog = document.getElementById('quit-dialog');
    dialog.classList.remove('active');
    
    // Resume timer if in quiz
    if (document.getElementById('question-container').classList.contains('active')) {
        startTimer();
    }
    // Resume countdown if in countdown phase
    else if (document.getElementById('countdown-container').classList.contains('active')) {
        startCountdown();
    }
}

// Confirm quit and redirect
function confirmQuit() {
    // Show a brief goodbye message
    const dialog = document.getElementById('quit-dialog');
    const content = dialog.querySelector('.quit-dialog-content');
    
    content.innerHTML = `
        <div class="cute-character">
            <div class="character-face" style="background: linear-gradient(135deg, #ddd, #bbb);">
                <div class="eyes">
                    <div class="eye left-eye">
                        <div class="pupil" style="animation: none; transform: scaleY(0.1);"></div>
                    </div>
                    <div class="eye right-eye">
                        <div class="pupil" style="animation: none; transform: scaleY(0.1);"></div>
                    </div>
                </div>
                <div class="mouth">
                    <div class="mouth-curve" style="border-radius: 20px 20px 0 0; border-bottom: none; border-top: 2px solid #e17055;"></div>
                </div>
            </div>
            <div class="character-body">
                <div class="heart">💔</div>
            </div>
        </div>
        <h3 class="quit-title">Goodbye! 😢</h3>
        <p class="quit-message">
            Come back anytime! We'll miss you! 💚
        </p>
    `;
    
    // Redirect after a short delay
    setTimeout(() => {
        // Try to go back to the main quiz page or homepage
        if (window.history.length > 1) {
            window.history.back();
        } else {
            // If no history, try to go to a main page
            window.location.href = '../html/index.html';
        }
    }, 2000);
}

// Initialize everything when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    initParticles();
    initLucideIcons();
    startCountdown();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden') {
        if (timer) {
            clearInterval(timer);
        }
        if (countdownTimer) {
            clearInterval(countdownTimer);
        }
    } else if (document.visibilityState === 'visible') {
        // Resume timers if quiz is active
        if (document.getElementById('question-container').classList.contains('active') && !timer) {
            startTimer();
        }
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (document.getElementById('question-container').classList.contains('active')) {
        // Number keys 1-4 for option selection
        if (e.key >= '1' && e.key <= '4') {
            const optionIndex = parseInt(e.key) - 1;
            const options = document.querySelectorAll('.option');
            if (options[optionIndex] && !options[optionIndex].classList.contains('disabled')) {
                selectOption(optionIndex);
            }
        }
        
        // Enter key to submit
        if (e.key === 'Enter') {
            const submitBtn = document.getElementById('submit-btn');
            if (submitBtn && submitBtn.style.display !== 'none') {
                submitBtn.click();
            }
        }
        
        // Space bar for next question (after answering)
        if (e.key === ' ' && timer === null) {
            e.preventDefault();
            const submitBtn = document.getElementById('submit-btn');
            if (submitBtn.textContent === 'Next Question' || submitBtn.textContent === 'Show Score') {
                submitBtn.click();
            }
        }
    }
    
    // Escape key to show quit dialog
    if (e.key === 'Escape') {
        const quitDialog = document.getElementById('quit-dialog');
        if (quitDialog.classList.contains('active')) {
            hideQuitConfirmation();
        } else {
            showQuitConfirmation();
        }
    }
});

// Add smooth transitions and animations
function addAnimationEffects() {
    const style = document.createElement('style');
    style.textContent = `
        .question-container.entering {
            animation: slideInUp 0.5s ease-out;
        }
        
        .question-container.leaving {
            animation: slideOutDown 0.3s ease-in;
        }
        
        @keyframes slideInUp {
            from {
                transform: translateY(30px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutDown {
            from {
                transform: translateY(0);
                opacity: 1;
            }
            to {
                transform: translateY(-30px);
                opacity: 0;
            }
        }
        
        .option-enter {
            animation: optionSlideIn 0.3s ease-out forwards;
        }
        
        @keyframes optionSlideIn {
            from {
                transform: translateX(-20px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}

// Enhanced question display with animations
function showQuestionWithAnimation() {
    const questionContainer = document.getElementById('question-container');
    questionContainer.classList.add('entering');
    
    setTimeout(() => {
        questionContainer.classList.remove('entering');
    }, 500);
    
    // Animate options one by one
    const options = document.querySelectorAll('.option');
    options.forEach((option, index) => {
        option.style.animationDelay = `${index * 100}ms`;
        option.classList.add('option-enter');
    });
}

// Sound effects (optional - can be enabled if audio files are provided)
function playSound(type) {
    // Uncomment and add audio files if needed
    /*
    const audio = new Audio();
    switch(type) {
        case 'correct':
            audio.src = 'sounds/correct.mp3';
            break;
        case 'wrong':
            audio.src = 'sounds/wrong.mp3';
            break;
        case 'tick':
            audio.src = 'sounds/tick.mp3';
            break;
    }
    audio.play().catch(e => console.log('Audio play failed:', e));
    */
}

// Local storage for progress tracking (if needed in future)
function saveProgress() {
    const progress = {
        currentSet: currentSet,
        totalScore: totalScore,
        questionsAnswered: questionsAnswered,
        timestamp: Date.now()
    };
    // localStorage.setItem('quizProgress', JSON.stringify(progress));
}

function loadProgress() {
    // const saved = localStorage.getItem('quizProgress');
    // if (saved) {
    //     const progress = JSON.parse(saved);
    //     // Restore progress if needed
    // }
}

// Performance monitoring
let performanceMetrics = {
    startTime: null,
    questionTimes: [],
    totalTime: 0
};

function trackQuestionTime(questionIndex) {
    const now = Date.now();
    if (performanceMetrics.startTime) {
        const timeSpent = now - performanceMetrics.startTime;
        performanceMetrics.questionTimes[questionIndex] = timeSpent;
    }
    performanceMetrics.startTime = now;
}

// Initialize animations
addAnimationEffects();

// Add focus management for better accessibility
function manageFocus() {
    // Focus on first option when question loads
    setTimeout(() => {
        const firstOption = document.querySelector('.option');
        if (firstOption) {
            firstOption.focus();
        }
    }, 100);
}

// Enhanced error handling
window.addEventListener('error', function(e) {
    console.error('Quiz error:', e.error);
    // Could show user-friendly error message here
});

// Prevent accidental page refresh
window.addEventListener('beforeunload', function(e) {
    if (timer || countdownTimer) {
        e.preventDefault();
        e.returnValue = 'Are you sure you want to leave? Your progress will be lost.';
    }
});
