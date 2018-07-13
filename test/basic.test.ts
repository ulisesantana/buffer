import * as assert from 'assert';

describe('Basic tests', function () {

  it('Should be true', function () {
    assert.equal(1, true);
    assert.notStrictEqual(1, true);
    assert.strictEqual(true, true);
  });

  it('Array.prototype.includes should works', function () {
    assert.strictEqual([1,2,3].includes(1), true);
    assert.strictEqual([1,2,3].includes(0), false);
  });

  it('Object and Array destructuring should works', function () {
    const db = {
      data: [1,2,3]
    };
    
    const { data: [one, two, three] } = db;
    assert.strictEqual(one, 1);
    assert.strictEqual(two, 2);
    assert.strictEqual(three, 3);
  });

});
