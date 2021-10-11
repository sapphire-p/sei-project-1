
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

const dinosStartPosition = [14, 15, 16, 17, 18, 19, 26, 27, 28, 29, 38, 39] // array of index numbers - should be initialised at [26, 27, 28] for start of game
let dinosCurrentPosition = [14, 15, 16, 17, 18, 19, 26, 27, 28, 29, 38, 39] // array of index numbers
let dinosDirection = "right" // This variable stores the direction of movement of the dinos (initialised at "right")
let dinoCounter // a variable added to help control the movement of the dinos so that when they move down, they only move down one cell
const dinoClass = "dino"

let missileCurrentPosition // index number
const missileClass = "missile"

let rockCurrentPosition // index number
const rockClass = "rock"

const explosionClass = "explosion"

// Timer variables

let dinosTimer
let missileTimer
let rockLaunchTimer
let rockTimer

// Speed variables

let dinosSpeed = 1000
let rockSpeed = 500
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
  // rockCurrentPosition = 44 //! Simply to test missile-rock collision functionality in handleMissile() function
  // addItem(rockClass, rockCurrentPosition) //! Simply to test missile-rock collision functionality in handleMissile() function

  dinosTimer = setInterval(() => {

    // If any dinos are on the left or right edge (use .some() array method to determine this), move dinos down and change direction (e.g. from right to left), Else:
    // If direction (globally-scoped variable) is equal to "right" and no dinos are on the edge, move dinos right
    // If direction (globally-scoped variable) is equal to "left" and no dinos are on the edge, move dinos right

    const anyDinosOnTheEdge = dinosCurrentPosition.some(dino => {
      return ((dino % width === width - 1) || (dino % width === 0))
    })

    console.log(anyDinosOnTheEdge)

    if (anyDinosOnTheEdge && !dinoCounter) { // If any dinos are on the edge, definitely *go down*, and then *change direction and move one in the new direction*
      // Remember, on the line above, since 'anyDinosOnTheEdge' will either be a boolean true or false, you do not need to write 'anyDinosOnTheEdge === true'
      dinoCounter++
      removeItem(dinoClass, dinosCurrentPosition) // go down
      dinosCurrentPosition = dinosCurrentPosition.map(dinoPosition => {
        return dinoPosition += width
      })
      dinosDirection = dinosDirection === 'right' ? 'left' : 'right'
      addItem(dinoClass, dinosCurrentPosition)
    } else if (dinosDirection === 'left') {
      dinoCounter = 0
      removeItem(dinoClass, dinosCurrentPosition)
      dinosCurrentPosition = dinosCurrentPosition.map(dinoPosition => {
        return dinoPosition -= 1
      })
      addItem(dinoClass, dinosCurrentPosition)
    } else if (dinosDirection === 'right') {
      dinoCounter = 0
      removeItem(dinoClass, dinosCurrentPosition)
      dinosCurrentPosition = dinosCurrentPosition.map(dinoPosition => {
        return dinoPosition += 1
      })
      addItem(dinoClass, dinosCurrentPosition)
    }


    //     if (dinos are not on the edge) {
    //   if (direction is right) {
    //       go right
    //   } else if (direction is left) {
    //       go left
    //   }

    // } else if (dinos are on the edge) {
    //     go down
    //   if (direction is left) {
    //       go right
    //     switch direction to right
    //   } else if (direction is right) {
    //       go left
    //     switch direction to left
    //   }
    // }

    handleRock()

  }, dinosSpeed)

}


//!
//!
//? Some code snippets to help with dinos movement functionality:

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
//!
//!





/* addItem and removeItem functions */


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



/* keysGunAction function */


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



