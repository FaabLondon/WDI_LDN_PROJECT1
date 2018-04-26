![image](https://ga-dash.s3.amazonaws.com/production/assets/logo-9f88ae6c9c3871690e33280fcf557f33.png)

# GA WDI-32 Project 1 - Mario coin catcher
For my first project, I was given 1 week to design and build an in-browser game using HTML, CSS and JavaScript (jQuery library used). Mario Coin catcher was inspired by the Super Mario Bros game on the NES console. It features Mario, who needs to catch as many coins as possible in each level while avoiding getting hit by enemies.
It features 5 levels with different game speed, enemies and tasks. The 2 first levels are an introduction to the game, its enemies and Mario moves, while the last 3 levels have an extra challenge as Mario needs to catch a certain number of coins in order to progress to the next level.
This game has been for desktop only.

##### [Visit website](https://mario-coin-catcher.herokuapp.com/) for best playing experience (the game was not designed for mobile or tablet).

Mario coin catcher makes use of a HTML grid and JQuery in order to animate the different elements (coins, enemies, bonus, Mario) in the grid and check for collisions. The elements move on the grid by having their picture and class changed. To make the animations look more linear, I used css animations to "smooth" the transition between 2 squares of the grid.

As the player progresses, more enemies are added on each level, with a higher velocity and extra challenges (e.g.: catching a specific number of coins). When Mario catches a coin, the coin counter is incremented. If Mario gets hit by an enemy, he needs to start again. Mario starts the game with 5 lives but can get an additional life for every 50 coins caught in one level. Some "life mushroom" are also offered in certain levels.

###### Level 1 gives the player 30 seconds to catch as many coins as possible while avoiding the enemies (evil mushroom). In that level, Mario can not jump yet. The enemies and coins are dropping from the sky randomly based on the parameters given for that level (speed of all elements, possible delay between each animation, proportion of coins vs. enemies).

<p align="center"><img src="https://i.imgur.com/Ie2rfZl.png" width="700"></p>

###### In level 2, Mario can jump and the difficulty increases as an additional enemy is bouncing back and forth and Mario needs to jump to avoid it. Mario moves to the next level on time up, as long as he does not get hit by an enemy.

<p align="center"><img src="https://i.imgur.com/TJTQmFR.png" width="700"></p>

###### In level 3 , Mario needs to catch at least 30 coins within 45 seconds to unlock the next level. Once the 30 coins are caught, the player hears a "yeah" from Mario to indicate the goal has been reached. Mario still need to finish the level while avoiding the enemies. If Mario doesn't reach 30 coins he loses 1 life and needs to try the level again. In that level a new enemy (evil turtle) appears and the coins drop faster.

<p align="center"><img src="https://i.imgur.com/oZXRxU5.png" width="700"></p>

###### In level 4 , Mario needs to catch at least 30 coins within 45 seconds to unlock the next level, while still avoiding the enemies and the bouncing shell.

<p align="center"><img src="https://i.imgur.com/iCPbRZN.png" width="700"></p>

###### In level 5, the last level, Mario has to be really fast as he needs to catch at least 40 coins within 45 seconds to finish the game. The parameters in that level have been changed to allow more coins to drop from the sky.

<p align="center"><img src="https://i.imgur.com/vkQZkex.png" width="700"></p>

---
I was pleased with the final product, which I feel looks good an plays well. The levels can easily be adapted to make them easier or more challenging. A new level can be added in 1 minute which allows to develop a larger game with new levels and challenges to further test the player’s skills.
I would have liked to add additional features like a second player and additional enemies with different behaviours.

My main challenge in this game was to check for "collisions" on Mario jumping. In some cases the jump would happen just when the coin/enemy was dropping by 1 square which meant that Mario was missing the coin or not getting hit by the enemy despite jumping on it.
When this was solved, I would get the opposite effect, with a double counting of coins or double hit by enemies. I ended up using a marker to set a coin or bonus as 'caught' to avoid a double catch.
There is still a little bug that I wish to correct, which doesn't show Mario animation and music when he gets hit by an enemy while jumping.

---

## Setup instructions

- Clone or download the repo
- Install dependencies with `yarn install` or `npm install`
- Launch the app with `gulp`

>**NB**: You will need to have installed `gulp-cli` globally
