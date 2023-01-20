import { getElems, getFormattedTime, changePageTitle } from './utils.js';

const timeUnits = {
  secInMin: 60,
  secInHour: 60 * 60,
  msInSec: 1000,
};

class SplitCountdownTimer {
  static #splitClassName = 'timer-number';
  static #maxValue = 99;

  static isValid(value) {
    if (value > this.#maxValue) {
      throw new Error(`The timer value should not exceed ${this.#maxValue}`);
    }
  }

  static splitUnit(unit, place) {
    const splitUnites = unit.split('');
    const splitItems = place.querySelectorAll(`.${this.#splitClassName}`);
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

  static createSplitElements(places) {
    const pattern = `
    <span class="${this.#splitClassName}"></span>
    <span class="${this.#splitClassName}"></span>`;

    for (const item of places) {
      if (item.firstElementChild === null) {
        item.innerHTML = pattern;
      }
    }
  }
}

class CountdownTimer {
  constructor(className, props) {
    this.inputTime = props.time;
    this.changeTitle = props.changeTitle;
    this.type = props.type;
    this.wrapper = document.querySelector(className);
    this.timerElems = getElems(this.wrapper);
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

  getRemainingTime() {
    return Math.floor(this.inputTime * timeUnits.secInHour);
  }

  getRemainingTimeOnDate() {
    const currentTime = new Date().getTime();
    const countTime = new Date(this.inputTime).getTime();
    const time = Math.floor((countTime - currentTime) / timeUnits.msInSec);
    // Validation timer date
    if (isNaN(time)) throw new Error('Invalid input value');
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

  insertTimerInHtml(time) {
    if (this.isSplitTimer()) {
      const splitUnit = SplitCountdownTimer.splitUnit.bind(SplitCountdownTimer);
      SplitCountdownTimer.createSplitElements(this.timerElems);
      this.iterateTimer(time, splitUnit);
    } else this.iterateTimer(time, this.defaultInnerTimer);
  }

  setRemainingTime() {
    this.remainingTime = this.getRemainingTime();
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
    this.insertTimerInHtml(time);
    if (this.changeTitle) changePageTitle(time);
    if (this.isTypeNumber()) this.remainingTime--;
  }

  insertBeforeStartTimer() {
    let { remainingTime } = this;
    if (this.isTypeDate()) {
      remainingTime = this.getRemainingTimeOnDate();
    }
    if (remainingTime < 0) {
      remainingTime = 0;
    }
    const time = this.getTime(remainingTime);
    this.insertTimerInHtml(time);
  }

  isValid() {
    if (this.isTypeNumber()) {
      if (this.inputTime < 0) {
        throw new Error('Input value is smaller than 0');
      }
      if (typeof this.inputTime !== 'number') {
        throw new Error('Invalid input value');
      }
    }
    return true;
  }

  init() {
    if (!this.isValid()) return;
    if (this.isTypeNumber) this.setRemainingTime();
    this.insertBeforeStartTimer();
    const timer = setInterval(() => {
      this.setTimer(timer);
    }, timeUnits.msInSec);
  }
}

export { CountdownTimer };
