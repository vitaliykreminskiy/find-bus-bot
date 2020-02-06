const config = require('./config/app.js');
const request = require('request');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
let stations = require('./storage/stations.js');

class Timetable {
    static performRequest(endpoint, callback) {
        request(
            {
                method: 'GET',
                uri: endpoint,
                gzip: true,
                encoding: null
            }, callback
        )
    }

    static extractRoutesFromTimetableBody(destination, body, callback) {
        let bus_data = [];
        const $ = cheerio.load(iconv.decode(body, 'win1251'));
        let directions = $(`table[style=\'font-size:75%;\'] tbody tr > td:nth-child(2) > a:contains(${destination})`)
          .parent().parent();
        directions.each(function (index, el) {
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

        callback(bus_data);
    }

    static getBusStations(callback) {
        let stations = {};
        Timetable.performRequest(config.ENDPOINTS.STATIONS, function(error, response, body) {
            const $ = cheerio.load(iconv.decode(body, 'win1251'));
            let stationsNodes = $(`table[style=\'font-size:60%;border: #528d5c 1px dashed;\'] tbody tr > td > a`);
            stationsNodes.each(function(index, el) {
                const stationCode = $(this).attr('href').split('=')[1];
                stations[$(this).text()] = stationCode;
            })

            callback(stations);
        })
    }

    static getBusStationsByName(query) {
        if (!query) {
            return [];
        }

        let stationNames = Object.keys(stations);
        const loweredQuery = query.toLowerCase();
        const matchingStations = stationNames.filter((item) => {
            return item.toLowerCase().indexOf(loweredQuery) !== -1;
        })

        return matchingStations;
    }

    static getBusStationByName(query) {
        if (!query) {
            return false;
        }

        return Object.keys(stations).indexOf(query) != -1 ?
            stations[query] : false;
    }
}

module.exports = Timetable;