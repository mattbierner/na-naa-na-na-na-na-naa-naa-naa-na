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
