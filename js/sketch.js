

squareSize = 75
squarePadding = squareSize * .08
grassPadding = 30
lotPadding = 20
parkingLotDimensions = (6*squareSize) + (2 * lotPadding)
canvasDimensions = parkingLotDimensions+ 2 *grassPadding

buttonDownXinitial = null;
buttonDownYinitial = null;
carXinitial = null;
carYinitial = null;

carBeingMoved = null;
snapPiecesToGrid = false;
mouseDragLimitReached = false;
mouseDragLimit = null;
updateTimer = 0;
rate = 3;

levelComplete = false;
displayCompletionLabel = false;
levelCompleteTimer = 0;

var canvas;

cars= []

pieces = {
}

function setup(){
    var canvas = createCanvas(canvasDimensions + 3 * squareSize ,canvasDimensions);
    canvas.parent('canvas-container');
    canvas.class('parking-lot');
    drawBackground();
    drawCars();
}

function drawBackground(){
    // creates Canvas
    canvas = createCanvas(canvasDimensions + 3 * squareSize ,canvasDimensions);
    canvas.parent('canvas-container');
    canvas.class('parking-lot');
    
    // Draws parkingLot
    fill(255,255,255);
    rect(grassPadding,grassPadding,parkingLotDimensions,parkingLotDimensions,15,15,15,15)
    // Draws Exit
    rect(parkingLotDimensions + grassPadding ,grassPadding + 2*squareSize + lotPadding, squareSize/6, squareSize);
        
    // Draws tiles
    fill(212,212,212);
    for(y = 0; y<6; y++){
        for(x = 0; x<6; x++){
            rect(grassPadding + lotPadding + (x * squareSize), grassPadding + lotPadding + (y * squareSize),squareSize,squareSize);
        }
    }
}

function draw(){
    drawBackground();
    if (snapPiecesToGrid){
        updateCars()
    }

    else{
        updateTimer = 0;
    }
    drawCars();

    if (levelComplete && levelCompleteTimer >= 0){
        endingAnimation();
    }
    if (displayCompletionLabel){
        document.getElementById('completion-label').style.opacity = '1';
    }
}

function drawCars(){
    for (index = 0; index < cars.length; index++) {
        piece = pieces[cars[index]];
    

        fill(piece.red,piece.green,piece.blue);


        rect(
            piece.pLotX,
            piece.pLotY,
            piece.isVertical? squareSize - squarePadding*2: piece.length*(squareSize) - 2*squarePadding,
            piece.isVertical? piece.length*(squareSize) - 2*squarePadding:squareSize - squarePadding*2,
            15,15,15,15
       );
    }
}


function updateCars(){
    updatesDone = true;
    for (index = 0; index  < cars.length ; index++) {
        piece = pieces[cars[index]]

        if (piece.needsUpdating){

            updatesDone = false;
            if(piece.isVertical){
                // Determine whether it needs to Move up
                moveUp = grassPadding + lotPadding + squarePadding + piece.cachedY*squareSize < piece.pLotY
                piece.pLotY = moveUp ? piece.pLotY - rate : piece.pLotY + rate

                if(moveUp && (abs(piece.pLotY - (grassPadding + lotPadding + squarePadding +  piece.intYpos*squareSize)) <= 1.5*rate)){
                    piece.pLotY = grassPadding + lotPadding + squarePadding+ piece.intYpos*squareSize
                    piece.needsUpdating = false
                    updatesDone = true
                }
                else if(!moveUp && (abs(piece.pLotY - (grassPadding + lotPadding + squarePadding +  piece.intYpos*squareSize)) <= 1.5 * rate)){
                    piece.pLotY = grassPadding + lotPadding + squarePadding + piece.intYpos*squareSize
                    piece.needsUpdating = false
                    updatesDone = true
                }
            }
            else{
                moveLeft = grassPadding + lotPadding + squarePadding + piece.intXpos*squareSize < piece.pLotX
                piece.pLotX = moveLeft ? piece.pLotX - rate : piece.pLotX + rate
                if(moveLeft && (abs(piece.pLotX - (grassPadding + lotPadding + squarePadding + piece.intXpos*squareSize)) <= 1.5 *rate)){
                    piece.pLotX = grassPadding + lotPadding + squarePadding + piece.intXpos*squareSize
                    piece.needsUpdating = false
                    updatesDone = true
                }
                else if (!moveLeft && (abs(piece.pLotX - (grassPadding + lotPadding + squarePadding + piece.intXpos*squareSize)) <= 1.5 *rate)){
                    piece.pLotX = grassPadding + lotPadding + squarePadding + piece.intXpos*squareSize
                    piece.needsUpdating = false
                    updatesDone = true
                }
            }
        }
    }
    if (updatesDone){
        snapPiecesToGrid = false
        // noLoop();
    }
}

