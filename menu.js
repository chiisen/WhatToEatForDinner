const DinnerMenu = (() => {
    const DEFAULT_OPTIONS = Object.freeze([
        "拉麵", "咖哩飯", "水餃", "牛肉麵", "披薩",
        "漢堡", "義大利麵", "火鍋", "壽司", "滷肉飯"
    ]);
    const STORAGE_KEY = 'dinner-options-v1';

    function normalizeOptions(options) {
        if (!Array.isArray(options) || options.some(value => typeof value !== 'string')) {
            throw new TypeError('餐點清單必須是文字陣列');
        }
        return [...new Set(options.map(value => value.trim()).filter(Boolean))];
    }

    function loadOptions(getStorage) {
        try {
            const saved = getStorage().getItem(STORAGE_KEY);
            return { options: saved === null ? [...DEFAULT_OPTIONS] : normalizeOptions(JSON.parse(saved)), failed: false };
        } catch {
            return { options: [...DEFAULT_OPTIONS], failed: true };
        }
    }

    function saveOptions(getStorage, options) {
        try {
            getStorage().setItem(STORAGE_KEY, JSON.stringify(normalizeOptions(options)));
            return true;
        } catch {
            return false;
        }
    }

    return { DEFAULT_OPTIONS, normalizeOptions, loadOptions, saveOptions };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = DinnerMenu;
