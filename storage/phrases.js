const phrases = {
    uk: {
        greeting: '👋 Привіт!',
        cancelled: '✅ Дію скасовано',
        no_results: '🤷‍♂️ Нічого не знайдено. Спробуйте ще раз',
        wrong_station: 'Неправильна назва станції, спробуйте ще раз',
        unknown_input: '🤷‍ Ну і що це повинно означати?',
        keyboard_input: 'Виберіть результат на клавіатурі: ⏬',
        home_station_set: '✅ Домашню станцію успішно встановлено!',
        nothing_to_cancel: '🤷‍♂️ Немає що скасовувати',
        fetching_timetable: '🔁 Отримуємо дані, секунду...',
        instruction_sethome: 'ℹ️ Використання команди: /sethome [назва міста] \nВикористовується для початку пошуку автостанції щоб в подальшому використовувати її як стартовий пункт рейсу'
    },
    ru: {
        greeting: '👋 Привет!',
        cancelled: '✅ Действие отменено',
        no_results: '🤷‍♂️ Ничего не найдено, попробуйте ещё раз',
        wrong_station: 'Неверное название станции, попробуйте ещё раз',
        unknown_input: '🤷‍ Ну и что это должно значить?',
        keyboard_input: 'Выберите результат на клавиатуре: ⏬',
        home_station_set: '✅ Домашняя станция успешно установлена!',
        nothing_to_cancel: '🤷‍♂️ Отсутствует действие для отмены',
        fetching_timetable: '🔁 Получаем данные, подождите...',
        instruction_sethome: 'ℹ️ Использование команды: /sethome [название города] \nИспользуется для начала поиска автостанции чтобы в будущеем использовать ёё как стартовый пункт рейса'
    }, 
    en: {
        greeting: '👋 Hi!',
        cancelled: '✅ Action cancelled',
        no_results: '🤷‍♂️ What is supposed to mean?',
        wrong_station: 'Given station not found, please try again',
        unknown_input: '🤷‍ Unknown input',
        keyboard_input: 'Pick one of results from the keyboard below: ⏬ ',
        home_station_set: '✅ Home station was successfully set!',
        nothing_to_cancel: '🤷‍♂️ Nothing to cancel',
        fetching_timetable: '🔁 Fetching timetable, wait a second...',
        instruction_sethome: 'ℹ️ Command usage: /sethome [city name] \nStarts a search among avalaible bus stations in order to use certain as default departure point'
    }
}

module.exports = phrases;