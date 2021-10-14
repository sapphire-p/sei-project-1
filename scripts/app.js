
// Grid variables

const grid = document.querySelector(".grid")
const width = 11
const cellCount = width * width
let cells = []

// Start Screen and End Screen variables

const startScreen = document.querySelector(".start-screen-container")
const endScreen = document.querySelector(".end-screen-container")
const gameScreen = document.querySelector(".game-screen-container")
gameScreen.classList.add("hidden")

// Scoring variables

let score = 0
let livesRemaining = 3

const scoreDisplay = document.querySelector(".score-display")
const livesDisplay = document.querySelector(".lives-display")
const finalScoreDisplay = document.querySelector(".final-score-display")

// Gun, Dinos, Missile, Rock position and class variables

const gunStartPosition = 104 // index number
let gunCurrentPosition // = 104 // index number
const gunClass = "gun"

const dinosStartPosition = [4, 5, 6, 14, 15, 16, 17, 18, 24, 25, 26, 27, 28, 29, 30, 36, 37, 38, 39, 40] // array of index numbers - 20 dinos for start of game
let dinosCurrentPosition // = [4, 5, 6, 14, 15, 16, 17, 18, 24, 25, 26, 27, 28, 29, 30, 36, 37, 39, 40] // array of index numbers
// Old dinosaur formation array: [4, 5, 6, 14, 15, 16, 17, 18, 24, 25, 26, 27, 28, 29, 30, 36, 37, 38, 39, 40, 48, 50] of 22 dinos

let dinosDirection = "right" // This variable stores the direction of movement of the dinos (initialised at "right")
let dinoCounter // a variable added to help control the movement of the dinos so that when they move down, they only move down one cell
const dinoClass = "dino"

let missileCurrentPosition // index number
const missileClass = "missile"

let rockCurrentPosition // index number
const rockClass = "rock"

const explosionClass = "explosion"

const fenceClass = "fence"


// Timer variables

let dinosTimer
let missileTimer
let rockTimer


// Speed variables

let dinosSpeed = 200 // 1500 usually
let rockSpeed = 600 // 600 usually (between 500-700 is good)
let missileSpeed = 100 // 100 usually (200 previously)
let explosionSpeed = 300


// startButton and playAgainButton Event Listeners

const startButton = document.querySelector(".start-button")
startButton.addEventListener("click", startGame) //? Comment this out to style the grid in CSS!

const playAgainButton = document.querySelector(".play-again-button")
playAgainButton.addEventListener("click", playAgainButtonClicked)


// Audio Event Listeners

const music = document.querySelector("#music")
music.loop = true
startButton.addEventListener("click", playMusic)

let musicOn = true

const musicButton = document.querySelector(".music-button")
musicButton.addEventListener("click", musicButtonClicked)


function playMusic() {
  if (musicOn) {
    music.src = "./assets/audio/kim_lightyear_-_dino_instrumental.wav"
    music.play()
  } else {
    music.pause()
  }
}

function musicButtonClicked(event) {
  console.log("Music button clicked")
  if (event.target.innerText === "Turn Music OFF") {
    musicOn = false
    event.target.innerText = "Turn Music ON"
    playMusic()
  } else if (event.target.innerText === "Turn Music ON") {
    musicOn = true
    event.target.innerText = "Turn Music OFF"
    playMusic()
  }
}


/* startGame function */ //! 

//? Comment this in to style the grid in CSS!
// for (let i = 0; i < cellCount; i++) { // This block of code creates the grid
//   const cell = document.createElement("div")
//   cell.innerText = i
//   if (i > (width * width - (width + 1))) { // This adds a class of fence to the bottom row of the grid
//     cell.classList.add(fenceClass)
//   }
//   grid.appendChild(cell)
//   cells.push(cell)
// }

// startGame() //!



function createGrid() {
  for (let i = 0; i < cellCount; i++) { // This block of code creates the grid
    const cell = document.createElement("div")
    // cell.innerText = i
    if ((i > (width * width - (width + 1))) && i !== 114 && i !== 115 && i !== 116) { // This adds a class of fence to the bottom row of the grid
      cell.classList.add(fenceClass)
    }
    if (i === ((width * width) - width)) { // This adds a class of left-fence-corner to the bottom left corner cell of the grid
      cell.classList.add("left-fence-corner")
    }
    if (i === ((width * width) - 1)) { // This adds a class of right-fence-corner to the bottom right corner cell of the grid
      cell.classList.add("right-fence-corner")
    }
    grid.appendChild(cell)
    cells.push(cell)
  }

  gunCurrentPosition = gunStartPosition
  addItem(gunClass, gunCurrentPosition)
  dinosCurrentPosition = dinosStartPosition
  addItem(dinoClass, dinosCurrentPosition)
}



