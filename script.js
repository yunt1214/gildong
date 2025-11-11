// 다크모드 토글 기능
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

// localStorage에서 다크모드 설정 불러오기
const isDarkMode = localStorage.getItem('darkMode') === 'true';

// 페이지 로드 시 저장된 다크모드 설정 적용
if (isDarkMode) {
    body.classList.add('dark-mode');
    darkModeToggle.textContent = '☀️ 라이트모드';
}

// 다크모드 토글 버튼 클릭 이벤트
darkModeToggle.addEventListener('click', function() {
    body.classList.toggle('dark-mode');
    
    // 다크모드 상태에 따라 버튼 텍스트 변경
    if (body.classList.contains('dark-mode')) {
        darkModeToggle.textContent = '☀️ 라이트모드';
        localStorage.setItem('darkMode', 'true');
    } else {
        darkModeToggle.textContent = '🌙 다크모드';
        localStorage.setItem('darkMode', 'false');
    }
});

// 폰트 크기 조절 기능
const fontDecreaseBtn = document.getElementById('fontDecrease');
const fontIncreaseBtn = document.getElementById('fontIncrease');

// 폰트 크기 레벨 정의
const fontSizes = ['font-small', 'font-normal', 'font-large', 'font-xlarge'];
const defaultFontSize = 'font-normal';

// localStorage에서 폰트 크기 설정 불러오기
let currentFontSize = localStorage.getItem('fontSize') || defaultFontSize;

// 페이지 로드 시 저장된 폰트 크기 설정 적용
body.classList.add(currentFontSize);

// 폰트 크기 조절 함수
function adjustFontSize(direction) {
    const currentIndex = fontSizes.indexOf(currentFontSize);
    let newIndex;
    
    if (direction === 'increase') {
        newIndex = Math.min(currentIndex + 1, fontSizes.length - 1);
    } else {
        newIndex = Math.max(currentIndex - 1, 0);
    }
    
    // 기존 폰트 크기 클래스 제거
    body.classList.remove(...fontSizes);
    
    // 새로운 폰트 크기 클래스 추가
    currentFontSize = fontSizes[newIndex];
    body.classList.add(currentFontSize);
    
    // localStorage에 저장
    localStorage.setItem('fontSize', currentFontSize);
}

// 버튼 클릭 이벤트
fontIncreaseBtn.addEventListener('click', function() {
    adjustFontSize('increase');
});

fontDecreaseBtn.addEventListener('click', function() {
    adjustFontSize('decrease');
});

// 일기 저장 관련 변수 및 함수
const STORAGE_KEY = 'diaryEntries';
const diaryForm = document.getElementById('diaryFormElement');
const diaryListContainer = document.getElementById('diaryListContainer');
const diaryModal = document.getElementById('diaryModal');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');
const modalContent = document.getElementById('modalContent');
const closeModalBtn = document.getElementById('closeModal');

// localStorage에서 일기 목록 가져오기
function getDiaries() {
    const diariesJson = localStorage.getItem(STORAGE_KEY);
    return diariesJson ? JSON.parse(diariesJson) : [];
}

// localStorage에 일기 저장하기
function saveDiary(diary) {
    const diaries = getDiaries();
    // 고유 ID 생성 (타임스탬프 사용)
    diary.id = Date.now().toString();
    diary.createdAt = new Date().toISOString();
    diaries.unshift(diary); // 최신 일기가 위에 오도록
    localStorage.setItem(STORAGE_KEY, JSON.stringify(diaries));
}

// 일기 목록 표시하기
function displayDiaries() {
    const diaries = getDiaries();
    diaryListContainer.innerHTML = '';

    if (diaries.length === 0) {
        diaryListContainer.innerHTML = '<div class="empty-message">저장된 일기가 없습니다. 첫 번째 일기를 작성해보세요!</div>';
        return;
    }

    diaries.forEach(diary => {
        const diaryItem = document.createElement('div');
        diaryItem.className = 'diary-item';
        diaryItem.dataset.id = diary.id;

        // 날짜 포맷팅
        const dateObj = new Date(diary.date);
        const formattedDate = dateObj.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // 내용 미리보기 (최대 50자)
        const preview = diary.content.length > 50 
            ? diary.content.substring(0, 50) + '...' 
            : diary.content;

        diaryItem.innerHTML = `
            <div class="diary-item-title">${diary.title}</div>
            <div class="diary-item-date">${formattedDate}</div>
            <div class="diary-item-preview">${preview}</div>
        `;

        // 클릭 시 상세 보기
        diaryItem.addEventListener('click', () => {
            showDiaryDetail(diary);
        });

        diaryListContainer.appendChild(diaryItem);
    });
}

// 일기 상세 보기 모달 표시
function showDiaryDetail(diary) {
    const dateObj = new Date(diary.date);
    const formattedDate = dateObj.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    });

    modalTitle.textContent = diary.title;
    modalDate.textContent = formattedDate;
    modalContent.textContent = diary.content;
    diaryModal.classList.add('active');
}

// 모달 닫기
function closeModal() {
    diaryModal.classList.remove('active');
}

// 폼 제출 이벤트 처리
diaryForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const title = document.getElementById('title').value.trim();
    const date = document.getElementById('date').value;
    const content = document.getElementById('content').value.trim();

    if (!title || !date || !content) {
        alert('모든 필드를 입력해주세요.');
        return;
    }

    // 일기 저장
    const diary = {
        title: title,
        date: date,
        content: content
    };

    saveDiary(diary);

    // 폼 초기화
    diaryForm.reset();

    // 목록 새로고침
    displayDiaries();

    // 저장 완료 알림
    alert('일기가 저장되었습니다!');
});

// 모달 닫기 버튼 이벤트
closeModalBtn.addEventListener('click', closeModal);

// 모달 배경 클릭 시 닫기
diaryModal.addEventListener('click', function(e) {
    if (e.target === diaryModal) {
        closeModal();
    }
});

// ESC 키로 모달 닫기
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && diaryModal.classList.contains('active')) {
        closeModal();
    }
});

// 네비게이션 메뉴 이벤트
document.getElementById('navHome').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('diaryForm').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('navWrite').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('diaryForm').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('navList').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('diaryList').scrollIntoView({ behavior: 'smooth' });
});

// 페이지 로드 시 일기 목록 표시
window.addEventListener('DOMContentLoaded', function() {
    displayDiaries();
    // 오늘 날짜를 기본값으로 설정
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
});

