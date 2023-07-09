let snake=[ 
    {x:7,y:7},
    // {x:8,y:7},
    // {x:9,y:7}
 ];
 let DisplayWidth=28;
 let DisplayHeight=24;

 let grid= document.querySelector(".grid");
 
if(screen.width<=500&&screen.height<=720)
{
   DisplayWidth=14;
   grid.style.gridTemplateColumns="repeat(14,1fr)";
//    grid.style.width="80%";

   DisplayHeight=18;
   grid.style.gridTemplateRows="repeat(18,1fr)";
}

let food=foodPosition();
let expand=1;
let inputDirection={x:0,y:0};
let lastInput=inputDirection;
let lastTime=0;
let speed=9;
let score=0;
let gameOver=false;
let high=Number(window.localStorage.getItem("high"));
let snakeEatSound=new Audio('Snake eat.mp3');
let snakeSound=new Audio("Snake Sound.mp3");
let gameOverSound=new Audio("game over.wav");
let soundSVG='<svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 640 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><style>svg{fill:#fafafa}</style><path d="M533.6 32.5C598.5 85.3 640 165.8 640 256s-41.5 170.8-106.4 223.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C557.5 398.2 592 331.2 592 256s-34.5-142.2-88.7-186.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM473.1 107c43.2 35.2 70.9 88.9 70.9 149s-27.7 113.8-70.9 149c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C475.3 341.3 496 301.1 496 256s-20.7-85.3-53.2-111.8c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zm-60.5 74.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C393.1 284.4 400 271 400 256s-6.9-28.4-17.7-37.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3z"/></svg>';
let SoundOffSVG='<svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 576 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><style>svg{fill:#ffffff}</style><path d="M301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3zM425 167l55 55 55-55c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-55 55 55 55c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-55-55-55 55c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l55-55-55-55c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0z"/></svg>'
let soundcheck=1;
let snd=document.querySelector(".sound");
let gameOverMSG=document.querySelector(".gameover");


snd.addEventListener("click",()=>{
    if(soundcheck%2==1)
    {
        soundcheck++;
        snd.innerHTML=SoundOffSVG;
        snakeSound.pause();
    }
    else{
        soundcheck++;
        snd.innerHTML=soundSVG;
        snakeSound.play();
    }
})

function temp(currentTime)
{

    let timeInSec=( currentTime - lastTime )/1000;

    // console.log(timeInSec );
    requestAnimationFrame(temp);

    if(timeInSec < 1/speed)return;

    console.log("temp");

    lastTime=currentTime;

    if(gameOver==false){

        if(soundcheck%2==1){snakeSound.play();}
        else{snakeSound.pause();}

       update();
        draw();
    }
    
}
window.requestAnimationFrame(temp);

function draw()
{
    drawSnake();
    drawFood();
}

function update()
{
    grid.innerHTML="";
    snakeMove();
    snakeEat();
    // isGameOver();
}

//if snake move to any direction this function will update the snake array value
function snakeMove()
{
    inputDirection=getInputDirection();

    for(let i=snake.length-2;i>=0;i--)
    {
        snake[i+1]={...snake[i]};
    }
    snake[0].x +=inputDirection.x;
    snake[0].y +=inputDirection.y;
    isGameOver();
}

//this function will update the snake body  and food if snake eated a food
function snakeEat()
{
    if(isEated())
    {
        score++;
        if(high<score)
        {
            window.localStorage.setItem("high",score);
            high=window.localStorage.getItem("high");
        }
        document.getElementById("score").innerHTML=score;
        document.getElementById("Highscore").innerHTML=high;
        food=foodPosition();
        snakeEatSound.play();
        expandSnake();
        // snakeEatSound.pause();
    }
}


//this function will check the snake is eated food or not
function isEated()
{
    return snake[0].x===food.x&&snake[0].y===food.y;
}

