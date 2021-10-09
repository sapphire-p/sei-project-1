
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
let gunCurrentPosition = 105 // index number
const gunClass = "gun"

const dinosStartPosition = [22, 23, 24] // array of index numbers - should be initialised at [26, 27, 28] for start of game
let dinosCurrentPosition = [22, 23, 24] // array of index numbers
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

document.addEventListener('keyup', keysGunAction)




function startGame() {

  console.log("startGame() function called")

  for (let i = 0; i < cellCount; i++) { // This block of code created the grid
    const cell = document.createElement("div")
    cell.innerText = i
    grid.appendChild(cell)
    cells.push(cell)
  }

  addItem(gunClass, gunStartPosition)
  addItem(dinoClass, dinosCurrentPosition) //! Formerly dinosStartPosition - See below ("This all works, but...")


  // dinosTimer = setInterval(() => { //* dinosTimer setInterval to control the movement of the dinos every dinosSpeed (1 second)
  // }, dinosSpeed)

  // if ((dinosCurrentPosition[dinosCurrentPosition.length - 1] % width === width - 1) || (dinosCurrentPosition[0] % width === 0)) //* This conditional logic states: "If: last dino is in the right-most cell of the grid *OR* first dino is in the left-most cell of the grid"

  // if (dinosCurrentPosition[dinosCurrentPosition.length - 1] % width === width - 1) //* This conditional logic states: "If: last dino is in the right-most cell of the grid"

  // if (dinosCurrentPosition[0] % width === 0) //* This conditional logic states: "If: first dino is in the left-most cell of the grid"

  //* This moves all the dinos one cell to the right:
  // removeItem(dinoClass, dinosCurrentPosition)
  // dinosCurrentPosition = dinosCurrentPosition.map(dinoPosition => { //? map returns a new array of equal length
  //   return dinoPosition += 1 //? This updates the position of each dino to one cell to the right, by adding one to each dino index number
  // })
  // addItem(dinoClass, dinosCurrentPosition)

  //* This moves all the dinos one cell to the left:
  // removeItem(dinoClass, dinosCurrentPosition)
  // dinosCurrentPosition = dinosCurrentPosition.map(dinoPosition => {
  //   return dinoPosition -= 1
  // })
  // addItem(dinoClass, dinosCurrentPosition)


  //* This moves all the dinos one cell down:
  // removeItem(dinoClass, dinosCurrentPosition)
  // dinosCurrentPosition = dinosCurrentPosition.map(dinoPosition => {
  //   return dinoPosition = dinoPosition + width
  // })
  // addItem(dinoClass, dinosCurrentPosition)



}


function addItem(itemClass, position) {
  // The following control flow with conditional logic says "If itemClass is gunClass, do this, else if itemClass is dinoClass, do this"
  if (itemClass === gunClass || itemClass === missileClass || itemClass === rockClass) {
    cells[position].classList.add(itemClass)
  } else if (itemClass === dinoClass) {
    position.forEach(dinoPosition => { // Here, "position" will be either dinosStartPosition array, or dinosCurrentPosition array
      cells[dinoPosition].classList.add(itemClass)
    })
  }
}


function removeItem(itemClass, position) {
  // The following control flow with conditional logic says "If itemClass is gunClass, do this, else if itemClass is dinoClass, do this"
  if (itemClass === gunClass || itemClass === missileClass || itemClass === rockClass) {
    cells[position].classList.remove(itemClass)
  } else if (itemClass === dinoClass) {
    position.forEach(dinoPosition => { // Here, "position" will be either dinosStartPosition array, or dinosCurrentPosition array
      cells[dinoPosition].classList.remove(itemClass)
    })
  }
}



function keysGunAction(event) {
  console.log("keysGunAction() function called")
  const key = event.keyCode

  removeItem(gunClass, gunCurrentPosition)

  if (key === 39 && gunCurrentPosition !== (width * width) - (width + 1)) {
    console.log("Gun moves RIGHT")
    gunCurrentPosition++
  } else if (key === 37 && gunCurrentPosition !== width * (width - 2)) {
    console.log("Gun moves LEFT")
    gunCurrentPosition--
  } else if (key === 32) { // Space bar is key 32, if you want to change it to up arrow, up arrow is 38
    event.preventDefault()
    console.log("Space bar makes Gun fire Missile")
    missileCurrentPosition = gunCurrentPosition - width
    console.log(missileCurrentPosition, gunCurrentPosition)
    addItem(missileClass, missileCurrentPosition)
  } else {
    console.log("Key is invalid")
  }

  addItem(gunClass, gunCurrentPosition)

}



  // cells[gunCurrentPosition].classList.add("gun")
  // cells[82].classList.add("dino")
  // cells[93].classList.add("missile")


  // function createGrid() {
  //   for (let i = 0; i < cellCount; i++) {
  //     const cell = document.createElement("div")
  //     cell.innerText = i
  //     grid.appendChild(cell)
  //     cells.push(cell)
  //   }

  //   createGrid()