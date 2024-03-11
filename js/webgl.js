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
	drawEarth();
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

function drawEarth() {
	const vsSource = `
			attribute vec4 aPosition;
			void main() {
				gl_Position = aPosition;
			}
	`;
	const fsSource = `
			precision mediump float;
			void main() {
				gl_FragColor = vec4(0.5, 0.5, 0.5, 1.0);
			}
	`;
	function compileShader(gl, source, type) {
		const shader = gl.createShader(type);
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
			gl.deleteShader(shader);
			return null;
		}
		return shader;
	}
	const vertexShader = compileShader(gl, vsSource, gl.VERTEX_SHADER);
	const fragmentShader = compileShader(gl, fsSource, gl.FRAGMENT_SHADER);
	const program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(program));
		return null;
	}
	const positions = [
		-1.0, -1.0, 0.0,
		1.0, -1.0, 0.0,
		-1.0, 1.0, 0.0,
		1.0, 1.0, 0.0
	];
	const positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
	gl.useProgram(program);
	const positionAttributeLocation = gl.getAttribLocation(program, 'aPosition');
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.enableVertexAttribArray(positionAttributeLocation);
	gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}