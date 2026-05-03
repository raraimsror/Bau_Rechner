/* =========================================================
   РАСЧЁТ ОБОЕВ
   Отдельный модуль для расчёта количества обоев и клея
   ========================================================= */

/* =========================================================
   КОНСТАНТЫ
   ========================================================= */

// Стандартный рулон обоев Erfurt Rauhfaser-Tapete Classico
const ROLL_WIDTH = 0.53;   // м (53 см)
const ROLL_LENGTH = 20;     // м
const ROLL_AREA = 10.6;     // м² (20м × 0.53м)

// Резервы
const RESERVE_PERCENT = 0.10;  // 10% резерв на обрезки

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

    // Формула: (площадь / площадь_рулона) × (1 + резерв)
    // Без рапорта, так как Erfurt Rauhfaser без рисунка
    const totalReserve = 1 + RESERVE_PERCENT;
    const rolls = (area / ROLL_AREA) * totalReserve;

    // Округляем вверх до целого рулона
    return Math.ceil(rolls);
}

/* =========================================================
   РАСЧЁТ КОЛИЧЕСТВА КЛЕЯ
   ========================================================= */

/**
 * Рассчитывает количество клея для обоев
 * @param {number} area - Площадь стен в м²
 * @param {object} pricing - Объект с ценами из pricing.json
 * @returns {object} - { packages, totalWeight }
 */
function calculateWallpaperGlue(area, pricing) {
    if (!area || area <= 0 || !pricing || !pricing.wallpaper) {
        return { packages: 0, totalWeight: 0 };
    }

    const wp = pricing.wallpaper;

    // Tapetenkleister Spezial 200g покрывает 20-25м² (берём среднее 22.5м²)
    const glueCoverage = wp.glueCoverage || 22.5; // м² на 200g
    const glueWeight = wp.glueWeight || 0.2; // кг (200g)

    // Сколько упаковок нужно
    const packagesNeeded = Math.ceil(area / glueCoverage);
    const totalWeight = packagesNeeded * glueWeight;

    return {
        packages: packagesNeeded,
        totalWeight: parseFloat(totalWeight.toFixed(2))
    };
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
            gluePackages: 0,
            glueWeight: 0,
            rollCost: 0,
            glueCost: 0,
            totalCost: 0
        };
    }

    const wp = pricing.wallpaper;
    const rolls = calculateWallpaperRolls(area);
    const glueData = calculateWallpaperGlue(area, pricing);

    const rollCost = rolls * wp.rollPrice;
    const glueCost = glueData.packages * wp.gluePrice;
    const totalCost = rollCost + glueCost;

    return {
        rolls,
        gluePackages: glueData.packages,
        glueWeight: glueData.totalWeight,
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
