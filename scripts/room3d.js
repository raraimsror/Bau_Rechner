/* =========================================================
   ROOM 3D VISUALIZATION
   Atsevišķs fails 3D vizualizācijai
   ========================================================= */

// Globālie mainīgie 3D vizualizācijai
let rx = -15, ry = 35, zoomLevel = 1;
let drag = false, px, py;

// DOM elementi (inicializēsies pēc lapas ielādes)
let vPort, room, zoomScene, xInp, yInp, zInp;

/* =========================================================
   INICIALIZĀCIJA
   ========================================================= */

function init3D() {
    // Iegūstam DOM elementus
    vPort = document.getElementById("vPort");
    room = document.getElementById("room");
    zoomScene = document.getElementById("zoomScene");
    xInp = document.getElementById("xInp");
    yInp = document.getElementById("yInp");
    zInp = document.getElementById("zInp");

    // Sākuma atjaunošana
    setTimeout(updateRoom, 50);

    // Event listeners
    setupMouseControls();
    setupWheelZoom();
    setupTouchControls();
    setupInputListeners();

    // Mobile responsive scaling
    adjustMobileScale();
    window.addEventListener('resize', adjustMobileScale);
    window.addEventListener('orientationchange', adjustMobileScale);
}

/* =========================================================
   MOBILE RESPONSIVE SCALING
   ========================================================= */

function adjustMobileScale() {
    if (window.innerWidth <= 768) {
        const viewportWidth = vPort.offsetWidth;
        const viewportHeight = vPort.offsetHeight;
        const minDim = Math.min(viewportWidth, viewportHeight);

        // Get actual room dimensions from inputs
        const x = +xInp.value || 400;
        const y = +yInp.value || 300;
        const z = +zInp.value || 250;

        // Calculate actual rendered size
        const maxDim = Math.max(x, y, z);
        const roomScale = 400 / maxDim;
        const actualSize = Math.max(x * roomScale, y * roomScale, z * roomScale);

        // Target 75% of viewport's smallest dimension
        const targetSize = minDim * 0.75;
        const mobileScale = targetSize / actualSize;

        zoomScene.style.transform = `scale(${mobileScale})`;
    } else {
        // Desktop - reset to zoomLevel
        zoomScene.style.transform = `scale(${zoomLevel})`;
    }
}

/* =========================================================
   ATJAUNOT ISTABAS GEOMETRIJU
   ========================================================= */

function updateRoom() {
    const x = +xInp.value || 0;
    const y = +yInp.value || 0;
    const z = +zInp.value || 0;

    if (x <= 0 || y <= 0 || z <= 0) return;

    const maxDim = Math.max(x, y, z);
    const scale = 400 / maxDim;

    const sx = x * scale;
    const sy = y * scale;
    const sz = z * scale;

    const walls = [
        { s: ".front",   w: sx, h: sz, t: `translate(-50%,-50%) translateZ(${sy / 2}px)` },
        { s: ".back",    w: sx, h: sz, t: `translate(-50%,-50%) translateZ(${-sy / 2}px) rotateY(180deg)` },
        { s: ".left",    w: sy, h: sz, t: `translate(-50%,-50%) translateX(${-sx / 2}px) rotateY(-90deg)` },
        { s: ".right",   w: sy, h: sz, t: `translate(-50%,-50%) translateX(${sx / 2}px) rotateY(90deg)` },
        { s: ".floor",   w: sx, h: sy, t: `translate(-50%,-50%) translateY(${sz / 2}px) rotateX(90deg)` },
        { s: ".ceiling", w: sx, h: sy, t: `translate(-50%,-50%) translateY(${-sz / 2}px) rotateX(-90deg)` }
    ];

    walls.forEach(cfg => {
        const el = document.querySelector(cfg.s);
        if (el) {
            el.style.width = cfg.w + "px";
            el.style.height = cfg.h + "px";
            el.style.transform = cfg.t;
        }
    });

    updateOpacity();
}

