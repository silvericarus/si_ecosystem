function drawPlane(cntxt, canvasWidth, canvasHeight) {
    cntxt.fillStyle = "#926829";
    const tileSize = 72; // Size of the tiles
    const rectWidth = tileSize * 2;
    const rectHeight = tileSize;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    const isoX = centerX - rectWidth;
    const isoY = centerY - (rectHeight / 2);
    cntxt.beginPath();
    cntxt.moveTo(isoX, isoY + (rectHeight / 2));
    cntxt.lineTo(isoX + rectWidth, isoY);
    cntxt.lineTo(isoX + (2 * rectWidth), isoY + (rectHeight / 2));
    cntxt.lineTo(isoX + rectWidth, isoY + rectHeight);
    cntxt.closePath();
    cntxt.fill();
}

function drawSquare(cntxt, x, y, tileSize) {
    // Cálculo de las coordenadas isométricas del centro del rombo
    const isoX = (x - y) * tileSize;
    const isoY = (x + y) / 2 * tileSize;

    // Calcular las coordenadas de los vértices del rombo
    const halfSize = tileSize / 2;
    const topX = isoX + halfSize;
    const topY = isoY;
    const rightX = isoX + tileSize;
    const rightY = isoY + halfSize;
    const bottomX = isoX + halfSize;
    const bottomY = isoY + tileSize;
    const leftX = isoX;
    const leftY = isoY + halfSize;
    
    // Dibujar el rombo
    cntxt.fillStyle = "red";
    cntxt.beginPath();
    cntxt.moveTo(topX, topY);
    cntxt.lineTo(rightX, rightY);
    cntxt.lineTo(bottomX, bottomY);
    cntxt.lineTo(leftX, leftY);
    cntxt.closePath();
    cntxt.fill();
}

function drawBackground(cntxt, interpolatedColor, canvasWidth, canvasHeight) {
    cntxt.fillStyle = `rgb(${interpolatedColor[0] * 255}, ${interpolatedColor[1] * 255}, ${interpolatedColor[2] * 255})`;
    cntxt.fillRect(0, 0, canvasWidth, canvasHeight);
}

function trackSunMoonCycle(secondsPerDay, cntxt) {
    const totalSecondsInDay = secondsPerDay;
    let currentSeconds = 0;
    let currentDay = 1
    var interpolationFactor = 0;   
    var dayColor = [1, 0.6901960784313725, 0.1803921568627451];
    var nightColor = [0.0, 0.0, 0.0];
    var interpolatedColor = [0.0, 0.0, 0.0];
    const dateLiveData = document.getElementById('date');
    const timeLiveData = document.getElementById('time');
    const lightLiveData = document.getElementById('light');
    const canvas = cntxt.canvas;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const dpi = window.devicePixelRatio;
    cntxt.canvas.width = canvasWidth * dpi;
    cntxt.canvas.height = canvasHeight * dpi;
    cntxt.scale(dpi, dpi);
    setInterval(() => {
        currentSeconds += 1;
        timeLiveData.innerHTML = `${currentSeconds}`;
        if (currentSeconds >= totalSecondsInDay) {
            currentSeconds = 0;
            currentDay += 1;
            dateLiveData.innerHTML = `${currentDay}`;
            // console.log('currentDay:', currentDay);
        }
        interpolationFactor = currentSeconds / totalSecondsInDay;
        interpolationFactor = Math.max(0, Math.min(1, interpolationFactor));
        if (currentSeconds < totalSecondsInDay / 2) {
            interpolatedColor = interpolateColor(dayColor, nightColor, interpolationFactor * 2);
        } else {
            interpolatedColor = interpolateColor(nightColor, dayColor, (interpolationFactor - 0.5) * 2);
        }
        lightLiveData.innerHTML = `${(((interpolatedColor[0] + interpolatedColor[1] + interpolatedColor[2]) / 3) * 100).toFixed(2)}%`;
        drawBackground(cntxt, interpolatedColor , canvasWidth, canvasHeight);
        drawPlane(cntxt, canvasWidth, canvasHeight);
        drawSquare(cntxt, 1, 1, 10);
    }, 1000);
}

function interpolateColor(color1, color2, t) {
    var r = color1[0] * (1 - t) + color2[0] * t;
    var g = color1[1] * (1 - t) + color2[1] * t;
    var b = color1[2] * (1 - t) + color2[2] * t;
    return [r, g, b];
}