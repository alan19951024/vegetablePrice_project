const url = 'https://data.coa.gov.tw/Service/OpenData/FromM/FarmTransData.aspx'
const showList = document.querySelector(".showList")
const buttons = document.querySelectorAll('.button-group > .btn')
const buttonGroup = document.querySelector('.button-group')
const crop = document.querySelector('#crop')
const search = document.querySelector('.search')
const showResult = document.querySelector('.show-result')
const jsSort = document.querySelector('.js-sort-advanced')
const sortSelect = document.querySelector('.sort-select')
const deleteBtn = document.querySelector('.delete')
// console.log()


let data = []
let filterData = []
axios.get(url)
    .then(function (response) {
        console.log('資料回傳了');
        // console.log(response)
        data = response.data;
        renderData(data)
    })
    .catch(function (error) {
        console.log(error);
    });

// 渲染資料
function renderData(data) {
    console.log(data);
    let str = ''
    data.forEach(function (item) {
        str += `<tr>
        <td>${item.作物名稱}</td>
        <td>${item.市場名稱}</td>
        <td>${item.上價}</td>
        <td>${item.中價}</td>
        <td>${item.下價}</td>
        <td>${item.平均價}</td>
        <td>${item.交易量}</td>
        </tr>`;

    })
    showList.innerHTML = str
    filterData = data
    console.log(filterData.length)
}


// tabs 切換後持換顯示顏色
buttonGroup.addEventListener('click', function (e) {
    tabs = e.target.dataset.type;
    // console.log(toggleStatus)
    if (e.target.value === undefined) {
        // console.log('你點擊到空的地方')
        return;
    }
    buttons.forEach(function (item) {
        console.log(item)
        item.classList.remove('active')
    });
    e.target.classList.add('active')
})


// 頁籤切換
buttonGroup.addEventListener('click', function (e) {
    console.log(e.target.dataset.type)
    // 蔬果
    if (tabs === 'N04') {
        filterData = data.filter(item => item.種類代碼 === 'N04')
    }
    // 水果
    else if (tabs === 'N05') {
        filterData = data.filter(item => item.種類代碼 === 'N05')
    }
    // 花卉
    else {
        filterData = data.filter(item => item.種類代碼 === 'N06')
    }
    renderData(filterData)
    showResult.textContent = ''
})


// 點擊按鈕搜尋按鈕
// console.log(crop, search);
search.addEventListener('click', searchCrop)
// 點擊enter按鈕
crop.addEventListener('keyup', function (e) {
    if (e.key === 'Enter') {
        searchCrop()
    }
})
// 搜尋作物
function searchCrop() {
    if (crop.value === '') {
        alert(`請輸入要查詢的作物名稱`);
        return
    }
    // 需過濾掉null值 match才不會報錯誤
    filterData = data.filter((item) => item.作物名稱 !== null)
    filterData = filterData.filter((item) => {
        return item.作物名稱.match(crop.value);
    });

    if (filterData.length === 0) {
        showList.innerHTML = `<tr><td colspan="7" class="text-center p-3">查無${crop.value}作物資訊，請重新查詢</td></tr>`
        console.log(showList)
    } else {
        showResult.textContent = `以下為${crop.value}的查詢結果`
        renderData(filterData);
    }
    crop.value = ''
}



// 由小到大 arr.sort((a,b)=>a-b);
function dataUp(value) {
    filterData.sort((a, b) => {
        return a[value] - b[value]
    })
    renderData(filterData)
}
// 由大到小 arr.sort((a,b)=>b-a);
function dataDown(value) {
    filterData.sort((a, b) => {
        // console.log(b[value] - a[value])
        return b[value] - a[value]

    })
    renderData(filterData)


}

// 表格排序功能
jsSort.addEventListener('click', function (e) {
    console.log(e.target.nodeName)
    if (e.target.nodeName === 'I') {
        console.log(e.target.dataset.sort)
        let sort = e.target.dataset.sort
        let price = e.target.dataset.price
        if (sort === 'up') {
            dataUp(price)
        }
        else if (sort === 'down') {
            dataDown(price)
        }
    }
    renderData(filterData)
})


// 下拉選單排序切換
sortSelect.addEventListener('change', (e) => {
    console.log(e.target.value)
    switch (e.target.value) {
        case '依上價排序':
            dataDown('上價')
            break
        case '依中價排序':
            dataDown('中價')
            break
        case '依下價排序':
            dataDown('下價')
            break
        case '依平均價排序':
            dataDown('平均價')
            break
        case '依交易量排序':
            dataDown('交易量')
            break
    }
})

deleteBtn.addEventListener('click', (e) => {
    renderData(data)
})
