class Creator{
    /**
     * Create a simple snake.
     * @param {number} segments - number of segments
     * @param {number} width - snake width = 2 * radius of snake segments
     * @param {length} length - length of bones
     * @param {number} maxCurvature - the maximum angle change to allow per unit length 
     *                                (s.t. if the bones have length 1, this is the max angle between segments)
     * @returns {Animal} snake
     */
    static Snake(segments, width, length, maxCurvature = null){
        if (maxCurvature == null) {
            var minAngle = Math.PI / 2
        } else {
            var minAngle = Math.PI - maxCurvature / length
        }
        var head = new Joint(new vec2(0, 0), width / 2);
        var joint = head;
        for (let segment = 0; segment < segments - 1; segment++) {
            joint.minAngle = minAngle;
            joint = joint.setNext(joint.pos.plus(new vec2(-length, 0)), width/2);
        }
        return new Animal(head, "red", "black");
    }

}