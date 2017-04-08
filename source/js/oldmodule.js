module.exports = {
    init: function () {
        //объявляем переменные
        var self = this;
        this.renderLectureLast = require('./templates/lecture-last');
        this.renderLectureFuture = require('./templates/lecture-future');
        this.lecturesArray = require('./data/lectures.json');
        this.teachersArray = require('./data/teachers.json');
        this.lecturesList = document.querySelector('.schedule__list');
        this.teacherWindow = document.querySelector('.teacher');
        this.selectSchoolBlock = document.querySelector('.school-filter__select');
        this.searchTeacherBlock = document.querySelector('.teacher-filter__input');

        //рендерим расписание
        this.renderSchedule(this.lecturesArray);

        //назначаем обработчики на кнопку закрытия окна учителя
        var closeTeacherWindowButton = this.teacherWindow.querySelector('.teacher__button');
        closeTeacherWindowButton.addEventListener('click', this.closeTeacherWindowButton.bind(self));

        //назначаем обработчик на изменение фильтра по школам
        this.selectSchoolBlock.addEventListener('change', this.renderFilteredBySchool.bind(self));

        //назначаем обработчик на поиск по учителю
        this.searchTeacherBlock.addEventListener('keyup', this.filterByTeacher.bind(self));
    },
    filteredArray: [],
    filteredByTeacherArray: [],
    isMatching: function (full, chunk) {
        var string = full.toLowerCase(),
            substring = chunk.toLowerCase();

        if (string.indexOf(substring) + 1) {
            return true;
        }

        return false;
    },
    renderSchedule: function (array) {
        var self = this;
        this.lecturesList.innerHTML = '';
        for (var i = 0; i < array.length; i++) {
            if (array[i].video != "") {
                var item = this.renderLectureLast(array[i]);
                this.lecturesList.innerHTML += item;
            } else {
                var item = this.renderLectureFuture(array[i]);
                this.lecturesList.innerHTML += item;
            }
        }
        //назначаем обработчики на имена учителей
        var teachers = this.lecturesList.querySelectorAll('.schedule__teacher');
        for (var i = 0; i < teachers.length; i++) {
            teachers[i].addEventListener('click', this.showTeacherWindow.bind(self));
        }
    },
    renderFilteredBySchool: function () {
        var selectedIndex = this.selectSchoolBlock.options.selectedIndex;
        var selectedValue = this.selectSchoolBlock.options[selectedIndex].value;

        this.filteredArray.length = 0;

        if (selectedValue == 'Все школы') {
            this.renderSchedule(this.lecturesArray);
            this.searchTeacherBlock.value = '';
        } else {
            for (var i = 0; i < this.lecturesArray.length; i++) {
                var schoolName = this.lecturesArray[i].school;
                if (schoolName.indexOf(selectedValue) > -1) {
                    this.filteredArray.push(this.lecturesArray[i]);
                }
            }
            console.log()
            this.renderSchedule(this.filteredArray);
            this.searchTeacherBlock.value = '';
        }
    },
    filterByTeacher: function () {
        var value = this.searchTeacherBlock.value;
        this.filteredByTeacherArray.length = 0;

        if (this.filteredArray.length != 0) {
            for (var i = 0; i < this.filteredArray.length; i++) {
                var teachersName = this.filteredArray[i].teacher.join();
                if (this.isMatching(teachersName, value)) {
                    this.filteredByTeacherArray.push(this.filteredArray[i]);
                }
            }
            if (this.filteredByTeacherArray.length != 0) {
                this.renderSchedule(this.filteredByTeacherArray);
            } else {
                this.lecturesList.innerHTML = '<p>По Вашему запросу лекций не найдено</p>';
            }
        } else {
            for (var i = 0; i < this.lecturesArray.length; i++) {
                var teachersName = this.lecturesArray[i].teacher.join();
                if (this.isMatching(teachersName, value)) {
                    this.filteredByTeacherArray.push(this.lecturesArray[i]);
                }
            }
            if (this.filteredByTeacherArray.length != 0) {
                this.renderSchedule(this.filteredByTeacherArray);
            } else {
                this.lecturesList.innerHTML = '<p>По Вашему запросу лекций не найдено</p>';
            }
        }
    },
    showTeacherWindow: function (e) {
        var teacherName = e.target.innerText;
        var photoBlock = this.teacherWindow.querySelector('.teacher__photo'),
            nameBlock = this.teacherWindow.querySelector('.teacher__name'),
            jobBlock = this.teacherWindow.querySelector('.teacher__job'),
            infoBlock = this.teacherWindow.querySelector('.teacher__text');

        for (var i = 0; i < this.teachersArray.length; i++) {
            if (teacherName === this.teachersArray[i].name) {
                photoBlock.setAttribute('src', this.teachersArray[i].photo);
                nameBlock.innerText = this.teachersArray[i].name;
                jobBlock.innerText = this.teachersArray[i].job;
                infoBlock.innerText = this.teachersArray[i].info;
                this.teacherWindow.style.display = 'block';

                return;
            }
        }

    },
    closeTeacherWindowButton: function () {
        this.teacherWindow.style.display = 'none';
    }
};