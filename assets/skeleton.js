const DEFAULTRAD = 10;
const DEFAULTMINANGLE = 80 * Math.PI/180;

class Animal{
    /**
     * Creates an animal from its skeleton and given colors
     * @param {Joint} head - the head joint of the animal skeleton
     * @param {string} fillColor - the color to fill the shape with in CSS format
     * @param {string} strokeColor - the color to use for the stroke in CSS format
     */
    constructor(head, fillColor="white", strokeColor="black") {
        this.head = head;
        this.fillColor = fillColor;
        this.strokeColor = strokeColor;
    }
}

class Joint {
    /** @type {number} */
    /**
     * Construct a skeleton node.
     * @param {vec2} pos - the node position
     * @param {number} rad - the radius of the joint
     * @param {Bone} nextBone - the bone pointing to the next node (null if this is a leaf)
     * @param {number} minAngle - the maximum angle between consecutive bones
     */
    constructor(pos, rad = DEFAULTRAD, nextBone = null, minAngle = null) {
        this.pos = pos;
        this.rad = rad;
        this.nextBone = nextBone;
        this.minAngle = minAngle;
    }

    /**
     * Attach a bone to a node with given position and radius.
     * @param {vec2} nextpos - the position of the next node
     * @param {number} radius - radius of the next node
     * @returns {Joint} the joint the bone points to
     */
    setNext(nextpos, radius = DEFAULTRAD) {
        this.nextBone = new Bone(this.pos, nextpos, radius);
        return this.nextBone.joint;
    }
}

/**
 * A bone has a given length and connects to a joint.
 */
class Bone{
    /**
     * Create a new bone pointing from one position to another with given target node radius.
     * @param {vec2} from - the position the bone attaches to
     * @param {vec2} to - the position the bone points to
     * @param {vec2} torad - radius of target node
     */
    constructor(from, to, torad = DEFAULTRAD){
        /** @type {number} */
        this.length = to.minus(from).norm();
        /** @type {Joint} */
        this.joint = new Joint(to, torad);
    }
}

