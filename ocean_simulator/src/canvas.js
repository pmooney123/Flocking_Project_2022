class Canvas {
    constructor(width, height) {
        this.width = width
        this.height = height
        this.canvas = document.getElementById("myCanvas");
        this.ctx = this.canvas.getContext("2d")

    }
    getCanvas() {
        return this.canvas
    }

    getCtx() {
        return this.ctx
    }
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    drawSquare(x, y, color, size) {
        this.ctx.fillStyle = color
        this.ctx.fillRect(x, y, size, size)
    }
    drawSquareRotate(x, y, color, size, angle) {

        let rectSize = size;
        let centerX = this.width / 2;
        let centerY = this.height / 2;
        let rectCenterX = centerX - (rectSize / 2);
        let rectCenterY = centerY - (rectSize / 2);
        let rotation = angle;

        this.ctx.save();

        this.ctx.fillStyle = color;

        this.ctx.translate(centerX - rectCenterX, centerY - rectCenterX);

        this.ctx.rotate(rotation);

//		context.fillRect(rectCenterX, rectCenterY, rectSize, rectSize);
        this.ctx.fillRect(-rectSize/2, -rectSize/2, rectSize, rectSize);

        this.ctx.restore();

    }

    drawCircle(x, y, radius, color) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    drawText(x, y, text, color) {
        this.ctx.fillStyle = color
        this.ctx.fillText(text, x, y)
    }

    drawLine(x1, y1, x2, y2) {
        this.ctx.beginPath(); // Start a new path
        this.ctx.moveTo(x1, y1); // Move the pen to (30, 50)
        this.ctx.lineTo(x2, y2); // Draw a line to (150, 100)
        this.ctx.stroke(); // Render the pat
    }

}

export {Canvas}