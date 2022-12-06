class Canvas {
    constructor(width, height) {
        this.width = width
        this.height = height
        this.canvas = document.getElementById("myCanvas");
        this.ctx = this.canvas.getContext("2d")

    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawSquare(x, y, color, size) {
        this.ctx.fillStyle = color
        this.ctx.fillRect(x, y, size, size)
    }

    drawCircle(x, y, radius, color) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    drawTriangle(x, y, size, color, angle) {
        this.ctx.save()
        this.ctx.fillStyle = color
        this.ctx.translate(x, y)
        this.ctx.rotate(angle - Math.PI/2)
        this.ctx.beginPath()
        this.ctx.moveTo(0, size)
        this.ctx.lineTo(size * .5, -size)
        this.ctx.lineTo(-size * .5, -size)
        this.ctx.lineTo(0, size)
        this.ctx.fill()

        this.ctx.restore()
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