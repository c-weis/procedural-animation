class Animator{
    /**
     * A procedural skeleton animator
     * @param {HTMLCanvasElement} canvas - the canvas on which we draw
     */
    constructor(canvas){
        /** @type {CanvasRenderingContext2D} */
        this.ctx = canvas.getContext("2d");
        /** @type {number} */
        this.width = canvas.width;
        /** @type {number} */
        this.height = canvas.height;
        // set (0, 0) to be in the middle and invert the y axis
        this.ctx.translate(this.width/2, this.height/2);
        this.ctx.scale(1, -1);

        // Create animal
        this.head = Creator.Snake(100, this.width/150, this.width/50);

        // Create head controllers
        //this.controller = FourierController.FromModeCoefficients(5, 1/5, 3, 1/6);//, 2, 1/7);
        this.controller = new MouseController(canvas);
    }


    /**
     * Updates the position of the lead node based on input or behaviour.
     */
    updateHeadPosition(){
        this.head.pos = this.controller.updatePosition(this.head.pos);
    }

    /**
     * Adjusts the skeleton, keeping the lead position fixed.
     * @param {Joint} fixedjoint - the lead joint of the skeleton
     * @param {vec2} previousJointPos - position of the previous joint
     */
    adjustSkeleton(fixedjoint = this.head, previousJointPos= null){
        var bone = fixedjoint.bone;
        if (bone != null) {
            let joint = bone.joint;
            joint.pos = joint.pos.constrainLength(fixedjoint.pos, bone.length);

            if (fixedjoint.minAngle != null && previousJointPos != null) {
                joint.pos = joint.pos.constrainAngle(
                    fixedjoint.pos, previousJointPos.minus(fixedjoint.pos), fixedjoint.minAngle
                );
            }
            
            // recurse
            this.adjustSkeleton(bone.joint, fixedjoint.pos);
        }
    }

    /**
     * Performs a step in the animation.
     */
    step(){
        this.updateHeadPosition();
        this.adjustSkeleton();
    }

    /**
     * Draw the given skeleton (by default, start w the head).
     * @param {Joint} joint - lead joint of skeleton
     */
    draw(joint = this.head) {
        if (joint == null) return;
        let pos = joint.pos
        // draw joint
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, joint.rad, 0, 2 * Math.PI);
        this.ctx.fill();
        if (joint.bone != null){
            // draw bone
            this.draw(joint.bone.joint);
        }
    }

    /**
     * Animation procedure - requests the next animation frame
     */
    frame(){
        this.step();
        this.ctx.clearRect(-this.width/2, -this.height/2, this.width, this.height);
        this.draw();
    }
}


/** @type {HTMLCanvasElement} */
var canvas = document.getElementById("animation-canvas");
var animator = new Animator(canvas);
var previousFrameTime, fpsInterval;

function animate(newtime){
    requestAnimationFrame(animate);
    let now = newtime;
    let elapsed = now - previousFrameTime;
    if (elapsed > fpsInterval) {
        previousFrameTime = now - (elapsed % fpsInterval);
        animator.frame();
    }
}

function startAnimation(){
    fpsInterval = 1000/60;
    previousFrameTime = window.performance.now();
    animate();
}

function setSize(){
    canvas.height = innerHeight;
    canvas.width = innerWidth;
    animator = new Animator(canvas);
    startAnimation();
}

addEventListener("resize", () => setSize());
addEventListener("DOMContentLoaded", () => setSize());