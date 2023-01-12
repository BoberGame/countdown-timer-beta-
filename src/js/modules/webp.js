export const isWebp = () => {
  const html = document.documentElement;
  const testWebP = (callback) => {
    const webP = new Image();
    webP.onload = webP.onerror = function() {
      callback(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  };

  const replacePosterImg = () => {
    const videoItems = document.querySelectorAll('video');
    for (const item of videoItems) {
      const src = item.attributes.poster.value;
      const regexp = /(.jpg)|(.png)/;
      const newSrc = src.replace(regexp, '.webp');
      setTimeout(() => {
        if (html.classList.contains('webp')) item.poster = newSrc;
      }, 1);
    }
  };

  testWebP((support) => {
    if (support) html.classList.add('webp');
    else html.classList.add('no-webp');
  });
  replacePosterImg();
};
