const inputs = document.querySelectorAll('input');
const cube = document.getElementById('cube');
const areaSpan = document.getElementById('area-val');
const priceSpan = document.getElementById('price-val');

// Cenu konfigurācija (par m2 sienu+grīdas laukumam)
const priceRates = {
    economy: 45,
    standard: 85,
    premium: 160
};

function update() {
    // 1. Iegūst vērtības
    const x = parseFloat(document.getElementById('dimX').value) || 0;
    const y = parseFloat(document.getElementById('dimY').value) || 0;
    const z = parseFloat(document.getElementById('dimZ').value) || 0;
    const level = document.querySelector('input[name="level"]:checked').value;

    // 2. Aprēķina mērogu vizualizācijai (100cm = 50px)
    const scale = 0.5;
    const sx = x * scale;
    const sy = y * scale;
    const sz = z * scale;

    // 3. Atjauno 3D kuba izmērus un pozīcijas caur CSS mainīgajiem
    document.documentElement.style.setProperty('--tx', `${sx/2}px`);
    document.documentElement.style.setProperty('--ty', `${sy/2}px`);
    document.documentElement.style.setProperty('--tz', `${sy/2}px`);

    const faces = {
        front: { w: sx, h: sz },
        right: { w: sy, h: sz },
        top: { w: sx, h: sy }
    };

    Object.keys(faces).forEach(f => {
        const el = document.querySelector(`.${f}`);
        el.style.width = faces[f].w + 'px';
        el.style.height = faces[f].h + 'px';
    });

    // 4. Aprēķina loģiku (Sienas + Grīda)
    const floorArea = (x * y) / 10000; // pārvērš m2
    const wallArea = (2 * x * z + 2 * y * z) / 10000;
    const totalArea = floorArea + wallArea;

    const totalPrice = totalArea * priceRates[level];

    // 5. Izvadīt datus
    areaSpan.innerText = totalArea.toFixed(2);
    priceSpan.innerText = Math.round(totalPrice).toLocaleString();
}

// Klausās uz visām izmaiņām
inputs.forEach(input => input.addEventListener('input', update));

// Sākotnējā palaišana
update();