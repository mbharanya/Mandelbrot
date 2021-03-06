function cleanup(){
    const currentCanvas = document.getElementById("canvas")
    if (currentCanvas){
        currentCanvas.remove();
    }
}

document.getElementById("generate").addEventListener("click", event => {
    cleanup()
    const canvas = document.createElement('canvas');

    canvas.id = "canvas"

    const fieldWidth = parseFloat(document.getElementById("fieldWidth").value)
    const fieldHeight = parseFloat(document.getElementById("fieldHeight").value)
    canvas.width = fieldWidth
    canvas.height = fieldHeight


    document.body.appendChild(canvas)

    const ctx = canvas.getContext("2d");

    const x_start = parseFloat(document.getElementById("x_start").value)
    const x_end = parseFloat(document.getElementById("x_end").value)

    const y_start = parseFloat(document.getElementById("y_start").value)
    const y_end = parseFloat(document.getElementById("y_end").value)

    let x_pixel = 0
    let y_pixel = 0

    let fieldStepX = (Math.abs(x_start) + Math.abs(x_end)) / fieldWidth
    let fieldStepY = (Math.abs(y_start) + Math.abs(y_end)) / fieldHeight

    for (let x = x_start; x <= x_end; x += fieldStepX) {
        x_pixel += 1
        for (let y = y_start; y <= y_end; y += fieldStepY) {
            y_pixel += 1
            const c = math.complex({ re: x, im: y })

            let z = math.complex({ re: 0, im: 0 })

            const checkIterations = 50;

            for (let n = 0; n <= checkIterations; n++) {
                z = math.add(math.pow(z, 2), c)
                const absoluteValue = z.abs()
                const doesDiverge = absoluteValue > 4
                if (doesDiverge) {
                    ctx.fillStyle = rainBowColor(n, checkIterations)
                    break;
                }
                if (n == checkIterations) {
                    ctx.fillStyle = "#000000"
                }
            }

            ctx.fillRect(x_pixel, y_pixel, 1, 1);
        }
        y_pixel = 0
    }


    function rainBowColor(n, maxLength) {
        var n = n * 240 / (maxLength);
        return 'hsl(' + n + ',100%,50%)';
    }
})
