function drawPlane(cntxt, canvasWidth, canvasHeight) {
    cntxt.fillStyle = "#926829";
    cntxt.fillRect(0, 0, canvasWidth, canvasHeight);
  }
  
  function drawSquare(cntxt, x, y, size) {
    cntxt.fillStyle = "#ff0000";
    cntxt.fillRect(x, y, size, size);
  }
  
  function trackSunMoonCycle(secondsPerDay, cntxt) {
    const totalSecondsInDay = secondsPerDay;
    let currentSeconds = 0;
    let currentDay = 1;
    let interpolationFactor = 0;
    let dayColor = [1, 0.6901960784313725, 0.1803921568627451];
    let nightColor = [0.0, 0.0, 0.0];
    let interpolatedColor = [0.0, 0.0, 0.0];
    const dateLiveData = document.getElementById("date");
    const timeLiveData = document.getElementById("time");
    const lightLiveData = document.getElementById("light");
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
        interpolatedColor = interpolateColor(
          dayColor,
          nightColor,
          interpolationFactor * 2
        );
      } else {
        interpolatedColor = interpolateColor(
          nightColor,
          dayColor,
          (interpolationFactor - 0.5) * 2
        );
      }
      lightLiveData.innerHTML = `${(
        ((interpolatedColor[0] + interpolatedColor[1] + interpolatedColor[2]) /
          3) *
        100
      ).toFixed(2)}%`;
      drawPlane(cntxt, canvasWidth, canvasHeight);
      forest.trees.forEach((tree) => {
        tree.draw();
      });
    }, 1000);
  }
  
  function interpolateColor(color1, color2, t) {
    let r = color1[0] * (1 - t) + color2[0] * t;
    let g = color1[1] * (1 - t) + color2[1] * t;
    let b = color1[2] * (1 - t) + color2[2] * t;
    return [r, g, b];
  }
  