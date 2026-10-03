const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeOptions, loadOptions, saveOptions, DEFAULT_OPTIONS } = require('../menu.js');

test('餐點清單會去除空白、空項及重複值', () => {
    assert.deepEqual(normalizeOptions([' 拉麵 ', '', '拉麵', '水餃']), ['拉麵', '水餃']);
    assert.throws(() => normalizeOptions(['拉麵', 123]));
    assert.throws(() => normalizeOptions('拉麵'));
});

test('保存後重新載入相同清單，包含使用者刪空的清單', () => {
    let value = null;
    const storage = { getItem: () => value, setItem: (key, data) => { value = data; } };
    for (const options of [['粥', '麵'], []]) {
        assert.equal(saveOptions(() => storage, options), true);
        assert.deepEqual(loadOptions(() => storage).options, options);
    }
});

test('首次使用預設餐點，損壞或無法讀取資料時降級並回報', () => {
    assert.deepEqual(loadOptions(() => ({ getItem: () => null })), { options: DEFAULT_OPTIONS, failed: false });
    for (const value of ['broken', '{}', '[123]']) {
        assert.deepEqual(loadOptions(() => ({ getItem: () => value })), { options: DEFAULT_OPTIONS, failed: true });
    }
    const unavailable = () => { throw new Error('storage disabled'); };
    assert.equal(loadOptions(unavailable).failed, true);
    assert.equal(saveOptions(unavailable, ['粥']), false);
    assert.equal(saveOptions(() => ({ setItem() { throw new Error('quota'); } }), ['粥']), false);
});
