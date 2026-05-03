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

    // Работы для покраски (10 позиций)
    const workItems = [
        { id: 'paintInspection', name: "Осмотр и консультация мастера", percent: 0.10, checked: selectedNormWorks.paintInspection },
        { id: 'paintPrep', name: "Подготовка поверхности (очистка, шпаклёвка)", percent: 0.15, checked: selectedNormWorks.paintPrep },
        { id: 'paintPrimer', name: "Грунтовка стен", percent: 0.10, checked: selectedNormWorks.paintPrimer },
        { id: 'paintProtection', name: "Защита мебели и пола", percent: 0.05, checked: selectedNormWorks.paintProtection },
        { id: 'paintCoat1', name: "Покраска первым слоем", percent: 0.20, checked: selectedNormWorks.paintCoat1 },
        { id: 'paintCoat2', name: "Покраска вторым слоем", percent: 0.20, checked: selectedNormWorks.paintCoat2 },
        { id: 'paintHardSpots', name: "Покраска труднодоступных мест", percent: 0.05, checked: selectedNormWorks.paintHardSpots },
        { id: 'paintQuality', name: "Финишная проверка качества", percent: 0.05, checked: selectedNormWorks.paintQuality },
        { id: 'paintCleanup', name: "Уборка помещения", percent: 0.05, checked: selectedNormWorks.paintCleanup },
        { id: 'paintTrash', name: "Вывоз мусора", percent: 0.05, checked: selectedNormWorks.paintTrash }
    ];

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

    // Работы для обоев (10 позиций)
    const workItems = [
        { id: 'wpInspection', name: "Осмотр и консультация мастера", percent: 0.10, checked: selectedNormWorks.wpInspection },
        { id: 'wpPrep', name: "Подготовка поверхности (очистка, выравнивание)", percent: 0.15, checked: selectedNormWorks.wpPrep },
        { id: 'wpPrimer', name: "Грунтовка стен", percent: 0.10, checked: selectedNormWorks.wpPrimer },
        { id: 'wpProtection', name: "Защита мебели и пола", percent: 0.05, checked: selectedNormWorks.wpProtection },
        { id: 'wpCutting', name: "Разметка и раскрой обоев", percent: 0.10, checked: selectedNormWorks.wpCutting },
        { id: 'wpHanging', name: "Поклейка обоев", percent: 0.25, checked: selectedNormWorks.wpHanging },
        { id: 'wpTrimming', name: "Подрезка и подгонка стыков", percent: 0.10, checked: selectedNormWorks.wpTrimming },
        { id: 'wpQuality', name: "Финишная проверка качества", percent: 0.05, checked: selectedNormWorks.wpQuality },
        { id: 'wpCleanup', name: "Уборка помещения", percent: 0.05, checked: selectedNormWorks.wpCleanup },
        { id: 'wpTrash', name: "Вывоз мусора", percent: 0.05, checked: selectedNormWorks.wpTrash }
    ];

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
 * @param {string} jobType - тип работы (painting | wallpaper | flooring)
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
window.calculateNormPainting = calculateNormPainting;
window.calculateNormWallpaper = calculateNormWallpaper;
window.updateNormWorkSelection = updateNormWorkSelection;
window.selectedNormWorks = selectedNormWorks;
