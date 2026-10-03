# WhatToEatForDinner｜晚餐抽籤小幫手

純 HTML、CSS 與 JavaScript 的晚餐抽籤工具，使用 Tailwind CSS 4 建置樣式。

![晚餐抽籤示意](images/D01.png)

## 使用方式

1. 按「開始抽籤」，每 100 毫秒隨機切換餐點。
2. 按「停止抽籤」留下結果。
3. 在「我的餐點清單」新增或刪除餐點；修改清單會停止抽籤。

預設提供 10 道餐點。空白與重複名稱不會加入；清單清空後，須先新增餐點才能抽籤。

清單透過 localStorage 保存在目前瀏覽器與網站來源中，不會跨裝置同步。
清除網站資料或結束無痕工作階段可能移除清單。無法保存時頁面會提示，當次仍可使用。

## 安裝與建置

需要 Node.js 與 npm；`.nvmrc` 記錄原始開發版本 20，本次驗證使用 Node.js 24.12.0。
在專案根目錄的 PowerShell 執行：

```powershell
npm ci
npm run build:prod
npm test
```

`build:prod` 產生壓縮後的 `dist/output.css`。修改樣式時可執行 `npm run build` 持續監看；按 `Ctrl+C` 停止。

## 本機預覽

已提交編譯好的 CSS，只預覽網站時可直接啟動靜態伺服器。需要 Python 3：

```powershell
Write-Host '網站網址：http://localhost:8000'
python -m http.server 8000 --bind 127.0.0.1
```

開啟 [http://localhost:8000](http://localhost:8000)，保持終端機開啟，按 `Ctrl+C` 停止伺服器。
使用固定網址可讓本機保存的清單持續沿用；變更主機名稱或連接埠會使用另一份儲存空間。

## 靜態部署

執行 `npm ci` 與 `npm run build:prod` 後，把下列檔案放到靜態主機的同一個網站目錄，保留資料夾結構：

```text
index.html
menu.js
script.js
dist/output.css
```

網站入口為 `index.html`。例如使用 GitHub Pages 時，可將包含以上檔案的專案根目錄作為發布來源。
部署根目錄不是單獨的 `dist/`；該目錄只存放 CSS。網站不需要 API Key、後端或資料庫。

## 開發與驗證

- `menu.js`：預設餐點、清單整理與本機保存。
- `script.js`：抽籤計時器、頁面互動與按鈕狀態。
- `src/input.css`：Tailwind 入口及自訂樣式；修改後需重新建置。
- `tests/`：Node 內建測試，涵蓋抽籤、清單互動、儲存失敗與 CSS 產物。

`npm test` 的互動測試使用模擬 DOM 與計時器，尚未涵蓋真實瀏覽器或手機操作。
專案目前沒有設定 Pint 或 Biome。提交前請執行 `git diff --check`。

Gemini CLI 是可選的開發輔助工具，不是網站安裝或執行依賴。
