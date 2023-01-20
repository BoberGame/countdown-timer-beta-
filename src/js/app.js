// import { timerModule } from './modules/timer.js';
import { CountdownTimer } from './modules/timer-classes.js';

const timer1 = new CountdownTimer('.timer-1', {
  type: 'number',
  time: 10,
  changeTitle: true,
});
timer1.init();

// date: <string>, hours: <number>
// timerModule('January 16, 2023, 10:10:00', 'date');
