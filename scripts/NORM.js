/* =========================================================
   NORM.js - РАСЧЁТЫ ДЛЯ КЛАССА STANDARD (NORM)
   ========================================================= */

/**
 * Расчёт для класса STANDARD (NORM)
 * Особенности:
 * - Материалы + Работы (checkbox для каждой работы)
 * - Клиент выбирает какие работы нужны
 * - Оборудование = 0€ (клиент арендует сам или у мастера)
 * - Работы рассчитываются по ставке за м²
 */

// Хранилище выбранных работ для NORM класса
let selectedNormWorks = {
    // Работы для покраски (по умолчанию все выбраны)
    paintInspection: true,
    paintPrep: true,
    paintPrimer: true,
    paintProtection: true,
    paintCoat1: true,
    paintCoat2: true,
    paintHardSpots: true,
    paintQuality: true,
    paintCleanup: true,
    paintTrash: true,

    // Работы для обоев (по умолчанию все выбраны)
    wpInspection: true,
    wpPrep: true,
    wpPrimer: true,
    wpProtection: true,
    wpCutting: true,
    wpHanging: true,
    wpTrimming: true,
    wpQuality: true,
    wpCleanup: true,
    wpTrash: true
};

/**
 * Расчёт покраски для NORM класса
 * @param {number} area - площадь в м²
 * @param {object} pricing - объект с ценами из pricing.json
 * @returns {object} - детализированный расчёт
 */
function calculateNormPainting(area, pricing) {
    if (!pricing || !pricing.alpina) {
        return {
            area,
            items: [],
            workTotal: 0,
            materialTotal: 0,
            equipmentTotal: 0,
            grandTotal: 0,
            paintData: null
        };
    }

    // Используем paint.js для оптимизации вёдер
    const paintData = window.calculatePaintQuantity
        ? window.calculatePaintQuantity(area, pricing.alpina)
        : null;

    if (!paintData) {
        return {
            area,
            items: [],
            workTotal: 0,
            materialTotal: 0,
            equipmentTotal: 0,
            grandTotal: 0,
            paintData: null
        };
    }

    // Расчёт работ по ставке за м²
    const workRate = pricing.workRatePerM2?.painting?.standard || 0;
    const totalWorkCost = area * workRate;

    // Работы для покраски — доли этапов из общей таблицы (work-stages.js)
    const workItems = WORK_STAGE_PERCENTS.painting.map(({ stage, percent }) => {
        const id = makeStageId('paint', stage);
        return { id, percent, checked: !!selectedNormWorks[id] };
    });

    // Рассчитываем цену каждой работы
    workItems.forEach(item => {
        item.price = totalWorkCost * item.percent;
    });

    // Считаем сумму выбранных работ
    const workTotal = workItems.reduce((sum, item) => sum + (item.checked ? item.price : 0), 0);

    // Формируем структуру для чека
    const items = [
        {
            category: "Работы",
            lines: workItems,
            subtotal: workTotal
        }
    ];

    const materialTotal = paintData.totalCost;
    const grandTotal = materialTotal + workTotal;

    return {
        area,
        items,
        workTotal,
        materialTotal,
        equipmentTotal: 0,
        grandTotal,
        paintData
    };
}

/**
 * Расчёт обоев для NORM класса
 * @param {number} area - площадь в м²
 * @param {object} pricing - объект с ценами из pricing.json
 * @returns {object} - детализированный расчёт
 */
function calculateNormWallpaper(area, pricing) {
    if (!pricing || !pricing.wallpaper) {
        return {
            area,
            items: [],
            workTotal: 0,
            materialTotal: 0,
            equipmentTotal: 0,
            grandTotal: 0,
            wallpaperData: null
        };
    }

    // Используем wallpaper.js для расчёта
    const wpData = window.calculateWallpaperCost
        ? window.calculateWallpaperCost(area, pricing)
        : null;

    if (!wpData) {
        return {
            area,
            items: [],
            workTotal: 0,
            materialTotal: 0,
            equipmentTotal: 0,
            grandTotal: 0,
            wallpaperData: null
        };
    }

    // Расчёт работ по ставке за м²
    const workRate = pricing.workRatePerM2?.wallpaper?.standard || 0;
    const totalWorkCost = area * workRate;

    // Работы для обоев — доли этапов из общей таблицы (work-stages.js)
    const workItems = WORK_STAGE_PERCENTS.wallpaper.map(({ stage, percent }) => {
        const id = makeStageId('wp', stage);
        return { id, percent, checked: !!selectedNormWorks[id] };
    });

    // Рассчитываем цену каждой работы
    workItems.forEach(item => {
        item.price = totalWorkCost * item.percent;
    });

    // Считаем сумму выбранных работ
    const workTotal = workItems.reduce((sum, item) => sum + (item.checked ? item.price : 0), 0);

    // Формируем структуру для чека
    const items = [
        {
            category: "Работы",
            lines: workItems,
            subtotal: workTotal
        }
    ];

    const materialTotal = wpData.totalCost;
    const grandTotal = materialTotal + workTotal;

    return {
        area,
        items,
        workTotal,
        materialTotal,
        equipmentTotal: 0,
        grandTotal,
        wallpaperData: wpData
    };
}

/**
 * Обновление выбранных работ
 * @param {string} workId - ID работы
 * @param {boolean} checked - состояние checkbox
 */
function updateNormWorkSelection(workId, checked) {
    if (selectedNormWorks.hasOwnProperty(workId)) {
        selectedNormWorks[workId] = checked;
    }
}

/**
 * Главная функция расчёта для NORM класса
 * @param {string} jobType - тип работы (painting | wallpaper)
 * @param {number} area - площадь в м²
 * @param {object} pricing - объект с ценами из pricing.json
 * @returns {object} - полный расчёт
 */
function calculateNorm(jobType, area, pricing) {
    switch(jobType) {
        case "painting":
            return calculateNormPainting(area, pricing);
        case "wallpaper":
            return calculateNormWallpaper(area, pricing);
        default:
            return {
                area,
                items: [],
                workTotal: 0,
                materialTotal: 0,
                equipmentTotal: 0,
                grandTotal: 0
            };
    }
}

// Экспортируем функции
window.calculateNorm = calculateNorm;
window.updateNormWorkSelection = updateNormWorkSelection;
window.selectedNormWorks = selectedNormWorks;
