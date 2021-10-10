
// Grid variables

const grid = document.querySelector(".grid")
const width = 11
const cellCount = width * width
const cells = []

// Scoring variables

let score = 0
let livesRemaining = 3

const scoreDisplay = document.querySelector(".score-display")
const livesDisplay = document.querySelector(".lives-display")

// Gun, Dinos, Missile, Rock position and class variables

const gunStartPosition = 104 // index number
let gunCurrentPosition = 104 // index number
const gunClass = "gun"

const dinosStartPosition = [11, 12, 13] // array of index numbers - should be initialised at [26, 27, 28] for start of game
let dinosCurrentPosition = [11, 12, 13] // array of index numbers
const dinoClass = "dino"

let missileCurrentPosition // index number
const missileClass = "missile"

let rockCurrentPosition // index number
const rockClass = "rock"

const exposionClass = "explosion"

// Timer variables

let dinosTimer
let missileTimer
let rockLaunchTimer
let rockTimer

// Speed variables

let dinosSpeed = 1000
let rockSpeed = 1000
let missileSpeed = 200

// Event Listeners

const startButton = document.querySelector(".start-button")
startButton.addEventListener("click", startGame)

document.addEventListener('keyup', keysGunAction)




function startGame() {

  console.log("startGame() function called")

  for (let i = 0; i < cellCount; i++) { // This block of code creates the grid
    const cell = document.createElement("div")
    cell.innerText = i
    grid.appendChild(cell)
    cells.push(cell)
  }

  gunCurrentPosition = gunStartPosition
  addItem(gunClass, gunCurrentPosition)
  dinosCurrentPosition = dinosStartPosition
  addItem(dinoClass, dinosCurrentPosition) //! Formerly dinosStartPosition // I believe setting xCurrentPosition to xStartPosition in the lines immediately above may do the trick
  rockCurrentPosition = 44 //! Simply to test missile-rock collision functionality in handleMissile() function
  addItem(rockClass, rockCurrentPosition)


  // let counter

  dinosTimer = setInterval(() => {

    if (dinosCurrentPosition[0] % width < (width - dinosStartPosition.length)) { // "If the index of the left-most dino is less than the remainder of width minus the length of the starting dinos array (number of dinos initially)"

      removeItem(dinoClass, dinosCurrentPosition)
      dinosCurrentPosition = dinosCurrentPosition.map(dinoPosition => {
        return dinoPosition += 1
      })
      addItem(dinoClass, dinosCurrentPosition)
      console.log("Dinos move right")

      // counter++
      // if (counter > 10) {
      //   clearInterval(dinosTimer)
      //   counter = 0
      // } else {
      //   removeItem(dinoClass, dinosCurrentPosition)
      //   dinosCurrentPosition = dinosCurrentPosition.map(dinoPosition => {
      //     return dinoPosition += 1
      //   })
      //   addItem(dinoClass, dinosCurrentPosition)
      //   console.log("Dinos move right")
      // }


      // removeItem(dinoClass, dinosCurrentPosition)
      // dinosCurrentPosition = dinosCurrentPosition.map(dinoPosition => {
      //   return dinoPosition += 1
      // })
      // addItem(dinoClass, dinosCurrentPosition)
      // console.log("Dinos move right")
      // clearInterval(dinosTimer)
    }
    // else if ()



    // removeItem(dinoClass, dinosCurrentPosition)
    // dinosCurrentPosition = dinosCurrentPosition.map(dinoPosition => { //? map returns a new array of equal length
    //   return dinoPosition += 1 //? This updates the position of each dino to one cell to the right, by adding one to each dino index number
    // })
    // addItem(dinoClass, dinosCurrentPosition)



    // if ((dinosCurrentPosition[dinosCurrentPosition.length - 1] % width === width - 1) || (dinosCurrentPosition[0] % width === 0)) {
    //   dinosTimer = setInterval(() => {
    //     removeItem(dinoClass, dinosCurrentPosition)
    //     dinosCurrentPosition = dinosCurrentPosition.map(dinoPosition => {
    //       return dinoPosition += width
    //     })
    //     addItem(dinoClass, dinosCurrentPosition)
    //   }, dinosSpeed)
    // }


  }, dinosSpeed)





  //? Try: splitting the 3 light green points below into 3 separate functions
  //? Creating a sequence of callback functions to enable each action (right, left, down) to happen sequentially


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
  //   return dinoPosition += width
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
    handleMissile()
  } else {
    console.log("Key is invalid")
  }

  addItem(gunClass, gunCurrentPosition)

}





