import { getTimerElems, getFormattedTime, changePageTitle } from './utils.js';

const timerClassNames = ['timer-hours', 'timer-minutes', 'timer-seconds'];

const timeUnits = {
  secInMin: 60,
  secInHour: 60 * 60,
  msInSec: 1000,
};

const defaultOptions = {
  type: 'number',
  time: 1,
  changeTitle: false,
  destroyAtEnd: false,
};

class SplitCountdownTimer {
  static #itemClassName = 'timer-split-item';
  static #maxValue = 99;

  static isValid(value) {
    if (value > this.#maxValue) {
      throw new Error(`The timer value should not exceed ${this.#maxValue}`);
    }
  }

  static createSplitElements(places) {
    const pattern = `
    <span class="${this.#itemClassName}"></span>
    <span class="${this.#itemClassName}"></span>`;

    for (const item of places) {
      if (item.firstElementChild === null) {
        item.innerHTML = pattern;
      }
    }
  }

  static splitUnit(unit, place) {
    const splitUnites = unit.split('');
    const className = SplitCountdownTimer.#itemClassName;
    const splitItems = place.querySelectorAll(`.${className}`);
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
}

class CountdownTimer {
  inputTime;
  changeTitle;
  type;
  wrapper;

  constructor(className, props) {
    const options = Object.assign(defaultOptions, props);
    this.inputTime = options.time;
    this.changeTitle = options.changeTitle;
    this.type = options.type;
    this.isDestroyAtEnd = options.destroyAtEnd;
    if (this.isDestroyAtEnd) this.destroyState = false;
    this.wrapper = document.querySelector(className);
  }

  isTypeDate() {
    return this.type === 'date';
  }

  isTypeNumber() {
    return this.type === 'number';
  }

  isSplitTimer() {
    return this.wrapper.classList.contains('timer-split');
  }

  createStructure() {
    const itemClassName = 'timer-item';
    for (const className of timerClassNames) {
      const div = document.createElement('DIV');
      div.classList.add(itemClassName, className);
      this.wrapper.appendChild(div);
    }
  }

  setElems() {
    this.timerElems = getTimerElems(this.wrapper, timerClassNames);
  }

  getRemainingTime() {
    return Math.floor(this.inputTime * timeUnits.secInHour);
  }

  getRemainingTimeOnDate() {
    const currentTime = new Date().getTime();
    const countTime = new Date(this.inputTime).getTime();
    const time = Math.floor((countTime - currentTime) / timeUnits.msInSec);
    return time;
  }

  getTime(time) {
    const obj = {
      hours: Math.floor(time / timeUnits.secInHour),
      minutes: Math.floor((time % timeUnits.secInHour) / timeUnits.secInMin),
      seconds: time % timeUnits.secInMin,
    };
    // Validation splitTimer
    if (this.isSplitTimer()) {
      SplitCountdownTimer.isValid(obj.hours);
    }
    return obj;
  }

  iterateTimer(time, callback) {
    const units = getFormattedTime(time);
    for (let index = 0; index < this.timerElems.length; index++) {
      const place = this.timerElems[index];
      const unit = units[index];
      callback(unit, place);
    }
  }

  defaultInnerTimer(unit, place) {
    if (place.innerHTML !== unit) {
      place.innerHTML = unit;
    }
  }

  insertTimeInHtml(time) {
    if (this.isSplitTimer()) {
      SplitCountdownTimer.createSplitElements(this.timerElems);
      this.iterateTimer(time, SplitCountdownTimer.splitUnit);
    } else this.iterateTimer(time, this.defaultInnerTimer);
  }

  setRemainingTime() {
    if (this.isTypeDate()) {
      this.remainingTime = this.getRemainingTimeOnDate();
    }
    if (this.isTypeNumber()) {
      this.remainingTime = this.getRemainingTime();
    }
  }

  setTimer(timer) {
    if (this.isTypeDate()) {
      this.remainingTime = this.getRemainingTimeOnDate();
    }
    if (this.remainingTime < 0) {
      clearInterval(timer);
      return;
    }
    const time = this.getTime(this.remainingTime);
    this.insertTimeInHtml(time);
    if (this.changeTitle) changePageTitle(time);
    if (this.isTypeNumber()) this.remainingTime--;
  }

  get time() {
    return this.remainingTime;
  }

  insertBeforeStartTimer() {
    let { remainingTime } = this;
    if (remainingTime < 0) remainingTime = 0;
    const time = this.getTime(remainingTime);
    this.insertTimeInHtml(time);
  }

  destroy() {
    this.wrapper.remove();
    this.destroyState = true;
  }

  destroyAtEnd() {
    if (this.isDestroyAtEnd && this.remainingTime < 0) {
      this.destroy();
    }
  }

  isValid(value) {
    if (this.isTypeNumber()) {
      if (this.inputTime < 0) {
        throw new Error('Input value is smaller than 0');
      }
      if (typeof this.inputTime !== 'number') {
        throw new Error('Invalid input value');
      }
    }
    if (this.isTypeDate()) {
      if (isNaN(value)) {
        throw new Error('Invalid input value');
      }
      if (typeof this.inputTime !== 'string') {
        throw new Error('Input value is not a string');
      }
    }
    if (typeof this.isDestroyAtEnd !== 'boolean') {
      throw new Error('"destroyAtEnd" is not a boolean');
    }
    if (typeof this.changeTitle !== 'boolean') {
      throw new Error('"changeTitle" is not a boolean');
    }
    return true;
  }

  init() {
    this.createStructure();
    this.setElems();
    this.setRemainingTime();
    if (!this.isValid(this.remainingTime)) return;
    this.insertBeforeStartTimer();
    const timer = setInterval(() => {
      this.setTimer(timer);
      this.destroyAtEnd();
      if (this.destroyState) clearInterval(timer);
    }, timeUnits.msInSec);
  }
}

export { CountdownTimer };
