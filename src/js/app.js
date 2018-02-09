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


  //TO DO
  //make site responsive for ipad - grid should not collapse

  //class definitions
  class Ennemy{
    constructor(name,image){
      this.name = name;
      this.image = image;
    }

    // animates{
    //
    // }
  };


  //Functions
  //displays 1st frame
  function firstFrame(){
    //make the grid disappear
    $grid.hide();
    //hide mario picture - but still could see it for 1 sec
    // $marioIntro.hide();
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

  function animateCoin(){
    setTimeout(() => {
      $($squares[0]).html('');
    }, 200);
    setTimeout(() => {
      $($squares[18]).html('<img class="coin" src="/images/coin.png" alt="coin">');
    }, 200);
    setTimeout(() => {
      $($squares[18]).html('');
    }, 300);
    setTimeout(() => {
      $($squares[18*2]).html('<img class="coin" src="/images/coin.png" alt="coin">');
    }, 300);
    setTimeout(() => {
      $($squares[18*2]).html('');
    }, 400);
    setTimeout(() => {
      $($squares[18*3]).html('<img class="coin" src="/images/coin.png" alt="coin">');
    }, 400);
  }

  //Link functions with DOM elements
  $middleSection.on('click',secondFrame);
  $goButton.on('click',gameStart);

  //Call function to initialise first screen
  //firstFrame();
  gameStart();
  animateCoin();


});
