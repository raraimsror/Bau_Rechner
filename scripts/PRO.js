/* =========================================================
   PRO.js - РАСЧЁТЫ ДЛЯ КЛАССА PREMIUM (PRO)
   ========================================================= */

/**
 * Расчёт для класса PREMIUM (PRO)
 * Особенности:
 * - Материалы + Работы + Оборудование
 * - Все работы включены (полный сервис под ключ)
 * - Профессиональное оборудование в аренду
 * - Премиум материалы и инструменты
 * - Работы рассчитываются по премиум ставке за м²
 */

/**
 * Расчёт покраски для PRO класса
 * @param {number} area - площадь в м²
 * @param {object} pricing - объект с ценами из pricing.json
 * @returns {object} - детализированный расчёт
 */
function calculateProPainting(area, pricing) {
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

    // Расчёт работ по премиум ставке за м²
    const workRate = pricing.workRatePerM2?.painting?.premium || 0;
    const workTotal = area * workRate;

    // Материалы = краска Alpina
    const materialTotal = paintData.totalCost;

    // Оборудование (фиксированная стоимость)
    const equipmentTotal = pricing.equipmentTotal?.painting?.premium || 0;

    // Формируем список позиций для чека
    const items = [];

    // Блок работ (все работы включены)
    const allWorkBlocks = [
        { id: 'proInspection', cost: workTotal * 0.10 },
        { id: 'proPrep', cost: workTotal * 0.15 },
        { id: 'proPrimer', cost: workTotal * 0.10 },
        { id: 'proProtection', cost: workTotal * 0.05 },
        { id: 'proCoat1', cost: workTotal * 0.20 },
        { id: 'proCoat2', cost: workTotal * 0.20 },
        { id: 'proHardSpots', cost: workTotal * 0.05 },
        { id: 'proQuality', cost: workTotal * 0.05 },
        { id: 'proCleanup', cost: workTotal * 0.05 },
        { id: 'proTrash', cost: workTotal * 0.05 }
    ];

    items.push({
        category: "Работы (Премиум)",
        lines: allWorkBlocks
    });

    // Блок материалов
    items.push({
        category: "Материалы (OBI Premium)",
        lines: [
            { id: 'paintPremium', cost: materialTotal },
            { id: 'primerPremium', cost: area * 0.5 },
            { id: 'fillerFinish', cost: area * 0.3 },
            { id: 'tapePro', cost: 8.0 },
            { id: 'filmReinforced', cost: 12.0 }
        ]
    });

    // Блок оборудования
    items.push({
        category: "Аренда оборудования (Премиум)",
        lines: [
            { id: 'sprayGun', cost: equipmentTotal * 0.40 },
            { id: 'ledLights', cost: equipmentTotal * 0.20 },
            { id: 'sander', cost: equipmentTotal * 0.25 },
            { id: 'laser', cost: equipmentTotal * 0.15 }
        ]
    });

    // Дополнительные материалы включены в премиум
    const additionalMaterials = area * 0.8 + 20.0;
    items.push({
        category: "Дополнительные материалы",
        lines: [
            { id: 'tapePlus', cost: additionalMaterials * 0.3 },
            { id: 'toolsPlus', cost: additionalMaterials * 0.4 },
            { id: 'safety', cost: additionalMaterials * 0.3 }
        ]
    });

    const materialTotalWithExtras = materialTotal + (area * 0.8) + 20.0;
    const grandTotal = workTotal + materialTotalWithExtras + equipmentTotal;

    return {
        area,
        items,
        workTotal,
        materialTotal: materialTotalWithExtras,
        equipmentTotal,
        grandTotal,
        paintData
    };
}

/**
 * Расчёт обоев для PRO класса
 * @param {number} area - площадь в м²
 * @param {object} pricing - объект с ценами из pricing.json
 * @returns {object} - детализированный расчёт
 */
function calculateProWallpaper(area, pricing) {
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

    // Расчёт работ по премиум ставке за м²
    const workRate = pricing.workRatePerM2?.wallpaper?.premium || 0;
    const workTotal = area * workRate;

    // Материалы = обои + клей
    const materialTotal = wpData.totalCost;

    // Оборудование (фиксированная стоимость)
    const equipmentTotal = pricing.equipmentTotal?.wallpaper?.premium || 0;

    // Формируем список позиций для чека
    const items = [];

    // Блок работ (все работы включены)
    const allWorkBlocks = [
        { id: 'proWpInspection', cost: workTotal * 0.10 },
        { id: 'proWpPrep', cost: workTotal * 0.15 },
        { id: 'proWpPrimer', cost: workTotal * 0.10 },
        { id: 'proWpProtection', cost: workTotal * 0.05 },
        { id: 'proWpCutting', cost: workTotal * 0.10 },
        { id: 'proWpHanging', cost: workTotal * 0.25 },
        { id: 'proWpTrimming', cost: workTotal * 0.10 },
        { id: 'proWpQuality', cost: workTotal * 0.05 },
        { id: 'proWpCleanup', cost: workTotal * 0.05 },
        { id: 'proWpTrash', cost: workTotal * 0.05 }
    ];

    items.push({
        category: "Работы (Премиум)",
        lines: allWorkBlocks
    });

    // Блок материалов
    items.push({
        category: "Материалы (TOOM Premium)",
        lines: [
            { id: 'wallpaperPremium', cost: wpData.rollCost },
            { id: 'gluePremium', cost: wpData.glueCost },
            { id: 'primerWallpaper', cost: area * 0.4 },
            { id: 'fillerFinish', cost: area * 0.3 }
        ]
    });

    // Блок оборудования
    items.push({
        category: "Аренда оборудования (Премиум)",
        lines: [
            { id: 'table', cost: equipmentTotal * 0.30 },
            { id: 'ledLights', cost: equipmentTotal * 0.25 },
            { id: 'laser', cost: equipmentTotal * 0.25 },
            { id: 'proTools', cost: equipmentTotal * 0.20 }
        ]
    });

    // Дополнительные материалы
    const additionalMaterials = area * 0.7 + 15.0;
    items.push({
        category: "Дополнительные материалы",
        lines: [
            { id: 'gluePlus', cost: additionalMaterials * 0.4 },
            { id: 'proToolsPlus', cost: additionalMaterials * 0.4 },
            { id: 'safety', cost: additionalMaterials * 0.2 }
        ]
    });

    const materialTotalWithExtras = materialTotal + (area * 0.7) + 15.0;
    const grandTotal = workTotal + materialTotalWithExtras + equipmentTotal;

    return {
        area,
        items,
        workTotal,
        materialTotal: materialTotalWithExtras,
        equipmentTotal,
        grandTotal,
        wallpaperData: wpData
    };
}

/**
 * Главная функция расчёта для PRO класса
 * @param {string} jobType - тип работы (painting | wallpaper | flooring)
 * @param {number} area - площадь в м²
 * @param {object} pricing - объект с ценами из pricing.json
 * @returns {object} - полный расчёт
 */
function calculatePro(jobType, area, pricing) {
    switch(jobType) {
        case "painting":
            return calculateProPainting(area, pricing);
        case "wallpaper":
            return calculateProWallpaper(area, pricing);
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
window.calculatePro = calculatePro;
window.calculateProPainting = calculateProPainting;
window.calculateProWallpaper = calculateProWallpaper;
