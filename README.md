# 生活垃圾分类数据

## 数据格式

- garbage.csv
- garbage.json
- database/garbage.sqlite

## 垃圾分类说明

目前垃圾有 4 个分类：

- 1 (上海可回收垃圾)
- 2 (上海有害垃圾)
- 4 (上海湿垃圾)
- 8 (上海干垃圾)

分类值可以相加，比如 3 表示既属于上海可回收垃圾和上海有害垃圾

## 数据统计

categroy | count 
------------- | ------------- 
1 | 1169
2 | 202
4 | 979
8 | 1362

## 通过 npm 安装使用

```
npm i garbage-classification-data --save
```

```
import Data from 'garbage-classification-data'
```

## 脚本

初始化数据库

```
node scripts/init_database.js
```

运行 lhsr 爬虫

```
node datasource/lhsr_crawler/index.js
```

导出 json 格式数据

```
node scripts/to_json.js
```

导出 csv 格式数据

```
node scripts/to_csv.js
```

打印不同种类垃圾统计数据

```
node scripts/analyse_garbage.js
```
