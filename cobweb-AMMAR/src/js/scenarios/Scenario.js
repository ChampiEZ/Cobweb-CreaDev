import Scene from "../canvas/Scene"; // Importing Scene class
import { deg2rad } from "../utils/MathUtils"; // Importing utility function for degree to radian conversion
import { ClockFace } from "../canvas/shapes/clockFace"; // Importing ClockFace class
import { Hand } from "../canvas/shapes/hand"; // Importing Hand class
import { Wire } from "../canvas/shapes/wire"; // Importing Wire class

export default class Scenario extends Scene {
    constructor(id, timeZone = 'Europe/Paris') {
        super(id);

        this.cobwebLineWidth = 0.2; // Line width for the cobweb

        this.timeZone = timeZone; // Timezone for the clock
        
        // Debugging options
        if (this.debug.active) {
            const timeZoneOptions = { // Available timezone options for debugging
                'France': 'Europe/Paris',
                'USA': 'America/New_York',
                'Australia': 'Australia/Sydney',
                'China': 'Asia/Shanghai',
                'Japan': 'Asia/Tokyo',
            };
            this.debugFolder.add(this, 'timeZone', timeZoneOptions).onChange(value => {
                // Update the timezone
                this.timeZone = value;
                // Redraw the clock with the new timezone
                this.drawUpdate();
            });

            // Debugging options for colors
            this.debugFolder.addColor(this.colors.hands, 'hour').name('Hand hour');
            this.debugFolder.addColor(this.colors.hands, 'minute').name('Hand minute');
            this.debugFolder.addColor(this.colors.hands, 'second').name('Hand second');
            this.debugFolder.addColor(this.colors.clockFace, 'hoursColor').name('Hours markers');
            this.debugFolder.addColor(this.colors.clockFace, 'minuteColor').name('Minute markers');
            this.debugFolder.addColor(this.colors, 'centerCircle').name('Center circle');
            this.debugFolder.addColor(this.colors, 'cobweb').name('Cobweb');
            this.debugFolder.add(this, 'cobwebLineWidth').min(0.1).max(4).name("Cobweb Size");
        }
    }

    resize() {
        super.resize();

        // Main dimensions calculation
        this.mainRadius = this.width < this.height ? this.width : this.height;
        this.mainRadius *= .5;
        this.mainRadius *= .65;
        this.deltaRadius = this.mainRadius * .075;

        // Refresh the drawing
        this.drawUpdate();
    }

    update() {
        if (!super.update()) return;
        this.drawUpdate();
    }

    drawUpdate() {
        this.clear(); // Clear the canvas

        // Draw clock face
        new ClockFace(this.colors.clockFace.hoursColor, this.colors.clockFace.minuteColor, this.mainRadius).draw(this.context);

        // Draw cobweb
        this.cobweb();

        // Draw clock hands for the specified timezone
        this.drawHands(this.timeZone);

        // Draw central circle
        this.context.beginPath();
        this.context.arc(this.width / 2, this.height / 2, 5, 0, 2 * Math.PI);
        this.context.fillStyle = this.colors.centerCircle;
        this.context.fill();
        this.context.closePath();
    }

    drawHands() {
        const centerX = this.width / 2;
        const centerY = this.height / 2;

        // Get current time in the specified timezone
        const now = new Date();
        const timeZoneOptions = { timeZone: this.timeZone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        const timeString = new Intl.DateTimeFormat('en-US', timeZoneOptions).format(now);
        const [hour, minute, second] = timeString.split(':').map(num => parseInt(num, 10));

        let hourAngle = (hour % 12 + minute / 60) * Math.PI / 6 - Math.PI / 2;
        let minuteAngle = (minute + second / 60) * Math.PI / 30 - Math.PI / 2;

        let milliseconds = now.getMilliseconds();
        let secondMs = now.getSeconds() + milliseconds / 1000;
        let secondAngle = deg2rad(secondMs * 6 - 90);

        this.context.lineWidth = 3;

        // Create and draw hour hand
        new Hand(centerX, centerY, this.mainRadius * 0.5, hourAngle, this.colors.hands.hour).draw(this.context);

        // Create and draw minute hand
        new Hand(centerX, centerY, this.mainRadius * 0.75, minuteAngle, this.colors.hands.minute).draw(this.context);

        // Create and draw second hand
        new Hand(centerX, centerY, this.mainRadius * 0.9, secondAngle, this.colors.hands.second).draw(this.context);
    }

    cobweb() {
        this.wires = [];
        const numHours = 12;
        
        // Create hour wires
        for (let i = 0; i < numHours; i++) {
            let angle = deg2rad(i * 30);
            let xStart = this.width / 2 + Math.cos(angle) * (this.mainRadius * 0.8);
            let yStart = this.height / 2 + Math.sin(angle) * (this.mainRadius * 0.8);
    
            let now = new Date();
            let milliseconds = now.getMilliseconds();
            let second = now.getSeconds() + milliseconds / 1000;
            let secondAngle = deg2rad(second * 6 - 90);
    
            let xEnd = this.width / 2 + Math.cos(secondAngle) * (this.mainRadius * 0.5);
            let yEnd = this.height / 2 + Math.sin(secondAngle) * (this.mainRadius * 0.5);
    
            let wire = new Wire(xStart, yStart, xEnd, yEnd, this.colors.cobweb, this.cobwebLineWidth);
            wire.draw(this.context);
            this.wires.push(wire);
        }
    
        // Draw intermediate lines based on final wire positions
        this.context.beginPath();
        
        for (let i = 0; i < this.wires.length; i++) {
            const nextIndex = (i + 1) % this.wires.length;
            // Calculate intermediate point along current wire
            let midXCurrentwire = (this.wires[i].xStart + this.wires[i].xEnd) / 2;
            let midYCurrentwire = (this.wires[i].yStart + this.wires[i].yEnd) / 2;
            // Calculate intermediate point along next wire
            let midXNextwire = (this.wires[nextIndex].xStart + this.wires[nextIndex].xEnd) / 2;
            let midYNextwire = (this.wires[nextIndex].yStart + this.wires[nextIndex].yEnd) / 2;
    
            // Start drawing from midpoint of current wire
            if (i === 0) {
                this.context.moveTo(midXCurrentwire, midYCurrentwire);
            }
            // Connect to midpoint of next wire
            this.context.lineTo(midXNextwire, midYNextwire);
        }
        this.context.closePath();
        this.context.strokeStyle = this.colors.cobweb;
        this.context.lineWidth = this.cobwebLineWidth;
        this.context.stroke();
    }
}
