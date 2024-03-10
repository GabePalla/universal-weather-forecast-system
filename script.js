import "./js/terminal.js";
import "./js/weather-data.js";

function gridGenerator() {
    const globalContentContainer = document.getElementById('teste');
    const gridWidth = ((globalContentContainer.getBoundingClientRect().width * 0.11) / 5);
    globalContentContainer.style.gridTemplateColumns = `repeat(auto-fill, minmax(${gridWidth}px, 1fr))`
    globalContentContainer.style.gridTemplateRows = `repeat(auto-fill, minmax(${gridWidth}px, 1fr))`
}

// gridGenerator();