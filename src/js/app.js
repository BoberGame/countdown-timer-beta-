// import { timerModule } from './modules/timer.js';
import { CountdownTimer } from './modules/timer-classes.js';

const timer1 = new CountdownTimer('.timer-1', 10);
timer1.initTimer();

// date<string>
// hours<number>
// timerModule('January 16, 2023, 10:10:00', 'date');
// timerModule(100, 'number');
