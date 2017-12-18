if (
    document.readyState === "complete" ||
    (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
    initForm();
} else {
    document.addEventListener("DOMContentLoaded", initForm);
}

function initForm() {

    /* test values: */
    if(getArrFromLocalStorage('itemArr').length === 0)
        setArrToLocalStorage('itemArr', [
            {done: false, name: "Test1", quantity: 2, price: 100},
            {done: false, name: "Test2", quantity: 1, price: 100}
        ]);
    if(getArrFromLocalStorage('doneItemArr').length === 0)
        setArrToLocalStorage('doneItemArr', [
            {done: true, name: "Test3", quantity: 20, price: 20},
            {done: true, name: "Test4", quantity: 8, price: 5}
        ]);
    if(getArrFromLocalStorage('deletedItemArr'). length === 0)
        setArrToLocalStorage('deletedItemArr', [
            {done: false, name: "Test5", quantity: 32, price: 150},
            {done: true, name: "Test6", quantity: 21, price: 10}
        ])

    initDefaultTab();
}

function getArrFromLocalStorage(name) {
    return localStorage.getItem(name) ? JSON.parse(localStorage.getItem(name)) : []
}

function setArrToLocalStorage(name, arr) {
    localStorage.setItem(name, JSON.stringify(arr));
}

function clearTable() {
    document.getElementById('items').innerHTML = '';
}

function addItemToTable(index, done, name, quantity, price) {
    let itemRow = document.createElement("tr");
    itemRow.innerHTML = `
        <td>${index}</td>
        <td><input type="checkbox" name="done" value="done" ${done?"checked":""}></td>
        <td>${name}</td>
        <td>${quantity}</td>
        <td>${price}</td>
        <td>
            <div class="button-group">
                <button class="button-edit" data-tooltip="Edit">
                    <span>&#x270e;</span>
                </button>
                <button class="button-delete" data-tooltip="Delete" onclick="deleteItem(event)">
                    <span>&#x274c;</span>
                </button>
            </div>
        </td>`;
    document.getElementById('items').appendChild(itemRow);
}

function addTotal(total) {
    document.getElementById('total').innerHTML = total;
}

function displayTabHeader(tabName) {
    let sections = [...document.getElementsByClassName("section")];
    sections.forEach(s => tabName===s.id ? s.style.display = 'inherit' : s.style.display = 'none');
    scrollTo(0,0);
}

function displayDeleteButtons(tabName) {
    let delBtns = [...document.getElementsByClassName("button-delete")];
    delBtns.forEach(b => tabName!=='deleted-list' ? b.style.display = 'initial' : b.style.display = 'none');
}

function displayEditButtons(tabName) {
    let editBtns = [...document.getElementsByClassName("button-edit")];
    editBtns.forEach(b => tabName==='shopping-list' ? b.style.display = 'initial' : b.style.display = 'none');
}

function updateButtons(tabName) {
    displayDeleteButtons(tabName);
    displayEditButtons(tabName);
}

function updateMenubar(newActiveElement, oldActiveElement) {
    oldActiveElement.classList.remove("active");
    newActiveElement.classList.add("active");
}

function updateResultTable(tabName) {
    updateCurrentArrName(tabName);
    clearTable();
    let curArr = getArrFromLocalStorage(getCurrentArrName());
    curArr.forEach((el, index) => addItemToTable(++index, el.done, el.name, el.quantity, el.price));
    updateButtons(tabName);
    let total = curArr.reduce((acc, curVal) => acc+= curVal.price, 0);
    addTotal(total);
}

function initDefaultTab() {
    displayTabHeader('shopping-list');
    updateResultTable('shopping-list');
}

function handleTabClick(event) {
    let old = document.querySelector("nav > ul > li > a.active");
    let target = event.target;
    let sectionName = target.getAttribute('href').substring(1);
    if(old !== target) {
        displayTabHeader(sectionName);
        updateMenubar(target, old);
        updateResultTable(sectionName);
    }
}

function updateCurrentArrName(tabName) {
    switch(tabName) {
        case 'shopping-list': 
            setCurrentArrName('itemArr');
            break;
        case 'done-list':
        setCurrentArrName('doneItemArr');
            break;
        case 'deleted-list':
        setCurrentArrName('deletedItemArr');
            break;
    }
}

function setCurrentArrName(arrName) {
    localStorage.setItem("curArr", arrName);
}

function getCurrentArrName() {
    return localStorage.getItem("curArr");
}

function deleteItem(event) {
    let id = getIdFromEvent(event);
    let deletedItemArr = getArrFromLocalStorage('deletedItemArr');
    let curArr = getArrFromLocalStorage(getCurrentArrName());
    let itemToRemove = curArr[id];
    deletedItemArr.push(itemToRemove);
    setArrToLocalStorage('deletedItemArr', deletedItemArr);
    curArr.splice(id, 1);
    setArrToLocalStorage(getCurrentArrName(), curArr);
    location.reload();
}

function findParentNodeByTag(parentTagName, childObj) {
    let testObj = childObj.parentNode;
    while(testObj.tagName.toUpperCase() !== parentTagName.toUpperCase()) {
        testObj = testObj.parentNode;
    }
    return testObj;
}

function getIdFromEvent(event) {
    let tr = findParentNodeByTag("tr", event.target);
    return Number(tr.firstElementChild.innerHTML) - 1;
}

