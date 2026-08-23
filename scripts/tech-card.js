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

    // Оптимизируем канистры
    let remaining = litersNeeded;
    let selectedCans = [];

    for (let product of primerProducts) {
        while (remaining > 0) {
            if (remaining < product.size * 0.5 && product !== primerProducts[primerProducts.length - 1]) {
                break;
            }
            selectedCans.push({ ...product });
            remaining -= product.size;
            if (remaining <= 0) break;
        }
        if (remaining <= 0) break;
    }

    // Если остаток, добавляем самую маленькую (копия, не ссылка на данные)
    if (remaining > 0) {
        selectedCans.push({ ...primerProducts[primerProducts.length - 1] });
    }

    const totalLiters = selectedCans.reduce((sum, can) => sum + can.size, 0);
    const totalCost = selectedCans.reduce((sum, can) => sum + can.price, 0);

    return {
        litersNeeded: parseFloat(litersNeeded.toFixed(2)),
        cans: selectedCans,
        totalLiters,
        totalCost
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
