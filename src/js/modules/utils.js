const getElems = (wrapper) => [
  wrapper.querySelector('.timer-hours'),
  wrapper.querySelector('.timer-minutes'),
  wrapper.querySelector('.timer-seconds'),
];

const fixNumber = (num) => ((num < 10) ? '0' + num : num.toString());

const getFormattedTime = (obj) => {
  const array = [];
  for (const key of Object.keys(obj)) {
    const item = obj[key];
    array.push(fixNumber(item));
  }
  return array;
};

const changePageTitle = (units) => {
  const array = getFormattedTime(units);
  const [hh, mm, ss] = array;
  document.title = `${hh}:${mm}:${ss}`;
};

export {
  fixNumber,
  getElems,
  getFormattedTime,
  changePageTitle,
};
