/* =========================================================
   ИНИЦИАЛИЗАЦИЯ ПРОЕКТА
   ========================================================= */

window.addEventListener("load", () => {
    // Небольшая задержка, чтобы DOM успел отрисоваться
    setTimeout(updateRoom, 50);

    // Значения по умолчанию:
    // работа = покраска, класс ремонта = Эконом
    currentJob = "painting";    // покраска
    currentClass = "econom";    // Эконом

    // Загрузка пустого чека для покраски PRO
    loadReceipt(currentJob);

    // Привязка радиокнопок (тип работы слева)
    initJobTypeRadios();
});


/* =========================================================
   ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
   ========================================================= */

// Повороты камеры и зум
let rx = -15, ry = 35, zoomLevel = 1;

// Основные элементы 3D-сцены
const room = document.getElementById("room");
const vPort = document.getElementById("vPort");
const zoomScene = document.getElementById("zoomScene");

// Поля ввода размеров комнаты
const xInp = document.getElementById("xInp");
const yInp = document.getElementById("yInp");
const zInp = document.getElementById("zInp");

// Текущий тип работы и класс ремонта
// job: painting | wallpaper | flooring
// class: econom | standard | premium
let currentJob = "painting";
let currentClass = "econom";


/* =========================================================
   ОБНОВЛЕНИЕ ГЕОМЕТРИИ КОМНАТЫ
   ========================================================= */

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
        { s: ".front",   w: sx, h: sz, t: `translate(-50%,-50%) translateZ(${sy / 2}px)` },
        { s: ".back",    w: sx, h: sz, t: `translate(-50%,-50%) translateZ(${-sy / 2}px) rotateY(180deg)` },
        { s: ".left",    w: sy, h: sz, t: `translate(-50%,-50%) translateX(${-sx / 2}px) rotateY(-90deg)` },
        { s: ".right",   w: sy, h: sz, t: `translate(-50%,-50%) translateX(${sx / 2}px) rotateY(90deg)` },
        { s: ".floor",   w: sx, h: sy, t: `translate(-50%,-50%) translateY(${sz / 2}px) rotateX(90deg)` },
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


/* =========================================================
   ПРОЗРАЧНОСТЬ СТЕН В ЗАВИСИМОСТИ ОТ УГЛА КАМЕРЫ
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
   ВРАЩЕНИЕ МЫШЬЮ + ЗАЩИТА ОТ ВЫДЕЛЕНИЯ
   ========================================================= */

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
    if (!drag) return;

    ry += (e.clientX - px) * 0.4;
    rx -= (e.clientY - py) * 0.4;
    rx = Math.max(-60, Math.min(60, rx));

    room.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;

    px = e.clientX;
    py = e.clientY;

    updateOpacity();
};


/* =========================================================
   ВЫБОР ВСЕХ ПОВЕРХНОСТЕЙ (ЧЕКБОКСЫ)
   ========================================================= */

document.getElementById("selectAll").addEventListener("change", function () {
    const isChecked = this.checked;

    document.querySelectorAll(".plane-toggle").forEach(box => {
        if (box.checked !== isChecked) {
            box.checked = isChecked;
            box.dispatchEvent(new Event("change"));
        }
    });
});


/* =========================================================
   ПОДСВЕТКА ВЫБРАННЫХ СТЕН
   ========================================================= */

document.querySelectorAll(".plane-toggle").forEach(box => {
    box.addEventListener("change", () => {
        const side = box.dataset.side;
        const wall = document.querySelector(`.wall.${side}`);
        wall.classList.toggle("selected", box.checked);
    });
});


/* =========================================================
   ЗУМ КОЛЕСОМ МЫШИ
   ========================================================= */

vPort.onwheel = e => {
    e.preventDefault();
    zoomLevel += e.deltaY * -0.001;
    zoomLevel = Math.max(0.5, Math.min(2, zoomLevel));
    zoomScene.style.transform = `scale(${zoomLevel})`;
};


/* =========================================================
   ОБНОВЛЕНИЕ КОМНАТЫ ПРИ ИЗМЕНЕНИИ РАЗМЕРОВ
   ========================================================= */

[xInp, yInp, zInp].forEach(el => el.oninput = updateRoom);


