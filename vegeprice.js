const url = "https://data.coa.gov.tw/Service/OpenData/FromM/FarmTransData.aspx";
const showList = document.querySelector(".showList");
const buttons = document.querySelectorAll(".button-group > .btn");
const buttonGroup = document.querySelector(".button-group");
const crop = document.querySelector("#crop");
const search = document.querySelector(".search");
const showResult = document.querySelector(".show-result");
const jsSort = document.querySelector(".js-sort-advanced");
const sortSelect = document.querySelector(".sort-select");
const deleteBtn = document.querySelector(".delete");
const caretAll = document.querySelectorAll(".fas");
const jsSelect = document.querySelector(".sort-select");
const mobileSelect = document.querySelector(".mobile-select");
const previousPageBtn = document.querySelector(".previousPageBtn");
const nextPageBtn = document.querySelector(".nextPageBtn");
const pageNumText = document.querySelector(".pageNumText");
const allPageNumText = document.querySelector(".allPageNumText");
const lastPageBtn = document.querySelector(".lastPageBtn");
const firstPageBtn = document.querySelector(".firstPageBtn");
console.log(firstPageBtn);

let data = [];
let filterData = [];
let pageNum = 0;
let allPageNum = 0;

axios
  .get(url)
  .then(function (response) {
    // console.log(response)
    data = response.data;
    console.log(data.length);
    countPage(data);
    pageNum = data.length == 0 ? 0 : 1;
    console.log(allPageNum);
    renderData(data);
  })
  .catch(function (error) {
    console.log(error);
  });

// 頁碼計算
function countPage(data) {
  // 計算每十筆分類後剩下幾筆
  console.log(data.length);
  let quotient = data.length % 20;
  console.log(quotient);
  // 總共頁碼
  let remainder = (data.length - quotient) / 20;
  console.log(remainder);
  allPageNum = quotient == 0 ? remainder : remainder + 1;
}

//更新換頁按鈕&頁碼
function updatePageNum() {
  if (pageNum == 0) {
    previousPageBtn.disabled = true;
    firstPageBtn.disabled = true;
    nextPageBtn.disabled = true;
    lastPageBtn.disabled = true;
  } else if (pageNum == 1) {
    previousPageBtn.disabled = true;
    firstPageBtn.disabled = true;
    lastPageBtn.disabled = false;
    nextPageBtn.disabled = false;
  } else if (pageNum == allPageNum) {
    previousPageBtn.disabled = false;
    firstPageBtn.disabled = false;
    nextPageBtn.disabled = true;
    lastPageBtn.disabled = true;
  } else {
    previousPageBtn.disabled = false;
    nextPageBtn.disabled = false;
    lastPageBtn.disabled = false;
    firstPageBtn.disabled = false;
  }
  pageNumText.textContent = pageNum;
  allPageNumText.textContent = allPageNum;
}

// 點擊頁碼
previousPageBtn.addEventListener("click", () => {
  if (pageNum > 1) {
    pageNum--;
    console.log(pageNum);
    renderData(filterData);
  }
});

nextPageBtn.addEventListener("click", () => {
  if (pageNum < allPageNum) {
    pageNum++;
    console.log(pageNum);
    renderData(filterData);
  }
});
lastPageBtn.addEventListener("click", () => {
  pageNum = allPageNum;
  renderData(filterData);
});
firstPageBtn.addEventListener("click", () => {
  pageNum = 1;
  renderData(filterData);
});

// 交易日期
function date(tradeDate) {
  tradeDate = tradeDate.split(".");
  //取得民國年
  let year = parseInt(tradeDate[0]) + 1911;
  //取得月份
  let month = tradeDate[1];
  //取得日期
  let date = tradeDate[2];
  vidsDate = new Date(year + "/" + month + "/" + date);
  // 格式化日期 padStart() 方法來確保月份和日期都是兩位數（如果是個位數，則在前面補上零）
  let formattedDate = `${vidsDate.getFullYear()}/${(vidsDate.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${vidsDate.getDate().toString().padStart(2, "0")}`;
  // console.log(vidsDate)
  return formattedDate;
}

// 渲染資料
function renderData(data) {
  console.log(pageNum);
  //   console.log(data);
  let str = "";
  let dataMaxNum = pageNum * 20;
  data.forEach(function (item, index) {
    if (index >= dataMaxNum - 20 && index < dataMaxNum) {
      str += `<tr>
        <td>${item.作物名稱}</td>
        <td>${item.市場名稱}</td>
        <td>${date(item.交易日期)}</td>
        <td>${item.上價}</td>
        <td>${item.中價}</td>
        <td>${item.下價}</td>
        <td>${item.平均價}</td>
        <td>${item.交易量}</td>
        </tr>`;
    }
  });
  showList.innerHTML = str;
  filterData = data;
  countPage(filterData);
  removeDisable();
  updatePageNum();
}

