var trex, trex_running;
var ground, groundImage;
var invisibleGround; 
var rand;
var cloud;
var obstacle, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var gameOver, gameOverImage;
var restart, restartImage;
var score = 0;

var jumpSound, dieSound, checkPointSound;

var PLAY = 1;
var END = 0;
var gameState = PLAY;
var message;

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  trex_jump = loadAnimation("trex1.png");
  groundImage = loadImage("ground2.png")
  cloudImage = loadImage("cloud.png");
  gameOverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
}

function setup() {
createCanvas(600, 200);
  
  message = "Hello"
  
  //create a trex sprite
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collided);
  trex.addAnimation("jump",trex_jump);
  trex.scale = 0.5;
  //trex.debug = true;
  trex.setCollider("circle",0,0,40);

  //create a ground sprite
  ground = createSprite(300,180,600,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;

  //create an invisible ground
  invisibleGround = createSprite(300,190,600,10);
  invisibleGround.visible = false;
  
  //create gameover sprite
  gameOver = createSprite(300,100);
  gameOver.addImage("over",gameOverImage);
  gameOver.scale = 0.5;
  gameOver.visible = false;
  
  //create restart sprite
  restart = createSprite(300,140);
  restart.addImage("restart",restartImage);
  restart.scale = 0.5;
  restart.visible = false;
  
  obstaclesGroup = new Group();
  cloudsGroup = new Group();

  //var r = Math.round(random(1,100));
  //console.log(r);
}

function draw() {
  //set background color
  background("black");
  
  frameRate(60);

  //To display score system
  text("Score: " + score, 500,50);
  if (gameState === PLAY){
    ground.velocityX = -4;
    
    score = score + Math.round(getFrameRate()/60);
    
    //to play check point sound
    if(score % 100 === 0 && score>0){
      //checkPointSound.play();
    }
  
    if (ground.x < 0) {
    ground.x = ground.width / 2;
    }
    
    //jump when the space button is pressed
    if (keyDown("space") && trex.y>=165) {
      trex.velocityY = -10;
      jumpSound.play();
    }
    
    //trex.changeAnimation("running");
    trex.velocityY = trex.velocityY + 0.5;
    
    //Spawn the clouds & obstacles
    spawnClouds();
    spawnObstacles();
    
    //to check if trex touches any of the obstacles
    if(obstaclesGroup.isTouching(trex)){
      dieSound.play();
      gameState = END;
    }
  }
  
  else if (gameState === END){
    gameOver.visible = true;
    restart.visible = true;
    ground.velocityX = 0;
    trex.velocityY = 0;
    
    //to change trex animation when it collides
    trex.changeAnimation("collided");
    
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    if(mousePressedOver(restart)){
      reset();
    }
  }
  
  //stop trex from falling down
  trex.collide(invisibleGround);

  
  drawSprites();
}


function reset(){
  gameState = PLAY;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running");
  gameOver.visible = false;
  restart.visible = false;
  score = 0;
}

function spawnObstacles() {
  if (frameCount % 80 == 0) {
    obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = -6;
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand){
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to obstacle
    obstacle.scale = 0.5;
    obstacle.lifetime = 120;
    obstacle.depth = trex.depth;
    //console.log(obstacle.depth);
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function spawnClouds(){
  if (frameCount % 60 == 0){
    cloud = createSprite(600,100,40,10);
    cloud.addImage(cloudImage);
    cloud.y = Math.round(random(50,120));
    cloud.scale = 0.1;
    cloud.velocityX = -3;
    
    //assigning lifetime to the variable
    cloud.lifetime = 220;
    
    cloud.depth = trex.depth;
    trex.depth = trex.depth+1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
    //console.log(trex.depth);
    //console.log(cloud.depth);
  }
}
