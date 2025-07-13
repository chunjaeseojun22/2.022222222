// --- 퀴즈 데이터 및 상태 ---
const quizzes = {
    roof: { title: "비밀번호 안전 퀴즈", question: "개인정보를 보호하기 위해, 여러 사이트에서 다르게 설정하고 주기적으로 변경해야 하는 이것은 무엇일까요?", answer: "비밀번호" },
    window: { title: "피싱 공격 예방 퀴즈", question: "유명 기관이나 지인을 사칭하여 개인정보나 금융정보를 빼내는 온라인 사기 수법을 무엇이라고 할까요? (OO 공격)", answer: "피싱" },
    book: { title: "보안 프로그램 퀴즈", question: "컴퓨터에 악성코드가 설치되는 것을 막거나 치료해주는 필수 보안 프로그램을 무엇이라고 부를까요? (OO 프로그램)", answer: "백신" }
};
const solvedState = { roof: false, window: false, book: false };

// --- HTML 요소 가져오기 ---
const clickableObjects = document.querySelectorAll('.clickable-object');
const quizModal = document.getElementById('quiz-modal');
const quizTitle = document.getElementById('quiz-title');
const quizQuestion = document.getElementById('quiz-question');
const quizAnswer = document.getElementById('quiz-answer');
const submitButton = document.getElementById('submit-answer');
const quizResult = document.getElementById('quiz-result');

// --- 수정된 부분: 성공 모달 대신 엔딩 크레딧 컨테이너 ---
const endingCreditContainer = document.getElementById('ending-credit-container');
// ----------------------------------------------------
const restartButton = document.getElementById('restart-button');

let currentQuizKey = '';
let currentAnswer = '';

// --- 미니게임 요소 및 상태 변수 ---
const minigameTrigger = document.getElementById('minigame-trigger');
const minigameModal = document.getElementById('minigame-modal');
const startGameButton = document.getElementById('start-game-button');
const gameArea = document.getElementById('game-area');
const gameTarget = document.getElementById('game-target');
const gameScoreDisplay = document.getElementById('game-score');
const gameTimeDisplay = document.getElementById('game-time');
const gameResult = document.getElementById('game-result');
let score = 0, timeLeft = 15, targetScore = 10, gameInterval = null, isGameActive = false;

// ===== 퀴즈 로직 =====
clickableObjects.forEach(object => {
    object.addEventListener('click', () => {
        const quizKey = object.dataset.quiz;
        if (solvedState[quizKey]) return;
        currentQuizKey = quizKey;
        const quizData = quizzes[quizKey];
        currentAnswer = quizData.answer;
        quizTitle.textContent = quizData.title;
        quizQuestion.textContent = quizData.question;
        quizAnswer.value = '';
        quizResult.textContent = '';
        quizModal.style.display = 'block';
    });
});

submitButton.addEventListener('click', () => {
    if (quizAnswer.value.trim().toLowerCase() === currentAnswer.toLowerCase()) {
        quizResult.textContent = "정답입니다! 🎉";
        quizResult.style.color = 'green';
        solvedState[currentQuizKey] = true;
        document.getElementById(currentQuizKey).classList.add('solved');
        setTimeout(() => {
            quizModal.style.display = 'none';
            checkGameCompletion();
        }, 1500);
    } else {
        quizResult.textContent = `틀렸어요! 정답은 '${currentAnswer}'입니다.`;
        quizResult.style.color = 'red';
    }
});

// --- 수정된 부분: 게임 완료 시 엔딩 크레딧 표시 ---
function checkGameCompletion() {
    if (Object.values(solvedState).every(state => state === true)) {
        // 엔딩 크레딧 컨테이너를 표시합니다.
        endingCreditContainer.style.display = 'block';
    }
}
// ----------------------------------------------

// --- 수정된 부분: 재시작 버튼 로직 ---
restartButton.addEventListener('click', () => {
    // 엔딩 크레딧 컨테이너를 숨깁니다.
    endingCreditContainer.style.display = 'none';
    
    // 크레딧 애니메이션을 초기화하기 위해 내용을 잠시 비웠다가 다시 채웁니다.
    // 이렇게 하지 않으면 두 번째 실행 시 애니메이션이 동작하지 않을 수 있습니다.
    const creditContent = document.querySelector('.credit-content');
    const originalContent = creditContent.innerHTML;
    creditContent.innerHTML = '';
    // 약간의 딜레이 후 내용을 다시 채워넣어 애니메이션이 다시 시작되도록 합니다.
    setTimeout(() => { creditContent.innerHTML = originalContent; }, 50);

    // 게임 상태 초기화
    for (const key in solvedState) {
        solvedState[key] = false;
    }
    clickableObjects.forEach(object => object.classList.remove('solved'));
    minigameTrigger.style.display = 'block';
});
// ------------------------------------

// ===== 미니게임 로직 =====
minigameTrigger.addEventListener('click', () => {
    minigameModal.style.display = 'block';
    resetGame();
});
startGameButton.addEventListener('click', () => { startGame(); });
gameTarget.addEventListener('click', () => {
    if (!isGameActive) return;
    score++;
    gameScoreDisplay.textContent = score;
    if (score >= targetScore) endGame(true); else moveTarget();
});
function startGame() {
    resetGame();
    isGameActive = true;
    gameTarget.style.display = 'block';
    startGameButton.style.display = 'none';
    gameResult.textContent = '';
    moveTarget();
    gameInterval = setInterval(() => {
        timeLeft--;
        gameTimeDisplay.textContent = timeLeft;
        if (timeLeft <= 0) endGame(false);
    }, 1000);
}
function endGame(isWin) {
    isGameActive = false;
    clearInterval(gameInterval);
    gameTarget.style.display = 'none';
    startGameButton.style.display = 'block';
    if (isWin) {
        gameResult.textContent = '성공! 유령을 모두 잡았어요! 🏆';
        gameResult.style.color = 'green';
        minigameTrigger.style.display = 'none';
    } else {
        gameResult.textContent = `아깝네요! ${score}마리밖에 못 잡았어요.`;
        gameResult.style.color = 'red';
    }
}
function resetGame() {
    score = 0, timeLeft = 15, isGameActive = false;
    if (gameInterval) clearInterval(gameInterval);
    gameScoreDisplay.textContent = score;
    gameTimeDisplay.textContent = timeLeft;
    startGameButton.style.display = 'block';
    gameTarget.style.display = 'none';
    gameResult.textContent = '';
}
function moveTarget() {
    const randomX = Math.random() * (gameArea.clientWidth - gameTarget.clientWidth);
    const randomY = Math.random() * (gameArea.clientHeight - gameTarget.clientHeight);
    gameTarget.style.left = `${randomX}px`;
    gameTarget.style.top = `${randomY}px`;
}

// ===== 공용 모달 닫기 로직 =====
document.querySelectorAll('.close-button').forEach(button => {
    button.addEventListener('click', () => {
        button.closest('.modal').style.display = 'none';
        if (isGameActive) endGame(false);
    });
});
window.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
        if (isGameActive) endGame(false);
    }
});
