var scheduleAPI = {
    init: function () {
         //Рендерим все списки
        var data3 = JSON.stringify({
            classroom: "1005"
        });
        var data2 = JSON.stringify({
            school: "Школа разработки интерфейсов",
            start: "2016-11-01",
            end: "2016-11-30"
        });
        // this.lectures.filterLectures(data2);
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
        this.applySchool = document.querySelector('.modal__button--add-school');
        this.applyClassroom = document.querySelector('.modal__button--add-classroom');
        this.applyLecture = document.querySelector('.modal__button--add-lecture');
        // поиск по школе в заданный период
        this.searchSchoolTitle = document.querySelector('.search-block__input--school');
        this.searchSchoolStartTime = document.querySelector('.school-start');
        this.searchSchoolEndTime = document.querySelector('.school-end');
        this.searchSchoolButton = document.querySelector('.school-search');
        this.searchSchoolCancel = document.querySelector('.school-cancel');
        // поиск по аудитории в заданный период
        this.searchClassroomTitle = document.querySelector('.search-block__input--classroom');
        this.searchClassroomStartTime = document.querySelector('.classroom-start');
        this.searchClassroomEndTime = document.querySelector('.classroom-end');
        this.searchClassroomButton = document.querySelector('.classroom-search');
        this.searchClassroomCancel = document.querySelector('.classroom-cancel');

        //Выбор нужного раздела
        this.filterSelectButton = document.querySelector('.filter-block__select');
        this.filterSelectButton.addEventListener('change', this.filter.bind(this));

        //Обработчики событий для добавления новых школ/лекций/аудиторий
        addSchoolButton.addEventListener('click', function () {
            scheduleAPI.modalSchool.style.display = 'block';
            scheduleAPI.applySchool.classList.add('addNew');
        });
        addClassroomButton.addEventListener('click', function () {
            scheduleAPI.modalClassroom.style.display = 'block';
            scheduleAPI.applyClassroom.classList.add('addNew');
        });
        addLectureButton.addEventListener('click', function () {
            scheduleAPI.modalLecture.style.display = 'block';
            scheduleAPI.applyLecture.classList.add('addNew');
        });
        // Применить для школы
        this.applySchool.addEventListener('click', function () {
            var schoolTitle = scheduleAPI.modalSchool.querySelector('.school-title').value;
            var schoolCount = scheduleAPI.modalSchool.querySelector('.school-count').value;

            var data = JSON.stringify({
                title: schoolTitle,
                count: schoolCount
            });

            if (scheduleAPI.applySchool.classList.contains('addNew')) {
                scheduleAPI.schools.addNew(data);
            } else {
                scheduleAPI.schools.update(data);
            }

            scheduleAPI.clearInputs();
            scheduleAPI.modalSchool.style.display = 'none';
        });
        // Применить для аудитории
        this.applyClassroom.addEventListener('click', function () {
            var classroomTitle = scheduleAPI.modalClassroom.querySelector('.classroom-title').value;
            var classroomLocation = scheduleAPI.modalClassroom.querySelector('.classroom-location').value;
            var classroomCount = scheduleAPI.modalClassroom.querySelector('.classroom-count').value;

            var data = JSON.stringify({
               title: classroomTitle,
               location: classroomLocation,
               count: classroomCount
            });

            if (scheduleAPI.applyClassroom.classList.contains('addNew')) {
                scheduleAPI.classrooms.addNew(data);
            } else {
                scheduleAPI.classrooms.update(data);
            }

            scheduleAPI.clearInputs();
            scheduleAPI.modalClassroom.style.display = 'none';
        });
        // Применить для лекции
        this.applyLecture.addEventListener('click', function () {
            var lectureTitle = scheduleAPI.modalLecture.querySelector('.lecture-title').value;
            var lectureNumber = scheduleAPI.modalLecture.querySelector('.lecture-number').value;
            var lectureSchool = scheduleAPI.modalLecture.querySelector('.lecture-school').value;
            var lectureTeacher = scheduleAPI.modalLecture.querySelector('.lecture-teacher').value;
            var lectureCLassroom = scheduleAPI.modalLecture.querySelector('.lecture-classroom').value;
            var lectureDate = scheduleAPI.modalLecture.querySelector('.lecture-date').value;
            var lectureVideo = scheduleAPI.modalLecture.querySelector('.lecture-video').value;

            var data = JSON.stringify({
               title: lectureTitle,
               number: lectureNumber,
               school: lectureSchool,
               teacher: lectureTeacher,
               classroom: lectureCLassroom,
               date: lectureDate,
               video: lectureVideo
            });

            if (scheduleAPI.applyLecture.classList.contains('addNew')) {
                scheduleAPI.lectures.addNew(data);
            } else {
                scheduleAPI.lectures.update(data);
            }

            scheduleAPI.clearInputs();
            scheduleAPI.modalLecture.style.display = 'none';
        });

        //Обработчик для закрытия модального окна
        for (var i = 0; i < cancelButtons.length; i++) {
            cancelButtons[i].addEventListener('click', function () {
                scheduleAPI.modalSchool.style.display = 'none';
                scheduleAPI.applySchool.classList.remove('addNew');
                scheduleAPI.modalClassroom.style.display = 'none';
                scheduleAPI.applyClassroom.classList.remove('addNew');
                scheduleAPI.modalLecture.style.display = 'none';
                scheduleAPI.applyLecture.classList.remove('addNew');
                scheduleAPI.clearInputs();
            });
        };

        //обработчик на поиск по школам в заданный период
        this.searchSchoolButton.addEventListener('click', function () {
            var schoolTitle = scheduleAPI.searchSchoolTitle.value;
            var startTime = scheduleAPI.searchSchoolStartTime.value;
            var endTime = scheduleAPI.searchSchoolEndTime.value;

            if ((schoolTitle == '') || (startTime == '') || endTime == '') {
                return false;
            }

            var data = JSON.stringify({
                school: schoolTitle,
                start: startTime,
                end: endTime
            });

            scheduleAPI.searchSchoolCancel.style.display = 'block';
            scheduleAPI.lectures.filterLectures(data);
        });

        this.searchSchoolCancel.addEventListener('click', function () {
             scheduleAPI.searchSchoolCancel.style.display = 'none';
             scheduleAPI.lectures.showAll();
             scheduleAPI.clearInputs();
        });

        //обработчик на поиск по аудитории в заданный период
        this.searchClassroomButton.addEventListener('click', function () {
            var classroomTitle = scheduleAPI.searchClassroomTitle.value;
            var startTime = scheduleAPI.searchClassroomStartTime.value;
            var endTime = scheduleAPI.searchClassroomEndTime.value;

            if ((classroomTitle == '') || (startTime == '') || endTime == '') {
                return false;
            }

            var data = JSON.stringify({
                classroom: classroomTitle,
                start: startTime,
                end: endTime
            });

            scheduleAPI.searchClassroomCancel.style.display = 'block';
            scheduleAPI.lectures.filterLectures(data);
        });

        this.searchClassroomCancel.addEventListener('click', function () {
             scheduleAPI.searchClassroomCancel.style.display = 'none';
             scheduleAPI.lectures.showAll();
             scheduleAPI.clearInputs();
        });
    },
    clearInputs: function () {
        // очистка полей
        scheduleAPI.modalSchool.querySelector('.school-title').value = '';
        scheduleAPI.modalSchool.querySelector('.school-count').value = '';
        scheduleAPI.modalClassroom.querySelector('.classroom-title').value = '';
        scheduleAPI.modalClassroom.querySelector('.classroom-location').value = '';
        scheduleAPI.modalClassroom.querySelector('.classroom-count').value = '';
        scheduleAPI.modalLecture.querySelector('.lecture-title').value = '';
        scheduleAPI.modalLecture.querySelector('.lecture-number').value = '';
        scheduleAPI.modalLecture.querySelector('.lecture-school').value = '';
        scheduleAPI.modalLecture.querySelector('.lecture-teacher').value = '';
        scheduleAPI.modalLecture.querySelector('.lecture-classroom').value = '';
        scheduleAPI.modalLecture.querySelector('.lecture-date').value = '';
        scheduleAPI.modalLecture.querySelector('.lecture-video').value = '';
        scheduleAPI.searchSchoolTitle.value = '';
        scheduleAPI.searchSchoolStartTime.value = '';
        scheduleAPI.searchSchoolEndTime.value = '';
        scheduleAPI.searchClassroomTitle.value = '';
        scheduleAPI.searchClassroomStartTime.value = '';
        scheduleAPI.searchClassroomEndTime.value = '';
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
                scheduleAPI.applySchool.classList.remove('addNew');
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

        // обработчики на кнопки удаления
        var deleteButtons = scheduleAPI.classroomsList.querySelectorAll('.buttons__item--delete');
        for (var i = 0; i < deleteButtons.length; i++) {
            deleteButtons[i].addEventListener('click', function (e) {
                var item = e.currentTarget;
                var row = item.parentElement.parentElement;
                var classroomTitle = row.querySelector('.classrooms__col--title').innerText;           

                var data = JSON.stringify({
                    title: classroomTitle
                });

                scheduleAPI.classrooms.delete(data);
            });
        }

        // обработчики на кнопки редактирования
        var updateButtons = scheduleAPI.classroomsList.querySelectorAll('.buttons__item--update');
        for (var i = 0; i < updateButtons.length; i++) {
            updateButtons[i].addEventListener('click', function (e) {
                var item = e.currentTarget;
                var row = item.parentElement.parentElement;
                var classroomTitle = row.querySelector('.classrooms__col--title').innerText;
                var classroomLocation = row.querySelector('.classrooms__col--location').innerText;
                var classroomCount = row.querySelector('.classrooms__col--count').innerText;

                scheduleAPI.modalClassroom.querySelector('.classroom-title').value = classroomTitle;
                scheduleAPI.modalClassroom.querySelector('.classroom-location').value = classroomLocation;
                scheduleAPI.modalClassroom.querySelector('.classroom-count').value = classroomCount;

                scheduleAPI.applyClassroom.classList.remove('addNew');
                scheduleAPI.modalClassroom.style.display = 'block';
            });
        }
    },
    renderLecture: require('./templates/lecture-future'),
    renderLectures: function (array) {
        this.scheduleList.innerHTML = '';
        for (var i = 0; i < array.length; i++) {
            var item = scheduleAPI.renderLecture(array[i]);
            
            scheduleAPI.scheduleList.innerHTML += item;
        }

        // обработчики на кнопки удаления
        var deleteButtons = scheduleAPI.scheduleList.querySelectorAll('.buttons__item--delete');
        for (var i = 0; i < deleteButtons.length; i++) {
            deleteButtons[i].addEventListener('click', function (e) {
                var item = e.currentTarget;
                var row = item.parentElement.parentElement;
                var lectureTitle = row.querySelector('.schedule__link').innerText;
                var data = JSON.stringify({
                    title: lectureTitle
                });

                scheduleAPI.lectures.delete(data);
            });
        }

        // обработчики на кнопки редактирования
        var updateButtons = scheduleAPI.scheduleList.querySelectorAll('.buttons__item--update');
        for (var i = 0; i < updateButtons.length; i++) {
            updateButtons[i].addEventListener('click', function (e) {
                var item = e.currentTarget;
                var row = item.parentElement.parentElement;
                var lectureTitle = row.querySelector('.schedule__col--title').innerText;
                var lectureSchool = row.querySelector('.schedule__col--school').innerText;
                var lectureTeacher = row.querySelector('.schedule__col--teacher').innerText;
                var lectureClassroom = row.querySelector('.schedule__col--classroom').innerText;
                var lectureDate = row.querySelector('.schedule__col--date').innerText;

                scheduleAPI.modalLecture.querySelector('.lecture-title').value = lectureTitle;
                scheduleAPI.modalLecture.querySelector('.lecture-school').value = lectureSchool;
                scheduleAPI.modalLecture.querySelector('.lecture-teacher').value = lectureTeacher;
                scheduleAPI.modalLecture.querySelector('.lecture-classroom').value = lectureClassroom;
                scheduleAPI.modalLecture.querySelector('.lecture-date').value = lectureDate;

                scheduleAPI.applyLecture.classList.remove('addNew');
                scheduleAPI.modalLecture.style.display = 'block';
            });
        }
    },
    filter: function () {
        //фильтр по редактированию школ / аудиторий / расписания
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
        //отправка запроса на сервер
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
                scheduleAPI.schools.showAll();
            },
            function () {
                console.log('Не удалось сделать запрос');
                console.log(response);
            });
        },
        delete: function (data) {
            scheduleAPI.sendRequest('DELETE', '/schools:title', data).
            then(function (response) {
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
                scheduleAPI.classrooms.showAll();
            },
            function (response) {
                console.log('Не удалось сделать запрос');
                console.log(response);
            });
        },
        update: function (data) {
            scheduleAPI.sendRequest('PUT', '/classrooms:title', data).
            then(function (response) {
                scheduleAPI.classrooms.showAll();
            },
            function (response) {
                console.log('Не удалось сделать запрос');
                console.log(response);
            });
        },
        delete: function (data) {
            scheduleAPI.sendRequest('DELETE', '/classrooms:title', data).
            then(function (response) {
                scheduleAPI.classrooms.showAll();
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
                scheduleAPI.lectures.showAll();
            },
            function (response) {
                console.log('Не удалось сделать запрос');
                console.log(response);
            });
        },
        update: function (data) {
            scheduleAPI.sendRequest('PUT', '/lectures:title', data).
            then(function (response) {
                scheduleAPI.lectures.showAll();
            },
            function (response) {
                console.log('Не удалось сделать запрос');
                console.log(response);
            });
        },
        delete: function (data) {
            scheduleAPI.sendRequest('DELETE', '/lectures:title', data).
            then(function (response) {
                scheduleAPI.lectures.showAll();
            },
            function (response) {
                console.log('Не удалось сделать запрос');
                console.log(response);
            });
        },
        filterLectures: function (data) {
            scheduleAPI.sendRequest('POST', '/lectures:filter', data).
            then(function (response) {
                scheduleAPI.renderLectures(response);
                console.log('!!!', response);
            },
            function (response) {
                console.log('Не удалось сделать запрос');
                console.log(response);
            });
        }
    }
};

module.exports = scheduleAPI;