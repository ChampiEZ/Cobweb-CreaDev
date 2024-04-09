export class Wire {
    constructor(xStart, yStart, xEnd, yEnd, color, lineWidth) {
        this.xStart = xStart;
        this.yStart = yStart;
        this.xEnd = xEnd;
        this.yEnd = yEnd;
        this.color = color;
        this.lineWidth = lineWidth;
    }

    draw(context) {
        context.beginPath();
        context.lineWidth = this.lineWidth;
        context.strokeStyle = this.color;
        context.moveTo(this.xStart, this.yStart);
        context.lineTo(this.xEnd, this.yEnd);
        context.stroke();
    }
}
