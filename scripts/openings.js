/* =========================================================
   OPENINGS (WINDOWS & DOORS) MODULE
   Upravlenie proyomami — okna i dveri na stenah
   ========================================================= */

// Otkrytiya po stenam: { front: [...], back: [...], left: [...], right: [...] }
let openings = { front: [], back: [], left: [], right: [] };
let openingIdCounter = 0;

/* =========================================================
   INIT — zagruzit iz localStorage, navesit sobytiya
   ========================================================= */

function initOpenings() {
    loadOpeningsFromStorage();
    renderOpeningButtons();
    setTimeout(() => {
        if (typeof updateOpenings3D === 'function') updateOpenings3D();
    }, 100);
}

function renderOpeningButtons() {
    document.querySelectorAll('.plane-toggle').forEach(box => {
        const side = box.dataset.side;
        if (!side || side === 'floor' || side === 'ceiling') return;

        const label = box.closest('label');
        if (!label) return;
        if (label.querySelector('.add-opening-btn')) return;

        const btn = document.createElement('span');
        btn.className = 'add-opening-btn';
        btn.textContent = '\u2795';
        btn.dataset.side = side;
        btn.title = window.translations?.[window.currentLang]?.addOpening || '\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043F\u0440\u043E\u0451\u043C';
        btn.style.cssText = 'margin-left:auto;cursor:pointer;font-size:14px;opacity:0.6;transition:opacity .2s;user-select:none;';
        btn.addEventListener('mouseenter', () => btn.style.opacity = '1');
        btn.addEventListener('mouseleave', () => btn.style.opacity = '0.6');
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showOpeningsDialog(side);
        });
        label.appendChild(btn);
    });
}

/* =========================================================
   UNIQUE ID
   ========================================================= */

function nextOpeningId() {
    return ++openingIdCounter;
}

/* =========================================================
   MODAL DIALOG
   ========================================================= */