//this function will return a random position for food which snake is not present on that position
function foodPosition()
{
    let a,b,check=true;
   while(check)
    {
        a=Math.ceil(Math.random()*DisplayWidth);
        b=Math.ceil(Math.random()*DisplayHeight);

        check=snake.some((position)=>{
            return position.x===a&&position.y===b
        })
    }
    return {x:a,y:b};

} 

//this function will expand the snake body
 function expandSnake()
 {
    for(let i=0;i<expand;i++)
        {
            snake.push(snake[snake.length-1]);
        }
 }

//this function is return the input direction exmaple- up,down,left,right
function getInputDirection()
{
    window.addEventListener("keydown",(e)=>{

        switch(e.key)
        {
            case 'ArrowUp':
            if(lastInput.y==1)break;
            inputDirection={x:0,y:-1};
            break;

            case 'ArrowDown':
            if(lastInput.y==-1)break;
            inputDirection={x:0,y:1};

            break;

            case 'ArrowLeft':
            if(lastInput.x==1)break;
            inputDirection={x:-1,y:0};
            break;

            case 'ArrowRight':
            if(lastInput.x==-1)break;
            inputDirection={x:1,y:0};

            break;

            case 'Enter':
                location.reload();
            break;
            
            default:
            inputDirection={x:0,y:0};

                break;
        }
        // if(e.key=='ArrowUp')
        // {
        //     if(lastInput.y===1){return;}
        //     inputDirection.y=-1;
        //     inputDirection.x=0;
            
        // }
        // else if(e.key=='ArrowDown')
        // {
        //     if(lastInput.y===-1){return;}

        //     inputDirection.y=1;
        //     inputDirection.x=0;
        // }
        // else if(e.key=='ArrowLeft')
        // {
        //     if(lastInput.x===1){return;}

        //     inputDirection.y=0;
        //     inputDirection.x=-1;
        // }
        // else if(e.key=='ArrowRight')
        // {
        //     if(lastInput.x===-1){return;}

        //     inputDirection.y=0;
        //     inputDirection.x=1;
        // }
        // else{
        //     inputDirection.x=0;
        //     inputDirection.y=0;
        // }
   
    })
    lastInput=inputDirection;
    // console.log(lastInput);

    return inputDirection;
}


//This function will draw a snake body

function drawSnake()
{
    snake.forEach((element,index)=>{
        let snakeBody=document.createElement("div");
        snakeBody.style.gridColumnStart=element.x;
        snakeBody.style.gridRowStart=element.y;

        if(index==0){ snakeBody.classList.add("head");
        // snakeBody.innerHTML=" * *";
        // if(inputDirection.y==1){
        // snakeBody.style.transform="rotate(-90deg)";
        // }
    }
        else{snakeBody.classList.add("body"); if(index%2==1){snakeBody.style.backgroundColor=" black"}}

        grid.append(snakeBody);
    })
    
}

//This function will draw a food;
function drawFood()
{
    let snakeBody=document.createElement("div");
    snakeBody.style.gridColumnStart=food.x;
    snakeBody.style.gridRowStart=food.y;
    snakeBody.classList.add("food");
    grid.append(snakeBody);   
}


//this function will check game over or not
function isGameOver()
{
    if(overByGrid() || overBySnake())
    {
        gameOverSound.play();
        gameOver=true;
        gameOverMSG.classList.toggle("active");
        // alert("game over");
        // location.reload();
    }
}
document.getElementById("restart").addEventListener("click",()=>{
    gameOverMSG.classList.toggle("active");
    location.reload();
})

//this function will return true if snake hits the  border 
function overByGrid()
{
        if (snake[0].x>DisplayWidth || snake[0].x<=0 || snake[0].y>DisplayHeight || snake[0].y<=0){
        gameOverSound.play();
            return true;
        }
}

//this function will return true if snake hits the body itself 
function overBySnake()
{
    for(let i=1;i<snake.length;i++)
    {
        if(snake[0].x===snake[i].x&&snake[0].y===snake[i].y)
        {
        gameOverSound.play();

            return true;
        }
    }
}