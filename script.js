//Получение и дальнейшая обработка json
fetch('https://dummyjson.com/products')
    .then((res) => res.json())
    .then((data) => setCards(data))

const productsList = document.querySelector(".products__list");
const productsItem = document.getElementsByClassName("products__item");
const tooltip = document.getElementsByClassName("tooltip");

function setCards(data) {
    let products = data.products
    console.log(products)
    console.log(productsList)
    for (let i = 0; i < 10; i++) {
    //Создание карточек
        productsList.insertAdjacentHTML('beforeend', `
            <li class=product draggable="true">
                <div class="products__item">
                    <div class="products__number">${products[i].id}</div>
                    <div class="products__content">
                        <div class="products__information">${products[i].title}</div>
                        <div class="products__description">
                            <div>Изготовитель: ${products[i].brand}</div>
                            <div>Цена: ${products[i].price} </div>
                            <div>Цена по скидке: ${Math.floor(products[i].price * (100 - products[i].discountPercentage) / 100)}</div>
                        </div>
                    </div>
                </div>
            </li>
        `)
    // Создание подсказок к карточкам
        let tooltip = document.createElement('div');
        tooltip.classList.add("tooltip");
        productsItem[i].appendChild(tooltip)
    }

    for (let i = 0; i < 10; i++) {
    //Наполнение подсказок
        tooltip[i].insertAdjacentHTML('afterbegin', `
        <figure class="picture">
            <img src="${products[i].images[0]}"> 
            <figcaption>${products[i].title}</figcaption>
        </figure>
        <div class="tooltiptext">
            <div class="tooltiptext__description">${products[i].description}</div>
            <div class="tooltiptext__features">
                <div class="tooltiptext__topic">Технические характеристики</div>
                <div class="tooltiptext__item">
                    <span>Рейтинг</span>
                    <span>${products[i].rating}</span>
                </div>
                <div class="tooltiptext__item">
                    <span>Категория</span>
                    <span>${products[i].category}</span>
                </div>
                <div class="tooltiptext__item">
                    <span>Складской артикул</span>
                    <span>${products[i].stock}</span>
                </div>
            </div>
        </div>
    `)
    }
} 

// //Добавляю реакцию на начало и конец перетаскивание
productsList.addEventListener(`dragstart`, (evt) => {
    const target = evt.target;
    target.closest('.product').classList.add('selected')
})
productsList.addEventListener(`dragend`, (evt) => {
    const target = evt.target;
    target.closest('.product').classList.remove(`selected`);
});

const  getNextElement = (cursorPosition, currentElement) => {
    const currentElementCoord = currentElement.getBoundingClientRect();
    const currentElementCenter = currentElementCoord.y + currentElementCoord.height / 2;
    
    const nextElement = (cursorPosition < currentElementCenter) ?
        currentElement :
        currentElement.nextElementSibling;
    
        return nextElement;
}


// Реализация перетаскивания
productsList.addEventListener('dragover', (evt)=> {
    const target = evt.target;
    // Разрешаю сбрасывать элементы в эту область
    evt.preventDefault();
    //Нахожу перемещаемый элемент
    const activeElement = document.querySelector('.selected');
    //Нахожу элемент, над которым в данным момент находится курсор
    const currentElement = target.closest('.product');
    console.log(currentElement)
    //Проверяю, что событие сработало:
    // 1. Не на том элементе, который мы перемещаем
    // 2. Именно на элементе списка

    const isMoveable = activeElement !== currentElement && currentElement.classList.contains('product')
    if (!isMoveable) {
        return;
    }
    
    const nextElement = getNextElement(evt.clientY, currentElement);
    if (
        nextElement &&
        activeElement === nextElement.previousElementSibling || 
        activeElement === nextElement
    ) {
        return
    }
    // const nextElement = (currentElement === activeElement.nextElementSibling) ? currentElement.nextElementSibling : currentElement;
    productsList.insertBefore(activeElement, nextElement);
})