function mousePressed() {
    // loop();
    // console.log("Clicked at: " + mouseX + ", " + mouseY + " on: " + ((hoveredCar != null)? hoveredCar.name : "null"))
    if (levelCompleteTimer == -1){
        hoveredCar = null;
    }
    
    if (!levelComplete && (levelCompleteTimer != -1)){
        hoveredCar = carAtCursor()
        carBeingMoved = hoveredCar;
        buttonDownXinitial = mouseX;
        buttonDownYinitial = mouseY;
        if (hoveredCar != null){
            carXinitial = hoveredCar.pLotX;
            carYinitial = hoveredCar.pLotY;
            carintXinitial = hoveredCar.intXpos;
            carintYinitial = hoveredCar.intYpos;
        }
    } 
    
}

function mouseDragged() {
    if(carBeingMoved != null){

        


        xChange = mouseX - buttonDownXinitial;
        yChange = mouseY - buttonDownYinitial;

        if ((carBeingMoved.isVertical && mouseDragLimitReached && abs(yChange) < mouseDragLimit)
        || !carBeingMoved.isVertical && mouseDragLimitReached && abs(xChange) < mouseDragLimit){
            mouseDragLimitReached = false
            mouseDragLimit = null
        }
        
        // if vertical
        if (carBeingMoved.isVertical && (mouseDragLimitReached == false)){
            carBeingMoved.pLotY = carYinitial + yChange
            ylimit = null;

            if (carBeingMoved.pLotY < grassPadding + lotPadding){
                console.log("Being dragged off the top!")
                carBeingMoved.pLotY = grassPadding + lotPadding
            }
            else if ((carBeingMoved.pLotY + (squareSize * carBeingMoved.length) - 2 * (squarePadding)) > grassPadding + lotPadding + squareSize * 6){
                console.log("Being dragged off the bottom!")
                carBeingMoved.pLotY = grassPadding + lotPadding + (squareSize * 6) + (2* squarePadding) - (carBeingMoved.length * squareSize)
            }
            else if (carAtPoint(carBeingMoved.name, carBeingMoved.pLotX, carBeingMoved.pLotY) != null){
                collisionWith = carAtPoint(carBeingMoved.name, carBeingMoved.pLotX, carBeingMoved.pLotY);
                console.log("Crashing into Car from the top! " + ((collisionWith != null)? collisionWith.name : "null" ))
                mouseDragLimitReached = true;
                mouseDragLimit = abs(yChange)
                // console.log("Mouse drag limit = " + mouseDragLimit);
                carBeingMoved.pLotY = collisionWith.pLotY + collisionWith.height
            }

            else if (carAtPoint(carBeingMoved.name, carBeingMoved.pLotX, (carBeingMoved.pLotY + (carBeingMoved.length * squareSize) - squarePadding)) != null){
                collisionWith = carAtPoint(carBeingMoved.name, carBeingMoved.pLotX, (carBeingMoved.pLotY + (carBeingMoved.length * squareSize) - squarePadding));
                console.log("Crashing into Car from the bottom! " + ((collisionWith != null)? collisionWith.name : "null" ))
                mouseDragLimitReached = true;
                mouseDragLimit = abs(yChange)
                carBeingMoved.pLotY = collisionWith.pLotY - carBeingMoved.height
            }
        }


        else if (mouseDragLimitReached == false){
            carBeingMoved.pLotX = carXinitial + xChange

            if (carBeingMoved.pLotX < grassPadding + lotPadding){
                console.log("Being dragged off the left!")
                carBeingMoved.pLotX = grassPadding + lotPadding
            }

            else if (((carBeingMoved.pLotX + (squareSize * carBeingMoved.length) - 2 * (squarePadding)) > grassPadding + lotPadding + squareSize * 6) && carBeingMoved.name != "redCar"){
                console.log("Being dragged off the right!")
                carBeingMoved.pLotX = grassPadding + lotPadding + (squareSize * 6) + (2* squarePadding) - (carBeingMoved.length * squareSize)
            }

            else if (carAtPoint(carBeingMoved.name, carBeingMoved.pLotX, carBeingMoved.pLotY) != null){
                collisionWith = carAtPoint(carBeingMoved.name, carBeingMoved.pLotX, carBeingMoved.pLotY);
                console.log("Crashing into Car on the West! " + collisionWith.name)
                mouseDragLimitReached = true;
                mouseDragLimit = abs(xChange);
                carBeingMoved.pLotX = collisionWith.pLotX + collisionWith.width
            }

            else if (carAtPoint(carBeingMoved.name, carBeingMoved.pLotX + carBeingMoved.length * squareSize - squarePadding * 2, carBeingMoved.pLotY) != null){
                collisionWith = carAtPoint(carBeingMoved.name, carBeingMoved.pLotX + carBeingMoved.length * squareSize - squarePadding * 2, carBeingMoved.pLotY);
                mouseDragLimitReached = true;
                mouseDragLimit = abs(xChange)
                console.log("Crashing into Car on the East! " + collisionWith.name)
                carBeingMoved.pLotX = collisionWith.pLotX - carBeingMoved.width


            }


            else if (((carBeingMoved.pLotX + (squareSize * carBeingMoved.length) - 2 * (squarePadding)) > grassPadding + lotPadding + squareSize * 6) && carBeingMoved.name == "redCar"){
                // console.log("Passed level!")
                levelComplete = true;
                if (((carBeingMoved.pLotX + (squareSize * carBeingMoved.length) - 2 * (squarePadding)) > grassPadding + lotPadding + squareSize * 9)){
                    carBeingMoved.pLotX = grassPadding + lotPadding + (squareSize * 9) + (2* squarePadding) - (carBeingMoved.length * squareSize)
                }
            }
            

        }
    }

}

