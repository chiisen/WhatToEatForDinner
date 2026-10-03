const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('交付的 CSS 包含頁面間距、字級與有效的主題變數', () => {
    const css = fs.readFileSync(path.join(__dirname, '../dist/output.css'), 'utf8');
    for (const selector of ['.px-6{', '.py-8{', '.text-3xl{', '.max-w-5xl{']) {
        assert.ok(css.includes(selector), `缺少 ${selector}，請重新建置樣式`);
    }
    assert.match(css, /color:var\(--color-text-muted\)/);
    assert.doesNotMatch(css, /(?:color|border-radius|--tw-gradient-from|--tw-shadow):--/);
});
