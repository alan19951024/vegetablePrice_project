# 農產品比價網
六角學院:javascipt專案練習-農產品價錢API串接開發
### API資料來源
* 行政院農業委員會
* https://data.gov.tw/dataset/8066
![image](https://github.com/alan19951024/vegetablePrice_project/assets/59355302/f036e3b4-edc6-4f6c-a0fe-c2d9f05c29f2)

# 學習方向
* 串接API，針對資料進行預處理
* 搜尋練習
* 頁碼製作(至底、下一頁)
* 頁籤切換
* 表頭排序功能、下拉選單排序功能

# 更版紀錄
### 0801
1. 若搜尋結果沒有資料時，建議將 table 內的排序箭頭隱藏或是加上 disabled 禁用屬性！
2. 搜尋輸入框建議可以也可以加上 trim() 語法來將多餘的空白移除！也避免使用者輸入空白送出！
3. 農產品資料建議可以加上分頁效果，讓使用者不用透過 scrollbar 滾動過長的距離就可以觀察資料
4. 若目前是渲染全部資料，將頁籤 .active 效果移除哦
### 0827
1. 將i標籤外層加上button，避免在禁用的情況下在箭頭附近拖移滑鼠有機會跳到e.target.nodeName === "I"的條件執行renderData，並變回可點選
2. 調整未滿20筆，不顯示切換頁碼功能
3. 引用sweetalert2視窗功能
