# Shopping List App

## Description

The application allows to add, edit, remove, complete shopping items.

When you open the app "Shopping list" link should be active and list of active (not finished) items should be displayed (list.png).

When you press the button EDIT then the item in table becomes "active" (highlighted with gray color) and you will be able to edit it (edit.png).

When you press the button DELETE then the item should be removed from the current list and should appear in the "Deleted Items List" section (Deleted).

If you go to the "Deleted" section and remove item from there, then it should disappear from the application.

When you mark item as DONE then this item should be removed from the Shopping List and appear in "Done Items List" section (finished.png).

When you switch between catigories, only items related to active category should be displayed in the table.

## Implementation details

The application does not require any backend. It should be implemented as client side application only.
List of items should be saved in localstorage. When you open the app it should go to localstorage, take items from there (if they exist) and display them according to their categories.

## Tech stack

You are allowed to use only Vanilla JavaScript (without any frameworks and jQuery). You can use CSS only for styling or SASS preprocessor.