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
  const $marioIntro = $('.marioIntro');
  const $goButton = $('.goButton');
  const $coin = $('.coin');

  //Initial variables for game
  let level = 1; //initial level
  let nbLives = 3; //initial number of lives
  let nbColumns = 19;
  let nbRows = 8;
  let marioPos = 136; //Mario initial position on all screens
  let nbCoins = 0; //initial number of coins

  //assets for Marion, ennemies and bonuses
  let coin = '<img class="coin" src="/images/coin.png" alt="coin">';
  let ennemyMushroom = '<img class="ennemy" src="/images/ennemyMushroom.png" alt="ennemy">';
  let mario = '<img class="mario" src="/images/littleMario.png" alt="mario">';

  //calculates total number of squares in grid
  let totalNbSquares = nbColumns * nbRows;
  //calculates the max left position and right position for Mario
  let leftPos = totalNbSquares - nbColumns; // to calculate depending on grid size
  let rightPos = nbColumns * nbRows; // to calculate depending on grid size

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
    //show all sections
    $sections.show();
  }

  //displays second frame
  function secondFrame(){
    //changes top section to Level X
    $topSection.text(`Level ${level}`);
    //changes middle section to Level number of life and add Mario pic
    $middleSectionText.text(`   X   ${nbLives}`);
    $marioIntro.show();
    //changes bottom section to instruction
    $bottomSectionText.html('Marioooo, try to catch as many <img src="/images/coin-small.png" alt=" coins "> as possible and avoid the <img src="/images/ennemyMushroom-small.png" alt=" ennemies ">');
    $goButton.show();
  }

  //Frame to start game
  function gameStart(){
    //Show the grid
    $grid.show();
    //hide the $sections
    $sections.hide();
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
      //if Mario is in a specific square, no animation
      setTimeout(() => {
        //set class 'type' on the div
        $($squares[i]).toggleClass(type);
        //check for a win
        if ($($squares[i]).hasClass('mario') === true){
          //increment nbCoins and update number of coins on screen
          nbCoins++;
          $coinsSpan.text(parseInt($coinsSpan.text()) + 1);
        } else { //do not show element image if mario is in the div
          $($squares[i]).html(src);
        }
      }, timeOutIncrement);
      timeOutIncrement = timeOutIncrement + incrTimeOut;
      setTimeout(() => {
        if ($($squares[i]).hasClass('mario') !== true){
          //do not show element image if mario is in the div
          $($squares[i]).html('');
        }
        //in any case toggle class 'type' on the div
        $($squares[i]).toggleClass(type);
      }, timeOutIncrement);
    }
  }

  //***********************LINK FUNCTIONS WITH DOM ELEMENTS*******************************

  $middleSection.on('click',secondFrame);
  $goButton.on('click',gameStart);

  //Mario going left and right event
  $(document).on('keydown', function(e) {
    if(e.which === 37){ //left arrow
      let newPos = Math.max(marioPos - 1, leftPos); // to avoid going out of screen
      //remove Mario from initial position
      $($squares[marioPos]).html('');
      $($squares[marioPos]).toggleClass('mario'); //toggle mario class on div
      //set MArio in new position and toggle mario class
      $($squares[newPos]).html(mario);
      $($squares[newPos]).toggleClass('mario');
      marioPos = newPos;
    }
    else if (e.which === 39){ //right arrow
      let newPos = Math.min(marioPos + 1, rightPos); // to avoid going out of screen
      //remove Mario from initial position
      $($squares[marioPos]).html('');
      $($squares[marioPos]).toggleClass('mario'); //toggle mario class on div
      //set Mario in new position and toggle mario class
      $($squares[newPos]).html(mario);
      $($squares[newPos]).toggleClass('mario');
      marioPos = newPos;
    }
  });

  //Call function to initialise first screen
  gridInit();
  const $squares = $('.square'); //Is it ok to declare here? as if I declare with other variables the grid is not initialised
  firstFrame();
  //gameStart();
  //Level1();


});
