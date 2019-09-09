# 生活垃圾分类数据

本项目对网上的垃圾分类数据进行整合，提供尽量多的垃圾分类数据，开发者可以基于垃圾分类数据进行算法训练，应用开发...

欢迎提供更多垃圾分类数据源 :)

## 数据文件

最近更新日期 2019-8-2

- garbage.csv
- garbage.json
- database/garbage.sqlite

## 使用

上面所列的文件已包含所有垃圾分类数据，可以直接使用，不需要运行爬虫重新抓取

## 垃圾分类说明

目前垃圾有 4 个分类：

- 1 (可回收垃圾)
- 2 (有害垃圾)
- 4 (湿垃圾)
- 8 (干垃圾)
- 16 (大件垃圾)

分类值可以相加，比如 3 表示既属于上海可回收垃圾和上海有害垃圾

## 数据统计

category | count
------------- | -------------
1 | 1265
2 | 234
4 | 1031
8 | 1422
16 | 34

## 脚本

初始化数据库

```
node scripts/init_database.js
```

运行 lhsr 爬虫

```
node datasource/lhsr_crawler/index.js // 爬虫在 lhsr.log 文件内
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
