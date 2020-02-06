const dotenv = require('dotenv').config();
const Telegraf = require('telegraf');
const Keyboard = require('telegraf-keyboard');
const bot = new Telegraf(process.env.TOKEN);
const LocalSession = require('telegraf-session-local')
const Timetable = require('./Timetable.js');
const phrases = require('./storage/phrases.js');
const config = require('./config/app.js');

function unsetScenario(message) {
  message.session.scenario = '';
}

function hasScenario(message) {
  return (message.session) && (message.session.scenario);
}

function getStatusIcon(status) {
  if (status.includes('На платформi')) {
    return '✅';
  } else if (status.includes('Вiдправлено')) {
    return '💨';
  }

  return config.STATUS_MAP[status];
}

function beautifyRoutesData(data) {
  let result = '';

  data.forEach(function (item) {
    result += '🛣️ ' + item.from + ' - ' + item.to + '\n';
    result += '🕐 (' + item.date + ') ' + item.departure_time + ' - ' + item.arrival_time + '\n';
    result += '🚌 ' + item.transport + ' (' + item.transporter + ')\n';
    result += '💵 ' + item.price + '\n';
    result += getStatusIcon(item.status) + ' ' + item.status + '\n';
    if (item.status !== 'Кв. проданi' &&
      item.status !== 'Вiдмiнено' &&
      item.status !== 'По прибуттю') {
      result += '💺 ' + item.seats_available + '\n';
    }

    result += '\n\n';
  })

  return result;
}

function translate(messageKey, message) {
  const userLanguage = message.session.language ?
    message.session.language : 'uk';

  return phrases[userLanguage] && phrases[userLanguage][messageKey] ?
    phrases[userLanguage][messageKey] : messageKey;
}

bot.use(
  new LocalSession({
    database: './storage/DB.json'
  }).middleware()
);

bot.start(function (message) {
  message.reply(translate('greeting', message));
});

bot.command('getbuses', function (message) {
  message.session.userid = message.from.id;
  message.reply(translate('fetching_timetable', message));

  Timetable.performRequest(
    config.ENDPOINTS.TIMETABLE,
    function (error, response, body) {
      Timetable.extractRoutesFromTimetableBody('ШУМСЬК', body, function (bus_data) {
        message.replyWithMarkdown(beautifyRoutesData(bus_data.reverse()));
      })
    }
  )
});

const keyboard = new Keyboard();

//command example: /findstation тернопіль
bot.command('sethome', function (message) {
  const query = message.message.text.split(' ')[1];

  if (!query) {
    message.reply(translate('instruction_sethome', message));
    return;
  }

  const result = Timetable.getBusStationsByName(query);

  if (!result.length) {
    message.reply(translate('no_results', message))
    return;
  }

  message.session.scenario = 'home_station_search';

  let tmpKeysRow = [];

  for (let i = 0; i < result.length; i++) {
    tmpKeysRow.push(result[i]);
    if (((i + 1) % 3) === 0) {
      keyboard.add(tmpKeysRow);
    }
  }

  keyboard.add(tmpKeysRow);

  keyboard.add(tmpKeysRow);
  message.reply(translate('keyboard_input', message), keyboard.draw());
});

bot.command('cancel', function (message) {
  if (hasScenario(message)) {
    unsetScenario(message);
    message.reply(translate('cancelled', message), null);
    return;
  }
  message.reply(translate('nothing_to_cancel', message), null);
})

bot.command('getsettings', function (message) {
  if (message.session.home_station) {
    message.reply(message.session.home_station);
  }
})

bot.on('text', function (message) {
  if (!hasScenario(message)) {
    message.reply(translate('unknown_input', message));
    return;
  }

  switch (message.session.scenario) {
    case 'home_station_search':
      const stationId = Timetable.getBusStationByName(message.message.text);
      if (!stationId) {
        message.reply(translate('wrong_station', message));
        return;
      }

      message.session.home_station = message.message.text;
      message.session.home_station_code = stationId;
      message.reply(translate('home_station_set', message), keyboard.empty());
      unsetScenario(message);
      break;
    default: 
      message.reply(translate('unknown_input', message));
      return;
  }
})

bot.startPolling();
