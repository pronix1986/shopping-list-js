if (
    document.readyState === "complete" ||
    (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
    initForm();
} else {
    document.addEventListener("DOMContentLoaded", initForm);
}

function initForm() {

    // test values:
    localStorage.setItem('itemArr', JSON.stringify([
        {done: false, name: "Test1", quantity: 2, price: 100},
        {done: false, name: "Test2", quantity: 1, price: 100}
    ]));
    localStorage.setItem('doneItemArr', JSON.stringify([
        {done: true, name: "Test3", quantity: 20, price: 20},
        {done: true, name: "Test4", quantity: 8, price: 5}
    ]));
    localStorage.setItem('deletedItemArr', JSON.stringify([
        {done: false, name: "Test5", quantity: 32, price: 150},
        {done: true, name: "Test6", quantity: 21, price: 10}
    ]));

    let itemArr = getArrFromLocalStorage('itemArr');
    let doneItemArr = getArrFromLocalStorage('doneItemArr');
    let deletedItemArr = getArrFromLocalStorage('deletedItemArr');
    // open the first tab according to the task spec:
    setCurrentArrName('itemArr');
    displayTabHeader("shopping-list");
    
    itemArr.forEach((el, index) => addItemToTable(++index, el.done, el.name, el.quantity, el.price));





}

function getArrFromLocalStorage(name) {
    return localStorage.getItem(name) ? JSON.parse(localStorage.getItem(name)) : []
}

function clearTable() {
    document.getElementById('items').innerHTML = '';
}

function addItemToTable(index, done, name, quantity, price) {
    let itemRow = document.createElement("tr");
    itemRow.innerHTML = 
    `
        <td>${index}</td>
        <td><input type="checkbox" name="done" value="done" ${done?"checked":""}></td>
        <td>${name}</td>
        <td>${quantity}</td>
        <td>${price}</td>
        <td>
            <button class="button-edit" data-tooltip="Edit">
                <span>&#x270e;</span>
            </button>
            <button class="button-delete" data-tooltip="Delete">
                <span>&#x274c;</span>
            </button>
        </td>
    `;
    document.getElementById('items').appendChild(itemRow);
}

function displayTabHeader(tabName) {
    let sections = [...document.getElementsByClassName("section")]
    sections.forEach(s => tabName===s.id ? s.style.display = 'inherit' : s.style.display = 'none')
    scrollTo(0,0);
}

function updateMenubar(oldActiveElement, newActiveElement) {
    oldActiveElement.classList.remove("active");
    newActiveElement.classList.add("active");
}

function updateResultTable(tabName) {
    updateCurrentArrName(tabName);
    clearTable();
    let curArr = getArrFromLocalStorage(getCurrentArrName());
    curArr.forEach((el, index) => addItemToTable(++index, el.done, el.name, el.quantity, el.price));

}

function handleTabClick(event) {
    let old = document.querySelector("nav > ul > li > a.active");
    let target = event.target;
    let sectionName = target.getAttribute('href').substring(1);
    if(old !== target) {
        displayTabHeader(sectionName);
        updateMenubar(old, target);
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

