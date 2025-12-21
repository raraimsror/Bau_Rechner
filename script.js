// (1.J) Начальные переменные для 3D сцены
let rx = -15, ry = 35, zoomLevel = 1;
let selectedColor = '#ffffff';

const room = document.getElementById('room');
const vPort = document.getElementById('vPort');
const zoomScene = document.getElementById('zoomScene');
const wallColors = ['#ffffff','#f8f9fa','#e9ecef','#dee2e6','#adb5bd','#6c757d','#ffadad','#ffd6a5','#fdffb6','#caffbf','#9bf6ff','#a0c4ff','#bdb2ff','#ffc6ff','#fffffc','#000000'];

// (2.J) Генерация кнопок выбора цвета
const grid = document.getElementById('colorGrid');
wallColors.forEach(color => {
    const btn = document.createElement('div');
    btn.className = 'color-btn';
    btn.style.backgroundColor = color;
    btn.onclick = () => {
        selectedColor = color;
        document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updateRoom();
    };
    grid.appendChild(btn);
});

// (3.J) Основная функция обновления комнаты
function updateRoom() {
    const x = +xInp.value || 1;
    const y = +yInp.value || 1;
    const z = +zInp.value || 1;
    const multiplier = +mClass.value;

    // (4.J) Масштабирование сцены
    const maxDim = Math.max(x, y, z);
    const scale = 400 / maxDim;
    const sx = x * scale, sy = y * scale, sz = z * scale;

    // (5.J) Расчет положения стен
    const walls = [
        { s: '.front', w: sx, h: sz, t: `translate(-50%,-50%) translateZ(${sy / 2}px)` },
        { s: '.back', w: sx, h: sz, t: `translate(-50%,-50%) translateZ(${-sy / 2}px) rotateY(180deg)` },
        { s: '.left', w: sy, h: sz, t: `translate(-50%,-50%) translateX(${-sx / 2}px) rotateY(-90deg)` },
        { s: '.right', w: sy, h: sz, t: `translate(-50%,-50%) translateX(${sx / 2}px) rotateY(90deg)` },
        { s: '.floor', w: sx, h: sy, t: `translate(-50%,-50%) translateY(${sz / 2}px) rotateX(90deg)` }
    ];

    // (6.J) Применяем размеры и цвета к стенам
    walls.forEach(c => {
        const el = document.querySelector(c.s);
        el.style.width = c.w + 'px';
        el.style.height = c.h + 'px';
        el.style.transform = c.t;
        if (!c.s.includes('floor')) {
            el.style.backgroundColor = selectedColor;
            el.className = 'wall ' + c.s.replace('.', '') + ' ' + wallTex.value;
        }
    });

    updateOpacity();

    // (7.J) Расчёт площади и стоимости
    const area = (2 * x * z + 2 * y * z) / 10000;
    let jobRate = 0;
    document.querySelectorAll('.job-check:checked').forEach(cb => jobRate += +cb.dataset.price);
    
    document.getElementById('areaVal').innerText = area.toFixed(1);
    document.getElementById('priceVal').innerText = Math.round(area * jobRate * multiplier).toLocaleString() + ' €';
}

// (8.J) Логика прозрачности стен в зависимости от угла
function updateOpacity() {
    const angle = ((ry % 360) + 360) % 360;
    document.querySelectorAll('.wall:not(.floor)').forEach(w => {
        const side = w.dataset.side;
        let op = 0.9;
        if (side === 'front' && (angle > 315 || angle < 45)) op = 0.15;
        if (side === 'right' && (angle >= 225 && angle < 315)) op = 0.15;
        if (side === 'back' && (angle >= 135 && angle < 225)) op = 0.15;
        if (side === 'left' && (angle >= 45 && angle < 135)) op = 0.15;
        w.style.opacity = op;
    });
}

// (9.J) Управление вращением комнаты мышью
let drag = false, px, py;
vPort.onmousedown = e => { drag = true; px = e.clientX; py = e.clientY; };
window.onmouseup = () => drag = false;
window.onmousemove = e => {
    if (drag) {
        ry += (e.clientX - px) * 0.4;
        rx -= (e.clientY - py) * 0.4;
        rx = Math.max(-60, Math.min(60, rx));
        room.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
        px = e.clientX; py = e.clientY;
        updateOpacity();
    }
};

// (10.J) Zoom колесом мыши
vPort.onwheel = e => {
    e.preventDefault();
    zoomLevel += e.deltaY * -0.001;
    zoomLevel = Math.max(0.5, Math.min(2, zoomLevel));
    zoomScene.style.transform = `scale(${zoomLevel})`;
};

// (11.J) Слушатели событий
[xInp, yInp, zInp, wallTex, mClass].forEach(el => el.oninput = updateRoom);
document.querySelectorAll('.job-check').forEach(el => el.onchange = updateRoom);

// (12.J) Первоначальная отрисовка сцены
updateRoom();
