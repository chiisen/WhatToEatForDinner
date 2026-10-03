const getStorage = () => localStorage;
const loadedMenu = DinnerMenu.loadOptions(getStorage);
let dinnerOptions = loadedMenu.options;

const resultDiv = document.getElementById("result");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");

const menuList = document.getElementById('menu-list');
const menuForm = document.getElementById('menu-form');
const menuInput = document.getElementById('menu-input');
const menuStatus = document.getElementById('menu-status');
let intervalId = null;

function getRandomDinner() {
    const randomIndex = Math.floor(Math.random() * dinnerOptions.length);
    resultDiv.textContent = dinnerOptions[randomIndex];
}

startButton.addEventListener("click", () => {
    if (intervalId === null && dinnerOptions.length > 0) {
        resultDiv.setAttribute('aria-live', 'off');
        getRandomDinner();
        intervalId = setInterval(getRandomDinner, 100);
        startButton.disabled = true;
        stopButton.disabled = false;
    }
});

function stopDrawing() {
    if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
    }
    startButton.disabled = dinnerOptions.length === 0;
    stopButton.disabled = true;
    resultDiv.setAttribute('aria-live', 'polite');
}

stopButton.addEventListener("click", () => {
    stopDrawing();
    if (dinnerOptions.length) resultDiv.textContent = `今晚吃：${resultDiv.textContent.replace(/^今晚吃：/, '')}`;
});

function renderMenu() {
    menuList.replaceChildren();
    dinnerOptions.forEach((option, index) => {
        const item = document.createElement('li');
        const label = document.createElement('span');
        label.textContent = option;
        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'btn-outline';
        remove.textContent = '刪除';
        remove.setAttribute('aria-label', `刪除 ${option}`);
        remove.addEventListener('click', () => {
            dinnerOptions.splice(index, 1);
            updateMenu();
            const nextItem = menuList.children[Math.min(index, dinnerOptions.length - 1)];
            if (nextItem) nextItem.lastElementChild.focus();
            else menuInput.focus();
        });
        item.append(label, remove);
        menuList.append(item);
    });
    stopDrawing();
    resultDiv.textContent = dinnerOptions.length ? '按下開始抽籤' : '請先新增餐點';
}

function updateMenu() {
    renderMenu();
    menuStatus.textContent = DinnerMenu.saveOptions(getStorage, dinnerOptions)
        ? `已保存 ${dinnerOptions.length} 道餐點。`
        : '清單已更新，但無法保存；重新整理後可能遺失變更。';
}

menuForm.addEventListener('submit', event => {
    event.preventDefault();
    const option = menuInput.value.trim();
    if (!option || dinnerOptions.includes(option)) {
        menuStatus.textContent = option ? '這道餐點已在清單中。' : '請輸入餐點名稱。';
        menuInput.focus();
        return;
    }
    dinnerOptions.push(option);
    menuInput.value = '';
    updateMenu();
    menuInput.focus();
});

renderMenu();
if (loadedMenu.failed) menuStatus.textContent = '無法讀取已保存的清單，暫時使用預設餐點。';
