const StorageCtrl = (() => {

  return {
    storeItem: (item) =>{
      let items;

      if (localStorage.getItem('items') === null) {
        items = [];

        items.push(item);

        localStorage.setItem('items', JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem('items'));

        items.push(item);

        localStorage.setItem('items', JSON.stringify(items));
      }
    },
    getItemFromStorage: () => {
      let items;
      if (localStorage.getItem('items') === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },
    updateItemStorage: updateItem => {
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach((item, index) => {
        if(updateItem.id === item.id){
          items.splice(index, 1, updateItem);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteItemFromStorage: id => {
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach((item, index) => {
        if(id === item.id){
          items.splice(index, 1);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    clearItemFromStorage: () => {
      localStorage.removeItem('items');
    }
  }
})();

const itemCtrl = (() => {
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  const data = {
    items: StorageCtrl.getItemFromStorage(),
    currentItem: null,
    totalCalories: 0
  };

  return {
    getItems: () => {
      return data.items;
    },
    addItem: (name, calories) => {
      let ID;
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      calories = parseInt(calories);

      newItem = new Item(ID, name, calories);

      data.items.push(newItem);

      return newItem;
    },
    getItemById: (id) => {
      let found = null;
      data.items.forEach(item =>{
        if (item.id === id) {
          found = item;
        }
      });
      return found;

      /** Filter Function  */
      // return data.items.filter(item => item.id === id)[0];
      /** Find Function  */
      // return data.items.find(item => item.id === id);
      /* Every Function */
      // data.items.every((item, index, array) => {
      //     if(array[index].id === id) {
      //       found = item;
      //     }
      // });
      // return found;
      // const foundIndex = data.items.findIndex(elm => elm.id === id);
      // if (foundIndex > -1) {
      //   return data.items[foundIndex];
      // }
    },
    updateItem: (name, calories) => {
      
      calories = parseInt(calories);
      
      let found = null;
      data.items.forEach(item =>{
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    deleteItem: (id)=>{
      const ids = data.items.map(item => {
        return item.id;
      });

      const index = ids.indexOf(id);

      data.items.splice(index, 1);
    },
    clearAllItems: () => {
      data.items = [];
    },
    setCurrentItem: item => {
      data.currentItem = item;
    },
    getCurrentItem: () => {
      return data.currentItem;
    },
    getTotalCalories: () => {
      let total = 0;

      data.items.forEach(item =>{
        total += item.calories;
      });

      data.totalCalories = total;

      return data.totalCalories;
    },
    logData: () => {
      return data;
    }
  };
})();

const UICtrl = (() => {
  const UISelctors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    itemName: '#item-name',
    itemCalories: '#item-calories',
    totalCalories: '.total-calories'
  };

  return {
    populateItemList: items => {
      let html = '';

      items.forEach(item => {
        html += `
                <li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${
          item.calories
        } calories</em>
                <a href="#" class="secondary-content">
                  <i class="edit-item fa fa-pencil"></i>
                </a>
              </li>
                `;
      });

      document.querySelector(UISelctors.itemList).innerHTML = html;
    },
    getItemInput: () => {
      return {
        name: document.querySelector(UISelctors.itemName).value,
        calories: document.querySelector(UISelctors.itemCalories).value
      };
    },
    addListItem: item => {

      document.querySelector(UISelctors.itemList).style.display = 'block';

      const li = document.createElement('li');

      li.className = 'collection-item';

      li.id = `item-${item.id}`;

      li.innerHTML = `<strong>${item.name}: </strong> <em>${
        item.calories
      } calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>`;

      document
        .querySelector(UISelctors.itemList)
        .insertAdjacentElement('beforeend', li);
    },
    updateListItem: item => {

      let listItems = document.querySelectorAll(UISelctors.listItems);

      listItems = Array.from(listItems);

      listItems.forEach(listItem => {

        const itemID = listItem.getAttribute('id');

        if(itemID === `item-${item.id}`){
          document.querySelector(`#${itemID}`).innerHTML = 
          `<strong>${item.name}: </strong> <em>${
            item.calories
          } calories</em>
                <a href="#" class="secondary-content">
                  <i class="edit-item fa fa-pencil"></i>
                </a>`;
        }
      });
    },
    deleteListItem: id => {

      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    clearInput: () => {
      document.querySelector(UISelctors.itemName).value = '';
      document.querySelector(UISelctors.itemCalories).value = '';
    },
    addItemToForm: () =>{
      document.querySelector(UISelctors.itemName).value = itemCtrl.getCurrentItem().name;
      document.querySelector(UISelctors.itemCalories).value = itemCtrl.getCurrentItem().calories;

      UICtrl.showEditState();
    },
    removeItems: () => {
      let listItems = document.querySelectorAll(UISelctors.listItems);

      listItems = Array.from(listItems);

      listItems.forEach((item)=>{
        item.remove();
      });
    },
    hideList: () =>{
      document.querySelector(UISelctors.itemList).style.display = 'none';
    },
    showTotalCalories: (totalCalories) => {
      document.querySelector(UISelctors.totalCalories).textContent = totalCalories;
    },
    clearEditState: () => {
      UICtrl.clearInput();
      document.querySelector(UISelctors.updateBtn).style.display = 'none';
      document.querySelector(UISelctors.deleteBtn).style.display = 'none';
      document.querySelector(UISelctors.backBtn).style.display = 'none';
      document.querySelector(UISelctors.addBtn).style.display = 'inline';
    },
    showEditState: () => {
      document.querySelector(UISelctors.updateBtn).style.display = 'inline';
      document.querySelector(UISelctors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelctors.backBtn).style.display = 'inline';
      document.querySelector(UISelctors.addBtn).style.display = 'none';
    },
    getSelctors: () => {
      return UISelctors;
    }
  };
})();

const App = ((itemCtrl, StorageCtrl, UICtrl) => {
  const loadEventListeners = () => {
    const UISelctors = UICtrl.getSelctors();

    document
      .querySelector(UISelctors.addBtn)
      .addEventListener('click', itemAddSubmit);

      document.addEventListener('keypress', (e)=>{
        if (e.keyCode === 13 || e.which === 13) {
          e.preventDefault();
          return false;
        }
      });

      document.querySelector(UISelctors.itemList).addEventListener('click', itemEditClick);

      document.querySelector(UISelctors.updateBtn).addEventListener('click', itemUpdateSubmit);

      document.querySelector(UISelctors.deleteBtn).addEventListener('click', itemDeleteSubmit);

      document.querySelector(UISelctors.backBtn).addEventListener('click', itemBackSubmit);

      document.querySelector(UISelctors.clearBtn).addEventListener('click', clearAllItemsClick);

  };

  const itemAddSubmit = e => {
    e.preventDefault();

    const input = UICtrl.getItemInput();

    if (input.name !== '' && input.calories !== '') {
      const newItem = itemCtrl.addItem(input.name, input.calories);

      UICtrl.addListItem(newItem);

      const totalCalories = itemCtrl.getTotalCalories();

      UICtrl.showTotalCalories(totalCalories);

      StorageCtrl.storeItem(newItem);

      UICtrl.clearInput();
    }
  }

  const itemEditClick = e => {
    e.preventDefault();

    if (e.target.classList.contains('edit-item')) {
      
      const listId = e.target.parentNode.parentNode.id;

      const listIdArr = listId.split('-');

      const id = parseInt(listIdArr[1]);

      const itemToEdit = itemCtrl.getItemById(id);

      itemCtrl.setCurrentItem(itemToEdit);

      UICtrl.addItemToForm();
    }

  }

  const itemUpdateSubmit = e => {
    e.preventDefault();

    const input = UICtrl.getItemInput();

    const updateItem = itemCtrl.updateItem(input.name, input.calories);

    UICtrl.updateListItem(updateItem);

    const totalCalories = itemCtrl.getTotalCalories();

    UICtrl.showTotalCalories(totalCalories);

    StorageCtrl.updateItemStorage(updateItem);

    UICtrl.clearEditState();
  }
  const itemDeleteSubmit = e => {
    e.preventDefault();

    const currentItem = itemCtrl.getCurrentItem();

    itemCtrl.deleteItem(currentItem.id);

    UICtrl.deleteListItem(currentItem.id);

    const totalCalories = itemCtrl.getTotalCalories();

    UICtrl.showTotalCalories(totalCalories);

    StorageCtrl.deleteItemFromStorage(currentItem.id);

    UICtrl.clearEditState();

  }

  const itemBackSubmit = e => {
    e.preventDefault();
    UICtrl.clearEditState();
  }

  const clearAllItemsClick = () => {
    itemCtrl.clearAllItems();

    const totalCalories = itemCtrl.getTotalCalories();

    UICtrl.showTotalCalories(totalCalories);

    UICtrl.removeItems();

    StorageCtrl.clearItemFromStorage(); 

    UICtrl.hideList();
  }
  return {
    init: () => {

      UICtrl.clearEditState();

      const items = itemCtrl.getItems();

      if(items.length === 0){
        UICtrl.hideList();
      } else {
        UICtrl.populateItemList(items);
      }

      const totalCalories = itemCtrl.getTotalCalories();

      UICtrl.showTotalCalories(totalCalories);
      

      loadEventListeners();
    }
  };
})(itemCtrl, StorageCtrl, UICtrl);

App.init();
