/**
 * Helper functions for translating analog stick data to a more useful format
 */
const MID = 128;
const MAX = 255;
const DEAD_ZONE = 40;

const deaden = c =>
    Math.abs(c) < DEAD_ZONE
        ?0
        :c < 0 ? c + DEAD_ZONE : c - DEAD_ZONE;

/**
 * Normalize raw analog stick data to [-1, 1] ranges.
 */
export const normalize = data =>
    data.map(coords => {
        const x = deaden(coords.x - MID);
        const y = deaden(coords.y - MID);
        
        const maxX = MAX - MID - DEAD_ZONE;
        const maxY = MAX - MID - DEAD_ZONE;
        return {
            x: x / maxX,
            y: y / maxY
        };
    });