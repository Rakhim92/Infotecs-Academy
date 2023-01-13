//Получение и дальнейшая обработка json
fetch('https://dummyjson.com/products')
    .then((res) => res.json())
    .then((data) => getTask(data))
   


function getTask(data) {
    const productsList = document.querySelector(".products__list");
    const product = document.getElementsByClassName("product");
    const productsItem = document.getElementsByClassName("products__item");
    const tooltip = document.getElementsByClassName("tooltip");
    const select = document.querySelector("#select");
    const sliderNext = document.querySelector(".slider__next");
    const sliderPrev = document.querySelector(".slider__prev");

    let step = 0;
    // Инициализация 
    setCards(0, 10)
    setTooltips(0, 10)

    function setCards(minPic, numPic) {
        
        let products = data.products;
        for (let i = minPic; i < numPic; i++) {
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
        }
    } 

    function setTooltips() {
        let products = data.products;
        console.log(step)
        for (let i = 0; i < 10; i++) {
            //Наполнение подсказок
            productsItem[i].insertAdjacentHTML('afterbegin', `
                <div class="tooltip">
                    <figure class="picture">
                        <img src="${products[step + i].images[0]}"> 
                        <figcaption>${products[step + i].title}</figcaption>
                    </figure>
                    <div class="tooltiptext">
                        <div class="tooltiptext__description">${products[step + i].description}</div>
                        <div class="tooltiptext__features">
                            <div class="tooltiptext__topic">Технические характеристики</div>
                            <div class="tooltiptext__item">
                                <span>Рейтинг</span>
                                <span>${products[step + i].rating}</span>
                            </div>
                            <div class="tooltiptext__item">
                                <span>Категория</span>
                                <span>${products[step  + i].category}</span>
                            </div>
                            <div class="tooltiptext__item">
                                <span>Складской артикул</span>
                                <span>${products[step + i].stock}</span>
                            </div>
                        </div>
                    </div>
                <div>
            `)
        }
    }
    // setTooltips(0, 10)
    function deleteCards(min, max) {
        for (let i = min; i < max; i++) {
            product[0].remove();
        } 
    }
    function forward() {
        sliderNext.addEventListener('click', ()=> {
            deleteCards(0, 10);
            step += 10;
            if (step > 20) {
                step = 20;
            }
            setCards(0 + step, 10 + step)
            setTooltips()
        })
    } 
    forward() 
    function previous() {
        sliderPrev.addEventListener('click', ()=> {
            deleteCards(0, 10);
            step -= 10;
            if (step < 0) {
                step = 0;
            }
            setCards(0 + step, 10 + step); 
            setTooltips()  
        })
    }
    previous()
    function setDraggable() {
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
        // console.log(currentElement)
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
    }
    setDraggable()
    function setNum() {
        select.addEventListener('change', ()=> {
            deleteCards()
            setCards()   
        })
    }
    // setNum()
    
} 



// getTask(data) 

// sliderNext.addEventListener('click', )
// console.log(data);




