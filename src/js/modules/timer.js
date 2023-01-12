function timerModule(inputTime, type = 0) {
  const secondsInHour = 60 * 60;
  const secondsInMin = 60;
  const msInSecond = 1000;
  const isTypeDate = (type === 0 || type === 'date');
  const splitClassName = 'timer__number';
  // const isTypeNumber = (type === 1 || type === 'number');
  const wrapper = document.querySelector('.timer');

  if (!wrapper) throw new Error('Timer is not defind!');

  let timeInterval = 0;

  const elems = [
    wrapper.querySelector('.timer__hours'),
    wrapper.querySelector('.timer__minutes'),
    wrapper.querySelector('.timer__seconds'),
  ];

  const fixNumber = (num) => ((num < 10) ? '0' + num : num.toString());

  const getRemainingTime = () => Math.floor(inputTime * secondsInHour);

  const getRemainingTimeOnDate = () => {
    const currentTime = new Date().getTime();
    const countTime = new Date(inputTime).getTime();
    const time = Math.floor((countTime - currentTime) / msInSecond);
    return time;
  };

  const getTime = (time) => {
    const obj = {
      hours: Math.floor(time / secondsInHour),
      minutes: Math.floor((time % secondsInHour) / secondsInMin),
      seconds: time % secondsInMin,
    };
    return obj;
  };

  const getFormattedTime = (obj) => {
    const array = [];
    for (const key of Object.keys(obj)) {
      const item = obj[key];
      array.push(fixNumber(item));
    }
    return array;
  };

  let remainingTime = getRemainingTime();

  const innerTime = (units, places) => {
    const array = getFormattedTime(units);

    for (let index = 0; index < places.length; index++) {
      const place = places[index];
      const unit = array[index];
      if (place.innerHTML !== unit) place.innerHTML = unit;
    }
  };

  const createSplitElements = (className, obj) => {
    const pattern = `
    <span class="${className}"></span>
    <span class="${className}"></span>
    `;

    for (const key of Object.keys(obj)) {
      const item = obj[key];
      item.innerHTML = pattern;
    }
  };

  /* Function split time value for 2 parts
   and insert in html span */
  const timeSplit = (value, place) => {
    const array = value.split('');
    const items = place.querySelectorAll(`.${splitClassName}`);

    const splitValue = [];
    items.forEach((item, index) => {
      const splitNum = array[index];
      if (item.innerText === '') {
        item.innerHTML = splitNum;
      }
      splitValue.push(item.innerHTML);
      setTimeout(() => {
        if (splitValue.join('') !== value) {
          item.innerHTML = splitNum;
        }
      }, 0);
    });
  };

  const innerTimeSplit = (units, places) => {
    const array = getFormattedTime(units);
    for (let index = 0; index < places.length; index++) {
      const place = places[index];
      const unit = array[index];
      timeSplit(unit, place);
    }
  };

  const insertInHtml = (time, places) => {
    const className = 'timer__split';
    if (wrapper.classList.contains(className)) {
      innerTimeSplit(time, places);
    }
    if (!wrapper.classList.contains(className)) {
      innerTime(time, places);
    }
  };

  const changePageTitle = (units) => {
    const array = getFormattedTime(units);
    const [hh, mm, ss] = array;
    document.title = `${hh}:${mm}:${ss}`;
  };

  const timerFunctional = () => {
    if (isTypeDate) remainingTime = getRemainingTimeOnDate();

    if (remainingTime < 0) {
      clearInterval(timeInterval);
      return;
    }
    const time = getTime(remainingTime);
    insertInHtml(time, elems);
    changePageTitle(time);
    if (type !== 'date') remainingTime--;
  };

  const insertBeforeStartTimer = () => {
    if (isTypeDate) {
      remainingTime = getRemainingTimeOnDate();
    }
    if (remainingTime < 0) {
      remainingTime = 0;
    }
    const time = getTime(remainingTime);
    insertInHtml(time, elems);
  };

  createSplitElements(splitClassName, elems);
  insertBeforeStartTimer();

  timeInterval = setInterval(timerFunctional, msInSecond);
}

export default timerModule;