function mouseReleased() {


    if (carBeingMoved != null){
        carBeingMoved.needsUpdating = true;
    }

    snapPiecesToGrid = true;
    buttonDownXinitial = null;
    buttonDownYinitial = null;
    carXinitial = null;
    carYinitial = null;
    carintXinitial = null;
    carintYinitial = null;
    mouseDragLimitReached = false;

  }

function endingAnimation(){
    levelCompleteTimer += 1
    carBeingMoved = null;
    console.log("Completion Timer: " + levelCompleteTimer);
    if (pieces["redCar"].pLotX < grassPadding + lotPadding + 7 * squareSize){
        pieces["redCar"].pLotX += 5;
    }
    else if (levelCompleteTimer > 55 ){
        displayCompletionLabel = true;
        levelCompleteTimer = -1;
    }
}

function carAtPoint(car,x,y){
    for (index = 0; index < cars.length; index++) {
        if (cars[index] != car){
            piece = pieces[cars[index]]
            leftX = piece.pLotX
            rightX = piece.pLotX + (piece.isVertical? squareSize - 2 * squarePadding: piece.length * squareSize - squarePadding)
            topY = piece.pLotY
            botY = piece.pLotY + (piece.isVertical? piece.length * squareSize - squarePadding: squareSize - squarePadding)

            if ( (leftX <= x) && (x <= rightX)  && (topY <= y) && (y <= botY) ){
                return piece
            }
        }
    }
    return null
}

function carAtCursor(){
    // console.log("( " + String(mouseX) + ", " + String(mouseY) + ")")

    for (index = 0; index < cars.length; index++) {
        piece = pieces[cars[index]]

        leftX = piece.pLotX
        rightX = piece.pLotX + (piece.isVertical? squareSize - 2 * squarePadding: piece.length * squareSize - squarePadding)
        topY = piece.pLotY
        botY = piece.pLotY + (piece.isVertical? piece.length * squareSize - squarePadding: squareSize - squarePadding)

        if((leftX <= mouseX) && (mouseX <= rightX) && (topY <= mouseY) && (mouseY <= botY)){
            return piece
            break
        }
  
    }

    return null
}