function handleMissile() {

  let gridContainsMissile
  cells.forEach(cell => { // Checks if there is already a missile present on the grid
    if (cell.classList.contains(missileClass)) {
      gridContainsMissile = true // if there is already a missile present on the grid, gridContainsMissile updates to true
    }
  })

  if (gridContainsMissile === true) {
    console.log("There is already a missile on the grid - one missile at a time")
  } else {
    missileCurrentPosition = gunCurrentPosition - width // This updates missileCurrentPosition to the index number one above the gun's current position
    addItem(missileClass, missileCurrentPosition) // This displays the missile in its new position above the gun

    missileTimer = setInterval(() => { // This setInterval loops and makes the missile appear to move up one cell every second, until it reaches the top of the grid

      let missileDinoCollision
      let cellIndexOfMissileDinoCollision
      let indexOfCollisionCellInDinosCurrentPosition
      cells.forEach(cell => { // Checks if there is a missile AND a dino present on the same cell on the grid
        if (cell.classList.contains(missileClass) && cell.classList.contains(dinoClass)) {
          missileDinoCollision = true // if there is a missile AND a dino present on the same cell on the grid, missileDinoCollision updates to true
          cellIndexOfMissileDinoCollision = cells.indexOf(cell) // This stores the grid index of the missile/dino collision in a variable
          indexOfCollisionCellInDinosCurrentPosition = dinosCurrentPosition.indexOf(cellIndexOfMissileDinoCollision) // The cellIndexOfMissileDinoCollision is one of the numbers inside the dinosCurrentPosition array. This stores the index of its position in the dinosCurrentPosition array
          console.log(cellIndexOfMissileDinoCollision)
          console.log(indexOfCollisionCellInDinosCurrentPosition)
        }
      })

      let missileRockCollision
      let cellIndexOfMissileRockCollision
      cells.forEach(cell => { // Checks if there is a missile AND a rock present on the same cell on the grid
        if (cell.classList.contains(missileClass) && cell.classList.contains(rockClass)) {
          missileRockCollision = true // if there is a missile AND a rock present on the same cell on the grid, missileRockCollision updates to true
          cellIndexOfMissileRockCollision = cells.indexOf(cell) // This stores the grid index of the missile/dino collision in a variable
          //! indexOfCollisionCellInRockCurrentPosition = rockCurrentPosition.indexOf(cellIndexOfMissileRockCollision) // The variables specified here do not exist; do not think they need to
          console.log(cellIndexOfMissileRockCollision)
        }
      })


      if (missileDinoCollision === true) { // If the missile collides with a dino, the missile is removed and the missileTimer is cleared
        removeItem(missileClass, missileCurrentPosition) // Removes the missile class from the cell where collision occurred
        cells[cellIndexOfMissileDinoCollision].classList.add(exposionClass)
        setTimeout(() => {
          cells[cellIndexOfMissileDinoCollision].classList.remove(exposionClass)
        }, 500)
        // cells[cellIndexOfMissileDinoCollision].classList.remove(dinoClass) //! The 3 lines of code below do this job instead, so this line is now redundant. Removes the dino class from the cell where collision occurred
        removeItem(dinoClass, dinosCurrentPosition)
        dinosCurrentPosition.splice(indexOfCollisionCellInDinosCurrentPosition, 1) // Updates the dinosCurrentPosition array to reflect the missile collision deleting the dino
        addItem(dinoClass, dinosCurrentPosition) // Displays updated dinosCurrentPosition array with collision dino deleted
        score += 100 // This adds 100 to the score for destroying a dino
        scoreDisplay.innerText = score
        clearInterval(missileTimer)
      } else if (missileRockCollision === true) {
        removeItem(missileClass, missileCurrentPosition) // Removes the missile class from the cell where collision occurred
        cells[cellIndexOfMissileRockCollision].classList.add(exposionClass)
        setTimeout(() => {
          cells[cellIndexOfMissileRockCollision].classList.remove(exposionClass)
        }, 500)
        cells[cellIndexOfMissileRockCollision].classList.remove(rockClass)
        clearInterval(missileTimer)
      } else if (missileCurrentPosition < width) { // If the missile reaches the top of the grid, the missile is removed and the missileTimer is cleared
        removeItem(missileClass, missileCurrentPosition)
        clearInterval(missileTimer)
      } else { // If the missile has not collided with a dino or rock and is not yet at the top of the grid, the missile keeps moving up one cell at a time
        removeItem(missileClass, missileCurrentPosition)
        missileCurrentPosition -= width
        addItem(missileClass, missileCurrentPosition)
      }

    }, missileSpeed)
  }

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