const main = document.querySelector('main');
let allItems = [];

const removeItem = (btn) => {
    let removedName = btn.parentElement.parentElement.children[0].innerText;
    btn.parentElement.parentElement.remove();
    getElementTag(removedName).remove();
    allItems.splice(getElementIndex(removedName), 1);
}

const saveChanedName = (input, span, oldName) => {
    let newName = input.value;
    if (newName === '')
        window.alert("Назва продукту не може бути пустою");
    else if (oldName !== newName && getElementIndex(newName) !== -1)
        window.alert("Така назва продукту вже існує");
    else {
        item = allItems[getElementIndex(oldName)];
        getElementTag(oldName).innerHTML = `${newName}
                    <span class="amount">${item.amount}</span>`;
        item.name = newName;
        span.innerText = newName;
    }
    input.parentNode.replaceChild(span, input);
}

const changeName = (e) => {
    let span = e.target;
    let oldName = span.innerText;
    if (span.classList.contains('bought-item'))
        return;
    let input = document.createElement('input');
    input.type = 'text';
    input.value = oldName;
    span.parentNode.replaceChild(input, span);
    input.focus();
    input.addEventListener('blur', function () { saveChanedName(input, span, oldName) });
}

const addName = (item, section) => {
    let itemState = 'not-bought-item';
    if (item.bought)
        itemState = 'bought-item';
    section.innerHTML = `<article><span class="${itemState}">${item.name}</span></article>`;
    section.getElementsByTagName('span')[0].addEventListener('click', changeName);
}

const decreaseValue = (btn) => {
    let result = (parseInt(btn.nextElementSibling.innerText)) - 1;
    if (result == 1)
        btn.setAttribute('disabled', true);
    btn.nextElementSibling.innerText = result;
    let name = btn.parentElement.parentElement.children[0].children[0].innerText;
    let tag = getElementTag(name);
    tag.children[0].innerText = result;
    allItems[getElementIndex(name)].amount = result;
}

const increaseValue = (btn) => {
    let result = (parseInt(btn.previousElementSibling.innerText)) + 1;
    if (result !== 1)
        btn.previousElementSibling.previousElementSibling.disabled = false;
    btn.previousElementSibling.innerText = result;
    let name = btn.parentElement.parentElement.children[0].children[0].innerText;
    let tag = getElementTag(name);
    tag.children[0].innerText = result;
    allItems[getElementIndex(name)].amount = result;
}

const addAmount = (item, section) => {
    let article = document.createElement('article');
    let boughtState = '';
    if (item.amount === 1)
        boughtState = 'disabled';
    let amountState = `<button class="decrease-amount" data-tooltip="Зменшити" ${boughtState}>-</button>
                <span class="amount-of-items">${item.amount}</span>
                <button class="increase-amount" data-tooltip="Збільшити">+</button>`;
    if (item.bought)
        amountState = `<span class="amount-of-items">${item.amount}</span>`;
    article.innerHTML = amountState;
    if (article.children.length > 1) {
        article.children[0].addEventListener('click', function () { decreaseValue(this) });
        article.children[2].addEventListener('click', function () { increaseValue(this) });
    }
    section.appendChild(article);
}

const changeBoughtItem = (btn, item) => {
    btn.setAttribute('class', 'bought-button');
    btn.setAttribute('data-tooltip', 'Куплено');
    btn.innerText = 'Куплено';

    let cancelBtn = document.createElement('button');
    cancelBtn.setAttribute('class', 'cancel');
    cancelBtn.setAttribute('data-tooltip', 'Відмінити');
    cancelBtn.innerText = '✖';
    cancelBtn.addEventListener('click', function () { removeItem(this); });
    btn.parentElement.appendChild(cancelBtn);

    let amount = btn.parentElement.previousElementSibling;
    let decrease = document.createElement('button');
    decrease.setAttribute('class', 'decrease-amount');
    decrease.setAttribute('data-tooltip', 'Зменшити');
    decrease.addEventListener('click', function () { decreaseValue(this) });
    decrease.innerText = '-';
    if (amount.children[0].innerHTML == '1')
        decrease.disabled = true;
    amount.insertBefore(decrease, amount.children[0]);

    let increase = document.createElement('button');
    increase.setAttribute('class', 'increase-amount');
    increase.setAttribute('data-tooltip', 'Збільшити');
    increase.addEventListener('click', function () { increaseValue(this) });
    increase.innerText = '+';
    amount.appendChild(increase);
    item.setAttribute('class', 'not-bought-item');

    let tag = getElementTag(item.innerText);
    tag.parentElement.removeChild(tag);
    document.querySelector('.not-bought-items').appendChild(tag);
}

