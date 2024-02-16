const sandButtonElement = document.getElementById('sand');
const woodButtonElement = document.getElementById('wood');
const gravelButtonElement = document.getElementById('gravel');
const waterButtonElement = document.getElementById('water');

const width = 400;
const height = 500;
const w = 4;
let grid;
let cols, rows;
let color;

let materia = 'sand';
const materials = {
  sand: {
    color: {
      min: 45,
      max: 55
    }
  },
  wood: {
    color: {
      min: 56,
      max: 65
    }
  },
  gravel: {
    color: {
      min: 66,
      max: 75
    }
  },
  water: {
    color: {
      min: 200,
      max: 210
    }
  }
};

const selectMateria = event => {
  materia = event.target.dataset.materia;
  console.log(materia);
};

const make2DArray = (cols, rows) => {
  let array = new Array(cols);
  for (let i = 0; i < array.length; i++) {
    array[i] = new Array(rows);
    //restablecer los valores con nextGrid
    for (let j = 0; j < array[i].length; j++) {
      array[i][j] = 0;
    }
  }
  return array;
};

function setup() {
  createCanvas(width, height);
  colorMode(HSB, 360, 255, 255);
  cols = width / w;
  rows = height / w;
  grid = make2DArray(cols, rows);

  //establecer todos los valores a 0 primera vuelta
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = 0;
    }
  }
}

const updateGrid = () => {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      noStroke();
      if (grid[i][j] >= 45 && grid[i][j] <= 55) {
        fill(grid[i][j], 250, 245);
        let x = i * w;
        let y = j * w;
        square(x, y, w);
      } else if (grid[i][j] >= 56 && grid[i][j] <= 65) {
        fill(25, 250, grid[i][j]);
        let x = i * w;
        let y = j * w;
        square(x, y, w);
      } else if (grid[i][j] >= 66 && grid[i][j] <= 75) {
        fill(100, 0, grid[i][j]);
        let x = i * w;
        let y = j * w;
        square(x, y, w);
      } else if (grid[i][j] >= 200 && grid[i][j] <= 210) {
        fill(grid[i][j], 250, 245);
        let x = i * w;
        let y = j * w;
        square(x, y, w);
      }
    }
  }
};

const gravity = (i, j, position, nextGrid) => {
  if (position > 0) {
    let below = grid[i][j + 1];
    let randomDir = random([-1, 1]);
    let bLeft;
    let bRight;

    if (i > 0 && i < cols - 1) {
      bLeft = grid[i - randomDir][j + 1];
      bRight = grid[i + randomDir][j + 1];
      left = grid[i - 1][j];
      right = grid[i + 1][j];
    }

    //Gravedad ----> Arena
    if (grid[i][j] >= 45 && grid[i][j] <= 55) {
      if (below === 0) {
        // Si la casilla debajo está vacía, la arena cae normalmente
        nextGrid[i][j + 1] = grid[i][j];
        grid[i][j] = 0;
      } else if (bLeft === 0) {
        // Si below-left está vacío
        nextGrid[i - randomDir][j + 1] = grid[i][j];
        grid[i][j] = 0;
      } else if (bRight === 0) {
        // Si below-right está vacío
        nextGrid[i + randomDir][j + 1] = grid[i][j];
        grid[i][j] = 0;
      } else {
        // Si no está vacío, se para
        nextGrid[i][j] = grid[i][j];
      }
    }
    //Gravedad ----> Madera
    else if (grid[i][j] >= 56 && grid[i][j] <= 65) {
      nextGrid[i][j] = grid[i][j];
    }
    //Gravedad ----> Grava
    else if (grid[i][j] >= 66 && grid[i][j] <= 75) {
      if (below === 0) {
        nextGrid[i][j + 1] = grid[i][j];
        grid[i][j] = 0;
      } else {
        nextGrid[i][j] = grid[i][j];
      }
    }
    //Gravedad ----> Agua
    else if (grid[i][j] >= 200 && grid[i][j] <= 210) {
      if (below === 0 && j + 1 < grid[i].length) {
        nextGrid[i][j + 1] = grid[i][j];
      } else if (bLeft === 0 && j + 1 < grid[i].length && i - randomDir >= 0) {
        nextGrid[i - randomDir][j + 1] = grid[i][j];
        grid[i][j] = 0;
      } else if (
        bRight === 0 &&
        j + 1 < grid[i].length &&
        grid[i][j + 1] === 0
      ) {
        nextGrid[i][j + 1] = grid[i][j];
      } else if (left === 0 && i - 1 >= 0 && nextGrid[i - 1][j] === 0) {
        nextGrid[i - 1][j] = grid[i][j];
        grid[i][j] = 0;
      } else if (
        right === 0 &&
        i + 1 < grid.length &&
        nextGrid[i + 1][j] === 0
      ) {
        nextGrid[i + 1][j] = grid[i][j];
        grid[i][j] = 0;
      } else {
        nextGrid[i][j] = grid[i][j];
      }
    }
  }
};

const getNextGrid = nextGrid => {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let position = grid[i][j];
      gravity(i, j, position, nextGrid);
    }
  }
  return nextGrid;
};

function draw() {
  background(255);
  colorMode(HSB, 360, 255, 255);

  //pintar el grid cada vez
  updateGrid();
  //actualizar el grid y la posición y++
  let nextGrid = make2DArray(cols, rows);
  grid = getNextGrid(nextGrid);
}

//mousemove event
function mouseDragged() {
  let colMouse = floor(mouseX / w);
  let rowMouse = floor(mouseY / w);

  let mouseWeight = 2;
  let extend = floor(mouseWeight) / 2;

  for (let i = -extend; i <= extend; i++) {
    for (let j = -extend; j <= extend; j++) {
      let col = floor(colMouse + i);
      let row = floor(rowMouse + j);
      if (col >= 0 && row >= 0 && col <= cols - 1 && row <= rows - 1) {
        const { min, max } = materials[materia].color;
        color = Math.floor(random(min, max));
        grid[col][row] = color;
      }
    }
  }
}

sandButtonElement.addEventListener('click', selectMateria);
woodButtonElement.addEventListener('click', selectMateria);
gravelButtonElement.addEventListener('click', selectMateria);
waterButtonElement.addEventListener('click', selectMateria);
