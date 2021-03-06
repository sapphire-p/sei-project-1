
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

const gameResult = document.querySelector(".game-result")
const gameComment = document.querySelector(".game-comment")

// Gun, Dinos, Missile, Rock position and class variables

const gunStartPosition = 104 // index number
let gunCurrentPosition // = 104 // index number
const gunClass = "gun"

const dinosStartPosition = [4, 5, 6, 14, 15, 16, 17, 18, 24, 25, 26, 27, 28, 29, 30, 36, 37, 38, 39, 40] // array of index numbers - 20 dinos for start of game
let dinosCurrentPosition // to contain an array of index numbers

let dinosDirection = "right" // This variable stores the direction of movement of the dinos (initialised at "right")
const dinoClass = "dino"

let missileCurrentPosition // stores an index number
const missileClass = "missile"

let rockCurrentPosition // stores an index number
const rockClass = "rock"

const explosionClass = "explosion"

const fenceClass = "fence"


// Timer variables

let dinosTimer
let missileTimer
let rockTimer


// Speed variables

let dinosSpeed = 900 // 900 is the default, for a more challenging game. 1000 or 1500 for an easier game
let rockSpeed = 600 // 600 usually (between 500-700 is good)
let missileSpeed = 100 // 100 usually (200 for slower missiles and a more challenging game)
let explosionSpeed = 320 // 300-320 usually


// startButton and playAgainButton Event Listeners

const startButton = document.querySelector(".start-button")
startButton.addEventListener("click", startGame)

const playAgainButton = document.querySelector(".play-again-button")
playAgainButton.addEventListener("click", playAgainButtonClicked)


// Audio Event Listeners

const music = document.querySelector("#music")
music.loop = true
startButton.addEventListener("click", playMusic)

let musicOn = true

const musicButton = document.querySelector(".music-button")
musicButton.addEventListener("click", musicButtonClicked)

/* Music-related functions */

function playMusic() {
  if (musicOn) {
    music.src = "./assets/audio/kim_lightyear_-_dino_instrumental.wav"
    music.play()
  } else {
    music.pause()
  }
}

