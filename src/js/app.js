$(() => {
  console.log('JS Loaded');

  //Global Variables
  const $grid = $('.mainGrid');
  const $sections = $('section');
  const $topSection = $('.topSection');
  const $middleSection= $('.middleSection');
  const $bottomSection= $('.bottomSection');
  const $middleSectionText = $('.middleSection p');
  const $bottomSectionText = $('.bottomSection p');
  const $marioIntro = $('.marioIntro');
  const $goButton = $('.goButton');


  let level = 1;
  let nbLives = 3;

  //Functions
  //displayes 1st frame
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

  //Link functions with DOM elements
  $middleSection.on('click',secondFrame);
  //$goButton.on('click',gameStart);

  //Call function to start game
  firstFrame();


});
