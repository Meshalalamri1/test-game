// Initial data
let gameData = {
  topics: [
    {
      id: 1,
      title: "عالم الساعات",
      image: "", 
      questions: [
        { points: 200, text: "ما هي أشهر ماركة ساعات سويسرية؟", answer: "رولكس (Rolex)", answered: false },
        { points: 200, text: "ما اسم أول ساعة رقمية في العالم؟", answer: "هاميلتون بالسار (Hamilton Pulsar)", answered: false },
        { points: 400, text: "في أي عام صنعت أول ساعة يد؟", answer: "عام 1868", answered: false },
        { points: 400, text: "ما هي الساعة التي استخدمها رواد الفضاء في مهمة أبولو 11؟", answer: "أوميغا سبيدماستر (Omega Speedmaster)", answered: false },
        { points: 600, text: "ما هو مصطلح 'توربيون' في صناعة الساعات؟", answer: "آلية تدور لمكافحة تأثير الجاذبية على دقة الساعة", answered: false },
        { points: 600, text: "ما اسم أول ساعة ذكية تم إنتاجها تجارياً؟", answer: "سيكو بالسار (Seiko Pulsar)", answered: false }
      ]
    },
    {
      id: 2,
      title: "أهل البر",
      image: "", 
      questions: [
        { points: 200, text: "ما هو اسم البيت التقليدي المصنوع من الشعر في البادية؟", answer: "بيت الشعر", answered: false },
        { points: 200, text: "ما اسم مهرجان الإبل السنوي في السعودية؟", answer: "مهرجان الملك عبدالعزيز للإبل", answered: false },
        { points: 400, text: "ما هي القبيلة العربية التي اشتهرت بتربية الإبل منذ مئات السنين؟", answer: "قبيلة شمر", answered: false },
        { points: 400, text: "ما هو النوع المفضل من القهوة لدى أهل البادية؟", answer: "القهوة العربية (السادة)", answered: false },
        { points: 600, text: "ما هي الطريقة التقليدية للبحث عن الماء في الصحراء؟", answer: "اتباع النباتات الصحراوية وآثار الحيوانات", answered: false },
        { points: 600, text: "ما هو الفن الشعري البدوي الذي يتغنى به الشعراء في المناسبات؟", answer: "النبطي", answered: false }
      ]
    },
    {
      id: 3,
      title: "أهل البحر",
      image: "", 
      questions: [
        { points: 200, text: "ما اسم المركب الشراعي التقليدي الذي اشتهر به أهل الخليج؟", answer: "البوم", answered: false },
        { points: 200, text: "ما هي مهنة الغوص التقليدية في الخليج العربي؟", answer: "الغوص على اللؤلؤ", answered: false },
        { points: 400, text: "ما اسم الآلة الموسيقية التي استخدمها البحارة للغناء أثناء الإبحار؟", answer: "المرواس", answered: false },
        { points: 400, text: "ما هو النوع الأكثر قيمة من اللؤلؤ في الخليج العربي؟", answer: "اللؤلؤ الدانة", answered: false },
        { points: 600, text: "ما اسم القائد البحري الذي يقود السفينة في رحلات الغوص التقليدية؟", answer: "النوخذة", answered: false },
        { points: 600, text: "ما هي الطريقة التقليدية لصيد السمك المسماة بـ 'الحضرة'؟", answer: "بناء حواجز من سعف النخيل على الشاطئ لاصطياد الأسماك عند انحسار المد", answered: false }
      ]
    },
    {
      id: 4,
      title: "محطات التاريخ",
      image: "", 
      questions: [
        { points: 200, text: "في أي عام تم توحيد المملكة العربية السعودية؟", answer: "1932", answered: false },
        { points: 200, text: "من هو مؤسس الدولة السعودية الأولى؟", answer: "الإمام محمد بن سعود", answered: false },
        { points: 400, text: "ما اسم المعركة التي انتصر فيها صلاح الدين الأيوبي على الصليبيين؟", answer: "معركة حطين", answered: false },
        { points: 400, text: "في أي عام تم اكتشاف النفط في المملكة العربية السعودية؟", answer: "1938", answered: false },
        { points: 600, text: "ما اسم المعاهدة التي وقعها الملك عبدالعزيز مع بريطانيا عام 1915؟", answer: "معاهدة دارين", answered: false },
        { points: 600, text: "من هو القائد المسلم الذي فتح الأندلس؟", answer: "طارق بن زياد", answered: false }
      ]
    },
    {
      id: 5,
      title: "عواصم",
      image: "", 
      questions: [
        { points: 200, text: "ما هي عاصمة المملكة الأردنية الهاشمية؟", answer: "عمّان", answered: false },
        { points: 200, text: "ما هي أقدم عاصمة في العالم ما زالت مأهولة؟", answer: "دمشق", answered: false },
        { points: 400, text: "ما هي العاصمة الإدارية للاتحاد الأوروبي؟", answer: "بروكسل", answered: false },
        { points: 400, text: "ما هي عاصمة نيوزيلندا؟", answer: "ويلينغتون", answered: false },
        { points: 600, text: "ما هي العاصمة التي بناها بطرس الأكبر في روسيا؟", answer: "سانت بطرسبرغ", answered: false },
        { points: 600, text: "ما هي العاصمة التي تضم أكبر عدد من الجسور في العالم؟", answer: "هامبورغ", answered: false }
      ]
    },
    {
      id: 6,
      title: "خرائط",
      image: "", 
      questions: [
        { points: 200, text: "ما هي أكبر قارة في العالم؟", answer: "آسيا", answered: false },
        { points: 200, text: "ما هو الاسم القديم لسريلانكا؟", answer: "سيلان", answered: false },
        { points: 400, text: "ما هي الدولة التي تحدها دولة واحدة فقط؟", answer: "البرتغال", answered: false },
        { points: 400, text: "ما هو المضيق الذي يفصل بين آسيا وأمريكا الشمالية؟", answer: "مضيق بيرنغ", answered: false },
        { points: 600, text: "ما هي الدولة التي لديها أكبر عدد من الحدود البرية مع دول أخرى؟", answer: "الصين وروسيا (لكل منهما 14 دولة مجاورة)", answered: false },
        { points: 600, text: "ما هي الدولة الوحيدة في العالم التي تقع داخل دولة أخرى؟", answer: "الفاتيكان (داخل إيطاليا)", answered: false }
      ]
    }
  ],
  teams: [
    { id: 1, name: "فريق 1", score: 0 },
    { id: 2, name: "فريق 2", score: 0 }
  ]
};

