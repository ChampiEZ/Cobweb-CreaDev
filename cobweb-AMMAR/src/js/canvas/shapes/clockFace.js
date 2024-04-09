export class ClockFace {
    constructor(hoursColor, minuteColor, radius) {
        this.hoursColor = hoursColor;
        this.minuteColor = minuteColor;
        this.radius = radius;
    }

    draw(context) {
        let centerX = context.canvas.width / 2;
        let centerY = context.canvas.height / 2;

        
        for(let hour = 0; hour < 12; hour++) {
            let angle = (hour * Math.PI / 6) - (Math.PI / 2);
            let hourX = centerX + Math.cos(angle) * (this.radius * 0.8);
            let hourY = centerY + Math.sin(angle) * (this.radius * 0.8);
            let endX = centerX + Math.cos(angle) * this.radius;
            let endY = centerY + Math.sin(angle) * this.radius;

            context.beginPath();
            context.lineWidth = 4;
            context.moveTo(hourX, hourY);
            context.lineTo(endX, endY);
            context.strokeStyle = this.hoursColor;
            context.stroke();
        }

        // Draw minute markers
        for(let minute = 0; minute < 60; minute++) {
            if(minute % 5 !== 0) { 
                let angle = (minute * Math.PI / 30) - (Math.PI / 2);
                let minX = centerX + Math.cos(angle) * (this.radius * 0.9);
                let minY = centerY + Math.sin(angle) * (this.radius * 0.9);
                let endX = centerX + Math.cos(angle) * this.radius;
                let endY = centerY + Math.sin(angle) * this.radius;

                context.beginPath();
                context.lineWidth = 2; 
                context.moveTo(minX, minY);
                context.lineTo(endX, endY);
                context.strokeStyle = this.minuteColor;
                context.stroke();
            }
        }
    }
}