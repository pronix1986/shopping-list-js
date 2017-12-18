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
        {done: true, name: "Test2", quantity: 1, price: 100}
    ]))

    let itemArr = getArrFromLocalStorage('itemArr');
    let doneItemArr = getArrFromLocalStorage('doneItemArr');
    let deletedItemArr = getArrFromLocalStorage('deletedItemArr');
    // open the first tab according to the task spec:
    displayTab("shopping-list");
    
    itemArr.forEach((el, index) => addItemToTable(++index, el.done, el.name, el.quantity, el.price));

    function getArrFromLocalStorage(name) {
        return localStorage.getItem(name) ? JSON.parse(localStorage.getItem(name)) : []
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



}

function displayTab(tabName) {
    let sections = [...document.getElementsByClassName("section")]
    sections.forEach(s => tabName===s.id ? s.style.display = 'inherit' : s.style.display = 'none')
    scrollTo(0,0);
}

function updateMenubar(newActiveElement) {
    let oldActiveElement = document.querySelector("nav > ul > li > a.active");
    oldActiveElement.classList.remove("active");
    newActiveElement.classList.add("active");
}

function handleTabClick(event) {
    let target = event.target;
    let sectionName = target.getAttribute('href').substring(1);
    displayTab(sectionName);
    updateMenubar(target);
}

