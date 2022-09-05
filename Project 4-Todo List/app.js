let section = document.querySelector("section");
let add = document.querySelector("form button");
add.addEventListener("click", (e) => {
  // step1: get the input values
  let form = e.target.parentElement;
  let todoText = form.children[0].value;
  let todoMonth = form.children[1].value;
  let todoDate = form.children[2].value;

  // step7: 設定不跑return以下所設定的事件的情況
  if (
    todoText === "" ||
    todoMonth === "" ||
    todoDate === "" ||
    todoMonth < 0 ||
    todoMonth > 12 ||
    todoDate < 0 ||
    todoDate > 31
  ) {
    return;
  }

  if (
    (todoDate == 31 && todoMonth == 2) ||
    (todoDate == 31 && todoMonth == 4) ||
    (todoDate == 31 && todoMonth == 6) ||
    (todoDate == 31 && todoMonth == 9) ||
    (todoDate == 31 && todoMonth == 11)
  ) {
    alert("請輸入正確的日期");
    return;
  }

  // step2: prevent form from being submitted
  e.preventDefault();

  //   step3: creat a todo in section
  let todo = document.createElement("div");
  todo.classList.add("todo");
  todo.style.animation = "scaleUp 0.3s forwards";
  let text = document.createElement("p");
  text.classList.add("todo-text");
  text.innerText = todoText;
  let time = document.createElement("p");
  time.classList.add("todo-time");
  time.innerText = todoMonth + " / " + todoDate;

  section.appendChild(todo);
  todo.appendChild(text);
  todo.appendChild(time);

  //   step4: creat check & trash can button  in section
  let completeButton = document.createElement("button");
  completeButton.classList.add("complete");
  completeButton.innerHTML = '<img src="./Ceheck Icon.png">';
  //  step5: 設定按下完成鈕後的事件
  //  需在CSS設定pointer-event:none讓按按鈕時img不會被按到，以避免造成抓取HTML標籤錯誤的問題。
  completeButton.addEventListener("click", (e) => {
    let todoItem = e.target.parentElement;
    todoItem.classList.toggle("done");
  });

  let trashcanButton = document.createElement("button");
  trashcanButton.classList.add("trashcan");
  trashcanButton.innerHTML = '<img src="./Trash Can Icon.png">';
  //  step5: 設定按下垃圾桶後的事件
  trashcanButton.addEventListener("click", (e) => {
    let todoItem = e.target.parentElement;
    todoItem.style.animation = "scaleDown 0.3s forwards";

    todoItem.addEventListener("animationend", () => {
      todoItem.remove();

      //  Copy-----step10: remove from localStorage
      let text = todoItem.children[0].innerText;
      let myListArray = JSON.parse(localStorage.getItem("list"));
      myListArray.forEach((listData, index) => {
        if (listData.todoText == text) {
          myListArray.splice(index, 1);
          localStorage.setItem("list", JSON.stringify(myListArray));
        }
      });
    });
  });

  todo.appendChild(completeButton);
  todo.appendChild(trashcanButton);

  // step8: 設定資料為一個物件並儲存在瀏覽器、且在下次打開始瀏覽器時可以新增資料。
  let myTodo = {
    todoText: todoText,
    todoMonth: todoMonth,
    todoDate: todoDate,
  };

  let myList = localStorage.getItem("list");
  if (myList == null) {
    //若瀏覽器沒有任何存放此資料時會顯示null
    localStorage.setItem("list", JSON.stringify([myTodo])); //預先加入[]讓資料被提領時可以被認定為是陣列
  } else {
    let myListArray = JSON.parse(myList); //提領在瀏覽器中儲存的資料(為了新增資料)
    myListArray.push(myTodo); //在已經提領的陣列中加入新資料
    localStorage.setItem("list", JSON.stringify(myListArray)); //為了存入瀏覽器必須再轉成string
  }

  //   step6: clear the text input
  form.children[0].value = "";
});

// step9: 將瀏覽器存放的資料，提領並逐條(forEach)設定顯示方式(複製上面設定只在局部做修改)。
loadData();

function loadData() {
  let myList = localStorage.getItem("list");
  if (myList != null) {
    let myListArray = JSON.parse(myList);

    myListArray.forEach((listData) => {
      let todo = document.createElement("div");
      todo.classList.add("todo");
      let text = document.createElement("p");
      text.classList.add("todo-text");
      text.innerText = listData.todoText; //有修改
      let time = document.createElement("p");
      time.classList.add("todo-time");
      time.innerText = listData.todoMonth + " / " + listData.todoDate; //有修改

      section.appendChild(todo);
      todo.appendChild(text);
      todo.appendChild(time);

      let completeButton = document.createElement("button");
      completeButton.classList.add("complete");
      completeButton.innerHTML = '<img src="./Ceheck Icon.png">';
      completeButton.addEventListener("click", (e) => {
        let todoItem = e.target.parentElement;
        todoItem.classList.toggle("done");
      });

      let trashcanButton = document.createElement("button");
      trashcanButton.classList.add("trashcan");
      trashcanButton.innerHTML = '<img src="./Trash Can Icon.png">';
      trashcanButton.addEventListener("click", (e) => {
        let todoItem = e.target.parentElement;
        todoItem.style.animation = "scaleDown 0.3s forwards";
        todoItem.addEventListener("animationend", () => {
          todoItem.remove();

          //  step10: remove from localStorage(不要忘記copy到上方63列附近)
          let text = todoItem.children[0].innerText;
          let myListArray = JSON.parse(localStorage.getItem("list"));
          myListArray.forEach((listData, index) => {
            if (listData.todoText == text) {
              myListArray.splice(index, 1);
              localStorage.setItem("list", JSON.stringify(myListArray));
            }
          });
        });
      });

      todo.appendChild(completeButton);
      todo.appendChild(trashcanButton);
    });
  }
}

// step11: 用 marge sort 概念來設定list資料按時間順序的函數 (屬於演算法的範疇，複製維基百科的程式碼做修改)
function merge(left, right) {
  let result = [];
  while (left.length > 0 && right.length > 0) {
    if (Number(left[0].todoMonth) < Number(right[0].todoMonth)) {
      result.push(left.shift());
    } else if (Number(left[0].todoMonth) > Number(right[0].todoMonth)) {
      result.push(right.shift());
    } else if (Number(left[0].todoMonth) == Number(right[0].todoMonth)) {
      if (Number(left[0].todoDate) < Number(right[0].todoDate)) {
        result.push(left.shift());
      } else if (Number(left[0].todoDate) > Number(right[0].todoDate)) {
        result.push(right.shift());
      } else {
        result.push(left.shift());
        result.push(right.shift());
      }
    }
  }
  return result.concat(left, right);
}

function mergeSort(arr) {
  if (arr.length <= 1) {
    return arr;
  } else {
    let middle = Math.floor(arr.length / 2);
    let left = arr.slice(0, middle);
    let right = arr.slice(middle, arr.length);
    return merge(mergeSort(left), mergeSort(right));
  }
}

// step12: 設定按下 sort by time 按鈕的執行事項
let sortButton = document.querySelector("div.sort button");
sortButton.addEventListener("click", () => {
  // sort list and store newlist
  let sortedArray = mergeSort(JSON.parse(localStorage.getItem("list")));
  localStorage.setItem("list", JSON.stringify(sortedArray));
  // remove old list which on the windows
  while (0 < section.children.length) {
    section.children[0].remove();
  }
  // load Data (將上方step9設為一函數套用)
  loadData();
});
