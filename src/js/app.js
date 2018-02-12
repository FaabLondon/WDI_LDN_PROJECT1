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

  //Initial variables for game
  let timer = 0;
  let timerID = 0;
  let timeOutId = 0;
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
  const level1Sound = 'Level1.wav';

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
    for (let i = 0; i < nbColumns; i++){
      for (let j = 0; j < nbRows; j++){
        $grid.append($('<div></div>').addClass(`square ${i} ${j}`));
      }
    }
  }

  //displays 1st frame
  function firstFrame(){
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
    //show all sections
    $sections.show();
  }

  //displays second frame
  function secondFrame(){
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
    } else {
      //change audio
      $eventAudio.attr('src', gameOver);
      $eventAudio.get(0).play();
      //Change display
      $marioIntro.hide();
      $middleSectionText.text('GAME OVER');
      $bottomSectionText.html('');
      $arrowButton.hide();
      setTimeout(() => {
        firstFrame();
      }, 5000);
    }
  }

  //Frame to start game
  function gameStart(){
    //clear all pictures from the grid
    $($squares).html('');
    //Show the grid
    $grid.show();
    //show global score
    const scoreStr = `0000${globalScore}`;
    $scoreSpan.text(scoreStr.substr(scoreStr.length - 5)); // length is always 5 digit

    //hide the $sections
    $sections.hide();
    //position Mario on the grid always on 3rd square to the left
    $($squares[initialPos]).html(marioRight);
    $($squares[initialPos]).addClass('mario');
    marioPos = initialPos;
    //reactivate Mario moving on keydown
    $(document).on('keydown', animateMarioLeftRight); //Mario going left and right event
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
    $eventAudio.attr('src', level1Sound);
    $eventAudio.get(0).play();

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
    //initialise timeout
    let timeOutIncrement = InitialTimeOut;
    //loop to animate coin in the column
    for (let i = 0 + column; i < totalNbSquares; i = i + nbColumns){
      //animate the element by making it appear and disappear from 1 square to the other
      timeouts.push(setTimeout(() => {
        //set class 'type' on the div
        $($squares[i]).toggleClass(type);
        //check for a hit (Mario or ennemy in the same div)
        if (checkHit($($squares[i])) !== true){//if no hit then update div with element
          $($squares[i]).html(src);
        }
      }, timeOutIncrement));

      timeOutIncrement = timeOutIncrement + incrTimeOut;
      timeouts.push(setTimeout(() => {
        //remove class 'type' on the div
        $($squares[i]).toggleClass(type);
        if ($($squares[i]).hasClass('mario') !== true){
          //only delete element image if mario is not the div
          $($squares[i]).html('');
        }

      }, timeOutIncrement));
    }
  }

  function checkHit($sq){
    //if we have Mario and a coin in the same div
    if ($sq.hasClass('mario') === true && $sq.hasClass('coin') === true){
      //change audio when mario catches coin
      $eventAudio.attr('src', coinCaught);
      $eventAudio.get(0).play();
      setTimeout(() => $eventAudio.get(0).pause(), 500); //had to reduce as when coins caught close one after another, no new sound was played
      //increment nbCoins and update number of coins on screen
      nbCoins++;
      $coinsSpan.text(nbCoins);
      return true;
    }
    if ($sq.hasClass('mario') === true && $sq.hasClass('ennemy') === true) {
      MarioLosing();
      return true;
    }
  }

  function timeUpFrame(){
    $grid.hide();
    $sections.show();
    //remove background picture
    $gameBoardContainer.css({
      backgroundImage: 'none'
    });
    //remove Mario class - no need to remove the other elements as animations lapsed
    $('div .mario').removeClass('mario');
    //removes event keydown on Mario to prevent Mario from moving
    $(document).off('keydown');

    $middleSectionText.text(`Time's up! You caught ${nbCoins} coins! Well done!`); //how to make appear as a box on top of grid?
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

  function MarioLosing(){
    //clear Timer
    clearInterval(timerID);
    //clear timeout to avoid going to time's up screen
    clearTimeout(timeOutId);
    //desactivate Mario moving
    $(document).off('keydown');

    //clear all timeouts (animation) in the game to stop them
    for (let i = 0; i < timeouts.length; i++) {
      clearTimeout(timeouts[i]);
    }

    //make losing Marion jump up and then all the way down beyond game bottom edge -see css animation
    $($squares[marioPos]).html(marioLosing);

    //change audio
    $eventAudio.attr('src', marioLosingSound);
    $eventAudio.get(0).play();

    //decrement nb of lives
    nbLives--;

    setTimeout(() => {
      $('div .coin').toggleClass('coin');
      $('div .ennemy').toggleClass('ennemy');
      $('div .mario').removeClass('marioLost');
      $('div .mario').removeClass('mario');

      //remove background picture
      $gameBoardContainer.css({
        backgroundImage: 'none'
      });
      secondFrame(); //and go back to frame2
    }, 3000); //wait for the mario animation to finish

  }

  function animateMarioLeftRight(e) {
    //Note: I set a delay of 100ms before change in images
    if(e.which === 37){ //left arrow
      const newPos = Math.max(marioPos - 1, leftPos); // to avoid going out of screen
      //remove Mario from initial position
      $($squares[marioPos]).html('');
      $($squares[marioPos]).removeClass('mario'); //toggle mario class on div
      //add Mario in new position and toggle mario class
      $($squares[newPos]).html(marioLeft);
      $($squares[newPos]).addClass('mario');
      marioPos = newPos;
    } else if (e.which === 39){ //right arrow
      const newPos = Math.min(marioPos + 1, rightPos); // to avoid going out of screen
      //remove Mario from initial position
      $($squares[marioPos]).html('');
      $($squares[marioPos]).removeClass('mario'); //toggle mario class on div
      //set Mario in new position and toggle mario class
      $($squares[newPos]).html(marioRight);
      $($squares[newPos]).addClass('mario');
      marioPos = newPos;
    }
  }


  //****************LINK FUNCTIONS WITH DOM ELEMENTS***********************

  $middleSection.on('click',secondFrame);
  $arrowButton.on('click',gameStart);
  //moved key event in game start function as it needs to be turned on evertytime we start a new game as it gets turned off() when Mario gets hit
  //$(document).on('keydown', animateMarioLeftRight); //Mario going left and right event

  //Call function to initialise first screen
  gridInit();
  const $squares = $('.square'); //Is it ok to declare here? as if I declare with other variables the grid is not initialised
  firstFrame();
  //gameStart();
  //Level1();


});
