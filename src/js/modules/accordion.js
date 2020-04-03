const accordion = (accordionTrigger) => {
    const accordionBars = document.querySelectorAll(accordionTrigger);

    if (accordionBars[0].tagName !== 'button') {
        accordionBars.forEach((el) => {
            el.addEventListener('keydown', (event) => {
                if (event.keyCode === 13 || event.keyCode === 32) { run(el); }
            });
        });
    }

    accordionBars.forEach((el) => {
        el.addEventListener('click', () => { run(el); });
    });

    function run(el) {
        el.setAttribute('aria-expanded', false);
        el.classList.toggle('active');
        el.nextElementSibling.classList.toggle('active');

        if (el.classList.contains('active')) {
            el.setAttribute('aria-expanded', true);
            el.nextElementSibling.style.maxHeight = `${el.nextElementSibling.scrollHeight}px`;
        } else {
            el.nextElementSibling.style.maxHeight = '0px';
        }
    }
};

export default accordion;
