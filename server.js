const dotenv = require('dotenv').config();
const cheerio = require('cheerio');
const Telegraf = require('telegraf');
const request = require('request');
const iconv = require('iconv-lite');
const bot = new Telegraf(process.env.TOKEN);
const express = require('express');
const app = express();


let endpoint = 'http://bus.com.ua/cgi-bin/tablo.pl?as=610100';

function getStatusIcon(status) {
    if (status.includes('На платформi')) {
        return '✅';
    } else {
        let status_map = {
            'У продажу': '✅',
            'Вiдмiнено': '⚠️',
            'Кв. проданi': '🤷‍♀️',
            'По прибуттю': '⏳'
        }
    
        return status_map[status];
    }
}

function beautifyRoutesData(data) {
    let result = '';

    data.forEach(function(item) {
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

bot.telegram.setWebhook(`${process.env.URL}/bot${process.env.TOKEN}`);
app.use(bot.webhookCallback(`${process.env.URL}/bot${process.env.TOKEN}`));

bot.start(function(message){
    message.reply('Go home darling');
});

bot.command('getbuses', function(message) {
    let bus_data = [];
    message.reply('🔃 Fetching timetable, wait a sec... ');

    request(
        {
            method: 'GET',
            uri: endpoint,
            gzip: true,
            encoding: null
        },
            function (error, response, body) {
                const $ = cheerio.load(iconv.decode(body, 'win1251'));
                let directions = $('table[style=\'font-size:75%;\'] tbody tr > td:nth-child(2) > a:contains(ШУМСЬК)')
                    .parent().parent();
                directions.each(function(index, el) {
                    let [origin, destination] = $(this).find('td:nth-child(2)').text().split('-');
                    let route = {
                        from: origin.trim(),
                        to: destination.trim(),
                        departure_time: $(this).find('td:nth-child(1) b').text(),
                        arrival_time: $(this).find('td:nth-child(3) b').text(),
                        date: $(this).find('td:nth-child(1) font').text(),
                        price: $(this).find('td:nth-child(4)').text().trim(),
                        transport: $(this).find('td:nth-child(5) b a').text().trim(),
                        transporter: $(this).find('td:nth-child(5) font').text().trim(),
                        status: $(this).find('td:nth-child(6) font b').text(),
                        seats_available: $(this).find('td:nth-child(7) b a').text()
                    }

                    bus_data.push(route);
                })

                message.replyWithMarkdown(beautifyRoutesData(bus_data.reverse()));
        }
      )
})

app.get('/', (req, res) => {
    res.send('My bot is running here, get out');
});

app.listen(process.env.PORT, function() {
    console.log(`Server running on port ${process.env.PORT}`);
});



