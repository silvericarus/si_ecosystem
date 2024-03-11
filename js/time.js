function trackSunMoonCycle(secondsPerDay) {
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

    setInterval(() => {
        currentSeconds += 1;
        timeLiveData.innerHTML = `${currentSeconds}`;
        if (currentSeconds >= totalSecondsInDay) {
            currentSeconds = 0;
            currentDay += 1;
            dateLiveData.innerHTML = `${currentDay}`;
            console.log('currentDay:', currentDay);
        }
        interpolationFactor = currentSeconds / totalSecondsInDay;
        interpolationFactor = Math.max(0, Math.min(1, interpolationFactor));
        if (currentSeconds < totalSecondsInDay / 2) {
            interpolatedColor = interpolateColor(dayColor, nightColor, interpolationFactor * 2);
        } else {
            interpolatedColor = interpolateColor(nightColor, dayColor, (interpolationFactor - 0.5) * 2);
        }
        lightLiveData.innerHTML = `${(((interpolatedColor[0] + interpolatedColor[1] + interpolatedColor[2]) / 3) * 100).toFixed(2)}%`;
        gl.clearColor(interpolatedColor[0], interpolatedColor[1], interpolatedColor[2], 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }, 1000);
}

function interpolateColor(color1, color2, t) {
    var r = color1[0] * (1 - t) + color2[0] * t;
    var g = color1[1] * (1 - t) + color2[1] * t;
    var b = color1[2] * (1 - t) + color2[2] * t;
    return [r, g, b];
}