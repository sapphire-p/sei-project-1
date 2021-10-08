
// Grid variables

const grid = document.querySelector(".grid")
const width = 11
const cellCount = width * width
const cells = []

// Scoring variables

let score = 0
let livesRemaining = 3

// Gun, Dinos, Missile, Rock position and class variables

const gunStartPosition = 104 // index number
let gunCurrentPosition // index number
const gunClass = "gun"

const dinosStartPosition = [26, 27, 28] // array of index numbers
let dinosCurrentPosition // array of index numbers
const dinoClass = "dino"

let missileCurrentPosition // index number
const missileClass = "missile"

let rockCurrentPosition // index number
const rockClass = "rock"

// Timer variables

let dinosTimer
let missileTimer
let rockLaunchTimer
let rockTimer

// Speed variables

let dinosSpeed = 1000
let rockSpeed = 1000
let missileSpeed = 1000

// Event Listeners

const startButton = document.querySelector(".start-button")
startButton.addEventListener("click", startGame)

// document.addEventListener('keyup', keysGunAction)



function startGame() {
  console.log("startGame() function called")
}

function createGrid() {
  for (let i = 0; i < cellCount; i++) {
    const cell = document.createElement("div")
    cell.innerText = i
    grid.appendChild(cell)
    cells.push(cell)
  }

}

createGrid()


function addItem(itemClass, position) {
  // add some control flow with conditional logic to say "If itemClass is gunClass, do this, else if itemClass is dinoClass, do this"
  cells[position].classList.add(itemClass)
}

function removeItem(itemClass, position) {
  // add some control flow with conditional logic to say "If itemClass is gunClass, do this, else if itemClass is dinoClass, do this"
  cells[position].classList.remove(itemClass)
}



// function keysGunAction(event) {
//   console.log("keysGunAction() function called")
//   const key = event.keyCode

//   if ()
// }



// cells[gunStartPosition].classList.add("gun")
// cells[82].classList.add("dino")
// cells[93].classList.add("missile")