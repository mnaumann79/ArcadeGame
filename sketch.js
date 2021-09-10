/*

- Copy your game project code into this file
- for the p5.Sound library look here https://p5js.org/reference/#/libraries/p5.sound
- for finding cool sounds perhaps look here
https://freesound.org/


*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;


//Arrays for the environment
var canyons;
var clouds;
var mountains;
var mountains_x;
var trees;
var trees_x;


var collectables;
var enemies;

var gravity;

var game_score;

var flagpole;

var lives;

var jumpSound;

var platforms;

//make variables global for troubleshooting
var isOver = false;


function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);
}

function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;
    lives = 3;
    startGame();

}

function startGame() //the new setup
{
	gameChar_x = width/2;
	gameChar_y = floorPos_y;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;
    
    gravity = 3; 

	// Initialise arrays of scenery objects.

//    clouds = [{x_pos: 150,  y_pos: 100, scale: 1.5},
//              {x_pos: 350,  y_pos: 150, scale: 2},
//              {x_pos: 550,  y_pos: 50,  scale: 1},
//              {x_pos: 850,  y_pos: 150, scale: 2},
//              {x_pos: 1100, y_pos: 50,  scale: 1},
//              {x_pos: 1400, y_pos: 100, scale: 1.5}];
    clouds = [];
    for (var i = 0; i < 20; i++)
    {
//        clouds.push(createCloud(150 * (2*i + 1), 100, 0.75));
        clouds.push(createCloud(-1000 + (random(250 * (i + 1),350 * (i + 1))),
                                random(80,120), 
                                random(0.75, 1)));
    }

    trees_x = [0, 180, 615, 815,1215,1520];
    trees = [];
    for (var i = 0; i < trees_x.length; i++)
    {
        trees.push(createTree(trees_x[i], floorPos_y, random(0.5,1)));
    }

    
    mountains_x = [[180, 520, 1150],[0.75, 2, 1.5]];
    mountains = [];
    for (var i = 0; i < mountains_x.length; i++)
    {
        mountains.push(createMountain(mountains_x[0][i], floorPos_y, mountains_x[1][i],1));
    }

    canyons = [];
    canyons.push(createCanyon(100, 125));
    canyons.push(createCanyon(400, 125));
    canyons.push(createCanyon(1050, 125));
    canyons.push(createCanyon(1600, 125));
    
    
    platforms = [];
    platforms.push(createPlatform(150, floorPos_y - 100, 100));
    platforms.push(createPlatform(500, floorPos_y - 100, 200));
    platforms.push(createPlatform(750, floorPos_y - 200, 150));

    

    collectables = [];
    collectables.push(createCollectable(15, floorPos_y, 50));
    collectables.push(createCollectable(300, floorPos_y, 50));
    collectables.push(createCollectable(650, floorPos_y-100, 50));
    collectables.push(createCollectable(850, floorPos_y, 100));
    collectables.push(createCollectable(1125, floorPos_y, 50));
    collectables.push(createCollectable(1350, floorPos_y, 50));
    collectables.push(createCollectable(1000, floorPos_y-250, 50));
//    collectables = [{x_pos: 15,   y_pos: 407, size: 50, isFound: false},
//                    {x_pos: 300,  y_pos: 407, size: 50, isFound: false},
//                    {x_pos: 650,  y_pos: 407, size: 50, isFound: false},
//                    {x_pos: 850,  y_pos: 407, size: 50, isFound: false},
//                    {x_pos: 1125, y_pos: 407, size: 50, isFound: false},
//                    {x_pos: 1350, y_pos: 407, size: 50, isFound: false}];
    
    enemies = [];
    enemies.push(new Enemy(185,floorPos_y, 40, 135));
    enemies.push(new Enemy(512,floorPos_y - 100, 25, 175));
    enemies.push(new Enemy(765, floorPos_y - 200, 30, 120))

    game_score = 0;
    
//    flagpole = {x_pos: 1800, isReached: false};    
    flagpole = createFlagpole(1800, floorPos_y, false);    
}

function draw()
{
	background(100, 155, 255); // fill the sky blue

	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); // draw some green ground

    push();
    translate(scrollPos,0);

    // Draw clouds.
    //drawClouds();
    for (var i = 0; i < clouds.length; i++)
    {
        clouds[i].draw();
    }

	// Draw mountains
    for (var i = 0; i < mountains.length; i++)
    {
        mountains[i].draw();
    }
    
    //draw the canyons
    for (var i = 0; i < canyons.length; i++)
    {
        canyons[i].draw();
    }
	// Draw trees.
    for (var i = 0; i < trees.length; i++)
    {
        trees[i].draw();
    }
    
    //draw platforms
    for (var i = 0; i < platforms.length; i++)
    {
        platforms[i].draw();
    }

	// Draw collectable items.

    //   var isFound = false;
    for (var i = 0; i < collectables.length; i++)
    {
        if (collectables[i].checkContact(gameChar_world_x, gameChar_y))
        {
            game_score += 1;
            collectables.splice(i,1);
            break;
        }
        collectables[i].draw();
    }
    
    flagpole.draw();
    
    
    for (var i = 0; i < enemies.length; i++)
    {
        enemies[i].draw();
        var isContact = enemies[i].checkContact(gameChar_world_x, gameChar_y);
        
        if (isContact)
        {
            if (lives > 0)
            {
                lives -= 1;
                startGame();
                break;
            }
        }
    }
    
    checkPlayerDie();
    
    pop();
	
    drawGameChar();
    
    //print score on the screen
    fill(255);
    noStroke();
    textSize(25);
    text("Score",20,40);
    text(": "+game_score,85,40);
    
    //show available lives on the screen
    text("Lives",20,80);
    text(":",85,80);
    for(var i = 0; i < lives; i++)
    {
        var x = 115;
        //head
        fill(200,150,150);
        ellipse(x + 40*i,70, 26);
        fill(0);
        //face
        ellipse(x-6 + 40*i,69, 4);
        ellipse(x+6 + 40*i,69, 4);
        rect(x-1 + 40*i,71,2,4);
        rect(x-4 + 40*i,77,8,1);

    }
    //print debug information on the screen
//    text("X: "+gameChar_world_x,250, 40);
//    text("c.l: "+collectables.length, 250, 80);
//    text("isOver: "+isOver, 400, 40);
    
    //display message when no more lives are left
    if (lives == 0)
    {
        push();
        fill(255);
        textAlign(CENTER);
        textSize(45);
        text("Game Over. Press space to continue.",width/2,height/2);
        pop();
        return;
    }

    //display message when flagpole is reached
    if (flagpole.checkContact(gameChar_world_x, gameChar_y)/* == true && collectables.length == 0*/)
    {
        push();
        fill(255);
        textAlign(CENTER);
        textSize(45);
        text("Level complete. Press refresh to continue.",width/2,height/2);
        pop();
        return;
    }

    // Logic to make the game character move or the background scroll.
	if (isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if (isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}

	// Logic to make the game character rise and fall.
    if (gameChar_y >= floorPos_y)
    {
//        var isOver = false;
        var canyon = 0;
        for (var i = 0; i < canyons.length; i++) //check if character is over one of the canyons
        {
            if (canyons[i].checkOver(gameChar_world_x, gameChar_y)/* && gameChar_y >= floorPos_y*/)
            {
                isOver = true;
                isPlummeting = true;
                canyon = i;
                break;
            }
            else
            {
                isOver = false;
            }

        }

    //Limit movement after falling into the canyon    
//        if(isOver)
//        {
//            gameChar_x = canyons[canyon].x;
//        }
//        
        if(!isOver)
        {
            isPlummeting = false;
        }
    }
    
    if (gameChar_y < floorPos_y)
        {
            var isContact = false;
            for (var i = 0; i < platforms.length; i++)
            {
                if (platforms[i].checkContact(gameChar_world_x, gameChar_y))
                {
                    isContact = true;
                    isFalling = false;
                    break;
                }
            }
             
            if (!isContact)
            {
                isFalling = true;
            }
        }
        else
        {
            isFalling = false;
        }

        if (isFalling || isPlummeting)
        {
            gameChar_y = gameChar_y+=gravity;
        } 
    
	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
}


