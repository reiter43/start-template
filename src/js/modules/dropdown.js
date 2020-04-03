function dropDown(selector) {
    const dropdownBtn = document.querySelector(selector);
    const dropdownList = dropdownBtn.nextElementSibling;
    const dropItems = dropdownList.querySelectorAll('[role="menuitem"]');

    dropdownBtn.addEventListener('click', () => {
        dropdownList.classList.toggle('active');

        if (dropdownList.classList.contains('active')) {
            dropdownBtn.setAttribute('aria-expanded', 'true');
            dropItems.forEach((el) => {
                el.setAttribute('tabindex', '0');
            });
        } else {
            dropdownBtn.removeAttribute('aria-expanded');
            dropItems.forEach((el) => {
                el.setAttribute('tabindex', '-1');
            });
        }

        dropItems.forEach((el) => {
            el.addEventListener('click', () => {
                dropItems.forEach((el) => {
                    el.setAttribute('tabindex', '-1');
                });

                dropdownList.classList.remove('active');

                dropdownBtn.focus();
            });
        });
    });
}

function dropDownAct(selector) {
    const dropdownBtn = document.querySelector(selector);
    const dropdownList = dropdownBtn.nextElementSibling;
    const dropOptions = dropdownList.querySelectorAll('[role="option"]');

    dropdownBtn.addEventListener('click', () => {
        dropdownList.classList.toggle('active');

        if (dropdownList.classList.contains('active')) {
            dropdownBtn.setAttribute('aria-expanded', 'true');
            dropOptions.forEach((el) => {
                el.setAttribute('tabindex', '0');
            });
        } else {
            dropdownBtn.removeAttribute('aria-expanded');
            dropOptions.forEach((el) => {
                el.setAttribute('tabindex', '-1');
            });
        }

        dropOptions.forEach((el) => {
            el.addEventListener('click', () => {
                dropOptions.forEach((el) => {
                    el.setAttribute('tabindex', '-1');
                    el.removeAttribute('aria-selected');
                });

                el.setAttribute('aria-selected', 'true');
                dropdownBtn.innerHTML = el.innerHTML;
                dropdownBtn.removeAttribute('aria-expanded');

                dropdownList.classList.remove('active');

                dropdownBtn.focus();
            });
        });
    });
}

export { dropDown, dropDownAct };
