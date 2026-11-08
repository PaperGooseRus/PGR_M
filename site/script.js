/* ============================================================
   PaperGooseRus — landing scripts
   i18n (RU/EN), terminal animation, tabs, reveal-on-scroll
   ============================================================ */

'use strict';

/* ---------------- i18n dictionary ---------------- */

const I18N = {
  ru: {
    'nav.features': 'Возможности',
    'nav.how': 'Как это работает',
    'nav.demo': 'Демо',
    'nav.cta': 'Ранний доступ',

    'hero.badge': 'Система сборки нового поколения',
    'hero.title': 'Сборка на GCC.<br>Понимание — <span class="accent">нейросетью</span>.',
    'hero.subtitle':
      'PaperGooseRus собирает проекты по шагам, обучает нейросеть на артефактах сборки и восстанавливает читаемый C/C++ код из бинарников.',
    'hero.cta': 'Получить ранний доступ',
    'hero.cta2': 'Смотреть демо ↓',
    'hero.stat1': 'трассировка шагов',
    'hero.stat2': 'восстановленный код',
    'hero.stat3': 'обучение на сборке',

    'features.title': 'Возможности',
    'features.subtitle': 'Один конвейер: от исходников до понимания чужого кода',
    'feat1.title': 'Пошаговая сборка',
    'feat1.text':
      'Система pgr-make собирает проекты на GCC по шагам: каждый компиляторный проход, флаг и артефакт фиксируется и становится обучающими данными.',
    'feat2.title': 'Обучение нейросети',
    'feat2.text':
      'NN обучается на парах «бинарник → исходник» из реальных сборок: структура кода, стили именования, паттерны оптимизаций GCC.',
    'feat3.title': 'Реверс-инжиниринг',
    'feat3.text':
      'Обученная модель восстанавливает читаемый C/C++ код из исполняемых файлов — с осмысленными именами и приближенными к оригиналу структурами.',

    'how.title': 'Как это работает',
    'how.subtitle': 'Три шага конвейера PaperGooseRus',
    'step1.title': 'Build',
    'step1.text':
      'Проект собирается на GCC по шагам. Мы получаем полную трассировку: единицы трансляции, вызовы оптимизаторов, промежуточные представления.',
    'step2.title': 'Train',
    'step2.text':
      'На парах «исходник ↔ результат компиляции» обучается нейросеть. Чем больше проектов проходит через конвейер — тем умнее модель.',
    'step3.title': 'Reverse',
    'step3.text':
      'Подайте модели чужой бинарник — она вернёт читаемый C/C++ код: функции, структуры и логику, приближённые к оригиналу.',

    'demo.title': 'Демо',
    'demo.subtitle': 'Взгляните на конвейер в действии',
    'demo.tabBuild': 'Лог сборки',
    'demo.tabCode': 'Восстановленный код',
    'demo.c1': 'сохранить хвост',
    'demo.c2': 'разворот указателя',
    'demo.c3': 'новая голова',

    'cta.title': 'Получите ранний доступ',
    'cta.text':
      'Оставьте email — пришлём инвайт в закрытую бету pgr-make и примеры восстановленного кода.',
    'cta.label': 'Ваш email',
    'cta.button': 'Запросить инвайт',
    'cta.note': 'Без спама. Только приглашение и новости релиза.',
    'cta.success': 'Готово! Мы отправим инвайт на {email}.',
    'cta.invalid': 'Проверьте адрес: он выглядит некорректно.',

    'footer.text': '© {year} PaperGooseRus — сборка, обучение, реверс.',

    'terminal.title': 'pgr-make — build.log',
    'terminal.lines': [
      { text: '$ pgr-make build ./legacy-project', cls: 't-cmd', delay: 600 },
      { text: '[1/6] gcc -c main.c -o build/main.o            …OK (120 ms)', cls: '' },
      { text: '[2/6] gcc -c parser.c -o build/parser.o          …OK (95 ms)', cls: '' },
      { text: '[3/6] gcc -c ir_gen.c -o build/ir_gen.o          …OK (88 ms)', cls: '' },
      { text: '[4/6] gcc build/*.o -o build/app                 …OK (210 ms)', cls: '' },
      { text: '[5/6] tracing optimization passes                …captured', cls: 't-blue' },
      { text: '[6/6] NN training on 3 translation units         …done', cls: 't-blue' },
      { text: '✔ model updated — reverse mode ready', cls: '' },
    ],
  },

  en: {
    'nav.features': 'Features',
    'nav.how': 'How it works',
    'nav.demo': 'Demo',
    'nav.cta': 'Early access',

    'hero.badge': 'Next-generation build system',
    'hero.title': 'Built with GCC.<br>Understood by a <span class="accent">neural network</span>.',
    'hero.subtitle':
      'PaperGooseRus builds projects step by step, trains a neural network on build artifacts and recovers readable C/C++ code from binaries.',
    'hero.cta': 'Get early access',
    'hero.cta2': 'Watch the demo ↓',
    'hero.stat1': 'step-level tracing',
    'hero.stat2': 'recovered C/C++ code',
    'hero.stat3': 'NN trained on builds',

    'features.title': 'Features',
    'features.subtitle': 'One pipeline: from sources to understanding foreign code',
    'feat1.title': 'Step-by-step builds',
    'feat1.text':
      'The pgr-make system builds GCC projects step by step: every compiler pass, flag and artifact is captured and turned into training data.',
    'feat2.title': 'Neural network training',
    'feat2.text':
      'The NN learns from “binary → source” pairs produced by real builds: code structure, naming style, GCC optimization patterns.',
    'feat3.title': 'Reverse engineering',
    'feat3.text':
      'The trained model recovers readable C/C++ code from executables — with meaningful names and structures close to the original.',

    'how.title': 'How it works',
    'how.subtitle': 'Three steps of the PaperGooseRus pipeline',
    'step1.title': 'Build',
    'step1.text':
      'The project is built with GCC step by step. We capture full traces: translation units, optimizer invocations, intermediate representations.',
    'step2.title': 'Train',
    'step2.text':
      'The neural network is trained on “source ↔ compilation result” pairs. The more projects pass through the pipeline, the smarter it gets.',
    'step3.title': 'Reverse',
    'step3.text':
      'Feed the model a foreign binary — it returns readable C/C++ code: functions, structs and logic close to the original.',

    'demo.title': 'Demo',
    'demo.subtitle': 'See the pipeline in action',
    'demo.tabBuild': 'Build log',
    'demo.tabCode': 'Recovered code',
    'demo.c1': 'save the tail',
    'demo.c2': 'reverse the pointer',
    'demo.c3': 'new head',

    'cta.title': 'Get early access',
    'cta.text':
      'Leave your email — we will send an invite to the closed pgr-make beta and samples of recovered code.',
    'cta.label': 'Your email',
    'cta.button': 'Request an invite',
    'cta.note': 'No spam. Just the invitation and release news.',
    'cta.success': 'Done! We will send the invite to {email}.',
    'cta.invalid': 'Please check the address: it does not look valid.',

    'footer.text': '© {year} PaperGooseRus — build, train, reverse.',

    'terminal.title': 'pgr-make — build.log',
    'terminal.lines': [
      { text: '$ pgr-make build ./legacy-project', cls: 't-cmd', delay: 600 },
      { text: '[1/6] gcc -c main.c -o build/main.o            …OK (120 ms)', cls: '' },
      { text: '[2/6] gcc -c parser.c -o build/parser.o        …OK (95 ms)', cls: '' },
      { text: '[3/6] gcc -c ir_gen.c -o build/ir_gen.o        …OK (88 ms)', cls: '' },
      { text: '[4/6] gcc build/*.o -o build/app               …OK (210 ms)', cls: '' },
      { text: '[5/6] tracing optimization passes              …captured', cls: 't-blue' },
      { text: '[6/6] NN training on 3 translation units       …done', cls: 't-blue' },
      { text: '✔ model updated — reverse mode ready', cls: '' },
    ],
  },
};

