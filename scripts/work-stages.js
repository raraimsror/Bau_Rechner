/* =========================================================
   ОБЩАЯ ТАБЛИЦА ЭТАПОВ РАБОТ
   Доли от общей стоимости работ (сумма = 1.0).
   Единый источник для NORM.js и PRO.js — проценты и ID
   позиций чека больше не дублируются в двух модулях.
   ========================================================= */

const WORK_STAGE_PERCENTS = {
    painting: [
        { stage: 'inspection',  percent: 0.10 },
        { stage: 'prep',        percent: 0.15 },
        { stage: 'primer',      percent: 0.10 },
        { stage: 'protection',  percent: 0.05 },
        { stage: 'coat1',       percent: 0.20 },
        { stage: 'coat2',       percent: 0.20 },
        { stage: 'hardSpots',   percent: 0.05 },
        { stage: 'quality',     percent: 0.05 },
        { stage: 'cleanup',     percent: 0.05 },
        { stage: 'trash',       percent: 0.05 }
    ],
    wallpaper: [
        { stage: 'inspection',  percent: 0.10 },
        { stage: 'prep',        percent: 0.15 },
        { stage: 'primer',      percent: 0.10 },
        { stage: 'protection',  percent: 0.05 },
        { stage: 'cutting',     percent: 0.10 },
        { stage: 'hanging',     percent: 0.25 },
        { stage: 'trimming',    percent: 0.10 },
        { stage: 'quality',     percent: 0.05 },
        { stage: 'cleanup',     percent: 0.05 },
        { stage: 'trash',       percent: 0.05 }
    ]
};

// Собирает ID позиции чека из префикса класса и этапа:
// makeStageId('paint', 'hardSpots') → 'paintHardSpots'
function makeStageId(prefix, stage) {
    return prefix + stage.charAt(0).toUpperCase() + stage.slice(1);
}

window.WORK_STAGE_PERCENTS = WORK_STAGE_PERCENTS;
window.makeStageId = makeStageId;
