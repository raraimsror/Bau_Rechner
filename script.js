function update() {
    // 1. Dati no ievades
    const x = parseFloat(document.getElementById('dimX').value) || 0;
    const y = parseFloat(document.getElementById('dimY').value) || 0;
    const z = parseFloat(document.getElementById('dimZ').value) || 0;
    const mMultiplier = parseFloat(document.getElementById('materialClass').value);

    // 2. 3D Vizualizācijas mērogs (centrēts)
    const s = 0.4; // scale
    const sx = x * s, sy = y * s, sz = z * s;

    // Uzstādām telpas kastes izmēru, lai transformācijas būtu relatīvas pret centru
    const room = document.getElementById('room');
    room.style.width = sx + 'px';
    room.style.height = sz + 'px';

    // Sienu pozicionēšana (stūru savienošana)
    const walls = {
        '.front':  `translateZ(${sy/2}px)`,
        '.back':   `translateZ(${-sy/2}px) rotateY(180deg)`,
        '.left':   `rotateY(-90deg) translateZ(${sx/2}px)`,
        '.right':  `rotateY(90deg) translateZ(${sx/2}px)`,
        '.floor':  `rotateX(-90deg) translateZ(${sz/2}px)`
    };

    for (let selector in walls) {
        const el = document.querySelector(selector);
        el.style.transform = walls[selector];
        
        // Sienu izmēri
        if(selector === '.left' || selector === '.right') {
            el.style.width = sy + 'px'; el.style.height = sz + 'px';
        } else if(selector === '.floor') {
            el.style.width = sx + 'px'; el.style.height = sy + 'px';
        } else {
            el.style.width = sx + 'px'; el.style.height = sz + 'px';
        }
    }

    // 3. Cenas aprēķins
    let jobTotal = 0;
    let selectedJobs = [];
    const wallArea = (2 * x * z + 2 * y * z) / 10000;
    const floorArea = (x * y) / 10000;

    document.querySelectorAll('.job:checked').forEach(job => {
        let pricePerM2 = parseFloat(job.dataset.price);
        let jobName = job.parentElement.innerText;
        // Ja darbs ir grīdai, rēķinām grīdas laukumu, citādi sienu
        let cost = (jobName.includes("Плитка") ? floorArea : wallArea) * pricePerM2 * mMultiplier;
        jobTotal += cost;
        selectedJobs.push(jobName);
    });

    document.getElementById('total-price').innerText = Math.round(jobTotal);
    document.getElementById('job-summary').innerHTML = selectedJobs.length > 0 
        ? "<b>Работы:</b><br>" + selectedJobs.join("<br>") 
        : "Выберите работы...";
}

// Klausītāji
document.querySelectorAll('input, select').forEach(el => el.addEventListener('input', update));
window.onload = update;