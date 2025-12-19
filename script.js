// Константы цен и технологий
const TECH_PLANS = {
    economy: ["Очистка стен", "Грунтовка", "Поклейка обоев", "Линолеум"],
    standard: ["Выравнивание стен", "Электрика", "Грунтовка", "Покраска", "Ламинат", "Плинтуса"],
    premium: ["Демонтаж", "Перепланировка", "Дизайн-проект", "Теплый пол", "Декоративная штукатурка"]
};

function update() {
    // 1. Считываем размеры
    const x = parseFloat(document.getElementById('dimX').value);
    const y = parseFloat(document.getElementById('dimY').value);
    const z = parseFloat(document.getElementById('dimZ').value);
    const repairClass = document.getElementById('repairClass').value;

    // 2. Обновляем 3D (передаем значения в CSS)
    const scale = 0.5; // масштаб для экрана
    document.documentElement.style.setProperty('--width', `${x * scale}px`);
    document.documentElement.style.setProperty('--depth', `${y * scale}px`);
    document.documentElement.style.setProperty('--height', `${z * scale}px`);

    // Применяем размеры к элементам
    document.querySelectorAll('.wall-front, .wall-back').forEach(w => { w.style.width = (x*scale)+'px'; w.style.height = (z*scale)+'px'; });
    document.querySelectorAll('.wall-left, .wall-right').forEach(w => { w.style.width = (y*scale)+'px'; w.style.height = (z*scale)+'px'; });
    const fl = document.querySelector('.floor');
    fl.style.width = (x*scale)+'px'; fl.style.height = (y*scale)+'px';

    // 3. Логика Дверей/Окон (Визуализация)
    const frontWall = document.querySelector('.wall-front');
    frontWall.innerHTML = ''; // Чистим перед обновлением
    if (document.getElementById('hasDoor').checked) {
        let door = document.createElement('div');
        door.className = 'door-viz';
        frontWall.appendChild(door);
    }
    if (document.getElementById('hasWindow').checked) {
        let win = document.createElement('div');
        win.className = 'window-viz';
        frontWall.appendChild(win);
    }

    // 4. Расчет цены (упрощенно)
    const area = (2*x*z + 2*y*z + x*y) / 10000; // м2 поверхностей
    const rates = { economy: 50, standard: 120, premium: 250 };
    const total = area * rates[repairClass];
    document.getElementById('price-tag').innerText = Math.round(total) + " €";

    // 5. Формируем план работ
    const planList = document.getElementById('work-plan');
    planList.innerHTML = "";
    TECH_PLANS[repairClass].forEach(step => {
        let li = document.createElement('li');
        li.innerText = step;
        planList.appendChild(li);
    });
}

// Слушатели событий
document.querySelectorAll('input, select').forEach(el => el.addEventListener('change', update));
window.onload = update; // Первый запуск