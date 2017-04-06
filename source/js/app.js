var module = require('./module');

// get - получить все лекции
var itemGet = document.querySelector('#clickGet');

itemGet.addEventListener('click', function (e) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/lectures');
    xhr.responseType = 'json';
    xhr.send();

    xhr.addEventListener('load', function () {
        console.log(xhr.response);
        console.log(xhr.response.length);
    });
});

// post - добавить одну лекцию
var itemPost = document.querySelector('#clickPost');

itemPost.addEventListener('click', function (e) {
    var xhr = new XMLHttpRequest();
    var data = JSON.stringify({
        school: ["Школа мобильного дизайна"],
        number: "Тестовая лекция",
        title: "Тестовая лекция",
        teacher: ["Антон Тен"],
        date: "23.07.2017",
        video: "none",
        classroom: "1007"
  });
    xhr.open('POST', '/lectures');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.responseType = 'json';
    xhr.send(data);

    xhr.addEventListener('load', function () {
        console.log(xhr.response);
    });
});

// PUT - редактировать одну лекцию
var itemPut = document.querySelector('#clickPut');

itemPut.addEventListener('click', function (e) {
    var xhr = new XMLHttpRequest();
    var data = JSON.stringify({
        school: ["Школа мобильного дизайна"],
        number: "Тестовая лекция",
        title: "Тестовая лекция",
        teacher: ["Антон Тен"],
        date: "30.08.2017",
        video: "none",
        classroom: "1010"
  });
    xhr.open('PUT', '/lectures:title');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.responseType = 'json';
    xhr.send(data);

    xhr.addEventListener('load', function () {
        console.log(xhr.response);
    });
});

// DELETE - удалить одну лекцию
var itemDelete = document.querySelector('#clickDelete');

itemDelete.addEventListener('click', function (e) {
    var xhr = new XMLHttpRequest();
    var data = JSON.stringify({
        title: "Тестовая лекция"
  });
    xhr.open('DELETE', '/lectures:title');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.responseType = 'json';
    xhr.send(data);

    xhr.addEventListener('load', function () {
        console.log(xhr.response);
    });
});