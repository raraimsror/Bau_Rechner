/* =========================================================
   ИНИЦИАЛИЗАЦИЯ ПРОЕКТА
   ========================================================= */

window.addEventListener("load", () => {
    // Небольшая пауза, чтобы DOM успел отрисоваться
    setTimeout(updateRoom, 50);

    // Значения по умолчанию:
    currentJob = "painting";   // тип работы
    currentClass = "econom";   // класс ремонта

    // Загружаем цены, затем чек
    loadPricing().then(() => {
        loadReceipt(currentJob);
    });

    // Привязка радиокнопок
    initJobTypeRadios();
    initRepairClassRadios();

    // Привязка кнопок сброса
    initResetWorkBlocksButton();
    initResetFiltersButton();
});

/* =========================================================
   ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
   ========================================================= */

// Повороты камеры и зум
let rx = -15, ry = 35, zoomLevel = 1;

// Основные элементы 3D-сцены
const vPort = document.getElementById("vPort");
const room = document.getElementById("room");
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

// Объект с ценами из pricing.json
let pricing = null;

/* =========================================================
   ВАЛИДАЦИЯ ВХОДНЫХ ДАННЫХ
   ========================================================= */

function validateInput(inputElement) {
    const value = parseFloat(inputElement.value);

    // Проверка на пустое значение, ноль, отрицательные числа
    if (!inputElement.value || isNaN(value) || value <= 0) {
        inputElement.style.borderColor = "#ff4444";
        return null;
    }

    // Проверка максимального значения
    if (value > 10000) {
        inputElement.style.borderColor = "#ff4444";
        showError("Максимальное значение: 10000 см");
        return null;
    }

    // Валидация прошла успешно
    inputElement.style.borderColor = "";
    return value;
}

function showError(message) {
    const resultsBox = document.getElementById("resultsBox");
    resultsBox.innerHTML = `<div style="color: #ff4444; padding: 10px; background: #fff3f3; border-radius: 4px; margin: 10px 0;">${message}</div>`;
}

/* =========================================================
   ЗАГРУЗКА ЦЕН (pricing.json)
   ========================================================= */

async function loadPricing() {
    try {
        const response = await fetch("data/pricing.json");
        if (!response.ok) throw new Error("HTTP " + response.status);
        pricing = await response.json();
    } catch (err) {
        console.error("Ошибка загрузки pricing.json:", err);
        pricing = null;
    }
}

/* =========================================================
   ОБНОВЛЕНИЕ ГЕОМЕТРИИ КОМНАТЫ
   ========================================================= */

