![image](https://ga-dash.s3.amazonaws.com/production/assets/logo-9f88ae6c9c3871690e33280fcf557f33.png)

# GA WDI-32 Project 1 - Mario coin catcher
For our first project, we were given four days to design and build an in-browser game using HTML, CSS and JavaScript (jQuery library used). Mario Coin catcher was inspired by the Super Mario Bros. game on the NES console. It features Mario whose goal is to catch as many coins as possible in each level while avoiding getting hit by enemies. It features 4 levels with different game speed and enemies.
##### [Visit website](https://wee-words.herokuapp.com/) for best playing experience (the game was not designed for mobile).
---
###### WeeWords takes place in a 100% CSS-built and animated environment, with the weather changing on each level as the player progresses.
<p align="center"><img src="https://imgur.com/8llXrdZ.png" width="700"></p>
###### Level one gives the player 30 seconds to fulfil the required score, using any letters they can see on screen. The letters are picked at random from a weighted alphabet (so that you get more E’s than Z’s etc.) and assigned a random position on screen. They shrink and fade away after a set period of time, at which point they become unavailable for use in the player’s words.
<p align="center"><img src="https://imgur.com/Z2mQLZf.png" width="700"></p>
###### In level two, the difficulty increases as the player is only able to use blue letters. In level 3, the player may only use red letters and words under 4 letters long are not allowed.
<p align="center"><img src="https://imgur.com/3yyNskp.png" width="700"></p>
<p align="center"><img src="https://imgur.com/L1Ij5dt.png" width="700"></p>
<p align="center"><img src="https://imgur.com/Fx0ZE8B.png" width="700"></p>
###### The win logic requires a submitted word to fulfil a number of conditions to be passed as a valid word:
###### * The word is a correctly spelt English word (checked against an array of English words).
###### * The word is made up of letters that are present in an ever-changing array of letters in play.
###### * The word has not previously been entered during the level.
###### * The word consists of 4 letters or more (Level 3 only).
```
function returnResult() {
  if (wordIsValid === true && invalidLetters.length === 0 && wordIsRepeat === false) {
    $wordLog.append($(`<span>${submittedWord}</span>`).addClass('green'));
    scoreUpdate();
  } else {
    $wordLog.append($(`<span>${submittedWord}</span>`).addClass('red'));
  }
}
```
###### If level 3 is beaten, the player is presented with a final score (the sum of each level score) and can restart the entire game and try to beat it.
---
I was pleased with the final product, which I feel looks good an plays well. The game could be developed into a larger game with new levels and challenges to further test the player’s skills.
