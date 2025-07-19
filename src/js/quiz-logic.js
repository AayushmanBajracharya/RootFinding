// Quiz state
const quizState = {
    currentQuestion: 0,
    score: 0,
    timeLeft: 30,
    timer: null,
    countdownTimer: null,
    selectedAnswer: null,
    totalScore: 0,
    questionsAnswered: 0,
    currentSet: 0,
    questionsPerSet: 9,
    totalSets: 5,
    organizedQuestions: []
};

function startCountdown() {
    const countdownElement = document.querySelector('.countdown-number');
    const countdownContainer = document.getElementById('countdown-container');
    const questionContainer = document.getElementById('question-container');
    const setInfo = document.getElementById('set-info');
    
    let count = 10;
    countdownElement.textContent = count;
    
    // Organize questions if not already done
    if (quizState.organizedQuestions.length === 0) {
        quizState.organizedQuestions = organizeQuestions(allQuestions);
    }
    
    quizState.countdownTimer = setInterval(() => {
        count--;
        countdownElement.textContent = count;
        
        countdownElement.classList.remove('pulse');
        void countdownElement.offsetWidth;
        countdownElement.classList.add('pulse');
        
        if (count <= 0) {
            clearInterval(quizState.countdownTimer);
            
            // Hide countdown
            countdownContainer.classList.remove('active');
            countdownContainer.style.display = 'none';
            
            // Show question container
            questionContainer.style.display = 'flex';
            questionContainer.classList.add('active');
            
            // Show set info
            setInfo.style.display = 'block';
            startQuiz();
        }
    }, 1000);
}

function showQuestion() {
    const startIndex = quizState.currentSet * quizState.questionsPerSet;
    const currentQ = quizState.organizedQuestions[startIndex + quizState.currentQuestion];
    
    if (!currentQ) {
        console.error('No question found');
        return;
    }

    const questionElement = document.querySelector('.question');
    const optionsContainer = document.querySelector('.options');
    const submitButton = document.getElementById('submit-btn');
    
    // Update question display
    questionElement.textContent = currentQ.question;
    optionsContainer.innerHTML = '';
    quizState.selectedAnswer = null;
    
    // Create options
    currentQ.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        optionDiv.textContent = option;
        optionDiv.style.setProperty('--index', index);
        optionDiv.addEventListener('click', () => selectOption(index, optionDiv));
        optionsContainer.appendChild(optionDiv);
    });

    // Update set info and progress
    const setInfo = document.getElementById('set-info');
    setInfo.style.display = 'block';
    setInfo.textContent = `Set ${quizState.currentSet + 1} of ${quizState.totalSets} - Question ${quizState.currentQuestion + 1} of ${quizState.questionsPerSet}`;
    
    // Update progress bar
    const progress = ((quizState.currentQuestion + 1) / quizState.questionsPerSet) * 100;
    document.querySelector('.progress').style.width = `${progress}%`;
}

function startQuiz() {
    quizState.currentQuestion = 0;
    quizState.score = 0;
    
    const questionContainer = document.getElementById('question-container');
    const scoreContainer = document.getElementById('score-container');
    const setInfo = document.getElementById('set-info');
    
    questionContainer.style.display = 'flex';
    scoreContainer.style.display = 'none';
    setInfo.style.display = 'block';
    
    showQuestion();
    startTimer();
}

function selectOption(index, optionDiv) {
    // Remove selection from other options
    document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
    
    // Select this option
    optionDiv.classList.add('selected');
    quizState.selectedAnswer = index;
}

function startTimer() {
    if (quizState.timer) clearInterval(quizState.timer);
    
    quizState.timeLeft = 30;
    updateTimerDisplay();
    
    quizState.timer = setInterval(() => {
        quizState.timeLeft--;
        updateTimerDisplay();
        
        if (quizState.timeLeft <= 0) {
            clearInterval(quizState.timer);
            nextQuestion();
        }
    }, 1000);
}

function updateTimerDisplay() {
    document.querySelector('.timer').textContent = quizState.timeLeft + 's';
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    startCountdown();
});