/* handleMissile function */


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
        cells[cellIndexOfMissileDinoCollision].classList.add(explosionClass)
        setTimeout(() => {
          cells[cellIndexOfMissileDinoCollision].classList.remove(explosionClass)
        }, 400)
        // cells[cellIndexOfMissileDinoCollision].classList.remove(dinoClass) //! The 3 lines of code below do this job instead, so this line is now redundant. Removes the dino class from the cell where collision occurred
        removeItem(dinoClass, dinosCurrentPosition)
        dinosCurrentPosition.splice(indexOfCollisionCellInDinosCurrentPosition, 1) // Updates the dinosCurrentPosition array to reflect the missile collision deleting the dino
        addItem(dinoClass, dinosCurrentPosition) // Displays updated dinosCurrentPosition array with collision dino deleted
        score += 100 // This adds 100 to the score for destroying a dino
        scoreDisplay.innerText = score
        clearInterval(missileTimer)
      } else if (missileRockCollision === true) {
        removeItem(missileClass, missileCurrentPosition) // Removes the missile class from the cell where collision occurred
        cells[cellIndexOfMissileRockCollision].classList.add(explosionClass)
        setTimeout(() => {
          cells[cellIndexOfMissileRockCollision].classList.remove(explosionClass)
        }, 400)
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



/* handleRock function */

//? Periodically, a random dino (with no dino/missile/gun classes in the cell immediately below it) drops a rock down vertically
// Similar to handleMissile() function, but instead of the trigger being space bar, it will be triggered by a timer interval in the startGame() function
// Inside startGame() function, Timer interval needed to trigger rock drop - this would call handleRock function every x seconds
// Inside handleRock function itself:
// Identify an eligible dino (a dino index where the cell immediately below has no dino/missile/gun classes on it) at random from the dinosCurrentPosition array
// Set a rockTimer setInterval for the rock to drop down in the cells below that dino
// Determine if there is a Rock-Gun collision >> if so:
//* Rock disappears
//* Gun stays in place
//* Short explosion visible making use of setTimeout?
//* livesRemaining variable decrements
//* livesDisplay innerText updates with new value of livesRemaining
//* if livesRemaining has dropped below 1, endGame() function is called
// Rock-Missile (missile-rock) collision should already be handled inside the handlemissile() function, but may need tweaking so that it clears the rockTimer setInterval
// // Globally-scoped variable needed for: bombPosition, also addBomb and removeBomb functions


function handleRock() {

  let gridContainsRock
  cells.forEach(cell => { // Checks if there is already a rock present on the grid
    if (cell.classList.contains(rockClass)) {
      gridContainsRock = true // if there is already a rock present on the grid, gridContainsRock updates to true
    }
  })

  if (gridContainsRock === true) {
    console.log("There is already a rock on the grid - one rock at a time")
  } else { // identify dinos eligible to throw a rock, randomly select one and position the rock in the cell below it, before starting the rockTimer
    let dinosEligibleToThrowRock = []
    dinosCurrentPosition.forEach(dino => { // Checks dinosCurrentPosition for dino index where the cell immediately below has no dino/missile/gun classes on it
      if (!cells[dino + width].classList.contains(dinoClass) && !cells[dino + width].classList.contains(missileClass) && !cells[dino + width].classList.contains(gunClass)) {
        dinosEligibleToThrowRock.push(dino)
      }
    })
    console.log(dinosEligibleToThrowRock)

    let dinoToThrowRock
    dinoToThrowRock = dinosEligibleToThrowRock[Math.floor(Math.random() * dinosEligibleToThrowRock.length)]
    console.log(dinoToThrowRock)

    rockCurrentPosition = dinoToThrowRock + width // This updates rockCurrentPosition to the index number one below the rock-throwing-dino's current position
    addItem(rockClass, rockCurrentPosition)


    rockTimer = setInterval(() => {

      let rockGunCollision
      let cellIndexOfRockGunCollision
      cells.forEach(cell => { // Checks if there is a rock AND a gun present on the same cell on the grid
        if (cell.classList.contains(rockClass) && cell.classList.contains(gunClass)) {
          rockGunCollision = true // if there is a rock AND a gun present on the same cell on the grid, rockGunCollision updates to true
          cellIndexOfRockGunCollision = cells.indexOf(cell) // This stores the grid index of the rock/gun collision in a variable
          console.log(cellIndexOfRockGunCollision)
        }
      })

      if (rockGunCollision === true) { // If the rock collides with the gun, the rock is removed and the rockTimer is cleared
        removeItem(rockClass, rockCurrentPosition) // Removes the rock class from the cell where collision occurred
        cells[cellIndexOfRockGunCollision].classList.add(explosionClass)
        setTimeout(() => {
          cells[cellIndexOfRockGunCollision].classList.remove(explosionClass)
        }, 1000)
        livesRemaining -= 1 // This decrements the livesRemaining variable as the gun has been hit by a rock
        livesDisplay.innerText = livesRemaining
        if (livesRemaining < 1) { // This calls the endGame() function if livesRemaining has now dropped below 1
          endGame()
        }
        clearInterval(rockTimer)
        //? NB: Rock-Missile (missile-rock) collision should already be handled inside the handlemissile() function, but it may need tweaking so that it clears the rockTimer setInterval
      } else if ((width * width) - rockCurrentPosition <= width) { // If the rock reaches the bottom of the grid, the rock is removed and the rockTimer is cleared
        removeItem(rockClass, rockCurrentPosition)
        clearInterval(rockTimer)
      } else { // If the rock has not collided with the gun (or a missile) and is not yet at the bottom of the grid, the rock keeps moving down one cell at a time
        removeItem(rockClass, rockCurrentPosition)
        rockCurrentPosition += width
        addItem(rockClass, rockCurrentPosition)
      }


    }, rockSpeed)
  }
}

// handleRock()













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