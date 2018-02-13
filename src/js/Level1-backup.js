function level1(){
  //desactivate Mario jumping as not jumping in that level
  $(document).off('keydown', marioJump);
  //set speed for the level and Duration
  const avgIncrTimeOut = 400;
  const rapidIncrTimeOut = 200;
  const initialTime = 2; //to change back to 30 seconds

  //change background picture for that level
  $BoardAndheader.css({
    backgroundImage: 'url(/images/backgroundLevel1.png)'
  });
  $footer.css({
    backgroundImage: 'url(/images/Level1footer.png)'
  });

  //Set Music for the Level
  $backgroundAudio.attr('loop', true);
  $backgroundAudio.attr('src', '/sounds/Level1.wav');
  $backgroundAudio.get(0).play();

  // Timer for the level
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

  //Animate coins, ennemies and bonus
  animateElementDown(0, 200, avgIncrTimeOut, coin, 'coin');
  animateElementDown(6, 1000, avgIncrTimeOut, coin, 'coin');
  animateElementDown(5, 2000, rapidIncrTimeOut, ennemyMushroom, 'ennemy');
  animateElementDown(9, 3000, avgIncrTimeOut, coin, 'coin');
  animateElementDown(13, 4000, avgIncrTimeOut, coin, 'coin');
  animateElementDown(6, 5000, avgIncrTimeOut, coin, 'coin');
  animateElementDown(9, 6000, rapidIncrTimeOut, ennemyMushroom, 'ennemy');
  animateElementDown(15, 7000, avgIncrTimeOut, coin, 'coin');
  animateElementDown(11, 8000, avgIncrTimeOut, coin, 'coin');
  animateElementDown(3, 9000, avgIncrTimeOut, coin, 'coin');
  animateElementDown(7, 9000, rapidIncrTimeOut, ennemyMushroom, 'ennemy');
  animateElementDown(17, 10000, avgIncrTimeOut, coin, 'coin');
  animateElementDown(12, 12000, avgIncrTimeOut, coin, 'coin');
  animateElementDown(15, 12000, rapidIncrTimeOut, ennemyMushroom, 'ennemy');
  animateElementDown(3, 13000, avgIncrTimeOut, coin, 'coin');
  animateElementDown(19, 14000, avgIncrTimeOut, coin, 'coin');
  animateElementDown(10, 15000, avgIncrTimeOut, coin, 'coin');
  animateElementDown(18, 15000, avgIncrTimeOut, coin, 'coin');
  animateElementDown(15, 12000, rapidIncrTimeOut, ennemyMushroom, 'ennemy');
  animateElementDown(4, 16000, avgIncrTimeOut, coin, 'coin');
  animateElementDown(8, 17000, avgIncrTimeOut, coin, 'coin');
  animateElementDown(19, 18000, avgIncrTimeOut, coin, 'coin');
  animateElementDown(9, 19000, avgIncrTimeOut, coin, 'coin');
  animateElementDown(15, 20000, rapidIncrTimeOut, ennemyMushroom, 'ennemy');
  animateElementDown(9, 21000, rapidIncrTimeOut, ennemyMushroom, 'ennemy');
  animateElementDown(4, 21000, avgIncrTimeOut, coin, 'coin');
  animateElementDown(12, 22000, avgIncrTimeOut, coin, 'coin');
  animateElementDown(16, 23000, avgIncrTimeOut, coin, 'coin');
  animateElementDown(8, 24000, avgIncrTimeOut, coin, 'coin');
  animateElementDown(7, 26000, rapidIncrTimeOut, ennemyMushroom, 'ennemy');
  animateElementDown(17, 26000, avgIncrTimeOut, coin, 'coin');
  animateElementDown(11, 27000, avgIncrTimeOut, coin, 'coin');
  animateElementDown(19, 27000, avgIncrTimeOut, coin, 'coin');
  animateElementDown(0, 28000, avgIncrTimeOut, coin, 'coin');
  animateElementDown(5, 28000, avgIncrTimeOut, coin, 'coin');
  animateElementDown(8, 29000, rapidIncrTimeOut, ennemyMushroom, 'ennemy');
  animateElementDown(12, 29000, avgIncrTimeOut, coin, 'coin');
  animateElementDown(15, 30000, avgIncrTimeOut, coin, 'coin');
}
