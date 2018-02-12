$(() => {
  console.log('JS Loaded');

  //****************************** Variables **********************************
  //DOM variables
  const $gameBoardContainer = $('.gameBoardContainer');
  const $grid = $('.mainGrid');
  const $sections = $('section');
  const $topSection = $('.topSection');
  const $middleSection= $('.middleSection');
  const $bottomSection= $('.bottomSection');
  const $middleSectionText = $('.middleSection p');
  const $bottomSectionText = $('.bottomSection p');
  const $levelSpan = $('.levelSpan');
  const $coinsSpan = $('.coinsSpan');
  const $scoreSpan = $('.scoreSpan');
  const $marioIntro = $('.marioIntro');
  const $arrowButton = $('.arrowButton');
  const $coin = $('.coin');
  const $timer = $('.timer');
  const $eventAudio = $('.events');
  const $backgroundAudio = $('.backgroundMusic');
  //let keyDown = {};

  //Initial variables for game
  let timer = 0;
  let timerID = 0;
  let timeOutId = 0;
  let timeOutId2 = 0;
  let level = 1; //initial level
  let nbLives = 3; //initial number of lives
  const nbColumns = 19;
  const nbRows = 8;
  let nbCoins = 0; //initial number of coins
  let timeouts = []; //will store all timeouts
  let globalScore = 0;
  let leaderBoard = {};

  //images and audio for Mario, ennemies and bonuses
  const coin = '<img class="coin" src="/images/coin.png" alt="coin">';
  const ennemyMushroom = '<img class="ennemy" src="/images/ennemyMushroom.png" alt="ennemy">';
  const marioRight = '<img class="mario" src="/images/littleMarioRight.png" alt="mario">';
  const marioLeft = '<img class="mario" src="/images/littleMarioLeft.png" alt="mario">';
  const marioLosing = '<img class="marioLost" src="/images/marioLosing.png" alt="mario">';
  const marioLosingSound = '/sounds/marioLosing.wav';
  const coinCaught = '/sounds/marioCoinSound.mp3';
  const gameOver = '/sounds/gameOver.wav';
  const level1Sound = '/sounds/Level1.wav';

  //instructions per level
  const instructions = {
    'Level 1': 'Marioooo, try to catch as many <img src="/images/coin-small.png" alt=" coins "> as possible while avoiding the <img src="/images/ennemyMushroom-small.png" alt=" ennemies ">',
    'Level 2': 'Congratulations on finishing Level 1. Now let\'s try to ....'
  }

  //calculates total number of squares in grid
  const totalNbSquares = nbColumns * nbRows;
  //calculates the max left position and right position for Mario
  const leftPos = totalNbSquares - nbColumns; // to calculate depending on grid size
  const rightPos = totalNbSquares - 1; // to calculate depending on grid size

  //mario initial location
  const initialPos = totalNbSquares - nbColumns + 3 ; //Mario initial position on all screens
  let marioPos = initialPos;

  //TO DO
  //make site responsive for ipad

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

  //displays 1st frame
  function firstFrame(){
    //activate middle section click
    $middleSection.on('click',secondFrame);
    //make the grid disappear
    $grid.hide();
    //initiliase content
    $topSection.text('Welcome to Mario Coin Quest!');
    $middleSectionText.text('1 Player Game');
    if (globalScore > 0){
      //check if in top 5, //add score to leaderBoard object
      $bottomSectionText.text('You made it to the Leader Board! Display Leaderboard'); //to update
    }
    //initialise Variables
    level = 1; //initial level
    globalScore = 0;
    nbLives = 3; //initial number of live
    timeouts = [];
    $sections.show();
  }

  //displays second frame
  function secondFrame(){
    //remove background picture
    $gameBoardContainer.css({
      backgroundImage: 'none'
    });

    //clear all pictures from the grid
    $($squares).html('');

    //reset classes
    $('div .coin').toggleClass('coin');
    $('div .ennemy').toggleClass('ennemy');
    $('div .mario').removeClass('mario');
    $('div .marioLost').removeClass('marioLost');
    //$('div .marioJumping').removeClass('marioJumping');

    //desactivate on click event for middle sections
    $middleSection.off('click',secondFrame);

    //update Global score - already done in
    const scoreStr = `0000${globalScore}`;
    $scoreSpan.text(scoreStr.substr(scoreStr.length - 5)); // length is alwaus 5 digit

    //initialise number of coins and reset coin display
    nbCoins = 0;
    $coinsSpan.text(nbCoins);

    //hide grid and show all sections
    $grid.hide();
    $sections.show();
    //changes top section and score bar to Level X
    $levelSpan.text(level);
    $topSection.text(`Level ${level}`);
    //changes middle section to Level number of life and add Mario pic

    if (nbLives > 0){
      $middleSectionText.text(`   X   ${nbLives}`);
      $marioIntro.show();
      //changes bottom section to instructions for next level
      $bottomSectionText.html('Marioooo, try to catch as many <img src="/images/coin-small.png" alt=" coins "> as possible and avoid the <img src="/images/ennemyMushroom-small.png" alt=" ennemies ">');
      $arrowButton.show();
    } else { //Game Over
      //change audio
      $backgroundAudio.get(0).pause();
      $backgroundAudio.attr('src', gameOver);
      $backgroundAudio.get(0).play();
      //Change display
      $marioIntro.hide();
      $middleSectionText.text('GAME OVER');
      $bottomSectionText.html('');
      $arrowButton.hide();
      setTimeout(() => {
        firstFrame();
      }, 3000);
    }
  }

  //Frame to start game
  function gameStart(){
    //Show the grid
    $grid.show();
    //show global score
    const scoreStr = `0000${globalScore}`;
    $scoreSpan.text(scoreStr.substr(scoreStr.length - 5)); // length is always 5 digit

    //hide the $sections
    $sections.hide();
    //position Mario on the grid always on 3rd square to the left and looks to the right
    marioPos = initialPos;
    $($squares[marioPos]).html(marioRight);
    $($squares[marioPos]).addClass('mario');

    $(document).off('keydown'); // to make sure all keydown events are off before creating new ones - This is also done in another fucntion but apparently setting some events off() are not seen globally!!
    //reactivate Mario moving on keydown
    $(document).on('keydown', animateMario); //Mario going left, right and up
    $(document).on('keydown', marioJump); //Mario jumping
    //start level 1
    level1();
  }

  //*************************GAME PLAN - LEVEL 1 *******************************

  function level1(){
    //set speed for the level - Duration 60 second so 6000 ms
    const avgIncrTimeOut = 400;
    const rapidIncrTimeOut = 200;
    //change background picture for that level
    $gameBoardContainer.css({
      backgroundImage: 'url(/images/backgroundLevel1.png)',
      backgroundSize: 'contain'
    });

    //Set Music for Level 1
    $backgroundAudio.attr('src', level1Sound);
    $backgroundAudio.get(0).play();

    // Timer for level 1
    const initialTime = 30;
    timer = initialTime;

    timerID = setInterval(() => {
      if (timer >= 0){
        $timer.text(`Time:${timer--}`);
      }
    }, 1000);

    //stops the timer after initialTime seconds
    timeOutId = setTimeout(() => {
      clearInterval(timerID);
      timeUpFrame();
    }, (initialTime + 2) * 1000);

    //animateElement(column, InitialTimeOut, incrTimeOut, src)
    // column: nb of the column where the element falls
    // initialTimeOut: delay before fall
    // incrTimeOut: Timeout beteen each step of animation, the highest the number the slower the animation
    // src: which ennemy, which gives image to use

    //Animate coins, ennemies and bonus
    animateElement(0, 200, avgIncrTimeOut, coin, 'coin');
    animateElement(6, 1000, avgIncrTimeOut, coin, 'coin');
    animateElement(5, 2000, rapidIncrTimeOut, ennemyMushroom, 'ennemy');
    animateElement(9, 3000, avgIncrTimeOut, coin, 'coin');
    animateElement(13, 4000, avgIncrTimeOut, coin, 'coin');
    animateElement(6, 5000, avgIncrTimeOut, coin, 'coin');
    animateElement(9, 6000, rapidIncrTimeOut, ennemyMushroom, 'ennemy');
    animateElement(15, 7000, avgIncrTimeOut, coin, 'coin');
    animateElement(11, 8000, avgIncrTimeOut, coin, 'coin');
    animateElement(3, 9000, avgIncrTimeOut, coin, 'coin');
    animateElement(7, 9000, rapidIncrTimeOut, ennemyMushroom, 'ennemy');
    animateElement(17, 10000, avgIncrTimeOut, coin, 'coin');
    animateElement(12, 12000, avgIncrTimeOut, coin, 'coin');
    animateElement(15, 12000, rapidIncrTimeOut, ennemyMushroom, 'ennemy');
    animateElement(3, 13000, avgIncrTimeOut, coin, 'coin');
    animateElement(19, 14000, avgIncrTimeOut, coin, 'coin');
    animateElement(10, 15000, avgIncrTimeOut, coin, 'coin');
    animateElement(18, 15000, avgIncrTimeOut, coin, 'coin');
    animateElement(15, 12000, rapidIncrTimeOut, ennemyMushroom, 'ennemy');
    animateElement(4, 16000, avgIncrTimeOut, coin, 'coin');
    animateElement(8, 17000, avgIncrTimeOut, coin, 'coin');
    animateElement(19, 18000, avgIncrTimeOut, coin, 'coin');
    animateElement(9, 19000, avgIncrTimeOut, coin, 'coin');
    animateElement(15, 20000, rapidIncrTimeOut, ennemyMushroom, 'ennemy');
    animateElement(9, 21000, rapidIncrTimeOut, ennemyMushroom, 'ennemy');
    animateElement(4, 21000, avgIncrTimeOut, coin, 'coin');
    animateElement(12, 22000, avgIncrTimeOut, coin, 'coin');
    animateElement(16, 23000, avgIncrTimeOut, coin, 'coin');
    animateElement(8, 24000, avgIncrTimeOut, coin, 'coin');
    animateElement(7, 26000, rapidIncrTimeOut, ennemyMushroom, 'ennemy');
    animateElement(17, 26000, avgIncrTimeOut, coin, 'coin');
    animateElement(11, 27000, avgIncrTimeOut, coin, 'coin');
    animateElement(19, 27000, avgIncrTimeOut, coin, 'coin');
    animateElement(0, 28000, avgIncrTimeOut, coin, 'coin');
    animateElement(5, 28000, avgIncrTimeOut, coin, 'coin');
    animateElement(8, 29000, rapidIncrTimeOut, ennemyMushroom, 'ennemy');
    animateElement(12, 29000, avgIncrTimeOut, coin, 'coin');
    animateElement(15, 30000, avgIncrTimeOut, coin, 'coin');
  }


  function animateElement(column, InitialTimeOut, incrTimeOut, src, type){
    let timerIdlocal = 0;
    //initialise timeout
    let timeOutIncrement = InitialTimeOut;

    //loop to animate coin in the different columns
    for (let i = 0 + column; i < totalNbSquares; i = i + nbColumns){
      //animate the element by making it appear in square i and check if hit with Mario
      timerIdlocal = setTimeout(() => {
        //set class 'type' on the div if type not there
        if (!$($squares[i]).hasClass(type)) $($squares[i]).addClass(type); //toggleClass did not work properly
        //check for a hit (Mario - ennemy/coin in same div) - only in the 2 bottom nbRows
        if (checkHit($($squares[i]), timerIdlocal) === false){
          $($squares[i]).html(src); //if no hit then update div with element
        }
      }, timeOutIncrement);
      timeouts.push(timerIdlocal);

      timeOutIncrement = timeOutIncrement + incrTimeOut;
      //then make the element disappear
      timeouts.push(setTimeout(() => {
        //remove class 'type' on the div
        if ($($squares[i]).hasClass(type)) $($squares[i]).removeClass(type); //toggleClass did not work properly
        //check that mario doesn't get replaced by coin or ennemy
        if ($($squares[i]).hasClass('mario') === false) {
          //only delete element image if mario is not in the div, otherwise would delete mario
          $($squares[i]).html('');
        }
      }, timeOutIncrement));
    }
  }

  function checkHit($sq, timerIdlocal = 0){
    //if we have Mario and a coin in the same div -
    //PROBLEM with JUMPING as check for a hit when jumping and here as part of the coin/ennemy animation so coin //might be counted twice or Marion considered as hit twice by ennemy so loses 2 lives
    if ($sq.hasClass('mario') === true && $sq.hasClass('coin') === true){
      //kills the animation of the coin or ennemy
      clearTimeout(timerIdlocal);
      //change audio when mario catches coin
      $eventAudio.attr('src', coinCaught);
      $eventAudio.get(0).play();
      setTimeout(() => $eventAudio.get(0).pause(), 500); //had to reduce as when coins caught close one after another, no new sound was played
      //increment nbCoins and update number of coins on screen
      nbCoins++;
      $coinsSpan.text(nbCoins);
      return true;
    }
    //if we have Mario and a coin in the same div - I keep the case where Mario is jumping as I want to test both on Mario jumping and on the ennemy animation if a match
    if ($sq.hasClass('mario') === true && $sq.hasClass('ennemy') === true) {
      //kills the animation
      clearTimeout(timerIdlocal);
      //call Mario losing function
      MarioLosing();
      return true;
    }
    return false;
  }

  function MarioLosing(){
    //clear global Timer
    clearInterval(timerID);
    //clear timeout to avoid going to time's up screen
    clearTimeout(timeOutId);
    //cleat timeout of Mario jumping
    clearTimeout(timeOutId2);
    timer = 0; //re-initialise global timer
    //desactivate Mario moving on all keydown
    $(document).off('keydown');
    //clear all timeouts (animation) in the game to stop them
    for (let i = 0; i < timeouts.length; i++) {
      clearTimeout(timeouts[i]);
    }
    //make losing Marion jump up and then all the way down beyond game bottom edge -see css animation
    $($squares[marioPos]).html(marioLosing);
    //stop playing level Music
    $backgroundAudio.get(0).pause();
    //change audio
    $eventAudio.attr('src', marioLosingSound);
    $eventAudio.get(0).play();
    //decrement nb of lives
    nbLives--;

    setTimeout(() => {
      secondFrame();
    }, 3000); //wait for the 3sec mario animation to finish
  }

  function timeUpFrame(){
    //stop playing level Music
    $backgroundAudio.get(0).pause();
    //
    $grid.hide();
    $sections.show();
    //remove background picture
    $gameBoardContainer.css({
      backgroundImage: 'none'
    });

    //removes event keydown on Mario to prevent Mario from moving
    $(document).off('keydown');

    $middleSectionText.text(`Time's up! You caught ${nbCoins} coins!`); //how to make appear as a box on top of grid?
    $bottomSectionText.html('');
    $marioIntro.hide();
    $arrowButton.hide();
    level++; //on to next level as time is up and no ennemy caught

    //update global score - updated only when time up and to next level
    globalScore += nbCoins;
    const scoreStr = `000${globalScore}`;
    $scoreSpan.text(scoreStr.substr(scoreStr.length - 5)); // length is always 5 digit

    setTimeout(() => {
      secondFrame();
    }, 3000);
  }

  function marioJump(e) {
    let newPos = 0;
    //************************* Mario jumping ************************************************
    if(e.which === 38){
      $(document).off('keydown'); //desactivate jump to avoid user jumping even higher
      //38 is upArrow to make mario jump up
      newPos = marioPos - nbColumns;
      //get current Mario image
      const currMarioPic = $($squares[marioPos]).html();
      //removes Mario from initial position
      $($squares[marioPos]).html('');
      $($squares[marioPos]).removeClass('mario'); //toggle mario class on div
      // adds Mario in new position up a div and toggle mario class
      $($squares[newPos]).html(currMarioPic);
      $($squares[newPos]).addClass('mario');
      //$($squares[newPos]).addClass('marioJumping');
      marioPos = newPos; //jumping position
      //if (checkHit($($squares[marioPos]))) console.log('It is a hit');// don;t check there as double count of coin

      newPos = marioPos + nbColumns; //back to initial position

      //removes Mario from jump position
      timeOutId2 = setTimeout(() => {
        $($squares[marioPos]).html('');
        $($squares[marioPos]).removeClass('mario'); //toggle mario class on div
        //$($squares[marioPos]).removeClass('marioJumping');
        // Mario back to initial position before jumping
        $($squares[newPos]).html(currMarioPic);
        $($squares[newPos]).addClass('mario');
        marioPos = newPos;
        if (checkHit($($squares[marioPos]))) console.log('It is a hit');

        //reactivate Mario moving on keydown
        $(document).on('keydown', animateMario); //Mario going left, right and up
        $(document).on('keydown', marioJump); //Mario jumping
      },300);
    }
  }

  function animateMario(e) {
    let newPos = 0;
    //**** Mario going left ***************
    if(e.which === 37 && marioPos - 1 >= leftPos){ //left arrow
      newPos = marioPos - 1;
      //remove Mario from initial position
      $($squares[marioPos]).html('');
      $($squares[marioPos]).removeClass('mario'); //toggle mario class on div
      //add Mario in new position and toggle mario class
      $($squares[newPos]).html(marioLeft);
      $($squares[newPos]).addClass('mario');
      marioPos = newPos;
      if (checkHit($($squares[marioPos]))) console.log('It is a hit');
      //**** Mario going right ***************
    } else if (e.which === 39 && marioPos + 1 <= rightPos){ //right arrow + to avoid going out of screen
      newPos = marioPos + 1;
      //remove Mario from initial position
      $($squares[marioPos]).html('');
      $($squares[marioPos]).removeClass('mario'); //toggle mario class on div
      //set Mario in new position and toggle mario class
      $($squares[newPos]).html(marioRight);
      $($squares[newPos]).addClass('mario');
      marioPos = newPos;
      if (checkHit($($squares[marioPos]))) console.log('It is a hit');
    }
  }


  //****************LINK FUNCTIONS WITH DOM ELEMENTS***********************

  //$middleSection.on('click',secondFrame);
  $arrowButton.on('click',gameStart); //When I do this in a function like frame 1 or frame 2, several events are created aafter a gameover and do not get cleared properly and as a result several gamestart and I get several timers that intereact with each other!!
  //moved key event in game start function as it needs to be turned on evertytime we start a new game as it gets turned off() when Mario gets hit
  //$(document).on('keydown', animateMario); //Mario going left, right and up event

  //Call function to initialise first screen
  gridInit();
  //activate button "let's play"
  const $squares = $('.square'); //Is it ok to declare here? as if I declare with other variables the grid is not initialised
  firstFrame();
  //gameStart();
  //Level1();


});
