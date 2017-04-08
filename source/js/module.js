var scheduleAPI = {
    init: function () {
        var testGET = document.querySelector('#testClick');
        var testPOST = document.querySelector('#testPost');
        var testUPDATE = document.querySelector('#testUpdate');
        var testDELETE = document.querySelector('#testDelete');

        var data = JSON.stringify({    
                school: ["Школа разработки интерфейсов", "Школа мобильного дизайна"],
                number: "Вступительная лекция",
                title: "test",
                teacher: ["Дмитрий Душкин"],
                date: "20.10.2016",
                video: "https://events.yandex.ru/lib/talks/4162/",
                classroom: "1001"
        });
        var data2 = JSON.stringify({
                school: ["Школа разработки интерфейсов", "Школа мобильного дизайна"],
                number: "Вступительная лекция",
                title: "test",
                teacher: ["Дмитрий Душкин"],
                date: "12.12.2012",
                video: "https://events.yandex.ru/lib/talks/4162/",
                classroom: "100100000"
        });
        var data3 = JSON.stringify({
            title: "test"
        });
    
        testGET.addEventListener('click', this.lectures.showAll);
        testPOST.addEventListener('click', this.lectures.addNew.bind(null, data));
        testUPDATE.addEventListener('click', this.lectures.update.bind(null, data2));
        testDELETE.addEventListener('click', this.lectures.delete.bind(null, data3));
    },
    sendRequest: function (method, request, data) {
        return new Promise(function (resolve, reject) {
            if (!data) {
                data = null;
            }
            var xhr = new XMLHttpRequest();

            xhr.open(method, request);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.responseType = 'json';
            xhr.send(data);

            xhr.addEventListener('load', function () {
                if (xhr.status != 200) {
                    reject(xhr.status);
                } else {
                    resolve(xhr.response);
                }
            })
        })
    },
    schools: {
        showAll: function () {
            scheduleAPI.sendRequest('GET', '/schools').
            then(function (response) {
                console.log(response);
            },
            function (response) {
                console.log('Не удалось сделать запрос');
                console.log(response);
            });
        },
        addNew: function (data) {
            scheduleAPI.sendRequest('POST', '/schools', data).
            then(function (response) {
                console.log(response);
            },
            function (response) {
                console.log('Не удалось сделать запрос');
                console.log(response);
            });
        },
        update: function (data) {
            scheduleAPI.sendRequest('PUT', '/schools:title', data).
            then(function (response) {
                console.log(response);
            },
            function () {
                console.log('Не удалось сделать запрос');
            });
        },
        delete: function (data) {
            scheduleAPI.sendRequest('DELETE', '/schools:title', data).
            then(function (response) {
                console.log(response);
            },
            function (response) {
                console.log('Не удалось сделать запрос');
                console.log(response);
            });
        }
    },
    classrooms: {
        showAll: function () {
            scheduleAPI.sendRequest('GET', '/classrooms').
            then(function (response) {
                console.log(response);
            },
            function (response) {
                console.log('Не удалось сделать запрос');
                console.log(response);
            });
        },
        addNew: function (data) {
            scheduleAPI.sendRequest('POST', '/classrooms', data).
            then(function (response) {
                console.log(response);
            },
            function (response) {
                console.log('Не удалось сделать запрос');
                console.log(response);
            });
        },
        update: function (data) {
            scheduleAPI.sendRequest('PUT', '/classrooms:title', data).
            then(function (response) {
                console.log(response);
            },
            function (response) {
                console.log('Не удалось сделать запрос');
                console.log(response);
            });
        },
        delete: function (data) {
            scheduleAPI.sendRequest('DELETE', '/classrooms:title', data).
            then(function (response) {
                console.log(response);
            },
            function (response) {
                console.log('Не удалось сделать запрос');
                console.log(response);
            });
        }
    },
    lectures: {
        showAll: function () {
            scheduleAPI.sendRequest('GET', '/lectures').
            then(function (response) {
                console.log(response);
            },
            function (response) {
                console.log('Не удалось сделать запрос');
                console.log(response);
            });
        },
        addNew: function (data) {
            scheduleAPI.sendRequest('POST', '/lectures', data).
            then(function (response) {
                console.log(response);
            },
            function (response) {
                console.log('Не удалось сделать запрос');
                console.log(response);
            });
        },
        update: function (data) {
            scheduleAPI.sendRequest('PUT', '/lectures:title', data).
            then(function (response) {
                console.log(response);
            },
            function (response) {
                console.log('Не удалось сделать запрос');
                console.log(response);
            });
        },
        delete: function (data) {
            scheduleAPI.sendRequest('DELETE', '/lectures:title', data).
            then(function (response) {
                console.log(response);
            },
            function (response) {
                console.log('Не удалось сделать запрос');
                console.log(response);
            });
        }
    }
};

module.exports = scheduleAPI;