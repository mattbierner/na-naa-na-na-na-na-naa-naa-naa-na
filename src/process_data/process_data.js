"use strict";

/**
 * Create match data structure from raw event data.
 */
module.exports.createMatch = data => {
    const start = data[0] && data[0].time;
    const duration = data.length < 2 ? 0 : data[data.length - 1].time.diff(start);
    
    for (const e of data) {
        const time = e.time.diff(start);
        e.time = time;
        e.progress = time / duration;
    }

    return {
        duration: duration,
        events: data
    };
};