function updateRoom() {
    // Валидация входных данных
    const x = validateInput(xInp);
    const y = validateInput(yInp);
    const z = validateInput(zInp);

    if (!x || !y || !z) return; // Если валидация не прошла, не обновляем

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

[xInp, yInp, zInp].forEach(el => el.oninput = () => {
    updateRoom();
    // При изменении размеров сразу пересчитываем чек
    loadReceipt(currentJob);
});

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
   ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ: ПЛОЩАДЬ СТЕН (м²)
   ========================================================= */
// x, y, z в см
// Стены: 2*(x + y)*z, делим на 10 000 чтобы получить м²

function getWallsAreaM2() {
    const x = +xInp.value || 0;
    const y = +yInp.value || 0;
    const z = +zInp.value || 0;
    const areaCm2 = 2 * (x + y) * z;
    return areaCm2 / 10000;
}

/* =========================================================
   ЗАГРУЗКА ЧЕКА ИЗ JSON (по типу работы)
   ========================================================= */

async function loadReceipt(jobType) {
    try {
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
   РАСЧЁТ СТОИМОСТИ
   ========================================================= */

function calculateTotals(model) {
    if (!pricing) {
        return {
            area: 0,
            workTotal: 0,
            materialTotal: 0,
            equipmentTotal: 0,
            grandTotal: 0,
            paintCost: 0,
            litersNeeded: 0
        };
    }

    const area = getWallsAreaM2();

    // Эконом: считаем только материалы (краска по м² + фиксированные материалы)
    if (currentClass === "econom") {
        const coverage = pricing.paint.coverage_m2_per_liter;
        const pricePerLiter = pricing.paint.price_per_liter;

        const litersNeeded = coverage > 0 ? area / coverage : 0;
        const paintCost = litersNeeded * pricePerLiter;

        const mat = pricing.ecoMaterials || {};
        const materialTotal =
            paintCost +
            (mat.brushes || 0) +
            (mat.rollers || 0) +
            (mat.tape || 0) +
            (mat.covers || 0);

        return {
            area,
            workTotal: 0,
            materialTotal,
            equipmentTotal: 0,
            grandTotal: materialTotal,
            paintCost,
            litersNeeded
        };
    }

    // Стандарт и Премиум: работа + материалы + оборудование
    const workRate =
        pricing.workRatePerM2?.[currentJob]?.[currentClass] || 0;

    const materialRate =
        pricing.materialRatePerM2?.[currentJob]?.[currentClass] || 0;

    const equipmentTotal =
        pricing.equipmentTotal?.[currentJob]?.[currentClass] || 0;

    const workTotal = area * workRate;
    const materialTotal = area * materialRate;
    const grandTotal = workTotal + materialTotal + equipmentTotal;

    return {
        area,
        workTotal,
        materialTotal,
        equipmentTotal,
        grandTotal,
        paintCost: 0,
        litersNeeded: 0
    };
}

/* =========================================================
   ЛОГИКА ВИДИМОСТИ БЛОКОВ ПО КЛАССУ РЕМОНТА
   ========================================================= */

const visibilityRules = {
    econom: ["b11", "equip", "extra"],     // Эконом: материалы + оборудование (клиент работает сам)
    standard: ["b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "b10", "b11"], // Стандарт: все работы + материалы
    premium: "ALL"                          // Премиум: все блоки
};

// Хранилище выбранных блоков для NORM класса
let selectedWorkBlocks = ["b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "b10"]; // По умолчанию все выбраны

function filterBlocksForClass(model) {
    const rules = visibilityRules[currentClass];

    if (rules === "ALL") return model;

    const clone = JSON.parse(JSON.stringify(model));

    // Для NORM класса фильтруем по выбранным checkbox
    if (currentClass === "standard") {
        clone.blocks = clone.blocks.filter(block => {
            // Материалы (b11) всегда показываем
            if (block.id === "b11") return true;
            // Остальные блоки - только если выбраны
            return selectedWorkBlocks.includes(block.id);
        });
    } else {
        clone.blocks = clone.blocks.filter(block => rules.includes(block.id));
    }

    return clone;
}

/* =========================================================
   РЕНДЕРИНГ ЧЕКА
   ========================================================= */

function renderReceipt(model) {
    const box = document.getElementById("resultsBox");
    if (!box) return;

    // Убираем предупреждение при перерисовке (если b1 снова выбран)
    if (selectedWorkBlocks.includes("b1") || currentClass !== "standard") {
        hideInspectionWarning();
    }

    // Фильтруем блоки по классу ремонта
    const filtered = filterBlocksForClass(model);

    const totals = calculateTotals(model);

    const allItems =
        filtered.blocks.reduce((sum, block) => sum + block.items.length, 0) || 1;
    const workPerItem = totals.workTotal / allItems;
    const matPerItem = totals.materialTotal / allItems;

    let htmlBlocks = "";

    filtered.blocks.forEach(block => {
        // Для NORM класса добавляем checkbox перед заголовком блока (кроме b11 - материалы)
        let blockTitle = block.title;
        if (currentClass === "standard" && block.id !== "b11" && block.id.startsWith("b")) {
            const isChecked = selectedWorkBlocks.includes(block.id) ? "checked" : "";
            blockTitle = `
                <label style="display: flex; align-items: center; cursor: pointer;">
                    <input type="checkbox" class="work-block-toggle" data-block-id="${block.id}" ${isChecked}
                           style="margin-right: 8px; cursor: pointer;">
                    <span>${block.title}</span>
                </label>
            `;
        } else {
            blockTitle = block.title;
        }

        htmlBlocks += `<div class="receipt__group-title">${blockTitle}</div>`;

        block.items.forEach(item => {
            let lineTotal = 0;

            // Эконом: только материалы, с индивидуальными ценами
            if (currentClass === "econom") {
                const mat = pricing.ecoMaterials || {};

                const ecoPrices = {
                    "Краска интерьерная (TOOM)": totals.paintCost,
                    "Кисти малярные (TOOM)": mat.brushes || 0,
                    "Валики малярные (TOOM)": mat.rollers || 0,
                    "Малярная лента (TOOM)": mat.tape || 0,
                    "Защитная плёнка (TOOM)": mat.covers || 0
                };

                lineTotal = ecoPrices[item] || 0;
            }
            // Стандарт + Премиум: равномерно распределяем работу и материалы
            else {
                lineTotal = workPerItem + matPerItem;
            }

            htmlBlocks += `
                <div class="receipt__line">
                    <span>${item}</span>
                    <span>${lineTotal.toFixed(2)} €</span>
                </div>
            `;
        });
    });

    box.innerHTML = `
        <div class="receipt">
            <div class="receipt__title">${model.title}</div>

            <div class="receipt__group-title">Объект</div>
            <div class="receipt__line">
                <span>Площадь стен</span>
                <span>${totals.area.toFixed(2)} м²</span>
            </div>
            <div class="receipt__line">
                <span>Класс ремонта</span>
                <span>${currentClass.toUpperCase()}</span>
            </div>

            ${htmlBlocks}

            <div class="receipt__total">
                <div class="receipt__line">
                    <span>Работы всего</span>
                    <span>${totals.workTotal.toFixed(2)} €</span>
                </div>
                <div class="receipt__line">
                    <span>Материалы всего</span>
                    <span>${totals.materialTotal.toFixed(2)} €</span>
                </div>
                <div class="receipt__line">
                    <span>Оборудование</span>
                    <span>${totals.equipmentTotal.toFixed(2)} €</span>
                </div>
                <div class="receipt__line">
                    <span>ИТОГО</span>
                    <span>${totals.grandTotal.toFixed(2)} €</span>
                </div>
            </div>

            <div class="receipt__muted" style="margin-top:6px;">
                * Эконом: только материалы (краска по м² + комплект TOOM). Стандарт/Премиум: работа + материалы + оборудование.
            </div>
        </div>
    `;

    // Привязываем обработчики к новым checkbox
    attachWorkBlockCheckboxListeners();
}

/* =========================================================
   ОБРАБОТЧИКИ CHECKBOX ДЛЯ ВЫБОРА РАБОТ (NORM КЛАСС)
   ========================================================= */

function attachWorkBlockCheckboxListeners() {
    const checkboxes = document.querySelectorAll(".work-block-toggle");

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", (e) => {
            const blockId = e.target.dataset.blockId;

            if (e.target.checked) {
                // Добавляем блок в выбранные
                if (!selectedWorkBlocks.includes(blockId)) {
                    selectedWorkBlocks.push(blockId);
                }
            } else {
                // Убираем блок из выбранных
                selectedWorkBlocks = selectedWorkBlocks.filter(id => id !== blockId);

                // Предупреждение, если убрали b1 (осмотр)
                if (blockId === "b1") {
                    showInspectionWarning();
                }
            }

            // Перерисовываем чек с новыми выбранными блоками
            loadReceipt(currentJob);
        });
    });
}

/* =========================================================
   ПРЕДУПРЕЖДЕНИЕ ПРИ ОТКЛЮЧЕНИИ ОСМОТРА (b1)
   ========================================================= */

function showInspectionWarning() {
    const resultsBox = document.getElementById("resultsBox");

    // Создаем предупреждение, если его еще нет
    let warning = document.getElementById("inspectionWarning");
    if (!warning) {
        warning = document.createElement("div");
        warning.id = "inspectionWarning";
        warning.style.cssText = `
            background: #fff3cd;
            border: 1px solid #ffc107;
            border-radius: 4px;
            padding: 12px;
            margin: 10px 0;
            color: #856404;
            font-size: 14px;
            line-height: 1.4;
        `;
        warning.innerHTML = `
            <strong>⚠️ Внимание!</strong><br>
            Без осмотра мастер не сможет подтвердить выполнимость выбранного плана работ.
        `;
        resultsBox.insertBefore(warning, resultsBox.firstChild);
    }
}

function hideInspectionWarning() {
    const warning = document.getElementById("inspectionWarning");
    if (warning) {
        warning.remove();
    }
}

/* =========================================================
   ВЫБОР ТИПА РАБОТ (ЛЕВАЯ КОЛОНКА, jobType)
   ========================================================= */

function initJobTypeRadios() {
    const radios = document.querySelectorAll("input[name='jobType']");
    if (!radios.length) return;

    radios.forEach(radio => {
        radio.addEventListener("change", () => {
            currentJob = radio.value; // painting | wallpaper | flooring
            loadReceipt(currentJob);
        });
    });

    const first = document.querySelector("input[name='jobType']");
    if (first && !first.checked) first.checked = true;
}

/* =========================================================
   ВЫБОР КЛАССА РЕМОНТА (ПРАВАЯ КОЛОНКА, repairClass)
   ========================================================= */

function initRepairClassRadios() {
    const radios = document.querySelectorAll("input[name='repairClass']");
    if (!radios.length) return;

    radios.forEach(radio => {
        radio.addEventListener("change", () => {
            currentClass = radio.value; // econom | standard | premium

            // При переключении на NORM - сбрасываем выбор на все блоки
            if (currentClass === "standard") {
                selectedWorkBlocks = ["b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "b10"];
            }

            loadReceipt(currentJob);
        });
    });

    const first = document.querySelector("input[name='repairClass']");
    if (first && !first.checked) first.checked = true;
}

/* =========================================================
   КНОПКА СБРОСА ВЫБОРА РАБОТ (NORM/PRO)
   ========================================================= */

function initResetWorkBlocksButton() {
    const resetBtn = document.getElementById("resetWorkBlocksBtn");
    if (!resetBtn) return;

    resetBtn.addEventListener("click", () => {
        // Сброс выбранных блоков для NORM на все блоки
        selectedWorkBlocks = ["b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "b10"];

        // Убираем предупреждение, если оно было
        hideInspectionWarning();

        // Перерисовываем чек
        loadReceipt(currentJob);
    });
}

/* =========================================================
   КНОПКА СБРОСА ФИЛЬТРОВ (ТИП РАБОТ + СТЕНЫ)
   ========================================================= */

function initResetFiltersButton() {
    const resetBtn = document.getElementById("resetFiltersBtn");
    if (!resetBtn) return;

    resetBtn.addEventListener("click", () => {
        // Сброс типа работ на painting
        currentJob = "painting";
        document.querySelector("input[name='jobType'][value='painting']").checked = true;

        // Сброс всех checkbox стен
        document.querySelectorAll(".plane-toggle").forEach(box => {
            box.checked = false;
            const side = box.dataset.side;
            const wall = document.querySelector(`.wall.${side}`);
            if (wall) wall.classList.remove("selected");
        });

        // Сброс "Выбрать всё"
        document.getElementById("selectAll").checked = false;

        // Перерисовываем чек с новым типом работ
        loadReceipt(currentJob);
    });
}

