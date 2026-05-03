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
    initResetResultsButton();
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
            items: [],
            workTotal: 0,
            materialTotal: 0,
            equipmentTotal: 0,
            grandTotal: 0
        };
    }

    const area = getWallsAreaM2();

    // Используем модули расчёта по классам ремонта
    switch(currentClass) {
        case "econom":
            // ECO.js - только материалы + инструменты (checkbox)
            if (typeof window.calculateEco === 'function') {
                return window.calculateEco(currentJob, area, pricing);
            }
            break;

        case "standard":
            // NORM.js - материалы + работы (выбранные блоки)
            if (typeof window.calculateNorm === 'function') {
                return window.calculateNorm(currentJob, area, pricing);
            }
            break;

        case "premium":
            // PRO.js - материалы + работы + оборудование (всё включено)
            if (typeof window.calculatePro === 'function') {
                return window.calculatePro(currentJob, area, pricing);
            }
            break;
    }

    // Fallback если модули не загружены
    return {
        area,
        items: [],
        workTotal: 0,
        materialTotal: 0,
        equipmentTotal: 0,
        grandTotal: 0
    };
}

/* =========================================================
   РЕНДЕРИНГ ЧЕКА
   ========================================================= */

function renderReceipt(model) {
    const box = document.getElementById("resultsBox");
    if (!box) return;

    const totals = calculateTotals(model);

    let htmlBlocks = "";

    // Рендерим блоки из новой структуры (items из ECO/NORM/PRO модулей)
    if (totals.items && totals.items.length > 0) {
        totals.items.forEach(itemGroup => {
            // Заголовок категории
            htmlBlocks += `<div class="receipt__group-title">${itemGroup.category}</div>`;

            // Pozīcijas ar checkbox (ECO un NORM klases)
            if (itemGroup.lines && itemGroup.lines.length > 0) {
                itemGroup.lines.forEach(line => {
                    // Ja ir 'checked' lauks, tad checkbox pozīcija
                    if (line.hasOwnProperty('checked')) {
                        const isChecked = line.checked ? 'checked' : '';
                        const cost = line.checked ? line.price : 0;

                        // Noteikt checkbox klasi (ECO vai NORM)
                        const checkboxClass = currentClass === "econom" ? "eco-tool-toggle" : "norm-work-toggle";
                        const dataAttr = currentClass === "econom" ? "data-tool-id" : "data-work-id";

                        htmlBlocks += `
                            <div class="receipt__line">
                                <label style="display: flex; align-items: center; cursor: pointer; flex: 1;">
                                    <input type="checkbox" class="${checkboxClass}" ${dataAttr}="${line.id}" ${isChecked}
                                           style="margin-right: 8px; cursor: pointer;">
                                    <span style="flex: 1;">${line.name}</span>
                                </label>
                                <span>${cost.toFixed(2)} €</span>
                            </div>
                        `;
                    }
                    // Parastā pozīcija bez checkbox
                    else {
                        htmlBlocks += `
                            <div class="receipt__line">
                                <span>${line.name}</span>
                                <span>${line.cost.toFixed(2)} €</span>
                            </div>
                        `;
                    }
                });

                // Pievienojam starpsummu ja ir
                if (itemGroup.hasOwnProperty('subtotal')) {
                    htmlBlocks += `
                        <div class="receipt__line" style="border-top: 1px solid #ddd; margin-top: 4px; padding-top: 4px; font-weight: 600;">
                            <span>Итого ${itemGroup.category.toLowerCase()}</span>
                            <span>${itemGroup.subtotal.toFixed(2)} €</span>
                        </div>
                    `;
                }
            }
        });
    }

    // Добавляем детали краски для крашения с Alpina
    let paintDetailsHtml = "";
    if (currentJob === "painting" && totals.paintData) {
        const pd = totals.paintData;

        paintDetailsHtml = `<div class="receipt__group-title">Детали материалов</div>`;

        // Грунтовка (если есть)
        if (totals.primerData) {
            const primer = totals.primerData;

            paintDetailsHtml += `<div style="margin-bottom: 10px;">`;
            paintDetailsHtml += `<div class="receipt__line" style="font-weight: 600;">
                <span>Грунтовка (обязательно)</span>
                <span></span>
            </div>`;

            // Группируем канистры грунтовки
            const primerGroups = {};
            primer.cans.forEach(can => {
                const key = `${can.name}_${can.size}L`;
                if (!primerGroups[key]) {
                    primerGroups[key] = {
                        name: can.name,
                        size: can.size,
                        price: can.price,
                        count: 0
                    };
                }
                primerGroups[key].count++;
            });

            Object.values(primerGroups).forEach(group => {
                paintDetailsHtml += `
                    <div class="receipt__line">
                        <span>${group.name} ${group.size}L</span>
                        <span>${group.count} × ${group.price.toFixed(2)}€</span>
                    </div>
                `;
            });

            paintDetailsHtml += `
                <div class="receipt__line receipt__muted">
                    <span>Необходимо</span>
                    <span>${primer.litersNeeded}L</span>
                </div>
                <div class="receipt__line receipt__muted">
                    <span>Всего грунтовки</span>
                    <span>${primer.totalLiters}L</span>
                </div>
            `;
            paintDetailsHtml += `</div>`;
        }

        // Краска
        paintDetailsHtml += `<div style="margin-bottom: 10px;">`;
        paintDetailsHtml += `<div class="receipt__line" style="font-weight: 600;">
            <span>Краска (2 слоя)</span>
            <span></span>
        </div>`;

        // Группируем вёдра краски
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

        Object.values(bucketGroups).forEach(group => {
            paintDetailsHtml += `
                <div class="receipt__line">
                    <span>${group.name} ${group.size}L</span>
                    <span>${group.count} × ${group.price.toFixed(2)}€</span>
                </div>
            `;
        });

        paintDetailsHtml += `
            <div class="receipt__line receipt__muted">
                <span>Необходимо</span>
                <span>${pd.litersNeeded}L</span>
            </div>
            <div class="receipt__line receipt__muted">
                <span>Всего краски</span>
                <span>${pd.totalLiters}L</span>
            </div>
        `;
        paintDetailsHtml += `</div>`;
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

    // Формируем итоговые суммы в зависимости от класса
    let totalSummaryHtml = "";
    if (currentClass === "econom") {
        // Для ECO: Материалы + Инструменты + Оборудование + Дополнительно
        totalSummaryHtml = `
            <div class="receipt__line">
                <span>Материалы всего</span>
                <span>${totals.materialTotal.toFixed(2)} €</span>
            </div>
            <div class="receipt__line">
                <span>Инструменты</span>
                <span>${(totals.toolsTotal || 0).toFixed(2)} €</span>
            </div>
            <div class="receipt__line">
                <span>Оборудование</span>
                <span>${(totals.equipmentTotal || 0).toFixed(2)} €</span>
            </div>
            <div class="receipt__line">
                <span>Дополнительно</span>
                <span>${(totals.extrasTotal || 0).toFixed(2)} €</span>
            </div>
            <div class="receipt__line">
                <span>ИТОГО</span>
                <span>${totals.grandTotal.toFixed(2)} €</span>
            </div>
        `;
    } else {
        // Для NORM и PRO: Работы + Материалы + Оборудование
        totalSummaryHtml = `
            <div class="receipt__line">
                <span>Работы всего</span>
                <span>${(totals.workTotal || 0).toFixed(2)} €</span>
            </div>
            <div class="receipt__line">
                <span>Материалы всего</span>
                <span>${totals.materialTotal.toFixed(2)} €</span>
            </div>
            <div class="receipt__line">
                <span>Оборудование</span>
                <span>${(totals.equipmentTotal || 0).toFixed(2)} €</span>
            </div>
            <div class="receipt__line">
                <span>ИТОГО</span>
                <span>${totals.grandTotal.toFixed(2)} €</span>
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
                ${totalSummaryHtml}
            </div>

            ${currentClass === "econom" ? `
                <button id="downloadPdfBtn" style="
                    width: 100%;
                    padding: 12px;
                    margin-top: 15px;
                    background: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.3s;
                ">
                    📄 Скачать PDF
                </button>
            ` : ''}

            <div class="receipt__muted" style="margin-top:6px;">
                * Эконом: только материалы + инструменты. Стандарт/Премиум: работа + материалы + оборудование.
            </div>
        </div>
    `;

    // Привязываем обработчики к checkbox
    attachCheckboxListeners();

    // Привязываем обработчик к кнопке PDF (только для ECO)
    if (currentClass === "econom") {
        const pdfBtn = document.getElementById("downloadPdfBtn");
        if (pdfBtn) {
            pdfBtn.addEventListener("click", () => {
                if (typeof window.generateEcoPDF === 'function') {
                    window.generateEcoPDF(totals, currentJob);
                } else {
                    alert('Ошибка: функция генерации PDF не загружена');
                }
            });

            // Hover эффект
            pdfBtn.addEventListener("mouseenter", () => {
                pdfBtn.style.background = "#45a049";
            });
            pdfBtn.addEventListener("mouseleave", () => {
                pdfBtn.style.background = "#4CAF50";
            });
        }
    }
}

/* =========================================================
   ОБРАБОТЧИКИ CHECKBOX
   ========================================================= */

function attachCheckboxListeners() {
    // ECO класс: checkbox для инструментов
    const ecoCheckboxes = document.querySelectorAll(".eco-tool-toggle");
    ecoCheckboxes.forEach(checkbox => {
        checkbox.addEventListener("change", (e) => {
            const toolId = e.target.dataset.toolId;
            const checked = e.target.checked;

            // Обновляем состояние в ECO.js
            if (typeof window.updateEcoToolSelection === 'function') {
                window.updateEcoToolSelection(toolId, checked);
            }

            // Перерисовываем чек
            loadReceipt(currentJob);
        });
    });

    // NORM класс: checkbox для работ
    const normCheckboxes = document.querySelectorAll(".norm-work-toggle");
    normCheckboxes.forEach(checkbox => {
        checkbox.addEventListener("change", (e) => {
            const workId = e.target.dataset.workId;
            const checked = e.target.checked;

            // Обновляем состояние в NORM.js
            if (typeof window.updateNormWorkSelection === 'function') {
                window.updateNormWorkSelection(workId, checked);
            }

            // Перерисовываем чек
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
            loadReceipt(currentJob);
        });
    });

    const first = document.querySelector("input[name='repairClass']");
    if (first && !first.checked) first.checked = true;
}

/* =========================================================
   КНОПКА СБРОСА РЕЗУЛЬТАТОВ (ECO/NORM/PRO)
   ========================================================= */

function initResetResultsButton() {
    const resetBtn = document.getElementById("resetWorkBlocksBtn");
    if (!resetBtn) return;

    resetBtn.addEventListener("click", () => {
        // Сброс для ECO класса - все инструменты выбраны, оборудование/дополнительно - нет
        if (typeof window.selectedEcoTools !== 'undefined') {
            window.selectedEcoTools.brushes = true;
            window.selectedEcoTools.rollers = true;
            window.selectedEcoTools.tape = true;
            window.selectedEcoTools.covers = true;
            window.selectedEcoTools.sprayGun = false;
            window.selectedEcoTools.ledLights = false;
            window.selectedEcoTools.sander = false;
            window.selectedEcoTools.laser = false;
            window.selectedEcoTools.extraTape = false;
            window.selectedEcoTools.extraTools = false;
            window.selectedEcoTools.safety = false;
        }

        // Сброс для NORM класса - все работы выбраны
        if (typeof window.selectedNormWorks !== 'undefined') {
            // Покраска
            window.selectedNormWorks.paintInspection = true;
            window.selectedNormWorks.paintPrep = true;
            window.selectedNormWorks.paintPrimer = true;
            window.selectedNormWorks.paintProtection = true;
            window.selectedNormWorks.paintCoat1 = true;
            window.selectedNormWorks.paintCoat2 = true;
            window.selectedNormWorks.paintHardSpots = true;
            window.selectedNormWorks.paintQuality = true;
            window.selectedNormWorks.paintCleanup = true;
            window.selectedNormWorks.paintTrash = true;

            // Обои
            window.selectedNormWorks.wpInspection = true;
            window.selectedNormWorks.wpPrep = true;
            window.selectedNormWorks.wpPrimer = true;
            window.selectedNormWorks.wpProtection = true;
            window.selectedNormWorks.wpCutting = true;
            window.selectedNormWorks.wpHanging = true;
            window.selectedNormWorks.wpTrimming = true;
            window.selectedNormWorks.wpQuality = true;
            window.selectedNormWorks.wpCleanup = true;
            window.selectedNormWorks.wpTrash = true;
        }

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

