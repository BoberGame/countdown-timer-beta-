import { CountdownTimer } from './modules/timer-classes.js';

const timer = new CountdownTimer('.timer', {
  type: 'number',
  time: 10,
  changeTitle: false,
  autoDestroy: false,
  autoGenerate: true,
});
timer.init();
