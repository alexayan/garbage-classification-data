const assert = require('assert');
const categray = require('../../utils/categroy');

describe('utils/categray', function() {
  describe('#is()', function() {
    it('should return true', function() {
      assert.equal(categray.is(categray.HAZARDOUS, categray.HAZARDOUS), true);
      assert.equal(categray.is(categray.HAZARDOUS, categray.HAZARDOUS + categray.HOUSEHOLD_FOOD), true);
    });
    it('should return false', function() {
      assert.equal(categray.is(categray.HAZARDOUS, categray.HOUSEHOLD_FOOD), false);
      assert.equal(categray.is(categray.HAZARDOUS, categray.HOUSEHOLD_FOOD + categray.RESIDUAL), false);
    });
  });

  describe('#categorys()', function() {
    it('should return true', function() {
      assert.deepEqual(categray.categorys(categray.HAZARDOUS + categray.HOUSEHOLD_FOOD), [categray.HAZARDOUS, categray.HOUSEHOLD_FOOD]);
    });
    it('should return true', function() {
      assert.notDeepEqual(categray.categorys(categray.HAZARDOUS + categray.RESIDUAL), [categray.HAZARDOUS, categray.HOUSEHOLD_FOOD]);
    });
  });
});
