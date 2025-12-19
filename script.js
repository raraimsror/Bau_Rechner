/**
 * Основная логика калькулятора и 3D
 */
function updateApp() {
    // Получение размеров
    const x = parseFloat(document.getElementById('dimX').value) || 0;
    const y = parseFloat(document.getElementById('dimY').value) || 0;
    const z = parseFloat(document.getElementById('dimZ').value) || 0;
    const multiplier = parseFloat(document.getElementById('mClass').value);

    // Масштабирование (100см = 60px)
    const s = 0.6;
    const sx = x * s, sy = y * s, sz = z * s;

    // Конфигурация 3D стен
    // translate(-50%, -50%) гарантирует, что центр стены совпадает с центром комнаты
    const walls = [
        { el: '.front', w: sx, h: sz, t: `translate(-50%, -50%) translateZ(${sy/2}px)` },
        { el: '.back',  w: sx, h: sz, t: `translate(-50%, -50%) translateZ(${-sy/2}px) rotateY(180deg)` },
        { el: '.left',  w: sy, h: sz, t: `translate(-50%, -50%) translateX(${-sx/2}px) rotateY(90deg)` },
        { el: '.right', w: sy, h: sz, t: `translate(-50%, -50%) translateX(${sx/2}px) rotateY(-90deg)` },
        { el: '.floor', w: sx, h: sy, t: `translate(-50%, -50%) translateY(${sz/2}px) rotateX(90deg)` }
    ];

    walls.forEach(config => {
        const dom = document.querySelector(config.el);
        dom.style.width = config.w + 'px';
        dom.style.height = config.h + 'px';
        dom.style.transform = config.t;
    });

    // Расчет площади стен
    const wallArea = (2 * x * z + 2 * y * z) / 10000;
    let total = 0;
    let plan = [];

    // Обработка выбранных работ
    document.querySelectorAll('.job:checked').forEach(item => {
        total += parseFloat(item.dataset.price) * wallArea * multiplier;
        plan.push(item.dataset.task);
    });

    // Обновление интерфейса
    document.getElementById('totalPrice').innerText = Math.round(total).toLocaleString();
    
    const planList = document.getElementById('planSteps');
    planList.innerHTML = plan.length > 0 
        ? plan.map(step => `<li>${step}</li>`).join('') 
        : "<li>Выберите работы слева</li>";

    // Отрисовка двери
    const frontWall = document.querySelector('.front');
    if (document.getElementById('hasDoor').checked) {
        frontWall.innerHTML = '<div class="door-viz"></div>';
    } else {
        frontWall.innerHTML = '<span>Передняя</span>';
    }
}

// Слушатели событий
document.querySelectorAll('input, select').forEach(el => {
    el.addEventListener('input', updateApp);
});

// Инициализация
window.onload = updateApp;