/* =========================================================
   ИНИЦИАЛИЗАЦИЯ ПРОЕКТА
   ========================================================= */

window.addEventListener("load", () => {
    // Инициализируем 3D визуализацию (из room3d.js)
    if (typeof init3D === 'function') {
        init3D();
    }

    // Значения по умолчанию:
    currentJob = "painting";   // тип работы
    currentClass = "econom";   // класс ремонта

    // Инициализируем подсветку выбранных стен по умолчанию
    document.querySelectorAll('.plane-toggle:checked').forEach(box => {
        const side = box.dataset.side;
        const wall = document.querySelector(`.wall.${side}`);
        if (wall) wall.classList.add("selected");
    });

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

    // Привязка checkbox событий для пересчета
    document.querySelectorAll(".plane-toggle").forEach(box => {
        box.addEventListener("change", () => {
            const side = box.dataset.side;
            const wall = document.querySelector(`.wall.${side}`);
            wall.classList.toggle("selected", box.checked);
            loadReceipt(currentJob);
        });
    });

    // Привязка "Выбрать всё"
    document.getElementById("selectAll").addEventListener("change", function () {
        const isChecked = this.checked;
        document.querySelectorAll(".plane-toggle").forEach(box => {
            if (box.checked !== isChecked) {
                box.checked = isChecked;
                box.dispatchEvent(new Event("change"));
            }
        });
    });
});

/* =========================================================
   ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
   ========================================================= */

// Текущий тип работы и класс ремонта
// job: painting | wallpaper | flooring
// class: econom | standard | premium
let currentJob = "painting";
let currentClass = "econom";

// Объект с ценами из pricing.json
let pricing = null;

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
   ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ: ПЛОЩАДЬ ВЫБРАННЫХ ПЛОСКОСТЕЙ (м²)
   ========================================================= */

