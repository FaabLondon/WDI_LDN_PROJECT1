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
  const $bottomSectionText = $('.bottomSection p.Leaderboard');
  const $bottomSectionImg = $('.bottomSection img');
  const $bottomSectionInstructions = $('.bottomSection p.instructions');
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
  let level; //initial level
  const levels = {
    1: level1,
    2: level2,
    3: level3,
    4: level4
  };
  let nbLives = 0; //initial number of lives
  const nbColumns = 19;
  const nbRows = 8;
  let nbCoins = 0; //initial number of coins
  let timeouts = []; //will store all timeouts
  let globalScore = 0;
  let MarioJumpSpeed;
  let leaderBoard = {};

  //images and audio for Mario, ennemies and bonuses
  const coin = '<img class="coin" src="/images/coin.png" alt="coin">';
  const coincaught = '<img class="coin caught" src="" alt="coin">';
  const coinFaster = '<img class="coin faster" src="/images/coin.png" alt="coin">';
  const lifeMushroom = '<img class="life" src="/images/lifeMushroom.png" alt="life">';
  const ennemyMushroom = '<img class="ennemy mushroom" src="/images/ennemyMushroom.png" alt="ennemy">';
  const ennemyTurtle = '<img class="ennemy shell" src="/images/ennemyTurtle.png" alt="ennemy">';
  const ennemyTurtleFlying = '<img class="ennemy flying" src="/images/ennemyTurtleFlying.png" alt="ennemy">';
  const marioRight = '<img class="mario" src="/images/littleMarioRight.png" alt="mario">';
  const marioLeft = '<img class="mario" src="/images/littleMarioLeft.png" alt="mario">';
  const marioLosing = '<img class="marioLost" src="/images/marioLosing.png" alt="mario">';
  //sounds
  const marioLosingSound = '/sounds/marioLosing.wav';
  const coinCaught = '/sounds/marioCoinSound.mp3';
  const gameOverSound = '/sounds/gameOver.wav';
  const lifeMushroomcaught = 'sounds/newLife.wav';

  //instructions per level
  const instructions = {
    '1': 'Marioooo, try to catch as many <img src="/images/coin-small.png" alt=" coins "> as possible while avoiding the <img src="/images/ennemyMushroom-small.png" alt=" ennemies ">',
    '2': 'Congratulations! Now, avoid the rolling <img src="/images/ennemyTurtleSmall.png" alt=" ennemyTurtle "> but try to catch the <img src="/images/lifeMushroomSmall.png" alt=" life "> as it will give you 1 additional life!',
    '3': 'Amazing! The <img src="/images/coin-small.png" alt=" coins "> are falling quicker now! Try avoiding more ennemies <img src="/images/ennemyMushroom-small.png" alt=" ennemies "> and <img src="/images/ennemyTurtleFlyingSmall.png" alt=" ennemies ">',
    '4': 'Amazing! Try again and this time, avoid the rolling <img src="/images/ennemyTurtleSmall.png" alt=" ennemyTurtle "> the <img src="/images/ennemyMushroom-small.png" alt=" ennemies "> and the <img src="/images/ennemyTurtleFlyingSmall.png" alt=" ennemies ">'
  };
  const instructionsMove = {
    '1': 'Press the <i class="fas fa-caret-left fa-sm"></i> button to go left and the <i class="fas fa-caret-right fa-sm"></i> button to go right.',
    '2': 'Use the <i class="fas fa-caret-up fa-sm"></i> button to jump!',
    '3': '',
    '4': ''
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
    if (globalScore > 0){
      $bottomSectionImg.hide();
      //check if in top 5, //add score to leaderBoard object
      $bottomSectionText.text('You made it to the Leader Board! Display Leaderboard'); //to update
    }
    //initialise Variables
    level = 2; //initial level
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
    $('div .ennemy').toggleClass('ennemy');
    $('div .mario').removeClass('mario');
    $('div .marioLost').removeClass('marioLost');

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
    //changes bottom section to instructions for next level
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

    //HEADER update global score - updated only when time up and to next level
    globalScore += nbCoins;
    const scoreStr = `0000${globalScore}`;
    $scoreSpan.text(scoreStr.substr(scoreStr.length - 5)); // length is always 5 digit

    //MIDDLE SECTION and BOTTOM SECTION
    $middleSectionText.text(`Time's up! You caught ${nbCoins} coins!`);
    $bottomSectionInstructions.html('');
    $bottomSectionText.html('');
    $marioIntro.hide();
    $arrowButton.hide();

    //After 3 seconds go back to frame 2 for next level
    setTimeout(() => {
      level++;
      if (level > Object.keys(levels).length){
        firstFrame();
      } else secondFrame();//on to next level as time is up and no ennemy caught
    }, 3000);
  }

  //************************* GAME PLAN- LEVEL 1 ******************************

  function level1(){
    //desactivate Mario jumping as not jumping in that level
    $(document).off('keydown', marioJump);
    //set speed for the level and Duration
    const avgIncrTimeOut = 400;
    const rapidIncrTimeOut = 200;
    const gameDuration = 10;
    const possibleTimes = [200, 500, 800, 1000]; //Possible time between each animation
    const possibleElement = [ //repeated coins 2 x as want them to be 2 x more likely than ennemies
      {'speed': avgIncrTimeOut, 'picture': coin, 'class': 'coin'},
      {'speed': avgIncrTimeOut, 'picture': coin, 'class': 'coin'},
      {'speed': rapidIncrTimeOut, 'picture': ennemyMushroom, 'class': 'ennemy'}
    ];

    //Sets Music and image and animate coins, ennemies and bonus for the level
    gamePlan(gameDuration, possibleTimes, possibleElement);
  }

  //*************************GAME PLAN - LEVEL 2 *******************************
  function level2(){
    //set speed for the level and Duration
    const avgIncrTimeOut = 400;
    const rapidIncrTimeOut = 200;
    const gameDuration = 30; //change back to 30 seconds
    const possibleTimes = [200, 500, 800, 1000]; //Possible time between each animation
    //repeated coins 3 x as want them to be 3 x more likely than ennemies as this level and harder due to extra shell rolling on the ground
    const possibleElement = [
      {'speed': avgIncrTimeOut, 'picture': coin, 'class': 'coin'},
      {'speed': avgIncrTimeOut, 'picture': coin, 'class': 'coin'},
      {'speed': avgIncrTimeOut, 'picture': coin, 'class': 'coin'},
      {'speed': rapidIncrTimeOut, 'picture': ennemyMushroom, 'class': 'ennemy'}
    ];
    //slow jumps so Mario has time to avoid rolling shell
    MarioJumpSpeed = 450;

    //add a rolling shell at the very beginning and during the whole duration of the game
    animateElementLeftRight(15, 1, 200, gameDuration * 1000, ennemyTurtle, 'ennemy');
    //add a new life midGame as game is quite hard...
    animateElementDown(4, 12000, 200, lifeMushroom, 'life');
    //Animate coins, ennemies and bonus
    gamePlan(gameDuration, possibleTimes, possibleElement);
  }

  //**************************** LEVEL 3: RANDOM GAME *******************************
  function level3(){
    //set speed for the level and Duration - Spee is higher for the coins now
    const rapidIncrTimeOut = 200;
    const gameDuration = 40;

    const possibleTimes = [100, 500, 800, 1000]; //decreased possible interval between animations
    //Added a new type of ennemy, repeated coins 3 x as want them to be as likely as ennemies
    const possibleElement = [
      {'speed': rapidIncrTimeOut, 'picture': coinFaster, 'class': 'coin'},
      {'speed': rapidIncrTimeOut, 'picture': coinFaster, 'class': 'coin'},
      {'speed': rapidIncrTimeOut, 'picture': coinFaster, 'class': 'coin'},
      {'speed': rapidIncrTimeOut, 'picture': ennemyMushroom, 'class': 'ennemy'},
      {'speed': rapidIncrTimeOut, 'picture': ennemyTurtleFlying, 'class': 'ennemy'},
      {'speed': rapidIncrTimeOut, 'picture': ennemyTurtleFlying, 'class': 'ennemy'}
    ];
    //Mario jump quicker
    MarioJumpSpeed = 200;

    //Animate coins, ennemies and bonus
    gamePlan(gameDuration, possibleTimes, possibleElement);

  }

  //************************************ LEVEL 4 *******************************
  function level4(){
    //set speed for the level and Duration
    const avgIncrTimeOut = 400;
    const rapidIncrTimeOut = 200;
    const gameDuration = 5; //change back to 30 seconds

    const possibleTimes = [100, 500, 800, 1000]; //decrease possible interval a bit
    //Added an extra type of ennemy and we will still have the rolling shell
    const possibleElement = [
      {'speed': avgIncrTimeOut, 'picture': coin, 'class': 'coin'},
      {'speed': avgIncrTimeOut, 'picture': coin, 'class': 'coin'},
      {'speed': avgIncrTimeOut, 'picture': coin, 'class': 'coin'},
      {'speed': rapidIncrTimeOut, 'picture': ennemyMushroom, 'class': 'ennemy'},
      {'speed': rapidIncrTimeOut, 'picture': ennemyTurtleFlying, 'class': 'ennemy'}
    ];

    //slower jump speed as rolling shell on the floor
    MarioJumpSpeed = 450;

    //add a rolling shell at the very beginning and during the whole duration of the game
    animateElementLeftRight(15, 1, 200, gameDuration * 1000, ennemyTurtle, 'ennemy');
    //Animate coins, ennemies and bonus
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
  // src: image to use for the ennemy
  // type: class by type of element (coin / ennemy / bonus)

  function animateElementDown(column, InitialTimeOut, incrTimeOut, src, type){
    //initialise timeout
    let timeOutIncrement = InitialTimeOut;
    //loop to animate element in the different columns down the screen
    for (let i = 0 + column; i < totalNbSquares; i = i + nbColumns){
      //animate element - has to return timeOutIncrement as it keeps being incremented duing animation
      timeOutIncrement = animate(i, timeOutIncrement, incrTimeOut, src, type);
    }
  }

  //***************************** ANIMATE ELEMENT LEFT AND RIGHT *******************************
  // animateElementLeftRight(column, InitialTimeOut, incrTimeOut, srcPicture, class)
  // column: nb of the column where the element falls
  // initialTimeOut: delay before fall
  // incrTimeOut: Timeout beteen each step of animation, the highest the number the slower the animation
  // src: image to use for the ennemy
  // type: class by type of element (coin / ennemy / bonus)

  function animateElementLeftRight(column, InitialTimeOut, incrTimeOut, duration, src, type){
    //initialise timeout
    let timeOutIncrement = InitialTimeOut;
    //Set the element in column 'column'
    let initPosition = rightPos - nbColumns + column;
    //loop to animate element back and forth in the different columns on bottom row
    //Animations goes on until timer is at 0
    while(timeOutIncrement <= duration){
      //PHASE 1 - GO LEFT FROM INITIAL POSITION UNTIL LEFT BORDER
      for (let i = initPosition; i >= leftPos; i--){
        timeOutIncrement = animate(i, timeOutIncrement, incrTimeOut, src, type);
      }
      //PHASE 2 - GO FROM LEFT BORDER TO RIGHT BORDER
      for (let i = leftPos + 1; i <= rightPos; i++){
        timeOutIncrement = animate(i, timeOutIncrement, incrTimeOut, src, type);
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
  // src: image to use for the ennemy
  // type: class by type of element (coin / ennemy / bonus)

  function animate(i, timeOutIncrement, incrTimeOut, src, type){

    let timerIdlocal = 0;
    //animate the element by making it appear in square i and check if hit with Mario
    timerIdlocal = setTimeout(() => {
      //set class 'type' on the div if type not there, then if hit (Mario - ennemy/coin in same div)
      ////if no hit then update div with element image
      if (!$($squares[i]).hasClass(type)) $($squares[i]).addClass(type);
      if (!checkHit(i, timerIdlocal)) $($squares[i]).html(src);
    }, timeOutIncrement);
    timeouts.push(timerIdlocal); //keep tracker of all timeouts as I want to clear all of them at end of game

    //After incrTimeOut make the element disappear
    timeOutIncrement = timeOutIncrement + incrTimeOut;

    //then makes the element disappear in the same square
    timeouts.push(setTimeout(() => {
      //remove class 'type' on the div and check that mario image doesn't get replaced by coin or ennemy
      if ($($squares[i]).hasClass(type)) $($squares[i]).removeClass(type);
      if (!$($squares[i]).hasClass('mario')) $($squares[i]).html('');
    }, timeOutIncrement));

    return timeOutIncrement;
  }

  //************************ CHECKS WETHER COIN/ENNEMY/BONUS HIT*******************

  function checkHit(i, timerIdlocal = 0){

    //if we have Mario and a coin in the same div, it is a hit
    if (($($squares[i]).hasClass('mario') || $($squares[i+nbColumns]).hasClass('mario')) && $($squares[i]).hasClass('coin') && !$($squares[i]).hasClass('hit')) {
      $($squares[i+nbColumns]).addClass('hit'); //add hit on the row below to avoid double counting after a jump
      //stops the animation of the coin - does not stop all the subsequent ones
      clearTimeout(timerIdlocal);
      //removes coin class and add 'caught'- to avoid double counting
      $($squares[i]).removeClass('coin');
      //change audio when mario catches coin
      $eventAudio.attr('src', coinCaught);
      $eventAudio.get(0).play();
      //had to reduce timeOut delay as when coins caught close one after another, no new sound was played
      setTimeout(() => $eventAudio.get(0).pause(), 400);
      //increment nbCoins and update number of coins on screen
      nbCoins++;
      $coinsSpan.text(nbCoins);
      setTimeout(() => {
        $($squares[i+nbColumns]).removeClass('hit');
      }, 400);
      return true;
    }

    //if we have Mario and an ennemy in the same div
    if (($($squares[i]).hasClass('mario') || $($squares[i+nbColumns]).hasClass('mario')) && $($squares[i]).hasClass('ennemy') && !$($squares[i]).hasClass('hit')) {
      $($squares[i+nbColumns]).addClass('hit');
      //stops the animation of the ennemy
      clearTimeout(timerIdlocal);
      //removes ennemy class - to avoid double counting
      $($squares[i]).removeClass('ennemy');
      //call Mario losing function
      MarioLosing();
      return true;
    }

    //if we have Mario and a life mushroom in the same div
    if (($($squares[i]).hasClass('mario') || $($squares[i+nbColumns]).hasClass('mario')) && $($squares[i]).hasClass('life') && !$($squares[i]).hasClass('hit')) {
      $($squares[i+nbColumns]).addClass('hit');
      $($squares[i+nbColumns]).addClass('hit'); //add hit on the row below to avoid double counting after a jump
      //stops the animation of the coin
      clearTimeout(timerIdlocal);
      //removes coin class - to avoid double counting
      $($squares[i]).removeClass('life');
      //change audio when mario catches lifeMushroom
      $eventAudio.attr('src', lifeMushroomcaught);
      $eventAudio.get(0).play();
      setTimeout(() => $eventAudio.get(0).pause(), 1000);
      //increment nblifes
      nbLives++;
      setTimeout(() => {
        $($squares[i+nbColumns]).removeClass('hit');
      }, 400);
      return true;
    }
    return false;
  }

  //************************ WHEN MARIO LOSES **********************************

  function MarioLosing(){
    //clear global Timer, timeout to avoid going to time's up screen and timeout of Mario Jumping
    clearInterval(timerID);
    clearTimeout(timeOutId);
    clearTimeout(timeOutId2); //stops Mario from moving after he is hit by ennemy
    timer = 0; //re-initialise global timer
    //desactivate Mario moving on all keydown
    $(document).off('keydown');

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
    // //removes Mario from initial position and its class - if Mario jumps, delay
    // //the removal of class Mario to make sure he catches coin or hit by ennemy while jumping
    // if (newPos >= leftPos - nbColumns && newPos <= rightPos - nbColumns) {
    //   setTimeout(() => $($squares[marioPos]).removeClass('mario'), 200);
    // } else $($squares[marioPos]).removeClass('mario');
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
      $(document).off('keydown'); //desactivate jump to avoid user jumping even higher
      //set new position and get current Mario image
      newPos = marioPos - nbColumns;
      const currMarioPic = $($squares[marioPos]).html();
      //switches Mario position
      switchMario(currMarioPic, newPos, marioPos);
      marioPos = newPos;
      newPos = marioPos + nbColumns; //back to initial position
      //don't check hit there as double count as a check is done on the coins and ennemy animations
      //checkHit($($squares[marioPos]))

      // Mario lands back on the ground after time MarioJumpSpeed
      timeOutId2 = setTimeout(() => {
        //switches Mario position
        switchMario(currMarioPic, newPos, marioPos);
        marioPos = newPos;
        //check if Mario has caught an element or has been hit on landing
        checkHit($($squares[marioPos]));
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
      checkHit($($squares[marioPos]));
      //Mario going right
    } else if (e.which === 39 && marioPos + 1 <= rightPos){ //right arrow + to avoid going out of screen
      newPos = marioPos + 1;
      //switches Mario position
      switchMario(marioRight, newPos, marioPos);
      marioPos = newPos;
      //checks for a hit !
      checkHit($($squares[marioPos]));
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
