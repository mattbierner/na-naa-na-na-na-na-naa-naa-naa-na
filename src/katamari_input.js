import THREE from 'three';

/**
 * How much each rotation input action is scaled.
 */
const ROTATION_SCALE = 0.03;

/**
 * How much each translation input action is scaled.
 */
const TRANSLATION_SCALE = 1 / 10;

/**
 * Is a joystick active?
 */
const isDead = (x, y) =>
    x === 0 && y === 0;

/**
 * Translate input into Katamari movement on a sphere.
 */
export default (quaternion, angle, input, scaling = 1) => {
    const leftX = input.left_x;
    const leftY = input.left_y;

    const rightX = input.right_x;
    const rightY = input.right_y;

    // Update positon based on controls
    if (isDead(leftX, leftY) && !isDead(rightX, rightY)) {
        // right stick only rotation
        angle += rightY * ROTATION_SCALE;
    } else if (!isDead(leftX, leftY) && isDead(rightX, rightY)) {
        // left stick only rotation
        angle -= leftY * ROTATION_SCALE;
    } else if (leftY > 0 && rightY < 0) {
        // down left, up right rotation
        angle -= (leftY - rightY) * ROTATION_SCALE;
    } else if (rightY > 0 && leftY < 0) {
        // down left, up right rotation
        angle += (rightY - leftY) * ROTATION_SCALE;
    } else {
        // must be a translation
        const x = leftX + rightX;
        const y = leftY + rightY;
        if (x !== 0 || y !== 0) {
            angle += ROTATION_SCALE * (rightY - leftY);
            const direction = new THREE.Vector3(Math.sin(angle), Math.cos(angle), 0);
            const perpendicular = new THREE.Vector3(-direction.y, direction.x, 0);

            const horizontal = new THREE.Quaternion().setFromAxisAngle(direction, x * TRANSLATION_SCALE * scaling);
            const vertical = new THREE.Quaternion().setFromAxisAngle(perpendicular, y * TRANSLATION_SCALE * scaling);
            quaternion = quaternion.multiply(horizontal).multiply(vertical);
        }
    }
    return { angle, quaternion };
};