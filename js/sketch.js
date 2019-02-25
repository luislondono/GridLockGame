squareSize = 200
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

var canvas;

cars= ["redCar","greenCar","orangeCar"]

pieces = { 
    "redCar"    : new piece("redCar",2,false,0,2,[255,59,59]),
    "greenCar"  : new piece("greenCar",2,true,2,1,[0,255,128]),
    "orangeCar" : new piece("orangeCar",2,false,1,0,[255,165,0])
}

function piece(name, length, isVertical, intXpos, intYpos,[r,g,b]){
    this.name = name
    this.intXpos = intXpos
    this.intYpos = intYpos
    this.pLotX = grassPadding + lotPadding +  intXpos * squareSize + squarePadding;
    this.pLotY = grassPadding + lotPadding +  intYpos * squareSize+ squarePadding;
    this.red = r
    this.green = g
    this.blue = b
    this.isVertical = isVertical
    this.length = length
    this.height = isVertical? length * squareSize - 2 * squarePadding: 1 * squareSize - 2 * squarePadding;
    this.width = isVertical? 1 * squareSize - 2 * squarePadding: length * squareSize - 2 * squarePadding;
    this.needsUpdating = false;
}


function setup(){


    var canvas = createCanvas(canvasDimensions + 3 * squareSize ,canvasDimensions);

    canvas.class('parking-lot');

    drawBackground();
    // Make Exit



    drawCars();
    // noLoop();
}


function drawBackground(){

    canvas = createCanvas(canvasDimensions + 3 * squareSize ,canvasDimensions);

    fill(255,255,255);

    rect(grassPadding,grassPadding,parkingLotDimensions,parkingLotDimensions,
        15,15,15,15
        )

   fill(212,212,212);

    for(y = 0; y<6; y++){
        for(x = 0; x<6; x++){
            rect(
                grassPadding + lotPadding + (x * squareSize) ,
                grassPadding + lotPadding + (y * squareSize) ,
                // squareSize - (2* squarePadding),
                // squareSize - (2* squarePadding),
                squareSize ,
                squareSize ,
                // 15,15,15,15
                );
        }
    }

    fill(255, 255, 255);
    rect(parkingLotDimensions + grassPadding ,
        grassPadding + 2*squareSize + lotPadding,
        squareSize/6,
        squareSize);
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

function draw(){
    drawBackground();
    if (snapPiecesToGrid){
        updateCars()
    }
    else{
        updateTimer = 0;
    }
    drawCars();

    if (levelComplete){
        endingAnimation();
    }
}

function updateCars(){
    updatesDone = true;
    for (index = 0; index  < cars.length ; index++) {
        piece = pieces[cars[index]]
        piece.intXpos = round((piece.pLotX - grassPadding - lotPadding) / squareSize);
        piece.intYpos = round((piece.pLotY - grassPadding - lotPadding) / squareSize);
        // updateTimer += 1;
        // console.log(updateTimer)
        // console.log("Calling updateCars")
        if(piece.needsUpdating){
            // console.log("Need to update: " + piece.name + " Pos: " + piece.pLotX + ", " + piece.pLotY)
        }
        if (piece.needsUpdating){
            // console.log("One pixel update")
            updatesDone = false;
            if(piece.isVertical){
                moveUp = grassPadding + lotPadding + squarePadding + piece.intYpos*squareSize < piece.pLotY
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
    hoveredCar = carAtCursor()
    // console.log("Clicked at: " + mouseX + ", " + mouseY + " on: " + ((hoveredCar != null)? hoveredCar.name : "null"))
    carBeingMoved = hoveredCar;
    buttonDownXinitial = mouseX;
    buttonDownYinitial = mouseY;
    if (hoveredCar != null){
        carXinitial = hoveredCar.pLotX;
        carYinitial = hoveredCar.pLotY;
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
        // console.table([carBeingMoved])
    }
    snapPiecesToGrid = true;
    // carBeingMoved = null;
    buttonDownXinitial = null;
    buttonDownYinitial = null;
    carXinitial = null;
    carYinitial = null;
    mouseDragLimitReached = false;
  }

function endingAnimation(){
    if (pieces["redCar"].pLotX < grassPadding + lotPadding + 7 * squareSize){
        pieces["redCar"].pLotX += 5;
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