// ---------------------
// Key control functions
// ---------------------

function keyPressed()
{

    if ((keyCode == 37 || keyCode == 65) && (gameChar_y < height && !flagpole.isReached) && !isPlummeting)
    {
        isLeft = true;
    }
    else if((keyCode == 39 || keyCode == 68) && (gameChar_y < height && !flagpole.isReached) && !isPlummeting)
    {
        isRight = true;
    }
    
    if (keyCode == 32)
    {
        if(gameChar_y <= floorPos_y && !flagpole.isReached && !isFalling && !isPlummeting)
        {
            gameChar_y = gameChar_y - 150;
            //jumpSound.play();
        }

        if(lives == 0)
        {
            lives = 3;
            startGame();
        }
    }
}



function keyReleased()
{
	// if statements to control the animation of the character when
	// keys are released.

    if (keyCode == 37 || keyCode == 65)
    {
        isLeft = false;
    }
    else if(keyCode == 39 || keyCode == 68)
    {
        isRight = false;
    }
}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
    angleMode(DEGREES);

	// draw game character
	if(isLeft && isFalling || isLeft && isPlummeting)
    {
        // add your jumping-left code
        //head
        fill(200,150,150);
        ellipse(gameChar_x,gameChar_y - 55, 26);

        //face
        fill(0);
        ellipse(gameChar_x-8,gameChar_y-57,4);
        rect(gameChar_x-10,gameChar_y-49,8,2)

        //neck
        fill(200,150,150);
        rect(gameChar_x-3,gameChar_y-43,6,3);

        //legs - 1
        push();
        translate(gameChar_x-8,gameChar_y-22);
        rotate(40);
        fill(128,0,0)
        rect(0,0,10,15);
        fill(0);
        rect(-3,15,13,5);
        pop();

        //2
        push();
        translate(gameChar_x,gameChar_y-16);
        rotate(315);
        fill(128,0,0)
        rect(0,0,10,15);
        fill(0);
        rect(-3,15,13,5);
        pop();

        //body
        fill(0,100,0);
        rect(gameChar_x-11,gameChar_y-40, 22, 25,5,5,0,0);

        //arms
        push();
        translate(gameChar_x,gameChar_y-29);
        rotate(215);
        fill(0);
        rect(0,0,20,5,3);
        fill(200,150,150);
        rect(19,0,6,5,3);
        pop();
    }
	else if(isRight && isFalling || isRight && isPlummeting)
    {
        // add your jumping-right code
        //head
        fill(200,150,150);
        ellipse(gameChar_x,gameChar_y - 55, 26);

        //face
        fill(0);
        ellipse(gameChar_x+8,gameChar_y-57,4);
        rect(gameChar_x+2,gameChar_y-49,8,2)

        //neck
        fill(200,150,150);
        rect(gameChar_x-3,gameChar_y-43,6,3);

        //1. leg
        push();
        translate(gameChar_x-8,gameChar_y-22);
        rotate(40);
        fill(128,0,0)
        rect(0,0,10,15);
        fill(0);
        rect(0,15,13,5);
        pop();

        //2. leg
        push();
        translate(gameChar_x,gameChar_y-16);
        rotate(315);
        fill(128,0,0)
        rect(0,0,10,15);
        fill(0);
        rect(0,15,13,5);
        pop();

        //body
        fill(0,100,0);
        rect(gameChar_x-11,gameChar_y-40, 22, 25,5,5,0,0);

        //arms
        push();
        translate(gameChar_x-2,gameChar_y-35);
        rotate(335);
        fill(0);
        rect(0,0,20,5,3);
        fill(200,150,150);
        rect(19,0,6,5,3);
        pop();
    }
	else if(isLeft)
    {
        // add your walking left code
        //head
        fill(200,150,150);
        ellipse(gameChar_x,gameChar_y - 55, 26);

        //face
        fill(0);
        ellipse(gameChar_x-8,gameChar_y-57,4);
        rect(gameChar_x-10,gameChar_y-49,8,2)

        //neck
        fill(200,150,150);
        rect(gameChar_x-3,gameChar_y-43,6,3);

        //leg 1
        push();
        translate(gameChar_x-8,gameChar_y-20);
        rotate(30);
        fill(128,0,0)
        rect(0,0,10,15);
        fill(0);
        rect(-3,15,13,5);
        pop();

        //leg 2
        push();
        translate(gameChar_x,gameChar_y-16);
        rotate(340);
        fill(128,0,0)
        rect(0,0,10,15);
        fill(0);
        rect(-3,15,13,5);
        pop();

        //body
        fill(0,100,0);
        rect(gameChar_x-11,gameChar_y-40, 22, 25,5,5,0,0);

        //arms
        push();
        translate(gameChar_x+2,gameChar_y-32);
        rotate(135);
        fill(0);
        rect(0,0,20,5,3);
        fill(200,150,150);
        rect(19,0,6,5,3);
        pop();
    }
	else if(isRight)
    {
        // add your walking right code
        fill(200,150,150);
        ellipse(gameChar_x,gameChar_y - 55, 26);

        //face
        fill(0);
        ellipse(gameChar_x+8,gameChar_y-57,4);
        rect(gameChar_x+2,gameChar_y-49,8,2)

        //neck
        fill(200,150,150);
        rect(gameChar_x-3,gameChar_y-43,6,3);

        //1. leg
        push();
        translate(gameChar_x-8,gameChar_y-20);
        rotate(20);
        fill(128,0,0)
        rect(0,0,10,15);
        fill(0);
        rect(0,15,13,5);
        pop();

        //2. leg
        push();
        translate(gameChar_x,gameChar_y-14);
        rotate(325);
        fill(128,0,0)
        rect(0,0,10,15);
        fill(0);
        rect(0,15,13,5);
        pop();

        //body
        fill(0,100,0);
        rect(gameChar_x-11,gameChar_y-40, 22, 25,5,5,0,0);

        //arms
        push();
        translate(gameChar_x+2,gameChar_y-35);
        rotate(45);
        fill(0);
        rect(0,0,20,5,3);
        fill(200,150,150);
        rect(19,0,6,5,3);
        pop();
    }
	else if(isFalling || isPlummeting)
    {
        // add your jumping facing forwards code
        //head
        fill(200,150,150);
        ellipse(gameChar_x,gameChar_y - 55, 26);
        fill(0);
        //face
        ellipse(gameChar_x-6,gameChar_y - 56, 4);
        ellipse(gameChar_x+6,gameChar_y - 56, 4);
        rect(gameChar_x-1,gameChar_y-54,2,4);
        rect(gameChar_x-4,gameChar_y-47,8,1);
        //neck
        fill(200,150,150);
        rect(gameChar_x-3,gameChar_y-43,6,3);
        //body
        fill(0,100,0);
        rect(gameChar_x-13,gameChar_y-40, 26, 25,5,5,0,0);
        //arms
        fill(0);
        beginShape();
        vertex(gameChar_x-13,gameChar_y-35);
        vertex(gameChar_x-22,gameChar_y-45);
        vertex(gameChar_x-22,gameChar_y-38);
        vertex(gameChar_x-13,gameChar_y-28);
        endShape(CLOSE);

        beginShape();
        vertex(gameChar_x+13,gameChar_y-35);
        vertex(gameChar_x+22,gameChar_y-45);
        vertex(gameChar_x+22,gameChar_y-38);
        vertex(gameChar_x+13,gameChar_y-28);
        endShape(CLOSE);

        //hands
        fill(200,150,150);
        ellipse(gameChar_x-22,gameChar_y-42,5);
        ellipse(gameChar_x+22,gameChar_y-42,5);
        //legs
        fill(128,0,0)
        beginShape();
        vertex(gameChar_x-13,gameChar_y-15);
        vertex(gameChar_x-1,gameChar_y-15);
        vertex(gameChar_x-13,gameChar_y-2);
        vertex(gameChar_x-25,gameChar_y-2);
        endShape(CLOSE);

        beginShape();
        vertex(gameChar_x+1,gameChar_y-15);
        vertex(gameChar_x+13,gameChar_y-15);
        vertex(gameChar_x+25,gameChar_y-2);
        vertex(gameChar_x+13,gameChar_y-2);
        endShape(CLOSE);


        //shoes
        fill(0);
        rect(gameChar_x-25,gameChar_y-2,12,3);
        rect(gameChar_x+13,gameChar_y-2,12,3);
    }
	else
    {
        // add your standing front facing code
        //head
        fill(200,150,150);
        ellipse(gameChar_x,gameChar_y - 58, 26);
        fill(0);
        //face
        ellipse(gameChar_x-6,gameChar_y - 59, 4);
        ellipse(gameChar_x+6,gameChar_y - 59, 4);
        rect(gameChar_x-1,gameChar_y-57,2,4);
        rect(gameChar_x-4,gameChar_y-50,8,1);
        //neck
        fill(200,150,150);
        rect(gameChar_x-3,gameChar_y-46,6,3);
        //body
        fill(0,100,0);
        rect(gameChar_x-13,gameChar_y-43, 26, 25,5,5,0,0);
        //arms
        fill(0);
        rect(gameChar_x-18,gameChar_y-38,5,20,3,0,0,0);
        rect(gameChar_x+13,gameChar_y-38,5,20,0,3,0,0);
        //hands
        fill(200,150,150);
        ellipse(gameChar_x-15,gameChar_y-16,5);
        ellipse(gameChar_x+15,gameChar_y-16,5);
        //legs
        fill(128,0,0)
        rect(gameChar_x-13,gameChar_y-18,12,16);
        rect(gameChar_x+1,gameChar_y-18,12,16);
        //shoes
        fill(0);
        rect(gameChar_x-13,gameChar_y-3,12,3);
        rect(gameChar_x+1,gameChar_y-3,12,3);
    }
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to create a cloud object
function createCloud (x, y, scale)
{
    var cloud = {
        x: x,
        y: y,
        scale: scale,
        draw: function()
        {
            noStroke();
            fill(255);
            ellipse(this.x, this.y, 80 * this.scale);
            ellipse(this.x - 60 * this.scale, this.y + 30 * this.scale, 80 * this.scale);
            ellipse(this.x + 60 * this.scale, this.y + 30 * this.scale, 80 * this.scale);
            rect(this.x - 60 * this.scale, this.y + 30 * this.scale, 120 * this.scale, 40 * this.scale);
        }
    };
    return cloud;
}

