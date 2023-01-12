import * as webpFunction from './modules/webp.js';
import timerModule from './modules/timer.js';

/* Webp checking */
webpFunction.isWebp();

/* Timer
  date <string>
  hours <number> */
// timerModule('January 13, 2023, 22:00:00', 'date');
timerModule(0.01, 'number');


/* Test on number */
// timerModule(10, 'number');
// timerModule(10, 1);

// timerModule(-10, 'number');
// timerModule(0, 'number');

// timerModule(100, 'number'); ---- Fix inserBefore
// timerModule(1000, 'number'); ---- Fix inserBefore

// timerModule(0.001, 'number');
// timerModule(0.34534, 'number');

// timerModule('', 'number'); ---- Add throw error
// timerModule('22h', 'number'); ---- Fix


/* Test on date */
// timerModule('January 12, 2023, 22:00:00', 'date');
// timerModule('January 12, 2023, 22:00:00', 0);

// timerModule('January 11, 2023, 22:00:00', 'date');
// timerModule('January 1, 2023, 22:00:00', 'date');

// timerModule('January 0, 2023, 22:00:00', 'date'); ---- Fix
// timerModule('January -10, 2023, 22:00:00', 'date');

// timerModule('January 35, 2023, 22:00:00', 'date'); ----- Fix
// timerModule('January 12, 2023, 25:00:00', 'date'); ----- Fix
