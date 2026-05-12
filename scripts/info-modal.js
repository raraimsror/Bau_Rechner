/* =========================================================
   МОДАЛЬНОЕ ОКНО ДЛЯ ИНФОРМАЦИИ
   ========================================================= */

// Инициализация модального окна при загрузке страницы
window.addEventListener("load", () => {
    initInfoModal();
});

function initInfoModal() {
    const roomInfoBtn = document.getElementById("roomInfoBtn");
    if (!roomInfoBtn) return;

    // Создаем модальное окно
    createModalStructure();

    // Обработчик клика на кнопку info
    roomInfoBtn.addEventListener("click", (e) => {
        e.preventDefault();
        openInfoModal();
    });

    // Закрытие модального окна при клике на фон или кнопку закрытия
    const modal = document.getElementById("infoModal");
    const closeBtn = document.getElementById("closeInfoModal");

    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                closeInfoModal();
            }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", closeInfoModal);
    }

    // Закрытие по клавише Escape
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeInfoModal();
        }
    });
}

// Создание структуры модального окна
function createModalStructure() {
    // Проверяем, не создано ли уже модальное окно
    if (document.getElementById("infoModal")) return;

    const modalHTML = `
        <div id="infoModal" class="info-modal">
            <div class="info-modal-content">
                <span id="closeInfoModal" class="info-modal-close">&times;</span>
                <div id="infoModalBody" class="info-modal-body">
                    <!-- Контент загружается динамически -->
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);
}

// Открытие модального окна
async function openInfoModal() {
    const modal = document.getElementById("infoModal");
    const modalBody = document.getElementById("infoModalBody");

    if (!modal || !modalBody) return;

    // Определяем язык (по умолчанию русский)
    const lang = detectLanguage();
    const infoFile = `libs/infos/room-measurement-${lang}.html`;

    try {
        // Загружаем контент из файла
        const response = await fetch(infoFile);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const htmlContent = await response.text();
        modalBody.innerHTML = htmlContent;

        // Показываем модальное окно
        modal.style.display = "flex";
        document.body.style.overflow = "hidden"; // Блокируем прокрутку фона

    } catch (err) {
        console.error("Ошибка загрузки информации:", err);
        modalBody.innerHTML = `
            <div class="info-tooltip">
                <h4>Ошибка загрузки</h4>
                <p>Не удалось загрузить информацию. Попробуйте позже.</p>
            </div>
        `;
        modal.style.display = "flex";
    }
}

// Закрытие модального окна
function closeInfoModal() {
    const modal = document.getElementById("infoModal");
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = ""; // Восстанавливаем прокрутку
    }
}

// Определение языка интерфейса
function detectLanguage() {
    // Проверяем язык браузера или настройки
    const userLang = navigator.language || navigator.userLanguage;

    // Если язык русский или украинский - показываем русский
    if (userLang.startsWith("ru") || userLang.startsWith("uk")) {
        return "ru";
    }

    // По умолчанию английский
    return "en";
}
