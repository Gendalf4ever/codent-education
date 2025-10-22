// Скрипт для страницы фотополимеров

let photopolymersData = [];
let productsDb = null;

// Инициализация страницы
async function initializePhotopolymers() {
    console.log('=== ИНИЦИАЛИЗАЦИЯ СТРАНИЦЫ ФОТОПОЛИМЕРОВ ===');
    
    try {
        // Получаем Firestore для товаров
        productsDb = window.getProductsFirestore();
        console.log('Firestore для товаров получен');
        
        await loadPhotopolymersFromFirebase();
        displayPhotopolymersProducts();
    } catch (error) {
        console.error('Ошибка инициализации:', error);
        showError('Не удалось загрузить данные о фотополимерах');
    }
}

// Загрузка фотополимеров из Firebase
async function loadPhotopolymersFromFirebase() {
    console.log('=== ЗАГРУЗКА ФОТОПОЛИМЕРОВ ИЗ FIREBASE ===');
    
    try {
        const snapshot = await productsDb.collection('products').get();
        console.log(`Получено ${snapshot.size} документов из Firebase для фотополимеров`);
        
        const allProducts = [];
        snapshot.forEach(doc => {
            allProducts.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        // Фильтруем только фотополимеры и материалы для 3D печати, исключаем оборудование
        photopolymersData = allProducts.filter(product => {
            const name = (product.name || product.наименование || '').toLowerCase();
            const category = (product.category || product.категория || '').toLowerCase();
            const description = (product.description || product.описание || '').toLowerCase();
            const tags = (product.tags || product.теги || '').toLowerCase();
            
            // Исключаем оборудование, принтеры, ванны, камеры полимеризации и аксессуары
            const isExcludedEquipment = 
                // 3D принтеры
                name.includes('принтер') ||
                name.includes('printer') ||
                name.includes('elegoo') ||
                name.includes('saturn') ||
                name.includes('mars') ||
                name.includes('uniformation') ||
                name.includes('shining') ||
                name.includes('accufab') ||
                name.includes('halot') ||
                category.includes('принтер') ||
                category.includes('printer') ||
                category.includes('3d принтер') ||
                tags.includes('принтер') ||
                tags.includes('printer') ||
                // Ванны для промывки
                name.includes('ванна') ||
                name.includes('wash') ||
                name.includes('cleaner') ||
                name.includes('ultrasonic') ||
                name.includes('ультразвук') ||
                category.includes('ванна') ||
                category.includes('wash') ||
                category.includes('cleaner') ||
                tags.includes('ванна') ||
                tags.includes('wash') ||
                tags.includes('cleaner') ||
                // Камеры и устройства полимеризации
                name.includes('cure') ||
                name.includes('curing') ||
                name.includes('полимериз') ||
                name.includes('камера') ||
                name.includes('устройство очистки') ||
                name.includes('засветк') ||
                name.includes('mercury') ||
                category.includes('cure') ||
                category.includes('curing') ||
                category.includes('полимериз') ||
                category.includes('камера') ||
                tags.includes('cure') ||
                tags.includes('curing') ||
                tags.includes('полимериз') ||
                tags.includes('камера') ||
                // Расходники и аксессуары
                name.includes('пленк') ||
                name.includes('film') ||
                name.includes('acf') ||
                name.includes('fep') ||
                name.includes('комплект') ||
                name.includes('kit') ||
                category.includes('расходник') ||
                category.includes('аксессуар') ||
                category.includes('запчасти') ||
                category.includes('consumable') ||
                category.includes('accessory') ||
                tags.includes('расходник') ||
                tags.includes('аксессуар') ||
                tags.includes('запчасти') ||
                tags.includes('пленка') ||
                tags.includes('film') ||
                // Оборудование общего назначения
                name.includes('станок') ||
                name.includes('machine') ||
                category.includes('оборудование') ||
                category.includes('equipment') ||
                tags.includes('оборудование') ||
                tags.includes('equipment');
            
            if (isExcludedEquipment) {
                console.log(`❌ Исключено оборудование: ${name} (не фотополимер)`);
                return false;
            }
            
            // Логика фильтрации для фотополимеров и материалов 3D печати
            const isPhotopolymer = 
                // Проверяем категорию
                category.includes('материал') ||
                category.includes('material') ||
                category.includes('смола') ||
                category.includes('resin') ||
                category.includes('фотополимер') ||
                category.includes('photopolymer') ||
                // Проверяем теги
                tags.includes('материал') ||
                tags.includes('material') ||
                tags.includes('смола') ||
                tags.includes('resin') ||
                tags.includes('фотополимер') ||
                tags.includes('photopolymer') ||
                (tags.includes('3d печать') && !tags.includes('принтер')) ||
                (tags.includes('3d printing') && !tags.includes('printer')) ||
                // Проверяем название (только материалы, не оборудование)
                (name.includes('смола') && !name.includes('принтер')) ||
                (name.includes('resin') && !name.includes('printer') && !name.includes('cleaner')) ||
                (name.includes('фотополимер') && !name.includes('принтер')) ||
                (name.includes('photopolymer') && !name.includes('printer')) ||
                (name.includes('материал') && !name.includes('принтер')) ||
                (name.includes('material') && !name.includes('принтер') && !name.includes('printer')) ||
                // Проверяем описание
                description.includes('материал для 3d печати') ||
                description.includes('смола для печати') ||
                description.includes('фотополимер для печати') ||
                (description.includes('фотополимер') && !description.includes('принтер'));
            
            if (isPhotopolymer) {
                console.log(`✅ Найден фотополимер: ${name}`);
                console.log(`   Категория: ${category}`);
                console.log(`   Теги: ${tags}`);
            } else {
                console.log(`❌ Продукт не является фотополимером: ${name} (категория: ${category})`);
            }
            
            return isPhotopolymer;
        });
        
        console.log(`Найдено ${photopolymersData.length} фотополимеров из ${allProducts.length} общих продуктов`);
        
        if (photopolymersData.length === 0) {
            console.warn('Не найдено ни одного фотополимера');
        }
        
    } catch (error) {
        console.error('Ошибка загрузки фотополимеров:', error);
        throw error;
    }
}

// Отображение фотополимеров
function displayPhotopolymersProducts() {
    console.log('=== ОТОБРАЖЕНИЕ ФОТОПОЛИМЕРОВ ===');
    
    const container = document.getElementById('photopolymers-products-container');
    if (!container) {
        console.error('Контейнер photopolymers-products-container не найден');
        return;
    }
    
    if (photopolymersData.length === 0) {
        container.innerHTML = `
            <div class="alert alert-info text-center">
                <i class="fas fa-flask fa-2x mb-3 text-purple"></i>
                <h5>Фотополимеры пока не добавлены</h5>
                <p class="mb-0">Скоро здесь появится каталог фотополимеров для 3D печати</p>
            </div>
        `;
        return;
    }
    
    let productsHTML = '<div class="row">';
    
    photopolymersData.forEach(product => {
        const productCard = createPhotopolymerProductCard(product);
        productsHTML += productCard;
    });
    
    productsHTML += '</div>';
    container.innerHTML = productsHTML;
    
    console.log(`Отображено ${photopolymersData.length} фотополимеров`);
}

// Создание карточки фотополимера (в стиле frezy)
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
                <div class="photopolymer-product-placeholder">
                    <i class="fas fa-flask"></i>
                </div>
            `;
        } else {
            imageHTML = `<img src="${imageUrl}" class="photopolymer-product-image" alt="${name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        <div class="photopolymer-product-placeholder" style="display: none;">
                            <i class="fas fa-flask"></i>
                        </div>`;
        }
    } else {
        imageHTML = `
            <div class="photopolymer-product-placeholder">
                <i class="fas fa-flask"></i>
            </div>
        `;
    }
    
    return `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="photopolymer-product-card">
                <div class="photopolymer-image-container">
                    ${imageHTML}
                </div>
                <h5 class="photopolymer-product-title">${name}</h5>
                <p class="photopolymer-product-description">${shortDescription}</p>
                ${shortSpecs && shortSpecs !== 'Характеристики не указаны' ? `
                    <div class="specs-preview small mb-3">
                        <strong>Характеристики:</strong>
                        <p class="mb-0">${shortSpecs}</p>
                    </div>
                ` : ''}
                <button class="btn btn-outline-primary photopolymer-details-btn" onclick="showPhotopolymerProductDetails('${product.id}')">
                    <i class="fas fa-info-circle me-2"></i>Подробнее
                </button>
            </div>
        </div>
    `;
}

// Показать детали фотополимера (в стиле frezy)
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
        modalImageHTML = `<img src="${imageUrl}" class="photopolymer-modal-image mb-3" alt="${name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">`;
    }
    
    const modalPlaceholderHTML = `
        <div class="photopolymer-modal-image-placeholder mb-3" ${imageUrl ? 'style="display: none;"' : ''}>
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
                            
                            <h6><i class="fas fa-flask me-2"></i>Характеристики</h6>
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
