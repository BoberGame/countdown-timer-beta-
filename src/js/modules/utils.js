const getTimerElems = (wrapper, classNames) => {
  const elems = [];
  for (const className of classNames) {
    const item = wrapper.querySelector(`.${className}`);
    if (item) elems.push(item);
  }
  return elems;
};

const fixNumber = (num) => (num < 10 ? '0' + num : num.toString());

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

export { fixNumber, getTimerElems, getFormattedTime, changePageTitle };
