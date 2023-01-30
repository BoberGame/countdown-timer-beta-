/* eslint-disable no-undef */
import { CountdownTimer } from '../modules/timer-classes';
import { JSDOM } from 'jsdom';
import { defaultOptions } from '../modules/default.js';

// Disable autoGenerate for test
defaultOptions.autoGenerate = false;

const pattern = `
<div class="timer timer-split">
  <div class="timer-item timer-hours"></div>
  <div class="timer-item timer-minutes"></div>
  <div class="timer-item timer-seconds"></div>
</div>`;

const DOMParser = new JSDOM().window.DOMParser;
const parser = new DOMParser();
const dom = parser.parseFromString(pattern, 'text/html');
const wrapper = dom.querySelector('.timer');

const getTimeResult = {
  hours: 1,
  minutes: 0,
  seconds: 0,
};

const timer = new CountdownTimer(wrapper, defaultOptions);

describe('Test timer methods', () => {
  beforeAll(() => {
    timer.init();
  });

  it('Check remainingTime', () => {
    expect(timer.getRemainingTime()).toBe(3600);
  });

  it('Check timer type', () => {
    expect(timer.isTypeNumber()).toBe(true);
  });

  it('Check getTime', () => {
    expect(timer.getTime(timer.getRemainingTime())).toEqual(getTimeResult);
  });

  it('Check getter', () => {
    expect(timer.time).toEqual(getTimeResult);
  });

  it('Check destroy method', () => {
    timer.destroy();
    expect(timer.destroyState).toBe(true);
  });
});

describe('Test init method', () => {
  jest.useFakeTimers();
  jest.spyOn(global, 'setInterval');

  it('Test setInterval', () => {
    expect(setInterval).toBeCalled();
    expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), 1000);
  });
});