/* ---------------- State & helpers ---------------- */

let currentLang = localStorage.getItem('pgr-lang') || 'ru';
let terminalTimer = null;

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function t(key) {
  return I18N[currentLang][key] ?? I18N.ru[key] ?? key;
}

/* ---------------- Language switching ---------------- */

function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem('pgr-lang', lang);
  document.documentElement.lang = lang;

  // plain text nodes
  $$('[data-i18n]').forEach((el) => {
    const val = t(el.dataset.i18n);
    if (typeof val === 'string') el.textContent = val.replace('{year}', new Date().getFullYear());
  });

  // nodes allowed to contain markup (e.g. <br>, accent spans)
  $$('[data-i18n-html]').forEach((el) => {
    const val = t(el.dataset.i18nHtml);
    if (typeof val === 'string') el.innerHTML = val;
  });

  // language switch buttons
  $$('.lang-btn').forEach((btn) => {
    const active = btn.dataset.lang === lang;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', String(active));
  });

  // placeholder of the email input
  const email = $('#email');
  if (email) email.setAttribute('placeholder', 'you@company.com');

  // restart the terminal animation in the new language
  runTerminal();
}

/* ---------------- Hero terminal animation ---------------- */

function runTerminal() {
  const output = $('#terminal-output');
  const title = $('.terminal-title');
  if (!output) return;

  clearTimeout(terminalTimer);
  output.textContent = '';
  if (title) title.textContent = t('terminal.title');

  const lines = t('terminal.lines');
  const caret = document.createElement('span');
  caret.className = 'caret';

  let lineIndex = 0;

  function typeLine() {
    if (lineIndex >= lines.length) {
      output.appendChild(caret);
      return;
    }

    const { text, cls = '', delay = 350 } = lines[lineIndex];
    const lineEl = document.createElement('span');
    if (cls) lineEl.className = cls;
    output.appendChild(lineEl);
    output.appendChild(document.createTextNode('\n'));

    let charIndex = 0;
    const speed = text.startsWith('$') ? 55 : 12;

    (function typeChar() {
      if (charIndex < text.length) {
        lineEl.textContent = text.slice(0, ++charIndex);
        terminalTimer = setTimeout(typeChar, speed);
      } else {
        lineIndex += 1;
        terminalTimer = setTimeout(typeLine, delay);
      }
    })();
  }

  typeLine();
}