// DOM Elements
const gameBoard = document.getElementById('game-board');
const modal = document.getElementById('question-modal');
const closeBtn = document.querySelector('.close');
const questionText = document.getElementById('question-text');
const answerText = document.getElementById('answer-text');
const showAnswerBtn = document.getElementById('show-answer');
const questionCategory = document.getElementById('question-category');
const timerElement = document.getElementById('timer');
const team1ScoreElement = document.getElementById('team1-score');
const team2ScoreElement = document.getElementById('team2-score');
const awardTeam1Btn = document.getElementById('award-team1');
const awardTeam2Btn = document.getElementById('award-team2');
const awardPointsElements = document.querySelectorAll('[id^="award-points"]');
const questionMedia = document.getElementById('question-media');
const switchTurnButton = document.getElementById('switch-turn'); 


// Variables for game state
let currentQuestion = null;
let timerInterval = null;
let currentTeamTurn = 0; 

// Initialize the game
function initGame() {
  loadGameData();
  renderGameBoard();
  setupEventListeners();
  updateScores();
  updateTeamNames();
  addSwitchTurnButton(); 
}

// Update team names in the game
function updateTeamNames() {
  if (gameData.teams && gameData.teams.length >= 2) {
    document.getElementById('game-title').textContent = `${gameData.teams[0].name} ضد ${gameData.teams[1].name}`;
    document.getElementById('award-team1').innerHTML = `${gameData.teams[0].name} <span id="award-points"></span> نقطة`;
    document.getElementById('award-team2').innerHTML = `${gameData.teams[1].name} <span id="award-points2"></span> نقطة`;
    updateTeamTurn();
  }
}

// تحديث الفريق الذي لديه الدور
function updateTeamTurn() {
  const team1Element = document.querySelector('.team1');
  const team2Element = document.querySelector('.team2');
  const currentTeamName = document.getElementById('current-team-name');
  const bodyElement = document.body;

  team1Element.classList.remove('current-turn');
  team2Element.classList.remove('current-turn');
  bodyElement.classList.remove('team1-turn', 'team2-turn');

  if (currentTeamTurn === 0) {
    team1Element.classList.add('current-turn');
    bodyElement.classList.add('team1-turn');
    if (currentTeamName) {
      currentTeamName.style.opacity = 0;
      setTimeout(() => {
        currentTeamName.textContent = gameData.teams[0].name;
        currentTeamName.style.opacity = 1;
      }, 200);
    }
  } else {
    team2Element.classList.add('current-turn');
    bodyElement.classList.add('team2-turn');
    if (currentTeamName) {
      currentTeamName.style.opacity = 0;
      setTimeout(() => {
        currentTeamName.textContent = gameData.teams[1].name;
        currentTeamName.style.opacity = 1;
      }, 200);
    }
  }
}

