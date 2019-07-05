/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */

// 数据来源 https://github.com/jihongboo/wast_sortting_helper_wechat/blob/master/miniprogram/resources/result.js
const Logger = require('../../utils/logger');
const categroy = require('../../utils/categroy');
const datebase = require('../../utils/database');
const data = require('./data');

const logger = Logger.getLogger();

const TYPES = {
  1: categroy.HOUSEHOLD_FOOD,
  2: categroy.RESIDUAL,
  3: categroy.RECYCLEABLE,
  4: categroy.HAZARDOUS,
};

async function main() {
  logger.trace('开始处理数据');
  const datas = Object.values(data.data);
  for (let i = 0; i < datas.length; i++) {
    const items = datas[i];
    for (let j = 0, len = items.length; j < len; j++) {
      const item = items[j];
      const garbage = {
        name: item.n,
        categroy: TYPES[item.c],
      };
      let resp = await datebase.insert(garbage);
      if (resp[0]) {
        logger.warn(`insert: ${resp[0].message}`);
        resp = await datebase.update(garbage);
        if (resp[0]) {
          logger.warn(`update: ${resp[0].message}`);
        } else {
          logger.info('updated', garbage);
        }
      } else {
        logger.info('inserted', garbage);
      }
    }
  }
  logger.trace('处理完成');
}

main();
