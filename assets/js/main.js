var stage = new createjs.Stage('mainStage'),
    mainBtnWidth = stage.canvas.width/2,
    mainBtnHeight = stage.canvas.height/2 - 60;

var mainBtn = new createjs.Container();
var mainBtnBg = new createjs.Shape();
mainBtnBg.graphics.beginFill('DeepSkyBlue').drawRect(0, 0, mainBtnWidth, mainBtnHeight);
var mainBtnTextUp = new createjs.Text(),
    mainBtnTextDown = new createjs.Text();

mainBtn.set({
    x: stage.canvas.width/4,
    y: stage.canvas.height/4,
});

mainBtn.on('click', function() {
    resetStage();
    newGame();
});

mainBtnTextUp.set({
    text: 'Are you ready?',
    font: '20px Arial',
    color: '#ff7700',
    x: 50,
    y: 20
});

mainBtnTextDown.set({
    text: 'Click here to continue...',
    font: '13px Arial',
    x: 55,
    y: 50
})


mainBtn.addChild(mainBtnBg, mainBtnTextUp, mainBtnTextDown);
stage.addChild(mainBtn);

function init() {
    // Tween JS
    // createjs.Tween.get(circle, { loop: true })
    //     .to({ x: 400 }, 1000, createjs.Ease.getPowInOut(4))
    //     .to({ alpha: 0, y: 175 }, 500, createjs.Ease.getPowInOut(2))
    //     .to({ alpha: 0, y: 225 }, 100)
    //     .to({ alpha: 1, y: 200 }, 500, createjs.Ease.getPowInOut(2))
    //     .to({ x: 100 }, 800, createjs.Ease.getPowInOut(2));

    // createjs.Ticker.setFPS(60);
    // createjs.Ticker.addEventListener("tick", stage);

    stage.update();
}

function resetStage() {
    stage.removeAllChildren();
    stage.update();
}

function newGame() {
    var colors = ['red', 'green', 'blue', 'yellow'],
        shapes = ['circle', 'rectangle'],
        resultNumber = Math.floor(Math.random() * 8) + 1,
        resultColor = colors[Math.floor(Math.random() * colors.length)],
        resultShape = shapes[Math.floor(Math.random() * shapes.length)],
        limitItem = 10;

    var questionText = new createjs.Text();
    questionText.set({
        text: 'How many ' + resultColor + ' ' + resultShape + ' did you see?',
        font: '20px Arial',
        x: 80,
        y: 20
    })

    // Arrange and Shuffle colors and shapes result array
    var tmpColors = [], tmpShapes = [];
    for (var i = 0; i < resultNumber; i++) {
        tmpColors.push(resultColor);
        tmpShapes.push(resultShape);
    }

    do {
        var randomColor = colors[Math.floor(Math.random() * colors.length)],
            randomShape = shapes[Math.floor(Math.random() * shapes.length)];

        if (randomColor !== resultColor && randomShape != resultShape) {
            tmpColors.push(randomColor);
            tmpShapes.push(randomShape);
        }
    } while (tmpColors.length < 10);

    var indexArr = Array.apply(null, {length: 10}).map(Number.call, Number),
        indexShuffleArr = shuffleArray(indexArr);

    // Draw colors and shapes
    var stepX = 90,
        currentRow = 1,
        itemPerRow = 5;
    for (var i = 0; i < indexShuffleArr.length; i++) {
        var tmpIndex = indexShuffleArr[i];
        var tmpShape = new createjs.Shape(),
            tmpShapeX = stepX * (i - (currentRow - 1) * itemPerRow) + 40,
            tmpShapeY = 100 + (currentRow - 1) * 60;

        // Arrange 5 shapes per row
        if (tmpShapes[tmpIndex] == 'circle') {
            tmpShape.graphics.beginFill(tmpColors[tmpIndex]).drawCircle(0, 0, 20);

            tmpShapeX += 20;
        } else {
            tmpShape.graphics.beginFill(tmpColors[tmpIndex]).drawRect(0, 0, 40, 40);

            tmpShapeY -= 20;
        }

        tmpShape.set({
            x: tmpShapeX,
            y: tmpShapeY
        });

        stage.addChild(tmpShape);

        if ((i + 1) % itemPerRow == 0) {
            currentRow++;
        }
    }

    // Arrange and Shuffle result total array
    var tmpNumberArr = [resultNumber];

    do {
        var randomNumber = Math.floor(Math.random() * 10) + 1;
        var conflict = false;

        for (var i = 0; i < tmpNumberArr.length; i++) {
            if (tmpNumberArr[i] == randomNumber) {
                conflict = true;
                break;
            }
        }

        if (!conflict) {
            tmpNumberArr.push(randomNumber);
        }
    } while (tmpNumberArr.length < 4);

    var resultNumberArr = shuffleArray(tmpNumberArr);

    // Draw bottom button result to click
    var baseX = 110;
    for (var i = 0; i < resultNumberArr.length; i++) {
        var tmpBtn = new createjs.Container(),
            tmpBtnBg = new createjs.Shape(),
            tmpBtnText = new createjs.Text()
            tmpNumber = resultNumberArr[i];

        tmpBtnBg.graphics.beginFill('DeepSkyBlue').drawRect(0, 0, 70, 40);
        tmpBtnText.set({
            text: resultNumberArr[i],
            font: '15px Arial',
            x: 30,
            y: 10
        });

        tmpBtn.addChild(tmpBtnBg, tmpBtnText);
        tmpBtn.on('click', function(pickNumber, correctNumber) {
            resetStage();

            if (pickNumber == correctNumber) {
                mainBtnTextUp.text = 'Correct!!!';
                mainBtnTextUp.x = 80;
                mainBtnTextUp.color = 'green';
            } else {
                mainBtnTextUp.text = 'Oops, correct answer is ' + correctNumber;
                mainBtnTextUp.x = 5;
                mainBtnTextUp.color = 'red';
            }

            stage.addChild(mainBtn);
            stage.update();
        }.bind(null, resultNumberArr[i], resultNumber));
        tmpBtn.set({
            x: baseX * i + 40,
            y: 240
        })


        stage.addChild(tmpBtn);
    }

    // Answer Text display
    var answerText = new createjs.Text();
    answerText.set({
        text: 'Your answer is ...',
        font: '15px Arial',
        x: 180,
        y: 200
    })

    stage.addChild(questionText);
    stage.addChild(answerText);

    stage.update();
}

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
