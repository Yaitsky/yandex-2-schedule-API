var module = require('./module');

var item = document.querySelector('#click');

item.addEventListener('click', function (e) {
    var xhr = new XMLHttpRequest();
    var classroom = {
        classroom: 1001
    };
    var data = JSON.stringify(classroom);
    
    xhr.open('post', '/lectures');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
        console.log(xhr.response);
    });

    xhr.send(data);
})