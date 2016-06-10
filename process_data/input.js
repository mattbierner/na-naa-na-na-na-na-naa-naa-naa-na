/**
 * Helper functions for translating analog stick data to a more useful format.
 */
const MID = 128;
const MAX = 256;
const DEAD_ZONE = 40;

const maxX = MAX - MID - DEAD_ZONE;
const maxY = MAX - MID - DEAD_ZONE;

const deaden = c =>
    Math.abs(c) < DEAD_ZONE
        ?0
        :(c < 0 ? c + DEAD_ZONE : c - DEAD_ZONE);

/**
 * Normalize raw analog stick data to [-1, 1] ranges.
 */
module.exports.normalize = (x, y) => ({
    x: deaden(x - MID) / maxX,
    y: deaden(y - MID) / maxY
});


/**
 * Check if single analog input is in the dead zone.
 */
const isDeadInput = value =>
    Math.abs(value - MID) < DEAD_ZONE;

/**
 * Check if all analog inputs are in dead zones.
 */
module.exports.isDead = x =>
    isDeadInput(x.right_x) && isDeadInput(x.right_y) && isDeadInput(x.left_x) && isDeadInput(x.left_y);