//Function to create a tree object
function createTree(x, y, scale)
{
    var tree = {
        x: x,
        y: y,
        scale: scale,
        draw: function ()
        {
            //trunk
            fill(120, 100, 40); //brown
            rect(this.x - 15 * this.scale, this.y - height/4 * this.scale, 30 * this.scale, 144 * this.scale);
            //branches top
            fill(0,155,0); //green
            triangle(this.x, this.y - (height/4 + 100) * this.scale, 
                     this.x - 60 * this.scale, this.y - height/4 * this.scale, 
                     this.x + 60 * this.scale, this.y - height/4 * this.scale);
            
            triangle(this.x, this.y - (height/4 + 50) * this.scale, 
                     this.x - 80 * this.scale, this.y - (height/4 - 50) * this.scale, 
                     this.x + 80 * this.scale, this.y - (height/4 - 50) * this.scale);
        }
    };
    return tree;
}

// Function to create mountain object
function createMountain(x, y, scale, distance)
{
    var mountain = {
        x: x,
        y: y,
        scale: scale,
        distance: distance,
        draw: function()
        {
            fill(112,128,144);
            triangle(this.x,this.y,
            this.x+100*this.scale,this.y-160*this.scale,
            this.x+200*this.scale,this.y);

            //snow cap
            fill(255,255,255);
            triangle(this.x+69*this.scale,this.y-110*this.scale,
            this.x+100*this.scale,this.y-160*this.scale,
            this.x+131*this.scale,this.y-110*this.scale);
        }
    };
    return mountain;
}

