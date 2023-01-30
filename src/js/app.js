// import { timerModule } from './modules/timer.js';
import { CountdownTimer } from './modules/timer-classes.js';

const timer1 = new CountdownTimer('.timer', {
  type: 'number',
  time: 10,
  changeTitle: false,
  autoDestroy: false,
  autoGenerate: true,
});
timer1.init();

// timerModule('.timer-1', {
//   type: 'number',
//   time: 1,
//   changeTitle: false,
//   autoDestroy: false,
//   autoGenerate: true,
// });