function playAgainButtonClicked() {

  if (grid.hasChildNodes) { // If a grid already exists from a previosuly game, this block of code removes the grid by removing the grid's child elements one by one
    let gridChildElementCount = grid.childElementCount
    for (i = 0; i < gridChildElementCount; i++) {
      grid.lastChild.remove()
    }
  }

  cells = [] // In case a game has already been played, this resets the cells array to an empty array, ready to receive a fresh set of cell indexes

  createGrid()

  scoreDisplay.innerText = score
  livesDisplay.innerText = livesRemaining

  endScreen.classList.add("animate__fadeOutRight")
  setTimeout(() => {
    endScreen.classList.add("hidden")
    startGame()
  }, 1000)

}


function startGame() {

  console.log("startGame() function called")

  document.addEventListener('keyup', keysGunAction) // Moved from global scope to here to prevent key shortcuts to open Dev Tools throwing errors in the console

  gameScreen.classList.remove("hidden")

  // endScreen.style.display = "none"
  endScreen.classList.add("hidden")
  endScreen.classList.remove("animate__fadeInLeft")


  startScreen.classList.add("animate__fadeOutRight")

  setTimeout(() => {
    startScreen.classList.add("hidden")
  }, 2000)

  scoreDisplay.innerText = score
  livesDisplay.innerText = livesRemaining


  if (grid.hasChildNodes) { // If a grid already exists from a previosuly game, this block of code removes the grid by removing the grid's child elements one by one
    let gridChildElementCount = grid.childElementCount
    for (i = 0; i < gridChildElementCount; i++) {
      grid.lastChild.remove()
    }
  }

  cells = [] // In case a game has already been played, this resets the cells array to an empty array, ready to receive a fresh set of cell indexes

  createGrid()

  setTimeout(() => {

    console.log("Get ready to play!")

    dinosTimer = setInterval(() => {

      const anyDinosAtBottom = dinosCurrentPosition.some(dino => { // This .some() array method determines if any dinos are on the bottom row of the grid
        return (((width * width) - dino) <= width)
      })
      console.log("anyDinosAtBottom", anyDinosAtBottom)

      const anyDinosOnPenultimateRow = dinosCurrentPosition.some(dino => { // This .some() array method determines if any dinos are on the penultimate row of the grid
        return (((width * width) - dino) <= width * 2)
      })
      console.log("anyDinosOnPenultimateRow", anyDinosOnPenultimateRow)

      const anyDinosLeftOnGrid = cells.some(cell => { // Checks if there are no dinos present on the grid
        return cell.classList.contains(dinoClass) // if there are any dinos present on the grid, anyDinosLeftOnGrid is true, else anyDinosLeftOnGrid is false
      })
      console.log("anyDinosLeftOnGrid", anyDinosLeftOnGrid)


      if (anyDinosAtBottom || !anyDinosLeftOnGrid) { // If the dinos reach the bottom of the grid or there are not dinos left on grid, the endGame() function is called

        console.log("dinos at bottom of grid or no dinos left on grid - call endGame function")

        endGame() //? Comment this out to style the grid in CSS!

      } else {

        const anyDinosOnTheEdge = dinosCurrentPosition.some(dino => { // This .some() array method determines if any dinos are on the left or right edge of the grid
          return ((dino % width === width - 1) || (dino % width === 0))
        })

        if (anyDinosOnTheEdge && !dinoCounter) { // If any dinos are on the edge AND dinoCounter is not indicating (with a truthy 1) that a down movement has just been performed, *go down*, and then *change direction and move one sideways*
          // Remember, on the line above, since 'anyDinosOnTheEdge' will either be a boolean true or false, you do not need to write 'anyDinosOnTheEdge === true'
          dinoCounter++
          removeItem(dinoClass, dinosCurrentPosition) // -*go down*
          dinosCurrentPosition = dinosCurrentPosition.map(dinoPosition => {
            return dinoPosition += width
          })
          dinosDirection = dinosDirection === 'right' ? 'left' : 'right' // -*change direction and move one sideways* // ternary operator that switches the value of dinosDirection (from right to left, or else left to right)
          addItem(dinoClass, dinosCurrentPosition)
        } else if (dinosDirection === 'left') { // Else if no dinos are on the edge, and globally-scoped dinosDirection variable is equal to "left", move dinos left
          dinoCounter = 0
          removeItem(dinoClass, dinosCurrentPosition)
          dinosCurrentPosition = dinosCurrentPosition.map(dinoPosition => {
            return dinoPosition -= 1
          })
          addItem(dinoClass, dinosCurrentPosition)
        } else if (dinosDirection === 'right') { // Else if no dinos are on the edge, and globally-scoped dinosDirection variable is equal to "right", move dinos right
          dinoCounter = 0
          removeItem(dinoClass, dinosCurrentPosition)
          dinosCurrentPosition = dinosCurrentPosition.map(dinoPosition => {
            return dinoPosition += 1
          })
          addItem(dinoClass, dinosCurrentPosition)
        }

        if (!anyDinosOnPenultimateRow && anyDinosLeftOnGrid) { // This conditional statement fixes the bug where the handleRock() function was throwing errors as it was still trying to find dinosEligibleToThrowRock (which comes before rockTimer begins) before the dinosTimer was stopped at its next loop
          handleRock() // This way, the rock throwing function stops being called when the dinos reach the penultimate grid row (or if no dinos left on grid)
        }

      }

    }, dinosSpeed)

  }, 600)

}



