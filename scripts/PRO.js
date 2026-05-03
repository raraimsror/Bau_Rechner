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
        { name: "Осмотр и консультация мастера", cost: workTotal * 0.10 },
        { name: "Подготовка поверхности (очистка, шпаклёвка)", cost: workTotal * 0.15 },
        { name: "Грунтовка стен премиум составом", cost: workTotal * 0.10 },
        { name: "Защита мебели и пола", cost: workTotal * 0.05 },
        { name: "Покраска первым слоем", cost: workTotal * 0.20 },
        { name: "Покраска вторым слоем", cost: workTotal * 0.20 },
        { name: "Покраска труднодоступных мест", cost: workTotal * 0.05 },
        { name: "Финишная проверка качества", cost: workTotal * 0.05 },
        { name: "Уборка помещения", cost: workTotal * 0.05 },
        { name: "Вывоз мусора", cost: workTotal * 0.05 }
    ];

    items.push({
        category: "Работы (Премиум)",
        lines: allWorkBlocks
    });

    // Блок материалов
    items.push({
        category: "Материалы (OBI Premium)",
        lines: [
            { name: "Краска Alpina Premium", cost: materialTotal },
            { name: "Грунтовка премиум", cost: area * 0.5 },
            { name: "Шпаклёвка финишная", cost: area * 0.3 },
            { name: "Малярная лента профессиональная", cost: 8.0 },
            { name: "Защитная плёнка усиленная", cost: 12.0 }
        ]
    });

    // Блок оборудования
    items.push({
        category: "Аренда оборудования (Премиум)",
        lines: [
            { name: "Краскопульт с компрессором", cost: equipmentTotal * 0.40 },
            { name: "LED-прожекторы", cost: equipmentTotal * 0.20 },
            { name: "Шлифмашина с пылесосом", cost: equipmentTotal * 0.25 },
            { name: "Лазерный нивелир", cost: equipmentTotal * 0.15 }
        ]
    });

    // Дополнительные материалы включены в премиум
    const additionalMaterials = area * 0.8 + 20.0;
    items.push({
        category: "Дополнительные материалы",
        lines: [
            { name: "Дополнительная малярная лента и плёнка", cost: additionalMaterials * 0.3 },
            { name: "Дополнительные валики и кисти премиум", cost: additionalMaterials * 0.4 },
            { name: "Средства защиты и расходники", cost: additionalMaterials * 0.3 }
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
        { name: "Осмотр и консультация мастера", cost: workTotal * 0.10 },
        { name: "Подготовка поверхности (очистка, выравнивание)", cost: workTotal * 0.15 },
        { name: "Грунтовка стен премиум составом", cost: workTotal * 0.10 },
        { name: "Защита мебели и пола", cost: workTotal * 0.05 },
        { name: "Разметка и раскрой обоев", cost: workTotal * 0.10 },
        { name: "Поклейка обоев премиум качества", cost: workTotal * 0.25 },
        { name: "Подрезка и подгонка стыков", cost: workTotal * 0.10 },
        { name: "Финишная проверка качества", cost: workTotal * 0.05 },
        { name: "Уборка помещения", cost: workTotal * 0.05 },
        { name: "Вывоз мусора", cost: workTotal * 0.05 }
    ];

    items.push({
        category: "Работы (Премиум)",
        lines: allWorkBlocks
    });

    // Блок материалов
    items.push({
        category: "Материалы (TOOM Premium)",
        lines: [
            { name: pricing.wallpaper.name + " Premium", cost: wpData.rollCost },
            { name: pricing.wallpaper.glueName + " Premium", cost: wpData.glueCost },
            { name: "Грунтовка для обоев", cost: area * 0.4 },
            { name: "Шпаклёвка финишная", cost: area * 0.3 }
        ]
    });

    // Блок оборудования
    items.push({
        category: "Аренда оборудования (Премиум)",
        lines: [
            { name: "Стол для раскроя обоев", cost: equipmentTotal * 0.30 },
            { name: "LED-прожекторы", cost: equipmentTotal * 0.25 },
            { name: "Лазерный уровень", cost: equipmentTotal * 0.25 },
            { name: "Профессиональные инструменты", cost: equipmentTotal * 0.20 }
        ]
    });

    // Дополнительные материалы
    const additionalMaterials = area * 0.7 + 15.0;
    items.push({
        category: "Дополнительные материалы",
        lines: [
            { name: "Дополнительный клей и грунтовка", cost: additionalMaterials * 0.4 },
            { name: "Профессиональные инструменты", cost: additionalMaterials * 0.4 },
            { name: "Средства защиты и расходники", cost: additionalMaterials * 0.2 }
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
