/* =========================================================
   РАСЧЁТ КРАСКИ
   Отдельный модуль для расчёта количества краски и оптимизации вёдер
   ========================================================= */

/* =========================================================
   ОПТИМИЗАЦИЯ ВЁДЕР КРАСКИ
   ========================================================= */

/**
 * Оптимизирует комбинацию вёдер для минимизации стоимости
 * @param {number} litersNeeded - Необходимое количество литров
 * @param {array} buckets - Массив доступных вёдер из pricing.json
 * @returns {object} - { buckets: [], totalLiters, totalCost }
 */
function optimizePaintBuckets(litersNeeded, buckets) {
    if (!litersNeeded || litersNeeded <= 0 || !buckets || buckets.length === 0) {
        return {
            buckets: [],
            totalLiters: 0,
            totalCost: 0
        };
    }

    // Сортируем вёдра по размеру (от большего к меньшему)
    const sortedBuckets = [...buckets].sort((a, b) => b.size - a.size);

    let remaining = litersNeeded;
    let selectedBuckets = [];

    // Жадный алгоритм: берём максимально большие вёдра
    for (let bucket of sortedBuckets) {
        while (remaining > 0) {
            // Если осталось меньше размера ведра, проверяем следующее меньшее
            if (remaining < bucket.size * 0.5 && bucket !== sortedBuckets[sortedBuckets.length - 1]) {
                break;
            }

            selectedBuckets.push({
                name: bucket.name,
                size: bucket.size,
                price: bucket.price,
                coverage: bucket.coverage
            });

            remaining -= bucket.size;

            // Если покрыли потребность, выходим
            if (remaining <= 0) break;
        }

        if (remaining <= 0) break;
    }

    // Если всё ещё не хватает (остался маленький остаток), добавляем самое маленькое ведро
    if (remaining > 0) {
        const smallestBucket = sortedBuckets[sortedBuckets.length - 1];
        selectedBuckets.push({
            name: smallestBucket.name,
            size: smallestBucket.size,
            price: smallestBucket.price,
            coverage: smallestBucket.coverage
        });
    }

    // Подсчитываем итоги
    const totalLiters = selectedBuckets.reduce((sum, b) => sum + b.size, 0);
    const totalCost = selectedBuckets.reduce((sum, b) => sum + b.price, 0);

    return {
        buckets: selectedBuckets,
        totalLiters: parseFloat(totalLiters.toFixed(2)),
        totalCost: parseFloat(totalCost.toFixed(2))
    };
}

/* =========================================================
   РАСЧЁТ НЕОБХОДИМОГО КОЛИЧЕСТВА КРАСКИ
   ========================================================= */

/**
 * Рассчитывает необходимое количество краски
 * @param {number} area - Площадь стен в м²
 * @param {array} buckets - Массив доступных вёдер из pricing.json
 * @returns {object} - { litersNeeded, buckets, totalLiters, totalCost }
 */
function calculatePaintQuantity(area, buckets) {
    if (!area || area <= 0 || !buckets || buckets.length === 0) {
        return {
            litersNeeded: 0,
            buckets: [],
            totalLiters: 0,
            totalCost: 0
        };
    }

    // Берём coverage из первого ведра (предполагаем одинаковое покрытие)
    const coverage = buckets[0].coverage || 6; // м²/L на слой
    const coats = buckets[0].coats || 2;
    const reserve = 1.1; // 10% резерв

    // Формула: (площадь / покрытие) * слои * резерв
    const litersNeeded = (area / coverage) * coats * reserve;

    // Оптимизируем комбинацию вёдер
    const optimized = optimizePaintBuckets(litersNeeded, buckets);

    return {
        litersNeeded: parseFloat(litersNeeded.toFixed(2)),
        buckets: optimized.buckets,
        totalLiters: optimized.totalLiters,
        totalCost: optimized.totalCost
    };
}

/* =========================================================
   ЭКСПОРТ ФУНКЦИЙ
   ========================================================= */

window.optimizePaintBuckets = optimizePaintBuckets;
window.calculatePaintQuantity = calculatePaintQuantity;
