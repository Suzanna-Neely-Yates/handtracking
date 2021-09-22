let handpose;
let video;
let predictions = [];

function setup() {
    createCanvas(640, 480);
    video = createCapture(VIDEO);
    video.size(width, height);

    handpose = ml5.handpose(video, modelReady);

    // This sets up an event that fills the global variable "predictions"
    // with an array every time new hand poses are detected
    handpose.on("predict", results => {
        predictions = results;
    });

    // Hide the video element, and just show the canvas
    video.hide();

}

function modelReady() {
    console.log("Model ready!");
}

function draw() {
    // flip camera
    translate(video.width, 0);
    scale(-1, 1);
    image(video, 0, 0);

    // create gradient
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");

    //var grd = ctx.createLinearGradient(0, 0, 170, 0);
    var grd = ctx.createLinearGradient(0, 0, 630, 0);
    grd.addColorStop(0, "blue");
    grd.addColorStop(.5, "purple");
    grd.addColorStop(1, "red");

    ctx.fillStyle = grd;
    //ctx.fillRect(20, 20, 150, 100);
    ctx.fillRect(20, 20, 610, 100);

    // We can call both functions to draw all keypoints and the skeletons
    drawKeypoints();



    let cordsX = []
    let cordsY = []


    for (let i = 0; i < predictions.length; i += 1) {
        const prediction = predictions[i];
        for (let j = 0; j < prediction.landmarks.length; j += 1) {
            const keypoint = prediction.landmarks[j];
            cordsX.push(keypoint[0]);
            cordsY.push(keypoint[1]);
        }
    }
    console.log("Cords")
    console.log(cordsX)
    let avgX = 0;
    let avgY = 0;
    for (let i = 0; i < cordsX.length; i += 1) {
        avgX = avgX + cordsX[i];
        avgY = avgY + cordsY[i];
    }
    avgX = avgX / cordsX.length;
    avgY = avgY / cordsX.length;
    console.log("avg")
    console.log(avgX)
    let varianceX = 0;
    let varianceY = 0;
    for (let i = 0; i < cordsX.length; i += 1) {
        varianceX += cordsX[i] - avgX;
        varianceY += cordsY[i] - avgY;
    }
    varianceX = (varianceX / cordsX.length);
    varianceY = (varianceY / cordsY.length);
    console.log("variance")
    console.log(varianceX);

}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
    for (let i = 0; i < predictions.length; i += 1) {
        const prediction = predictions[i];
        for (let j = 0; j < prediction.landmarks.length; j += 1) {
            const keypoint = prediction.landmarks[j];
            fill(0, 255, 0);
            noStroke();
            ellipse(keypoint[0], keypoint[1], 10, 10);
        }
    }
}
