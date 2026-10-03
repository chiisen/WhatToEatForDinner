const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function setup() {
    const elements = Object.fromEntries(['result', 'start', 'stop'].map(id => [id, {
        textContent: '',
        addEventListener(event, callback) { this[event] = callback; }
    }]));
    const timers = new Map();
    let nextId = 0;
    const context = vm.createContext({
        document: { getElementById: id => elements[id] },
        Math: Object.assign(Object.create(Math), { random: () => 0 }),
        setInterval(callback, delay) { timers.set(++nextId, { callback, delay }); return nextId; },
        clearInterval(id) { timers.delete(id); }
    });
    vm.runInContext(fs.readFileSync(require.resolve('../script.js'), 'utf8'), context);
    return { elements, timers };
}

test('開始後每 100 毫秒抽選餐點，連按開始不產生重複計時器', () => {
    const { elements, timers } = setup();
    elements.start.click();
    elements.start.click();
    assert.equal(timers.size, 1);
    const timer = [...timers.values()][0];
    assert.equal(timer.delay, 100);
    timer.callback();
    assert.equal(elements.result.textContent, '拉麵');
});

test('停止保留結果、清除計時器，並可再次開始', () => {
    const { elements, timers } = setup();
    elements.stop.click();
    elements.start.click();
    [...timers.values()][0].callback();
    elements.stop.click();
    assert.equal(timers.size, 0);
    assert.equal(elements.result.textContent, '拉麵');
    elements.start.click();
    assert.equal(timers.size, 1);
});
