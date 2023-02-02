import { getTimerElems, getFormattedTime, changePageTitle } from './utils.js';
import { defaultOptions } from './default.js';

const timerClassNames = ['timer-hours', 'timer-minutes', 'timer-seconds'];

const timeValues = {
  secInMin: 60,
  secInHour: 60 * 60,
  msInSec: 1000,
};

class CountdownTimer {
  digitClassName = 'timer-digit';
  itemClassName = 'timer-item';
  maxValue = 99;
  destroyState = false;

  constructor(wrapper, props) {
    const options = Object.assign(defaultOptions, props);
    this.inputTime = options.time;
    this.changeTitle = options.changeTitle;
    this.type = options.type;
    this.autoDestroy = options.autoDestroy;
    this.autoGenerate = options.autoGenerate;

    if (typeof wrapper === 'object') {
      this.wrapper = wrapper;
    } else {
      this.wrapper = document.querySelector(wrapper);
    }
  }

  isTypeDate() {
    return this.type === 'date';
  }

  isTypeNumber() {
    return this.type === 'number';
  }

  createStructure() {
    const pattern = `
    <span class="${this.digitClassName}"></span>
    <span class="${this.digitClassName}"></span>`;

    for (const className of timerClassNames) {
      const div = document.createElement('DIV');
      div.classList.add(this.itemClassName, className);
      div.insertAdjacentHTML('afterbegin', pattern);
      this.wrapper.appendChild(div);
    }
  }

  getRemainingTime() {
    return Math.floor(this.inputTime * timeValues.secInHour);
  }

  getRemainingTimeOnDate() {
    const currentTime = new Date().getTime();
    const countTime = new Date(this.inputTime).getTime();
    const time = Math.floor((countTime - currentTime) / timeValues.msInSec);
    return time;
  }

  getTimeUnits(time) {
    const units = {
      hours: Math.floor(time / timeValues.secInHour),
      minutes: Math.floor((time % timeValues.secInHour) / timeValues.secInMin),
      seconds: time % timeValues.secInMin,
    };
    return units;
  }

  splitUnit(unit, place) {
    const splitItems = place.querySelectorAll(`.${this.digitClassName}`);
    const [leftItem, rightItem] = splitItems;
    const [leftDigit, rightDigit] = unit;
    const innerValue = [];

    if (unit > this.maxValue) {
      throw new Error(`The timer value should not exceed ${this.maxValue}`);
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
  }

  timerRender(time) {
    const units = getFormattedTime(time);
    for (let index = 0; index < this.timerElems.length; index++) {
      const place = this.timerElems[index];
      const unit = units[index];
      this.splitUnit(unit, place);
    }
  }

  setRemainingTime() {
    if (this.isTypeDate()) {
      this.remainingTime = this.getRemainingTimeOnDate();
    }
    if (this.isTypeNumber()) {
      this.remainingTime = this.getRemainingTime();
    }
  }

  setTimer() {
    if (this.remainingTime <= 0) return;
    if (this.isTypeDate()) {
      this.remainingTime = this.getRemainingTimeOnDate();
    }
    if (this.isTypeNumber()) --this.remainingTime;
    const time = this.getTimeUnits(this.remainingTime);
    this.timerRender(time);
    if (this.changeTitle) changePageTitle(time);
  }

  get time() {
    return this.getTimeUnits(this.remainingTime);
  }

  insertBeforeStartTimer() {
    let { remainingTime } = this;
    if (remainingTime < 0) remainingTime = 0;
    const time = this.getTimeUnits(remainingTime);
    this.timerRender(time);
  }

  destroy() {
    this.wrapper.remove();
    this.destroyState = true;
    delete this.wrapper;
  }

  validation(value) {
    if (this.isTypeNumber()) {
      if (this.inputTime < 0) {
        throw new Error('Input value is smaller than 0');
      }
      if (typeof this.inputTime !== 'number') {
        throw new Error('Invalid input value');
      }
    }
    if (this.isTypeDate()) {
      if (typeof this.inputTime !== 'string') {
        throw new Error('Input value is not a string');
      }
      if (isNaN(value)) {
        throw new Error('Invalid input value');
      }
    }
  }

  init() {
    if (!this.wrapper) return;
    if (this.autoGenerate) this.createStructure();
    this.timerElems = getTimerElems(this.wrapper, timerClassNames);
    this.setRemainingTime();
    this.validation(this.remainingTime);
    this.insertBeforeStartTimer();
    const timer = setInterval(() => {
      this.setTimer();
      if (this.autoDestroy && this.remainingTime <= 0) {
        this.destroy();
      }
      if (this.destroyState) clearInterval(timer);
    }, timeValues.msInSec);
  }
}

export { CountdownTimer };