const changeNotBoughtItem = (btn, item) => {
    btn.setAttribute('class', 'not-bought-button')
    btn.setAttribute('data-tooltip', 'Не куплено');
    btn.innerText = 'Не куплено';
    btn.nextElementSibling.remove();
    let amount = btn.parentElement.previousElementSibling;
    amount.children[0].remove();
    amount.children[1].remove();
    item.setAttribute('class', 'bought-item');
    let tag = getElementTag(item.innerText);
    tag.parentElement.removeChild(tag);
    document.querySelector('.bought-items').appendChild(tag);
}

const changeItemState = (btn) => {
    let item = btn.parentElement.previousElementSibling.previousElementSibling.children[0];
    if (allItems[getElementIndex(item.innerText)].bought)
        changeBoughtItem(btn, item);
    else
        changeNotBoughtItem(btn, item);
    allItems[getElementIndex(item.innerText)].bought = !allItems[getElementIndex(item.innerText)].bought;
}

const addButtons = (item, section) => {
    let article = document.createElement('article');
    let btnState = `<button class="not-bought-button" data-tooltip="Не куплено">Не куплено</button>`;
    if (!item.bought) {
        btnState = `<button class="bought-button" data-tooltip="Куплено">Куплено</button>
                <button class="cancel" data-tooltip="Відмінити">✖</button>`;
    }
    article.innerHTML = btnState;
    article.children[0].addEventListener('click', function () { changeItemState(this); });
    if (article.children.length > 1)
        article.children[1].addEventListener('click', function () { removeItem(this); });
    section.appendChild(article);
}

const addItemTag = (item) => {
    let parent = document.querySelector('.not-bought-items');
    if (item.bought)
        parent = document.querySelector('.bought-items');
    let span = document.createElement('span');
    span.setAttribute('class', 'product-item');
    span.innerHTML = `${item.name}
    <span class="amount">${item.amount}</span>`;
    parent.appendChild(span);
}

const checkName = (name) => {
    for (let item of allItems) {
        if (item.name === name)
            return false;
    }
    return true;
}

const getElementIndex = (name) => {
    for (let i = 0; i < allItems.length; i++) {
        if (allItems[i].name === name)
            return i;
    }
    return -1;
}

const getElementTag = (name) => {
    let allTags = document.querySelectorAll('.product-item');
    let item = allItems[getElementIndex(name)];
    let size = item.amount.toString().length;
    for (let tag of allTags) {
        let temp = tag.innerText;
        temp = temp.substring(0, temp.length - size - 1);
        if (temp === name)
            return tag;
    }
}

const addButtonPressed = (btn) => {
    let name = btn.previousElementSibling.value;
    if (!checkName(name)) {
        window.alert('Назва продукту не може бути пустою');
        return;
    }
    if (name === '') {
        window.alert('Назва продукту не може повторюватися');
        return;
    }
    let newItem = { name: name, amount: 1, bought: false };
    addItem(newItem);
    allItems.push(newItem);
    btn.previousElementSibling.value = '';
    btn.previousElementSibling.focus();
}

const addEnterPressed = (input) => {
    let name = input.value;
    if (!checkName(name)) {
        window.alert('Назва продукту не може повторюватися');
        return;
    }
    if (name === '') {
        window.alert('Назва продукту не може бути пустою');
        return;
    }
    let newItem = { name: name, amount: 1, bought: false };
    addItem(newItem);
    allItems.push(newItem);
    input.value = '';
    input.focus();
}

document.querySelector("#add-button").addEventListener('click', function () { addButtonPressed(this); });
document.querySelector('#search-bar').addEventListener('keypress', function (e) {
    if (e.key !== 'Enter') { return; }
    addEnterPressed(this);
});

const addItem = (item) => {
    let section = document.createElement('section');
    section.setAttribute('class', "cart-item");
    addName(item, section);
    addAmount(item, section);
    addButtons(item, section);
    addItemTag(item);
    main.appendChild(section);
}

if (allItems === null || allItems.length === 0) {
    allItems = [{ name: 'Помідори', amount: 2, bought: true },
    { name: 'Печиво', amount: 2, bought: false },
    { name: 'Сир', amount: 1, bought: false }
    ];
    for (let item of allItems)
        addItem(item);
}