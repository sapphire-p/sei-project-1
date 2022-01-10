# SEI Project 1: Jurassic Escapers

## Contents
* [Deployed Project Link](https://github.com/sapphire-p/sei-project-1#deployed-project-link)
* [The Brief](https://github.com/sapphire-p/sei-project-1#the-brief)
* [Overview and Concept](https://github.com/sapphire-p/sei-project-1#overview-and-concept)
* [Explore the code](https://github.com/sapphire-p/sei-project-1#explore-the-code)
* [Technologies Used](https://github.com/sapphire-p/sei-project-1#technologies-used)
* [Planning](https://github.com/sapphire-p/sei-project-1#planning)
* [Development Process](https://github.com/sapphire-p/sei-project-1#tdevelopment-process)
* [Challenges](https://github.com/sapphire-p/sei-project-1#challenges)
* [Wins](https://github.com/sapphire-p/sei-project-1#wins)
* [Future Improvements](https://github.com/sapphire-p/sei-project-1#future-improvements)
* [Key Learnings](https://github.com/sapphire-p/sei-project-1#key-learnings)

## Deployed Project Link

I built a grid-based browser game in 7 days using JavaScript, HTML and CSS. My dinosaur-themed Space Invaders game consolidated my knowledge of core web development languages and JavaScript logic.

**The game has been deployed online and can be played [HERE](https://sapphire-p.github.io/sei-project-1/).**

Music credit: 'Dino' by Kim Lightyear

![1_title-screen_gameplay](https://user-images.githubusercontent.com/84339614/148832349-e5d9acf6-d3e1-452c-b4e4-1ea218cffbd9.png)


## The Brief

* **Build a grid-based game that is rendered in the browser**
* **Design logic for winning and losing** and visually display the result of the game
* **Include separate HTML, CSS and JavaScript files**
* **Use JavaScript for DOM manipulation**
* **Use semantic markup for HTML and CSS**
* **Deploy the project online** so it is accessible to the public
* **Timeframe:** 7 days


## Overview and Concept

*Space Invaders* is a classic arcade game from the 80s. The player aims to shoot and eliminate an invading alien armada using a mounted gun turret, before it reaches the planet's surface at the bottom of the screen.

I decided to create *Jurassic Escapers*: a dinosaur-themed version of this retro game in which the player must prevent a herd of hungry dinosaurs from breaking out of a visitor attraction.

The player can move the gun left or right using the arrow keys and fire a missile at the dinosaurs using the spacebar. As the dinos advance towards the gate, they periodically throw rocks at the player. Hitting dinosaurs scores points, but if the gun is hit by a rock, the player will lose one of their three lives.

The aim is to achieve the highest score possible by eliminating the dino herd before it reaches the gate, and before the player loses all three lives.

<p align="center">
<img height="280" src="https://user-images.githubusercontent.com/84339614/148832787-d09f751e-cb02-4ee9-948d-ef001d6888b2.png" alt="gameplay view">
<img height="280" src="https://user-images.githubusercontent.com/84339614/148832794-c0b8a034-7494-4e8c-b1f2-1314005f77e3.png" alt="gameplay view">
</p>

<p align="center">
<img height="280" src="https://user-images.githubusercontent.com/84339614/148832801-785d5f6c-b00f-442d-a945-c81dd5f91a6a.png" alt="end screen gameplay view">
</p>


## Explore the code

The game can be played [here](https://sapphire-p.github.io/sei-project-1/), however, if you would like to explore the code and play the game on your local machine:

* Clone or download this repository and open in your code editor of choice
* Open the index.html file in your preferred browser to run the game.


## Technologies Used

* JavaScript (ES6)
* HTML5
* CSS
* Animate.css (CSS animations library)
* Google Fonts
* Git / GitHub


## Planning

My initial planning process involved reading the rules of Space Invaders, watching videos of gameplay and playing it a few times to ensure that I understood the rules thoroughly.

I then planned out the game build using pseudocode, first mapping out the broad constituent actions and sequences within the game and my ideas for how to execute these with code.

![5_Pseudocode-plan-cropped-1](https://user-images.githubusercontent.com/84339614/148833288-1cdc6ab5-0b3e-4ce2-841e-442ae9a6941b.png)

I then made notes on the variables, event listeners, functions and timers I thought would be required:

![6_Pseudocode-plan-cropped-2](https://user-images.githubusercontent.com/84339614/148833315-49a1f52f-d630-4e15-ab25-2a341396937b.png)


## Development Process

The brief specified that the game must be grid-based, so once I had set up my separate HTML, CSS and JavaScript files, I started off by building the grid. Instead of constructing the grid in HTML, I found it would be more efficient and flexible in terms of grid size to create it using a JavaScript function. Having defined variables for the grid width, cell count and the div element that would contain the grid (I used the HTML DOM querySelector method to grab the div), I wrote a function that creates a div element for each cell of the grid and appends it as a child of the grid-containing div, as well as pushing each one into a ‘cells’ array. The function uses a for loop to ensure that the correct number of grid cells are added.

Getting items to appear on the grid was another fundamental task, and I achieved this by creating two reusable functions - addItem() and removeItem() - that accept as arguments the class of the item (for example, ‘gun’, ‘missile’ or ‘rock’) and the position the item should be added to or removed from (a number to serve as the index number of the cell in the array of grid cells). During the game, every time an item changes position, the removeItem() function is called, a new cell index is determined, then the addItem() function is called to add the right class to the relevant cell to make the item appear in it. Using versatile functions ensured my code followed DRY (Don’t Repeat Yourself) principles.

```
/* addItem and removeItem functions */
 
function addItem(itemClass, position) {
 if (itemClass === gunClass || itemClass === missileClass || itemClass === rockClass) {
   cells[position].classList.add(itemClass)
 } else if (itemClass === dinoClass) {
   position.forEach(dinoPosition => {
     cells[dinoPosition].classList.add(itemClass)
   })
 }
}
 
function removeItem(itemClass, position) {
 if (itemClass === gunClass || itemClass === missileClass || itemClass === rockClass) {
   cells[position].classList.remove(itemClass)
 } else if (itemClass === dinoClass) {
   position.forEach(dinoPosition => {
     cells[dinoPosition].classList.remove(itemClass)
   })
 }
}
```

Early on in the build process when working through the logic, I kept the grid simple with a dino herd of just three dinosaurs, a gun and an index number in the innerText of each cell div, to track changes more easily:

<p align="center">
<img width="600" src="https://user-images.githubusercontent.com/84339614/148833543-2311ac30-bd65-41ea-900f-95f0ec48e394.png" alt="basic grid">
</p>

To enable keyboard control of the gun, I added a ‘keyup’ event listener to the document, then created a function using conditional logic to handle the corresponding action of the gun - moving it one cell right if the right arrow key is tapped, one cell left if the left arrow key is tapped, and calling a separate function to fire the missile if the spacebar is tapped. Periodic movement of items not controlled by keyboard keys was implemented using setInterval and setTimeout JavaScript timing events.

```
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
   handleMissile() // Tapping the spacebar calls the function to launch the missile
 } else {
   addItem(gunClass, gunCurrentPosition)
 }
 
 addItem(gunClass, gunCurrentPosition)
 
}
```

In the game, there are two main types of projectile: the missile and the rock, and I created functions to manage each of these. I made use of the Math.random function to select a random dinosaur to throw down a rock periodically, but to prevent rocks falling through other dinos, I included logic to ensure that only dinosaurs where the cell directly below them has no classes are eligible to be selected at random to throw a rock (essentially dinos with empty space below them).

Collisions (between missiles and dinosaurs or rocks, and between rocks and the gun) are identified by detecting instances of the cell’s classList containing two different classes, and as a result, these classes are removed and replaced with an explosion class, to create the effect of the items blowing up. The functions responsible for these also increase the score and decrement the livesRemaining variables accordingly, depending on the kind of collision.

One of the biggest challenges of this project was figuring out dino herd movement. I realised the most efficient way to get them to move in formation was to store their cell position indexes in an array, then map over that array to update their positions each time they moved. However, ensuring that they moved right until they hit the right grid boundary, then down one, then left until they hit the left grid boundary, then down one, and so on, proved trickier. Key to resolving this problem was to define a ‘dinosDirection’ variable in global scope, that could be incorporated into the conditional logic controlling dino herd movement. If its value is ‘left’, the dinosaurs keep moving one cell left unless any dinosaurs reach the left edge, at which point they move down one and the value of dinosDirection is updated to ‘right’, and the same for the opposite direction of movement:

<img width="550" src="https://user-images.githubusercontent.com/84339614/148834321-f2a781a5-6ebc-4814-a9cd-d1c3e410d034.png" alt="dino herd movement code">

In this way, the dino herd moves together and in the correct sequence of directions until it reaches the bottom of the grid, at which point some other conditional logic kicks in to trigger the function that handles ending the game - containing code to clear the setInterval timers, display the final score and result message, and reset scores and other key variables to their default starting value for the next game.

I spent the final two days on styling and thoroughly testing the game. I found solutions to bugs, for example adjusting the speeds of the different variables so that collisions appeared more smoothly. I also added music, animations and other aesthetic details to create a more polished gameplay experience.


## Challenges

* **JavaScript timing events** - though I initially found them tricky, by the end of this project I became more comfortable using the setInterval and setTimeout methods correctly to control gameplay flow and create the effect of smooth movement.
* **Identifying the logic for dino herd movement** - I relished the challenge to get the dinosaurs to move in formation in the correct sequence, and learned that although it may take some lateral thinking, sometimes solutions to problems can be surprisingly simple!

## Wins

* **Problem solving** - through this project, I gained valuable practice breaking down larger problems into smaller ones and applying logic and experimentation to find effective solutions.
* **Bug fixing** - it was rewarding to work through and find fixes to bugs to ensure a smoother user experience.
* **Design** - I was pleased with the overall aesthetic experience I created, including the images, sound and animations, resulting in an engaging and on-theme final product.

## Future Improvements

* Adjust CSS so that the game appears optimally in Safari browser too - resolved.
* Multiple levels of increasing difficulty - this could be achieved through adding more dinos, speeding up the dinos and rocks, or slowing down the gun and missiles.
* Persistent leaderboard feature, making use of local storage.

## Key Learnings

* **JavaScript logic** - it was really satisfying to use JavaScript to solve each constituent problem that makes up the game’s functionality, and to gain experience rendering things on the screen using JavaScript DOM manipulation.
* **Refactoring code** - a key learning was that a function should ideally perform a single action well. If I had more time I would have refactored the code for some of the longer, more complex functions into shorter, simpler ones.
* **CSS** - through this project I became far more confident in my CSS and flexbox skills.

