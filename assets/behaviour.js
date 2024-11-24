const MAXMOUSEDELTA = 10;

/**
 * Basic FourierMode class
 */
class FourierMode {
    /**
     * Create a fourier mode
     * @param {number} a - amplitude of mode
     * @param {number} f - frequency of mode
     */
    constructor(a, f){
        this.a = a;
        this.f = f;
    }

    /**
     * Evaluate the mode at time `t`
     * @param {number} t - the time at which to evaluate the mode
     * @returns {vec2} the value (position) of the mode
     */
    eval(t) {
        return new vec2(
            this.a * Math.cos(2*Math.PI*this.f*t),
            this.a * Math.sin(2*Math.PI*this.f*t)
        );
    }
}

/**
 * Move head according to a sum of 2 Fourier modes
 */
class FourierController {
    /**
     * Moves head according to sum of spinning vectors
     * @param {Array<FourierMode>} modes - array of modes
     */
    constructor(modes){
        /** @type {Array<FourierMode>} */
        this.modes = modes;
    }

    /**
     * Creates a FourierController directly from a list of amplitudes and frequencies
     * @param  {...number} coefficients - alternating list of amplitudes and frequencies
     * @returns {FourierController} - the Fourier controller with the given modes
     */
    static FromModeCoefficients(...coefficients){
        if(coefficients.length % 2 != 0) {
            throw new Error(
                "Odd number of parameters provided to FourierController."+
                " Need list of amplitudes and frequencies (alternating)."
            );
        }

        /** @type {Array<FourierMode>} */
        var modes = []
        for (let i = 0; i < coefficients.length; i+=2) {
            modes.push(new FourierMode(coefficients[i], coefficients[i+1]));
        }

        return new FourierController(modes);
    }

    /**
     * Update given position by adding the fourier modes
     * @param {vec2} pos - the position to be updated
     * @param {number} t - a time variable
     * @returns {vec2} the updated position
     */
    updatePosition(pos, t=null) {
        if (t == null) {
            t = window.performance.now()/1000;
        }
        let newpos = pos;
        this.modes.forEach(mode => {
            newpos = newpos.plus(mode.eval(t));
        });
        return newpos;
    }

}

/**
 * Controller that draws the head toward the mouse when mouse is held down.
 */
class MouseController {
    /**
     * Creates a mouse behaviour controller.
     * @param {HTMLCanvasElement} canvas - the canvas to draw on (make sure the transform is already applied)
     */
    constructor(canvas){
        addEventListener("mousedown", (event) => this.handleMouseDown(event));
        addEventListener("mouseup", (event) => this.handleMouseUp(event));
        addEventListener("mousemove", (event) => this.handleMouseMove(event));
        addEventListener("touchstart", (event) => this.handleMouseDown(event.touches[0]));
        addEventListener("touchend", (event) => this.handleMouseUp(event.touches[0]));
        addEventListener("touchmove", (event) => this.handleMouseMove(event.touches[0]));

        /** @type {vec2} */
        this.canvasPos = new vec2(canvas.offsetLeft, canvas.offsetTop);
        /** @type {DOMMatrix} */
        this.canvasMatrix = canvas.getContext("2d").getTransform().inverse();
        /** @type {boolean} */
        this.mouseAttracts = false;
    }

    /**
     * Calculate mouse position in canvas coordinates.
     * @param {vec2} pos - mouse position to be transformed
     * @returns the transformed position
     */
    transformMousePosition(pos){
        var transformed = this.canvasMatrix.transformPoint(
            new DOMPoint(pos.x - this.canvasPos.x, pos.y - this.canvasPos.y)
        );
        console.log("Pos: ", pos.x, pos.y);
        console.log("CanvasPos: ", this.canvasPos.x, this.canvasPos.y);
        console.log("Transformed: ", transformed.x, transformed.y);
        return new vec2(transformed.x, transformed.y);
    }

    /**
     * Event handler for mouse moved event
     * @param {MouseEvent} event - mouse event to be handled
     */
    handleMouseMove(event){
        let pos = new vec2(
            event.clientX, event.clientY
        );
        if (this.mouseAttracts) {
            this.mousePos = this.transformMousePosition(pos);
        }
    }

    /**
     * Event handler for mouse down event
     * @param {MouseEvent} event - mouse event to be handled
     */
    handleMouseDown(event){
        let pos = new vec2(
            event.clientX, event.clientY
        );
        this.mouseAttracts = true;
        this.mousePos = this.transformMousePosition(pos);
    }

    /**
     * Event handler for mouse up event
     * @param {MouseEvent} _event - ignored
     */
    handleMouseUp(_event){
        this.mouseAttracts = false;
    }

    /**
     * Update the position of the head
     * @param {vec2} pos - position to be updated
     * @returns the new position
     */
    updatePosition(pos) {
        if(this.mouseAttracts) {
            let delta = Math.min(
                this.mousePos.minus(pos).norm(),
                MAXMOUSEDELTA
            );
            return pos.plus(this.mousePos.minus(pos).normalise(delta));
        }
        return pos;
    }
}
