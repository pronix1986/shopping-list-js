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
    if(getFromLocalStorage('itemArr').length === 0)
        setToLocalStorage('itemArr', [
            {done: false, name: "Test1", quantity: "2", price: 100},
            {done: false, name: "Test2", quantity: "1", price: 100}
        ]);
    if(getFromLocalStorage('doneItemArr').length === 0)
        setToLocalStorage('doneItemArr', [
            {done: true, name: "Test3", quantity: "20", price: 20},
            {done: true, name: "Test4", quantity: "8L", price: 5}
        ]);
    if(getFromLocalStorage('deletedItemArr'). length === 0)
        setToLocalStorage('deletedItemArr', [
            {done: false, name: "Test5", quantity: "32", price: 150},
            {done: true, name: "Test6", quantity: "21", price: 10}
        ])

    let sectionsArrs = {'itemArr': 'shopping-list' , 'doneItemArr': 'done-list', 'deletedItemArr': 'deleted-list'};
    setToLocalStorage('sectionsArrs', sectionsArrs)
    initDefaultTab();
}

function clearTable() {
    document.getElementById('items').innerHTML = '';
}

function clearForm() {
    document.getElementById("pform").reset();
    displayFormButton(false);
}

function displayFormButton(isEditable) {
    let add = document.getElementById('submit-add');
    let edit = document.getElementById('submit-edit');
    let resultTable = document.getElementById('result-table');
    if(isEditable) {
        edit.style.display = 'inherit';
        add.style.display = 'none';
        resultTable.style.pointerEvents = 'none';
    } else {
        edit.style.display = 'none';
        add.style.display = 'inherit';
        resultTable.style.pointerEvents = 'auto';
    }
}

