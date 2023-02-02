import { getTimerElems, getFormattedTime, changePageTitle } from './utils.js';
import { defaultOptions } from './default.js';

function timerModule(className, props) {
  const MAX_VALUE = 99;
  const ITEM_CLASS_NAME = 'timer-item';
  const DIGIT_CLASS_NAME = 'timer-digit';
  const options = Object.assign(defaultOptions, props);
  const wrapper = document.querySelector(className);
  const isTypeDate = options.type === 'date';
  const isTypeNumber = options.type === 'number';

  const timeUnits = {
    secInMin: 60,
    secInHour: 60 * 60,
    msInSec: 1000,
  };

  const timerClassNames = ['timer-hours', 'timer-minutes', 'timer-seconds'];

  if (!wrapper) return;

  let remainingTime;
  let destroyState = false;

  const createStructure = () => {
    const pattern = `
    <span class="${DIGIT_CLASS_NAME}"></span>
    <span class="${DIGIT_CLASS_NAME}"></span>`;

    for (const className of timerClassNames) {
      const div = document.createElement('DIV');
      div.classList.add(ITEM_CLASS_NAME, className);
      div.insertAdjacentHTML('afterbegin', pattern);
      wrapper.appendChild(div);
    }
  };
  if (options.autoGenerate) createStructure();

  const timerElems = getTimerElems(wrapper, timerClassNames);
  const getRemainingTime = () => Math.floor(options.time * timeUnits.secInHour);

  const getRemainingTimeOnDate = () => {
    const currentTime = new Date().getTime();
    const countTime = new Date(options.time).getTime();
    const time = Math.floor((countTime - currentTime) / timeUnits.msInSec);
    return time;
  };

  const getTimeUnits = (time) => {
    const obj = {
      hours: Math.floor(time / timeUnits.secInHour),
      minutes: Math.floor((time % timeUnits.secInHour) / timeUnits.secInMin),
      seconds: time % timeUnits.secInMin,
    };
    return obj;
  };

  const splitUnit = (unit, place) => {
    const splitItems = place.querySelectorAll(`.${DIGIT_CLASS_NAME}`);
    const [leftItem, rightItem] = splitItems;
    const [leftDigit, rightDigit] = unit;
    const innerValue = [];

    if (unit > MAX_VALUE) {
      throw new Error(`The timer value should not exceed ${MAX_VALUE}`);
    }

    for (const item of splitItems) {
      innerValue.push(item.innerHTML);
      setTimeout(() => {
        const [leftValue, rightValue] = innerValue;
        if (leftDigit !== leftValue) {
          leftItem.innerHTML = leftDigit;
        }
        if (rightDigit !== rightValue) {
          rightItem.innerHTML = rightDigit;
        }
      }, 0);
    }
  };

  const timerRender = (time) => {
    const units = getFormattedTime(time);
    for (let index = 0; index < timerElems.length; index++) {
      const place = timerElems[index];
      const unit = units[index];
      splitUnit(unit, place);
    }
  };

  const setRemainingTime = () => {
    if (isTypeDate) {
      remainingTime = getRemainingTimeOnDate();
    }
    if (isTypeNumber) {
      remainingTime = getRemainingTime();
    }
  };

  const insertBeforeStartTimer = () => {
    let startTime = remainingTime;
    if (startTime < 0) startTime = 0;
    const time = getTimeUnits(startTime);
    timerRender(time);
  };

  const validateTimer = (value) => {
    if (isTypeNumber) {
      if (options.time < 0) {
        throw new Error('Input value is smaller than 0');
      }
      if (typeof options.time !== 'number') {
        throw new Error('Invalid input value');
      }
    }
    if (isTypeDate) {
      if (isNaN(value)) {
        throw new Error('Invalid input value');
      }
      if (typeof options.time !== 'string') {
        throw new Error('Input value is not a string');
      }
    }
  };

  const destroy = () => {
    wrapper.remove();
    destroyState = true;
  };

  function setTimer() {
    if (remainingTime <= 0) return;
    if (isTypeDate) {
      remainingTime = getRemainingTimeOnDate();
    }
    if (isTypeNumber) --remainingTime;
    const time = getTimeUnits(remainingTime);
    timerRender(time);
    if (options.changeTitle) changePageTitle(time);
  }

  (function initTimer() {
    setRemainingTime();
    validateTimer(remainingTime);
    insertBeforeStartTimer();
    const timer = setInterval(() => {
      setTimer(timer);
      if (options.autoDestroy && remainingTime < 0) {
        destroy();
      }
      if (destroyState) clearInterval(timer);
    }, timeUnits.msInSec);
  })();
}

export { timerModule };
