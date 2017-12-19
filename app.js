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
            {done: false, name: "Test1", quantity: 2, price: 100},
            {done: false, name: "Test2", quantity: 1, price: 100}
        ]);
    if(getFromLocalStorage('doneItemArr').length === 0)
        setToLocalStorage('doneItemArr', [
            {done: true, name: "Test3", quantity: 20, price: 20},
            {done: true, name: "Test4", quantity: 8, price: 5}
        ]);
    if(getFromLocalStorage('deletedItemArr'). length === 0)
        setToLocalStorage('deletedItemArr', [
            {done: false, name: "Test5", quantity: 32, price: 150},
            {done: true, name: "Test6", quantity: 21, price: 10}
        ])

    let sectionsArrs = {'itemArr': 'shopping-list' , 'doneItemArr': 'done-list', 'deletedItemArr': 'deleted-list'};
    setToLocalStorage('sectionsArrs', sectionsArrs)
    initDefaultTab();
}

function getFromLocalStorage(name, isArr = true) {
    return localStorage.getItem(name) ? JSON.parse(localStorage.getItem(name)) : (isArr? [] : {})
}

function setToLocalStorage(name, obj) {
    localStorage.setItem(name, JSON.stringify(obj));
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
                <button class="button-edit" data-tooltip="Edit" onclick="editItem(event)">
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

function setCurrentArrName(arrName) {
    localStorage.setItem("curArr", arrName);
}

function getCurrentArrName() {
    return localStorage.getItem("curArr");
}

function deleteItem(event) {
    let id = getIdFromEvent(event);
    let deletedItemArr = getFromLocalStorage('deletedItemArr');
    let curArrName = getCurrentArrName();
    let curArr = getFromLocalStorage(curArrName);
    let itemToRemove = curArr[id];
    if('deletedItemArr' !== curArrName) { 
        deletedItemArr.push(itemToRemove);
        setToLocalStorage('deletedItemArr', deletedItemArr);
        curArr.splice(id, 1);
        setToLocalStorage(curArrName, curArr);
    } else {
        if(window.confirm('Delete the item permanently?')) {
            deletedItemArr.splice(id, 1);
            setToLocalStorage('deletedItemArr', deletedItemArr);
        }
    }
    refreshPage(getFromLocalStorage('sectionsArrs', false)[curArrName]);
}

function findParentNodeByTag(parentTagName, childObj) {
    let testObj = childObj.parentNode;
    while(testObj.tagName.toUpperCase() !== parentTagName.toUpperCase()) {
        testObj = testObj.parentNode;
    }
    return testObj;
}

function getIdFromEvent(event, setActive = false) {
    let tr = findParentNodeByTag("tr", event.target);
    if(setActive) {
        tr.classList.add("active");
    }
    return Number(tr.firstElementChild.innerHTML) - 1;
}

function editItem(event) {
    let id = getIdFromEvent(event, true);
    let 
}

function addItem(some) {
    let form = findParentNodeByTag("form", event.target);
    let fName = form.elements[0].value;
    let fQuantity = form.elements[1].value;
    let fPrice = form.elements[2].value;
    let item = {done: false, name: fName, quantity: fQuantity, price: fPrice}
    let validationMessage = validateItem(item)
    if(validationMessage) {
      //  console.log(`TODO: item validation message: ${validationMessage}`);
        alert(validationMessage);
        return false;
    }
    let itemArr = getFromLocalStorage('itemArr');
    itemArr.push(item);
    setToLocalStorage('itemArr', itemArr);
    location.reload();
}

function validateItem(item) {   // TODO
    if(!item.name || !item.quantity || !item.price) {
        return "All fields are required";
    }
    if(isNaN(item.price) || item.price <= 0) {
        return "'Price' is invalid";
    }
    return "";                
}

