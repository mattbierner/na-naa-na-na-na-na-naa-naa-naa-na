
const drawData2d = data => {
    const canvas = document.getElementById('main_canvas');
    const ctx = canvas.getContext('2d');
    console.log(data.length)
    // Left
    const posL = { x: 400, y: 400 };
    ctx.moveTo(posL.x, posL.y);
    ctx.beginPath();
    for (const e of data) {
        posL.x += (e.left_x - MID) / MAX * SCALE;
        posL.y += (e.left_y - MID) / MAX * SCALE;
        ctx.lineTo(posL.x, posL.y);
    }
    ctx.strokeStyle = '#00ff00';
    ctx.stroke();
    
    // Right
    const posR = { x: 400, y: 400 };
    ctx.moveTo(posR.x, posR.y);
    ctx.beginPath();
    for (const e of data) {
        posR.x += (e.right_x - MID) / MAX * SCALE;
        posR.y += (e.right_y - MID) / MAX * SCALE;
        ctx.lineTo(posR.x, posR.y);
    }
    ctx.strokeStyle = '#ff0000';
    ctx.stroke();
}
