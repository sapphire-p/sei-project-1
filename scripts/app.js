
// Grid variables

const grid = document.querySelector(".grid")
const width = 11
const cellCount = width * width
const cells = []

// Scoring variables

let score = 0
let livesRemaining = 3

// Gun, Dinos, Missile, Rock position variables

const gunStartPosition = 104 // index number
let gunCurrentPosition // index number

// const dinosStartPosition // array of index numbers
let dinosCurrentPosition //array of index numbers

let missileCurrentPosition // index number
let rockCurrentPosition // index number

// Timer variables

let dinosTimer
let missileTimer
let rockLaunchTimer
let rockTimer

// Speed variables

let dinosSpeed = 1000
let rockSpeed = 1000
let missileSpeed = 1000




function createGrid() {
  for (let i = 0; i < cellCount; i++) {
    const cell = document.createElement("div")
    cell.innerText = i
    grid.appendChild(cell)
    cells.push(cell)
  }

}

createGrid()

cells[gunStartPosition].classList.add("gun")
cells[82].classList.add("dino")
cells[93].classList.add("missile")