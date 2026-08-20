// ===== ECS HSE Test Application =====

const App = {
  state: {
    screen: 'home',
    mode: null, // 'full' | 'quick'
    questions: [],
    answers: {},
    flagged: new Set(),
    currentIndex: 0,
    startTime: null,
    endTime: null,
    timerInterval: null,
    timeRemaining: 0,
  },

  init() {
    this.renderTopicsList();
    this.renderPracticeTopics();
    this.showScreen('home');
  },

  // ===== Screen Management =====
  showScreen(name) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(name + '-screen').classList.add('active');
    this.state.screen = name;

    const headerInfo = document.getElementById('header-info');
    const timerDisplay = document.getElementById('timer-display');
    const progressDisplay = document.getElementById('progress-display');

    if (name === 'test') {
      headerInfo.classList.remove('hidden');
      if (this.state.mode === 'full') {
        timerDisplay.classList.remove('hidden');
      } else {
        timerDisplay.classList.add('hidden');
      }
      progressDisplay.classList.remove('hidden');
    } else {
      headerInfo.classList.add('hidden');
      timerDisplay.classList.add('hidden');
      progressDisplay.classList.add('hidden');
    }

    window.scrollTo(0, 0);
  },

  // ===== Home Screen =====
  renderTopicsList() {
    const container = document.getElementById('topics-list');
    container.innerHTML = '';
    for (const [sec, info] of Object.entries(SECTIONS)) {
      const bankCount = QUESTIONS.filter(q => q.section === parseInt(sec)).length;
      const item = document.createElement('div');
      item.className = 'topic-item';
      item.innerHTML = `
        <span class="topic-item-name">${info.name}</span>
        <span class="topic-item-count">
          <span class="bank-count">${bankCount}</span>
          <span class="test-count">(${info.assessmentCount} in test)</span>
        </span>
      `;
      item.onclick = () => this.showPracticeSection(parseInt(sec));
      container.appendChild(item);
    }
  },

  // ===== Test Setup =====
  startTest() {
    this.state.mode = 'full';
    this.state.questions = this.selectQuestions(ASSESSMENT_CONFIG.totalQuestions, true);
    this.beginTest('Full Test');
  },

  startQuickTest() {
    this.state.mode = 'quick';
    this.state.questions = this.selectQuestions(20, false);
    this.beginTest('Quick Quiz');
  },

  selectQuestions(count, proportional) {
    let selected = [];
    if (proportional) {
      // Select questions proportionally from each section as in the real assessment
      for (const [sec, info] of Object.entries(SECTIONS)) {
        const sectionQuestions = QUESTIONS.filter(q => q.section === parseInt(sec));
        const shuffled = this.shuffle([...sectionQuestions]);
        selected.push(...shuffled.slice(0, info.assessmentCount));
      }
    } else {
      // Random selection from entire bank
      selected = this.shuffle([...QUESTIONS]).slice(0, count);
    }
    // Shuffle the selected questions and shuffle options within each
    selected = this.shuffle(selected);
    return selected.map(q => this.shuffleOptions(q));
  },

  shuffleOptions(q) {
    // Shuffle the answer options while tracking the correct one
    const opts = [
      { letter: 'A', text: q.options.A },
      { letter: 'B', text: q.options.B },
      { letter: 'C', text: q.options.C },
      { letter: 'D', text: q.options.D },
    ];
    const shuffled = this.shuffle(opts);
    const newOptions = {};
    const correctText = q.options[q.rightAnswer];
    shuffled.forEach((o, i) => {
      const letter = ['A', 'B', 'C', 'D'][i];
      newOptions[letter] = o.text;
    });
    // Find new letter for the correct answer
    let newRightAnswer = null;
    for (const [letter, text] of Object.entries(newOptions)) {
      if (text === correctText) {
        newRightAnswer = letter;
        break;
      }
    }
    return {
      ...q,
      options: newOptions,
      rightAnswer: newRightAnswer,
      originalRightAnswer: q.rightAnswer,
    };
  },

  shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },

  beginTest(label) {
    this.state.answers = {};
    this.state.flagged = new Set();
    this.state.currentIndex = 0;
    this.state.startTime = Date.now();
    this.state.endTime = null;

    document.getElementById('test-mode-label').textContent = label;
    document.getElementById('total-q-num').textContent = this.state.questions.length;

    if (this.state.mode === 'full') {
      this.state.timeRemaining = ASSESSMENT_CONFIG.timeLimitMinutes * 60;
      this.startTimer();
    } else {
      this.stopTimer();
    }

    this.renderQuestionNav();
    this.renderQuestion();
    this.showScreen('test');
  },

  // ===== Timer =====
  startTimer() {
    this.updateTimerDisplay();
    if (this.state.timerInterval) clearInterval(this.state.timerInterval);
    this.state.timerInterval = setInterval(() => {
      this.state.timeRemaining--;
      this.updateTimerDisplay();
      if (this.state.timeRemaining <= 0) {
        this.stopTimer();
        this.submitTest(false);
      }
    }, 1000);
  },

  stopTimer() {
    if (this.state.timerInterval) {
      clearInterval(this.state.timerInterval);
      this.state.timerInterval = null;
    }
  },

  updateTimerDisplay() {
    const display = document.getElementById('timer-display');
    const value = document.getElementById('timer-value');
    const mins = Math.floor(this.state.timeRemaining / 60);
    const secs = this.state.timeRemaining % 60;
    value.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;

    display.classList.remove('warning', 'danger');
    if (this.state.timeRemaining <= 60) {
      display.classList.add('danger');
    } else if (this.state.timeRemaining <= 300) {
      display.classList.add('warning');
    }
  },

  // ===== Question Navigation =====
  renderQuestionNav() {
    const nav = document.getElementById('question-nav');
    nav.innerHTML = '';
    this.state.questions.forEach((_, i) => {
      const item = document.createElement('div');
      item.className = 'qnav-item';
      if (this.state.answers[i] !== undefined) item.classList.add('answered');
      if (this.state.flagged.has(i)) item.classList.add('flagged');
      if (i === this.state.currentIndex) item.classList.add('current');
      item.textContent = i + 1;
      item.onclick = () => this.goToQuestion(i);
      nav.appendChild(item);
    });
  },

  renderQuestion() {
    const q = this.state.questions[this.state.currentIndex];
    if (!q) return;

    document.getElementById('current-q-num').textContent = this.state.currentIndex + 1;
    document.getElementById('question-section-tag').textContent = q.sectionName;
    document.getElementById('question-text').textContent = q.question;

    const flagIndicator = document.getElementById('flag-indicator');
    if (this.state.flagged.has(this.state.currentIndex)) {
      flagIndicator.classList.remove('hidden');
    } else {
      flagIndicator.classList.add('hidden');
    }

    // Render options
    const optionsList = document.getElementById('options-list');
    optionsList.innerHTML = '';
    for (const letter of ['A', 'B', 'C', 'D']) {
      const item = document.createElement('div');
      item.className = 'option-item';
      if (this.state.answers[this.state.currentIndex] === letter) {
        item.classList.add('selected');
      }
      item.innerHTML = `
        <div class="option-letter">${letter}</div>
        <div class="option-text">${this.escapeHtml(q.options[letter])}</div>
      `;
      item.onclick = () => this.selectAnswer(letter);
      optionsList.appendChild(item);
    }

    // Update nav buttons
    document.getElementById('prev-btn').disabled = this.state.currentIndex === 0;
    const nextBtn = document.getElementById('next-btn');
    if (this.state.currentIndex === this.state.questions.length - 1) {
      nextBtn.textContent = 'Review →';
    } else {
      nextBtn.textContent = 'Next →';
    }

    // Update progress
    const progress = ((this.state.currentIndex + 1) / this.state.questions.length) * 100;
    document.getElementById('progress-text').textContent =
      `Question ${this.state.currentIndex + 1} of ${this.state.questions.length}`;
    document.getElementById('progress-bar').style.width = progress + '%';

    this.renderQuestionNav();
  },

  selectAnswer(letter) {
    this.state.answers[this.state.currentIndex] = letter;
    this.renderQuestion();
  },

  nextQuestion() {
    if (this.state.currentIndex < this.state.questions.length - 1) {
      this.state.currentIndex++;
      this.renderQuestion();
    } else {
      this.showReview();
    }
  },

  prevQuestion() {
    if (this.state.currentIndex > 0) {
      this.state.currentIndex--;
      this.renderQuestion();
    }
  },

  goToQuestion(index) {
    this.state.currentIndex = index;
    this.renderQuestion();
  },

  toggleFlag() {
    const idx = this.state.currentIndex;
    if (this.state.flagged.has(idx)) {
      this.state.flagged.delete(idx);
    } else {
      this.state.flagged.add(idx);
    }
    this.renderQuestion();
  },

  // ===== Review Screen =====
  showReview() {
    const grid = document.getElementById('review-grid');
    grid.innerHTML = '';
    this.state.questions.forEach((_, i) => {
      const item = document.createElement('div');
      item.className = 'review-item';
      if (this.state.answers[i] !== undefined) item.classList.add('answered');
      if (this.state.flagged.has(i)) item.classList.add('flagged');
      item.textContent = i + 1;
      item.onclick = () => {
        this.state.currentIndex = i;
        this.showScreen('test');
        this.renderQuestion();
      };
      grid.appendChild(item);
    });

    const answered = Object.keys(this.state.answers).length;
    const total = this.state.questions.length;
    const reviewIntro = document.querySelector('.review-intro');
    reviewIntro.textContent = `${answered} of ${total} questions answered. Click any question to jump to it.`;

    this.showScreen('review');
  },

  backToTest() {
    this.showScreen('test');
    this.renderQuestion();
  },

  // ===== Submit & Results =====
  confirmQuitTest() {
    this.showModal(
      'Quit Test?',
      'Your progress will be lost. Are you sure you want to quit?',
      () => {
        this.stopTimer();
        this.showScreen('home');
      }
    );
  },

  submitTest(confirmed) {
    if (!confirmed) {
      // Auto-submit from timer
    }
    this.stopTimer();
    this.state.endTime = Date.now();
    this.showResults();
  },

  showResults() {
    const total = this.state.questions.length;
    let correct = 0, incorrect = 0, unanswered = 0;

    this.state.questions.forEach((q, i) => {
      const userAnswer = this.state.answers[i];
      if (userAnswer === undefined) {
        unanswered++;
      } else if (userAnswer === q.rightAnswer) {
        correct++;
      } else {
        incorrect++;
      }
    });

    const percentage = Math.round((correct / total) * 100);
    const passMark = this.state.mode === 'full' ? ASSESSMENT_CONFIG.passMark : Math.ceil(total * 0.86);
    const passed = correct >= passMark;

    // Banner
    const banner = document.getElementById('result-banner');
    banner.classList.remove('pass', 'fail');
    banner.classList.add(passed ? 'pass' : 'fail');

    document.getElementById('result-icon').textContent = passed ? '🎉' : '📚';
    document.getElementById('result-title').textContent = passed ? 'Passed!' : 'Not Passed';
    document.getElementById('result-score').textContent = `${correct} / ${total}`;
    document.getElementById('result-percentage').textContent =
      `${percentage}% ${this.state.mode === 'full' ? `(pass mark: ${passMark}/${total})` : ''}`;

    // Stats
    document.getElementById('stat-correct').textContent = correct;
    document.getElementById('stat-incorrect').textContent = incorrect;
    document.getElementById('stat-unanswered').textContent = unanswered;

    const elapsed = Math.floor((this.state.endTime - this.state.startTime) / 1000);
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    document.getElementById('stat-time').textContent = `${mins}:${secs.toString().padStart(2, '0')}`;

    // Topic breakdown
    this.renderTopicBreakdown();

    // Detailed review
    this.renderDetailedReview();

    this.showScreen('results');
  },

  renderTopicBreakdown() {
    const container = document.getElementById('topic-breakdown');
    container.innerHTML = '';

    // Group by section
    const sectionStats = {};
    this.state.questions.forEach((q, i) => {
      if (!sectionStats[q.section]) {
        sectionStats[q.section] = { name: q.sectionName, correct: 0, total: 0 };
      }
      sectionStats[q.section].total++;
      if (this.state.answers[i] === q.rightAnswer) {
        sectionStats[q.section].correct++;
      }
    });

    Object.values(sectionStats).forEach(stat => {
      const pct = stat.total > 0 ? (stat.correct / stat.total) * 100 : 0;
      const item = document.createElement('div');
      item.className = 'topic-breakdown-item';
      item.innerHTML = `
        <div class="topic-breakdown-name">${stat.name}</div>
        <div class="topic-breakdown-bar-container">
          <div class="topic-breakdown-bar correct" style="width: ${pct}%"></div>
        </div>
        <div class="topic-breakdown-score">${stat.correct}/${stat.total}</div>
      `;
      container.appendChild(item);
    });
  },

  renderDetailedReview() {
    const container = document.getElementById('detailed-review');
    container.innerHTML = '';

    this.state.questions.forEach((q, i) => {
      const userAnswer = this.state.answers[i];
      const isCorrect = userAnswer === q.rightAnswer;
      const isUnanswered = userAnswer === undefined;

      const item = document.createElement('div');
      item.className = 'detailed-review-item ' + (isUnanswered ? 'unanswered' : (isCorrect ? 'correct' : 'incorrect'));

      let statusText = isUnanswered ? 'Unanswered' : (isCorrect ? 'Correct' : 'Incorrect');
      let statusClass = isUnanswered ? 'unanswered' : (isCorrect ? 'correct' : 'incorrect');

      let optionsHtml = '';
      for (const letter of ['A', 'B', 'C', 'D']) {
        let cls = 'dr-option';
        if (letter === q.rightAnswer) cls += ' correct-answer';
        if (letter === userAnswer && !isCorrect) cls += ' user-incorrect';
        if (letter === userAnswer && isCorrect) cls += ' user-correct';
        let prefix = '';
        if (letter === q.rightAnswer) prefix = '✓ ';
        if (letter === userAnswer && !isCorrect) prefix = '✗ ';
        optionsHtml += `
          <div class="${cls}">
            <span class="dr-option-letter">${prefix}${letter}.</span>
            <span>${this.escapeHtml(q.options[letter])}</span>
          </div>
        `;
      }

      let explanationHtml = '';
      if (q.explanation) {
        explanationHtml = `
          <div class="dr-explanation">
            <span class="dr-explanation-label">Explanation: </span>${this.escapeHtml(q.explanation)}
          </div>
        `;
      }

      item.innerHTML = `
        <div class="dr-header">
          <span class="dr-number">Question ${i + 1}</span>
          <span class="dr-status ${statusClass}">${statusText}</span>
        </div>
        <div class="dr-section-tag" style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">${q.sectionName}</div>
        <div class="dr-question">${this.escapeHtml(q.question)}</div>
        <div class="dr-options">${optionsHtml}</div>
        ${explanationHtml}
      `;
      container.appendChild(item);
    });
  },

  // ===== Practice Mode =====
  renderPracticeTopics() {
    const container = document.getElementById('practice-topics');
    container.innerHTML = '';
    for (const [sec, info] of Object.entries(SECTIONS)) {
      const bankCount = QUESTIONS.filter(q => q.section === parseInt(sec)).length;
      const card = document.createElement('div');
      card.className = 'practice-topic-card';
      card.innerHTML = `
        <div class="practice-topic-name">${info.name}</div>
        <div class="practice-topic-meta">${bankCount} questions in bank</div>
      `;
      card.onclick = () => this.showPracticeSection(parseInt(sec));
      container.appendChild(card);
    }
  },

  showPracticeTopics() {
    document.getElementById('practice-topics').classList.remove('hidden');
    document.getElementById('practice-content').classList.add('hidden');
  },

  showPracticeSection(section) {
    const questions = QUESTIONS.filter(q => q.section === section);
    const info = SECTIONS[section];

    document.getElementById('practice-topics').classList.add('hidden');
    const content = document.getElementById('practice-content');
    content.classList.remove('hidden');

    document.getElementById('practice-topic-title').textContent = info.name;
    document.getElementById('practice-count').textContent = `${questions.length} questions`;

    const container = document.getElementById('practice-questions');
    container.innerHTML = '';

    questions.forEach((q, i) => {
      const item = document.createElement('div');
      item.className = 'practice-question';

      let optionsHtml = '';
      for (const letter of ['A', 'B', 'C', 'D']) {
        const cls = letter === q.rightAnswer ? 'practice-q-option correct' : 'practice-q-option';
        const prefix = letter === q.rightAnswer ? '✓ ' : '';
        optionsHtml += `
          <div class="${cls}">
            <span class="practice-q-option-letter">${prefix}${letter}.</span>
            <span>${this.escapeHtml(q.options[letter])}</span>
          </div>
        `;
      }

      let explanationHtml = '';
      if (q.explanation) {
        explanationHtml = `
          <div class="practice-q-explanation">
            <strong>Explanation:</strong> ${this.escapeHtml(q.explanation)}
          </div>
        `;
      }

      item.innerHTML = `
        <div class="practice-q-header">
          <span class="practice-q-number">Q${q.id}</span>
        </div>
        <div class="practice-q-text">${this.escapeHtml(q.question)}</div>
        <div class="practice-q-options">${optionsHtml}</div>
        ${explanationHtml}
      `;
      container.appendChild(item);
    });
  },

  // ===== Modal =====
  showModal(title, body, onConfirm) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').textContent = body;
    document.getElementById('modal-overlay').classList.remove('hidden');

    const confirmBtn = document.getElementById('modal-confirm');
    const cancelBtn = document.getElementById('modal-cancel');

    const close = () => {
      document.getElementById('modal-overlay').classList.add('hidden');
      confirmBtn.onclick = null;
      cancelBtn.onclick = null;
    };

    confirmBtn.onclick = () => { close(); onConfirm(); };
    cancelBtn.onclick = close;
  },

  // ===== Utility =====
  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());
