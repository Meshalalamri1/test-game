// DOM Elements
const dashboardNav = document.querySelector('.dashboard-nav');
const dashboardSections = document.querySelectorAll('.dashboard-section');

// Topic form elements
const addTopicForm = document.getElementById('add-topic-form');
const topicTitleInput = document.getElementById('topic-title');
const topicImageInput = document.getElementById('topic-image');
const topicsTable = document.getElementById('topics-table').querySelector('tbody');

// Question form elements
const addQuestionForm = document.getElementById('add-question-form');
const questionTopicSelect = document.getElementById('question-topic');
const questionPointsSelect = document.getElementById('question-points');
const questionTextInput = document.getElementById('question-text');
const questionAnswerInput = document.getElementById('question-answer');
const filterTopicSelect = document.getElementById('filter-topic');
const questionsTable = document.getElementById('questions-table').querySelector('tbody');

// Team form elements
const updateTeamsForm = document.getElementById('update-teams-form');
const teamsContainer = document.getElementById('teams-container');

// Game Management elements
const gameTeamsContainer = document.getElementById('game-teams-container');
const topicSelectionContainer = document.getElementById('topic-selection-container');
const saveGameSettingsBtn = document.getElementById('save-game-settings');

// Reset buttons
const resetScoresBtn = document.getElementById('reset-scores');
const resetAnswersBtn = document.getElementById('reset-answers');
const resetAllBtn = document.getElementById('reset-all');
const restoreDefaultTopicsBtn = document.getElementById('restore-topics'); // Added button

// Game data
let gameData = {
  topics: [],
  teams: [],
  activeTopics: [] // IDs of topics to display in the game
};

// Initialize the dashboard
function initDashboard() {
  loadGameData();
  setupEventListeners();
  renderTopicsTable();
  renderQuestionTopicSelect();
  renderFilterTopicSelect();
  renderQuestionsTable();
  renderTeamsForm();
  renderGameManagement();

  // Ensure we have teams data
  if (!gameData.teams || gameData.teams.length === 0) {
    gameData.teams = [
      { id: 1, name: "فريق 1", score: 0 },
      { id: 2, name: "فريق 2", score: 0 }
    ];
    saveGameData();
  }

  // Initialize activeTopics if empty
  if (!gameData.activeTopics || gameData.activeTopics.length === 0) {
    // By default, use all topic IDs (up to 6)
    gameData.activeTopics = gameData.topics.slice(0, 6).map(topic => topic.id);
    saveGameData();
  }
}

// Load game data from localStorage
function loadGameData() {
  const savedData = localStorage.getItem('gameData');
  if (savedData) {
    gameData = JSON.parse(savedData);
  } else {
    // Initialize with default data if nothing is saved
    gameData = {
      topics: [],
      teams: [
        { id: 1, name: "فريق 1", score: 0 },
        { id: 2, name: "فريق 2", score: 0 }
      ]
    };
  }
}

// Save game data to localStorage
function saveGameData() {
  localStorage.setItem('gameData', JSON.stringify(gameData));
}

// Google Gemini API Key (يجب أن تضعها في مكان آمن في الإنتاج)
const GEMINI_API_KEY = "AIzaSyAf-5Km13EuT5AtE8DHRHPsUEQd5b8pTWk";
// Gemini API URL - استخدام الإصدار والنموذج الصحيح
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// Setup event listeners
function setupEventListeners() {
  // Dashboard navigation
  dashboardNav.addEventListener('click', (e) => {
    if (e.target.classList.contains('nav-btn')) {
      const sectionName = e.target.dataset.section;

      // Update active button
      document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      e.target.classList.add('active');

      // Show selected section
      dashboardSections.forEach(section => {
        section.classList.remove('active');
      });
      document.getElementById(`${sectionName}-section`).classList.add('active');
    }
  });

  // Add topic form
  addTopicForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addTopic();
  });

  // Add question form
  addQuestionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addQuestion();
  });

  // Filter topics for questions
  filterTopicSelect.addEventListener('change', () => {
    renderQuestionsTable();
  });

  // Update teams form
  updateTeamsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    updateTeams();
  });

  // Game settings form
  saveGameSettingsBtn.addEventListener('click', saveGameSettings);

  // Reset buttons
  resetScoresBtn.addEventListener('click', resetScores);
  resetAnswersBtn.addEventListener('click', resetAnswers);
  resetAllBtn.addEventListener('click', resetAll);
  restoreDefaultTopicsBtn.addEventListener('click', restoreDefaultTopics);

  // حذف المكررات
  document.getElementById('remove-duplicate-topics').addEventListener('click', removeTopicDuplicates);
  document.getElementById('remove-duplicate-questions').addEventListener('click', removeQuestionDuplicates);

  // AI Question Generator buttons
  document.getElementById('toggle-ai-section').addEventListener('click', toggleAISection);
  document.getElementById('ai-topic-select').addEventListener('change', updateAITopicInput);
  document.getElementById('generate-easy').addEventListener('click', () => generateAIQuestions(200));
  document.getElementById('generate-medium').addEventListener('click', () => generateAIQuestions(400));
  document.getElementById('generate-hard').addEventListener('click', () => generateAIQuestions(600));
  document.getElementById('generate-all').addEventListener('click', generateAllCategories);
  document.getElementById('save-ai-questions').addEventListener('click', saveAIQuestions);
}

