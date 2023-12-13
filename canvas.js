let isDrawing = false;
let canDraw = true;
let lastXPos = 0;
let lastYPos = 0;

// Canvas
const canvasEl = document.querySelector("#canvas"); // Canvas element
const context = canvasEl.getContext("2d"); // The content within the canvas

export function disableDrawing() {
    canDraw = false;
}

export function getImageUrl() {
    return canvasEl.toDataURL("image/png");
}

export function initCanvas() {
    function fixCanvasScaling() {
        context.scale(devicePixelRatio, devicePixelRatio);
        context.lineWidth = 2; // Set the line width to make it thicker
        context.strokeStyle = "#000"; // Set the line color to black
        context.lineJoin = "round"; // Round the corners when two lines meet
        context.lineCap = "round"; // Round the ends of the lines
        let heightRatio = 0.7;
        canvasEl.height = canvasEl.width * heightRatio;
    }
    canvasEl.addEventListener("pointerdown", function (e) {
        isDrawing = true;
        lastXPos = ((e.offsetX * canvasEl.width) / canvasEl.clientWidth) | 0;
        lastYPos = ((e.offsetY * canvasEl.height) / canvasEl.clientHeight) | 0;
        context.beginPath();
        context.moveTo(lastXPos, lastYPos);
        drawingSound.play();
    });
    canvasEl.addEventListener("pointermove", function (e) {
        if (canDraw && isDrawing) {
            const x = ((e.offsetX * canvasEl.width) / canvasEl.clientWidth) | 0;
            const y =
                ((e.offsetY * canvasEl.height) / canvasEl.clientHeight) | 0;
            context.quadraticCurveTo(
                lastXPos,
                lastYPos,
                (lastXPos + x) / 2,
                (lastYPos + y) / 2
            );
            lastXPos = x;
            lastYPos = y;
            context.stroke();
        }
    });
    canvasEl.addEventListener("pointerup", function () {
        if (isDrawing) {
            context.lineTo(lastXPos, lastYPos);
            context.stroke();
            context.closePath();
            drawingSound.pause();
            drawingSound.currentTime = 0;
            isDrawing = false;
        }
    });

    fixCanvasScaling();
}

export function initTouchHandlers() {
    // Handles the start of a touch event on the canvas
    function handleTouchStart(e) {
      e.preventDefault(); // Prevents default touch behavior, like scrolling
      isDrawing = true; // Sets the drawing flag to true
      const touchPos = getTouchPos(e); // Gets the touch position
      startDrawing(touchPos); // Starts the drawing process at the touch position
      drawingSound.play();
    }
  
    // Handles the movement of a touch on the canvas
    function handleTouchMove(e) {
      e.preventDefault(); // Prevents default touch behavior
      if (canDraw && isDrawing) {
        const touchPos = getTouchPos(e); // Gets the new touch position
        continueDrawing(touchPos); // Continues the drawing process at the new position
      }
    }
  
    // Handles the end of a touch event on the canvas
    function handleTouchEnd(e) {
      e.preventDefault(); // Prevents default touch behavior
      if (isDrawing) {
        drawingSound.pause();
        drawingSound.currentTime = 0;
        isDrawing = false; // Resets the drawing flag
      }
    }
  
    // Calculates the touch position relative to the canvas
    function getTouchPos(touchEvent) {
      const rect = canvasEl.getBoundingClientRect(); // Gets the canvas bounding rectangle
      const touch = touchEvent.touches[0]; // Gets the first touch point
      return {
        x: touch.clientX - rect.left, // Calculates the X coordinate relative to the canvas
        y: touch.clientY - rect.top, // Calculates the Y coordinate relative to the canvas
      };
    }
  
    // Initializes touch event handlers for canvas drawing
  
    canvasEl.addEventListener("touchstart", handleTouchStart, false);
    canvasEl.addEventListener("touchmove", handleTouchMove, false);
    canvasEl.addEventListener("touchend", handleTouchEnd, false);
}