/* =========================================================
   TOUCH-ВРАЩЕНИЕ ДЛЯ МОБИЛЬНЫХ УСТРОЙСТВ
   ========================================================= */

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


/* =========================================================
   НАЧАЛЬНАЯ ИНИЦИАЛИЗАЦИЯ КОМНАТЫ
   ========================================================= */

updateRoom();


/* =========================================================
   ЗАГРУЗКА ЧЕКА ИЗ JSON (по типу работы)
   ========================================================= */

async function loadReceipt(jobType) {
    try {
        // ВАЖНО: файл должен существовать в папке /data
        // Примеры: data/painting_pro.json, data/wallpaper_pro.json, data/flooring_pro.json
        const url = `data/${jobType}_pro.json`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("HTTP " + response.status);
        }

        const model = await response.json();
        renderReceipt(model);

    } catch (err) {
        console.error("Ошибка загрузки JSON:", err);
        const box = document.getElementById("resultsBox");
        if (box) {
            box.innerHTML = "<div class='receipt'>Ошибка загрузки данных чека</div>";
        }
    }
}


/* =========================================================
   РЕНДЕРИНГ ЧЕКА (универсальный, пока все суммы = 0)
   ========================================================= */

function renderReceipt(model) {
    const box = document.getElementById("resultsBox");
    if (!box) return;

    const htmlBlocks = model.blocks.map(block => {
        const items = block.items.map(item => `
            <div class="receipt__line">
                <span>${item}</span>
                <span>0.00 €</span>
            </div>
        `).join("");

        return `
            <div class="receipt__group-title">${block.title}</div>
            ${items}
        `;
    }).join("");

    box.innerHTML = `
        <div class="receipt">
            <div class="receipt__title">${model.title}</div>

            <div class="receipt__group-title">Объект</div>
            <div class="receipt__line">
                <span>Площадь стен</span>
                <span>0.00 м²</span>
            </div>
            <div class="receipt__line">
                <span>Класс ремонта</span>
                <span>${currentClass.toUpperCase()}</span>
            </div>

            ${htmlBlocks}

            <div class="receipt__total">
                <div class="receipt__line">
                    <span>Работы всего</span>
                    <span>0.00 €</span>
                </div>
                <div class="receipt__line">
                    <span>Материалы всего</span>
                    <span>0.00 €</span>
                </div>
                <div class="receipt__line">
                    <span>Оборудование</span>
                    <span>0.00 €</span>
                </div>
                <div class="receipt__line">
                    <span>ИТОГО</span>
                    <span>0.00 €</span>
                </div>
            </div>

            <div class="receipt__muted" style="margin-top:6px;">
                * Позже сюда будут подставлены реальные значения из расчётного модуля.
            </div>
        </div>
    `;
}


/* =========================================================
   ВЫБОР ТИПА РАБОТ (ЛЕВАЯ КОЛОНКА, Pokraska / Tapeten / Napolnoje)
   ========================================================= */

function initJobTypeRadios() {
    // Берём радиокнопки ТОЛЬКО из левой панели,
    // чтобы не конфликтовать с правым блоком "Класс ремонта"
    const leftPanel = document.querySelector(".left-panel");
    if (!leftPanel) return;

    const radios = leftPanel.querySelectorAll("input[name='repairClass']");
    radios.forEach(radio => {
        radio.addEventListener("change", () => {
            const val = radio.value; // econom | standard | premium (сейчас так размечено)

            // Маппинг: какое значение = какой тип работы
            // NOTE: пока используем твои текущие value
            if (val === "econom") {
                currentJob = "painting";   // Pokraska
            } else if (val === "standard") {
                currentJob = "wallpaper";  // Tapeten
            } else if (val === "premium") {
                currentJob = "flooring";   // Napolnoje pokritie
            }

            // Класс ремонта пока оставляем таким же, как value слева (можем разделить позже)
            currentClass = val;

            loadReceipt(currentJob);
        });
    });

    // Выбираем первый вариант по умолчанию, если ничего не выбрано
    const first = leftPanel.querySelector("input[name='repairClass']");
    if (first && !first.checked) {
        first.checked = true;
    }
}