function musicButtonClicked(event) {
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



/* createdGrid function */

function createGrid() {
  for (let i = 0; i < cellCount; i++) { // This block of code creates the grid
    const cell = document.createElement("div")
    // cell.innerText = i //? Comment this in if you want to see the cell index numbers on the grid cells
    if ((i > (width * width - (width + 1))) && i !== 114 && i !== 115 && i !== 116) { // This adds a class of fence to the bottom row of the grid
      cell.classList.add(fenceClass)
    }
    if (i === ((width * width) - width)) { // This adds a class of left-fence-corner to the bottom left corner cell of the grid (for a rounded bottom-left corner)
      cell.classList.add("left-fence-corner")
    }
    if (i === ((width * width) - 1)) { // This adds a class of right-fence-corner to the bottom right corner cell of the grid (for a rounded bottom-right corner)
      cell.classList.add("right-fence-corner")
    }
    grid.appendChild(cell)
    cells.push(cell)
  }

  gunCurrentPosition = gunStartPosition // Positions and displays gun and dinos in their starting positions
  addItem(gunClass, gunCurrentPosition)
  dinosCurrentPosition = dinosStartPosition
  addItem(dinoClass, dinosCurrentPosition)
}


/* startGame function */

function startGame() {

  document.addEventListener('keyup', keysGunAction) // Moved from global scope to here in order to prevent key shortcuts to open Dev Tools throwing errors in the console

  gameScreen.classList.remove("hidden")
  endScreen.classList.add("hidden")
  endScreen.classList.remove("animate__fadeInLeft")
  startScreen.classList.add("animate__fadeOutRight")

  setTimeout(() => {
    startScreen.classList.add("hidden")
  }, 2000)

  scoreDisplay.innerText = score
  livesDisplay.innerText = livesRemaining

  if (grid.hasChildNodes) { // If a grid already exists from a previous game, this block of code removes the grid by removing the grid's child elements one by one
    let gridChildElementCount = grid.childElementCount
    for (i = 0; i < gridChildElementCount; i++) {
      grid.lastChild.remove()
    }
  }

  cells = [] // In case a game has already been played, this resets the cells array to an empty array, ready to receive a fresh set of cell indexes

  createGrid()

  setTimeout(() => {

    dinosTimer = setInterval(() => {

      const anyDinosAtBottom = dinosCurrentPosition.some(dino => { // This .some() array method determines if ANY dinos are on the bottom row of the grid
        return (((width * width) - dino) <= width)
      })

      const anyDinosOnPenultimateRow = dinosCurrentPosition.some(dino => { // This .some() array method determines if any dinos are on the penultimate row of the grid
        return (((width * width) - dino) <= width * 2)
      })

      const anyDinosLeftOnGrid = cells.some(cell => { // Checks for if there are no dinos present on the grid
        return cell.classList.contains(dinoClass) // if there are any dinos present on the grid, anyDinosLeftOnGrid is true, else anyDinosLeftOnGrid is false
      })

      if (anyDinosAtBottom || !anyDinosLeftOnGrid) { // If any dinos reach the bottom of the grid or there are no dinos left on the grid, the endGame() function is called

        endGame()

      } else {

        const anyDinosOnTheRightEdge = dinosCurrentPosition.some(dino => { // This .some() array method determines if ANY dinos are on the right edge of the grid
          return dino % width === width - 1
        })
        const anyDinosOnTheLeftEdge = dinosCurrentPosition.some(dino => { // This .some() array method determines if ANY dinos are on the left edge of the grid
          return dino % width === 0
        })


        if (dinosDirection === "left") {
          if (anyDinosOnTheLeftEdge) { // If there are any dinos on the left edge, all dinos to move down one cell
            removeItem(dinoClass, dinosCurrentPosition)
            dinosCurrentPosition = dinosCurrentPosition.map(dinoPosition => {
              return dinoPosition += width
            })
            dinosDirection = "right" // Updates global scope dinosDirection variable to the opposite direction, so that once the dinos have gone down one, they will then move in the opposite direction
            addItem(dinoClass, dinosCurrentPosition)
          } else {
            removeItem(dinoClass, dinosCurrentPosition)
            dinosCurrentPosition = dinosCurrentPosition.map(dinoPosition => {
              return dinoPosition -= 1
            })
            addItem(dinoClass, dinosCurrentPosition)
          }
        } else if (dinosDirection === "right") {
          if (anyDinosOnTheRightEdge) {
            removeItem(dinoClass, dinosCurrentPosition) // If there are any dinos on the right edge, all dinos to move down one cell
            dinosCurrentPosition = dinosCurrentPosition.map(dinoPosition => {
              return dinoPosition += width
            })
            dinosDirection = "left" // Updates global scope dinosDirection variable to the opposite direction, so that once the dinos have gone down one, they will then move in the opposite direction
            addItem(dinoClass, dinosCurrentPosition)
            return
          } else {
            removeItem(dinoClass, dinosCurrentPosition)
            dinosCurrentPosition = dinosCurrentPosition.map(dinoPosition => {
              return dinoPosition += 1
            })
            addItem(dinoClass, dinosCurrentPosition)
          }
        }

        if (!anyDinosOnPenultimateRow && anyDinosLeftOnGrid) { // This conditional statement fixes the bug where the handleRock() function was throwing errors as it was still trying to find dinosEligibleToThrowRock (which comes before rockTimer begins) before the dinosTimer was stopped at its next loop
          handleRock() // This way, the rock throwing function stops being called when the dinos reach the penultimate grid row (or if no dinos are left on the grid - though this should have already triggered the endGame() function earlier in this dinosTimer setInterval)
        }

      }

    }, dinosSpeed)

  }, 600)

}


/* endGame function */

function endGame() {

  // All Timers are cleared:
  clearInterval(dinosTimer)
  clearInterval(missileTimer)
  clearInterval(rockTimer)

  // Stores final score value in a new variable and displays it on the end-screen:
  let finalScore = score
  finalScoreDisplay.innerText = finalScore

  if (finalScore >= 2000) {
    gameResult.innerText = "GREAT JOB!"
    gameComment.innerText = "Perfect score! No dinos escaped."
  } else {
    gameResult.innerText = "GAME OVER"
    gameComment.innerText = "Some dinos escaped...better luck next time!"
  }

  // Resets score and livesRemaining to their initial values, ready for next game:
  score = 0
  livesRemaining = 3

  endScreen.classList.remove("hidden")
  endScreen.classList.add("animate__fadeInLeft")
  endScreen.classList.remove("animate__fadeOutRight")

  startScreen.classList.add("hidden")
  startScreen.classList.remove("animate__fadeOutRight") // Not strictly necessary, as the start-screen is only shown once at the very start when the page is loaded

}


/* playAgainButtonClicked function */

function playAgainButtonClicked() {

  if (grid.hasChildNodes) { // If a grid already exists from a previous game, this block of code removes the grid by removing the grid's child elements one by one
    let gridChildElementCount = grid.childElementCount
    for (i = 0; i < gridChildElementCount; i++) {
      grid.lastChild.remove()
    }
  }

  cells = [] // In case a game has already been played, this resets the cells array to an empty array, ready to receive a fresh set of cell indexes when the new grid is created

  createGrid()

  scoreDisplay.innerText = score
  livesDisplay.innerText = livesRemaining

  endScreen.classList.add("animate__fadeOutRight")
  setTimeout(() => {
    endScreen.classList.add("hidden")
    startGame()
  }, 1000)

}


/* addItem and removeItem functions */

function addItem(itemClass, position) {
  // The following control flow with conditional logic says "If itemClass is gunClass/missileClass/rockClass, do this, else if itemClass is dinoClass, do this"
  if (itemClass === gunClass || itemClass === missileClass || itemClass === rockClass) {
    cells[position].classList.add(itemClass)
  } else if (itemClass === dinoClass) {
    position.forEach(dinoPosition => {
      cells[dinoPosition].classList.add(itemClass)
    })
  }
}

function removeItem(itemClass, position) {
  // The following control flow with conditional logic says "If itemClass is gunClass/missileClass/rockClass, do this, else if itemClass is dinoClass, do this"
  if (itemClass === gunClass || itemClass === missileClass || itemClass === rockClass) {
    cells[position].classList.remove(itemClass)
  } else if (itemClass === dinoClass) {
    position.forEach(dinoPosition => {
      cells[dinoPosition].classList.remove(itemClass)
    })
  }
}


/* keysGunAction function */

function keysGunAction(event) {

  const key = event.keyCode

  removeItem(gunClass, gunCurrentPosition)

  if (key === 39 && gunCurrentPosition !== (width * width) - (width + 1)) { // Key 39 is the right arrow key
    gunCurrentPosition++ // updates gunPosition to one cell RIGHT of its current position
  } else if (key === 37 && gunCurrentPosition !== width * (width - 2)) { // Key 37 is the left arrow key
    gunCurrentPosition-- // updates gunPosition to one cell LEFT of its current position
  } else if (key === 32) { // Key 32 is the Space bar key
    event.preventDefault()
    handleMissile() // Tapping the space bar calls the function to launch the missile
  } else {
    addItem(gunClass, gunCurrentPosition)
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

    missileTimer = setInterval(() => { // This setInterval loops and makes the missile appear to move up one cell periodically, until it reaches the top of the grid

      let missileDinoCollision
      let cellIndexOfMissileDinoCollision
      let indexOfCollisionCellInDinosCurrentPosition
      cells.forEach(cell => { // Checks if there is a missile AND a dino present on the same cell on the grid
        if (cell.classList.contains(missileClass) && cell.classList.contains(dinoClass)) {
          missileDinoCollision = true // if there is a missile AND a dino present on the same cell on the grid, missileDinoCollision updates to true
          cellIndexOfMissileDinoCollision = cells.indexOf(cell) // This stores the grid index of the missile/dino collision in a variable
          indexOfCollisionCellInDinosCurrentPosition = dinosCurrentPosition.indexOf(cellIndexOfMissileDinoCollision) // The cellIndexOfMissileDinoCollision is one of the numbers inside the dinosCurrentPosition array. This stores the index of its position in the dinosCurrentPosition array
        }
      })

      let missileRockCollision
      let cellIndexOfMissileRockCollision
      cells.forEach(cell => { // Checks if there is a missile AND a rock present on the same cell on the grid
        if (cell.classList.contains(missileClass) && cell.classList.contains(rockClass)) {
          missileRockCollision = true // if there is a missile AND a rock present on the same cell on the grid, missileRockCollision updates to true
          cellIndexOfMissileRockCollision = cells.indexOf(cell) // This stores the grid index of the missile/dino collision in a variable
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
        clearInterval(rockTimer) // This should clear the rockTimer and avoid any rocks continuing to fall after missile-rock collision
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

  if (gridContainsRock === true) { // if there is already a rock on the grid - it is only possible for one rock to be on the grid at a time
    return
  } else { // identify dinos eligible to throw a rock, randomly select one and position the rock in the cell below it, before starting the rockTimer
    let dinosEligibleToThrowRock = []
    dinosCurrentPosition.forEach(dino => { // Checks dinosCurrentPosition for dino index where the cell immediately below has no dino/missile/gun classes on it
      if (!cells[dino + width].classList.contains(dinoClass) && !cells[dino + width].classList.contains(missileClass) && !cells[dino + width].classList.contains(gunClass)) {
        dinosEligibleToThrowRock.push(dino)
      }
    })

    let dinoToThrowRock
    dinoToThrowRock = dinosEligibleToThrowRock[Math.floor(Math.random() * dinosEligibleToThrowRock.length)]

    rockCurrentPosition = dinoToThrowRock + width // This updates rockCurrentPosition to the index number one below the rock-throwing-dino's current position
    addItem(rockClass, rockCurrentPosition)

    rockTimer = setInterval(() => {

      let rockGunCollision
      let cellIndexOfRockGunCollision
      cells.forEach(cell => { // Checks if there is a rock AND a gun present on the same cell on the grid
        if (cell.classList.contains(rockClass) && cell.classList.contains(gunClass)) {
          rockGunCollision = true // if there is a rock AND a gun present on the same cell on the grid, rockGunCollision updates to true
          cellIndexOfRockGunCollision = cells.indexOf(cell) // This stores the grid index of the rock/gun collision in a variable
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