// tabs 切換後持換顯示顏色
buttonGroup.addEventListener("click", function (e) {
  tabs = e.target.dataset.type;
  // console.log(toggleStatus)
  if (e.target.value === undefined) {
    // console.log('你點擊到空的地方')
    return;
  }
  buttons.forEach(function (item) {
    console.log(item);
    item.classList.remove("active");
  });
  e.target.classList.add("active");
});

// 頁籤切換
buttonGroup.addEventListener("click", function (e) {
  console.log(e.target.dataset.type);
  // 蔬果
  if (tabs === "N04") {
    filterData = data.filter((item) => item.種類代碼 === "N04");
  }
  // 水果
  else if (tabs === "N05") {
    filterData = data.filter((item) => item.種類代碼 === "N05");
  }
  // 花卉
  else {
    filterData = data.filter((item) => item.種類代碼 === "N06");
  }
  pageNum = 1;
  renderData(filterData);
  showResult.textContent = "";
});

// 點擊按鈕搜尋按鈕
search.addEventListener("click", searchCrop);
// 點擊enter按鈕
crop.addEventListener("keyup", function (e) {
  if (e.key === "Enter") {
    searchCrop();
  }
});

// 搜尋作物
function searchCrop() {
  if (crop.value === "") {
    alert(`請輸入要查詢的作物名稱`);
    return;
  }
  // 需過濾掉null值 match才不會報錯誤
  filterData = data.filter((item) => item.作物名稱 !== null);
  filterData = filterData.filter((item) => {
    return item.作物名稱.match(crop.value);
  });

  if (filterData.length === 0) {
    showList.innerHTML = `<tr><td colspan="7" class="text-center p-3">查無${crop.value}作物資訊，請重新查詢</td></tr>`;
    caretAll.forEach(function (item) {
      item.classList.add("disable");
    });
    jsSelect.setAttribute("disabled", "disabled");
    mobileSelect.setAttribute("disabled", "disabled");
    countPage(filterData);
    pageNum = 0;
    updatePageNum();
    console.log(showList);
  } else {
    showResult.textContent = `以下為${crop.value}的查詢結果`;
    pageNum = 1;
    renderData(filterData);
  }
  crop.value = "";
  buttons.forEach((item) => item.classList.remove("active"));
}

// 價錢由小到大 arr.sort((a,b)=>a-b);
function dataUp(value) {
  filterData.sort((a, b) => {
    return a[value] - b[value];
  });
  renderData(filterData);
}
// 價錢由大到小 arr.sort((a,b)=>b-a);
function dataDown(value) {
  filterData.sort((a, b) => {
    // console.log(b[value] - a[value])
    return b[value] - a[value];
  });
  renderData(filterData);
}

// 日期排序 遠到近
function dateUp(value) {
  filterData.sort((a, b) => {
    return Date.parse(a[value]) - Date.parse(b[value]);
  });
  renderData(filterData);
}
// 日期排序 近到遠
function dateDown(value) {
  filterData.sort((a, b) => {
    return Date.parse(b[value]) - Date.parse(a[value]);
  });
  renderData(filterData);
}

// 表格排序功能
jsSort.addEventListener("click", function (e) {
  console.log(e.target.value);
  if (e.target.nodeName != "I") {
    // console.log('你點擊到空的地方')
    return;
  } else if (e.target.nodeName === "I") {
    console.log(e.target.dataset.sort);
    let sort = e.target.dataset.sort;
    let price = e.target.dataset.price;
    let date = e.target.dataset.date;
    if (sort === "up") {
      dataUp(price);
      dateUp(date);
    } else if (sort === "down") {
      dataDown(price);
      dateDown(date);
    }
  }
  pageNum = 1;
  renderData(filterData);
});

// 下拉選單排序切換
sortSelect.addEventListener("change", (e) => {
  console.log(e.target.value);
  switch (e.target.value) {
    case "依上價排序":
      dataDown("上價");
      break;
    case "依中價排序":
      dataDown("中價");
      break;
    case "依下價排序":
      dataDown("下價");
      break;
    case "依平均價排序":
      dataDown("平均價");
      break;
    case "依交易量排序":
      dataDown("交易量");
      break;
    case "依交易日期排序":
      dateUp("交易日期");
      break;
  }
});
// 全部清除
deleteBtn.addEventListener("click", (e) => {
  buttons.forEach((item) => item.classList.remove("active"));
  pageNum = 1;
  renderData(data);
});

// 移除排序與下拉選單的diable
function removeDisable(e) {
  caretAll.forEach((item) => item.classList.remove("disable"));
  jsSelect.removeAttribute("disabled");
  mobileSelect.removeAttribute("disabled");
}

// $(document).ready(function () {
//   $(search).click(function () {
//     $(".js-sort-advanced").hide();
//     $(".show-result").hide();
//     $(".sort-content").hide();
//     // $(sortSelect).hide();
//   });
//   $("select").change(function () {
//     $("#js-select").hide();
//   });
// });

//
