const tab = (itemsSelector, contentstSelector) => {
    const tabs = document.querySelectorAll(itemsSelector);
    const panels = document.querySelectorAll(contentstSelector);
    const tabList = tabs[0].parentNode;

    function hideTab() {
        panels.forEach((el) => {
            el.setAttribute('hidden', '');
        });

        tabs.forEach((el) => {
            el.classList.remove('active');
            el.setAttribute('aria-selected', 'false');
        });
    }

    function showTab(elem, ta) {
        elem.removeAttribute('hidden');
        ta.classList.add('active');
        ta.setAttribute('aria-selected', 'true');
    }

    if (tabs[0].tagName !== 'button') {
        tabList.addEventListener('keydown', (event) => {
            if (event.keyCode === 13 || event.keyCode === 32) { run(event); }
        });
    }

    tabList.addEventListener('click', run);


    function run(e) {
        const { target } = e;

        if (target && (target.classList.contains(itemsSelector.replace(/\./, ''))
            || target.parentNode.classList.contains(itemsSelector.replace(/\./, '')))) {
            tabs.forEach((el) => {
                if (target === el || target.parentNode === el) {
                    hideTab();

                    const id = el.getAttribute('aria-controls');

                    panels.forEach((item) => {
                        if (item.getAttribute('id') === id) {
                            showTab(item, el);
                        }
                    });
                }
            });
        }
    }
};

export default tab;