// Render topics table
function renderTopicsTable() {
  topicsTable.innerHTML = '';

  gameData.topics.forEach((topic, index) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${topic.title}</td>
      <td class="action-cell">
        <button class="edit-btn" data-id="${topic.id}">تعديل</button>
        <button class="delete-btn" data-id="${topic.id}">حذف</button>
      </td>
    `;

    // Edit topic
    row.querySelector('.edit-btn').addEventListener('click', () => {
      editTopic(topic);
    });

    // Delete topic
    row.querySelector('.delete-btn').addEventListener('click', () => {
      deleteTopic(topic.id);
    });

    topicsTable.appendChild(row);
  });
}

// Render question topic select
function renderQuestionTopicSelect() {
  questionTopicSelect.innerHTML = '';

  gameData.topics.forEach(topic => {
    const option = document.createElement('option');
    option.value = topic.id;
    option.textContent = topic.title;
    questionTopicSelect.appendChild(option);
  });
}

// Render filter topic select
function renderFilterTopicSelect() {
  // Keep the "All topics" option
  filterTopicSelect.innerHTML = '<option value="all">جميع المواضيع</option>';

  gameData.topics.forEach(topic => {
    const option = document.createElement('option');
    option.value = topic.id;
    option.textContent = topic.title;
    filterTopicSelect.appendChild(option);
  });
}

// Render questions table
function renderQuestionsTable() {
  questionsTable.innerHTML = '';

  const selectedTopicId = filterTopicSelect.value;

  gameData.topics.forEach(topic => {
    if (selectedTopicId !== 'all' && topic.id.toString() !== selectedTopicId) {
      return;
    }

    topic.questions.forEach((question, qIndex) => {
      const row = document.createElement('tr');

      let mediaInfo = 'لا يوجد';
      if (question.mediaType) {
        const mediaTypes = {
          'image': 'صورة',
          'video': 'فيديو',
          'audio': 'صوت'
        };
        mediaInfo = `${mediaTypes[question.mediaType]}`;
      }

      row.innerHTML = `
        <td>${topic.title}</td>
        <td>${question.points}</td>
        <td>${question.text}</td>
        <td>${question.answer}</td>
        <td>${mediaInfo}</td>
        <td class="action-cell">
          <button class="edit-btn" data-topic-id="${topic.id}" data-question-index="${qIndex}">تعديل</button>
          <button class="delete-btn" data-topic-id="${topic.id}" data-question-index="${qIndex}">حذف</button>
        </td>
      `;

      // Edit question
      row.querySelector('.edit-btn').addEventListener('click', () => {
        editQuestion(topic.id, qIndex);
      });

      // Delete question
      row.querySelector('.delete-btn').addEventListener('click', () => {
        deleteQuestion(topic.id, qIndex);
      });

      questionsTable.appendChild(row);
    });
  });
}

// Render teams form
function renderTeamsForm() {
  teamsContainer.innerHTML = '';

  gameData.teams.forEach((team, index) => {
    const teamGroup = document.createElement('div');
    teamGroup.className = 'form-group';

    teamGroup.innerHTML = `
      <label for="team-name-${index}">اسم الفريق ${index + 1}</label>
      <input type="text" id="team-name-${index}" value="${team.name}" required>

      <label for="team-score-${index}">نقاط الفريق</label>
      <input type="number" id="team-score-${index}" value="${team.score}" min="0" required>
    `;

    teamsContainer.appendChild(teamGroup);
  });
}

// Add new topic
function addTopic() {
  const title = topicTitleInput.value.trim();

  if (!title) return;

  const newTopic = {
    id: Date.now(),
    title,
    questions: []
  };

  gameData.topics.push(newTopic);
  saveGameData();

  // Reset form
  topicTitleInput.value = '';

  // Update UI
  renderTopicsTable();
  renderQuestionTopicSelect();
  renderFilterTopicSelect();
}

// Edit topic
function editTopic(topic) {
  topicTitleInput.value = topic.title;

  // Remove existing topic
  deleteTopic(topic.id, false);

  // Focus on form for editing
  topicTitleInput.focus();
}

// Delete topic
function deleteTopic(topicId, confirm = true) {
  if (confirm && !window.confirm('هل أنت متأكد من حذف هذا الموضوع؟')) {
    return;
  }

  gameData.topics = gameData.topics.filter(topic => topic.id !== topicId);
  saveGameData();

  // Update UI
  renderTopicsTable();
  renderQuestionTopicSelect();
  renderFilterTopicSelect();
  renderQuestionsTable();
}

// Add new question
function addQuestion() {
  const topicId = parseInt(questionTopicSelect.value);
  const points = parseInt(questionPointsSelect.value);
  const text = questionTextInput.value.trim();
  const answer = questionAnswerInput.value.trim();
  const mediaType = document.getElementById('media-type').value;
  const mediaUrl = document.getElementById('media-url').value.trim();

  if (!topicId || !points || !text || !answer) return;

  // Validate media URL if media type is selected
  if (mediaType && !mediaUrl) {
    alert('الرجاء إدخال رابط للوسائط المختارة');
    return;
  }

  // Validate URL format
  if (mediaUrl && !isValidUrl(mediaUrl)) {
    alert('الرجاء إدخال رابط صحيح للوسائط');
    return;
  }

  const topicIndex = gameData.topics.findIndex(t => t.id === topicId);

  if (topicIndex === -1) return;

  // Check if we already have two questions with this point value
  const pointQuestions = gameData.topics[topicIndex].questions.filter(q => q.points === points);

  if (pointQuestions.length >= 2) {
    alert(`لا يمكن إضافة أكثر من سؤالين بنفس النقاط (${points}) للموضوع الواحد`);
    return;
  }

  const newQuestion = {
    points,
    text,
    answer,
    answered: false,
    mediaType,
    mediaUrl
  };

  gameData.topics[topicIndex].questions.push(newQuestion);
  saveGameData();

  // Reset form
  questionTextInput.value = '';
  questionAnswerInput.value = '';
  document.getElementById('media-type').value = '';
  document.getElementById('media-url').value = '';
  document.getElementById('media-url-container').style.display = 'none';

  // Update UI
  renderQuestionsTable();
}

// Edit question
function editQuestion(topicId, questionIndex) {
  const topicIndex = gameData.topics.findIndex(t => t.id === topicId);

  if (topicIndex === -1) return;

  const question = gameData.topics[topicIndex].questions[questionIndex];

  // Set form values
  questionTopicSelect.value = topicId;
  questionPointsSelect.value = question.points;
  questionTextInput.value = question.text;
  questionAnswerInput.value = question.answer;

  const mediaTypeSelect = document.getElementById('media-type');
  const mediaUrlContainer = document.getElementById('media-url-container');
  const mediaUrlInput = document.getElementById('media-url');

  mediaTypeSelect.value = question.mediaType || '';

  if (question.mediaType && question.mediaUrl) {
    mediaUrlContainer.style.display = 'block';
    mediaUrlInput.value = question.mediaUrl;
  } else {
    mediaUrlContainer.style.display = 'none';
    mediaUrlInput.value = '';
  }

  // Remove question
  deleteQuestion(topicId, questionIndex, false);

  // Focus on form for editing
  questionTextInput.focus();
}

// Setup additional event listeners
document.addEventListener('DOMContentLoaded', function() {
  // Show/hide media URL input based on media type selection
  const mediaTypeSelect = document.getElementById('media-type');
  const mediaUrlContainer = document.getElementById('media-url-container');
  const mediaUploadInput = document.getElementById('media-upload');
  const mediaUrlInput = document.getElementById('media-url');
  const uploadStatus = document.getElementById('upload-status');

  mediaTypeSelect.addEventListener('change', function() {
    if (this.value) {
      mediaUrlContainer.style.display = 'block';
    } else {
      mediaUrlContainer.style.display = 'none';
    }
  });

  // Handle file upload and convert to Data URL
  mediaUploadInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type based on selected media type
    const mediaType = mediaTypeSelect.value;
    let isValidType = false;

    if (mediaType === 'image' && file.type.startsWith('image/')) {
      isValidType = true;
    } else if (mediaType === 'video' && file.type.startsWith('video/')) {
      isValidType = true;
    } else if (mediaType === 'audio' && file.type.startsWith('audio/')) {
      isValidType = true;
    }

    if (!isValidType) {
      alert(`الرجاء اختيار ملف من نوع ${mediaType}`);
      return;
    }

    uploadStatus.textContent = 'جاري التحميل...';

    const reader = new FileReader();
    reader.onload = function(event) {
      // Store the Data URL in the URL input
      mediaUrlInput.value = event.target.result;
      uploadStatus.textContent = 'تم التحميل بنجاح!';
    };
    reader.onerror = function() {
      uploadStatus.textContent = 'حدث خطأ أثناء التحميل';
    };
    reader.readAsDataURL(file);
  });
});

// Delete question
function deleteQuestion(topicId, questionIndex, confirm = true) {
  if (confirm && !window.confirm('هل أنت متأكد من حذف هذا السؤال؟')) {
    return;
  }

  const topicIndex = gameData.topics.findIndex(t => t.id === topicId);

  if (topicIndex === -1) return;

  // Remove question at specified index
  gameData.topics[topicIndex].questions.splice(questionIndex, 1);
  saveGameData();

  // Update UI
  renderQuestionsTable();
}

// Update teams
function updateTeams() {
  for (let i = 0; i < gameData.teams.length; i++) {
    const nameInput = document.getElementById(`team-name-${i}`);
    const scoreInput = document.getElementById(`team-score-${i}`);

    if (nameInput && scoreInput) {
      gameData.teams[i].name = nameInput.value.trim();
      gameData.teams[i].score = parseInt(scoreInput.value) || 0;
    }
  }

  saveGameData();

  // Update game title to reflect team names
  document.getElementById('game-title').textContent = `${gameData.teams[0].name} ضد ${gameData.teams[1].name}`;

  alert('تم حفظ بيانات الفرق بنجاح');
}

// Reset scores
function resetScores() {
  if (!window.confirm('هل أنت متأكد من إعادة ضبط نقاط جميع الفرق إلى صفر؟')) {
    return;
  }

  gameData.teams.forEach(team => {
    team.score = 0;
  });

  saveGameData();
  alert('تم إعادة ضبط نقاط الفرق بنجاح');
  renderTeamsForm();
}

// Reset answers (so questions can be asked again)
function resetAnswers() {
  if (!window.confirm('هل أنت متأكد من إعادة ضبط حالة جميع الأسئلة؟')) {
    return;
  }

  gameData.topics.forEach(topic => {
    topic.questions.forEach(question => {
      question.answered = false;
    });
  });

  saveGameData();
  alert('تم إعادة ضبط حالة الأسئلة بنجاح');
}

// Reset all game data
function resetAll() {
  if (!window.confirm('تحذير: سيتم حذف جميع بيانات اللعبة! هل أنت متأكد من المتابعة؟')) {
    return;
  }

  // Confirm again for safety
  if (!window.confirm('هل أنت متأكد بشكل قاطع؟ لا يمكن التراجع عن هذا الإجراء!')) {
    return;
  }

  localStorage.removeItem('gameData');

  // Reset to default data
  gameData = {
    topics: [],
    teams: [
      { id: 1, name: "فريق 1", score: 0 },
      { id: 2, name: "فريق 2", score: 0 }
    ]
  };

  alert('تم إعادة ضبط جميع بيانات اللعبة بنجاح');

  // Update all UI
  renderTopicsTable();
  renderQuestionTopicSelect();
  renderFilterTopicSelect();
  renderQuestionsTable();
  renderTeamsForm();
}

// حذف المواضيع المكررة
function removeTopicDuplicates() {
  // تخزين العناوين الفريدة التي تمت معالجتها
  const uniqueTitles = new Set();
  // قائمة بالمواضيع الفريدة
  const uniqueTopics = [];

  // تحقق من كل موضوع
  for (const topic of gameData.topics) {
    // إذا لم يكن هناك موضوع بنفس العنوان، أضفه إلى القائمة الفريدة
    if (!uniqueTitles.has(topic.title.toLowerCase())) {
      uniqueTitles.add(topic.title.toLowerCase());
      uniqueTopics.push(topic);
    } else {
      console.log(`تم حذف موضوع مكرر: ${topic.title}`);
    }
  }

  // تحديث قائمة المواضيع
  gameData.topics = uniqueTopics;

  // حفظ التغييرات
  saveGameData();

  // تحديث واجهة المستخدم
  renderTopicsTable();
  renderQuestionTopicSelect();
  renderFilterTopicSelect();
  renderQuestionsTable();
}

// حذف الأسئلة المكررة داخل نفس الموضوع
function removeQuestionDuplicates() {
  // تكرار لكل موضوع
  for (const topic of gameData.topics) {
    // تخزين نصوص الأسئلة الفريدة التي تمت معالجتها
    const uniqueQuestionsText = new Set();
    // قائمة بالأسئلة الفريدة
    const uniqueQuestions = [];

    // تحقق من كل سؤال
    for (const question of topic.questions) {
      // استخدم نص السؤال كمفتاح فريد
      if (!uniqueQuestionsText.has(question.text.toLowerCase())) {
        uniqueQuestionsText.add(question.text.toLowerCase());
        uniqueQuestions.push(question);
      } else {
        console.log(`تم حذف سؤال مكرر في موضوع ${topic.title}: ${question.text}`);
      }
    }

    // تحديث قائمة الأسئلة للموضوع
    topic.questions = uniqueQuestions;
  }

  // حفظ التغييرات
  saveGameData();

  // تحديث واجهة المستخدم
  renderQuestionsTable();
}

// Restore default topics
function restoreDefaultTopics() {
  if (!window.confirm('هل تريد استعادة المواضيع الافتراضية؟ سيتم إضافتها بجانب المواضيع الحالية')) {
    return;
  }

  const defaultTopics = [
    {
      id: Date.now() + 1,
      title: "عالم الساعات",
      questions: [
        { points: 200, text: "ما هي أشهر ماركة ساعات سويسرية؟", answer: "رولكس (Rolex)", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Rolex_logo.svg/800px-Rolex_logo.svg.png" },
        { points: 200, text: "ما اسم أول ساعة رقمية في العالم؟", answer: "هاميلتون بالسار (Hamilton Pulsar)", answered: false, mediaType: "", mediaUrl: "" },
        { points: 400, text: "في أي عام صنعت أول ساعة يد؟", answer: "عام 1868", answered: false, mediaType: "", mediaUrl: "" },
        { points: 400, text: "ما هي الساعة التي استخدمها رواد الفضاء في مهمة أبولو 11؟", answer: "أوميغا سبيدماستر (Omega Speedmaster)", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/0/04/Buzz_Aldrin_Apollo_Spacesuit.jpg" },
        { points: 600, text: "ما هو مصطلح 'توربيون' في صناعة الساعات؟", answer: "آلية تدور لمكافحة تأثير الجاذبية على دقة الساعة", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Tourbillon_anim.gif/330px-Tourbillon_anim.gif" },
        { points: 600, text: "ما اسم أول ساعة ذكية تم إنتاجها تجارياً؟", answer: "سيكو بالسار (Seiko Pulsar)", answered: false, mediaType: "", mediaUrl: "" }
      ]
    },
    {
      id: Date.now() + 2,
      title: "أهل البر",
      questions: [
        { points: 200, text: "ما هو اسم البيت التقليدي المصنوع من الشعر في البادية؟", answer: "بيت الشعر", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/2/26/Bedouin_tent.jpg" },
        { points: 200, text: "ما اسم مهرجان الإبل السنوي في السعودية؟", answer: "مهرجان الملك عبدالعزيز للإبل", answered: false, mediaType: "", mediaUrl: "" },
        { points: 400, text: "ما هي القبيلة العربية التي اشتهرت بتربية الإبل منذ مئات السنين؟", answer: "قبيلة شمر", answered: false, mediaType: "", mediaUrl: "" },
        { points: 400, text: "ما هو النوع المفضل من القهوة لدى أهل البادية؟", answer: "القهوة العربية (السادة)", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/d/dc/Arabic_coffee.jpg" },
        { points: 600, text: "ما هي الطريقة التقليدية للبحث عن الماء في الصحراء؟", answer: "اتباع النباتات الصحراوية وآثار الحيوانات", answered: false, mediaType: "", mediaUrl: "" },
        { points: 600, text: "ما هو الفن الشعري البدوي الذي يتغنى به الشعراء في المناسبات؟", answer: "النبطي", answered: false, mediaType: "", mediaUrl: "" }
      ]
    },
    {
      id: Date.now() + 3,
      title: "أهل البحر",
      questions: [
        { points: 200, text: "ما اسم المركب الشراعي التقليدي الذي اشتهر به أهل الخليج؟", answer: "البوم", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/8/83/Dow_traditional_Kuwait_wooden_boat.JPG" },
        { points: 200, text: "ما هي مهنة الغوص التقليدية في الخليج العربي؟", answer: "الغوص على اللؤلؤ", answered: false, mediaType: "", mediaUrl: "" },
        { points: 400, text: "ما اسم الآلة الموسيقية التي استخدمها البحارة للغناء أثناء الإبحار؟", answer: "المرواس", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/0/06/Mirwas.jpg" },
        { points: 400, text: "ما هو النوع الأكثر قيمة من اللؤلؤ في الخليج العربي؟", answer: "اللؤلؤ الدانة", answered: false, mediaType: "", mediaUrl: "" },
        { points: 600, text: "ما اسم القائد البحري الذي يقود السفينة في رحلات الغوص التقليدية؟", answer: "النوخذة", answered: false, mediaType: "", mediaUrl: "" },
        { points: 600, text: "ما هي الطريقة التقليدية لصيد السمك المسماة بـ 'الحضرة'؟", answer: "بناء حواجز من سعف النخيل على الشاطئ لاصطياد الأسماك عند انحسار المد", answered: false, mediaType: "", mediaUrl: "" }
      ]
    },
    {
      id: Date.now() + 4,
      title: "محطات التاريخ",
      questions: [
        { points: 200, text: "في أي عام تم توحيد المملكة العربية السعودية؟", answer: "1932", answered: false, mediaType: "", mediaUrl: "" },
        { points: 200, text: "من هو مؤسس الدولة السعودية الأولى؟", answer: "الإمام محمد بن سعود", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Muhammad_bin_Saud.jpg" },
        { points: 400, text: "ما اسم المعركة التي انتصر فيها صلاح الدين الأيوبي على الصليبيين؟", answer: "معركة حطين", answered: false, mediaType: "", mediaUrl: "" },
        { points: 400, text: "في أي عام تم اكتشاف النفط في المملكة العربية السعودية؟", answer: "1938", answered: false, mediaType: "", mediaUrl: "" },
        { points: 600, text: "ما اسم المعاهدة التي وقعها الملك عبدالعزيز مع بريطانيا عام 1915؟", answer: "معاهدة دارين", answered: false, mediaType: "", mediaUrl: "" },
        { points: 600, text: "من هو القائد المسلم الذي فتح الأندلس؟", answer: "طارق بن زياد", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Moorish_Gibraltar_%28Gibraltar_Museum%29.jpg/800px-Moorish_Gibraltar_%28Gibraltar_Museum%29.jpg" }
      ]
    },
    {
      id: Date.now() + 5,
      title: "عواصم",
      questions: [
        { points: 200, text: "ما هي عاصمة المملكة الأردنية الهاشمية؟", answer: "عمّان", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Amman_Skyline.jpg" },
        { points: 200, text: "ما هي أقدم عاصمة في العالم ما زالت مأهولة؟", answer: "دمشق", answered: false, mediaType: "", mediaUrl: "" },
        { points: 400, text: "ما هي العاصمة الإدارية للاتحاد الأوروبي؟", answer: "بروكسل", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Bruxelles_Grand-Place_Zoom.jpg" },
        { points: 400, text: "ما هي عاصمة نيوزيلندا؟", answer: "ويلينغتون", answered: false, mediaType: "", mediaUrl: "" },
        { points: 600, text: "ما هي العاصمة التي بناها بطرس الأكبر في روسيا؟", answer: "سانت بطرسبرغ", answered: false, mediaType: "", mediaUrl: "" },
        { points: 600, text: "ما هي العاصمة التي تضم أكبر عدد من الجسور في العالم؟", answer: "هامبورغ", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/7/72/Hamburg%2C_Speicherstadt%2C_Br%C3%BCcke.jpg" }
      ]
    },
    {
      id: Date.now() + 6,
      title: "خرائط",
      questions: [
        { points: 200, text: "ما هي أكبر قارة في العالم؟", answer: "آسيا", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/8/80/Asia_%28orthographic_projection%29.svg" },
        { points: 200, text: "ما هو الاسم القديم لسريلانكا؟", answer: "سيلان", answered: false, mediaType: "", mediaUrl: "" },
        { points: 400, text: "ما هي الدولة التي تحدها دولة واحدة فقط؟", answer: "البرتغال", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5d/EU-Portugal.svg" },
        { points: 400, text: "ما هو المضيق الذي يفصل بين آسيا وأمريكا الشمالية؟", answer: "مضيق بيرنغ", answered: false, mediaType: "", mediaUrl: "" },
        { points: 600, text: "ما هي الدولة التي لديها أكبر عدد من الحدود البرية مع دول أخرى؟", answer: "الصين وروسيا (لكل منهما 14 دولة مجاورة)", answered: false, mediaType: "", mediaUrl: "" },
        { points: 600, text: "ما هي الدولة الوحيدة في العالم التي تقع داخل دولة أخرى؟", answer: "الفاتيكان (داخل إيطاليا)", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Vatican_City_map_EN.png" }
      ]
    },
    // المواضيع الجديدة تبدأ هنا
    {
      id: Date.now() + 7,
      title: "قصص الأنبياء",
      questions: [
        { points: 200, text: "من هو النبي الذي بنى الفلك؟", answer: "نوح عليه السلام", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/0/03/Noahs_ark.jpg" },
        { points: 200, text: "من هو النبي الذي ألقي في النار ولم تحرقه؟", answer: "إبراهيم عليه السلام", answered: false, mediaType: "", mediaUrl: "" },
        { points: 400, text: "ما اسم الغار الذي كان يتعبد فيه النبي محمد ﷺ قبل البعثة؟", answer: "غار حراء", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Hira_Cave_-_JPEG_Image.jpg" },
        { points: 400, text: "من هو النبي الذي القي في البئر من قبل إخوته؟", answer: "يوسف عليه السلام", answered: false, mediaType: "", mediaUrl: "" },
        { points: 600, text: "كم سنة دعا نوح عليه السلام قومه للإيمان بالله؟", answer: "950 سنة", answered: false, mediaType: "", mediaUrl: "" },
        { points: 600, text: "ما هو الحيوان الذي كلّم النبي سليمان عليه السلام كما ورد في القرآن الكريم؟", answer: "النملة والهدهد", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/5/57/Upupa_epops_-Khao_Yai_National_Park%2C_Thailand-8.jpg" }
      ]
    },
    {
      id: Date.now() + 8,
      title: "معالم إسلامية",
      questions: [
        { points: 200, text: "ما هو أول مسجد بني في الإسلام؟", answer: "مسجد قباء", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/d/dd/Quba_Mosque.jpg" },
        { points: 200, text: "ما هو المسجد الثالث من حيث القدسية في الإسلام؟", answer: "المسجد الأقصى", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Israel-2013-Aerial-Jerusalem-Temple_Mount-Al-Aqsa_Mosque_Panorama.jpg" },
        { points: 400, text: "ما اسم المكان الذي دُفن فيه الرسول ﷺ؟", answer: "الحجرة النبوية", answered: false, mediaType: "", mediaUrl: "" },
        { points: 400, text: "ما اسم البقعة التي وقف عليها النبي ﷺ في خطبة الوداع؟", answer: "جبل عرفات", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/7/76/Jabal_Rahmah.jpg" },
        { points: 600, text: "ما هو المكان الذي حدثت فيه أول معركة في الإسلام؟", answer: "بدر", answered: false, mediaType: "", mediaUrl: "" },
        { points: 600, text: "ما اسم المسجد الذي بناه الصحابة على حدود المدينة المنورة لصد هجوم الأحزاب؟", answer: "مسجد الخندق (مسجد الفتح)", answered: false, mediaType: "", mediaUrl: "" }
      ]
    },
    {
      id: Date.now() + 9,
      title: "أسئلة عامة",
      questions: [
        { points: 200, text: "ما هو أطول نهر في العالم؟", answer: "نهر النيل", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/1/16/River_Nile_from_space.jpg" },
        { points: 200, text: "ما هو أكبر محيط في العالم؟", answer: "المحيط الهادئ", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Pacific_Ocean.png" },
        { points: 400, text: "من هو مخترع المصباح الكهربائي؟", answer: "توماس إديسون", answered: false, mediaType: "", mediaUrl: "" },
        { points: 400, text: "ما هو أكبر كوكب في المجموعة الشمسية؟", answer: "كوكب المشتري", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg" },
        { points: 600, text: "ما اسم الجهاز المستخدم لقياس شدة الزلازل؟", answer: "السيزموغراف", answered: false, mediaType: "", mediaUrl: "" },
        { points: 600, text: "ما هي النسبة الذهبية في الرياضيات والفنون؟", answer: "1.618", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Golden_rectangle.png" }
      ]
    },
    {
      id: Date.now() + 10,
      title: "الرياضة",
      questions: [
        { points: 200, text: "من هو اللاعب الحائز على أكبر عدد من كرات الذهبية في تاريخ كرة القدم؟", answer: "ليونيل ميسي", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c8/Lionel_Messi_WC2022.jpg" },
        { points: 200, text: "ما هي الدولة التي فازت بأكبر عدد من كؤوس العالم في كرة القدم؟", answer: "البرازيل", answered: false, mediaType: "", mediaUrl: "" },
        { points: 400, text: "كم يبلغ عدد لاعبي كرة السلة في الملعب لكل فريق؟", answer: "5 لاعبين", answered: false, mediaType: "", mediaUrl: "" },
        { points: 400, text: "ما هي الرياضة التي تشتهر بها نيوزيلندا ويؤدي لاعبوها رقصة الهاكا قبل المباراة؟", answer: "الرجبي", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/New_Zealand_rugby_match.jpg/800px-New_Zealand_rugby_match.jpg" },
        { points: 600, text: "من هو أسرع إنسان في العالم ويحمل الرقم القياسي في سباق 100 متر؟", answer: "يوسين بولت", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Usain_BOLT_GBR_London_2012.jpg/330px-Usain_BOLT_GBR_London_2012.jpg" },
        { points: 600, text: "كم عدد الحلقات الأولمبية وماذا تمثل؟", answer: "خمس حلقات تمثل القارات الخمس", answered: false, mediaType: "", mediaUrl: "" }
      ]
    },
    {
      id: Date.now() + 11,
      title: "التكنولوجيا",
      questions: [
        { points: 200, text: "من هو مؤسس شركة مايكروسوفت؟", answer: "بيل غيتس", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/0/01/Bill_Gates_World_Economic_Forum_2013.jpg" },
        { points: 200, text: "ما اسم أول حاسوب إلكتروني تم اختراعه؟", answer: "إنياك (ENIAC)", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Eniac.jpg/440px-Eniac.jpg" },
        { points: 400, text: "ما هو البرنامج المستخدم لحماية الحاسوب من الفيروسات؟", answer: "مضاد الفيروسات (Antivirus)", answered: false, mediaType: "", mediaUrl: "" },
        { points: 400, text: "ما هو العملة الرقمية الأكثر شهرة في العالم؟", answer: "البيتكوين (Bitcoin)", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/800px-Bitcoin.svg.png" },
        { points: 600, text: "ما هو مصطلح IoT في عالم التكنولوجيا؟", answer: "إنترنت الأشياء (Internet of Things)", answered: false, mediaType: "", mediaUrl: "" },
        { points: 600, text: "ما هو اسم أول هاتف ذكي يعمل بنظام أندرويد؟", answer: "HTC Dream", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e3/HTC_Dream_Orange_FR.jpeg" }
      ]
    },
    {
      id: Date.now() + 12,
      title: "الطب والصحة",
      questions: [
        { points: 200, text: "ما هو أكبر عضو في جسم الإنسان؟", answer: "الجلد", answered: false, mediaType: "", mediaUrl: "" },
        { points: 200, text: "ما هو العنصر الأكثر وفرة في جسم الإنسان؟", answer: "الأكسجين", answered: false, mediaType: "", mediaUrl: "" },
        { points: 400, text: "ما هو الفيتامين الذي ينتجه الجسم عند التعرض لأشعة الشمس؟", answer: "فيتامين د", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/4/41/Vitamin_D3.svg" },
        { points: 400, text: "كم عدد العظام في جسم الإنسان البالغ؟", answer: "206 عظمة", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Human_skeleton_front_en.svg/330px-Human_skeleton_front_en.svg.png" },
        { points: 600, text: "ما هو الهرمون المسؤول عن الشعور بالسعادة؟", answer: "السيروتونين", answered: false, mediaType: "", mediaUrl: "" },
        { points: 600, text: "ما هو المرض الذي اكتشفه الطبيب ألكسندر فلمنج علاجه بالصدفة؟", answer: "البكتيريا (المضاد الحيوي البنسلين)", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6c/Alexander_Fleming.jpg" }
      ]
    },
    // المواضيع الإضافية الجديدة
    {
      id: Date.now() + 13,
      title: "الفن والثقافة",
      questions: [
        { points: 200, text: "من رسم لوحة الموناليزا؟", answer: "ليوناردو دافنشي", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/405px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg" },
        { points: 200, text: "ما هو الفن الذي اشتهر به بيكاسو؟", answer: "التكعيبية", answered: false, mediaType: "", mediaUrl: "" },
        { points: 400, text: "من هو كاتب رواية الحرب والسلام؟", answer: "ليو تولستوي", answered: false, mediaType: "", mediaUrl: "" },
        { points: 400, text: "ما هو الفن المعماري الذي اشتهرت به الحضارة الإسلامية؟", answer: "فن الزخرفة والأرابيسك", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/5/59/Arabesque_Daud.jpg" },
        { points: 600, text: "من هو المؤلف الموسيقي الألماني الأصم الذي استمر في التأليف بعد فقدان سمعه؟", answer: "لودفيج فان بيتهوفن", answered: false, mediaType: "", mediaUrl: "" },
        { points: 600, text: "ما اسم الفن المسرحي الياباني التقليدي الذي يستخدم الدمى؟", answer: "البونراكو", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/BUNRAKU-no_Puppet.jpg/800px-BUNRAKU-no_Puppet.jpg" }
      ]
    },
    {
      id: Date.now() + 14,
      title: "الطبيعة والحيوانات",
      questions: [
        { points: 200, text: "ما هو أكبر حيوان على وجه الأرض؟", answer: "الحوت الأزرق", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Blue_whale_size.svg/800px-Blue_whale_size.svg.png" },
        { points: 200, text: "ما اسم أسرع حيوان بري في العالم؟", answer: "الفهد", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Cheetah_running.jpg/800px-Cheetah_running.jpg" },
        { points: 400, text: "ما هو الحيوان الذي ينام وإحدى عينيه مفتوحة؟", answer: "الدلفين", answered: false, mediaType: "", mediaUrl: "" },
        { points: 400, text: "ما اسم أعلى قمة جبلية في العالم؟", answer: "قمة إيفرست", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f6/Everest_kalapatthar.jpg" },
        { points: 600, text: "ما هي المدة التي يمكن للجمل أن يعيشها بدون ماء؟", answer: "أسبوعين", answered: false, mediaType: "", mediaUrl: "" },
        { points: 600, text: "ما هو الطائر الوحيد القادر على الطيران للخلف؟", answer: "الطنان", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Trochilidae_Archilochus-colubris_2.jpg/800px-Trochilidae_Archilochus-colubris_2.jpg" }
      ]
    },
    {
      id: Date.now() + 15,
      title: "الفضاء والكواكب",
      questions: [
        { points: 200, text: "ما هو أقرب كوكب إلى الشمس؟", answer: "عطارد", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Mercury_in_true_color.jpg/800px-Mercury_in_true_color.jpg" },
        { points: 200, text: "من هو أول إنسان سار على سطح القمر؟", answer: "نيل أرمسترونج", answered: false, mediaType: "", mediaUrl: "" },
        { points: 400, text: "ما هو اسم المجرة التي تقع فيها الأرض؟", answer: "مجرة درب التبانة", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/236084main_MilkyWay-full-annotated.jpg/800px-236084main_MilkyWay-full-annotated.jpg" },
        { points: 400, text: "ما هو أكبر قمر في النظام الشمسي؟", answer: "جانيميد (قمر المشتري)", answered: false, mediaType: "", mediaUrl: "" },
        { points: 600, text: "ما اسم المركبة الفضائية التي هبطت على المريخ عام 2021؟", answer: "برسفيرانس", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Perseverance_Selfie_at_Rochette_%28cropped%29.jpg/800px-Perseverance_Selfie_at_Rochette_%28cropped%29.jpg" },
        { points: 600, text: "ما هو الثقب الأسود؟", answer: "منطقة ذات جاذبية شديدة في الفضاء لا يمكن للضوء الإفلات منها", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Black_hole_-_Messier_87_crop_max_res.jpg/800px-Black_hole_-_Messier_87_crop_max_res.jpg" }
      ]
    },
    {
      id: Date.now() + 16,
      title: "الطعام والمطبخ",
      questions: [
        { points: 200, text: "ما هي الدولة التي تُنسب إليها الباستا والبيتزا؟", answer: "إيطاليا", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Eq_it-na_pizza-margherita_sep2005_sml.jpg" },
        { points: 200, text: "ما هو أشهر طبق في المطبخ الصيني؟", answer: "البط المقلي (البط البكيني)", answered: false, mediaType: "", mediaUrl: "" },
        { points: 400, text: "ما الفاكهة التي تسمى 'ملكة الفواكه'؟", answer: "المانجوستين", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Mangostan.jpg/800px-Mangostan.jpg" },
        { points: 400, text: "ما هو النوع الوحيد من العسل الذي لا يفسد أبداً؟", answer: "العسل الطبيعي النقي", answered: false, mediaType: "", mediaUrl: "" },
        { points: 600, text: "ما هي التوابل الأغلى في العالم؟", answer: "الزعفران", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Saffron_Crop.JPG/800px-Saffron_Crop.JPG" },
        { points: 600, text: "ما هو القهوة التي تعتبر الأغلى في العالم وتستخرج من برازالحيوانات؟", answer: "قهوة كوبي لواك", answered: false, mediaType: "", mediaUrl: "" }
      ]
    },
    // المواضيع الجديدة المطلوبة
    {
      id: Date.now() + 17,
      title: "إسلاميات",
      questions: [
        { points: 200, text: "كم عدد سور القرآن الكريم؟", answer: "114 سورة", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/3/38/Koran.jpg" },
        { points: 200, text: "من هو النبي الذي اشتهر بدعاء الطائف؟", answer: "محمد صلى الله عليه وسلم", answered: false, mediaType: "", mediaUrl: "" },
        { points: 400, text: "ما هي أول معركة في الإسلام؟", answer: "معركة بدر", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/7/71/Ghazweh.jpg" },
        { points: 400, text: "كم عدد أركان الإسلام؟", answer: "خمسة أركان", answered: false, mediaType: "", mediaUrl: "" },
        { points: 600, text: "من هو أول من جمع القرآن الكريم في مصحف واحد؟", answer: "أبو بكر الصديق رضي الله عنه", answered: false, mediaType: "", mediaUrl: "" },
        { points: 600, text: "ما اسم أول سورة نزلت كاملة على النبي محمد صلى الله عليه وسلم؟", answer: "سورة الفاتحة", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Sura_Fatiha.jpg" }
      ]
    },
    {
      id: Date.now() + 18,
      title: "أسئلة ذكاء",
      questions: [
        { points: 200, text: "شيء يمكنك رؤيته، لكن لا يمكنك لمسه أبداً. ما هو؟", answer: "الظل", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b6/Light_dispersion_of_a_mercury-vapor_lamp_with_a_floodlight_fixture_covered_by_a_14_inch_snow_cover.jpg" },
        { points: 200, text: "شيء يزداد كلما أخذت منه. ما هو؟", answer: "الحفرة", answered: false, mediaType: "", mediaUrl: "" },
        { points: 400, text: "ما هو الشيء الذي يسير بلا أقدام، ويبكي بلا عيون؟", answer: "السحاب", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e2/Cloudy_sky_in_Hong_Kong.jpg" },
        { points: 400, text: "أخ وأخت دائما معاً، لكنهما لا يلتقيان أبداً. من هما؟", answer: "الليل والنهار", answered: false, mediaType: "", mediaUrl: "" },
        { points: 600, text: "ما هو الشيء الذي يتحدث جميع لغات العالم؟", answer: "صدى الصوت", answered: false, mediaType: "", mediaUrl: "" },
        { points: 600, text: "ما هو الشيء الذي كلما زاد نقص؟", answer: "العمر", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/3/31/Astrolabe_throughout_the_ages.jpg" }
      ]
    },
    {
      id: Date.now() + 19,
      title: "شعارات عالمية",
      questions: [
        { points: 200, text: "ما اسم الشركة صاحبة هذا الشعار؟", answer: "أبل (Apple)", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
        { points: 200, text: "ما اسم الشركة صاحبة هذا الشعار؟", answer: "تويوتا (Toyota)", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Toyota_carlogo.svg" },
        { points: 400, text: "ما اسم الشركة صاحبة هذا الشعار؟", answer: "ستاربكس (Starbucks)", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1200px-Starbucks_Corporation_Logo_2011.svg.png" },
        { points: 400, text: "ما اسم الشركة صاحبة هذا الشعار؟", answer: "نايك (Nike)", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg" },
        { points: 600, text: "ما اسم الشركة صاحبة هذا الشعار؟", answer: "شل (Shell)", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/en/e/e8/Shell_logo.svg" },
        { points: 600, text: "ما اسم الشركة صاحبة هذا الشعار؟", answer: "فيراري (Ferrari)", answered: false, mediaType: "image", mediaUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d1/Ferrari-Logo.svg/1200px-Ferrari-Logo.svg.png" }
      ]
    }
  ];

  // Add default topics to the existing topics
  gameData.topics = [...gameData.topics, ...defaultTopics];
  saveGameData();

  alert('تم استعادة المواضيع الافتراضية بنجاح');

  // Update UI
  renderTopicsTable();
  renderQuestionTopicSelect();
  renderFilterTopicSelect();
}

// Render Game Management Section
function renderGameManagement() {
  // Render teams for game management
  renderGameTeamsSection();

  // Render topic selection
  renderTopicSelectionSection();
}

// Render teams for game management
function renderGameTeamsSection() {
  gameTeamsContainer.innerHTML = '';

  gameData.teams.forEach((team, index) => {
    const teamDiv = document.createElement('div');
    teamDiv.className = 'form-group';

    teamDiv.innerHTML = `
      <label for="game-team-name-${index}">اسم الفريق ${index + 1}</label>
      <input type="text" id="game-team-name-${index}" value="${team.name}" required>
    `;

    gameTeamsContainer.appendChild(teamDiv);
  });
}

// Render topic selection
function renderTopicSelectionSection() {
  topicSelectionContainer.innerHTML = '';

  if (gameData.topics.length === 0) {
    topicSelectionContainer.innerHTML = '<p>لا توجد مواضيع متاحة. أضف المواضيع أولاً.</p>';
    return;
  }

  // Initialize activeTopics array if it doesn't exist
  if (!gameData.activeTopics) {
    gameData.activeTopics = [];
  }

  console.log("Active topics when rendering checkboxes:", gameData.activeTopics);

  // Create a checkbox for each topic
  gameData.topics.forEach(topic => {
    const topicDiv = document.createElement('div');
    topicDiv.className = 'topic-checkbox-container';

    // Check if topic.id exists in activeTopics array (convert both to numbers)
    const isChecked = gameData.activeTopics.includes(Number(topic.id));

    topicDiv.innerHTML = `
      <label>
        <input type="checkbox" class="topic-checkbox" data-topic-id="${topic.id}" ${isChecked ? 'checked' : ''}>
        ${topic.title} (ID: ${topic.id})
      </label>
    `;

    topicSelectionContainer.appendChild(topicDiv);
  });

  // Add event listener to limit selection to 6 topics
  const checkboxes = document.querySelectorAll('.topic-checkbox');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const checked = document.querySelectorAll('.topic-checkbox:checked');
      if (checked.length > 6) {
        checkbox.checked = false;
        alert('يمكنك اختيار 6 مواضيع كحد أقصى');
      }
    });
  });
}

// Save game settings
function saveGameSettings() {
  // Update team names
  gameData.teams.forEach((team, index) => {
    const nameInput = document.getElementById(`game-team-name-${index}`);
    if (nameInput) {
      team.name = nameInput.value.trim();
    }
  });

  // Update active topics
  const checkedTopics = document.querySelectorAll('.topic-checkbox:checked');
  gameData.activeTopics = Array.from(checkedTopics).map(checkbox =>
    parseInt(checkbox.dataset.topicId)
  );

  console.log("Saving active topics:", gameData.activeTopics);

  // Make sure we have at least one topic
  if (gameData.activeTopics.length === 0 && gameData.topics.length > 0) {
    alert('يجب اختيار موضوع واحد على الأقل');
    return;
  }

  // Make sure activeTopics is saved properly
  if (!Array.isArray(gameData.activeTopics)) {
    gameData.activeTopics = [];
  }

  // Save data and show confirmation
  saveGameData();
  alert('تم حفظ إعدادات اللعبة بنجاح');

  // Force reload of page to apply changes
  window.location.reload();
}

// Validate URL function
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

// مفتاح قابل للتبديل لإظهار/إخفاء قسم الذكاء الاصطناعي
function toggleAISection() {
  const aiSection = document.getElementById('ai-generator-section');
  const toggleBtn = document.getElementById('toggle-ai-section');

  if (aiSection.classList.contains('hidden')) {
    aiSection.classList.remove('hidden');
    toggleBtn.textContent = 'إخفاء توليد الأسئلة الذكية';
    // تحديث قائمة المواضيع عند فتح القسم
    updateAITopicSelect();
  } else {
    aiSection.classList.add('hidden');
    toggleBtn.textContent = 'توليد أسئلة باستخدام الذكاء الاصطناعي';
  }
}

// تحديث قائمة المواضيع الموجودة في نموذج الذكاء الاصطناعي
function updateAITopicSelect() {
  const topicSelect = document.getElementById('ai-topic-select');
  topicSelect.innerHTML = '<option value="">-- اختر موضوعاً موجوداً أو أدخل موضوعاً جديداً --</option>';

  // إضافة المواضيع الموجودة للقائمة
  gameData.topics.forEach(topic => {
    const option = document.createElement('option');
    option.value = topic.title;
    option.textContent = topic.title;
    topicSelect.appendChild(option);
  });
}

// تحديث حقل الإدخال عند اختيار موضوع من القائمة
function updateAITopicInput() {
  const selectedTopic = document.getElementById('ai-topic-select').value;
  const topicInput = document.getElementById('ai-topic');

  if (selectedTopic) {
    topicInput.value = selectedTopic;
  }
}

// Generate AI Questions using Google Gemini
async function generateAIQuestions(difficulty) {
  const topic = document.getElementById('ai-topic').value.trim();
  const includeImages = document.getElementById('ai-include-images').checked;
  const addDirectly = document.getElementById('ai-add-directly').checked;

  if (!topic) {
    alert('الرجاء إدخال موضوع للأسئلة');
    return;
  }

  // Show loading
  document.getElementById('ai-loading').classList.remove('hidden');
  document.getElementById('ai-result').classList.add('hidden');

  // Set difficulty level description
  let difficultyLevel = '';
  if (difficulty === 200) difficultyLevel = 'سهل';
  else if (difficulty === 400) difficultyLevel = 'متوسط';
  else if (difficulty === 600) difficultyLevel = 'صعب';

  try {
    // Prepare prompt for Gemini API
    let prompt = `أنشئ 3 أسئلة عن "${topic}" بمستوى صعوبة ${difficultyLevel} للعبة مسابقات.
     لكل سؤال، قدم الإجابة الصحيحة أيضًا.`;

    if (includeImages) {
      prompt += `
     أيضاً، قم بإضافة رابط يحتوي على صورة مناسبة من Wikimedia Commons لكل سؤال.
     استجابتك يجب أن تكون بتنسيق JSON فقط، بدون أي شرح إضافي.
     اتبع هذا النموذج تمامًا: 
     [
       {"text": "نص السؤال الأول", "answer": "الإجابة الصحيحة للسؤال الأول", "imageUrl": "رابط الصورة المناسبة للسؤال الأول"}, 
       {"text": "نص السؤال الثاني", "answer": "الإجابة الصحيحة للسؤال الثاني", "imageUrl": "رابط الصورة المناسبة للسؤال الثاني"}, 
       {"text": "نص السؤال الثالث", "answer": "الإجابة الصحيحة للسؤال الثالث", "imageUrl": "رابط الصورة المناسبة للسؤال الثالث"}
     ]`;
    } else {
      prompt += `
     استجابتك يجب أن تكون بتنسيق JSON فقط، بدون أي شرح إضافي.
     اتبع هذا النموذج تمامًا: 
     [
       {"text": "نص السؤال الأول", "answer": "الإجابة الصحيحة للسؤال الأول"}, 
       {"text": "نص السؤال الثاني", "answer": "الإجابة الصحيحة للسؤال الثاني"}, 
       {"text": "نص السؤال الثالث", "answer": "الإجابة الصحيحة للسؤال الثالث"}
     ]`;
    }

    console.log("Sending prompt to Gemini API:", prompt);

    try {
      // Call Gemini API with the correct URL and format
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API response error:", errorText);
        throw new Error(`خطأ في استجابة API: ${response.status}`);
      }

      const data = await response.json();
      console.log("Raw API response:", data);

      if (data.error) {
        throw new Error(data.error.message || 'حدث خطأ في API');
      }

      // تحقق من وجود البيانات المطلوبة في الاستجابة
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('استجابة غير مكتملة من واجهة برمجة Gemini');
      }

      // استخراج النص من استجابة Gemini
      let content = '';
      if (data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
        content = data.candidates[0].content.parts[0].text || '';
      }

      console.log("Gemini API response content:", content);

      // تنظيف النص واستخراج JSON
      let cleanedContent = content.trim();
      
      // إزالة علامات التنسيق للماركداون (أي إزالة ```json و ```)
      cleanedContent = cleanedContent.replace(/```json/g, '').replace(/```/g, '');

      // محاولة استخراج كود JSON
      let jsonData;
      try {
        // محاولة العثور على قوس البداية والنهاية
        const startIndex = cleanedContent.indexOf('[');
        const endIndex = cleanedContent.lastIndexOf(']') + 1;

        if (startIndex >= 0 && endIndex > startIndex) {
          const jsonString = cleanedContent.substring(startIndex, endIndex);
          jsonData = JSON.parse(jsonString);
        } else {
          // محاولة تحليل النص المدخل بأكمله
          jsonData = JSON.parse(cleanedContent);
        }
      } catch (jsonError) {
        console.error("JSON parsing error:", jsonError);
        console.error("Content that failed to parse:", cleanedContent);
        throw new Error('تعذر تحليل البيانات من الذكاء الاصطناعي - تنسيق JSON غير صالح');
      }

      if (!Array.isArray(jsonData)) {
        throw new Error('البيانات المستلمة ليست بتنسيق مصفوفة صالح');
      }

      // التحقق من صحة بنية البيانات
      const validQuestions = jsonData.filter(q => q.text && q.answer);

      if (validQuestions.length === 0) {
        throw new Error('لم يتم العثور على أسئلة صالحة في البيانات المستلمة');
      }

      // تحقق إذا كان يجب إضافة الأسئلة مباشرة
      if (addDirectly) {
        // إضافة الأسئلة مباشرة إلى قاعدة البيانات
        saveAIQuestionsDirectly(validQuestions, difficulty, topic);
      } else {
        // عرض الأسئلة للمستخدم للمراجعة
        displayAIQuestions(validQuestions, difficulty, topic);
      }

    } catch (error) {
      throw error;
    }

  } catch (error) {
    console.error('خطأ في توليد الأسئلة:', error);
    document.getElementById('ai-loading').classList.add('hidden');
    alert('حدث خطأ أثناء توليد الأسئلة: ' + error.message);
  }
}

// Display AI generated questions
function displayAIQuestions(questions, difficulty, topic) {
  const container = document.getElementById('ai-questions-container');
  container.innerHTML = '';

  // Process questions to remove text in parentheses
  const processedQuestions = questions.map(q => {
    // تعديل نص السؤال لإزالة ما بين الأقواس
    const processedText = q.text.replace(/\s*\([^)]*\)\s*/g, '');
    return {
      ...q,
      text: processedText
    };
  });

  // Store processed questions for later saving
  container.dataset.questions = JSON.stringify(processedQuestions);
  container.dataset.difficulty = difficulty;
  container.dataset.topic = topic;

  // Create HTML for each question
  processedQuestions.forEach((question, index) => {
    const questionElement = document.createElement('div');
    questionElement.className = 'ai-question-item';

    let html = `
      <p><strong>السؤال ${index + 1}:</strong> ${question.text}</p>
      <p><strong>الإجابة:</strong> ${question.answer}</p>
    `;

    // إذا كان السؤال يحتوي على صورة، أضفها
    if (question.imageUrl) {
      html += `
        <div class="ai-question-image">
          <img src="${question.imageUrl}" alt="صورة للسؤال ${index + 1}" style="max-width: 100%; max-height: 200px;">
        </div>
      `;
    }

    questionElement.innerHTML = html;
    container.appendChild(questionElement);
  });

  // Hide loading, show results
  document.getElementById('ai-loading').classList.add('hidden');
  document.getElementById('ai-result').classList.remove('hidden');
}

// حفظ الأسئلة مباشرة دون عرضها
function saveAIQuestionsDirectly(questions, difficulty, topic) {
  try {
    // معالجة الأسئلة لإزالة ما بين الأقواس
    const processedQuestions = questions.map(q => {
      const processedText = q.text.replace(/\s*\([^)]*\)\s*/g, '');
      return {
        ...q,
        text: processedText
      };
    });

    // التحقق من وجود الموضوع
    let topicIndex = gameData.topics.findIndex(t => t.title.toLowerCase() === topic.toLowerCase());

    // إذا لم يكن الموضوع موجوداً، قم بإنشائه
    if (topicIndex === -1) {
      const newTopic = {
        id: Date.now(),
        title: topic,
        questions: []
      };

      gameData.topics.push(newTopic);
      topicIndex = gameData.topics.length - 1;
    }

    // عداد للأسئلة التي تم إضافتها
    let addedQuestions = 0;

    // جميع الفئات - difficulty هو null عندما نولد أسئلة لجميع الفئات
    if (difficulty === null) {
      // تصنيف الأسئلة حسب صعوبتها (النقاط)
      const pointsCategories = [200, 400, 600];
      
      // لكل فئة نقاط
      for (const points of pointsCategories) {
        // الأسئلة المولدة لهذه الفئة
        const questionsForCategory = processedQuestions.filter(q => q.points === points);
        
        // التحقق من عدد الأسئلة الموجودة بقيمة النقاط هذه
        const existingPointQuestions = gameData.topics[topicIndex].questions.filter(
          existing => existing.points === points
        );
        
        // عدد الأسئلة التي يمكن إضافتها (حد أقصى سؤالين لكل فئة)
        const availableSlots = 2 - existingPointQuestions.length;
        
        // إضافة الأسئلة المتاحة فقط
        if (availableSlots > 0 && questionsForCategory.length > 0) {
          const questionsToAdd = questionsForCategory.slice(0, availableSlots);
          
          questionsToAdd.forEach(q => {
            const newQuestion = {
              points: points,
              text: q.text,
              answer: q.answer,
              answered: false,
              mediaType: "",
              mediaUrl: ""
            };
            
            // إذا كان السؤال يحتوي على صورة، أضفها
            if (q.imageUrl) {
              newQuestion.mediaType = "image";
              newQuestion.mediaUrl = q.imageUrl;
            }
            
            gameData.topics[topicIndex].questions.push(newQuestion);
            addedQuestions++;
          });
        }
      }
    } 
    // فئة واحدة محددة - difficulty هو قيمة النقاط
    else {
      // التحقق من عدد الأسئلة الموجودة بنفس قيمة النقاط
      const pointQuestions = gameData.topics[topicIndex].questions.filter(
        existing => existing.points === difficulty
      );

      // حساب عدد الأسئلة التي يمكن إضافتها
      const availableSlots = 2 - pointQuestions.length;
      
      if (availableSlots > 0) {
        // إضافة ما يصل إلى العدد المتاح من الأسئلة
        const questionsToAdd = processedQuestions.slice(0, availableSlots);
        
        questionsToAdd.forEach(q => {
          const newQuestion = {
            points: difficulty,
            text: q.text,
            answer: q.answer,
            answered: false,
            mediaType: "",
            mediaUrl: ""
          };

          // إذا كان السؤال يحتوي على صورة، أضفها
          if (q.imageUrl) {
            newQuestion.mediaType = "image";
            newQuestion.mediaUrl = q.imageUrl;
          }

          gameData.topics[topicIndex].questions.push(newQuestion);
          addedQuestions++;
        });
      }
    }

    // حفظ البيانات وتحديث واجهة المستخدم
    saveGameData();

    // إخفاء التحميل
    document.getElementById('ai-loading').classList.add('hidden');

    if (addedQuestions > 0) {
      alert(`تم إضافة ${addedQuestions} سؤال بنجاح في موضوع "${topic}"`);
    } else {
      alert(`لم يتم إضافة أي أسئلة جديدة. قد تكون هناك أسئلة كافية بالفعل في هذا الموضوع.`);
    }

    // تحديث واجهة المستخدم
    renderTopicsTable();
    renderQuestionTopicSelect();
    renderFilterTopicSelect();
    renderQuestionsTable();
    updateAITopicSelect(); // تحديث قائمة المواضيع

    // مسح حقل الموضوع
    document.getElementById('ai-topic').value = '';

  } catch (error) {
    console.error('خطأ في حفظ الأسئلة مباشرة:', error);
    alert('حدث خطأ أثناء حفظ الأسئلة: ' + error.message);
    document.getElementById('ai-loading').classList.add('hidden');
  }
}

// Save AI generated questions to a topic
function saveAIQuestions() {
  const container = document.getElementById('ai-questions-container');
  const questionsData = container.dataset.questions;
  const isAllCategories = container.dataset.allCategories === "true";
  const difficulty = isAllCategories ? null : parseInt(container.dataset.difficulty);
  const topicTitle = container.dataset.topic;

  if (!questionsData) {
    alert('لا توجد أسئلة لحفظها');
    return;
  }

  try {
    // Parse questions data
    const questions = JSON.parse(questionsData);

    if (!Array.isArray(questions) || questions.length === 0) {
      alert('تنسيق الأسئلة غير صالح');
      return;
    }

    // Check if topic exists already
    let topicIndex = gameData.topics.findIndex(t => t.title.toLowerCase() === topicTitle.toLowerCase());

    // If topic doesn't exist, create it
    if (topicIndex === -1) {
      const newTopic = {
        id: Date.now(),
        title: topicTitle,
        questions: []
      };

      gameData.topics.push(newTopic);
      topicIndex = gameData.topics.length - 1;
    }

    // عداد للأسئلة التي تم إضافتها
    let addedQuestions = 0;

    // للأسئلة من جميع الفئات
    if (isAllCategories) {
      // تصنيف الأسئلة حسب صعوبتها
      const questionsByPoints = {
        200: [],
        400: [],
        600: []
      };

      questions.forEach(q => {
        if (q.points in questionsByPoints) {
          questionsByPoints[q.points].push(q);
        }
      });

      // إضافة الأسئلة إلى الموضوع لكل فئة من الصعوبة
      for (const points in questionsByPoints) {
        // التحقق من عدد الأسئلة الموجودة بنفس قيمة النقاط
        const existingPointQuestions = gameData.topics[topicIndex].questions.filter(existing => existing.points === parseInt(points));

        // إضافة أسئلة جديدة فقط إذا كان هناك مساحة للأسئلة من هذه الفئة
        const questionsToAdd = questionsByPoints[points].slice(0, Math.min(2 - existingPointQuestions.length, questionsByPoints[points].length));

        questionsToAdd.forEach(q => {
          const newQuestion = {
            points: parseInt(points),
            text: q.text,
            answer: q.answer,
            answered: false,
            mediaType: "",
            mediaUrl: ""
          };

          // إذا كان السؤال يحتوي على صورة، أضفها
          if (q.imageUrl) {
            newQuestion.mediaType = "image";
            newQuestion.mediaUrl = q.imageUrl;
          }

          gameData.topics[topicIndex].questions.push(newQuestion);
          addedQuestions++;
        });
      }
    }
    // للأسئلة من فئة واحدة
    else {
      // Add questions to the topic
      questions.forEach(q => {
        // Check if we already have two questions with this point value
        const pointQuestions = gameData.topics[topicIndex].questions.filter(existing => existing.points === difficulty);

        if (pointQuestions.length < 2) {
          const newQuestion = {
            points: difficulty,
            text: q.text,
            answer: q.answer,
            answered: false,
            mediaType: "",
            mediaUrl: ""
          };

          // إذا كان السؤال يحتوي على صورة، أضفها
          if (q.imageUrl) {
            newQuestion.mediaType = "image";
            newQuestion.mediaUrl = q.imageUrl;
          }

          gameData.topics[topicIndex].questions.push(newQuestion);
          addedQuestions++;
        }
      });
    }

    // Save and update UI
    saveGameData();

    if (addedQuestions > 0) {
      alert(`تم حفظ ${addedQuestions} سؤال بنجاح في موضوع "${topicTitle}"`);
    } else {
      if (isAllCategories) {
        alert(`لم يتم إضافة أي أسئلة جديدة. ربما تكون هناك أسئلة كافية بالفعل في هذا الموضوع.`);
      } else {
        alert(`لم يتم إضافة أي أسئلة جديدة. هناك بالفعل سؤالان بقيمة ${difficulty} نقطة في هذا الموضوع.`);
      }
    }

    // Update UI
    renderTopicsTable();
    renderQuestionTopicSelect();
    renderFilterTopicSelect();
    renderQuestionsTable();
    updateAITopicSelect(); // تحديث قائمة المواضيع

    // Hide the results
    document.getElementById('ai-result').classList.add('hidden');
    document.getElementById('ai-topic').value = '';

  } catch (error) {
    console.error('خطأ في حفظ الأسئلة:', error);
    alert('حدث خطأ أثناء حفظ الأسئلة: ' + error.message);
  }
}

// Initialize when page loads
window.addEventListener('DOMContentLoaded', initDashboard);

async function generateAllCategories() {
  const topic = document.getElementById('ai-topic').value.trim();
  const includeImages = document.getElementById('ai-include-images').checked;
  const addDirectly = document.getElementById('ai-add-directly').checked;

  if (!topic) {
    alert('الرجاء إدخال موضوع للأسئلة');
    return;
  }

  document.getElementById('ai-loading').classList.remove('hidden');
  document.getElementById('ai-result').classList.add('hidden');

  const allQuestions = [];
  try {
    for (const difficulty of [200, 400, 600]) {
      let prompt = `أنشئ 3 أسئلة عن "${topic}" بمستوى صعوبة `;
      if (difficulty === 200) prompt += 'سهل';
      else if (difficulty === 400) prompt += 'متوسط';
      else if (difficulty === 600) prompt += 'صعب';
      prompt += ` للعبة مسابقات. لكل سؤال، قدم الإجابة الصحيحة أيضًا.`;

      if (includeImages) {
        prompt += `
           أيضاً، قم بإضافة رابط يحتوي على صورة مناسبة من Wikimedia Commons لكل سؤال.
           استجابتك يجب أن تكون بتنسيق JSON فقط، بدون أي شرح إضافي.
           اتبع هذا النموذج تمامًا: 
           [
             {"text": "نص السؤال الأول", "answer": "الإجابة الصحيحة للسؤال الأول", "imageUrl": "رابط الصورة المناسبة للسؤال الأول", "points": ${difficulty}}, 
             {"text": "نص السؤال الثاني", "answer": "الإجابة الصحيحة للسؤال الثاني", "imageUrl": "رابط الصورة المناسبة للسؤال الثاني", "points": ${difficulty}}, 
             {"text": "نص السؤال الثالث", "answer": "الإجابة الصحيحة للسؤال الثالث", "imageUrl": "رابط الصورة المناسبة للسؤال الثالث", "points": ${difficulty}}
           ]`;
      } else {
        prompt += `
           استجابتك يجب أن تكون بتنسيق JSON فقط، بدون أي شرح إضافي.
           اتبع هذا النموذج تمامًا: 
           [
             {"text": "نص السؤال الأول", "answer": "الإجابة الصحيحة للسؤال الأول", "points": ${difficulty}}, 
             {"text": "نص السؤال الثاني", "answer": "الإجابة الصحيحة للسؤال الثاني", "points": ${difficulty}}, 
             {"text": "نص السؤال الثالث", "answer": "الإجابة الصحيحة للسؤال الثالث", "points": ${difficulty}}
           ]`;
      }

      try {
        console.log("Sending prompt to Gemini API:", prompt);
        
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: prompt }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024
            }
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("API response error:", errorText);
          throw new Error(`خطأ في استجابة API: ${response.status}`);
        }

        const data = await response.json();
        console.log("Raw API response:", data);

        if (data.error) {
          throw new Error(data.error.message || 'حدث خطأ في API');
        }

        // تحقق من وجود البيانات المطلوبة في الاستجابة
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
          throw new Error('استجابة غير مكتملة من واجهة برمجة Gemini');
        }

        // استخراج النص من استجابة Gemini
        let content = '';
        if (data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
          content = data.candidates[0].content.parts[0].text || '';
        }

        console.log("Gemini API response content:", content);
        
        // إزالة علامات التنسيق للماركداون (أي إزالة ```json و ```)
        content = content.trim().replace(/```json/g, '').replace(/```/g, '');
        
        // محاولة استخراج كود JSON
        try {
          // محاولة العثور على قوس البداية والنهاية
          const startIndex = content.indexOf('[');
          const endIndex = content.lastIndexOf(']') + 1;
          
          let jsonString;
          if (startIndex >= 0 && endIndex > startIndex) {
            jsonString = content.substring(startIndex, endIndex);
          } else {
            jsonString = content;
          }
          
          const jsonData = JSON.parse(jsonString);
          
          // إضافة النقاط لكل سؤال إذا لم تكن موجودة
          const processedJsonData = jsonData.map(q => {
            if (!q.points) {
              return {...q, points: difficulty};
            }
            return q;
          });
          
          allQuestions.push(...processedJsonData);
        } catch (jsonError) {
          console.error("JSON parsing error in generateAllCategories:", jsonError);
          console.error("Content that failed to parse:", content);
          throw new Error('تعذر تحليل البيانات من الذكاء الاصطناعي - تنسيق JSON غير صالح');
        }

      } catch (apiError) {
        console.error(`Error generating questions for difficulty ${difficulty}:`, apiError);
        // استمرار للصعوبة التالية حتى لو فشلت الحالية
      }
    }

    // التحقق من وجود أسئلة قبل متابعة العملية
    if (allQuestions.length === 0) {
      throw new Error('لم يتم توليد أي أسئلة. الرجاء المحاولة مرة أخرى.');
    }

    if (addDirectly) {
      saveAIQuestionsDirectly(allQuestions, null, topic);
      document.getElementById('ai-questions-container').dataset.allCategories = "true";
    } else {
      displayAIQuestions(allQuestions, null, topic);
      document.getElementById('ai-questions-container').dataset.allCategories = "true";
    }
  } catch (error) {
    console.error('خطأ في توليد الأسئلة:', error);
    alert('حدث خطأ أثناء توليد الأسئلة: ' + error.message);
  } finally {
    document.getElementById('ai-loading').classList.add('hidden');
  }
}