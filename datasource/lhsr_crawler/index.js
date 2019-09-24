/* eslint-disable prefer-destructuring */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
const fs = require('fs-extra');
const _ = require('lodash');
const fetch = require('node-fetch');
const path = require('path');
const Logger = require('../../utils/logger');
const category = require('../../utils/category');
const datebase = require('../../utils/database');
const chineseCharsList = _.uniq(require('./chinese_char').split('')).concat(
  'qwertyuiopasdfghjklzxcvbnm'.split(''),
);

const taskFilePath = path.resolve(__dirname, './.task');

const logger = Logger.getLogger('lhsr');

const KEYWORDS = [];
const TYPES = {
  可回收: category.RECYCLEABLE,
  干垃圾: category.RESIDUAL,
  湿垃圾: category.HOUSEHOLD_FOOD,
  有害垃圾: category.HAZARDOUS,
  大件垃圾: category.BIG_WASTE,
  电器电子产品: category.RECYCLEABLE,
  家用医疗用品: category.RESIDUAL,
};

async function process(c) {
  logger.info(`处理 ${c}`);
  const resp = await fetch(
    'http://trash.lhsr.cn/sites/feiguan/trashTypes_3/Handler/Handler.ashx',
    {
      headers: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: `a=GET_KEYWORDS&kw=${c}`,
      method: 'POST',
    },
  ).then(res => res.json());
  if (resp.kw_list) {
    logger.info(`keywords result: ${resp.kw_list}`);
    for (let i = 0, len = resp.kw_list.length; i < len; i++) {
      const kw = resp.kw_list[i];
      if (KEYWORDS.indexOf(kw) === -1) {
        const type = resp.kw_arr[i].TypeKey;
        if (!TYPES[type]) {
          logger.warn(`${type} not support`);
          // eslint-disable-next-line no-continue
          continue;
        }
        const garbage = {
          name: kw,
          category: TYPES[type],
        };
        logger.info('match', garbage);
        let res = await datebase.find(garbage.name);
        if (!res[1]) {
          res = await datebase.insert(garbage);
          logger.info('add garbage', garbage);
        } else if (res[1].category !== garbage.category) {
          res = await datebase.update(garbage);
          logger.info('update garbage', garbage);
        } else {
          logger.info('garbage exist', garbage);
        }
        KEYWORDS.push(garbage.name);
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
      await fs.unlink(taskFilePath);
      return logger.trace('数据已全部抓取');
    }
    const lastChar = task.lastChar;
    let currentChar = '';
    if (lastChar) {
      const index = chineseCharsList.indexOf(lastChar);
      if (index === -1) {
        await fs.unlink(taskFilePath);
        return logger.trace('数据已全部抓取');
      }
      if (!chineseCharsList[index + 1]) {
        await fs.unlink(taskFilePath);
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
