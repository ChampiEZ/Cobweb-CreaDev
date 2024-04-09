export class Hand {
    constructor(x, y, length, angle, color) {
        this.x = x;
        this.y = y;
        this.length = length;
        this.angle = angle;
        this.color = color;
    }

    draw(context) {
        context.beginPath();
        context.lineWidth = this.width;
        context.strokeStyle = this.color;
        context.moveTo(this.x, this.y);
        context.lineTo(this.x + Math.cos(this.angle) * this.length, 
                       this.y + Math.sin(this.angle) * this.length);
        context.stroke();
    }
}
