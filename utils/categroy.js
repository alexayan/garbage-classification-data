module.exports = {
  RECYCLEABLE: 1, // 可回收垃圾
  HAZARDOUS: 2, // 有害垃圾
  HOUSEHOLD_FOOD: 4, // 湿垃圾
  RESIDUAL: 8, // 干垃圾
  is(value, category) {
    if (value === category) {
      return true;
    }
    const values = [
      this.RECYCLEABLE,
      this.HAZARDOUS,
      this.HOUSEHOLD_FOOD,
      this.RESIDUAL,
    ].reduce((rtn, v) => {
      if (v !== value) {
        rtn.push(v + value);
      }
      return rtn;
    }, []);
    return values.indexOf(category) !== -1;
  },
  categorys(value) {
    const categorys = [];
    if (this.is(this.RECYCLEABLE, value)) {
      categorys.push(this.RECYCLEABLE);
    }
    if (this.is(this.HAZARDOUS, value)) {
      categorys.push(this.HAZARDOUS);
    }
    if (this.is(this.HOUSEHOLD_FOOD, value)) {
      categorys.push(this.HOUSEHOLD_FOOD);
    }
    if (this.is(this.RESIDUAL, value)) {
      categorys.push(this.RESIDUAL);
    }
    return categorys;
  },
};
