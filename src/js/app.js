$(() => {
  console.log('JS Loaded');

  //****************************** Variables **********************************
  //DOM variables
  const $grid = $('.mainGrid');
  const $sections = $('section');
  const $topSection = $('.topSection');
  const $middleSection= $('.middleSection');
  const $bottomSection= $('.bottomSection');
  const $middleSectionText = $('.middleSection p');
  const $bottomSectionText = $('.bottomSection p');
  const $coinsSpan = $('.coinsSpan');
  const $scoreSpan = $('.scoreSpan');
  const $marioIntro = $('.marioIntro');
  const $goButton = $('.goButton');
  const $coin = $('.coin');

  //Initial variables for game
  let level = 1; //initial level
  let nbLives = 3; //initial number of lives
  const nbColumns = 19;
  const nbRows = 8;
  let marioPos = 136; //Mario initial position on all screens
  let nbCoins = 0; //initial number of coins
  var timeouts = []; //will store all timeouts

  //assets for Marion, ennemies and bonuses
  const coin = '<img class="coin" src="/images/coin.png" alt="coin">';
  const ennemyMushroom = '<img class="ennemy" src="/images/ennemyMushroom.png" alt="ennemy">';
  const mario = '<img class="mario" src="/images/littleMario.png" alt="mario">';
  const marioLosing = '<img class="marioLost" src="/images/marioLosing.png" alt="mario">';

  //calculates total number of squares in grid
  const totalNbSquares = nbColumns * nbRows;
  //calculates the max left position and right position for Mario
  const leftPos = totalNbSquares - nbColumns; // to calculate depending on grid size
  const rightPos = nbColumns * nbRows; // to calculate depending on grid size

  //TO DO
  //make site responsive for ipad

  //*********************************FUNCTIONS*********************************
  //grid initialisation
  function gridInit(){
    for (let i = 0; i < nbColumns; i++){
      for (let j = 0; j < nbRows; j++){
        $grid.append($('<div></div>').addClass('square'));
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
    $bottomSectionText.text('Leaderboard');
    //initialise Variables
    level = 1; //initial level
    nbLives = 3; //initial number of lives
    nbCoins = 0; //initial number of coins
    timeouts = []; 
    //show all sections
    $sections.show();
  }

  //displays second frame
  function secondFrame(){
    $grid.hide();
    $sections.show();
    //changes top section to Level X
    $topSection.text(`Level ${level}`);
    //changes middle section to Level number of life and add Mario pic

    if (nbLives > 0){
      $middleSectionText.text(`   X   ${nbLives}`);
      $marioIntro.show();
      //changes bottom section to instruction
      $bottomSectionText.html('Marioooo, try to catch as many <img src="/images/coin-small.png" alt=" coins "> as possible and avoid the <img src="/images/ennemyMushroom-small.png" alt=" ennemies ">');
      $goButton.show();
    } else {
      $middleSectionText.text('GAME OVER');
      $bottomSectionText.html('');
      $goButton.hide();
      setTimeout(() => {
        firstFrame();
      }, 2000);
    }
  }

  //Frame to start game
  function gameStart(){
    //Show the grid
    $grid.show();
    //hide the $sections
    $sections.hide();
    //start level 1
    level1();
  }

  //GAME PLAN LEVEL 1
  //Each element is animated as follow:
  //animateElement(column, InitialTimeOut, incrTimeOut, src)
  // column: nb of the column where the element falls
  // initialTimeOut: delay before fall
  // incrTimeOut: Timeout beteen each step of animation, the highest the number the slower the animation
  // src: which ennemy, which gives image to use

  function level1(){
    //set speed for the level - Duration 60 second so 6000 ms
    const avgIncrTimeOut = 400;
    const rapidIncrTimeOut = 200;
    //change background picture
    // ------------> still to do
    //set Mario on 3rd square on the left
    $($squares[marioPos]).html(mario);
    $($squares[marioPos]).toggleClass('mario');
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
    //to continue until 60 seconds
    //animateElement(6, 60000, averageSpeed, coin);
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
        if (checkHit($($squares[i])) !== true){//if no win/lose then update div with element
          $($squares[i]).html(src);
        }
      }, timeOutIncrement));

      timeOutIncrement = timeOutIncrement + incrTimeOut;
      timeouts.push(setTimeout(() => {
        if ($($squares[i]).hasClass('mario') !== true){
          //do not not delete element image if mario is in the div
          $($squares[i]).html('');
        }
        //in any case toggle class 'type' on the div
        $($squares[i]).toggleClass(type);
      }, timeOutIncrement));
    }
  }

  function checkHit($sq){
    let score = 0;
    //if we have Mario and a coin in the same div
    if ($sq.hasClass('mario') === true && $sq.hasClass('coin') === true){
      //increment nbCoins and update number of coins on screen
      nbCoins++;
      $coinsSpan.text(nbCoins);
      score = `000${nbCoins * 100}`;
      $scoreSpan.text(score.substr(score.length - 5)); // to make sure length is alwasy 5 digit
      return true;
    }
    if ($sq.hasClass('mario') === true && $sq.hasClass('ennemy') === true) {
      //if we have Mario and an ennemy in the same div, decrease life and go back to frame 2
      nbLives--;
      //clear all timeouts in the game to stop it
      for (let i = 0; i < timeouts.length; i++) {
        clearTimeout(timeouts[i]);
      }
      // Mario losing scenario: animates Mario and reinitilaise game
      MarioLosing();
      return true;
    }
  }

  function MarioLosing(){
    //change picture
    $($squares[marioPos]).html(marioLosing);
    //make losing Marion jump up and then all the way down beyond game bottom edge
    //see css animation

    setTimeout(() => {
      $($squares).html(''); //clear all animated elements from the grid
      //toggle the element classes
      $('.coin').toggleClass('coin');
      $('.ennemy').toggleClass('ennemy');
      $('.mario').toggleClass('mario');
      secondFrame(); //and go back to frame2
    }, 3000); //wait for the mario animation to finish

  }

  function animateMarioLeftRight(e) {
    if(e.which === 37){ //left arrow
      const newPos = Math.max(marioPos - 1, leftPos); // to avoid going out of screen
      //remove Mario from initial position
      $($squares[marioPos]).html('');
      $($squares[marioPos]).toggleClass('mario'); //toggle mario class on div
      //set MArio in new position and toggle mario class
      $($squares[newPos]).html(mario);
      $($squares[newPos]).toggleClass('mario');
      marioPos = newPos;
    } else if (e.which === 39){ //right arrow
      const newPos = Math.min(marioPos + 1, rightPos); // to avoid going out of screen
      //remove Mario from initial position
      $($squares[marioPos]).html('');
      $($squares[marioPos]).toggleClass('mario'); //toggle mario class on div
      //set Mario in new position and toggle mario class
      $($squares[newPos]).html(mario);
      $($squares[newPos]).toggleClass('mario');
      marioPos = newPos;
    }
  }

  // function checkGameOver(){
  //   if(nbLives === 0){
  //
  //     }
  //   }
  // }

  //***********************LINK FUNCTIONS WITH DOM ELEMENTS*****************************

  $middleSection.on('click',secondFrame);
  $goButton.on('click',gameStart);
  $(document).on('keydown', animateMarioLeftRight); //Mario going left and right event


  //Call function to initialise first screen
  gridInit();
  const $squares = $('.square'); //Is it ok to declare here? as if I declare with other variables the grid is not initialised
  firstFrame();
  //gameStart();
  //Level1();


});
