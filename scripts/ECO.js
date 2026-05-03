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
            toolsTotal: 0,
            equipmentTotal: 0,
            extrasTotal: 0,
            grandTotal: 0,
            paintData: null
        };
    }

    // Цены инструментов
    const ecoMat = pricing.ecoMaterials || {};

    // Инструменты
    const toolsItems = [
        { id: 'brushes', name: "Кисти малярные", price: ecoMat.brushes || 3.5, checked: selectedEcoTools.brushes },
        { id: 'rollers', name: "Валики малярные", price: ecoMat.rollers || 4.0, checked: selectedEcoTools.rollers },
        { id: 'tape', name: "Малярная лента", price: ecoMat.tape || 2.5, checked: selectedEcoTools.tape },
        { id: 'covers', name: "Защитная плёнка", price: ecoMat.covers || 6.0, checked: selectedEcoTools.covers }
    ];

    // Аренда оборудования
    const equipmentItems = [
        { id: 'sprayGun', name: "Краскопульт с компрессором", price: 15.0, checked: selectedEcoTools.sprayGun },
        { id: 'ledLights', name: "LED-прожекторы", price: 10.0, checked: selectedEcoTools.ledLights },
        { id: 'sander', name: "Шлифмашина с пылесосом", price: 12.0, checked: selectedEcoTools.sander },
        { id: 'laser', name: "Лазерный нивелир", price: 8.0, checked: selectedEcoTools.laser }
    ];

    // Дополнительные материалы
    const extrasItems = [
        { id: 'extraTape', name: "Дополнительная лента и плёнка", price: 5.0, checked: selectedEcoTools.extraTape },
        { id: 'extraTools', name: "Дополнительные валики и кисти", price: 6.0, checked: selectedEcoTools.extraTools },
        { id: 'safety', name: "Средства защиты и расходники", price: 4.0, checked: selectedEcoTools.safety }
    ];

    // Расчёт сумм
    const toolsTotal = toolsItems.reduce((sum, item) => sum + (item.checked ? item.price : 0), 0);
    const equipmentTotal = equipmentItems.reduce((sum, item) => sum + (item.checked ? item.price : 0), 0);
    const extrasTotal = extrasItems.reduce((sum, item) => sum + (item.checked ? item.price : 0), 0);

    // Формируем структуру для чека
    const items = [
        {
            category: "Инструменты",
            lines: toolsItems,
            subtotal: toolsTotal
        },
        {
            category: "Аренда оборудования",
            lines: equipmentItems,
            subtotal: equipmentTotal
        },
        {
            category: "Дополнительные материалы",
            lines: extrasItems,
            subtotal: extrasTotal
        }
    ];

    const materialTotal = paintData.totalCost;
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
        paintData
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

    // Инструменты для обоев
    const toolsItems = [
        { id: 'wpKnife', name: "Обойный нож", price: 3.0, checked: true },
        { id: 'wpSpatula', name: "Шпатель для обоев", price: 4.0, checked: true },
        { id: 'wpRoller', name: "Валик для обоев", price: 5.0, checked: true },
        { id: 'wpBucket', name: "Ведро для клея", price: 2.0, checked: true }
    ];

    // Дополнительные материалы для обоев
    const extrasItems = [
        { id: 'wpExtraGlue', name: "Дополнительный клей", price: 5.0, checked: false },
        { id: 'wpExtraTools', name: "Дополнительные инструменты", price: 6.0, checked: false },
        { id: 'wpSafety', name: "Средства защиты", price: 3.0, checked: false }
    ];

    const toolsTotal = toolsItems.reduce((sum, item) => sum + (item.checked ? item.price : 0), 0);
    const extrasTotal = extrasItems.reduce((sum, item) => sum + (item.checked ? item.price : 0), 0);

    const items = [
        {
            category: "Инструменты",
            lines: toolsItems,
            subtotal: toolsTotal
        },
        {
            category: "Дополнительные материалы",
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
 * @param {string} jobType - тип работы (painting | wallpaper | flooring)
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
window.calculateEcoPainting = calculateEcoPainting;
window.calculateEcoWallpaper = calculateEcoWallpaper;
window.updateEcoToolSelection = updateEcoToolSelection;
window.selectedEcoTools = selectedEcoTools;
