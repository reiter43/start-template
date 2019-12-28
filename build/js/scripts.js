"use strict";

// Фильтрация по категориям
var buttons = document.querySelectorAll('.buttonCat');
buttons.forEach(function (elem) {
  elem.onclick = function (event) {
    event.preventDefault();
    buttons.forEach(function (elem) {
      elem.classList.remove('buttonCat--active');
      event.target.classList.add('buttonCat--active');
    });
    var buttonFilter = elem.getAttribute('data-filter');
    var portfolioItems = document.querySelectorAll('.portfolio__item');
    portfolioItems.forEach(function (elem) {
      elem.style.display = 'none';

      if (buttonFilter == 'all') {
        elem.style.display = 'block';
      }

      if (elem.classList.contains(buttonFilter)) {
        elem.style.display = 'block';
      }
    });
  };
}); // Скрыть/показать меню

document.querySelector('.burger').addEventListener('click', function (event) {
  event.preventDefault;

  if (event.target.classList.contains('burger--active')) {
    event.target.classList.remove('burger--active');
    document.querySelector('.nav').classList.remove('visible');
  } else {
    event.target.classList.add('burger--active');
    document.querySelector('.nav').classList.add('visible');
  }
}); // Аякс-запрос формы обратной связи

var form = document.querySelector('#form');

form.onsubmit = function (event) {
  event.preventDefault();
  var formData = new FormData(form);
  var xhttp = new XMLHttpRequest();
  xhttp.open('POST', 'mail.php');
  xhttp.send(formData);

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      form.reset();
      chips('Спасибо за обращение! <br> В ближайшее время мы с вами свяжемся', 5000);
    }
  };
};
/*==================================================================*/