class Animator {
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

        /** @type {Array<Animal>} */
        this.animals = []

        // Create animal
        this.animals.push(
            Creator.Snake(200, this.width/30, this.width/200, Math.PI/3)
        );

        // Create head controllers
        //this.controller = FourierController.FromModeCoefficients(5, 1/5, 3, 1/6);//, 2, 1/7);
        this.controller = new MouseController(canvas);
    }


    /**
     * Updates the position of the given node based on input or behaviour.
     * @param {Joint} joint - joint whose position needs updating
     */
    updateHeadPosition(joint){
        joint.pos = this.controller.updatePosition(joint.pos);
    }

    /**
     * Adjusts the skeleton, keeping the lead position fixed.
     * @param {Joint} fixedjoint - the lead joint of the skeleton
     * @param {vec2} previousJointPos - position of the previous joint
     */
    adjustSkeleton(fixedjoint, previousJointPos = null){
        var bone = fixedjoint.nextBone;
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
        this.animals.forEach(animal => {
            console.log("Animal: ", animal);
            this.updateHeadPosition(animal.head); // TODO: assign different behaviours to different animals
            this.adjustSkeleton(animal.head);
        });
    }


    /**
     * Draws the given animal on the canvas
     * @param {Animal} animal 
     */
    draw_animal(animal){
        this.ctx.beginPath();
        this.draw_skeleton(animal.head);
        this.ctx.closePath();

        this.ctx.fillStyle = animal.fillColor;
        this.ctx.strokeStyle = animal.strokeColor;

        this.ctx.fill();
        this.ctx.stroke();
    }

    /**
     * Draw the given skeleton (by default, start w the head).
     * @param {Joint} joint - lead joint of skeleton
     * @param {Joint} previousjoint - lead joint of skeleton
     */
    draw_skeleton(joint, previousjoint = null) {
        if (joint == null) return;
        let pos = joint.pos
        let nextBone = joint.nextBone;

        if (nextBone != null){
            let next_pos = nextBone.joint.pos;
            let node_dir_1 = pos.minus(next_pos).normalise();

            if(previousjoint == null) {
                var node_dir = node_dir_1;
                let front_pos = pos.plus(node_dir.times(joint.rad));
                this.ctx.moveTo(front_pos.x, front_pos.y);
            } else {
                let node_dir_2 = previousjoint.pos.minus(pos).normalise();
                var node_dir = node_dir_1.plus(node_dir_2).normalise();
            }
            var node_left = pos.plus(node_dir.times(joint.rad).rotate(Math.PI/2));
            var node_right = pos.plus(node_dir.times(joint.rad).rotate(-Math.PI/2));

            this.ctx.lineTo(node_left.x, node_left.y);

            // recurse
            this.draw_skeleton(nextBone.joint, joint);

            this.ctx.lineTo(node_right.x, node_right.y);
        } else {
            //this.ctx.lineTo(node_back.x, node_back.y);
        }
    }
    
    /**
     * Animation procedure - requests the next animation frame
     */
    frame(){
        this.step();
        this.ctx.clearRect(-this.width/2, -this.height/2, this.width, this.height);
        this.animals.forEach(animal => {
           this.draw_animal(animal);
        });
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