function getWallsAreaM2() {
    // Получаем input элементы из room3d.js
    const inputs = window.getInputElements ? window.getInputElements() : {};
    const xInp = inputs.xInp || document.getElementById("xInp");
    const yInp = inputs.yInp || document.getElementById("yInp");
    const zInp = inputs.zInp || document.getElementById("zInp");

    const x = +xInp.value || 0;
    const y = +yInp.value || 0;
    const z = +zInp.value || 0;

    // Конвертируем см в м
    const xM = x / 100;
    const yM = y / 100;
    const zM = z / 100;

    let totalArea = 0;

    // Проверяем какие плоскости отмечены и суммируем их площадь
    document.querySelectorAll('.plane-toggle:checked').forEach(box => {
        const side = box.dataset.side;

        switch(side) {
            case 'front':
            case 'back':
                totalArea += xM * zM;
                break;
            case 'left':
            case 'right':
                totalArea += yM * zM;
                break;
            case 'ceiling':
            case 'floor':
                totalArea += xM * yM;
                break;
        }
    });

    return totalArea;
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
   ПЕРЕСЧЁТ ЧЕКА (вызывается из room3d.js при изменении размеров)
   ========================================================= */

function recalculateReceipt() {
    loadReceipt(currentJob);
}

// Экспортируем для room3d.js
window.recalculateReceipt = recalculateReceipt;

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

    // Для крашения используем Alpina с оптимизацией вёдер
    if (currentJob === "painting" && pricing.alpina && typeof window.calculatePaintQuantity === 'function') {
        const paintData = window.calculatePaintQuantity(area, pricing.alpina);

        // Для ECO класса: только материалы (краска)
        if (currentClass === "econom") {
            return {
                area,
                workTotal: 0,
                materialTotal: paintData.totalCost,
                equipmentTotal: 0,
                grandTotal: paintData.totalCost,
                paintData
            };
        }

        // Для NORM и PRO: добавляем работу
        const workRate = pricing.workRatePerM2?.[currentJob]?.[currentClass] || 0;
        const workTotal = area * workRate;

        return {
            area,
            workTotal,
            materialTotal: paintData.totalCost,
            equipmentTotal: 0,
            grandTotal: workTotal + paintData.totalCost,
            paintData
        };
    }

    // Для обоев используем wallpaper.js
    if (currentJob === "wallpaper" && pricing.wallpaper && typeof window.calculateWallpaperCost === 'function') {
        const wpData = window.calculateWallpaperCost(area, pricing);

        // Для ECO класса: только материалы (обои + клей)
        if (currentClass === "econom") {
            return {
                area,
                workTotal: 0,
                materialTotal: wpData.totalCost,
                equipmentTotal: 0,
                grandTotal: wpData.totalCost,
                wallpaperData: wpData
            };
        }

        // Для NORM и PRO: добавляем работу
        const workRate = pricing.workRatePerM2?.[currentJob]?.[currentClass] || 0;
        const workTotal = area * workRate;

        return {
            area,
            workTotal,
            materialTotal: wpData.totalCost,
            equipmentTotal: 0,
            grandTotal: workTotal + wpData.totalCost,
            wallpaperData: wpData
        };
    }

    // Старая логика для других типов работ
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

    // Добавляем детали краски для крашения с Alpina
    let paintDetailsHtml = "";
    if (currentJob === "painting" && totals.paintData) {
        const pd = totals.paintData;

        // Группируем вёдра по размеру для красивого отображения
        const bucketGroups = {};
        pd.buckets.forEach(bucket => {
            const key = `${bucket.name}_${bucket.size}L`;
            if (!bucketGroups[key]) {
                bucketGroups[key] = {
                    name: bucket.name,
                    size: bucket.size,
                    price: bucket.price,
                    count: 0
                };
            }
            bucketGroups[key].count++;
        });

        let bucketsHtml = "";
        Object.values(bucketGroups).forEach(group => {
            bucketsHtml += `
                <div class="receipt__line">
                    <span>${group.name} ${group.size}L</span>
                    <span>${group.count} × ${group.price.toFixed(2)}€</span>
                </div>
            `;
        });

        paintDetailsHtml = `
            <div class="receipt__group-title">Детали краски</div>
            ${bucketsHtml}
            <div class="receipt__line receipt__muted">
                <span>Необходимо</span>
                <span>${pd.litersNeeded}L</span>
            </div>
            <div class="receipt__line receipt__muted">
                <span>Всего краски</span>
                <span>${pd.totalLiters}L</span>
            </div>
        `;
    }

    // Добавляем детали обоев для поклейки обоев
    let wallpaperDetailsHtml = "";
    if (currentJob === "wallpaper" && totals.wallpaperData) {
        const wp = totals.wallpaperData;
        const wpInfo = pricing.wallpaper;
        wallpaperDetailsHtml = `
            <div class="receipt__group-title">Детали обоев</div>
            <div class="receipt__line">
                <span>${wpInfo.name}</span>
                <span>${wp.rolls} рулонов</span>
            </div>
            <div class="receipt__line receipt__muted">
                <span>Размер рулона</span>
                <span>${wpInfo.rollLength}м × ${wpInfo.rollWidth}м</span>
            </div>
            <div class="receipt__line">
                <span>${wpInfo.glueName}</span>
                <span>${wp.gluePackages} × ${wpInfo.glueWeight * 1000}г</span>
            </div>
            <div class="receipt__line receipt__muted">
                <span>Стоимость обоев</span>
                <span>${wp.rollCost.toFixed(2)} €</span>
            </div>
            <div class="receipt__line receipt__muted">
                <span>Стоимость клея</span>
                <span>${wp.glueCost.toFixed(2)} €</span>
            </div>
        `;
    }

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

            ${paintDetailsHtml}
            ${wallpaperDetailsHtml}

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
                * Эконом: только материалы. Стандарт/Премиум: работа + материалы + оборудование.
            </div>
        </div>
    `;

    // Показываем предупреждение, если b1 не выбран в NORM классе
    if (currentClass === "standard" && !selectedWorkBlocks.includes("b1")) {
        const warning = document.createElement("div");
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
            <a href="#" onclick="returnInspectionBlock(); return false;" style="color: #856404; text-decoration: underline; margin-left: 8px; cursor: pointer;">вернуть</a>
        `;
        box.insertBefore(warning, box.firstChild);
    }

    // Привязываем обработчики к новым checkbox
    attachWorkBlockCheckboxListeners();
}

/* =========================================================
   ФУНКЦИЯ ДЛЯ ВОЗВРАТА БЛОКА b1 (ОСМОТР)
   ========================================================= */

function returnInspectionBlock() {
    // Добавляем b1 обратно в выбранные блоки
    if (!selectedWorkBlocks.includes("b1")) {
        selectedWorkBlocks.push("b1");
    }

    // Перерисовываем чек
    loadReceipt(currentJob);
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
            }

            // Перерисовываем чек с новыми выбранными блоками
            loadReceipt(currentJob);
        });
    });
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

        // Сброс checkbox на значения по умолчанию (4 стены + потолок, БЕЗ пола)
        document.querySelectorAll(".plane-toggle").forEach(box => {
            const side = box.dataset.side;
            const wall = document.querySelector(`.wall.${side}`);

            // Отмечаем все кроме пола
            if (side === "floor") {
                box.checked = false;
                if (wall) wall.classList.remove("selected");
            } else {
                box.checked = true;
                if (wall) wall.classList.add("selected");
            }
        });

        // Сброс "Выбрать всё"
        document.getElementById("selectAll").checked = false;

        // Перерисовываем чек с новым типом работ
        loadReceipt(currentJob);
    });
}

