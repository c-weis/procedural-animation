const DEFAULTRAD = 10;
const DEFAULTMINANGLE = 80 * Math.PI/180;

class Joint {
    /** @type {number} */
    /**
     * Construct a skeleton node.
     * @param {vec2} pos - the node position
     * @param {number} rad - the radius of the joint
     * @param {Bone} bone - the bone pointing to the next node (null if this is a leaf)
     * @param {number} minAngle - the minimum angle allowed between the bone before and after this joint
     */
    constructor(pos, rad = DEFAULTRAD, bone = null, minAngle = null) {
        this.pos = pos;
        this.rad = rad;
        this.bone = bone;
        this.minAngle = minAngle;
    }

    /**
     * Attach a bone to a node with given position and radius.
     * @param {vec2} nextpos - the position of the next node
     * @param {number} radius - radius of the next node
     * @returns {Joint} the joint the bone points to
     */
    setNext(nextpos, radius = DEFAULTRAD) {
        this.bone = new Bone(this.pos, nextpos, radius);
        return this.bone.joint;
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

