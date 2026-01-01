window.addEventListener("load", () => {
    setTimeout(updateRoom, 50);
});

// ======= Параметры вращения и зума =======
let rx = -15, ry = 35, zoomLevel = 1;

// ======= Основные элементы =======
const room = document.getElementById("room");
const vPort = document.getElementById("vPort");
const zoomScene = document.getElementById("zoomScene");

const xInp = document.getElementById("xInp");
const yInp = document.getElementById("yInp");
const zInp = document.getElementById("zInp");

// ======= Обновление размеров и позиций стен =======
function updateRoom() {
    const x = +xInp.value || 1;
    const y = +yInp.value || 1;
    const z = +zInp.value || 1;

    const maxDim = Math.max(x, y, z);
    const scale = 400 / maxDim;

    const sx = x * scale;
    const sy = y * scale;
    const sz = z * scale;

    const walls = [
        { s: ".front", w: sx, h: sz, t: `translate(-50%,-50%) translateZ(${sy / 2}px)` },
        { s: ".back", w: sx, h: sz, t: `translate(-50%,-50%) translateZ(${-sy / 2}px) rotateY(180deg)` },
        { s: ".left", w: sy, h: sz, t: `translate(-50%,-50%) translateX(${-sx / 2}px) rotateY(-90deg)` },
        { s: ".right", w: sy, h: sz, t: `translate(-50%,-50%) translateX(${sx / 2}px) rotateY(90deg)` },
        { s: ".floor", w: sx, h: sy, t: `translate(-50%,-50%) translateY(${sz / 2}px) rotateX(90deg)` },
        { s: ".ceiling", w: sx, h: sy, t: `translate(-50%,-50%) translateY(${-sz / 2}px) rotateX(-90deg)` }
    ];

    walls.forEach(cfg => {
        const el = document.querySelector(cfg.s);
        el.style.width = cfg.w + "px";
        el.style.height = cfg.h + "px";
        el.style.transform = cfg.t;
    });

    updateOpacity();
}

// ======= Прозрачность в зависимости от угла камеры =======
function updateOpacity() {
    const angle = ((ry % 360) + 360) % 360;

    document.querySelectorAll(".wall").forEach(w => {
        const side = w.dataset.side;
        let op = 0.95;

        if (side === "front" && (angle > 315 || angle < 45)) op = 0.05;
        if (side === "right" && angle >= 225 && angle < 315) op = 0.05;
        if (side === "back" && angle >= 135 && angle < 225) op = 0.05;
        if (side === "left" && angle >= 45 && angle < 135) op = 0.05;
        if (side === "ceiling" && rx < 0) op = 0.2;

        w.style.opacity = op;
    });
}

// ======= Вращение мышью + zasita ot videlenie =======
let drag = false, px, py;

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
    if (drag) {
        ry += (e.clientX - px) * 0.4;
        rx -= (e.clientY - py) * 0.4;
        rx = Math.max(-60, Math.min(60, rx));

        room.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;

        px = e.clientX;
        py = e.clientY;

        updateOpacity();
    }
};

// ======= Выбор всех поверхностей =======
document.getElementById("selectAll").addEventListener("change", function () {
    const isChecked = this.checked;

    document.querySelectorAll(".plane-toggle").forEach(box => {
        if (box.checked !== isChecked) {
            box.checked = isChecked;
            box.dispatchEvent(new Event("change"));
        }
    });
});

// ======= Подсветка выбранных стен =======
document.querySelectorAll(".plane-toggle").forEach(box => {
    box.addEventListener("change", () => {
        const side = box.dataset.side;
        const wall = document.querySelector(`.wall.${side}`);
        wall.classList.toggle("selected", box.checked);
    });
});

// ======= Зум колесом мыши =======
vPort.onwheel = e => {
    e.preventDefault();
    zoomLevel += e.deltaY * -0.001;
    zoomLevel = Math.max(0.5, Math.min(2, zoomLevel));
    zoomScene.style.transform = `scale(${zoomLevel})`;
};

// ======= Обновление комнаты при изменении размеров =======
[xInp, yInp, zInp].forEach(el => el.oninput = updateRoom);

// ======= Touch rotācija mobilajām ierīcēm =======
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

// ======= Инициализация =======
updateRoom();