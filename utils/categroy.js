module.exports = {
  RECYCLEABLE: 1, // 可回收垃圾
  HAZARDOUS: 2, // 有害垃圾
  HOUSEHOLD_FOOD: 4, // 湿垃圾
  RESIDUAL: 8, // 干垃圾
  BIG_WASTE: 16, // 大件垃圾
  is(value, categroy) {
    if (value === categroy) {
      return true;
    }
    const values = [
      this.RECYCLEABLE,
      this.HAZARDOUS,
      this.HOUSEHOLD_FOOD,
      this.RESIDUAL,
      this.BIG_WASTE,
    ].reduce((rtn, v) => {
      if (v !== value) {
        rtn.push(v + value);
      }
      return rtn;
    }, []);
    return values.indexOf(categroy) !== -1;
  },
  categroys(value) {
    const categroys = [];
    if (this.is(this.RECYCLEABLE, value)) {
      categroys.push(this.RECYCLEABLE);
    }
    if (this.is(this.HAZARDOUS, value)) {
      categroys.push(this.HAZARDOUS);
    }
    if (this.is(this.HOUSEHOLD_FOOD, value)) {
      categroys.push(this.HOUSEHOLD_FOOD);
    }
    if (this.is(this.RESIDUAL, value)) {
      categroys.push(this.RESIDUAL);
    }
    if (this.is(this.BIG_WASTE, value)) {
      categroys.push(this.BIG_WASTE);
    }
    return categroys;
  },
};