// ثابت - استخدام البيانات المعرفة مسبقًا فقط
function loadGameData() {
  // استخدام البيانات المعرفة مسبقًا في المتغير gameData
  console.log("تم تحميل بيانات اللعبة المحددة مسبقًا");
}

// لا حاجة للحفظ حيث أننا نستخدم بيانات ثابتة
function saveGameData() {
  console.log("تم إيقاف حفظ البيانات في وضع العرض التجريبي");
}

// Render the game board
function renderGameBoard() {
  gameBoard.innerHTML = '';
  let topicsToShow = [];

  if (gameData.activeTopics && gameData.activeTopics.length > 0) {
    topicsToShow = gameData.topics.filter(topic => {
      return gameData.activeTopics.includes(Number(topic.id));
    });
  } else {
    topicsToShow = gameData.topics.slice(0, 6);
  }

  if (topicsToShow.length === 0) {
    topicsToShow = gameData.topics.slice(0, 6);
  }

  topicsToShow.forEach(topic => {
    const topicColumn = document.createElement('div');
    topicColumn.className = 'topic-column';
    const topicTitle = document.createElement('div');
    topicTitle.className = 'topic-title';
    topicTitle.innerHTML = `<div>${topic.title}</div>`; 
    topicColumn.appendChild(topicTitle);
    const pointValues = [200, 400, 600];

    pointValues.forEach(points => {
      const pointQuestions = topic.questions.filter(q => q.points === points);
      for (let i = 0; i < 2; i++) {
        const questionCard = document.createElement('div');
        questionCard.className = 'question-card';
        questionCard.textContent = points;
        if (i < pointQuestions.length) {
          const question = pointQuestions[i];
          if (question.answered) {
            questionCard.className = 'question-card answered';
          } else {
            questionCard.dataset.topicId = topic.id;
            questionCard.dataset.questionId = topic.questions.indexOf(question);
            questionCard.addEventListener('click', () => openQuestion(topic, question));
          }
        } else {
          questionCard.className = 'question-card empty';
        }
        topicColumn.appendChild(questionCard);
      }
    });
    gameBoard.appendChild(topicColumn);
  });
}

// Setup event listeners
function setupEventListeners() {
  closeBtn.addEventListener('click', closeModal);
  showAnswerBtn.addEventListener('click', revealAnswer);
  awardTeam1Btn.addEventListener('click', () => awardPoints(0));
  awardTeam2Btn.addEventListener('click', () => awardPoints(1));
  document.getElementById('award-none').addEventListener('click', () => awardPoints(-1));
  const scorePlusButtons = document.querySelectorAll('.score-plus');
  scorePlusButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      gameData.teams[index].score += 100;
      updateScores();
      saveGameData();
    });
  });
  const scoreMinusButtons = document.querySelectorAll('.score-minus');
  scoreMinusButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      gameData.teams[index].score = Math.max(0, gameData.teams[index].score - 100);
      updateScores();
      saveGameData();
    });
  });
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
}

// Open question modal
function openQuestion(topic, question) {
  currentQuestion = { topic, question };
  questionCategory.textContent = topic.title;
  questionText.textContent = question.text;
  answerText.textContent = question.answer;
  answerText.classList.add('hidden');
  questionMedia.innerHTML = ''; 
  questionMedia.classList.remove('hidden');
  
  // إخفاء مؤشر الفريق الحالي عند فتح السؤال
  const currentTeamIndicator = document.querySelector('.current-team-indicator');
  if (currentTeamIndicator) {
    currentTeamIndicator.style.display = 'none';
  }
  
  updateTeamTurn();

  // التأكد من عرض Modal في أعلى الصفحة
  modal.scrollTop = 0;

  if (question.mediaType && question.mediaUrl) {
    const isDataUrl = question.mediaUrl.startsWith('data:');
    switch (question.mediaType) {
      case 'image':
        questionMedia.innerHTML = `<img src="${question.mediaUrl}" alt="صورة السؤال" class="question-media-content" loading="eager">`;
        break;
      case 'video':
        if (isDataUrl) {
          questionMedia.innerHTML = `
            <video class="question-media-content" controls>
              <source src="${question.mediaUrl}" type="video/mp4">
              متصفحك لا يدعم تشغيل الفيديو
            </video>`;
        } else {
          questionMedia.innerHTML = `
            <video class="question-media-content" controls>
              <source src="${question.mediaUrl}" type="video/mp4">
              متصفحك لا يدعم تشغيل الفيديو
            </video>`;
        }
        break;
      case 'audio':
        if (isDataUrl) {
          questionMedia.innerHTML = `
            <audio class="question-media-content" controls>
              <source src="${question.mediaUrl}">
              متصفحك لا يدعم تشغيل الصوت
            </audio>
            <div class="audio-placeholder">
              <i class="fas fa-volume-up"></i>
              <span>ملف صوتي</span>
            </div>`;
        } else {
          questionMedia.innerHTML = `
            <audio class="question-media-content" controls>
              <source src="${question.mediaUrl}" type="audio/mpeg">
              متصفحك لا يدعم تشغيل الصوت
            </audio>
            <div class="audio-placeholder">
              <i class="fas fa-volume-up"></i>
              <span>ملف صوتي</span>
            </div>`;
        }
        break;
    }
    questionMedia.classList.add('has-media');
    questionText.classList.add('with-media');

    // إضافة تأخير قبل تشغيل الوسائط
    setTimeout(() => {
      const mediaElement = questionMedia.querySelector('video, audio');
      if (mediaElement) {
        mediaElement.play().catch(e => {
          console.log('Auto-play prevented:', e);
        });
      }

      // التأكد من أن المحتوى المرئي لا يتجاوز حدود الصفحة
      setTimeout(() => {
        const modalContent = document.querySelector('.modal-content');
        if (modalContent) {
          modalContent.scrollTop = 0;
        }
      }, 100);
    }, 500);
  } else {
    questionMedia.classList.remove('has-media');
    questionText.classList.remove('with-media');
  }

  awardPointsElements.forEach(el => {
    el.textContent = question.points;
  });

  modal.style.display = 'block';
  startTimer();
  showAnswerBtn.disabled = false;
}

