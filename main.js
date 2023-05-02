const accordion = (element) => {
  const toggle = element.querySelector('.js-accordion-toggle');
  const content = element.querySelector('.js-accordion-content');
  const toggleClass = 'is-active';

  const initialize = () => {
    element.classList.remove(toggleClass);
    content.removeAttribute('style');
  };

  initialize();

  toggle.addEventListener('click', () => {
    if(!element.classList.contains(toggleClass)) {
      content.style.height = 'auto';
      const contentHeight = content.offsetHeight;
      content.style.height = 0;
      setTimeout(() => {
        element.classList.add(toggleClass);
        content.style.height =  contentHeight + 'px';
      });
    } else {
      initialize();
    };
  });
};

window.addEventListener('load', () => {
  const targets = document.querySelectorAll('.js-accordion');
  targets.forEach(target => {
    accordion(target);
  });
});