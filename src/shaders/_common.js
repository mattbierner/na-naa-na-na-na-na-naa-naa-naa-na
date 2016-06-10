export const quaternionToVector = `
    // Taken from three.js source
    vec3 rotate_vector(vec4 q, vec3 vec) {
        // calculate quat * vector
        float ix =  q.w * vec.x + q.y * vec.z - q.z * vec.y;
        float iy =  q.w * vec.y + q.z * vec.x - q.x * vec.z;
        float iz =  q.w * vec.z + q.x * vec.y - q.y * vec.x;
        float iw = - q.x * vec.x - q.y * vec.y - q.z * vec.z;

        // calculate result * inverse quat
        return vec3(
            ix * q.w + iw * - q.x + iy * - q.z - iz * - q.y,
            iy * q.w + iw * - q.y + iz * - q.x - ix * - q.z,
            iz * q.w + iw * - q.z + ix * - q.y - iy * - q.x);
    }`;