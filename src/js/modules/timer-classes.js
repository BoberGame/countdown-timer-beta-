const SECONDS_IN_HOUR = 60 * 60;
const SECONDS_IN_MIN = 60;
const MS_IN_SECOND = 1000;

const fixNumber = (num) => ((num < 10) ? '0' + num : num.toString());

class SplitCountdownTimer {
  SPLIT_CLASS_NAME = 'timer-number';
  MAX_VALUE_SPLIT_TIMER = 99;

  validateTimer(obj) {
    if (obj.hours > this.MAX_VALUE_SPLIT_TIMER) {
      throw new Error('The split timer value should not be more than 99');
    }
  }

  splitUnit(unit, place) {
    const splitUnites = unit.split('');
    const splitItems = place.querySelectorAll(`.${this.SPLIT_CLASS_NAME}`);
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
  }

  createSplitElements(places) {
    const pattern = `
    <span class="${this.SPLIT_CLASS_NAME}"></span>
    <span class="${this.SPLIT_CLASS_NAME}"></span>`;

    for (const item of places) {
      if (item.firstElementChild === null) {
        item.innerHTML = pattern;
      }
    }
  }
}

class CountdownTimer {
  constructor(className, inputTime, type = 1) {
    this.inputTime = inputTime;
    this.wrapper = document.querySelector(className);
    this.isSplitTimer = this.wrapper.classList.contains('timer-split');
    this.isTypeDate = (type === 0 || type === 'date');
    this.isTypeNumber = (type === 1 || type === 'number');
    if (this.isSplitTimer) this.splitTimer = new SplitCountdownTimer();
  }

  getElems() {
    return [
      this.wrapper.querySelector('.timer-hours'),
      this.wrapper.querySelector('.timer-minutes'),
      this.wrapper.querySelector('.timer-seconds'),
    ];
  }

  getRemainingTime() {
    return Math.floor(this.inputTime * SECONDS_IN_HOUR);
  }

  getRemainingTimeOnDate() {
    const currentTime = new Date().getTime();
    const countTime = new Date(this.inputTime).getTime();
    const time = Math.floor((countTime - currentTime) / MS_IN_SECOND);
    if (isNaN(time)) {
      throw new Error('Invalid input value');
    }
    return time;
  }

  getTime(time) {
    const obj = {
      hours: Math.floor(time / SECONDS_IN_HOUR),
      minutes: Math.floor((time % SECONDS_IN_HOUR) / SECONDS_IN_MIN),
      seconds: time % SECONDS_IN_MIN,
    };
    this.isSplitTimer && this.splitTimer.validateTimer(obj);
    return obj;
  }

  getFormattedTime(obj) {
    const array = [];
    for (const key of Object.keys(obj)) {
      const item = obj[key];
      array.push(fixNumber(item));
    }
    return array;
  }

  iterateTimer(time, callback) {
    const units = this.getFormattedTime(time);
    const timerElems = this.getElems();
    for (let index = 0; index < timerElems.length; index++) {
      const place = timerElems[index];
      const unit = units[index];
      callback(unit, place);
    }
  }

  defaultInnerTimer(unit, place) {
    if (place.innerHTML !== unit) {
      place.innerHTML = unit;
    }
  }

  insertTimerInHtml(time) {
    const timerElems = this.getElems();
    if (this.isSplitTimer) {
      const splitUnit = this.splitTimer.splitUnit.bind(this.splitTimer);
      this.splitTimer.createSplitElements(timerElems);
      this.iterateTimer(time, splitUnit);
    } else this.iterateTimer(time, this.defaultInnerTimer);
  }

  changePageTitle(units) {
    const array = this.getFormattedTime(units);
    const [hh, mm, ss] = array;
    document.title = `${hh}:${mm}:${ss}`;
  }

  setRemainingTime() {
    this.remainingTime = this.getRemainingTime();
  }

  setTimer(timer) {
    if (this.isTypeDate) {
      this.remainingTime = this.getRemainingTimeOnDate();
    }
    if (this.remainingTime < 0) {
      clearInterval(timer);
      return;
    }
    const time = this.getTime(this.remainingTime);
    this.insertTimerInHtml(time);
    this.changePageTitle(time);
    if (this.isTypeNumber) this.remainingTime--;
  }

  insertBeforeStartTimer() {
    if (this.isTypeDate) {
      this.remainingTime = this.getRemainingTimeOnDate();
    }
    if (this.remainingTime < 0) {
      this.remainingTime = 0;
    }
    const time = this.getTime(this.remainingTime);
    this.insertTimerInHtml(time);
  }

  validateTimer() {
    if (this.isTypeNumber) {
      if (this.inputTime < 0) {
        throw new Error('Input value is smaller than 0');
      }
      if (typeof inputTime === 'string') {
        throw new Error('Invalid input value');
      }
    }
    return true;
  }

  initTimer() {
    if (!this.validateTimer()) return;
    this.setRemainingTime();
    this.insertBeforeStartTimer();
    const timer = setInterval(() => {
      this.setTimer.call(this, timer);
    }, MS_IN_SECOND);
  }
}

export { CountdownTimer };
