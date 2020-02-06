const config = {
  ENDPOINTS: {
    TIMETABLE: 'http://bus.com.ua/cgi-bin/tablo.pl?as=610100'
  },
  STATUS_MAP: {
    'У продажу': '✅',
    'Вiдмiнено': '⚠️',
    'Кв. проданi': '🤷‍♀️',
    'По прибуттю': '⏳',
    'Тимчасово не курсує': '🙅‍♂️',
    'Затримка': '⌛'
  }
}

module.exports = config;
