//Получение json
fetch('https://dummyjson.com/products')
    .then((res) => res.json())
    .then((data) => getTask(data))
   
function getTask(data) {
    // Сам список и элемента списка
    const productsList = document.querySelector(".products__list"),
        product = document.getElementsByClassName("product"),
        productsItem = document.getElementsByClassName("products__item");
    
    // Стрелки вперед, назад, табло    
    const sliderNext = document.querySelector(".slider__next"),
        sliderPrev = document.querySelector(".slider__prev"),
        sliderNum = document.querySelector(".slider__number");

    const select = document.querySelector("#select");

    // Инициализация 
    let step = 0;
 
    createCards(0, changeNumPic());
    setTooltips();
 

//Создание карточек
    function createCards(minPic, numPic) {
        let products = data.products;
        // debugger
        for (let i = minPic; i < numPic; i++) {
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

//Создание и наполнение всплывающих подсказок
    function setTooltips() {
        let products = data.products;

        for (let i = 0; i < changeNumPic(); i++) {
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

//Удаление карточек   
    function deleteCards(min, max) {
        for (let i = min; i < max; i++) {
            product[0].remove();
        } 
    }

//Прокрутка вперед
    function forward() {
        sliderNext.addEventListener('click', ()=> {
            deleteCards(0, changeNumPic());
            step += changeNumPic();

            if (changeNumPic() === 10 && step > 20) {
                step = 20;
            } else if (changeNumPic() === 5 && step > 25) {
                step = 25;
            }
            createCards(0 + step, changeNumPic() + step);
            setTooltips();
            sliderNum.textContent = `${step + 1}` + `-` + `${step + changeNumPic()}`;
        })
    } 
    forward() 

//Прокрутка назад
    function previous() {
        sliderPrev.addEventListener('click', ()=> {
            deleteCards(0, changeNumPic());
            step -= changeNumPic();
            if (step < 0) {
                step = 0;
            }
            createCards(0 + step, changeNumPic() + step); 
            setTooltips();
            sliderNum.textContent = `${step + 1}` + `-` + `${step + changeNumPic()}`; 
        })
    }
    previous()

//Реализация перетаскивания элементов списка
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
   
//Изменение количества отображаемых элементов с 10 до 5 и обратно
    function changeNumPic() {
        let a = 10;
        a = Number(select.value);
        return a;
    }
    function setNum() {
        
        select.addEventListener('change', ()=> {
            deleteCards(0, product.length);
            createCards(0, changeNumPic());
            step = 0;
            setTooltips();
            sliderNum.textContent = `${step + 1}` + `-` + `${step + changeNumPic()}`; 
        })
    }
    setNum()
    
} 

// alert("Остановочка")