/* ---------------- Demo tabs ---------------- */

function initTabs() {
  const tabs = $$('.tab');
  const panels = $$('.tab-panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((tb) => {
        const active = tb === tab;
        tb.classList.toggle('active', active);
        tb.setAttribute('aria-selected', String(active));
      });
      panels.forEach((p) => {
        const active = p.id === tab.getAttribute('aria-controls');
        p.classList.toggle('active', active);
        p.hidden = !active;
      });
    });
  });
}

/* ---------------- Reveal on scroll ---------------- */

function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  $$('.reveal').forEach((el) => observer.observe(el));
}

/* ---------------- CTA form ---------------- */

function initForm() {
  const form = $('#cta-form');
  const input = $('#email');
  const note = $('#cta-note');
  if (!form || !input) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = input.value.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

    if (!valid) {
      input.classList.add('error');
      note.textContent = t('cta.invalid');
      return;
    }

    input.classList.remove('error');
    note.textContent = t('cta.success').replace('{email}', value);
    form.reset();
  });

  input.addEventListener('input', () => input.classList.remove('error'));
}

/* ---------------- Init ---------------- */

document.addEventListener('DOMContentLoaded', () => {
  applyLang(currentLang);
  initTabs();
  initReveal();
  initForm();

  $$('.lang-btn').forEach((btn) =>
    btn.addEventListener('click', () => applyLang(btn.dataset.lang))
  );
});
