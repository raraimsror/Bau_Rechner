/* =========================================================
   РАСЧЁТ ОБОЕВ
   Отдельный модуль для расчёта количества обоев и клея
   ========================================================= */

/* =========================================================
   КОНСТАНТЫ
   ========================================================= */

// Стандартный рулон обоев
const ROLL_WIDTH = 0.53;   // м (53 см)
const ROLL_LENGTH = 10;     // м
const ROLL_AREA = ROLL_WIDTH * ROLL_LENGTH; // 5.3 м²

// Резервы
const RESERVE_PERCENT = 0.10;  // 10% резерв на обрезки
const RAPPORT_PERCENT = 0.05;  // 5% на подгонку рапорта

/* =========================================================
   РАСЧЁТ КОЛИЧЕСТВА РУЛОНОВ
   ========================================================= */

/**
 * Рассчитывает количество рулонов обоев
 * @param {number} area - Площадь стен в м²
 * @returns {number} - Количество рулонов (округлено вверх)
 */
function calculateWallpaperRolls(area) {
    if (!area || area <= 0) return 0;

    // Формула: (площадь / площадь_рулона) × (1 + резерв + рапорт)
    const totalReserve = 1 + RESERVE_PERCENT + RAPPORT_PERCENT;
    const rolls = (area / ROLL_AREA) * totalReserve;

    // Округляем вверх до целого рулона
    return Math.ceil(rolls);
}

/* =========================================================
   РАСЧЁТ КОЛИЧЕСТВА КЛЕЯ
   ========================================================= */

/**
 * Рассчитывает количество клея для обоев
 * @param {number} rolls - Количество рулонов
 * @returns {number} - Количество клея в кг
 */
function calculateWallpaperGlue(rolls) {
    if (!rolls || rolls <= 0) return 0;

    // Примерно 200г клея на 1 рулон
    const gluePerRoll = 0.2; // кг
    return rolls * gluePerRoll;
}

/* =========================================================
   РАСЧЁТ СТОИМОСТИ ОБОЕВ
   ========================================================= */

/**
 * Рассчитывает общую стоимость обоев и клея
 * @param {number} area - Площадь стен в м²
 * @param {object} pricing - Объект с ценами из pricing.json
 * @returns {object} - { rolls, glue, rollCost, glueCost, totalCost }
 */
function calculateWallpaperCost(area, pricing) {
    if (!pricing || !pricing.wallpaper) {
        return {
            rolls: 0,
            glue: 0,
            rollCost: 0,
            glueCost: 0,
            totalCost: 0
        };
    }

    const wp = pricing.wallpaper;
    const rolls = calculateWallpaperRolls(area);
    const glue = calculateWallpaperGlue(rolls);

    const rollCost = rolls * wp.rollPrice;
    const glueCost = glue * wp.gluePrice;
    const totalCost = rollCost + glueCost;

    return {
        rolls,
        glue: parseFloat(glue.toFixed(2)),
        rollCost: parseFloat(rollCost.toFixed(2)),
        glueCost: parseFloat(glueCost.toFixed(2)),
        totalCost: parseFloat(totalCost.toFixed(2))
    };
}

/* =========================================================
   ЭКСПОРТ ФУНКЦИЙ
   ========================================================= */

window.calculateWallpaperRolls = calculateWallpaperRolls;
window.calculateWallpaperGlue = calculateWallpaperGlue;
window.calculateWallpaperCost = calculateWallpaperCost;
