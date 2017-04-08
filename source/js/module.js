var scheduleAPI = {
    init: function () {
        
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
                    reject(xhr.response);
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