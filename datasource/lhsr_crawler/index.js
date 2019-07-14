/* eslint-disable prefer-destructuring */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
const fs = require('fs-extra');
const _ = require('lodash');
const fetch = require('node-fetch');
const path = require('path');
const Logger = require('../../utils/logger');
const categroy = require('../../utils/categroy');
const datebase = require('../../utils/database');
const chineseCharsList = _.uniq(require('./chinese_char').split('')).concat(
  'qwertyuiopasdfghjklzxcvbnm'.split(''),
);

const taskFilePath = path.resolve(__dirname, './.task');

const logger = Logger.getLogger('lhsr');

const KEYWORDS = [];
const TYPES = {
  'images/ico-2.jpg': categroy.RECYCLEABLE,
  'images/ico-4.jpg': categroy.RESIDUAL,
  'images/ico-3.jpg': categroy.HOUSEHOLD_FOOD,
  'images/ico-1.jpg': categroy.HAZARDOUS,
};

async function process(c) {
  logger.info(`处理 ${c}`);
  const resp = await fetch(
    'http://trash.lhsr.cn/sites/feiguan/trashTypes/dyn/Handler/Handler.ashx',
    {
      headers: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: `a=Keywords_Get&s_kw=${c}`,
      method: 'POST',
    },
  ).then(res => res.text());
  logger.info(`keywords result: ${resp}`);
  if (resp) {
    const words = JSON.parse(resp);
    for (let j = 0; j < words.length; j++) {
      const word = words[j];
      logger.info(`处理 ${word}`);
      if (KEYWORDS.indexOf(word) === -1) {
        const html = await fetch(
          `http://trash.lhsr.cn/sites/feiguan/trashTypes_2/TrashQuery.aspx?kw=${encodeURIComponent(
            word,
          )}`,
        ).then(res => res.text());
        let matched = false;
        for (let i = 0; i < Object.keys(TYPES).length; i++) {
          const t = Object.keys(TYPES)[i];
          if (html.indexOf(t) !== -1) {
            matched = true;
            const garbage = {
              name: word,
              categroy: TYPES[t],
            };
            logger.info('match', garbage);
            let res = await datebase.find(garbage.name);
            if (!res[1]) {
              res = await datebase.insert(garbage);
              logger.info('add garbage', garbage);
            } else if (res[1].categroy !== garbage.categroy) {
              res = await datebase.update(garbage);
              logger.info('update garbage', garbage);
            } else {
              logger.info('garbage exist', garbage);
            }
            KEYWORDS.push(garbage.name);
            break;
          }
        }
        if (!matched) {
          logger.warn(`${word} 无法找到分类`);
        }
      }
    }
  }
  await fs.writeFile(
    taskFilePath,
    JSON.stringify({
      lastChar: c,
    }),
  );
}

async function start(task) {
  try {
    if (!task) {
      return logger.trace('数据已全部抓取');
    }
    const lastChar = task.lastChar;
    let currentChar = '';
    if (lastChar) {
      const index = chineseCharsList.indexOf(lastChar);
      if (index === -1) {
        return logger.trace('数据已全部抓取');
      }
      if (!chineseCharsList[index + 1]) {
        return logger.trace('数据已全部抓取');
      }
      currentChar = chineseCharsList[index + 1];
    }
    if (!currentChar) {
      currentChar = chineseCharsList[0];
    }
    await process(currentChar);
    start({
      lastChar: currentChar,
    });
  } catch (e) {
    logger.error(e);
  }
  return true;
}

async function main() {
  logger.trace('开始抓取数据');
  let task = null;
  await fs.pathExists(taskFilePath).then((exists) => {
    if (!exists) {
      task = {
        lastChar: '',
      };
      return fs.writeFile(taskFilePath, JSON.stringify(task));
    }
    return fs
      .readFile(taskFilePath, {
        encoding: 'utf8',
      })
      .then((data) => {
        task = JSON.parse(data);
      });
  });
  start(task);
}

main();
