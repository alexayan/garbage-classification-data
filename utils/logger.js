const log4js = require('log4js');
const path = require('path');

const crawlerLogPath = path.resolve(__dirname, '../crawler.log');

log4js.configure({
  appenders: {
    crawler: { type: 'file', filename: crawlerLogPath },
    lhsr: { type: 'file', filename: path.resolve(__dirname, '../lhsr.log') },
    out: { type: 'stdout' },
  },
  categories: {
    default: { appenders: ['out'], level: 'all' },
    crawler: { appenders: ['crawler'], level: 'all' },
    lhsr: { appenders: ['lhsr'], level: 'all' },
  },
});

module.exports = log4js;
