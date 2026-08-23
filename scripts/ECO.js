/* =========================================================
   ECO.js - РАСЧЁТЫ ДЛЯ КЛАССА ECONOM
   ========================================================= */

/**
 * Расчёт для класса ECONOM
 * Особенности:
 * - Только материалы (клиент работает сам)
 * - Checkbox для каждого инструмента/оборудования
 * - Динамический расчёт суммы по выбранным позициям
 * - Работы = 0€
 */

// Хранилище выбранных позиций для ECO класса
let selectedEcoTools = {
    // Инструменты (по умолчанию все выбраны)
    brushes: true,
    rollers: true,
    tape: true,
    covers: true,

    // Аренда оборудования (по умолчанию не выбраны)
    sprayGun: false,
    ledLights: false,
    sander: false,
    laser: false,

    // Дополнительные материалы (по умолчанию не выбраны)
    extraTape: false,
    extraTools: false,
    safety: false
};

/**
 * Расчёт покраски для ECO класса
 * @param {number} area - площадь в м²
 * @param {object} pricing - объект с ценами из pricing.json
 * @returns {object} - детализированный расчёт
 */
function calculateEcoPainting(area, pricing) {
    if (!pricing || !pricing.alpina) {
        return {
            area,
            items: [],
            workTotal: 0,
            materialTotal: 0,
            toolsTotal: 0,
            equipmentTotal: 0,
            extrasTotal: 0,
            grandTotal: 0,
            paintData: null,
            primerData: null
        };
    }

    // Используем технологическую карту (грунтовка + краска)
    const techCard = window.calculatePaintingTechCard
        ? window.calculatePaintingTechCard(area, pricing)
        : null;

    if (!techCard || !techCard.paint) {
        return {
            area,
            items: [],
            workTotal: 0,
            materialTotal: 0,
            toolsTotal: 0,
            equipmentTotal: 0,
            extrasTotal: 0,
            grandTotal: 0,
            paintData: null,
            primerData: null
        };
    }

    // Цены инструментов
    const ecoMat = pricing.ecoMaterials || {};

    // Инструменты
    const toolsItems = [
        { id: 'brushes',  name: 'brushes',  price: ecoMat.brushes || 3.5, checked: selectedEcoTools.brushes },
        { id: 'rollers',  name: 'rollers',  price: ecoMat.rollers || 4.0, checked: selectedEcoTools.rollers },
        { id: 'tape',     name: 'tape',     price: ecoMat.tape   || 2.5, checked: selectedEcoTools.tape },
        { id: 'covers',   name: 'covers',   price: ecoMat.covers || 6.0, checked: selectedEcoTools.covers }
    ];

    // Аренда оборудования — цены из данных магазина (fallback — базовые)
    const ecoEq = pricing.ecoEquipment || {};
    const equipmentItems = [
        { id: 'sprayGun',  name: 'sprayGun',  price: ecoEq.sprayGun  || 15.0, checked: selectedEcoTools.sprayGun },
        { id: 'ledLights', name: 'ledLights', price: ecoEq.ledLights || 10.0, checked: selectedEcoTools.ledLights },
        { id: 'sander',    name: 'sander',    price: ecoEq.sander    || 12.0, checked: selectedEcoTools.sander },
        { id: 'laser',     name: 'laser',     price: ecoEq.laser     || 8.0,  checked: selectedEcoTools.laser }
    ];

    // Дополнительные материалы
    const ecoEx = pricing.ecoExtras || {};
    const extrasItems = [
        { id: 'extraTape',  name: 'extraTape',  price: ecoEx.extraTape  || 5.0, checked: selectedEcoTools.extraTape },
        { id: 'extraTools', name: 'extraTools', price: ecoEx.extraTools || 6.0, checked: selectedEcoTools.extraTools },
        { id: 'safety',     name: 'safety',     price: ecoEx.safety     || 4.0, checked: selectedEcoTools.safety }
    ];

    // Расчёт сумм
    const toolsTotal = toolsItems.reduce((sum, item) => sum + (item.checked ? item.price : 0), 0);
    const equipmentTotal = equipmentItems.reduce((sum, item) => sum + (item.checked ? item.price : 0), 0);
    const extrasTotal = extrasItems.reduce((sum, item) => sum + (item.checked ? item.price : 0), 0);

    // Формируем структуру для чека
    const items = [
        {
            category: "tools",
            lines: toolsItems,
            subtotal: toolsTotal
        },
        {
            category: "equipment",
            lines: equipmentItems,
            subtotal: equipmentTotal
        },
        {
            category: "extras",
            lines: extrasItems,
            subtotal: extrasTotal
        }
    ];

    // Материалы = грунтовка + краска
    const materialTotal = techCard.totalCost;
    const grandTotal = materialTotal + toolsTotal + equipmentTotal + extrasTotal;

    return {
        area,
        items,
        workTotal: 0,
        materialTotal,
        toolsTotal,
        equipmentTotal,
        extrasTotal,
        grandTotal,
        paintData: techCard.paint,
        primerData: techCard.primer
    };
}