/* endGame function */

function endGame() {

  console.log("endGame function called")

  // All Timers are cleared:
  clearInterval(dinosTimer)
  clearInterval(missileTimer)
  clearInterval(rockTimer)

  // Stores final score value in a new variable and displays it on the end-screen:
  let finalScore = score
  finalScoreDisplay.innerText = finalScore

  // Resets score and livesRemaining to their initial values, ready for next game:
  score = 0
  livesRemaining = 3

  console.log(score)
  console.log(finalScore)


  // endScreen.style.display = "flex"

  endScreen.classList.remove("hidden")
  endScreen.classList.add("animate__fadeInLeft")
  endScreen.classList.remove("animate__fadeOutRight")

  // startScreen.style.display = "none"

  startScreen.classList.add("hidden")
  startScreen.classList.remove("animate__fadeOutRight") // Not sure if this is strictly necessary, as the start-screen is only shown once at the very start

}



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
    // console.log("Gun moves RIGHT")
    gunCurrentPosition++
  } else if (key === 37 && gunCurrentPosition !== width * (width - 2)) {
    // console.log("Gun moves LEFT")
    gunCurrentPosition--
  } else if (key === 32) { // Space bar is key 32, if you want to change it to up arrow, up arrow is 38
    event.preventDefault()
    // console.log("Space bar makes Gun fire Missile")
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
    // console.log("There is already a missile on the grid - one missile at a time")
    return
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
          console.log(cellIndexOfMissileRockCollision)
        }
      })

      if (missileDinoCollision === true) { // If the missile collides with a dino, the missile is removed and the missileTimer is cleared
        removeItem(missileClass, missileCurrentPosition) // Removes the missile class from the cell where collision occurred
        cells[cellIndexOfMissileDinoCollision].classList.add(explosionClass)
        setTimeout(() => {
          cells[cellIndexOfMissileDinoCollision].classList.remove(explosionClass)
        }, explosionSpeed)
        removeItem(dinoClass, dinosCurrentPosition) // Removes the dino class from the cell where collision occurred
        dinosCurrentPosition.splice(indexOfCollisionCellInDinosCurrentPosition, 1) // Updates the dinosCurrentPosition array to reflect the missile collision deleting the dino
        addItem(dinoClass, dinosCurrentPosition) // Displays updated dinosCurrentPosition array with collision dino deleted
        score += 100 // This adds 100 to the score for destroying a dino
        scoreDisplay.innerText = score
        clearInterval(missileTimer)
      } else if (missileRockCollision === true) {
        removeItem(missileClass, missileCurrentPosition) // Removes the missile class from the cell where collision occurred
        cells[cellIndexOfMissileRockCollision].classList.remove(rockClass) // Removes the rock class from the cell where collision occurred
        cells[cellIndexOfMissileRockCollision].classList.add(explosionClass)
        setTimeout(() => {
          cells[cellIndexOfMissileRockCollision].classList.remove(explosionClass)
        }, explosionSpeed)
        clearInterval(missileTimer)
        clearInterval(rockTimer) //! This should clear the rockTimer and avoid any rocks continuing to fall after missile-rock collision, but sometimes the missiles do not stop the rocks - may be to do with a discrepancy between the handleMissile() function timing and the handleRock() function timing
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


function handleRock() {

  let gridContainsRock
  cells.forEach(cell => { // Checks if there is already a rock present on the grid
    if (cell.classList.contains(rockClass)) {
      gridContainsRock = true // if there is already a rock present on the grid, gridContainsRock updates to true
    }
  })

  if (gridContainsRock === true) { // if there is already a rock on the grid
    // console.log("There is already a rock on the grid - one rock at a time")
    return
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
        livesRemaining -= 1 // This decrements the livesRemaining variable as the gun has been hit by a rock
        livesDisplay.innerText = livesRemaining
        if (livesRemaining < 1) { // This calls the endGame() function if livesRemaining has now dropped below 1
          removeItem(rockClass, rockCurrentPosition)
          cells[cellIndexOfRockGunCollision].classList.add(explosionClass)
          setTimeout(() => {
            endGame()
          }, 1000)
        } else {
          removeItem(rockClass, rockCurrentPosition) // Removes the rock class from the cell where collision occurred
          cells[cellIndexOfRockGunCollision].classList.add(explosionClass)
          setTimeout(() => {
            cells[cellIndexOfRockGunCollision].classList.remove(explosionClass)
          }, explosionSpeed)
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