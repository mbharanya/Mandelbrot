function cleanup() {
    const currentCanvas = document.getElementById("canvas")
    if (currentCanvas) {
        currentCanvas.remove();
    }
}
window.math = require("mathjs");
window.colormap = require('colormap')

const possibleColorMaps = [
    "alpha",
    "autumn",
    "bathymetry",
    "blackbody",
    "bluered",
    "bone",
    "cdom",
    "chlorophyll",
    "cool",
    "copper",
    "cubehelix",
    "density",
    "earth",
    "electric",
    "freesurface-blue",
    "freesurface-red",
    "greens",
    "greys",
    "hot",
    "hsv",
    "inferno",
    "jet",
    "magma",
    "oxygen",
    "par",
    "phase",
    "picnic",
    "plasma",
    "portland",
    "rainbow",
    "rainbow-soft",
    "rdbu",
    "salinity",
    "spring",
    "summer",
    "temperature",
    "turbidity",
    "velocity-blue",
    "velocity-green",
    "viridis",
    "warm",
    "winter",
    "yignbu",
    "yiorrd",
]

const colorMapSelect = document.getElementById("colormap")

possibleColorMaps.map(colorMapName => {
    const option = document.createElement("option");
    option.text = colorMapName;
    colorMapSelect.add(option);
})

colorMapSelect.value = "rainbow"


document.getElementById("generate").addEventListener("click", event => {
    cleanup()
    const canvas = document.createElement('canvas');

    canvas.id = "canvas"

    const fieldWidth = parseFloat(document.getElementById("fieldWidth").value)
    const fieldHeight = parseFloat(document.getElementById("fieldHeight").value)

    const checkIterations = parseFloat(document.getElementById("checkIterations").value);

    canvas.width = fieldWidth
    canvas.height = fieldHeight

    document.body.appendChild(canvas)

    const ctx = canvas.getContext("2d");

    const x_start = parseFloat(document.getElementById("x_start").value)
    const x_end = parseFloat(document.getElementById("x_end").value)

    const y_start = parseFloat(document.getElementById("y_start").value)
    const y_end = parseFloat(document.getElementById("y_end").value)

    const z_start_re = parseFloat(document.getElementById("z_start_re").value)
    const z_start_im = parseFloat(document.getElementById("z_start_im").value)

    let x_pixel = 0
    let y_pixel = 0

    let fieldStepX = (Math.abs(x_start) + Math.abs(x_end)) / fieldWidth
    let fieldStepY = (Math.abs(y_start) + Math.abs(y_end)) / fieldHeight


    let colors = colormap({
        colormap: colorMapSelect.value,
        nshades: checkIterations,
        format: 'rgba',
        alpha: 1
    })

    const arrayBuffer = new ArrayBuffer(fieldWidth * fieldHeight * 4);
    const pixels = new Uint8ClampedArray(arrayBuffer);

    for (let x = x_start; x <= x_end; x += fieldStepX) {
        x_pixel += 1
        for (let y = y_start; y <= y_end; y += fieldStepY) {
            y_pixel += 1
            const c = math.complex({ re: x, im: y })
            let z = math.complex({ re: z_start_re, im: z_start_im })

            let currentColor;

            for (let n = 0; n <= checkIterations; n++) {
                z = math.add(math.pow(z, 2), c)
                const absoluteValue = z.abs()
                const doesDiverge = absoluteValue > 4
                if (n == checkIterations) {
                    currentColor = [0, 0, 0, 255]
                }else if (doesDiverge) {
                    currentColor = colors[n]
                    break;
                }

            }

            const i = (y_pixel * fieldWidth + x_pixel) * 4;
            pixels[i] = currentColor[0];   // red
            pixels[i + 1] = currentColor[1];   // green
            pixels[i + 2] = currentColor[2];   // blue
            pixels[i + 3] = 255; // alpha

        }
        y_pixel = 0
    }

    
    const imageData = new ImageData(pixels, fieldWidth, fieldHeight);
    ctx.putImageData(imageData, 0, 0);
})
