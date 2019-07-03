const assert = require('assert');
const database = require('../../utils/database');
const categray = require('../../utils/categroy');

describe('utils/database', function() {
  describe('#insert()', function() {
    it('should insert success', function(done) {
      database.insert({
        name: 'test_insert',
        categroy: categray.RECYCLEABLE
      }).then((res) => {
        if (res[0]) {
          done(res[0]);
        } else {
          done();
        }
      })
    });
  });

  describe('#update()', function() {
    it('should update success', function(done) {
      database.update({
        name: 'test_insert',
        categroy: categray.RESIDUAL
      }).then((res) => {
        if (res[0]) {
          done(res[0]);
        } else {
          done();
        }
      })
    });
  });

  describe('#find()', function() {
    it('should find success', function(done) {
      database.find('test_insert').then((res) => {
        if (res[0]) {
          done(res[0]);
        } else {
          done();
        }
      })
    });
    it('should find fail', function(done) {
      database.find('test_find').then((res) => {
        if (res[0] || res[1]) {
          done(res[0]);
        } else {
          done();
        }
      })
    });
  });

  describe('#remove()', function() {
    it('should remove success', function(done) {
      database.remove('test_insert').then((res) => {
        if (res[0]) {
          done(res[0]);
        } else {
          done();
        }
      })
    });
  });
});