/* =========================================================
   ПРОЗРАЧНОСТЬ СТЕН
   ========================================================= */

function updateOpacity() {
    const angle = ((ry % 360) + 360) % 360;

    document.querySelectorAll(".wall").forEach(w => {
        const side = w.dataset.side;
        let op = 0.95;

        if (side === "front"  && (angle > 315 || angle < 45))  op = 0.05;
        if (side === "right"  && angle >= 225 && angle < 315)  op = 0.05;
        if (side === "back"   && angle >= 135 && angle < 225)  op = 0.05;
        if (side === "left"   && angle >= 45  && angle < 135)  op = 0.05;
        if (side === "ceiling" && rx < 0)                      op = 0.2;

        w.style.opacity = op;
    });
}

/* =========================================================
   МЫШЬ УПРАВЛЕНИЕ
   ========================================================= */

function setupMouseControls() {
    vPort.onmousedown = e => {
        drag = true;
        document.body.classList.add("noselect");
        px = e.clientX;
        py = e.clientY;
    };

    window.onmouseup = () => {
        drag = false;
        document.body.classList.remove("noselect");
    };

    window.onmousemove = e => {
        if (!drag) return;

        ry += (e.clientX - px) * 0.4;
        rx -= (e.clientY - py) * 0.4;
        rx = Math.max(-60, Math.min(60, rx));

        room.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;

        px = e.clientX;
        py = e.clientY;

        updateOpacity();
    };
}

/* =========================================================
   КОЛЕСО МЫШИ ЗУМ
   ========================================================= */

function setupWheelZoom() {
    vPort.onwheel = e => {
        e.preventDefault();
        zoomLevel += e.deltaY * -0.001;
        zoomLevel = Math.max(0.5, Math.min(2, zoomLevel));
        zoomScene.style.transform = `scale(${zoomLevel})`;
    };
}

/* =========================================================
   TOUCH УПРАВЛЕНИЕ
   ========================================================= */

function setupTouchControls() {
    vPort.addEventListener("touchstart", (e) => {
        const t = e.touches[0];
        drag = true;
        px = t.clientX;
        py = t.clientY;
        document.body.classList.add("noselect");
    });

    vPort.addEventListener("touchmove", (e) => {
        if (!drag) return;

        const t = e.touches[0];

        ry += (t.clientX - px) * 0.4;
        rx -= (t.clientY - py) * 0.4;
        rx = Math.max(-60, Math.min(60, rx));

        room.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;

        px = t.clientX;
        py = t.clientY;

        updateOpacity();
    });

    vPort.addEventListener("touchend", () => {
        drag = false;
        document.body.classList.remove("noselect");
    });
}

/* =========================================================
   INPUT LISTENERS
   ========================================================= */

// Debounce таймер для пересчёта
let recalculateTimer = null;

function setupInputListeners() {
    [xInp, yInp, zInp].forEach(el => {
        el.oninput = () => {
            // Обновляем 3D сразу
            updateRoom();

            // Пересчитываем чек с задержкой 1.5 секунды
            if (recalculateTimer) {
                clearTimeout(recalculateTimer);
            }

            recalculateTimer = setTimeout(() => {
                // Вызываем функцию пересчёта из script.js
                if (typeof window.recalculateReceipt === 'function') {
                    window.recalculateReceipt();
                }
            }, 1500);
        };
    });
}

// Eksportējam funkcijas un elementus, kas vajadzīgas ārpusē
window.init3D = init3D;
window.updateRoom3D = updateRoom;

// Eksportējam input elementus priekš getWallsAreaM2() funkcijas
window.xInp = null;
window.yInp = null;
window.zInp = null;

// Pēc init3D izsaukšanas, šie būs pieejami
function getInputElements() {
    return { xInp, yInp, zInp };
}
window.getInputElements = getInputElements;