function addItemToTable(index, done, name, quantity, price) {
    let itemRow = document.createElement("tr");
    itemRow.innerHTML = `
        <td>${index}</td>
        <td><input type="checkbox" name="done" value="done" onclick="onDone(event)" ${done?"checked":""}></td>
        <td>${name}</td>
        <td>${quantity}</td>
        <td>${price}</td>
        <td>
            <div class="button-group">
                <button class="button-edit" data-tooltip="Edit" onclick="toEditItemForm(event)">
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
    clearForm();
    let sections = [...document.getElementsByClassName("section")];
    sections.forEach(s => tabName===s.id ? s.style.display = 'inherit' : s.style.display = 'none');
    scrollTo(0,0);
}

function displayEditButtons(tabName) {
    let editBtns = [...document.getElementsByClassName("button-edit")];
    editBtns.forEach(b => tabName==='shopping-list' ? b.style.display = 'initial' : b.style.display = 'none');
}

function updateButtons(tabName) {
    displayEditButtons(tabName);
}

function updateMenubar(newActiveElement, oldActiveElement) {
    oldActiveElement.classList.remove("active");
    newActiveElement.classList.add("active");
}

function updateResultTable(tabName) {
    updateCurrentArrName(tabName);
    clearTable();
    let curArr = getFromLocalStorage(getCurrentArrName());
    curArr.forEach((el, index) => addItemToTable(++index, el.done, el.name, el.quantity, el.price));
    updateButtons(tabName);
    let total = curArr.reduce((acc, curVal) => acc+= (+curVal.price), 0);
    addTotal(total);
}

function updateForm(isEditable) {
    if(!isEditable) clearForm();
    displayFormButton(isEditable);
    setActiveRow(isEditable);
}

function initDefaultTab() {
    refreshPage('shopping-list')
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

function refreshPage(sectionName) {
    displayTabHeader(sectionName);
    updateResultTable(sectionName);
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

function deleteItem(event) {
    let id = getIdFromEvent(event);
    let curArrName = getCurrentArrName();
    if('deletedItemArr' !== curArrName) { 
        exchangeItem(id, curArrName, 'deletedItemArr');
    } else {
        if(window.confirm('Delete the item permanently?')) {
            deleteFromArr('deletedItemArr', id);
        }
    }
    refreshPage(getCurrentSectionName());
}

function getIdFromEvent(event) {
    let tr = findParentNodeByTag("tr", event.target);
    return Number(tr.firstElementChild.innerHTML) - 1;
}

function setActiveRow(isActive) {
    isActive ? 
        findParentNodeByTag("tr", event.target).classList.add("active") : 
        document.querySelector("tr.active").classList.remove("active");
}

function toEditItemForm(event) {
    updateForm(true);
    let id = getIdFromEvent(event);
    let curArrName = getCurrentArrName()
    let curArr = getFromLocalStorage(curArrName);
    let item = curArr[id];
    document.getElementById('pname').value = item.name;
    document.getElementById('quantity').value = item.quantity;
    document.getElementById('price').value = +item.price;
    document.getElementById('pid').value = id;
    
}

function editItem(event) {
    let item = getItemFromForm();
    let id = getItemIdFromForm();
    updateForm(false);
    let validationMessage = validateItem(item);
    if(validationMessage) {
        alert(validationMessage);
        return false;
    }
    if(!validateItemChanged(item, id)) {
        return false;
    }
    exchangeItem(id, 'itemArr', 'itemArr', () => item);
    refreshPage(getCurrentSectionName());
}

function validateItemChanged(newItem, id) {
    let curArr = getFromLocalStorage(getCurrentArrName());
    let oldItem = curArr[id];
    return !(JSON.stringify(oldItem) === JSON.stringify(newItem));
}

function addItem(event) {
    let item = getItemFromForm();
    let validationMessage = validateItem(item);
    if(validationMessage) {
        alert(validationMessage);
        return false;
    }
    pushToArr('itemArr', item);
    refreshPage(getCurrentSectionName());
}

function getItemIdFromForm() {
    let form = findParentNodeByTag("form", event.target);
    return form.elements[3].value;
}

function getItemFromForm() {
    let form = findParentNodeByTag("form", event.target);
    let fName = form.elements[0].value;
    let fQuantity = form.elements[1].value;
    let fPrice = form.elements[2].value;
    return {done: false, name: fName, quantity: fQuantity, price: fPrice};
}

function validateItem(item) {   
    if(!item.name || !item.quantity || !item.price) {
        return "All fields are required";
    }
    if(isNaN(item.price) || item.price <= 0) {
        return "'Price' is invalid";
    }
    return "";                
}

function onDone(event) {
    if('deletedItemArr' === getCurrentArrName()) {
        return;
    }
    let id = getIdFromEvent(event);
    if(event.target.checked === true) {
        exchangeItem(id, 'itemArr', 'doneItemArr', (item => { 
            item.done = true; 
            return item;
        }));
    } else {
        exchangeItem(id, 'doneItemArr', 'itemArr', (item => { 
            item.done = false; 
            return item;
        }));
    }
    refreshPage(getCurrentSectionName());
}

/* Utility functions */
function getFromLocalStorage(name, isArr = true) {
    return localStorage.getItem(name) ? JSON.parse(localStorage.getItem(name)) : (isArr? [] : {})
}

function setToLocalStorage(name, obj) {
    localStorage.setItem(name, JSON.stringify(obj));
}

function setCurrentArrName(arrName) {
    localStorage.setItem("curArr", arrName);
}

function getCurrentArrName() {
    return localStorage.getItem("curArr");
}

function getCurrentSectionName() {
    return getFromLocalStorage('sectionsArrs', false)[getCurrentArrName()];
}

function deleteFromArr(arrName, id) {
    let arr = getFromLocalStorage(arrName);
    let deleted = arr.splice(id, 1);
    setToLocalStorage(arrName, arr);
    return deleted[0];
}

function pushToArr(arrName, item) {
    let arr = getFromLocalStorage(arrName);
    arr.push(item);
    setToLocalStorage(arrName, arr);
}

function insertToArr(arrName, id, item) {
    let arr = getFromLocalStorage(arrName);
    arr.splice(id, 0, item);
    setToLocalStorage(arrName, arr);
}

function exchangeItem(sourceId, sourceArrName, targetArrName, map) {
    let deleted = deleteFromArr(sourceArrName, sourceId);
    let item = map ? map(deleted) : deleted;
    if(sourceArrName !== targetArrName) {
        pushToArr(targetArrName, item);
    } else {
        insertToArr(targetArrName, sourceId, item);
    }

}

function findParentNodeByTag(parentTagName, childObj) {
    let testObj = childObj.parentNode;
    while(testObj.tagName.toUpperCase() !== parentTagName.toUpperCase()) {
        testObj = testObj.parentNode;
    }
    return testObj;
}

