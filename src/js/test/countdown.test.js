/* eslint-disable no-undef */
import { CountdownTimer } from '../modules/timer-classes';
import { JSDOM } from 'jsdom';
import { defaultOptions } from '../modules/default.js';

// Disable autoGenerate for test
defaultOptions.autoGenerate = false;

const pattern = `
<div class="timer">
  <div class="timer-item timer-hours">
    <span class="timer-digit"></span>
    <span class="timer-digit"></span>
  </div>
  <div class="timer-item timer-minutes">
    <span class="timer-digit"></span>
    <span class="timer-digit"></span>
  </div>
  <div class="timer-item timer-seconds">
    <span class="timer-digit"></span>
    <span class="timer-digit"></span>
  </div>
</div>`;

const DOMParser = new JSDOM().window.DOMParser;
const parser = new DOMParser();
const dom = parser.parseFromString(pattern, 'text/html');
const wrapper = dom.querySelector('.timer');

const dateInputValue = 'Feb 3, 2023, 12:00:00';
const getTimeResult = {
  hours: 1,
  minutes: 0,
  seconds: 0,
};

const timer = new CountdownTimer(wrapper, defaultOptions);

describe('timer methods', () => {
  beforeAll(() => {
    timer.init();
  });

  it('check remainingTime', () => {
    expect(timer.getRemainingTime()).toBe(3600);
  });

  it('check isTypeNumber', () => {
    expect(timer.isTypeNumber()).toBeTruthy;
  });

  it('check isTypeDate', () => {
    defaultOptions.type = 'date';
    const timer = new CountdownTimer(wrapper, defaultOptions);
    expect(timer.isTypeDate()).toBeTruthy;
  });

  it('check getTimeUnits', () => {
    const res = timer.getTimeUnits(timer.getRemainingTime());
    expect(timer.getTimeUnits).toBeDefined;
    expect(typeof res === 'object').toBeTruthy;
    expect(res).toEqual(getTimeResult);
  });

  it('check getter', () => {
    expect(timer.time).toEqual(getTimeResult);
  });

  it('check validation', () => {
    expect(timer.validation).toBeDefined();
  });

  it('if correct wrapper', () => {
    expect(timer.wrapper).not.toBeNull;
    expect(typeof timer.wrapper).toBe('object');
  });

  it('if incorrect wrapper', () => {
    const timer = new CountdownTimer(null, defaultOptions);
    expect(timer.wrapper).toBeNull;
  });

  it('check destroy', () => {
    expect(timer.destroy).toBeDefined;
    timer.destroy();
    expect(timer.destroyState).toBe(true);
    expect(timer.wrapper).toBeUnDefined;
  });
});

describe('validation check', () => {
  let timer;
  it('correct input value', () => {
    timer = new CountdownTimer(wrapper, { type: 'number', time: 10 });
    expect(() => timer.init()).not.toThrow(Error);
    timer = new CountdownTimer(wrapper, { type: 'date', time: dateInputValue });
    expect(() => timer.init()).not.toThrow(Error);
  });
  it('incorrect input value ', () => {
    timer = new CountdownTimer(wrapper, { type: 'number', time: -10 });
    expect(() => timer.init()).toThrow(Error);
    timer = new CountdownTimer(wrapper, { type: 'date', time: 10 });
    expect(() => timer.init()).toThrow(Error);
  });
});

describe('check init method', () => {
  jest.useFakeTimers();
  jest.spyOn(global, 'setInterval');

  expect(timer.init).toBeDefined();
  it('test setInterval', () => {
    expect(setInterval).toBeCalled();
    expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), 1000);
  });
});
