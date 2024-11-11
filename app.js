document.addEventListener('DOMContentLoaded', () => {
    //querySelector picks out specified elements from html file
    const grid = document.querySelector('.grid')
    const doodler = document.createElement('div')
    let platformCount = 5
    let doodlerLeftSpace = 50
    let startPoint = 150
    let doodlerBottomSpace = startPoint
    let isGameOver = false
    let platforms = []
    let upTimerId
    let downTimerId
    let leftTimerId
    let rightTimerId
    let isJumping = true
    let isGoingLeft = false
    let isGoingRight = false
    let score = 0

    class Platform {
        constructor(newPlatformBottom){
            this.bottom = newPlatformBottom
            //Based on the width of the .platform class in style.css
            this.left = Math.random() * 315
            //Creates an element for each platform
            this.visual = document.createElement('div')

            const visual = this.visual
            //Add css styling
            visual.classList.add('platform')
            visual.style.left = this.left + 'px'
            visual.style.bottom = this.bottom + 'px'
            //Add platform to the grid
            grid.appendChild(visual)
        }
    }

    function createDoodler(){
        // appendChild adds the argument into the div  
        grid.appendChild(doodler)
        // Adds the .doodler class css styling to the doodler element 
        doodler.classList.add('doodler')
        //Spawn doodler on the first platform
        doodlerLeftSpace = platforms[0].left
        doodlerBottomSpace = platforms[0].bottom + 15
        // Puts space to the left of doodler element
        doodler.style.left = doodlerLeftSpace + 'px'
        doodler.style.bottom = doodlerBottomSpace + 'px'
    }

    function movePlatforms() {
        //If doodler is not at bottom(jumping), then move the platforms
        if(doodlerBottomSpace > 200){
            platforms.forEach(platform => {
                platform.bottom -= 4
                let visual = platform.visual
                visual.style.bottom = platform.bottom + 'px'

                if(platform.bottom < 10){
                    let firstPlatform = platforms[0].visual
                    //Remove the 1st platform visually & also from the array
                    firstPlatform.classList.remove('platform')
                    score++ //Add to score after a platform is passed
                    platforms.shift()
                    console.log(platforms)
                    //Create new platform at the top of the grid
                    let newPlatform = new Platform(600)
                    platforms.push(newPlatform)
                }
            })
        }
    }

    function createPlatforms() {
        for(let i = 0;i < platformCount; i++){
            //Create gap based on the grid height
            let platformGap = 600 / platformCount
            let newPlatformBottom = 100 + (i * platformGap)
            let newPlatform = new Platform(newPlatformBottom)
            //Adding new platforms into the array
            platforms.push(newPlatform)
        }
    }

    function jump() {
        clearInterval(downTimerId)
        isJumping = true
        //Make the doodler jump
        upTimerId = setInterval(function () {
            doodlerBottomSpace += 20
            //Apply the change to the spacing to the doodler element
            doodler.style.bottom = doodlerBottomSpace + 'px'
            if(doodlerBottomSpace > startPoint + 200 || doodlerBottomSpace > 515){
                fall()
            }
        }, 30)
    }

    function fall() {
        clearInterval(upTimerId)
        isJumping = false
        downTimerId = setInterval(function () {
            doodlerBottomSpace -= 5
            doodler.style.bottom = doodlerBottomSpace + 'px'
            //Game ends when doodler falls to the bottom of the grid
            if(doodlerBottomSpace <= 0){
                gameOver()
            }
            platforms.forEach(platform => {
                if(
                    (doodlerBottomSpace >= platform.bottom) &&
                    (doodlerBottomSpace <= platform.bottom + 15) &&
                    (doodlerLeftSpace + 60 >= platform.left) &&
                    (doodlerLeftSpace <= (platform.left + 85)) &&
                    !isJumping
                ) {
                    console.log('Landed')
                    startPoint = doodlerBottomSpace
                    jump()
                }
            })
        }, 30)
    }

    function gameOver() {
        console.log('GAME OVER!')
        isGameOver = true 
        //Removes all elements(children) of the grid
        while(grid.firstChild){
            grid.removeChild(grid.firstChild)
        }
        grid.innerHTML = score //Display the score inside the grid
        //clear intervals so doodler doesn't move anymore
        clearInterval(downTimerId)
        clearInterval(upTimerId)
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
    }

    function control(e) {
        if(e.key === "ArrowLeft"){
            moveLeft()
        }else if(e.key === "ArrowRight"){
            moveRight()
        }else if(e.key === "ArrowUp"){
            moveStraight()
        }
    }

    function moveLeft() {
        if(isGoingLeft){ //Prevents multiple timers
            return
        }
        if(isGoingRight){
            clearInterval(rightTimerId)
            isGoingRight = false
        }
        isGoingLeft = true
        leftTimerId = setInterval(function () {
            if(doodlerLeftSpace >= 0){
                doodlerLeftSpace -= 5
                doodler.style.left = doodlerLeftSpace + 'px'
            }else{
                moveRight()
            }
        }, 20)
    }

    function moveRight() {
        if(isGoingRight){
            return
        }
        if(isGoingLeft){
            clearInterval(leftTimerId)
            isGoingLeft = false
        }
        isGoingRight = true
        rightTimerId = setInterval(function () {
            //340 is 400(width of the grid) minus 60(width of the doodler)
            if(doodlerLeftSpace <= 340){
                doodlerLeftSpace += 5
                doodler.style.left = doodlerLeftSpace + 'px'
            }else{
                moveLeft()
            }
        }, 20)
    }

    function moveStraight() {
        isGoingLeft = false
        isGoingRight = false
        clearInterval(rightTimerId)
        clearInterval(leftTimerId)
    }

    function start() {
        //Create doodler if a game is started
        if (!isGameOver){
            createPlatforms()
            createDoodler()
            setInterval(movePlatforms, 30)
            jump()
            document.addEventListener('keyup', control)
        }
    }


    //Attach start() to a button!

    start()
})