// Close question modal
function closeModal() {
  modal.style.display = 'none';
  clearInterval(timerInterval);
  
  // إظهار مؤشر الفريق الحالي مرة أخرى بعد إغلاق السؤال
  const currentTeamIndicator = document.querySelector('.current-team-indicator');
  if (currentTeamIndicator) {
    currentTeamIndicator.style.display = 'flex';
  }
}

// Start timer (increases from 0 with no maximum limit)
function startTimer() {
  clearInterval(timerInterval);
  let currentSeconds = 0;
  timerElement.textContent = currentSeconds;
  timerInterval = setInterval(() => {
    currentSeconds++;
    timerElement.textContent = currentSeconds;
  }, 1000);
}

// Reveal answer
function revealAnswer() {
  // التأكد من أن نص الإجابة موجود قبل إظهاره
  if (currentQuestion && currentQuestion.question) {
    answerText.textContent = currentQuestion.question.answer;
  }
  answerText.classList.remove('hidden');
  // إخفاء الوسائط عند إظهار الإجابة
  questionMedia.classList.add('hidden');
  showAnswerBtn.disabled = true;
}

// Award points to a team - في وضع العرض التجريبي لا يتم تغيير حالة السؤال
function awardPoints(teamIndex) {
  if (!currentQuestion) return;
  // لا نغير حالة السؤال لإبقائه متاحًا للاستخدام المتكرر
  // currentQuestion.question.answered = true;
  if (teamIndex !== -1) {
    gameData.teams[teamIndex].score += currentQuestion.question.points;
    alert(`تم إضافة ${currentQuestion.question.points} نقطة إلى ${gameData.teams[teamIndex].name}`);
  } else {
    alert("لم يتم إضافة نقاط لأي فريق");
  }
  currentTeamTurn = 1 - currentTeamTurn;
  updateScores();
  updateTeamTurn();
  closeModal();
  // نعيد رسم اللوحة بدون تغيير حالة الأسئلة
  renderGameBoard();
}

// Update award points elements
function updateAwardButtons() {
  if (currentQuestion) {
    awardPointsElements.forEach(el => {
      el.textContent = currentQuestion.question.points;
    });
  }
}

// Update scores display
function updateScores() {
  team1ScoreElement.textContent = gameData.teams[0].score;
  team2ScoreElement.textContent = gameData.teams[1].score;
}

// Function to switch turns manually
function switchTurn() {
  currentTeamTurn = 1 - currentTeamTurn;
  updateTeamTurn();
}

// ربط الزر الموجود في HTML بوظيفة تغيير الدور
function addSwitchTurnButton() {
  if (switchTurnButton) {
    switchTurnButton.addEventListener('click', switchTurn);
  }
}

// إظهار وإخفاء شاشة البداية
function handleSplashScreen() {
  const splashScreen = document.getElementById('splash-screen');
  
  // عرض شاشة البداية لمدة 3 ثوانٍ ثم إخفاؤها
  setTimeout(() => {
    if (splashScreen) {
      splashScreen.style.opacity = '0';
      setTimeout(() => {
        splashScreen.style.display = 'none';
      }, 500); // إخفاء العنصر بعد انتهاء التلاشي
    }
  }, 3000); // 3 ثوانٍ
}

// Initialize when page loads
window.addEventListener('DOMContentLoaded', () => {
  handleSplashScreen();
  initGame();
});