/**
 * Расчёт обоев для ECO класса
 * @param {number} area - площадь в м²
 * @param {object} pricing - объект с ценами из pricing.json
 * @returns {object} - детализированный расчёт
 */
function calculateEcoWallpaper(area, pricing) {
    if (!pricing || !pricing.wallpaper) {
        return {
            area,
            items: [],
            workTotal: 0,
            materialTotal: 0,
            toolsTotal: 0,
            equipmentTotal: 0,
            extrasTotal: 0,
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
            toolsTotal: 0,
            equipmentTotal: 0,
            extrasTotal: 0,
            grandTotal: 0,
            wallpaperData: null
        };
    }

    // Инструменты для обоев — цены из данных магазина (fallback — базовые)
    const ecoWp = pricing.ecoWallpaperTools || {};
    const toolsItems = [
        { id: 'wpKnife',   name: 'wpKnife',   price: ecoWp.wpKnife   || 3.0, checked: true },
        { id: 'wpSpatula', name: 'wpSpatula', price: ecoWp.wpSpatula || 4.0, checked: true },
        { id: 'wpRoller',  name: 'wpRoller',  price: ecoWp.wpRoller  || 5.0, checked: true },
        { id: 'wpBucket',  name: 'wpBucket',  price: ecoWp.wpBucket  || 2.0, checked: true }
    ];

    // Дополнительные материалы для обоев
    const ecoWpEx = pricing.ecoWallpaperExtras || {};
    const extrasItems = [
        { id: 'wpExtraGlue',  name: 'wpExtraGlue',  price: ecoWpEx.wpExtraGlue  || 5.0, checked: false },
        { id: 'wpExtraTools', name: 'wpExtraTools', price: ecoWpEx.wpExtraTools || 6.0, checked: false },
        { id: 'wpSafety',     name: 'wpSafety',     price: ecoWpEx.wpSafety     || 3.0, checked: false }
    ];

    const toolsTotal = toolsItems.reduce((sum, item) => sum + (item.checked ? item.price : 0), 0);
    const extrasTotal = extrasItems.reduce((sum, item) => sum + (item.checked ? item.price : 0), 0);

    const items = [
        {
            category: "tools",
            lines: toolsItems,
            subtotal: toolsTotal
        },
        {
            category: "extras",
            lines: extrasItems,
            subtotal: extrasTotal
        }
    ];

    const materialTotal = wpData.totalCost;
    const grandTotal = materialTotal + toolsTotal + extrasTotal;

    return {
        area,
        items,
        workTotal: 0,
        materialTotal,
        toolsTotal,
        equipmentTotal: 0,
        extrasTotal,
        grandTotal,
        wallpaperData: wpData
    };
}

/**
 * Обновление выбранных инструментов
 * @param {string} toolId - ID инструмента
 * @param {boolean} checked - состояние checkbox
 */
function updateEcoToolSelection(toolId, checked) {
    if (selectedEcoTools.hasOwnProperty(toolId)) {
        selectedEcoTools[toolId] = checked;
    }
}

/**
 * Главная функция расчёта для ECO класса
 * @param {string} jobType - тип работы (painting | wallpaper)
 * @param {number} area - площадь в м²
 * @param {object} pricing - объект с ценами из pricing.json
 * @returns {object} - полный расчёт
 */
function calculateEco(jobType, area, pricing) {
    switch(jobType) {
        case "painting":
            return calculateEcoPainting(area, pricing);
        case "wallpaper":
            return calculateEcoWallpaper(area, pricing);
        default:
            return {
                area,
                items: [],
                workTotal: 0,
                materialTotal: 0,
                toolsTotal: 0,
                equipmentTotal: 0,
                extrasTotal: 0,
                grandTotal: 0
            };
    }
}

// Экспортируем функции
window.calculateEco = calculateEco;
window.updateEcoToolSelection = updateEcoToolSelection;
window.selectedEcoTools = selectedEcoTools;