function showOpeningsDialog(side) {
    const existing = document.getElementById('openings-modal-overlay');
    if (existing) existing.remove();

    const sideLabel = window.translations?.[window.currentLang]?.[side + 'Wall']
        || (side === 'front' ? '\u041F\u0435\u0440\u0435\u0434\u043D\u044F\u044F' :
            side === 'back' ? '\u0417\u0430\u0434\u043D\u044F\u044F' :
            side === 'left' ? '\u041B\u0435\u0432\u0430\u044F' :
            side === 'right' ? '\u041F\u0440\u0430\u0432\u0430\u044F' : side);

    const L = window.translations?.[window.currentLang] || {};
    const txt = {
        title: L.addOpeningTitle || '\u041F\u0440\u043E\u0451\u043C\u044B \u043D\u0430 \u0441\u0442\u0435\u043D\u0435:',
        addWindow: L.addWindow || '\u041E\u043A\u043D\u043E',
        addDoor: L.addDoor || '\u0414\u0432\u0435\u0440\u044C',
        width: L.openingWidth || '\u0428\u0438\u0440\u0438\u043D\u0430',
        height: L.openingHeight || '\u0412\u044B\u0441\u043E\u0442\u0430',
        fromLeft: L.fromLeftEdge || '\u041E\u0442 \u043B\u0435\u0432\u043E\u0433\u043E \u043A\u0440\u0430\u044F',
        fromFloor: L.fromFloor || '\u041E\u0442 \u043F\u043E\u043B\u0430',
        save: L.save || '\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C',
        delete: L.delete || '\u0423\u0434\u0430\u043B\u0438\u0442\u044C',
        noOpenings: L.noOpenings || '\u041D\u0435\u0442 \u043F\u0440\u043E\u0451\u043C\u043E\u0432',
        cm: '\u0441\u043C',
        window_: L.windowType || '\u041E\u043A\u043D\u043E',
        door: L.doorType || '\u0414\u0432\u0435\u0440\u044C',
        newWindow: L.newWindow || '\u041D\u043E\u0432\u043E\u0435 \u043E\u043A\u043D\u043E',
        newDoor: L.newDoor || '\u041D\u043E\u0432\u0430\u044F \u0434\u0432\u0435\u0440\u044C'
    };

    const wallWidth = (side === 'front' || side === 'back') ? 'X' : 'Y';

    const overlay = document.createElement('div');
    overlay.id = 'openings-modal-overlay';
    overlay.className = 'openings-modal-overlay';
    overlay.innerHTML = `
        <div class="openings-modal receipt-dialog">
            <div class="openings-modal-header">
                <span>${txt.title} <strong>${sideLabel}</strong></span>
                <span class="openings-modal-close">&times;</span>
            </div>
            <div class="openings-modal-body">
                <div class="openings-list" id="openings-list-${side}">
                    ${renderOpeningsListHTML(side, txt)}
                </div>
                <div class="openings-add-row">
                    <button class="btn-add-opening" data-type="window">${txt.addWindow}</button>
                    <button class="btn-add-opening" data-type="door">${txt.addDoor}</button>
                </div>
                <div class="openings-form" id="openings-form" style="display:none;">
                    <div class="opening-form-row">
                        <label>${txt.width} (${txt.cm}):
                            <input type="number" id="op-w" value="100" min="10" max="500" step="5">
                        </label>
                        <label>${txt.height} (${txt.cm}):
                            <input type="number" id="op-h" value="120" min="10" max="500" step="5">
                        </label>
                    </div>
                    <div class="opening-form-row">
                        <label>${txt.fromLeft} (${txt.cm}):
                            <input type="number" id="op-fromLeft" value="50" min="0" max="1000" step="5">
                        </label>
                        <label>${txt.fromFloor} (${txt.cm}):
                            <input type="number" id="op-fromFloor" value="90" min="0" max="500" step="5">
                        </label>
                    </div>
                    <div class="opening-form-actions">
                        <button class="btn-form-cancel" id="op-cancel">${window.translations?.[window.currentLang]?.cancel || '\u041E\u0442\u043C\u0435\u043D\u0430'}</button>
                        <button class="btn-form-save" id="op-save">${txt.save}</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    // zakrit
    overlay.querySelector('.openings-modal-close').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

    // edit/delete buttons (existing openings)
    bindOpeningActions(overlay, side, txt);

    // add buttons
    overlay.querySelectorAll('.btn-add-opening').forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.type;
            showOpeningForm(side, type, overlay, txt);
        });
    });
}

function bindOpeningActions(overlay, side, txt) {
    overlay.querySelectorAll('.btn-delete-opening').forEach(delBtn => {
        delBtn.addEventListener('click', () => {
            const id = parseInt(delBtn.dataset.id);
            deleteOpeningById(side, id);
            overlay.remove();
            showOpeningsDialog(side);
        });
    });
    overlay.querySelectorAll('.btn-edit-opening').forEach(editBtn => {
        editBtn.addEventListener('click', () => {
            const id = parseInt(editBtn.dataset.id);
            const existing = (openings[side] || []).find(op => op.id === id);
            if (!existing) return;
            showOpeningForm(side, existing.type, overlay, txt, id);
        });
    });
}

function showOpeningForm(side, type, overlay, txt, editId) {
    const form = overlay.querySelector('#openings-form');
    form.style.display = 'block';
    form.dataset.side = side;
    form.dataset.type = type;
    form.dataset.editId = editId || '';

    const fromFloorInp = form.querySelector('#op-fromFloor');
    const wInp = form.querySelector('#op-w');
    const hInp = form.querySelector('#op-h');
    const fromLeftInp = form.querySelector('#op-fromLeft');

    const header = overlay.querySelector('.openings-modal-header strong');
    const sideName = header.textContent;

    if (editId) {
        const existing = (openings[side] || []).find(op => op.id === editId);
        if (existing) {
            wInp.value = existing.w;
            hInp.value = existing.h;
            fromLeftInp.value = existing.fromLeft;
            fromFloorInp.value = existing.fromFloor;
            form.dataset.type = existing.type;
            fromFloorInp.disabled = existing.type === 'door';
        }
        const editLabel = existing?.type === 'window'
            ? '\u270E ' + txt.window_
            : '\u270E ' + txt.door;
        header.textContent = sideName + ' — ' + editLabel;
    } else {
        if (type === 'door') {
            fromFloorInp.value = 0;
            fromFloorInp.disabled = true;
            wInp.value = 90;
            hInp.value = 200;
        } else {
            fromFloorInp.disabled = false;
            wInp.value = 100;
            hInp.value = 120;
        }
        const typeLabel = type === 'window' ? txt.newWindow : txt.newDoor;
        header.textContent = sideName + ' — ' + typeLabel;
    }

    const saveBtn = form.querySelector('#op-save');
    const cancelBtn = form.querySelector('#op-cancel');

    const onSave = () => {
        const w = parseFloat(form.querySelector('#op-w').value) || 100;
        const h = parseFloat(form.querySelector('#op-h').value) || 120;
        const fl = parseFloat(form.querySelector('#op-fromLeft').value) || 50;
        const ff = parseFloat(form.querySelector('#op-fromFloor').value) || 0;
        const actualType = form.dataset.type;

        const maxW = (side === 'front' || side === 'back') ? (parseFloat(document.getElementById('xInp')?.value) || 400) : (parseFloat(document.getElementById('yInp')?.value) || 300);
        const maxH = parseFloat(document.getElementById('zInp')?.value) || 250;

        if (w <= 0 || h <= 0) { alert(txt.width + ' ' + txt.height + ' > 0'); return; }
        if (fl < 0 || ff < 0) { alert('...'); return; }
        if (fl + w > maxW) { alert(txt.fromLeft + ' + ' + txt.width + ' > ' + maxW); return; }
        if (ff + h > maxH) { alert(txt.fromFloor + ' + ' + txt.height + ' > ' + maxH); return; }

        const editIdVal = form.dataset.editId;
        if (editIdVal) {
            updateOpeningById(side, parseInt(editIdVal), { type: actualType, w, h, fromLeft: fl, fromFloor: ff });
        } else {
            addOpening(side, { type: actualType, w, h, fromLeft: fl, fromFloor: ff });
        }

        form.style.display = 'none';
        overlay.remove();
    };

    saveBtn.onclick = onSave;

    cancelBtn.onclick = () => {
        form.style.display = 'none';
    };
}

function renderOpeningsListHTML(side, txt) {
    const list = openings[side] || [];
    if (!list.length) {
        return `<div class="openings-empty">${txt.noOpenings}</div>`;
    }

    const wallWidth = (side === 'front' || side === 'back') ? 'X' : 'Y';

    return list.map(op => {
        const typeLabel = op.type === 'window' ? txt.window_ : txt.door;
        return `
            <div class="opening-row" data-id="${op.id}">
                <div class="opening-row-info">
                    <span class="opening-type-badge ${op.type}">${typeLabel}</span>
                    <span>${op.w}\u00D7${op.h} \u0441\u043C</span>
                    <span class="opening-row-detail">${txt.fromLeft}: ${op.fromLeft}, ${txt.fromFloor}: ${op.fromFloor}</span>
                </div>
                <div class="opening-row-actions">
                    <button class="btn-edit-opening" data-id="${op.id}" title="✎">&#9998;</button>
                    <button class="btn-delete-opening" data-id="${op.id}">${txt.delete}</button>
                </div>
            </div>
        `;
    }).join('');
}

/* =========================================================
   CRUD
   ========================================================= */

function addOpening(side, data) {
    if (!openings[side]) openings[side] = [];
    const id = nextOpeningId();
    openings[side].push({ id, ...data });
    saveOpeningsToStorage();
    updateOpenings3D();
    if (typeof loadReceipt === 'function') loadReceipt(window.currentJob || 'painting');
}

function deleteOpeningById(side, id) {
    if (!openings[side]) return;
    openings[side] = openings[side].filter(op => op.id !== id);
    saveOpeningsToStorage();
    updateOpenings3D();
    if (typeof loadReceipt === 'function') loadReceipt(window.currentJob || 'painting');
}

function updateOpeningById(side, id, data) {
    if (!openings[side]) return;
    const idx = openings[side].findIndex(op => op.id === id);
    if (idx === -1) return;
    openings[side][idx] = { ...openings[side][idx], ...data };
    saveOpeningsToStorage();
    updateOpenings3D();
    if (typeof loadReceipt === 'function') loadReceipt(window.currentJob || 'painting');
}

function resetOpenings() {
    Object.keys(openings).forEach(k => { openings[k] = []; });
    openingIdCounter = 0;
    saveOpeningsToStorage();
    updateOpenings3D();
}

/* =========================================================
   AREA CALCULATION
   ========================================================= */

function getAllOpeningsArea() {
    let total = 0;
    Object.values(openings).forEach(list => {
        list.forEach(op => {
            total += (op.w * op.h) / 10000; // cm² → m²
        });
    });
    return total;
}

function getOpeningsAreaForSide(side) {
    const list = openings[side] || [];
    let total = 0;
    list.forEach(op => {
        total += (op.w * op.h) / 10000;
    });
    return total;
}

/* =========================================================
   LOCAL STORAGE
   ========================================================= */

function saveOpeningsToStorage() {
    try {
        localStorage.setItem('bau_openings', JSON.stringify({ data: openings, counter: openingIdCounter }));
    } catch (e) {
        console.error('Failed to save openings:', e);
    }
}

function loadOpeningsFromStorage() {
    try {
        const raw = localStorage.getItem('bau_openings');
        if (raw) {
            const parsed = JSON.parse(raw);
            const data = parsed.data || { front: [], back: [], left: [], right: [] };
            // Mutējam lai window.openings atsauce paliek derīga
            Object.keys(openings).forEach(k => { openings[k] = data[k] || []; });
            openingIdCounter = parsed.counter || 0;
        }
    } catch (e) {
        console.error('Failed to load openings:', e);
        Object.keys(openings).forEach(k => { openings[k] = []; });
    }
}

/* =========================================================
   EXPORT
   ========================================================= */

window.openings = openings;
window.initOpenings = initOpenings;
window.resetOpenings = resetOpenings;
window.updateOpeningById = updateOpeningById;
window.getAllOpeningsArea = getAllOpeningsArea;
window.getOpeningsAreaForSide = getOpeningsAreaForSide;
