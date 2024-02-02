import {Universe, Cell} from "game_of_life"
import {memory} from "game_of_life/game_of_life_bg";

const CELL_SIZE = 5; // px
const GRID_COLOR = "#CCCCCC";
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";

// Construct the universe, and get its width and height.
const universe = Universe.new();
const width = universe.width();
const height = universe.height();

// Give the canvas room for all of our cells and a 1px border
// around each of them.
const canvas = document.getElementById("game-of-life-canvas");
canvas.height = (CELL_SIZE + 1) * height + 1;
canvas.width = (CELL_SIZE + 1) * width + 1;

const ctx = canvas.getContext('2d');
let animationId = null;

const playPauseButton = document.getElementById("play-pause");
const framesInput = document.getElementById("frames-per-tick");
let tickValue = 5000;
const tick_speed_gauge = [5000, 4000, 3000, 2000, 1000, 50]
const play = () => {
    playPauseButton.textContent = "⏸";
    renderLoop();
};
const pause = () => {
    playPauseButton.textContent = "▶";
    cancelAnimationFrame(animationId);
    animationId = null;
};

playPauseButton.addEventListener("click", async (event) => {
    if (isPaused()) {
        play();
    } else {
        pause();
    }
});

framesInput.addEventListener("input", (event) => {
    tickValue = tick_speed_gauge[event.target.value];
    renderLoop();
});
const renderLoop = () => {
    universe.tick();

    drawGrid();
    drawCells();

    setTimeout(() => {
        requestAnimationFrame(renderLoop);
    }, tickValue);};

const isPaused = () => {
    return animationId === null;
};


canvas.addEventListener("click", event => {
    //This retrieves the bounding rectangle of the canvas.
    // It provides information about the size and position of the canvas relative to the viewport.
    const boundingRect = canvas.getBoundingClientRect();
    //Calculates the scaling factor for the X-axis based on the canvas size and its bounding rectangle
    const scaleX = canvas.width / boundingRect.width;
    //Calculates the scaling factor for the Y-axis based on the canvas size and its bounding rectangle
    const scaleY = canvas.height / boundingRect.height;
    //Calculates the canvas coordinates of the click event along the X-axis
    const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
    //Calculates the canvas coordinates of the click event along the Y-axis
    const canvasTop = (event.clientY - boundingRect.top) * scaleY;
    //Calculates the row index based on the canvas coordinates and the size of each cell.
    //It uses Math.floor to round down and Math.min to ensure that the index does not exceed the height of the grid
    const row = Math.min(Math.floor(canvasTop / (CELL_SIZE + 1)), height - 1);
    //Similar to the row calculation, this calculates the column index based on the
    //canvas coordinates and the size of each cell
    const col = Math.min(Math.floor(canvasLeft / (CELL_SIZE + 1)), width - 1);
    //The row and col variables now contain the indices of the clicked cell in the grid,
    //allowing you to perform actions or modifications based on the user's click
    universe.toggle_cell(row, col);
    //redraw new grid
    drawGrid();
    drawCells();
})

const drawGrid = () => {
    ctx.beginPath();
    ctx.strokeStyle = GRID_COLOR;

    // Vertical lines.
    for (let i = 0; i <= width; i++) {
        ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
        ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
    }

    // Horizontal lines.
    for (let j = 0; j <= height; j++) {
        ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);
        ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
    }

    ctx.stroke();
};


const getIndex = (row, column) => {
    return row * width + column;
};

const bitIsSet = (n, arr) => {
    const byte = Math.floor(n / 8);
    const mask = 1 << (n % 8);
    return (arr[byte] & mask) === mask;
};

const drawCells = () => {
    const cellsPtr = universe.cells();
    const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);

    ctx.beginPath();

    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            const idx = getIndex(row, col);

            ctx.fillStyle = cells[idx] === Cell.Dead
                ? DEAD_COLOR
                : ALIVE_COLOR;

            ctx.fillRect(
                col * (CELL_SIZE + 1) + 1,
                row * (CELL_SIZE + 1) + 1,
                CELL_SIZE,
                CELL_SIZE
            );
        }
    }

    ctx.stroke();
};

play();
