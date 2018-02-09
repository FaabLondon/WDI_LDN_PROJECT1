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
  let srcCoin = '<img class="coin" src="/images/coin.png" alt="coin">';
  let srcEnnemyMushroom = '<img class="ennemy" src="/images/ennemyMushroom.png" alt="ennemy">';


  //TO DO
  //make site responsive for ipad
  //Function to generate grid
  //create class for ennmy ?

  //class definitions
  // class Ennemy{
  //   constructor(name,image){
  //     this.name = name;
  //     this.image = image;
  //   }
  //
  // animates{
  //
  // }
  // };


  //Functions
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
    //change background picture
    // ------------> still to do
    //Show the grid
    $grid.show();
    //hide the $sections
    $sections.hide();
  }

  function generateGame(){
    animateElement(0, 200, 200, srcCoin);
    animateElement(6, 2000, 200, srcCoin);
    animateElement(3, 200, 200, srcEnnemyMushroom);
  }

  function animateElement(column, InitialTimeOut, invSpeed, src){
    //initialise timeout
    let timeOutIncrement = InitialTimeOut;
    //loop to animate coin in the column
    for (let i = 0 + column; i < totalNbSquares; i = i + nbColumns){
      setTimeout(() => {
        $($squares[i]).html(src);
      }, timeOutIncrement);
      timeOutIncrement = timeOutIncrement + invSpeed;
      setTimeout(() => {
        $($squares[i]).html('');
      }, timeOutIncrement);
    }
  }

  // function animateElement(column, InitialTimeOut, invSpeed, src){
  //   //initialise coin position in column
  //   let timeOutIncrement = InitialTimeOut;
  //   $($squares[column]).html(src);
  //   //loop to animate coin in the column
  //   for (let i = 0 + column; i < totalNbSquares; i = i + nbColumns){
  //     setTimeout(() => {
  //       $($squares[i]).html('');
  //     }, timeOutIncrement);
  //     setTimeout(() => {
  //       $($squares[i + nbColumns]).html(src);
  //     }, timeOutIncrement);
  //     timeOutIncrement = timeOutIncrement + invSpeed;
  //   }
  // }


  //Link functions with DOM elements
  $middleSection.on('click',secondFrame);
  $goButton.on('click',gameStart);

  //Call function to initialise first screen
  //firstFrame();
  gameStart();
  generateGame();

});
