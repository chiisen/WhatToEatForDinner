const dinnerOptions = [
    "拉麵", "咖哩飯", "水餃", "牛肉麵", "披薩",
    "漢堡", "義大利麵", "火鍋", "壽司", "滷肉飯"
];

const resultDiv = document.getElementById("result");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");

let intervalId;

function getRandomDinner() {
    const randomIndex = Math.floor(Math.random() * dinnerOptions.length);
    resultDiv.textContent = dinnerOptions[randomIndex];
}

startButton.addEventListener("click", () => {
    if (!intervalId) {
        intervalId = setInterval(getRandomDinner, 100);
    }
});

stopButton.addEventListener("click", () => {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
});