// Function to create a canyon object and check if character is over it
function createCanyon(x, width)
{
    var canyon = {
        x: x,
        width: width,
        draw: function()
        {
            fill(100, 155, 255);
            ellipse(this.x, floorPos_y, this.width,300);
            fill(0);
            ellipse(this.x, floorPos_y, 10);
        },
        checkOver: function(gc_x, gc_y)
        {
            var leftEdge = this.x - this.width/2; //left edge of the canyon
            var rightEdge = this.x + this.width/2; //right edge of the canyon
 
            if(gc_x > leftEdge && 
               gc_x < rightEdge)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    };
    return canyon;
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to create a collectable object and check for character distance
function createCollectable(x, y, size)
{
    var collectable = {
        x: x,
        y: y - size/2,
        size: size,
        draw: function()
        {
            fill(255,215,0)
            ellipse(this.x,this.y,this.size);
            fill(0,0,0);
            textSize(32);
            text("$$",this.x-17,this.y+10);
            fill(0);
        },
        checkContact: function(gc_x, gc_y)
        {
            if(dist(gc_x, gc_y,this.x,this.y)<this.size) 
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    };
    return collectable;
}


//Fuction to create a platform for the character to jump on and host enemies
function createPlatform(x, y, length)
{
    var platform = {
        x: x,
        y: y,
        length: length,
        draw: function()
        {
            fill("brown");
            rect(this.x, this.y, this.length, 20);
            fill(0);
            ellipse(this.x, this.y, 10);
        },
        checkContact: function (gc_x, gc_y)
        {
            if (gc_x > this.x && gc_x < this.x + this.length)
            {
                var d = this.y - gc_y;
                if (d >= 0 && d < 5 )
                {
                    return true;
                }
            }
            else
            {
                return false;
            }
        }
    }
    return platform;
}



// Function to render the Flagpole.
function createFlagpole(x, y, isReached)
{
    var flagpole = {
        x: x,
        y: y,
        isReached: isReached,
        draw: function ()
        {
            strokeWeight(5);
            stroke(180);
            line(this.x, this.y, this.x, this.y-250);
            fill(255,0,255);
            noStroke();

            if (this.isReached)
            {
                rect(this.x, this.y-250,50,50);
            }
            else
            {
                rect(this.x, this.y-50,50,50);

            }
        },
        checkContact: function(gc_x, gc_y)
        {
            var d = abs(gc_x - this.x);
            if(d < 15 && gc_y <= this.y)
            {
                this.isReached = true;
                return true;
            }
            else
            {
                return false;
            }

        }
    };
    return flagpole;
}
// Function to check character has died by falling into the a canyon, reduce lives by 1.
function checkPlayerDie()
{
    if(gameChar_y > height + 80)
    {
        lives -=1;
        if(lives > 0)
        {
            startGame();
        }
        else
        {
            lives = 0;
        }
    }
}

function Enemy(x, y, size, range) //size is the diameter of the enemy
{
    this.size = size;
    this.range = range;
    this.x = x;
    this.y = y - this.size/2;
    
    this.currentX = x;
    this.inc = 1.5;
    
    this.update = function()
    {
        this.currentX += this.inc;
        
        if (this.currentX >= this.x + this.range)
        {
            this.inc *= -1;
//            this.inc = -2;
        }
        else if (this.currentX < this.x)
        {
//            this.inc = 2;
            this.inc *= -1;
        }
    }
    
    this.draw = function()
    {
        this.update();
        fill(255,0,0);
        ellipse(this.currentX, this.y, this.size, this.size);
        fill(0);
        ellipse(this.currentX - 2*this.size/9, this.y - this.size/10, this.size/6);
        ellipse(this.currentX + 2*this.size/9, this.y - this.size/10, this.size/6);
        
        fill("yellow");
        ellipse(this.currentX, this.y + this.size/4, this.size/2.3, this.size/2);
        
        noFill();
        stroke(0);
        strokeWeight(this.size/20);
        ellipse(this.currentX, this.y + this.size/4, this.size/3, this.size/4);
        noStroke();
        
        fill("gold");
//        noFill();
        stroke(0);
        strokeWeight(this.size/50);
        beginShape();
        vertex(this.currentX - this.size/2.5, this.y - this.size/3);
        vertex(this.currentX - 2*this.size/4.5, this.y - this.size/1.5);
        
        vertex(this.currentX - this.size/4, this.y - this.size/2)
        
        vertex(this.currentX, this.y - this.size/1.5);
        
        vertex(this.currentX + this.size/4, this.y - this.size/2)

        vertex(this.currentX + 2*this.size/4.5, this.y - this.size/1.5);
        vertex(this.currentX + this.size/2.5, this.y - this.size/3);
        endShape(CLOSE);
        noStroke();
        
        
//        fill(0);
//        ellipse(this.currentX, this.y + this.size/2, 10,10);
        
    }
    
    this.checkContact = function(gc_x, gc_y)
    {
        var d = dist(gc_x, gc_y, this.currentX, this.y);
        
        if (d < 20)
        {
            return true;
        }
        return false;
    
    }
}









