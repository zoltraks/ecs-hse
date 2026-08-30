'use strict';

// ===== ECS HSE Test Application =====

const STORAGE_KEY = 'ecs-hse-test-state-v1';
const STORAGE_KEY_LEGACY = 'ecs-hse-test-state';
const STORAGE_VERSION = 1;
const LOGO_TITLE_KEY = 'app_title';

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
    timerPaused: false,
    cheatMode: false,
    practiceSection: null,
    testLabel: '',
    revealed: new Set(),
  },

  init() {
    this.renderUI();
    this.renderHomeStats();
    this.renderTopicsList();
    this.renderPracticeTopics();
    this.updateLanguageFlag();
    window.addEventListener('localechange', () => this.onLocaleChange());
    if (this.loadState() && this.state.screen !== 'home') {
      this.restoreScreen();
    } else {
      this.showScreen('home');
    }
    this.updateCheatButton();
  },

  // ===== Scroll Lock =====
  lockScroll() {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = scrollbarWidth + 'px';
    }
    document.body.classList.add('scroll-locked');
  },

  unlockScroll() {
    document.body.classList.remove('scroll-locked');
    document.body.style.paddingRight = '';
  },

  // ===== Language =====
  updateLanguageFlag() {
    const flagEl = document.getElementById('lang-flag');
    if (!flagEl) return;
    const svg = LANGUAGES[I18n.locale].flag;
    flagEl.innerHTML = '';
    flagEl.style.backgroundImage = 'url("data:image/svg+xml;utf8,' + encodeURIComponent(svg) + '")';
  },

  openLanguageModal() {
    const overlay = document.getElementById('lang-modal-overlay');
    document.getElementById('lang-modal-title').textContent = I18n.t('lang_title');
    document.getElementById('lang-modal-close').textContent = I18n.t('lang_close');

    const body = document.getElementById('lang-modal-body');
    body.innerHTML = '';
    for (const [code, info] of Object.entries(LANGUAGES)) {
      const option = document.createElement('div');
      option.className = 'lang-option' + (code === I18n.locale ? ' active' : '');
      option.setAttribute('role', 'button');
      option.setAttribute('tabindex', '0');
      option.setAttribute('aria-pressed', code === I18n.locale ? 'true' : 'false');
      option.innerHTML = `
        <span class="lang-option-flag">${info.flag}</span>
        <span class="lang-option-name">${this.escapeHtml(info.name)}</span>
        ${code === I18n.locale ? '<span class="lang-option-check">✓</span>' : ''}
      `;
      option.onclick = () => { this.selectLanguage(code); this.closeLanguageModal(); };
      option.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.selectLanguage(code); this.closeLanguageModal(); }
      };
      body.appendChild(option);
    }

    overlay.classList.remove('hidden');
    this.lockScroll();

    const closeBtn = document.getElementById('lang-modal-close');
    const trigger = document.activeElement;

    const onEscape = (e) => { if (e.key === 'Escape') close(); };
    const onBackdrop = (e) => { if (e.target === overlay) close(); };

    const close = () => {
      overlay.classList.add('hidden');
      this.unlockScroll();
      document.removeEventListener('keydown', onEscape);
      overlay.removeEventListener('click', onBackdrop);
      closeBtn.onclick = null;
      if (trigger && typeof trigger.focus === 'function') trigger.focus();
    };

    document.addEventListener('keydown', onEscape);
    overlay.addEventListener('click', onBackdrop);
    closeBtn.onclick = close;
    closeBtn.focus();
  },

  closeLanguageModal() {
    const overlay = document.getElementById('lang-modal-overlay');
    overlay.classList.add('hidden');
    this.unlockScroll();
  },

  selectLanguage(code) {
    if (code === I18n.locale) return;
    I18n.setLocale(code);
  },

  onLocaleChange() {
    this.updateLanguageFlag();
    this.renderUI();
    this.renderHomeStats();
    this.renderTopicsList();
    this.renderPracticeTopics();
    this.updateCheatButton();

    const screen = this.state.screen;
    if (screen === 'test') {
      this.renderQuestion();
    } else if (screen === 'review') {
      this.showReview();
    } else if (screen === 'results') {
      this.showResults();
    } else if (screen === 'practice') {
      if (this.state.practiceSection !== null) {
        this.showPracticeSection(this.state.practiceSection);
      }
    }
  },

  renderUI() {
    const setText = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
    setText('modal-cancel', I18n.t('modal_cancel'));
    setText('modal-confirm', I18n.t('modal_confirm'));

    document.querySelector('.logo-title').textContent = I18n.t('app_title');
    document.querySelector('.logo-subtitle').textContent = I18n.t('app_subtitle');
    document.querySelector('.logo').setAttribute('aria-label', I18n.t('logo_aria'));
    document.getElementById('timer-display').setAttribute('aria-label', I18n.t('timer_pause_resume'));
    document.getElementById('lang-btn').setAttribute('aria-label', I18n.t('lang_title'));

    const heroTitle = document.querySelector('#home-screen .hero h1');
    if (heroTitle) heroTitle.textContent = I18n.t('home_hero_title');
    const heroSubtitle = document.querySelector('#home-screen .hero-subtitle');
    if (heroSubtitle) heroSubtitle.textContent = I18n.t('home_hero_subtitle');

    setText('info-total-questions-label', I18n.t('home_info_questions_per_test'));
    setText('info-time-limit-label', I18n.t('home_info_time_limit'));
    setText('info-pass-mark-label', I18n.t('home_info_pass_mark'));
    setText('info-bank-count-label', I18n.t('home_info_total_bank'));

    const infoLabels = document.querySelectorAll('.info-card-label');
    if (infoLabels.length >= 4) {
      infoLabels[0].textContent = I18n.t('home_info_questions_per_test');
      infoLabels[1].textContent = I18n.t('home_info_time_limit');
      infoLabels[2].textContent = I18n.t('home_info_pass_mark');
      infoLabels[3].textContent = I18n.t('home_info_total_bank');
    }

    const actionCards = document.querySelectorAll('.action-card h2');
    if (actionCards.length >= 4) {
      actionCards[0].textContent = I18n.t('home_action_full_test');
      actionCards[1].textContent = I18n.t('home_action_quick_quiz');
      actionCards[2].textContent = I18n.t('home_action_all_questions');
      actionCards[3].textContent = I18n.t('home_action_practice');
    }

    const actionDescs = document.querySelectorAll('.action-card p');
    if (actionDescs.length >= 4) {
      actionDescs[0].innerHTML = I18n.tf('home_action_full_test_desc', ASSESSMENT_CONFIG.totalQuestions, Object.keys(SECTIONS).length, ASSESSMENT_CONFIG.timeLimitMinutes);
      actionDescs[1].textContent = I18n.t('home_action_quick_quiz_desc');
      actionDescs[2].innerHTML = I18n.tf('home_action_all_questions_desc', QUESTIONS.length);
      actionDescs[3].innerHTML = I18n.tf('home_action_practice_desc', QUESTIONS.length);
    }

    const actionBtns = document.querySelectorAll('.action-card .btn');
    if (actionBtns.length >= 4) {
      actionBtns[0].textContent = I18n.t('home_action_full_test_btn');
      actionBtns[1].textContent = I18n.t('home_action_quick_quiz_btn');
      actionBtns[2].textContent = I18n.t('home_action_all_questions_btn');
      actionBtns[3].textContent = I18n.t('home_action_practice_btn');
    }

    const topicsTitle = document.querySelector('.topics-overview h3');
    if (topicsTitle) topicsTitle.textContent = I18n.t('home_topics_title');
    const topicsIntro = document.querySelector('.topics-intro');
    if (topicsIntro) topicsIntro.innerHTML = I18n.tf('home_topics_intro', Object.keys(SECTIONS).length);

    setText('test-quit-btn', I18n.t('test_quit'));
    setText('reveal-btn', I18n.t('test_reveal'));
    setText('flag-btn', I18n.t('test_flag'));
    setText('review-btn', I18n.t('test_review'));
    setText('prev-btn', I18n.t('test_previous'));
    setText('prev-btn-top', I18n.t('test_previous'));
    setText('next-btn', I18n.t('test_next'));
    setText('next-btn-top', I18n.t('test_next'));

    const reviewTitle = document.querySelector('#review-screen h2');
    if (reviewTitle) reviewTitle.textContent = I18n.t('review_title');
    setText('review-back-btn', I18n.t('review_back'));
    setText('review-submit-btn', I18n.t('review_submit'));

    const resultsPerfTitle = document.querySelector('.results-breakdown h3');
    if (resultsPerfTitle) resultsPerfTitle.textContent = I18n.t('results_performance_title');
    const resultsDetailTitle = document.querySelector('.results-review h3');
    if (resultsDetailTitle) resultsDetailTitle.textContent = I18n.t('results_detailed_title');
    const reviewHint = document.querySelector('.review-hint');
    if (reviewHint) reviewHint.textContent = I18n.t('results_detailed_hint');

    setText('retake-btn', I18n.t('results_retake'));
    setText('home-btn', I18n.t('results_home'));

    const statLabels = document.querySelectorAll('.stat-label');
    if (statLabels.length >= 4) {
      statLabels[0].textContent = I18n.t('results_stat_correct');
      statLabels[1].textContent = I18n.t('results_stat_incorrect');
      statLabels[2].textContent = I18n.t('results_stat_unanswered');
      statLabels[3].textContent = I18n.t('results_stat_time');
    }

    const practiceH2 = document.querySelector('#practice-topics h2');
    if (practiceH2) practiceH2.textContent = I18n.t('practice_topics_title');
    setText('practice-quit-btn', I18n.t('practice_quit'));
    setText('all-topics-btn', I18n.t('practice_back'));
  },

  // ===== State Persistence =====
  saveState() {
    const data = {
      screen: this.state.screen,
      mode: this.state.mode,
      questions: this.state.questions,
      answers: this.state.answers,
      flagged: [...this.state.flagged],
      revealed: [...this.state.revealed],
      currentIndex: this.state.currentIndex,
      startTime: this.state.startTime,
      endTime: this.state.endTime,
      timeRemaining: this.state.timeRemaining,
      timerPaused: this.state.timerPaused,
      cheatMode: this.state.cheatMode,
      practiceSection: this.state.practiceSection,
      testLabel: this.state.testLabel,
      savedAt: Date.now(),
      version: STORAGE_VERSION,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('saveState error:', e);
    }
  },

  loadState() {
    try {
      let raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        raw = localStorage.getItem(STORAGE_KEY_LEGACY);
        if (!raw) return false;
      }
      const data = JSON.parse(raw);
      if (!data || !data.screen) return false;
      if (!data.questions || data.questions.length === 0) return false;
      if (data.version !== undefined && data.version !== STORAGE_VERSION) return false;
      this.state.screen = data.screen;
      this.state.mode = data.mode || null;
      this.state.questions = data.questions || [];
      this.state.answers = data.answers || {};
      this.state.flagged = new Set(data.flagged || []);
      this.state.revealed = new Set(data.revealed || []);
      this.state.currentIndex = data.currentIndex || 0;
      this.state.startTime = data.startTime || null;
      this.state.endTime = data.endTime || null;
      this.state.timeRemaining = data.timeRemaining || 0;
      this.state.timerPaused = data.timerPaused || false;
      this.state.cheatMode = data.cheatMode || false;
      this.state.practiceSection = data.practiceSection || null;
      this.state.testLabel = data.testLabel || '';
      this.state.savedAt = data.savedAt || null;
      return true;
    } catch (e) {
      console.error('loadState error:', e);
      return false;
    }
  },

  clearState() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY_LEGACY);
    } catch (e) {
      // ignore
    }
  },

  restoreScreen() {
    const screen = this.state.screen;
    if (screen === 'test' && this.state.questions.length > 0) {
      // Adjust timer for elapsed time while page was closed (only if not paused)
      if (this.state.mode === 'full' && this.state.savedAt && !this.state.timerPaused) {
        const elapsed = Math.floor((Date.now() - this.state.savedAt) / 1000);
        this.state.timeRemaining = Math.max(0, this.state.timeRemaining - elapsed);
        if (this.state.timeRemaining <= 0) {
          // Timer expired while away — go straight to results
          this.state.endTime = Date.now();
          this.showResults();
          this.saveState();
          return;
        }
      }
      this.setLogoTitle(this.state.testLabel || 'Test');
      document.getElementById('total-q-num').textContent = this.state.questions.length;
      if (this.state.mode === 'full') {
        if (this.state.timerPaused) {
          // Stay paused — update display without starting the interval
          this.updateTimerDisplay();
          this.applyPauseState();
        } else {
          this.startTimer();
        }
      }
      this.renderQuestionNav();
      this.renderQuestion();
      this.showScreen('test');
    } else if (screen === 'review' && this.state.questions.length > 0) {
      this.showReview();
    } else if (screen === 'results' && this.state.questions.length > 0) {
      this.showResults();
    } else if (screen === 'practice') {
      if (this.state.practiceSection !== null) {
        this.showPracticeSection(this.state.practiceSection);
      } else {
        this.showScreen('practice');
      }
    } else {
      this.showScreen('home');
    }
  },

  // ===== Screen Management =====
  setLogoTitle(title) {
    document.querySelector('.logo-title').textContent = title || I18n.t(LOGO_TITLE_KEY);
  },

  toggleCheatMode() {
    if (!this.state.cheatMode) {
      // Activating cheat mode — confirm first with a discouraging warning
      this.showModal(
        I18n.t('modal_cheater_title'),
        I18n.t('modal_cheater_body'),
        () => {
          this.state.cheatMode = true;
          this.updateCheatButton();
          this.updateRevealButtonVisibility();
          this.saveState();
        }
      );
    } else {
      // Deactivating — no confirmation needed
      this.state.cheatMode = false;
      this.updateCheatButton();
      this.updateRevealButtonVisibility();
      this.saveState();
    }
  },

  updateCheatButton() {
    const btn = document.getElementById('cheat-btn');
    if (!btn) return;
    btn.textContent = I18n.t('modal_cheater_btn');
    if (this.state.cheatMode) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  },

  updateRevealButtonVisibility() {
    const revealBtn = document.getElementById('reveal-btn');
    if (!revealBtn) return;
    if (this.state.cheatMode) {
      revealBtn.classList.remove('hidden');
    } else {
      revealBtn.classList.add('hidden');
    }
  },

  showScreen(name) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(name + '-screen').classList.add('active');
    this.state.screen = name;

    // Reset logo title to default unless we're in a test (test title set by beginTest)
    if (name !== 'test') {
      this.setLogoTitle(I18n.t(LOGO_TITLE_KEY));
    }

    // Cheater button: visible only on the home screen
    const cheatBtn = document.getElementById('cheat-btn');
    if (name === 'home') {
      cheatBtn.classList.remove('hidden');
    } else {
      cheatBtn.classList.add('hidden');
    }

    // Timer visibility: show only in full test mode
    const timerDisplay = document.getElementById('timer-display');
    if (name === 'test' && this.state.mode === 'full') {
      timerDisplay.classList.remove('hidden');
    } else {
      timerDisplay.classList.add('hidden');
    }

    // Reveal button: visible only in test screen when cheat mode is on
    this.updateRevealButtonVisibility();

    window.scrollTo(0, 0);

    const heading = document.querySelector('#' + name + '-screen h1, #' + name + '-screen h2, #' + name + '-screen h3');
    if (heading) heading.focus();

    this.saveState();
  },

  goHome() {
    if (this.state.screen === 'test') {
      if (this.state.mode === 'all') {
        this.showModal(
          I18n.t('modal_leave_all_title'),
          I18n.t('modal_leave_all_body'),
          () => {
            this.stopTimer();
            this.showScreen('home');
          },
          {
            confirmLabel: I18n.t('modal_leave_all_leave'),
            extraAction: {
              label: I18n.t('modal_leave_all_clear'),
              handler: () => {
                this.stopTimer();
                this.clearState();
                this.showScreen('home');
              },
            },
          }
        );
      } else {
        this.showModal(
          I18n.t('modal_leave_test_title'),
          I18n.t('modal_leave_test_body'),
          () => {
            this.stopTimer();
            this.clearState();
            this.showScreen('home');
          }
        );
      }
    } else {
      if (this.state.screen === 'results') {
        this.clearState();
      }
      this.showScreen('home');
    }
  },

  // ===== Home Screen =====
  renderHomeStats() {
    const total = QUESTIONS.length;
    const topicCount = Object.keys(SECTIONS).length;
    const { totalQuestions, timeLimitMinutes, passMark } = ASSESSMENT_CONFIG;
    const setText = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    };
    setText('info-total-questions', totalQuestions);
    setText('info-time-limit', `${timeLimitMinutes} min`);
    setText('info-pass-mark', `${passMark}/${totalQuestions}`);
    setText('info-bank-count', total);
    setText('desc-total-questions', totalQuestions);
    setText('desc-topic-count', topicCount);
    setText('desc-time-limit', timeLimitMinutes);
    setText('desc-bank-count', total);
    setText('desc-bank-count-2', total);
    setText('desc-topic-count-2', topicCount);
  },

  renderTopicsList() {
    const container = document.getElementById('topics-list');
    container.innerHTML = '';
    for (const [sec, info] of Object.entries(SECTIONS)) {
      const bankCount = QUESTIONS.filter(q => q.section === parseInt(sec)).length;
      const item = document.createElement('div');
      const sectionName = I18n.tSectionName(sec) || info.name;
      item.className = 'topic-item';
      item.innerHTML = `
        <span class="topic-item-name">${this.escapeHtml(sectionName)}</span>
        <span class="topic-item-count">
          <span class="bank-count">${bankCount}</span>
          <span class="test-count">(${info.assessmentCount} ${I18n.t('home_topic_in_test')})</span>
        </span>
      `;
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');
      item.onclick = () => this.showPracticeSection(parseInt(sec));
      item.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.showPracticeSection(parseInt(sec)); }
      };
      container.appendChild(item);
    }
  },

  // ===== Test Setup =====
  startTest() {
    this.state.mode = 'full';
    this.state.questions = this.selectQuestions(ASSESSMENT_CONFIG.totalQuestions, true);
    this.beginTest(I18n.t('test_label_full'));
  },

  startQuickTest() {
    this.state.mode = 'quick';
    this.state.questions = this.selectQuestions(20, false);
    this.beginTest(I18n.t('test_label_quick'));
  },

  startAllQuestions() {
    // If an "all" session was saved with answers (from a previous Leave), resume it
    if (this.state.mode === 'all' && this.state.questions.length > 0 &&
        Object.keys(this.state.answers).length > 0) {
      this.setLogoTitle(I18n.t('test_label_all'));
      document.getElementById('total-q-num').textContent = this.state.questions.length;
      this.renderQuestionNav();
      this.renderQuestion();
      this.showScreen('test');
      return;
    }
    this.state.mode = 'all';
    // All questions ordered by topic (section then question number), with shuffled answers
    const sorted = [...QUESTIONS].sort((a, b) => {
      if (a.section !== b.section) return a.section - b.section;
      const aNum = parseInt(a.id.split('.')[1]);
      const bNum = parseInt(b.id.split('.')[1]);
      return aNum - bNum;
    });
    this.state.questions = sorted.map(q => this.shuffleOptions(q));
    this.beginTest(I18n.t('test_label_all'));
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
    // Shuffle the answer options while tracking the correct one by reference.
    // Carrying the original letter with each option avoids the ambiguity that
    // arises when two options share the same text (matching by text would then
    // pick the wrong one).
    const opts = [
      { letter: 'A', text: q.options.A },
      { letter: 'B', text: q.options.B },
      { letter: 'C', text: q.options.C },
      { letter: 'D', text: q.options.D },
    ];
    const shuffled = this.shuffle(opts);
    const newOptions = {};
    const originalLetters = {};
    let newRightAnswer = null;
    shuffled.forEach((o, i) => {
      const letter = ['A', 'B', 'C', 'D'][i];
      newOptions[letter] = o.text;
      originalLetters[letter] = o.letter;
      if (o.letter === q.rightAnswer) {
        newRightAnswer = letter;
      }
    });
    return {
      ...q,
      options: newOptions,
      rightAnswer: newRightAnswer,
      originalRightAnswer: q.rightAnswer,
      originalLetters,
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
    this.state.revealed = new Set();
    this.state.currentIndex = 0;
    this.state.startTime = Date.now();
    this.state.endTime = null;
    this.state.testLabel = label;
    this.state.practiceSection = null;
    this.state.timerPaused = false;

    this.setLogoTitle(label);
    document.getElementById('total-q-num').textContent = this.state.questions.length;

    if (this.state.mode === 'full') {
      this.state.timeRemaining = ASSESSMENT_CONFIG.timeLimitMinutes * 60;
      this.startTimer();
      this.applyPauseState();
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
      this.saveState();
      if (this.state.timeRemaining <= 0) {
        this.stopTimer();
        this.submitTest();
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

  toggleTimerPause() {
    // Only meaningful in full test mode, and only allowed in cheat mode
    if (this.state.mode !== 'full' || this.state.screen !== 'test') return;
    if (!this.state.cheatMode) return;
    this.state.timerPaused = !this.state.timerPaused;
    if (this.state.timerPaused) {
      this.stopTimer();
    } else {
      this.startTimer();
    }
    this.applyPauseState();
    this.saveState();
  },

  applyPauseState() {
    const display = document.getElementById('timer-display');
    const testContainer = document.querySelector('.test-container');
    if (this.state.timerPaused) {
      display.classList.add('paused');
      testContainer.classList.add('paused');
    } else {
      display.classList.remove('paused');
      testContainer.classList.remove('paused');
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
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');
      item.setAttribute('aria-label', 'Question ' + (i + 1));
      item.onclick = () => this.goToQuestion(i);
      item.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.goToQuestion(i); }
      };
      nav.appendChild(item);
    });
  },

  renderQuestion() {
    const rawQ = this.state.questions[this.state.currentIndex];
    if (!rawQ) return;
    const q = I18n.getTranslatedQuestion(rawQ);

    document.getElementById('current-q-num').textContent = this.state.currentIndex + 1;
    document.getElementById('question-section-tag').textContent = q.sectionName;
    document.getElementById('question-text').textContent = q.question;

    const flagIndicator = document.getElementById('flag-indicator');
    if (this.state.flagged.has(this.state.currentIndex)) {
      flagIndicator.classList.remove('hidden');
    } else {
      flagIndicator.classList.add('hidden');
    }

    const isRevealed = this.state.revealed.has(this.state.currentIndex);

    // Toggle Reveal button state: magenta when answer is revealed, teal when idle.
    const revealBtn = document.getElementById('reveal-btn');
    this.updateRevealButtonVisibility();
    if (isRevealed) {
      revealBtn.classList.add('reveal-active');
    } else {
      revealBtn.classList.remove('reveal-active');
    }

    const optionsList = document.getElementById('options-list');
    optionsList.innerHTML = '';
    optionsList.setAttribute('role', 'radiogroup');
    optionsList.setAttribute('aria-labelledby', 'question-text');
    for (const letter of ['A', 'B', 'C', 'D']) {
      const item = document.createElement('div');
      item.className = 'option-item';
      const isSelected = this.state.answers[this.state.currentIndex] === letter;
      if (isSelected) {
        item.classList.add('selected');
      }
      if (isRevealed && letter === q.rightAnswer) {
        item.classList.add('revealed');
      }
      item.setAttribute('role', 'radio');
      item.setAttribute('aria-checked', isSelected ? 'true' : 'false');
      item.setAttribute('tabindex', '0');
      item.innerHTML = `
        <div class="option-letter">${letter}</div>
        <div class="option-text">${this.escapeHtml(q.options[letter])}</div>
      `;
      item.onclick = () => this.selectAnswer(letter);
      item.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.selectAnswer(letter); }
      };
      optionsList.appendChild(item);
    }

    const isFirst = this.state.currentIndex === 0;
    const isLast = this.state.currentIndex === this.state.questions.length - 1;
    document.getElementById('prev-btn').disabled = isFirst;
    document.getElementById('prev-btn-top').disabled = isFirst;
    const nextLabel = isLast ? I18n.t('test_review') : I18n.t('test_next');
    document.getElementById('next-btn').textContent = nextLabel;
    document.getElementById('next-btn-top').textContent = nextLabel;

    const progress = ((this.state.currentIndex + 1) / this.state.questions.length) * 100;
    document.getElementById('progress-text').textContent =
      I18n.tf('test_question_of', this.state.currentIndex + 1, this.state.questions.length);
    document.getElementById('progress-bar').style.width = progress + '%';

    // Show the current question's bank id (e.g. Q1.1) on the right of the row.
    const qidEl = document.getElementById('progress-qid');
    if (q.id) {
      qidEl.textContent = 'Q' + q.id;
      qidEl.classList.remove('hidden');
    } else {
      qidEl.classList.add('hidden');
    }

    this.renderQuestionNav();
  },

  selectAnswer(letter) {
    if (this.state.answers[this.state.currentIndex] === letter) {
      delete this.state.answers[this.state.currentIndex];
    } else {
      this.state.answers[this.state.currentIndex] = letter;
    }
    this.renderQuestion();
    this.saveState();
  },

  nextQuestion() {
    if (this.state.currentIndex < this.state.questions.length - 1) {
      this.state.currentIndex++;
      this.renderQuestion();
      this.saveState();
    } else {
      this.showReview();
    }
  },

  prevQuestion() {
    if (this.state.currentIndex > 0) {
      this.state.currentIndex--;
      this.renderQuestion();
      this.saveState();
    }
  },

  goToQuestion(index) {
    this.state.currentIndex = index;
    this.renderQuestion();
    this.saveState();
  },

  toggleFlag() {
    const idx = this.state.currentIndex;
    if (this.state.flagged.has(idx)) {
      this.state.flagged.delete(idx);
    } else {
      this.state.flagged.add(idx);
    }
    this.renderQuestion();
    this.saveState();
  },

  toggleReveal() {
    const idx = this.state.currentIndex;
    if (this.state.revealed.has(idx)) {
      this.state.revealed.delete(idx);
    } else {
      this.state.revealed.add(idx);
    }
    this.renderQuestion();
    this.saveState();
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
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');
      item.setAttribute('aria-label', 'Question ' + (i + 1));
      item.onclick = () => {
        this.state.currentIndex = i;
        this.showScreen('test');
        this.renderQuestion();
      };
      item.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.state.currentIndex = i;
          this.showScreen('test');
          this.renderQuestion();
        }
      };
      grid.appendChild(item);
    });

    const answered = Object.keys(this.state.answers).length;
    const total = this.state.questions.length;
    const reviewIntro = document.querySelector('.review-intro');
    reviewIntro.textContent = I18n.tf('review_intro', answered, total);

    this.showScreen('review');
  },

  backToTest() {
    this.showScreen('test');
    this.renderQuestion();
  },

  // ===== Submit & Results =====
  confirmQuitTest() {
    if (this.state.mode === 'all') {
      // All Questions: offer Leave (keep answers) and Clear (discard answers)
      this.showModal(
        I18n.t('modal_quit_all_title'),
        I18n.t('modal_quit_all_body'),
        () => {
          // Leave — keep state so user can resume later
          this.stopTimer();
          this.showScreen('home');
        },
        {
          confirmLabel: I18n.t('modal_quit_all_leave'),
          extraAction: {
            label: I18n.t('modal_quit_all_clear'),
            handler: () => {
              this.stopTimer();
              this.clearState();
              this.showScreen('home');
            },
          },
        }
      );
    } else {
      this.showModal(
        I18n.t('modal_quit_test_title'),
        I18n.t('modal_quit_test_body'),
        () => {
          this.stopTimer();
          this.clearState();
          this.showScreen('home');
        }
      );
    }
  },

  submitTest() {
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

    const banner = document.getElementById('result-banner');
    banner.classList.remove('pass', 'fail');
    banner.classList.add(passed ? 'pass' : 'fail');

    document.getElementById('result-icon').textContent = passed ? '🎉' : '📚';
    document.getElementById('result-title').textContent = passed ? I18n.t('results_passed') : I18n.t('results_not_passed');
    document.getElementById('result-score').textContent = `${correct} / ${total}`;
    const pctNote = this.state.mode === 'full' ? ' ' + I18n.tf('results_pass_mark_note', passMark, total) : '';
    document.getElementById('result-percentage').textContent = `${percentage}%${pctNote}`;

    document.getElementById('stat-correct').textContent = correct;
    document.getElementById('stat-incorrect').textContent = incorrect;
    document.getElementById('stat-unanswered').textContent = unanswered;

    const elapsed = Math.floor((this.state.endTime - this.state.startTime) / 1000);
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    document.getElementById('stat-time').textContent = `${mins}:${secs.toString().padStart(2, '0')}`;

    this.renderTopicBreakdown();
    this.renderDetailedReview();

    this.showScreen('results');
  },

  renderTopicBreakdown() {
    const container = document.getElementById('topic-breakdown');
    container.innerHTML = '';

    // Group by section
    const sectionStats = {};
    this.state.questions.forEach((rawQ, i) => {
      const q = I18n.getTranslatedQuestion(rawQ);
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
        <div class="topic-breakdown-name">${this.escapeHtml(stat.name)}</div>
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

    this.state.questions.forEach((rawQ, i) => {
      const q = I18n.getTranslatedQuestion(rawQ);
      const userAnswer = this.state.answers[i];
      const isCorrect = userAnswer === q.rightAnswer;
      const isUnanswered = userAnswer === undefined;

      const item = document.createElement('div');
      item.className = 'detailed-review-item ' + (isUnanswered ? 'unanswered' : (isCorrect ? 'correct' : 'incorrect'));

      let statusText = isUnanswered ? I18n.t('results_status_unanswered') : (isCorrect ? I18n.t('results_status_correct') : I18n.t('results_status_incorrect'));
      let statusClass = isUnanswered ? 'unanswered' : (isCorrect ? 'correct' : 'incorrect');

      let optionsHtml = '';
      for (const letter of ['A', 'B', 'C', 'D']) {
        let cls = 'dr-option';
        if (letter === q.rightAnswer) cls += ' correct-answer';
        if (letter === userAnswer && !isCorrect) cls += ' user-incorrect';
        if (letter === userAnswer && isCorrect) cls += ' user-correct';
        let suffix = '';
        if (letter === q.rightAnswer) suffix = ' ✓';
        if (letter === userAnswer && !isCorrect) suffix = ' ✗';
        optionsHtml += `
          <div class="${cls}">
            <span class="dr-option-letter">${letter}.</span>
            <span>${this.escapeHtml(q.options[letter])}${suffix}</span>
          </div>
        `;
      }

      let explanationHtml = '';
      if (q.explanation) {
        explanationHtml = `
          <div class="dr-explanation">
            <span class="dr-explanation-label">${I18n.t('results_explanation_label')}</span>${this.escapeHtml(q.explanation)}
          </div>
        `;
      }

      item.innerHTML = `
        <div class="dr-header">
          <span class="dr-number">${I18n.tf('results_question_label', i + 1)}</span>
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
    const container = document.getElementById('practice-topics-grid');
    container.innerHTML = '';
    for (const [sec, info] of Object.entries(SECTIONS)) {
      const bankCount = QUESTIONS.filter(q => q.section === parseInt(sec)).length;
      const card = document.createElement('div');
      const sectionName = I18n.tSectionName(sec) || info.name;
      card.className = 'practice-topic-card';
      card.innerHTML = `
        <div class="practice-topic-name">${this.escapeHtml(sectionName)}</div>
        <div class="practice-topic-meta">${I18n.tf('practice_questions_in_bank', bankCount)}</div>
      `;
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.onclick = () => this.showPracticeSection(parseInt(sec));
      card.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.showPracticeSection(parseInt(sec)); }
      };
      container.appendChild(card);
    }
  },

  showPracticeTopics() {
    this.state.practiceSection = null;
    document.getElementById('practice-topics').classList.remove('hidden');
    document.getElementById('practice-content').classList.add('hidden');
    document.getElementById('all-topics-btn').classList.add('hidden');
    this.saveState();
  },

  showPracticeSection(section) {
    const questions = QUESTIONS.filter(q => q.section === section);
    const info = SECTIONS[section];

    this.state.practiceSection = section;
    this.showScreen('practice');
    document.getElementById('practice-topics').classList.add('hidden');
    document.getElementById('all-topics-btn').classList.remove('hidden');
    const content = document.getElementById('practice-content');
    content.classList.remove('hidden');

    const sectionName = I18n.tSectionName(section) || info.name;
    document.getElementById('practice-topic-title').textContent = sectionName;
    document.getElementById('practice-count').textContent = I18n.tf('practice_questions_count', questions.length);

    const container = document.getElementById('practice-questions');
    container.innerHTML = '';

    questions.forEach((rawQ, i) => {
      const q = I18n.getTranslatedQuestion(rawQ);
      const item = document.createElement('div');
      item.className = 'practice-question';

      let optionsHtml = '';
      for (const letter of ['A', 'B', 'C', 'D']) {
        const isCorrect = letter === q.rightAnswer;
        const cls = isCorrect ? 'practice-q-option correct' : 'practice-q-option';
        const checkMark = isCorrect ? '<span class="practice-q-check">✓</span>' : '';
        optionsHtml += `
          <div class="${cls}">
            <span class="practice-q-option-letter">${letter}.</span>
            <span class="practice-q-option-text">${this.escapeHtml(q.options[letter])}</span>
            ${checkMark}
          </div>
        `;
      }

      let explanationHtml = '';
      if (q.explanation) {
        explanationHtml = `
          <div class="practice-q-explanation">
            <strong>${I18n.t('practice_explanation_label')}</strong> ${this.escapeHtml(q.explanation)}
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
  showModal(title, body, onConfirm, opts) {
    opts = opts || {};
    const overlay = document.getElementById('modal-overlay');
    document.getElementById('modal-title').textContent = title;
    const bodyEl = document.getElementById('modal-body');
    bodyEl.innerHTML = '';
    // Split the body into one paragraph per sentence so multi-sentence
    // messages read as separate lines instead of a single block.
    const sentences = body.split(/(?<=\.)\s+/).map(s => s.trim()).filter(Boolean);
    sentences.forEach(s => {
      const p = document.createElement('p');
      p.textContent = s;
      bodyEl.appendChild(p);
    });
    overlay.classList.remove('hidden');

    const confirmBtn = document.getElementById('modal-confirm');
    const cancelBtn = document.getElementById('modal-cancel');
    const extraBtn = document.getElementById('modal-extra');

    confirmBtn.textContent = opts.confirmLabel || I18n.t('modal_confirm');

    if (opts.extraAction) {
      extraBtn.textContent = opts.extraAction.label;
      extraBtn.classList.remove('hidden');
    } else {
      extraBtn.classList.add('hidden');
    }

    const trigger = document.activeElement;
    this.lockScroll();

    const focusable = [cancelBtn, extraBtn, confirmBtn].filter(b => !b.classList.contains('hidden'));

    const onEscape = (e) => {
      if (e.key === 'Escape') close();
    };

    const onKeydown = (e) => {
      if (e.key === 'Tab') {
        const idx = focusable.indexOf(document.activeElement);
        if (e.shiftKey) {
          e.preventDefault();
          focusable[(idx - 1 + focusable.length) % focusable.length].focus();
        } else {
          e.preventDefault();
          focusable[(idx + 1) % focusable.length].focus();
        }
      } else if (e.key === 'Enter') {
        if (document.activeElement === confirmBtn) {
          close();
          onConfirm();
        }
      }
    };

    const onBackdrop = (e) => {
      if (e.target === overlay) close();
    };

    const close = () => {
      overlay.classList.add('hidden');
      this.unlockScroll();
      document.removeEventListener('keydown', onEscape);
      overlay.removeEventListener('keydown', onKeydown);
      overlay.removeEventListener('click', onBackdrop);
      confirmBtn.onclick = null;
      cancelBtn.onclick = null;
      extraBtn.onclick = null;
      if (trigger && typeof trigger.focus === 'function') trigger.focus();
    };

    document.addEventListener('keydown', onEscape);
    overlay.addEventListener('keydown', onKeydown);
    overlay.addEventListener('click', onBackdrop);

    confirmBtn.onclick = () => { close(); onConfirm(); };
    cancelBtn.onclick = close;
    if (opts.extraAction) {
      extraBtn.onclick = () => { close(); opts.extraAction.handler(); };
    }

    if (focusable.length > 0) focusable[0].focus();
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

// Save state before page unloads (e.g. refresh, close, navigate away)
window.addEventListener('beforeunload', () => App.saveState());
