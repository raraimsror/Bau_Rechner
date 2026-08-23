/* =========================================================
   ТЕХНОЛОГИЧЕСКАЯ КАРТА ПОКРАСКИ
   ========================================================= */

/**
 * Технологическая карта для покраски стен
 * Включает все необходимые этапы и материалы
 */

/**
 * Расчёт грунтовки для стен
 * @param {number} area - площадь в м²
 * @param {object} [pricing] - объект с ценами из pricing.json
 * @returns {object} - { liters, cost, product }
 */
function calculatePrimer(area, pricing) {
    // Грунтовка: расход ~100-150 мл/м² (берём 120 мл = 0.12 л/м²)
    // 1 слой грунтовки обязателен
    const primerData = (pricing && pricing.primer) || {};

    const consumptionPerM2 = primerData.consumptionPerM2 || 0.12; // литров на м²
    const litersNeeded = area * consumptionPerM2 * 1.1; // +10% запас

    // Канистры из данных магазина; fallback — базовые цены Alpina Tiefgrund
    const primerProducts = (primerData.products && primerData.products.length)
        ? primerData.products.map(p => ({ name: primerData.name || "Alpina Tiefgrund", ...p }))
        : [
            { size: 10, price: 15.00, name: "Alpina Tiefgrund" },
            { size: 5, price: 8.00, name: "Alpina Tiefgrund" }
        ];

    // Оптимизируем канистры общим жадным алгоритмом (paint.js)
    const optimized = window.optimizePaintBuckets
        ? window.optimizePaintBuckets(litersNeeded, primerProducts)
        : { buckets: [], totalLiters: 0, totalCost: 0 };

    return {
        litersNeeded: parseFloat(litersNeeded.toFixed(2)),
        cans: optimized.buckets,
        totalLiters: optimized.totalLiters,
        totalCost: optimized.totalCost
    };
}

/**
 * Полная технологическая карта покраски
 * @param {number} area - площадь в м²
 * @param {object} pricing - объект с ценами
 * @returns {object} - полный расчёт с грунтовкой и краской
 */
function calculatePaintingTechCard(area, pricing) {
    // 1. Грунтовка (обязательно) — цены из данных магазина
    const primer = calculatePrimer(area, pricing);

    // 2. Краска (используем существующую функцию)
    const paint = window.calculatePaintQuantity
        ? window.calculatePaintQuantity(area, pricing.alpina)
        : null;

    if (!paint) {
        return {
            area,
            primer,
            paint: null,
            totalCost: primer.totalCost
        };
    }

    return {
        area,
        primer,
        paint,
        totalCost: primer.totalCost + paint.totalCost
    };
}

// Экспортируем функции
window.calculatePrimer = calculatePrimer;
window.calculatePaintingTechCard = calculatePaintingTechCard;
