$(() => {
  console.log('JS Loaded');

  //****************************** Variables **********************************
  //DOM variables
  const $BoardAndheader = $('.BoardAndheader');
  const $grid = $('.mainGrid');
  const $sections = $('section');
  const $topSection = $('.topSection');
  const $middleSection= $('.middleSection');
  const $footer= $('footer');
  const $middleSectionText = $('.middleSection p');
  const $bottomSectionText = $('.bottomSection p.InstructionsGame');
  const $bottomSectionImg = $('.bottomSection img');
  const $bottomSectionInstructions = $('.bottomSection p.instructionsMove');
  const $levelSpan = $('.levelSpan');
  const $coinsSpan = $('.coinsSpan');
  const $scoreSpan = $('.scoreSpan');
  const $marioIntro = $('.marioIntro');
  const $arrowButton = $('.arrowButton');
  const $arrow = $('.arrow');
  const $timer = $('.timer');
  const $eventAudio = $('.events');
  const $backgroundAudio = $('.backgroundMusic');

  //Initial variables for game
  let timer = 0; //global timer level
  let timerID = 0; //timerId of the global timer
  let timeOutId = 0; //timerid of of the timout that stops the timer
  let timeOutId2 = 0; //timer id of Mario jumping animation
  let toCatchLevel = 0;
  let level; //initial level
  const levels = {
    1: level1,
    2: level2,
    3: level3,
    4: level4,
    5: level5
  };
  let nbLives = 0; //initial number of lives
  const nbColumns = 19;
  const nbRows = 8;
  let nbCoins = 0; //initial number of coins
  let timeouts = []; //will store all timeouts
  let globalScore = 0;
  let MarioJumpSpeed;

  //images and audio for Mario, enemies and bonuses
  const coin = '<img class="coin" src="/images/coin.png" alt="coin">';
  const coinFaster = '<img class="coin faster" src="/images/coin.png" alt="coin">';
  const lifeMushroom = '<img class="life" src="/images/lifeMushroom.png" alt="life">';
  const enemyMushroom = '<img class="enemy mushroom" src="/images/enemyMushroom.png" alt="enemy">';
  const enemyTurtleLeft = '<img class="enemy shell left" src="/images/enemyTurtle.png" alt="enemy">';
  const enemyTurtleRight = '<img class="enemy shell right" src="/images/enemyTurtle.png" alt="enemy">';
  const enemyTurtleFlying = '<img class="enemy flying" src="/images/enemyTurtleFlying.png" alt="enemy">';
  const victoryLogo = '/images/logoVictory.png';
  const thumbsUpLogo = '/images/logoThumbsUp.png';
  const marioRight = '<img class="mario" src="/images/littleMarioRight.png" alt="mario">';
  const marioLeft = '<img class="mario" src="/images/littleMarioLeft.png" alt="mario">';
  const marioLosing = '<img class="marioLost" src="/images/marioLosing.png" alt="mario">';
  //sounds
  const marioLosingSound = '/sounds/marioLosing.wav';
  const coinCaught = '/sounds/marioCoinSound.wav';
  const gameOverSound = '/sounds/gameOver.wav';
  const additionalLife = 'sounds/newLife.wav';
  const marioJumping = 'sounds/marioJumping.wav';
  const endOfGame = 'sounds/endGame.wav';

  //instructions per level
  const instructions = {
    '1': 'Marioooo, try to catch as many <img src="/images/coin-small.png" alt=" coins "> as possible while avoiding the <img src="/images/enemyMushroom-small.png" alt=" enemies ">',
    '2': 'Congratulations! Now, avoid the rolling <img src="/images/enemyTurtleSmall.png" alt=" enemyTurtle "> but try to catch the <img src="/images/lifeMushroomSmall.png" alt=" life "> as it will give you 1 additional life!',
    '3': 'Amazing! <img src="/images/coin-small.png" alt=" coins "> are falling quicker now! Try to catch 50 of them to get 1 additional life and keep avoiding the <img src="/images/enemyMushroom-small.png" alt=" enemies "> and <img src="/images/enemyTurtleFlyingSmall.png" alt=" enemies ">.',
    '4': 'Amazing! Try again and this time, avoid the rolling <img src="/images/enemyTurtleSmall.png" alt=" enemyTurtle "> the <img src="/images/enemyMushroom-small.png" alt=" enemies "> and <img src="/images/enemyTurtleFlyingSmall.png" alt=" enemies ">',
    '5': 'Try to catch 40 coins to finish the game. Avoid the <img src="/images/enemyMushroom-small.png" alt=" enemies "> and <img src="/images/enemyTurtleFlyingSmall.png" alt=" enemies ">'
  };
  const instructionsMove = {
    '1': 'Press the <i class="fas fa-caret-left fa-sm"></i> button to go left and the <i class="fas fa-caret-right fa-sm"></i> button to go right.',
    '2': 'Use the <i class="fas fa-caret-up fa-sm"></i> button to jump!',
    '3': 'Use the <i class="fas fa-caret-left fa-sm"></i> and <i class="fas fa-caret-right fa-sm"></i> and <i class="fas fa-caret-up fa-sm"></i> to move Mario!',
    '4': 'Use the <i class="fas fa-caret-left fa-sm"></i> and <i class="fas fa-caret-right fa-sm"></i> and <i class="fas fa-caret-up fa-sm"></i> to move Mario!',
    '5': 'Use the <i class="fas fa-caret-left fa-sm"></i> and <i class="fas fa-caret-right fa-sm"></i> and <i class="fas fa-caret-up fa-sm"></i> to move Mario!'
  };

  //calculates total number of squares in grid
  const totalNbSquares = nbColumns * nbRows;
  //calculates the max left position and right position for Mario
  const leftPos = totalNbSquares - nbColumns; // to calculate depending on grid size
  const rightPos = totalNbSquares - 1; // to calculate depending on grid size

  //mario initial location
  const initialPos = totalNbSquares - nbColumns + 3 ; //Mario initial position on all screens
  let marioPos = initialPos;

  //*********************************FUNCTIONS*********************************
  //grid initialisation
  function gridInit(){
    let k = 0;
    for (let i = 0; i < nbRows; i++){
      for (let j = 0; j < nbColumns; j++){
        $grid.append($('<div></div>').addClass(`square nb${k++}`));
      }
    }
  }
  //********************************* DISPLAYS FIRST FRAME ***********************

  function firstFrame(){
    $sections.show();
    //activate middle section click
    $middleSection.on('click',secondFrame);
    //make the grid disappear
    $grid.hide();
    //initiliase content of the page
    //TOP SECTION
    if (level > Object.keys(levels).length) $topSection.text('You completed the game!');
    else $topSection.text('Welcome to Mario Coin catcher!');
    //MIDDLE SECTION
    $middleSectionText.addClass('animate');
    $arrow.show();
    $middleSectionText.text('Let\'s start!');
    //BOTTOM SECTION
    $bottomSectionImg.show();

    //IF START AGAIN - MIDDLE SECTION AND BOTTOM SECTION
    if (globalScore > 0){
      $middleSectionText.text('Let\'s play again!');
      $bottomSectionImg.hide();
      $bottomSectionText.html(`CONGRATULATIONS! <br> You managed to catch ${globalScore} coins !`);
      $bottomSectionImg.show();
      $bottomSectionImg.attr('src',victoryLogo);
      //change audio to end of game
      $backgroundAudio.get(0).pause();
      $backgroundAudio.attr('src', endOfGame);
      $backgroundAudio.attr('loop', false);
      $backgroundAudio.get(0).play();
    }
    //initialise Variables
    level = 1; //initial level
    globalScore = 0;
    nbLives = 5; //initial number of live
    timeouts = [];
  }


  //***************************DISPLAYS SECOND FRAME****************************
  function secondFrame(){
    //If game was previously running clear the grid and classes.
    //clear all pictures from the grid
    $($squares).html('');
    //reset classes after game stops
    $('div .coin').toggleClass('coin');
    $('div .enemy').toggleClass('enemy');
    $('div .mario').removeClass('mario');
    $('div .marioLost').removeClass('marioLost');
    $('div .caught').removeClass('caught');

    //Update frame with new score, instructions etc.
    //Hide grid and show all sections
    $grid.hide();
    $sections.show();
    //BACKGROUND
    $BoardAndheader.css({backgroundImage: 'none'});
    $footer.css({backgroundImage: 'none'});

    //HEADER
    const scoreStr = `0000${globalScore}`;
    $scoreSpan.text(scoreStr.substr(scoreStr.length - 5)); // length is alwaus 5 digit
    //initialise number of coins and reset coin display
    nbCoins = 0;
    $coinsSpan.text(nbCoins);
    //changes to Level X
    $levelSpan.text(level);
    $topSection.text(`Level ${level}`);

    //MIDDLE SECTION
    //desactivate on click event for middle sections
    $middleSection.off('click',secondFrame);
    //hide arrow and stop the pulsating animation
    $arrow.hide();
    $middleSectionText.removeClass('animate');
    //Update middle section content depending on nbLIves left or not
    nbLives > 0 ? nextLevel() : gameOver();

    //BOTTOM section
    $bottomSectionImg.hide();
  }

  //********************************** Next level *******************************

  function nextLevel(){
    $middleSectionText.text(`   X   ${nbLives}`);
    $marioIntro.show();
    //changes bottom section to instructions for next level and the kind of moves possible
    $bottomSectionText.html(instructions[level]);
    $bottomSectionInstructions.html(instructionsMove[level]);
    $bottomSectionInstructions.addClass('animate'); //to make the instructions pulsate and move visible
    $arrowButton.show();
  }

  //********************************** GAME OVER *******************************

  function gameOver(){
    //change audio
    $backgroundAudio.get(0).pause();
    $backgroundAudio.attr('src', gameOverSound);
    $backgroundAudio.attr('loop', false);
    $backgroundAudio.get(0).play();
    //Change display
    $marioIntro.hide();
    $middleSectionText.text('GAME OVER');
    $bottomSectionInstructions.html('');
    $bottomSectionText.html('');
    $arrowButton.hide();
    setTimeout(() => {
      firstFrame();
    }, 3000);
  }

  //********************************* FRAME TO START GAME ***********************
  function levelStart(){
    //Show the grid and hide the $sections
    $sections.hide();
    $grid.show();
    //show global score
    const scoreStr = `0000${globalScore}`;
    $scoreSpan.text(scoreStr.substr(scoreStr.length - 5));

    //position Mario on the grid always on 3rd square to the left and looks to the right
    marioPos = initialPos;
    $($squares[marioPos]).html(marioRight);
    $($squares[marioPos]).addClass('mario');

    // to make sure all keydown events are off before creating new ones - Done in another funntion but apparently setting some events off() are not seen globally!!
    $(document).off('keydown');
    //reactivate Mario moving on keydown
    $(document).on('keydown', MarioLeftRight);
    $(document).on('keydown', marioJump);
    //start current level
    levels[level]();
  }

  //************************* TIME UP FRAME ************************************

  function timeUpFrame(){
    //clear all timeouts (animation) in the game to stop them
    for (let i = 0; i < timeouts.length; i++) {
      clearTimeout(timeouts[i]);
    }
    //removes event keydown on Mario to prevent Mario from moving
    $(document).off('keydown');

    //stop playing level Music
    $backgroundAudio.get(0).pause();

    //Update DISPLAY
    //hide grid and show sections
    $grid.hide();
    $sections.show();
    //remove background picture
    $BoardAndheader.css({backgroundImage: 'none'});
    $footer.css({backgroundImage: 'none'});

    if (nbCoins >= toCatchLevel || toCatchLevel === 0){ //if Mario catches enough coins
      //HEADER update global score - updated only when time up and to next level
      globalScore += nbCoins;
      const scoreStr = `0000${globalScore}`;
      $scoreSpan.text(scoreStr.substr(scoreStr.length - 5)); // length is always 5 digit

      //MIDDLE SECTION and BOTTOM SECTION
      $middleSectionText.text(`Time's up! You caught ${nbCoins} coins!`);
      $bottomSectionInstructions.html('');
      $bottomSectionText.html('');
      $bottomSectionImg.show();
      $bottomSectionImg.attr('src',thumbsUpLogo);
      $marioIntro.hide();
      $arrowButton.hide();

      //After 3 seconds go back to frame 2 for next level or frame 1 if all levels completed
      setTimeout(() => {
        level++;
        if (level > Object.keys(levels).length){
          firstFrame();
        } else secondFrame();//on to next level as time is up and no enemy caught
      }, 3000);
    } else {
      //MIDDLE SECTION and BOTTOM SECTION
      $middleSectionText.text(`Time's up! You caught ${nbCoins} coins!`);
      $bottomSectionInstructions.html('Too bad ! You did not catch enough coins! <br> Try again!');
      nbLives--;
      $bottomSectionText.html('');
      $marioIntro.hide();
      $arrowButton.hide();
      setTimeout(() => secondFrame(), 3000);
    }
  }

  //************************* LEVEL 1 - no jumping******************************

  function level1(){
    //desactivate Mario jumping as not jumping in that level
    $(document).off('keydown', marioJump);
    //set speed for the level and Duration
    const avgIncrTimeOut = 300;
    const rapidIncrTimeOut = 200;
    const gameDuration = 45;
    const possibleTimes = [200, 500, 800]; //Possible time between each animation
    //repeated coins 2 x as want them to be 2 x more likely than enemies
    const possibleElement = [
      {'speed': avgIncrTimeOut, 'picture': coin, 'class': 'coin'},
      {'speed': avgIncrTimeOut, 'picture': coin, 'class': 'coin'},
      {'speed': rapidIncrTimeOut, 'picture': enemyMushroom, 'class': 'enemy'}
    ];
    toCatchLevel = 0;
    //Sets Music and image and animate coins, enemies and bonus for the level
    gamePlan(gameDuration, possibleTimes, possibleElement);
  }

  //************************* LEVEL 2: shell and jumping  **************************
  function level2(){
    //set speed for the level and Duration
    const avgIncrTimeOut = 300;
    const rapidIncrTimeOut = 200;
    const gameDuration = 45; //change back to 30 seconds
    const possibleTimes = [200, 500, 800]; //Possible time between each animation
    //repeated coins 3 x as want them to be 3 x more likely than enemies as this level and harder due to extra shell rolling on the ground
    const possibleElement = [
      {'speed': avgIncrTimeOut, 'picture': coin, 'class': 'coin'},
      {'speed': avgIncrTimeOut, 'picture': coin, 'class': 'coin'},
      {'speed': avgIncrTimeOut, 'picture': coin, 'class': 'coin'},
      {'speed': rapidIncrTimeOut, 'picture': enemyMushroom, 'class': 'enemy'}
    ];
    toCatchLevel = 0;
    //slow jumps so Mario has time to avoid rolling shell
    MarioJumpSpeed = 400;

    //add a rolling shell at the very beginning and during the whole duration of the game
    animateElementLeftRight(15, 1, 200, gameDuration * 1000, enemyTurtleLeft, enemyTurtleRight, 'enemy');
    //add a new life midGame as game is quite hard...
    animateElementDown(4, 12000, 200, lifeMushroom, 'life');
    //Animate coins, enemies and bonus
    gamePlan(gameDuration, possibleTimes, possibleElement);
  }

  //****************** LEVEL 3: faster game + more ennemies **********************
  function level3(){
    //set speed for the level and Duration - Speed is higher for the coins now
    const rapidIncrTimeOut = 200;
    const gameDuration = 45;
    const possibleTimes = [200, 350, 450]; //decreased possible interval between animations
    //Added a new type of enemy, repeated coins 3 x as want them to be as likely as enemies
    const possibleElement = [
      {'speed': rapidIncrTimeOut, 'picture': coinFaster, 'class': 'coin'},
      {'speed': rapidIncrTimeOut, 'picture': coinFaster, 'class': 'coin'},
      {'speed': rapidIncrTimeOut, 'picture': coinFaster, 'class': 'coin'},
      {'speed': rapidIncrTimeOut, 'picture': coinFaster, 'class': 'coin'},
      {'speed': rapidIncrTimeOut, 'picture': enemyMushroom, 'class': 'enemy'},
      {'speed': rapidIncrTimeOut, 'picture': enemyTurtleFlying, 'class': 'enemy'},
      {'speed': rapidIncrTimeOut, 'picture': enemyTurtleFlying, 'class': 'enemy'}
    ];
    toCatchLevel = 0;
    //Mario jump quicker
    MarioJumpSpeed = 300;

    //Animate coins, enemies and bonus
    gamePlan(gameDuration, possibleTimes, possibleElement);

  }

  //************************* LEVEL 4: shell + faster ****************************
  function level4(){
    //set speed for the level and Duration
    const rapidIncrTimeOut = 200;
    const gameDuration = 45; //change back to 30 seconds
    const possibleTimes = [200, 400, 600]; //decrease possible interval a bit
    //Added an extra type of enemy and we will still have the rolling shell
    const possibleElement = [
      {'speed': rapidIncrTimeOut, 'picture': coinFaster, 'class': 'coin'},
      {'speed': rapidIncrTimeOut, 'picture': coinFaster, 'class': 'coin'},
      {'speed': rapidIncrTimeOut, 'picture': coinFaster, 'class': 'coin'},
      {'speed': rapidIncrTimeOut, 'picture': coinFaster, 'class': 'coin'},
      {'speed': rapidIncrTimeOut, 'picture': enemyMushroom, 'class': 'enemy'},
      {'speed': rapidIncrTimeOut, 'picture': enemyTurtleFlying, 'class': 'enemy'}
    ];
    toCatchLevel = 0;
    //slower jump speed as rolling shell on the floor
    MarioJumpSpeed = 400;

    //add a rolling shell at the very beginning and during the whole duration of the game
    animateElementLeftRight(15, 1, 200, gameDuration * 1000, enemyTurtleLeft, enemyTurtleRight, 'enemy');
    //add a new life midGame as game is quite hard...
    animateElementDown(4, 17000, 200, lifeMushroom, 'life');
    //Animate coins, enemies and bonus
    gamePlan(gameDuration, possibleTimes, possibleElement);
  }

  //********** LEVEL 5: MARIO TO CATCH X NUMBER OF COINS **********************
  function level5(){
    //number of coins Mario needs to catch to mke it to end of game
    toCatchLevel = 40;
    //set speed for the level and Duration - Speed is higher for the coins now
    const rapidIncrTimeOut = 200;
    const gameDuration = 45;

    const possibleTimes = [200, 350, 450]; //decreased possible interval between animations
    //Added a new type of enemy, repeated coins 3 x as want them to be as likely as enemies
    const possibleElement = [
      {'speed': rapidIncrTimeOut, 'picture': coinFaster, 'class': 'coin'},
      {'speed': rapidIncrTimeOut, 'picture': coinFaster, 'class': 'coin'},
      {'speed': rapidIncrTimeOut, 'picture': coinFaster, 'class': 'coin'},
      {'speed': rapidIncrTimeOut, 'picture': coinFaster, 'class': 'coin'},
      {'speed': rapidIncrTimeOut, 'picture': enemyMushroom, 'class': 'enemy'},
      {'speed': rapidIncrTimeOut, 'picture': enemyTurtleFlying, 'class': 'enemy'},
      {'speed': rapidIncrTimeOut, 'picture': enemyTurtleFlying, 'class': 'enemy'}
    ];
    //Mario jump quicker
    MarioJumpSpeed = 300;

    //Animate coins, enemies and bonus
    gamePlan(gameDuration, possibleTimes, possibleElement);

  }

  //****************************** IMPLEMENTS GAME PLAN **********************************
  function gamePlan(gameDuration, possibleTimes, possibleElement){
    //variables for random elements in animation
    let timeIncr = 0;
    let timeTotal = 0;
    let randCol = 0;
    let randElem = 0;

    //change background picture and set Music for the Level
    $BoardAndheader.css({backgroundImage: `url(/images/backgroundLevel${level}.png)`});
    $footer.css({backgroundImage: `url(/images/Level${level}footer.png)`});
    $backgroundAudio.attr('loop', true);
    $backgroundAudio.attr('src', `/sounds/Level${level}.wav`);
    $backgroundAudio.get(0).play();

    // Timer for the level
    timer = gameDuration;
    timerID = setInterval(() => {
      if (timer >= 0){
        $timer.text(`Time:${timer--}`);
      }
    }, 1000);

    //stops the timer after gameDuration seconds
    timeOutId = setTimeout(() => {
      clearInterval(timerID);
      timeUpFrame();
    }, (gameDuration + 2) * 1000);

    while (timeTotal <= gameDuration * 1000){
      timeIncr = possibleTimes[Math.floor(Math.random() * (possibleTimes.length))]; //timeout delay
      randCol = Math.floor(Math.random() * (nbColumns));
      randElem = possibleElement[Math.floor(Math.random() * (possibleElement.length))];
      timeTotal += timeIncr;
      animateElementDown(randCol, timeTotal, randElem.speed, randElem.picture, randElem.class);
    }
  }

  //***************************** ANIMATE ELEMENT DOWN *******************************
  //animateElementDown(column, InitialTimeOut, incrTimeOut, srcPicture, class)
  // column: nb of the column where the element falls
  // initialTimeOut: delay before fall
  // incrTimeOut: Timeout beteen each step of animation, the highest the number the slower the animation
  // src: image to use for the enemy
  // type: class by type of element (coin / enemy / bonus)

  function animateElementDown(column, InitialTimeOut, incrTimeOut, src, type){
    //initialise timeout
    let timeOutIncrement = InitialTimeOut;
    let i = 0;
    //loop to animate element in the different columns down the screen
    for (i = 0 + column; i < totalNbSquares; i = i + nbColumns){
      //animate element - has to return timeOutIncrement as it keeps being incremented duing animation
      timeOutIncrement = animate(i, timeOutIncrement, incrTimeOut, src, type);
    }
  }

  //***************************** ANIMATE ELEMENT LEFT AND RIGHT *******************************
  // animateElementLeftRight(column, InitialTimeOut, incrTimeOut, srcPicture, class)
  // column: nb of the column where the element falls
  // initialTimeOut: delay before fall
  // incrTimeOut: Timeout beteen each step of animation, the highest the number the slower the animation
  // src: image to use for the enemy
  // type: class by type of element (coin / enemy / bonus)

  function animateElementLeftRight(column, InitialTimeOut, incrTimeOut, duration, srcLeft, srcRight, type){
    //initialise timeout
    let timeOutIncrement = InitialTimeOut;
    //Set the element in column 'column'
    let initPosition = rightPos - nbColumns + column;
    //loop to animate element back and forth in the different columns on bottom row
    //Animations goes on until timer is at 0
    while(timeOutIncrement <= duration){
      //PHASE 1 - GO LEFT FROM INITIAL POSITION UNTIL LEFT BORDER
      //different image source on left and right as different animations
      for (let i = initPosition; i >= leftPos; i--){
        timeOutIncrement = animate(i, timeOutIncrement, incrTimeOut, srcLeft, type);
      }
      //PHASE 2 - GO FROM LEFT BORDER TO RIGHT BORDER
      for (let i = leftPos + 1; i <= rightPos; i++){
        timeOutIncrement = animate(i, timeOutIncrement, incrTimeOut, srcRight, type);
      }
      //to re-start the animation where we left it after first two loops
      initPosition =  rightPos - 1;
    }
  }

  //***************************** ANIMATE ELEMENT *******************************
  //animates element and checks wether hit with Mario
  //animate(i, timeOutIncrement, incrTimeOut, src, type)
  // i: index of the element to animate
  // timeOutIncrement: time delay for each timeout - it keeps increasing until end of game
  // incrTimeOut: Timeout beteen each step of animation, the highest the number the slower the animation
  // src: image to use for the enemy
  // type: class by type of element (coin / enemy / bonus)

  function animate(i, timeOutIncrement, incrTimeOut, src, type){
    //animate the element by making it appear in square i and check if hit with Mario
    //set class 'type' on the div if type not there. If no hit with Mario,change image to element
    timeouts.push(setTimeout(() => {
      if (!$($squares[i]).hasClass(type)) $($squares[i]).addClass(type);
      if (!checkHit(i, false)) $($squares[i]).html(src);
    }, timeOutIncrement));

    //After incrTimeOut make the element disappear
    timeOutIncrement = timeOutIncrement + incrTimeOut;

    //then makes the element disappear in the same square
    //remove class 'type' on the div and check that mario image doesn't get replaced by coin or enemy
    timeouts.push(setTimeout(() => {
      if ($($squares[i]).hasClass(type)) $($squares[i]).removeClass(type);
      if (!$($squares[i]).hasClass('mario') && !$($squares[i]).hasClass('marioLost')) $($squares[i]).html('');
    }, timeOutIncrement));

    return timeOutIncrement;
  }

  //************************ CHECKS WETHER COIN/ENEMY/BONUS HIT*******************

  function checkHit(i, jump){
    //if we have Mario and a coin in the same div, it is a hit
    if (($($squares[i + nbColumns]).hasClass('mario') && $($squares[i]).hasClass('coin') && jump === true) || ($($squares[i]).hasClass('mario') && $($squares[i]).hasClass('coin') && jump === false)) {
      //if coin already caught then remove class caught and nothing happens
      if ($($squares[i]).hasClass('caught')) {
        $($squares[i]).removeClass('caught');
      } else { //adds coin caught in div below to make sure coin is caught on jump
        $($squares[i+nbColumns]).addClass('caught');
        //removes coin class
        $($squares[i]).removeClass('coin');
        //change audio when mario catches coin
        $eventAudio.attr('src', coinCaught);
        $eventAudio.get(0).play();
        //had to reduce timeOut delay as when coins caught close one after another, no new sound was played
        //setTimeout(() => $eventAudio.get(0).pause(), 400);
        //increment nbCoins and update number of coins on screen
        nbCoins++;
        //Every 50 coins caught in one game, gives 1 additional life
        if (nbCoins % 50 === 0){
          addLife();
        }
        $coinsSpan.text(nbCoins);
      }
      return true;
    }

    //if we have Mario and an enemy in the same div
    if (($($squares[i + nbColumns]).hasClass('mario') && $($squares[i]).hasClass('enemy') && jump === true) || ($($squares[i]).hasClass('mario') && $($squares[i]).hasClass('enemy') && jump === false)){
      // $($squares[i+nbColumns]).addClass('hit');
      $($squares[i]).removeClass('enemy');
      //call Mario losing function
      MarioLosing();
      return true;
    }

    //if we have Mario and a life mushroom in the same div
    if (($($squares[i + nbColumns]).hasClass('mario') && $($squares[i]).hasClass('life') && jump === true) || ($($squares[i]).hasClass('mario') && $($squares[i]).hasClass('life') && jump === false)) {
      //if mushroom already caught then remove class caught and nothing happens
      if ($($squares[i]).hasClass('caught')) {
        $($squares[i]).removeClass('caught');
      } else {
        //adds coin caught in div below to make sure coin is caught on jump and no double catch
        $($squares[i+nbColumns]).addClass('caught');
        $($squares[i]).removeClass('life');
        addLife();
      }
      return true;
    }
    return false;
  }

  //************************ ADDITIONAL LIFE ***********************************

  function addLife(){
    //change audio when mario catches lifeMushroom
    $eventAudio.attr('src', additionalLife);
    $eventAudio.get(0).play();
    setTimeout(() => $eventAudio.get(0).pause(), 1000);
    //increment nblifes
    nbLives++;
  }

  //************************ WHEN MARIO LOSES **********************************

  function MarioLosing(){
    //clear global Timer, timeout to avoid going to time's up screen and timeout of Mario Jumping
    clearInterval(timerID);
    clearTimeout(timeOutId);
    clearTimeout(timeOutId2); //stops Mario from moving after he is hit by enemy
    timer = 0; //re-initialise global timer
    //desactivate Mario moving on all keydown
    $(document).off('keydown');

    $($squares).html('');

    //clear all timeouts (animation) in the game to stop them
    for (let i = 0; i < timeouts.length; i++) {
      clearTimeout(timeouts[i]);
    }
    //Animates Mario on losing - see css animation
    $($squares[marioPos]).html(marioLosing);
    //stop playing level Music and change to 'losing' music
    $backgroundAudio.get(0).pause();
    $eventAudio.attr('src', marioLosingSound);
    $eventAudio.get(0).play();
    //decrement nb of lives
    nbLives--;
    setTimeout(() => {
      secondFrame();
    }, 3000); //wait for the 3second losing mario animation to finish
  }


  //************************  SWITCH MARIO POSITION *****************************
  function switchMario(marioPic, newPos, marioPos){
    $($squares[marioPos]).removeClass('mario');
    $($squares[marioPos]).html('');
    // adds Mario in new position and add Mario class
    $($squares[newPos]).html(marioPic);
    $($squares[newPos]).addClass('mario');
  }

  //************************  MARIO JUMPS ***************************************
  function marioJump(e) {
    let newPos = 0;
    //if key pressed is up arrow
    if(e.which === 38){
      //play jumping sound
      $eventAudio.attr('src', marioJumping);
      $eventAudio.get(0).play();
      //desactivate jump to avoid user jumping even higher
      $(document).off('keydown');
      //set new position and get current Mario image
      newPos = marioPos - nbColumns;
      const currMarioPic = $($squares[marioPos]).html();
      //checks for crossover between Marion and element
      checkHit(newPos, true);
      //switches Mario position
      switchMario(currMarioPic, newPos, marioPos);
      marioPos = newPos;
      //check if Mario catches something at end of jump
      checkHit(newPos, false);
      newPos = marioPos + nbColumns; //back to initial position

      // Mario lands back on the ground after time MarioJumpSpeed
      timeOutId2 = setTimeout(() => {
        //switches Mario position
        switchMario(currMarioPic, newPos, marioPos);
        marioPos = newPos;
        checkHit(newPos, false); //would get shell to hit Mario but also double counting of coins so added the marker 'caught' when mario catches coin

        //reactivate Mario moving on keydown
        $(document).on('keydown', MarioLeftRight); //Mario going left, right
        $(document).on('keydown', marioJump); //Mario jumping
      },MarioJumpSpeed);
    }
  }

  //************************  MARIO GOES LEFT OR RIGHT *************************

  function MarioLeftRight(e) {
    let newPos = 0;
    //Mario going left
    if(e.which === 37 && marioPos - 1 >= leftPos){ //left arrow
      newPos = marioPos - 1;
      //switches Mario position
      switchMario(marioLeft, newPos, marioPos);
      marioPos = newPos;
      //checks for a hit !
      checkHit(marioPos, false);
      //Mario going right
    } else if (e.which === 39 && marioPos + 1 <= rightPos){ //right arrow + to avoid going out of screen
      newPos = marioPos + 1;
      //switches Mario position
      switchMario(marioRight, newPos, marioPos);
      marioPos = newPos;
      //checks for a hit !
      checkHit(marioPos, false);
    }
  }


  //**************** START THE GAME ***************************

  //Click event here otherwise several event listener are created, several timers etc etc
  $arrowButton.on('click',levelStart);
  //Call function to automatically generate grid
  gridInit();
  //Is it ok to declare here? as if I declare with other variables the grid is not initialised
  const $squares = $('.square');
  //shows first frame
  firstFrame();

});
