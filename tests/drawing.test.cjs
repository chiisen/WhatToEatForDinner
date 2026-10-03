const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function setup(saved = null, storageFails = false) {
    function element() { return {
        textContent: '',
        value: '', children: [],
        addEventListener(event, callback) { this[event] = callback; },
        setAttribute() {}, focus() {},
        append(...items) { this.children.push(...items); },
        replaceChildren() { this.children = []; },
        get lastElementChild() { return this.children.at(-1); }
    }; }
    const elements = Object.fromEntries(['result', 'start', 'stop', 'menu-list', 'menu-form', 'menu-input', 'menu-status'].map(id => [id, element()]));
    const timers = new Map();
    let nextId = 0;
    const context = vm.createContext({
        document: { getElementById: id => elements[id], createElement: element },
        localStorage: {
            getItem: () => saved,
            setItem: (key, value) => { if (storageFails) throw new Error('quota'); saved = value; }
        },
        Math: Object.assign(Object.create(Math), { random: () => 0 }),
        setInterval(callback, delay) { timers.set(++nextId, { callback, delay }); return nextId; },
        clearInterval(id) { timers.delete(id); }
    });
    for (const file of ['../menu.js', '../script.js']) vm.runInContext(fs.readFileSync(require.resolve(file), 'utf8'), context);
    return { elements, timers, saved: () => saved };
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
    assert.equal(elements.result.textContent, '今晚吃：拉麵');
    elements.start.click();
    assert.equal(timers.size, 1);
});

test('新增及刪除餐點會保存並停止抽籤，空清單禁止開始', () => {
    const { elements: e, timers, saved } = setup('[]');
    e.start.click();
    assert.equal(timers.size, 0);
    assert.equal(e.start.disabled, true);
    e['menu-input'].value = ' 粥 ';
    e['menu-form'].submit({ preventDefault() {} });
    assert.deepEqual(JSON.parse(saved()), ['粥']);
    e.start.click();
    assert.equal(e.result.textContent, '粥');
    assert.equal(e.stop.disabled, false);
    e['menu-list'].children[0].lastElementChild.click();
    assert.equal(timers.size, 0);
    assert.equal(e.start.disabled, true);
    assert.deepEqual(JSON.parse(saved()), []);
});

test('拒絕空白與重複餐點，保存失敗仍保留本次選項', () => {
    const { elements: e } = setup('["粥"]', true);
    for (const value of [' ', ' 粥 ']) {
        e['menu-input'].value = value;
        e['menu-form'].submit({ preventDefault() {} });
        assert.equal(e['menu-list'].children.length, 1);
    }
    e['menu-input'].value = '<img src=x>';
    e['menu-form'].submit({ preventDefault() {} });
    assert.equal(e['menu-list'].children[1].children[0].textContent, '<img src=x>');
    assert.match(e['menu-status'].textContent, /無法保存/);
    assert.equal(e['menu-list'].children.length, 2);
});
