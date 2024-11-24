/**
 * Basic 2d vector class.
 */
class vec2 {
    /**
     * Create vector from coords.
     * @param {number} x - x coordinate
     * @param {number} y - y coordinate
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Calculate norm of vector.
     * @returns {number} Norm of vector
     */
    norm() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * Normalise to given length, leave if impossible
     * @returns {vec2} The normed vector
     */
    normalise(len = 1) {
        let n = this.norm();
        if (n > 1e-10) {
            return new vec2(this.x * len / n, this.y * len / n);
        }
        return new vec2(0, 0)
    }

    /**
     * Compute the sum vector.
     * @param {vec2} other - the vector to be added
     * @returns {vec2} the sum (this + other)
     */
    plus(other) {
        return new vec2(this.x + other.x, this.y + other.y);
    }

    /**
     * Compute the difference vector.
     * @param {vec2} other - the vector to be subtracted
     * @returns {vec2} the difference (this - other)
     */
    minus(other) {
        return new vec2(this.x - other.x, this.y - other.y);
    }

    /**
     * Compute the scaled vector.
     * @param {number} scalar - the number to scale the vector by
     * @returns {vec2} the product (this * scalar)
     */
    times(scalar) {
        return new vec2(this.x * scalar, this.y * scalar);
    }

    /**
     * Rotate by given angle (unit: radians).
     * @param {angle} theta - the angle to rotate by (counter clockwise)
     * @returns {vec2} Rotated vector
     */
    rotate(theta) {
        return new vec2(
            this.x * Math.cos(theta) - this.y * Math.sin(theta),
            this.x * Math.sin(theta) + this.y * Math.cos(theta)
        );
    }

    /**
     * Computes dot product with given other vector
     * @param {vec2} other - vector to perform dot product with
     * @returns {number} this . other
     */
    dot(other) {
        return this.x * other.x + this.y * other.y;
    }

    /**
     * Computes cross product with given other vector
     * @param {vec2} other - vector to perform dot product with
     * @returns {number} this ∧ other
     */
    cross(other) {
        return this.x * other.y - this.y * other.x;
    }

    /**
     * Project onto circle at given distance
     * @param {vec2} anchor - the fixed position
     * @param {number} distance - the distance to be enforced from anchor
     * @returns {vec2} the adjusted vector
     */
    constrainLength(anchor, distance) {
        return anchor.plus(this.minus(anchor).normalise(distance));
    }

    /**
     * Project onto circle at given distance
     * @param {vec2} anchor - the joint point
     * @param {vec2} direction - the direction against which the angle is to be enforced
     * @param {number} minAngle - the minimum angle to be enforced between the vector and direction
     * @returns {vec2} the adjusted vector
     */
    constrainAngle(anchor, direction, minAngle) {
        var newDir = this.minus(anchor);
        var cosTheta = newDir.dot(direction) / (newDir.norm() * direction.norm());
        var minCosTheta = Math.cos(minAngle);
        if (minCosTheta >= cosTheta) return this;
        // now figure out if we need to rotate clockwise or counter-clockwise
        let missingAngle;
        if (newDir.cross(direction) > 0) {
            missingAngle = Math.acos(cosTheta) - minAngle;
        } else {
            missingAngle = minAngle - Math.acos(cosTheta); 
        }

        return anchor.plus(
            newDir.rotate(missingAngle)
        );
    }
}
