import { getTimerElems, getFormattedTime, changePageTitle } from './utils.js';
import { defaultOptions } from './default.js';

function timerModule(className, props) {
  const SPLIT_CLASS_NAME = 'timer-split-item';
  const SPLIT_MAX_VALUE = 99;
  const ITEM_CLASS_NAME = 'timer-item';
  const options = Object.assign(defaultOptions, props);
  const wrapper = document.querySelector(className);
  const isTypeDate = options.type === 'date';
  const isTypeNumber = options.type === 'number';
  const isSplitTimer = wrapper.classList.contains('timer-split');
  let remainingTime;
  let destroyState = false;

  const timeUnits = {
    secInMin: 60,
    secInHour: 60 * 60,
    msInSec: 1000,
  };

  const timerClassNames = ['timer-hours', 'timer-minutes', 'timer-seconds'];

  const createStructure = () => {
    for (const className of timerClassNames) {
      const div = document.createElement('DIV');
      div.classList.add(ITEM_CLASS_NAME, className);
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

  const validateSplitTimer = (value) => {
    if (value > SPLIT_MAX_VALUE) {
      throw new Error(`The timer value should not exceed ${SPLIT_MAX_VALUE}`);
    }
  };

  const getTime = (time) => {
    const obj = {
      hours: Math.floor(time / timeUnits.secInHour),
      minutes: Math.floor((time % timeUnits.secInHour) / timeUnits.secInMin),
      seconds: time % timeUnits.secInMin,
    };
    if (isSplitTimer) validateSplitTimer(obj.hours);
    return obj;
  };

  const callInsertFunc = (time, callback) => {
    const units = getFormattedTime(time);
    for (let index = 0; index < timerElems.length; index++) {
      const place = timerElems[index];
      const unit = units[index];
      callback(unit, place);
    }
  };

  const defaultInsert = (unit, place) => {
    if (place.innerHTML !== unit) {
      place.innerHTML = unit;
    }
  };

  const splitUnit = (unit, place) => {
    const splitUnites = unit.split('');
    const splitItems = place.querySelectorAll(`.${SPLIT_CLASS_NAME}`);
    const splitValue = [];

    for (const [index, item] of splitItems.entries()) {
      const splitNum = splitUnites[index];
      splitValue.push(item.innerHTML);
      setTimeout(() => {
        if (splitValue.join('') !== unit) {
          item.innerHTML = splitNum;
        }
      }, 0);
    }
  };

  const createSplitElements = (places) => {
    const pattern = `
    <span class="${SPLIT_CLASS_NAME}"></span>
    <span class="${SPLIT_CLASS_NAME}"></span>`;

    for (const item of places) {
      // Check for the element in HTML
      if (item.firstElementChild === null) {
        item.innerHTML = pattern;
      }
    }
  };

  const insertTimeInHtml = (time) => {
    if (isSplitTimer) {
      createSplitElements(timerElems);
      callInsertFunc(time, splitUnit);
    } else callInsertFunc(time, defaultInsert);
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
    const time = getTime(startTime);
    insertTimeInHtml(time);
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

  function setTimer(timer) {
    if (isTypeDate) {
      remainingTime = getRemainingTimeOnDate();
    }
    if (remainingTime < 0) {
      clearInterval(timer);
      return;
    }
    const time = getTime(remainingTime);
    insertTimeInHtml(time);
    if (options.changeTitle) changePageTitle(time);
    if (isTypeNumber) remainingTime--;
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
