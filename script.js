// 퀴즈 데이터 정의
const quizzes = {
    roof: { title: "지붕 퀴즈", question: "세상에서 가장 높은 곳에 있는 집은?", answer: "옥탑방" },
    window: { title: "창문 퀴즈", question: "컴퓨터 운영체제(OS) 이름이기도 한 이것은 무엇일까요? (한글로)", answer: "윈도우" },
    book: { title: "마법서 퀴즈", question: "해리포터가 가장 처음 배운 마법 주문은? (영어로)", answer: "Wingardium Leviosa" }
};

// --- 추가된 부분: 퀴즈 해결 상태 관리 ---
const solvedState = {
    roof: false,
    window: false,
    book: false
};
// ------------------------------------

// HTML 요소 가져오기
const clickableObjects = document.querySelectorAll('.clickable-object');
const modal = document.getElementById('quiz-modal');
const closeButton = document.querySelector('.close-button');
const quizTitle = document.getElementById('quiz-title');
const quizQuestion = document.getElementById('quiz-question');
const quizAnswer = document.getElementById('quiz-answer');
const submitButton = document.getElementById('submit-answer');
const quizResult = document.getElementById('quiz-result');

// --- 추가된 부분: 성공 모달 및 재시작 버튼 요소 가져오기 ---
const successModal = document.getElementById('success-modal');
const restartButton = document.getElementById('restart-button');
// --------------------------------------------------

let currentQuizKey = ''; // 현재 어떤 퀴즈를 풀고 있는지 식별
let currentAnswer = '';

// 각 오브젝트에 클릭 이벤트 리스너 추가
clickableObjects.forEach(object => {
    object.addEventListener('click', () => {
        const quizKey = object.dataset.quiz;

        // 이미 푼 문제는 다시 열리지 않도록 함
        if (solvedState[quizKey]) {
            return;
        }

        currentQuizKey = quizKey; // 현재 푸는 퀴즈의 키 저장
        const quizData = quizzes[quizKey];
        currentAnswer = quizData.answer;

        quizTitle.textContent = quizData.title;
        quizQuestion.textContent = quizData.question;
        quizAnswer.value = '';
        quizResult.textContent = '';
        modal.style.display = 'block';
    });
});

// 정답 확인 버튼 클릭 이벤트
submitButton.addEventListener('click', () => {
    const userAnswer = quizAnswer.value;

    if (userAnswer.trim().toLowerCase() === currentAnswer.toLowerCase()) {
        quizResult.textContent = "정답입니다! 🎉";
        quizResult.style.color = 'green';
        
        // --- 추가/수정된 부분: 정답 처리 로직 ---
        solvedState[currentQuizKey] = true; // 해결 상태를 true로 변경
        document.getElementById(currentQuizKey).classList.add('solved'); // 'solved' 클래스 추가

        // 1.5초 후에 모달을 닫고, 게임 완료 여부 확인
        setTimeout(() => {
            modal.style.display = 'none';
            checkGameCompletion();
        }, 1500);
        // ------------------------------------

    } else {
        quizResult.textContent = `틀렸어요! 정답은 '${currentAnswer}'입니다.`;
        quizResult.style.color = 'red';
    }
});

// --- 추가된 부분: 게임 완료 여부 확인 함수 ---
function checkGameCompletion() {
    // solvedState의 모든 값이 true인지 확인
    const allSolved = Object.values(solvedState).every(state => state === true);

    if (allSolved) {
        successModal.style.display = 'block'; // 모든 문제를 풀었으면 성공 모달 표시
    }
}
// ---------------------------------------

// --- 추가된 부분: 재시작 버튼 이벤트 리스너 ---
restartButton.addEventListener('click', () => {
    successModal.style.display = 'none'; // 성공 모달 닫기

    // 모든 상태 초기화
    for (const key in solvedState) {
        solvedState[key] = false;
    }

    // 모든 오브젝트에서 'solved' 클래스 제거
    clickableObjects.forEach(object => {
        object.classList.remove('solved');
    });
});
// -----------------------------------------

// 닫기 버튼 클릭 시 모달 숨기기
closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

// 모달 외부 클릭 시 모달 숨기기
window.addEventListener('click', (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});