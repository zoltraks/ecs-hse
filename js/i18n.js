'use strict';

// ===== Internationalization Module =====

const FLAG_GB = '<svg viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg"><clipPath id="flag-uk-clip"><path d="M30,15h30v15zv15h-30zh-30v-15zv-15h30z"/></clipPath><path d="M0,0v30h60V0z" fill="#012169"/><path d="M0,0L60,30M60,0L0,30" stroke="#fff" stroke-width="6"/><path d="M0,0L60,30M60,0L0,30" clip-path="url(#flag-uk-clip)" stroke="#C8102E" stroke-width="4"/><path d="M30,0v30M0,15h60" stroke="#fff" stroke-width="10"/><path d="M30,0v30M0,15h60" stroke="#C8102E" stroke-width="6"/></svg>';

const FLAG_PL = '<svg viewBox="0 0 16 10" xmlns="http://www.w3.org/2000/svg"><rect width="16" height="5" fill="#fff"/><rect y="5" width="16" height="5" fill="#d4213d"/></svg>';

window.LANGUAGES = {
  en: { name: 'English', flag: FLAG_GB },
  pl: { name: 'Polski', flag: FLAG_PL },
};

const LOCALE_KEY = 'ecs-hse-locale';

window.I18n = {
  locale: 'en',
  questionTranslations: {},

  T: {
    en: {
      app_title: 'ECS HSE Test',
      app_subtitle: 'Health, Safety & Environmental Assessment',
      home_hero_title: 'ECS Health, Safety & Environmental Assessment',
      home_hero_subtitle: 'Practice for the ECS HSE Awareness Assessment with the official question bank',
      home_info_questions_per_test: 'Questions per test',
      home_info_time_limit: 'Time limit',
      home_info_pass_mark: 'Pass mark (86%)',
      home_info_total_bank: 'Total question bank',
      home_action_full_test: 'Full Test',
      home_action_full_test_desc: '{0} random questions from all {1} topics, {2}-minute timer. Simulates the real assessment.',
      home_action_full_test_btn: 'Begin Test',
      home_action_quick_quiz: 'Quick Quiz',
      home_action_quick_quiz_desc: '20 random questions, no timer. Great for a quick knowledge check.',
      home_action_quick_quiz_btn: 'Start Quiz',
      home_action_all_questions: 'All Questions',
      home_action_all_questions_desc: 'All {0} questions in topic order, no timer. Answers are shuffled for a full practice run.',
      home_action_all_questions_btn: 'Check All',
      home_action_practice: 'Practice Topics',
      home_action_practice_desc: 'Browse and study all {0} questions organised by topic, with answers and explanations.',
      home_action_practice_btn: 'Browse Topics',
      home_topics_title: 'Assessment Topics',
      home_topics_intro: 'The real assessment draws questions from these {0} topics in the proportions shown:',
      home_topic_in_test: 'in test',
      test_quit: 'Quit',
      test_reveal: 'Reveal',
      test_flag: 'Flag',
      test_review: 'Review',
      test_previous: 'Previous',
      test_next: 'Next',
      test_question_of: 'Question {0} of {1}',
      review_title: 'Review Answers',
      review_intro: '{0} of {1} questions answered. Click any question to jump to it.',
      review_back: 'Back to Test',
      review_submit: 'Submit Test',
      results_passed: 'Passed!',
      results_not_passed: 'Not Passed',
      results_pass_mark_note: '(pass mark: {0}/{1})',
      results_stat_correct: 'Correct',
      results_stat_incorrect: 'Incorrect',
      results_stat_unanswered: 'Unanswered',
      results_stat_time: 'Time Used',
      results_retake: 'Retake Test',
      results_home: 'Home',
      results_performance_title: 'Performance by Topic',
      results_detailed_title: 'Detailed Review',
      results_detailed_hint: 'Review each question with the correct answer and explanation.',
      results_explanation_label: 'Explanation: ',
      results_question_label: 'Question {0}',
      results_status_unanswered: 'Unanswered',
      results_status_correct: 'Correct',
      results_status_incorrect: 'Incorrect',
      practice_quit: 'Quit',
      practice_back: 'Back',
      practice_topics_title: 'Practice Topics',
      practice_questions_count: '{0} questions',
      practice_questions_in_bank: '{0} questions in bank',
      practice_explanation_label: 'Explanation:',
      modal_cancel: 'Cancel',
      modal_confirm: 'Confirm',
      modal_cheater_title: 'Become a Cheater',
      modal_cheater_body: 'Cheater mode lets you reveal correct answers and pause the timer during a test. The real ECS HSE assessment does not offer any of these options. Relying on it will not prepare you for the actual test. Are you sure you want to enable it?',
      modal_cheater_btn: 'Cheater',
      modal_leave_all_title: 'Leave All Questions?',
      modal_leave_all_body: 'Your answers will be saved so you can come back later. Use Clear to discard all answers and start fresh next time. What would you like to do?',
      modal_leave_all_leave: 'Leave',
      modal_leave_all_clear: 'Clear',
      modal_leave_test_title: 'Leave Test?',
      modal_leave_test_body: 'Your test progress will be lost. Are you sure you want to leave?',
      modal_quit_all_title: 'Quit All Questions?',
      modal_quit_all_body: 'Your answers will be saved so you can come back later. Use Clear to discard all answers and start fresh next time. What would you like to do?',
      modal_quit_all_leave: 'Leave',
      modal_quit_all_clear: 'Clear',
      modal_quit_test_title: 'Quit Test?',
      modal_quit_test_body: 'Your progress will be lost. Are you sure you want to quit?',
      lang_title: 'Select Language',
      lang_close: 'Close',
      timer_pause_resume: 'Timer, click to pause or resume',
      logo_aria: 'Go to home screen',
      test_label_full: 'Full Test',
      test_label_quick: 'Quick Quiz',
      test_label_all: 'All Questions',
    },

    pl: {
      app_title: 'Test ECS BHP',
      app_subtitle: 'Ocena zdrowia, bezpieczeństwa i środowiska',
      home_hero_title: 'Ocena zdrowia, bezpieczeństwa i środowiska ECS',
      home_hero_subtitle: 'Ćwicz do egzaminu świadomości BHP ECS z oficjalnym bankiem pytań',
      home_info_questions_per_test: 'Pytań w teście',
      home_info_time_limit: 'Limit czasu',
      home_info_pass_mark: 'Próg zdawalności (86%)',
      home_info_total_bank: 'Całkowity bank pytań',
      home_action_full_test: 'Pełny test',
      home_action_full_test_desc: '{0} losowych pytań ze wszystkich {1} tematów, limit czasu {2} min. Symuluje prawdziwy egzamin.',
      home_action_full_test_btn: 'Rozpocznij test',
      home_action_quick_quiz: 'Szybki quiz',
      home_action_quick_quiz_desc: '20 losowych pytań, bez limitu czasu. Idealne do szybkiego sprawdzenia wiedzy.',
      home_action_quick_quiz_btn: 'Rozpocznij quiz',
      home_action_all_questions: 'Wszystkie pytania',
      home_action_all_questions_desc: 'Wszystkie {0} pytań w kolejności tematów, bez limitu czasu. Odpowiedzi są tasowane dla pełnej sesji ćwiczeniowej.',
      home_action_all_questions_btn: 'Sprawdź wszystkie',
      home_action_practice: 'Tematy do nauki',
      home_action_practice_desc: 'Przeglądaj i ucz się wszystkich {0} pytań uporządkowanych według tematów, z odpowiedziami i wyjaśnieniami.',
      home_action_practice_btn: 'Przeglądaj tematy',
      home_topics_title: 'Tematy egzaminu',
      home_topics_intro: 'Prawdziwy egzamin losuje pytania z {0} tematów w następujących proporcjach:',
      home_topic_in_test: 'w teście',
      test_quit: 'Zakończ',
      test_reveal: 'Odkryj',
      test_flag: 'Oznacz',
      test_review: 'Przegląd',
      test_previous: 'Poprzednie',
      test_next: 'Następne',
      test_question_of: 'Pytanie {0} z {1}',
      review_title: 'Przegląd odpowiedzi',
      review_intro: 'Udzielono odpowiedzi na {0} z {1} pytań. Kliknij pytanie, aby przejść do niego.',
      review_back: 'Powrót do testu',
      review_submit: 'Zakończ test',
      results_passed: 'Zdane!',
      results_not_passed: 'Niezdane',
      results_pass_mark_note: '(próg: {0}/{1})',
      results_stat_correct: 'Poprawne',
      results_stat_incorrect: 'Niepoprawne',
      results_stat_unanswered: 'Bez odpowiedzi',
      results_stat_time: 'Czas',
      results_retake: 'Powtórz test',
      results_home: 'Strona główna',
      results_performance_title: 'Wyniki według tematów',
      results_detailed_title: 'Szczegółowy przegląd',
      results_detailed_hint: 'Przeglądaj każde pytanie z poprawną odpowiedzią i wyjaśnieniem.',
      results_explanation_label: 'Wyjaśnienie: ',
      results_question_label: 'Pytanie {0}',
      results_status_unanswered: 'Bez odpowiedzi',
      results_status_correct: 'Poprawne',
      results_status_incorrect: 'Niepoprawne',
      practice_quit: 'Zakończ',
      practice_back: 'Wstecz',
      practice_topics_title: 'Tematy do nauki',
      practice_questions_count: '{0} pytań',
      practice_questions_in_bank: '{0} pytań w banku',
      practice_explanation_label: 'Wyjaśnienie:',
      modal_cancel: 'Anuluj',
      modal_confirm: 'Potwierdź',
      modal_cheater_title: 'Włącz tryb oszusta',
      modal_cheater_body: 'Tryb oszusta pozwala odkryć poprawne odpowiedzi i wstrzymać licznik czasu podczas testu. Prawdziwy egzamin ECS BHP nie oferuje żadnej z tych opcji. Poleganie na tym nie przygotuje Cię do rzeczywistego testu. Czy na pewno chcesz go włączyć?',
      modal_cheater_btn: 'Oszust',
      modal_leave_all_title: 'Opuścić wszystkie pytania?',
      modal_leave_all_body: 'Twoje odpowiedzi zostaną zapisane, abyś mógł wrócić później. Użyj Wyczyść, aby odrzucić wszystkie odpowiedzi i zacząć od nowa. Co chcesz zrobić?',
      modal_leave_all_leave: 'Opuść',
      modal_leave_all_clear: 'Wyczyść',
      modal_leave_test_title: 'Opuścić test?',
      modal_leave_test_body: 'Twój postęp w teście zostanie utracony. Czy na pewno chcesz wyjść?',
      modal_quit_all_title: 'Zakończyć wszystkie pytania?',
      modal_quit_all_body: 'Twoje odpowiedzi zostaną zapisane, abyś mógł wrócić później. Użyj Wyczyść, aby odrzucić wszystkie odpowiedzi i zacząć od nowa. Co chcesz zrobić?',
      modal_quit_all_leave: 'Opuść',
      modal_quit_all_clear: 'Wyczyść',
      modal_quit_test_title: 'Zakończyć test?',
      modal_quit_test_body: 'Twój postęp zostanie utracony. Czy na pewno chcesz zakończyć?',
      lang_title: 'Wybierz język',
      lang_close: 'Zamknij',
      timer_pause_resume: 'Licznik czasu, kliknij aby wstrzymać lub wznowić',
      logo_aria: 'Przejdź do strony głównej',
      test_label_full: 'Pełny test',
      test_label_quick: 'Szybki quiz',
      test_label_all: 'Wszystkie pytania',
    },
  },

  init() {
    try {
      const saved = localStorage.getItem(LOCALE_KEY);
      if (saved && LANGUAGES[saved]) {
        this.locale = saved;
      }
    } catch (e) {
      // ignore
    }
    document.documentElement.lang = this.locale;
  },

  t(key) {
    const dict = this.T[this.locale] || this.T.en;
    return dict[key] || this.T.en[key] || key;
  },

  tf(key, ...args) {
    let str = this.t(key);
    for (let i = 0; i < args.length; i++) {
      str = str.replace('{' + i + '}', args[i]);
    }
    return str;
  },

  tQuestion(id, field) {
    const qt = this.questionTranslations[this.locale];
    if (!qt || !qt[id]) return null;
    return qt[id][field] || null;
  },

  tQuestionOption(id, letter) {
    const qt = this.questionTranslations[this.locale];
    if (!qt || !qt[id] || !qt[id].options) return null;
    return qt[id].options[letter] || null;
  },

  tSectionName(section) {
    const qt = this.questionTranslations[this.locale];
    if (!qt) return null;
    const key = 'section_' + section;
    return qt[key] || null;
  },

  getTranslatedQuestion(q) {
    if (this.locale === 'en') return q;
    const qt = this.questionTranslations[this.locale];
    if (!qt) return q;
    const translated = qt[q.id];
    if (!translated) return q;

    let translatedOptions = q.options;
    if (translated.options) {
      if (q.originalLetters) {
        translatedOptions = {};
        for (const letter of ['A', 'B', 'C', 'D']) {
          const origLetter = q.originalLetters[letter];
          translatedOptions[letter] = translated.options[origLetter] || q.options[letter];
        }
      } else {
        translatedOptions = translated.options;
      }
    }

    return {
      ...q,
      sectionName: this.tSectionName(q.section) || q.sectionName,
      question: translated.question || q.question,
      options: translatedOptions,
      explanation: translated.explanation || q.explanation,
    };
  },

  setLocale(locale) {
    if (!LANGUAGES[locale]) return;
    this.locale = locale;
    try {
      localStorage.setItem(LOCALE_KEY, locale);
    } catch (e) {
      // ignore
    }
    document.documentElement.lang = locale;
    window.dispatchEvent(new CustomEvent('localechange'));
  },

  registerTranslations(locale, data) {
    this.questionTranslations[locale] = data;
  },
};

I18n.init();
