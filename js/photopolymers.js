// Скрипт для страницы фотополимеров

// Инициализация страницы
function initializePhotopolymers() {
    console.log('=== ИНИЦИАЛИЗАЦИЯ СТРАНИЦЫ ФОТОПОЛИМЕРОВ ===');
    
    // Показываем информационное сообщение вместо загрузки товаров
    displayPhotopolymersInfo();
}

// Отображение информации о фотополимерах
function displayPhotopolymersInfo() {
    console.log('=== ОТОБРАЖЕНИЕ ИНФОРМАЦИИ О ФОТОПОЛИМЕРАХ ===');
    
    const container = document.getElementById('photopolymers-products-container');
    if (!container) {
        console.error('Контейнер photopolymers-products-container не найден');
        return;
    }
    
    container.innerHTML = `
        <div class="alert alert-info text-center">
            <i class="fas fa-flask fa-2x mb-3 text-purple"></i>
            <h5>Информация о фотополимерах</h5>
            <p class="mb-0">На этой странице представлена подробная информация о биосовместимых и не биосовместимых фотополимерах, используемых в стоматологии для 3D печати.</p>
        </div>
    `;
}

// Создание карточки фотополимера
function createPhotopolymerProductCard(product) {
    const name = product.name || product.наименование || 'Без названия';
    const fullDescription = product.description || product.описание || 'Описание отсутствует';
    const specifications = product.specifications || product.характеристики || '';
    
    // Сокращаем описание до первых 50 символов + "..."
    const shortDescription = fullDescription.length > 50 
        ? fullDescription.substring(0, 50) + '...' 
        : fullDescription;
    
    // Сокращаем характеристики до первых 80 символов + "..."
    const shortSpecs = specifications && specifications.length > 80 
        ? specifications.substring(0, 80) + '...' 
        : specifications;
    
    // Определяем изображение
    let imageHTML = '';
    const imageUrl = product.img_url || product.image_url || product.изображение || product.картинка;
    
    if (imageUrl) {
        // Заменяем проблемные изображения на placeholder
        if (imageUrl.includes('model-bone.png') || 
            imageUrl.includes('resione-castable.png') || 
            imageUrl.includes('dental-bleach.png')) {
            imageHTML = `
                <div class="printer-product-placeholder">
                    <i class="fas fa-flask"></i>
                </div>
            `;
        } else {
            imageHTML = `<img src="${imageUrl}" class="printer-product-image" alt="${name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        <div class="printer-product-placeholder" style="display: none;">
                            <i class="fas fa-flask"></i>
                        </div>`;
        }
    } else {
        imageHTML = `
            <div class="printer-product-placeholder">
                <i class="fas fa-flask"></i>
            </div>
        `;
    }
    
    return `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="printer-product-card">
                <div class="printer-image-container">
                    ${imageHTML}
                </div>
                <h5 class="printer-product-title">${name}</h5>
                <p class="printer-product-description">${shortDescription}</p>
                ${shortSpecs && shortSpecs !== 'Характеристики не указаны' ? `
                    <div class="specs-preview small mb-3">
                        <strong>Характеристики:</strong>
                        <p class="mb-0">${shortSpecs}</p>
                    </div>
                ` : ''}
                <button class="btn btn-outline-primary printer-details-btn" onclick="showPhotopolymerProductDetails('${product.id}')">
                    <i class="fas fa-info-circle me-2"></i>Подробнее
                </button>
            </div>
        </div>
    `;
}

// Показать детали фотополимера
function showPhotopolymerProductDetails(productId) {
    const product = photopolymersData.find(p => p.id === productId);
    if (!product) {
        console.error('Фотополимер не найден:', productId);
        return;
    }
    
    const name = product.name || product.наименование || 'Без названия';
    const description = product.description || product.описание || 'Описание отсутствует';
    const specifications = product.specifications || product.характеристики || 'Характеристики не указаны';
    
    // Определяем изображение для модального окна
    let modalImageHTML = '';
    const imageUrl = product.img_url || product.image_url || product.изображение || product.картинка;
    
    if (imageUrl && !imageUrl.includes('model-bone.png') && 
        !imageUrl.includes('resione-castable.png') && 
        !imageUrl.includes('dental-bleach.png')) {
        modalImageHTML = `<img src="${imageUrl}" class="printer-modal-image mb-3" alt="${name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">`;
    }
    
    const modalPlaceholderHTML = `
        <div class="printer-modal-image-placeholder mb-3" ${modalImageHTML ? 'style="display: none;"' : ''}>
            <i class="fas fa-flask"></i>
        </div>
    `;
    
    // Создаем модальное окно
    const modalHTML = `
        <div class="modal fade" id="photopolymerProductModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${name}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="text-center">
                            ${modalImageHTML}
                            ${modalPlaceholderHTML}
                        </div>
                        <div class="specs-detail">
                            <h6><i class="fas fa-info-circle me-2"></i>Описание</h6>
                            <p>${description}</p>
                            
                            <h6><i class="fas fa-cogs me-2"></i>Характеристики</h6>
                            <p>${specifications}</p>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Удаляем предыдущее модальное окно, если есть
    const existingModal = document.getElementById('photopolymerProductModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Добавляем новое модальное окно
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Показываем модальное окно
    const modal = new bootstrap.Modal(document.getElementById('photopolymerProductModal'));
    modal.show();
}

// Показать ошибку
function showError(message) {
    const container = document.getElementById('photopolymers-products-container');
    if (container) {
        container.innerHTML = `
            <div class="alert alert-danger text-center">
                <i class="fas fa-exclamation-triangle fa-2x mb-3"></i>
                <h5>Ошибка загрузки</h5>
                <p class="mb-0">${message}</p>
            </div>
        `;
    }
}

// Функция для показа изображения в модальном окне
function showImageModal(imageSrc, imageTitle) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('imageModalTitle');
    
    if (modal && modalImage && modalTitle) {
        modalImage.src = imageSrc;
        modalImage.alt = imageTitle;
        modalTitle.textContent = imageTitle;
        
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM загружен, инициализируем страницу фотополимеров');
    
    // Небольшая задержка для загрузки Firebase
    setTimeout(() => {
        initializePhotopolymers();
    }, 1000);
});
