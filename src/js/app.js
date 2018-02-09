$(() => {
  console.log('JS Loaded');

  //Global Variables
  const $grid = $('.mainGrid');
  const $squares = $('.square');
  const $sections = $('section');
  const $topSection = $('.topSection');
  const $middleSection= $('.middleSection');
  const $bottomSection= $('.bottomSection');
  const $middleSectionText = $('.middleSection p');
  const $bottomSectionText = $('.bottomSection p');
  const $marioIntro = $('.marioIntro');
  const $goButton = $('.goButton');
  const $coin = $('.coin');
  let level = 1;
  let nbLives = 3;
  //nb of squares = 152; 19 columns * 8 rows
  let nbColumns = 19;
  let nbRows = 8;
  let totalNbSquares = nbColumns * nbRows;
  let coin = '<img class="coin" src="/images/coin.png" alt="coin">';
  let ennemyMushroom = '<img class="ennemy" src="/images/ennemyMushroom.png" alt="ennemy">';


  //TO DO
  //make site responsive for ipad
  //Function to generate grid

  //FUNCTIONS
  //displays 1st frame
  function firstFrame(){
    //make the grid disappear
    $grid.hide();
    //show all sections
    $sections.show();
  }

  //displays second frame
  function secondFrame(e){
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
  }


  //MARIOOO

  //GAME PLAN LEVEL 1
  //Each element is animated as follow:
  //animateElement(column, InitialTimeOut, incrTimeOut, src)
  // column: nb of the column where the element falls
  // initialTimeOut: delay before fall
  // incrTimeOut: Timeout beteen each step of animation, the highest the number the slower the animation
  // src: which ennemy, which gives image to use

  function Level1(){
    //Duration 60 second so 6000 ms
    //change background picture
    // ------------> still to do
    let avgIncrTimeOut = 400;
    let rapidIncrTimeOut = 200;
    animateElement(0, 200, avgIncrTimeOut, coin);
    animateElement(6, 1000, avgIncrTimeOut, coin);
    animateElement(5, 2000, rapidIncrTimeOut, ennemyMushroom);
    animateElement(9, 3000, avgIncrTimeOut, coin);
    animateElement(13, 4000, avgIncrTimeOut, coin);
    animateElement(6, 5000, avgIncrTimeOut, coin);
    animateElement(9, 6000, rapidIncrTimeOut, ennemyMushroom);
    animateElement(15, 7000, avgIncrTimeOut, coin);
    animateElement(11, 8000, avgIncrTimeOut, coin);
    animateElement(3, 9000, avgIncrTimeOut, coin);
    animateElement(7, 9000, rapidIncrTimeOut, ennemyMushroom);
    animateElement(17, 10000, avgIncrTimeOut, coin);
    animateElement(12, 12000, avgIncrTimeOut, coin);
    animateElement(15, 12000, rapidIncrTimeOut, ennemyMushroom);
    animateElement(3, 13000, avgIncrTimeOut, coin);
    animateElement(19, 14000, avgIncrTimeOut, coin);
    animateElement(10, 15000, avgIncrTimeOut, coin);
    animateElement(18, 15000, avgIncrTimeOut, coin);
    animateElement(15, 12000, rapidIncrTimeOut, ennemyMushroom);
    animateElement(4, 16000, avgIncrTimeOut, coin);
    animateElement(8, 17000, avgIncrTimeOut, coin);
    //to continue until 60 seconds
    //animateElement(6, 60000, averageSpeed, coin);
  }

  function animateElement(column, InitialTimeOut, incrTimeOut, src){
    //initialise timeout
    let timeOutIncrement = InitialTimeOut;
    //loop to animate coin in the column
    for (let i = 0 + column; i < totalNbSquares; i = i + nbColumns){
      setTimeout(() => {
        $($squares[i]).html(src);
      }, timeOutIncrement);
      timeOutIncrement = timeOutIncrement + incrTimeOut;
      setTimeout(() => {
        $($squares[i]).html('');
      }, timeOutIncrement);
    }
  }


  //Link functions with DOM elements
  $middleSection.on('click',secondFrame);
  $goButton.on('click',gameStart);

  //Call function to initialise first screen
  //firstFrame();
  gameStart();
  Level1();

});
