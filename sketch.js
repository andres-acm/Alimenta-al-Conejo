
//VARIABLES
const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var ground;
var fruit;
var fruit_con;

var bg_image;
var rabbit_image;
var melon_image;
var button_image;

var bunny;

var blink_img;
var eat_img;
var sad_img;

var bk_song;
var cut_sound;
var sad_sound;
var eating_sound;
var air;

var blower;


// PRELOAD
function preload(){
  bg_image = loadImage("background.png");
  rabbit_image = loadImage("Rabbit-01.png");
  melon_image = loadImage("melon.png");
  button_image = loadImage("cut_button.png");
  blink_img = loadAnimation("blink_1.png", "blink_2.png", "blink_3.png");
  eat_img = loadAnimation("eat_0.png", "eat_1.png", "eat_2.png", "eat_3.png", "eat_4.png");
  sad_img = loadAnimation("sad_1.png", "sad_2.png", "sad_3.png");
  
  blink_img.playing = true;
  eat_img.playing = true;
  sad_img.playing = true;

  eat_img.looping = false;
  sad_img.looping = false;

  bk_song = loadSound("sound1.mp3");
  sad_sound = loadSound("sad.wav");
  cut_sound = loadSound("rope_cut.mp3");
  eating_sound = loadSound("eating_sound.mp3");
  air = loadSound("air.wav");

}


//SET UP
function setup() 
{
  var ismobile = /iPhone|iPad|Android/i.test(navigator.userAgent);
  
  if(ismobile){
    canw = displayWidth;
    canh = displayHeight;
    createcanvas(displayWidth + 80, displayHeight);
    }else{
    canw = windowWidth;
    canh = windowHeight;
    createCanvas(windowWidth,windowHeight);
    }

  frameRate(80);
  engine = Engine.create();
  world = engine.world;
  ground = new Ground(200,canh,600,20);

  //SET UP: ROPES
  rope = new Rope(6, {x:245, y:30});
  rope2 = new Rope(7, {x:350, y:50});
  rope3 = new Rope(7, {x:150, y:50});

  fruit = Bodies.circle(300,300,15);
  Matter.Composite.add(rope.body, fruit);

  fruit_con = new Link(rope, fruit);
  fruit_con2 = new Link(rope2, fruit);
  fruit_con3 = new Link (rope3, fruit);

  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50)
  imageMode(CENTER);


  //BUNNY
  blink_img.frameDelay = 20;
  eat_img.frameDelay = 20;
  sad_img.frameDelay = 20;

  bunny = createSprite(50,canh -80,100,100);
  bunny.addAnimation("blink", blink_img);
  bunny.addAnimation("eat", eat_img);
  bunny.addAnimation("crying", sad_img);
  bunny.changeAnimation("blink");
  bunny.scale = 0.2


  //BUTTONS
  button = createImg("cut_button.png");
  button.position(220,30);
  button.size(50,50);
  button.mouseClicked(drop);

  button2 = createImg("cut_button.png");
  button2.position(330,30);
  button2.size(50,50);
  button2.mouseClicked(drop2);
  
  button3 = createImg("cut_button.png");
  button3.position(120,50);
  button3.size(50,50);
  button3.mouseClicked(drop3);

  //BLOWER
  blower = createImg("balloon.png");
  blower.position(10,200);
  blower.size(150,100);
  blower.mouseClicked(airblow);


  //MUSICA DE FONDO
  bk_song.play();
  bk_song.setVolume(0.5);

  mute_btn = createImg("mute.png");
  mute_btn.position(450,20);
  mute_btn.size(50,50);
  mute_btn.mouseClicked(mute);

}


//DRAW
function draw() 
{
  background(51);

  image(bg_image, 0, 0, displayWidth, displayHeight);

  ground.show();
  rope.show();
  rope2.show();
  rope3.show();
  Engine.update(engine);
 

  if(fruit != null){
    image(melon_image, fruit.position.x, fruit.position.y, 70, 70);
  }

  if(collision(fruit, bunny) == true){
    bunny.changeAnimation("eat");
    eating_sound.play();

  }

  if (fruit != null && fruit.position.y >=650){
    bunny.changeAnimation("crying");
    bk_song.stop();
    sad_sound.play();
    fruit = null
  }


  drawSprites();
}


//DROP
function drop(){
  cut_sound.play();
  rope.break();
  fruit_con.detach();
  fruit_con = null;
}

function drop2(){
  cut_sound.play();
  rope2.break();
  fruit_con2.detach();
  fruit_con2 = null;
}

function drop3(){
  cut_sound.play();
  rope3.break();
  fruit_con3.detach();
  fruit_con3 = null;
}


//COLLISION
function collision(body, sprite){
  if(body != null){
    var d;
    d = dist(body.position.x, body.position.y, sprite.position.x, sprite.position.y);
  if(d<=80){
    World.remove(engine.world, fruit);
    fruit = null;
    return true}
    else{
      return false;
        }
  }
}


//AIR BLOW
function airblow(){
  Matter.Body.applyForce(fruit,{x:0, y:0}, {x:0.01, y:0});
  air.play();
}

//MUTE SOUND
function mute(){
  if(bk_song.isPlaying()){
    bk_song.stop();
  }else{
    bk_song.play();
  }
}