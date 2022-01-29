// Theme Switcher
const getSelector = selector => document.querySelector(selector);
const html = getSelector('html');
const themeSwitch = getSelector('#theme-switch');
const themeText = getSelector('.theme-color');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

const setTheme = (theme) => {
  html.dataset.theme = theme;
  themeText.textContent = theme;
  theme === 'dark' ? themeSwitch.checked = true : themeSwitch.checked = false;
};

prefersDarkScheme ? setTheme('dark') : setTheme('light');

const toggleTheme = () => themeSwitch.checked ? setTheme('dark') : setTheme('light');

themeSwitch.addEventListener('change', toggleTheme);

// Speech Synthesis
const {speechSynthesis} = window;

const voicesSelect = getSelector('#voices');
const rate = getSelector('#rate');
const pitch = getSelector('#pitch');
const text = getSelector('#text');
const btnStop = getSelector('#btn-stop');
const btnStart = getSelector('#btn-start');
// const LANG_RU = 'ru-RU';
let voices = [];

const generateVoices = () => {
  voices = speechSynthesis.getVoices();

  voicesSelect.innerHTML = voices.map((voice, index) => /* voice.lang === LANG_RU && */
    `<option value='${index}'>${voice.name} (${voice.lang})</option>`)
    .join('');

  stopText();
};

const playText = () => {
  if (text.value) {
    const ssUtterance = new SpeechSynthesisUtterance(text.value);

    ssUtterance.voice = voices[voicesSelect.value];
    ssUtterance.pitch = pitch.value;
    ssUtterance.rate = rate.value;
    speechSynthesis.speaking ? speechSynthesis.pause() : speechSynthesis.speak(ssUtterance);
    speechSynthesis.paused ? speechSynthesis.resume() : speechSynthesis.speak(ssUtterance);

    ssUtterance.addEventListener('start', () => {
      btnStart.textContent = 'Pause';
      btnStart.classList.add('outline');
    });

    ssUtterance.addEventListener('end', () => {
      btnStart.textContent = 'Play';
      btnStart.classList.remove('outline');
      stopText();
    });

    ssUtterance.addEventListener('resume', () => {
      btnStart.textContent = 'Pause';
      btnStart.classList.add('outline');
    });

    ssUtterance.addEventListener('pause', () => {
      btnStart.textContent = 'Play';
      btnStart.classList.remove('outline');
    });
  }
};

const stopText = () => speechSynthesis.cancel();

const changeRate = () => {
  getSelector('.rate-value').textContent = rate.value;
  stopText();
};

const changePitch = () => {
  getSelector('.pitch-value').textContent = pitch.value;
  stopText();
};

generateVoices();
btnStart.addEventListener('click', playText);
btnStop.addEventListener('click', stopText);
rate.addEventListener('change', changeRate);
pitch.addEventListener('change', changePitch);
voicesSelect.addEventListener('change', stopText);
text.addEventListener('input', stopText);
speechSynthesis.addEventListener('voiceschanged', generateVoices);
