class Creator{
    /**
     * Create a simple snake.
     * @param {number} segments - number of segments
     * @param {number} width - snake width = 2 * radius of snake segments
     * @param {length} length - length of bones
     * @returns {Joint} head joint of the snake
     */
    static Snake(segments, width, length){
        var head = new Joint(new vec2(0, 0), width / 2);
        var joint = head;
        for (let segment = 0; segment < segments - 1; segment++) {
            joint.minAngle = 90;
            joint = joint.setNext(joint.pos.plus(new vec2(-length, 0)), width/2);
        }
        return head;
    }

}