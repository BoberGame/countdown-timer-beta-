function timerModule(inputTime, type = 0) {
  const SECONDS_IN_HOUR = 60 * 60;
  const SECONDS_IN_MIN = 60;
  const MS_IN_SECOND = 1000;
  const SPLIT_CLASS_NAME = 'timer-number';
  const MAX_VALUE_SPLIT_TIMER = 99;
  const wrapper = document.querySelector('.timer');
  const isTypeDate = (type === 0 || type === 'date');
  const isTypeNumber = (type === 1 || type === 'number');
  const isSplitTimer = wrapper.classList.contains('timer-split');

  if (!wrapper) throw new Error('Timer is not defind');

  const timerElems = [
    wrapper.querySelector('.timer-hours'),
    wrapper.querySelector('.timer-minutes'),
    wrapper.querySelector('.timer-seconds'),
  ];

  const fixNumber = (num) => ((num < 10) ? '0' + num : num.toString());

  const getRemainingTime = () => Math.floor(inputTime * SECONDS_IN_HOUR);

  const getRemainingTimeOnDate = () => {
    const currentTime = new Date().getTime();
    const countTime = new Date(inputTime).getTime();
    const time = Math.floor((countTime - currentTime) / MS_IN_SECOND);
    if (isNaN(time)) {
      throw new Error('Invalid input value');
    }
    return time;
  };

  const getTime = (time) => {
    const obj = {
      hours: Math.floor(time / SECONDS_IN_HOUR),
      minutes: Math.floor((time % SECONDS_IN_HOUR) / SECONDS_IN_MIN),
      seconds: time % SECONDS_IN_MIN,
    };
    if (obj.hours > MAX_VALUE_SPLIT_TIMER && isSplitTimer) {
      throw new Error('The split timer value should not be more than 99');
    }
    return obj;
  };

  const getFormattedTime = (obj) => {
    const array = [];
    for (const key of Object.keys(obj)) {
      const item = obj[key];
      array.push(fixNumber(item));
    }
    return array;
  };

  const iterateTimer = (time, callback) => {
    const units = getFormattedTime(time);
    for (let index = 0; index < timerElems.length; index++) {
      const place = timerElems[index];
      const unit = units[index];
      callback(unit, place);
    }
  };

  const defaultInnerTimer = (unit, place) => {
    if (place.innerHTML !== unit) {
      place.innerHTML = unit;
    }
  };

  const splitTimer = (unit, place) => {
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
      if (item.firstElementChild === null) {
        item.innerHTML = pattern;
      }
    }
  };

  const insertTimerInHtml = (time) => {
    if (isSplitTimer) {
      createSplitElements(timerElems);
      iterateTimer(time, splitTimer);
    } else iterateTimer(time, defaultInnerTimer);
  };

  const changePageTitle = (units) => {
    const array = getFormattedTime(units);
    const [hh, mm, ss] = array;
    document.title = `${hh}:${mm}:${ss}`;
  };

  let remainingTime = getRemainingTime();

  function setTimer(timer) {
    if (isTypeDate) remainingTime = getRemainingTimeOnDate();
    if (remainingTime < 0) {
      clearInterval(timer);
      return;
    }
    const time = getTime(remainingTime);
    insertTimerInHtml(time);
    changePageTitle(time);
    if (isTypeNumber) remainingTime--;
  }

  const insertBeforeStartTimer = () => {
    if (isTypeDate) {
      remainingTime = getRemainingTimeOnDate();
    }
    if (remainingTime < 0) {
      remainingTime = 0;
    }
    const time = getTime(remainingTime);
    insertTimerInHtml(time);
  };

  const validateTimer = () => {
    if (isTypeNumber) {
      if (inputTime < 0) {
        throw new Error('Input value is smaller than 0');
      }
      if (typeof inputTime === 'string') {
        throw new Error('Invalid input value');
      }
    }
    return true;
  };

  function initTimer() {
    if (!validateTimer()) return;
    insertBeforeStartTimer();
    const timer = setInterval(() => {
      setTimer.call(null, timer);
    }, MS_IN_SECOND);
  }

  initTimer();
}
export { timerModule };
