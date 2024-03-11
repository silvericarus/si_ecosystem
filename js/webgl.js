var gl;

function start() {
    startGL();
    trackSunMoonCycle(64);
}

function startGL() {
  var canvas = document.getElementById("earth");

  gl = initWebGL(canvas);      // Initialize the GL context

  // Only continue if WebGL is available and working
  if (gl) {
    //Set the base color to day time
    gl.clearColor(1, 0.6901960784313725, 0.1803921568627451, 1.0); 
    // Enabling the depth test
    gl.enable(gl.DEPTH_TEST); 
    // Near objects obscure distant objects
    gl.depthFunc(gl.LEQUAL); 
    // Clear the color as well as the depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
    // Set the view port
    gl.viewport(0, 0, canvas.width, canvas.height);
    }
}

function initWebGL(canvas) {
    gl = null;
    try {
        // Try to grab the standard context. If it fails, fallback to experimental.
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    } catch (e) {}
    // If you don't have a GL context, give up now
    if (!gl) {
        alert("Imposible inicializar WebGL. Tu navegador puede no soportarlo.");
        gl = null;
    }
    return gl;
}  