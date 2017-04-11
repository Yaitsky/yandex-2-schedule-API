var scheduleAPI = {
    init: function () {
         //Рендерим все списки
        this.schools.showAll();
        this.classrooms.showAll();
        this.lectures.showAll();

        // ОБЪЯВЛЕНИЕ ПЕРЕМЕННЫХ
        // Листы школ/аудиторий/лекций
        this.schoolsList = document.querySelector('.schools__list');
        this.classroomsList = document.querySelector('.classrooms__list');
        this.scheduleList = document.querySelector('.schedule__list');
        // кнопки добавления школ/аудиторий/лекций
        var addSchoolButton = document.querySelector('.schools__add-button');
        var addClassroomButton = document.querySelector('.classrooms__add-button');
        var addLectureButton = document.querySelector('.schedule__add-button');
        // модальные окна редактирования школ/аудиторий/лекций
        this.modalSchool = document.querySelector('.modal-school');
        this.modalClassroom = document.querySelector('.modal-classroom');
        this.modalLecture = document.querySelector('.modal-lecture');
        // кнопка Закрыть модальных окон
        var cancelButtons = document.querySelectorAll('.modal__button--cancel');
        // кнопки Применить модальных окон
        var applySchool = document.querySelector('.modal__button--add-school');
        

        //Выбор нужного раздела
        this.filterSelectButton = document.querySelector('.filter-block__select');
        this.filterSelectButton.addEventListener('change', this.filter.bind(this));

        //Обработчики событий для добавления новых школ/лекций/аудиторий
        addSchoolButton.addEventListener('click', function () {
            scheduleAPI.modalSchool.style.display = 'block';
            applySchool.classList.add('addNew');
        });
        addClassroomButton.addEventListener('click', function () {
            scheduleAPI.modalClassroom.style.display = 'block';
        });
        addLectureButton.addEventListener('click', function () {
            scheduleAPI.modalLecture.style.display = 'block';
        });
        applySchool.addEventListener('click', function () {
            var schoolTitle = scheduleAPI.modalSchool.querySelector('.school-title').value;
            var schoolCount = scheduleAPI.modalSchool.querySelector('.school-count').value;

            var data = JSON.stringify({
                title: schoolTitle,
                count: schoolCount
            });

            scheduleAPI.schools.addNew(data);
            scheduleAPI.schools.showAll();
            scheduleAPI.modalSchool.querySelector('.school-title').value = '';
            scheduleAPI.modalSchool.querySelector('.school-count').value = '';
            scheduleAPI.modalSchool.style.display = 'none';
        });

        //Обработчик для закрытия модального окна
        for (var i = 0; i < cancelButtons.length; i++) {
            cancelButtons[i].addEventListener('click', function () {

                scheduleAPI.modalSchool.style.display = 'none';
                scheduleAPI.modalSchool.querySelector('.school-title').value = '';
                scheduleAPI.modalSchool.querySelector('.school-count').value = '';
                applySchool.classList.remove('addNew');
                scheduleAPI.modalClassroom.style.display = 'none';
                scheduleAPI.modalLecture.style.display = 'none';
            });
        };
    },
    renderSchool: require('./templates/school'),
    renderSchools: function (array) {
        this.schoolsList.innerHTML = '';
        for (var i = 0; i < array.length; i++) {
            var item = scheduleAPI.renderSchool(array[i]);
            scheduleAPI.schoolsList.innerHTML += item;
        }

        // обработчики на кнопки удаления
        var deleteButtons = scheduleAPI.schoolsList.querySelectorAll('.buttons__item--delete');
        for (var i = 0; i < deleteButtons.length; i++) {
            deleteButtons[i].addEventListener('click', function (e) {
                var item = e.currentTarget;
                var row = item.parentElement.parentElement;
                var schoolTitle = row.querySelector('.schools__col--title').innerText;           

                var data = JSON.stringify({
                    title: schoolTitle
                });

                scheduleAPI.schools.delete(data);
            });
        }

        // обработчики на кнопки редактирования
        var updateButtons = scheduleAPI.schoolsList.querySelectorAll('.buttons__item--update');
        for (var i = 0; i < updateButtons.length; i++) {
            updateButtons[i].addEventListener('click', function (e) {
                var item = e.currentTarget;
                var row = item.parentElement.parentElement;
                var schoolTitle = row.querySelector('.schools__col--title').innerText;
                var schoolCount = row.querySelector('.schools__col--count').innerText;

                scheduleAPI.modalSchool.querySelector('.school-title').value = schoolTitle;
                scheduleAPI.modalSchool.querySelector('.school-count').value = schoolCount;
                scheduleAPI.modalSchool.style.display = 'block';
            });
        }
    },
    renderClassroom: require('./templates/classroom'),
    renderClassrooms: function (array) {
        this.classroomsList.innerHTML = '';
        for (var i = 0; i < array.length; i++) {
            var item = scheduleAPI.renderClassroom(array[i]);
            scheduleAPI.classroomsList.innerHTML += item;
        }
    },
    renderLecture: require('./templates/lecture-future'),
    renderLectures: function (array) {
        this.scheduleList.innerHTML = '';
        for (var i = 0; i < array.length; i++) {
            var item = scheduleAPI.renderLecture(array[i]);
            scheduleAPI.scheduleList.innerHTML += item;
        }
    },
    filter: function () {
        var schoolsBlock = document.querySelector('.schools');
        var classroomsBlock = document.querySelector('.classrooms');
        var scheduleBlock = document.querySelector('.schedule');
        var selectedIndex = this.filterSelectButton.options.selectedIndex;
        var selectedValue = this.filterSelectButton.options[selectedIndex].value;

        if (selectedValue == 'Редактировать список школ') {
            schoolsBlock.style.display = 'block';
            classroomsBlock.style.display = 'none';
            scheduleBlock.style.display = 'none';
        } else if (selectedValue == 'Редактировать список аудиторий') {
            schoolsBlock.style.display = 'none';
            classroomsBlock.style.display = 'block';
            scheduleBlock.style.display = 'none';
        } else {
            schoolsBlock.style.display = 'none';
            classroomsBlock.style.display = 'none';
            scheduleBlock.style.display = 'block';
        }
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
                scheduleAPI.renderSchools(response);
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
                scheduleAPI.schools.showAll();
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
                scheduleAPI.schools.showAll();
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
                scheduleAPI.renderClassrooms(response);
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
                scheduleAPI.renderLectures(response);
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