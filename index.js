(function() {
  //==============Variables Declaration Area==============//
  const BASE_URL = "https://movie-list.alphacamp.io";
  const INDEX_URL = BASE_URL + "/api/v1/movies/";
  const POSTER_URL = BASE_URL + "/posters/";
  const data = [];
  const dataPanel = document.getElementById("data-panel");
  const pagination = document.getElementById("pagination");
  const ITEM_PER_PAGE = 12;
  // 如果想選取的不只是 id 元素，還有 class 元素或者標籤這時候可以使用到 .querySelector() 的方式，不僅僅只局限於
  //  id 元素只是在使用 .querySelector() 的時候，選取器的方式要像 css 的方式一樣當選取 id 元素時：
  // document.querySelector('#title');
  // 當選取 class 元素時:
  // document.querySelector('.title');都要有相對應的 # 或者 .
  const displayMode = document.querySelector(".display-mode"); //陳列方法DOM
  const searchBtn = document.getElementById("submit-search");
  const searchInput = document.getElementById("search");
  let page = 1; //抽出event.target.dataset.page放在變數共用
  let paginationData = [];
  let defaultPage = 1;
  let displayType = "card";

  //==============Function Declaration Area==============//

  function displayDataList(data) {
    let htmlContent = "";
    data.forEach(function(item) {
      htmlContent += `
        <div class="col-sm-3">
          <div class="card mb-2">
            <img class="card-img-top " src="${POSTER_URL}${
        item.image
      }" alt="Card image cap">
            <div class="card-body movie-item-body">
              <h6 class="card-title">${item.title}</h5>
            </div>
            <!-- "More" button -->
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${
                item.id
              }">More</button>
              <!-- favorite button -->
              <button class="btn btn-info btn-add-favorite" data-id="${
                item.id
              }">+</button>
            </div>
          </div>
        </div>
      `;
    });
    dataPanel.innerHTML = htmlContent;
  }

  function showMovie(id) {
    // get elements
    const modalTitle = document.getElementById("show-movie-title");
    const modalImage = document.getElementById("show-movie-image");
    const modalDate = document.getElementById("show-movie-date");
    const modalDescription = document.getElementById("show-movie-description");

    // set request url
    const url = INDEX_URL + id;

    // send request to show api
    //.then()前的方法執行完後再執行then()內部的程序，這樣可以避免，數據沒獲取到的問題。
    axios.get(url).then(response => {
      const data = response.data.results;//axios promise 進行取值

      // insert data into modal ui
      modalTitle.textContent = data.title;
      modalImage.innerHTML = `<img src="${POSTER_URL}${
        data.image
      }" class="img-fluid" alt="Responsive image">`;
      modalDate.textContent = `release at : ${data.release_date}`;
      modalDescription.textContent = `${data.description}`;
    });
  }
  // localStorage 為一唯讀屬性, 此屬性允許您存取目前文件(Document)隸屬網域來源的 Storage 物件; 與 
  // sessionStorage 不同的是其儲存資料的可存取範圍為跨瀏覽頁狀態(Browser Sessions). localStorage 
  // 的應用與 sessionStorage 相似, 除了 localStorage 的儲存資料並無到期的限制, 而 sessionStorage 
  // 的儲存資料於目前瀏覽頁狀態結束的同時將一併被清除 — 也就是目前瀏覽器頁面被關閉的同時.
  function addFavoriteItem(id) {
    const list = JSON.parse(localStorage.getItem("favoriteMovies")) || [];//JSON.parse JSON變物件
    const movie = data.find(item => item.id === Number(id));
    // Array.some 是用來檢查陣列裡面是否有一些符合條件。只要有一個以上符合條件就會回傳 true，
    // 全部都不是的話會回傳 false。

    // 例如：
    // const result = students.some(x => x.age >= 18);
    // 執行結果：result 為 true
    // const result2 = students.some(x => x.country === 'Singapore');
    // 執行結果：result 為 false
    if (list.some(item => item.id === Number(id))) {
      alert(`${movie.title} is already in your favorite list.`);
    } else {
      list.push(movie);
      alert(`Added ${movie.title} to your favorite list!`);
    }
    localStorage.setItem("favoriteMovies", JSON.stringify(list));//JSON.stringify 物件變JSON
  }
  // Math.floor()：無條件捨去，回傳大於所給數字的最小整數
  // Math.ceil()：無條件進位，回傳小於等於所給數字的最大整數
  // Math.round()：四捨五入
  // toFixed()：四捨六入五留雙
  function getTotalPages(data) {
    totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1;
    let pageItemContent = "";
    pageItemContent += `
    <li class="page-item disabled">
      <a class="page-link" href="#" aria-label="Previous" data-attr="previous">
        &laquo;
      </a>
    </li>`;
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link numPage" href="#" data-page="${i + 1}">${i +
        1}</a>
        </li>
      `;
    }
    pageItemContent += `
    <li class="page-item">
      <a class="page-link" href="#" aria-label="Next" data-attr="next">&raquo;</a>
    </li>`;
    pagination.innerHTML = pageItemContent;
    updatePaginationStatus(1);
  }

  function getPageData(pageNum = 1, displayType, data) {
    paginationData = data || paginationData;
    let offset = (pageNum - 1) * ITEM_PER_PAGE;
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE);
    // slice() 方法會回傳一個新陣列物件，為原陣列選擇之begin 至end（不含end）部分的淺拷貝（shallow copy）。
    // 而原本的陣列將不會被修改。
    if (displayType === "card") displayDataList(pageData);
    else if (displayType === "list") displayDataInList(pageData);
  }

  //display data in list mode
  function displayDataInList(data) {
    let htmlContent = "";
    htmlContent += `
    <table class="table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Info</th>
          <th>Favorite</th>
        </tr>
      </thead>
    `;
    data.forEach(function(item) {
      htmlContent += `
        <tbody>
          <tr>
            <th>${item.title}</hr>
            <th><button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${
              item.id
            }">More</button></th>
            <th><button class="btn btn-info btn-add-favorite" data-id="${
              item.id
            }">+</button></th>
          </tr>
        </body>
      `;
    });
    htmlContent += `</table>`;
    dataPanel.innerHTML = htmlContent;
  }

  //pagination display in list mode

  //==============Set Events Area==============//

  axios
    .get(INDEX_URL)
    .then(response => {
      data.push(...response.data.results);
      //displayDataList(data)
      getTotalPages(data);
      getPageData(1, "card", data);
      console.log(data.length);
    })
    .catch(err => console.log(err));

  // listen to data panel
  dataPanel.addEventListener("click", event => {
    if (event.target.matches(".btn-show-movie")) {
      showMovie(event.target.dataset.id);
    } else if (event.target.matches(".btn-add-favorite")) {
      addFavoriteItem(event.target.dataset.id);
    }
  });

  // listen to search btn click event
  searchBtn.addEventListener("click", event => {
    console.log(data.length);
    //let results = []
    page = 1;
    // event.preventDefault()的作用是停止事件的默認動作，例如有時候我們會利用連結的<a>來當作按鈕，他本身
    // DOM就擁有連結的功能，但是有時候我們會為他新增類似onclick的事件，而只要在該<a>觸發的事件中加入
    // event.preventDefault()，就不會在執行他默認的動作，也就是不會再執行「連結到某個網址」這個動作
    event.preventDefault();
    const regex = new RegExp(searchInput.value, "i");
    results = data.filter(movie => movie.title.match(regex));
    getTotalPages(results);
    getPageData(1, displayType, results);
  });

  // listen to pagination click event
  pagination.addEventListener("click", event => {
    let e = event.target;
    let previous = e.parentElement.parentElement.firstElementChild;
    let last = e.parentElement.parentElement.lastElementChild;
    //頁碼事件
    if (event.target.matches(".numPage")) {
      updatePaginationStatus(page);
      page = event.target.dataset.page;
      page = Number(page);
      getPageData(page, displayType);
      updatePaginationStatus(page);
      //直接點非第一頁時上一頁不能用
      if (page !== 1) previous.classList.remove("disabled");
      //點到其他頁上一頁功能開啟
      else if (page === 1) previous.classList.add("disabled");
      /*同理用在最後一頁，這邊最後一頁是totalPages亦即從getTotalPages function來的
      新設一次判斷語句是因為連著上面邏輯會判斷不出來*/
      if (page === totalPages) last.classList.add("disabled");
      else last.classList.remove("disabled");
      //下一頁事件
    } else if (event.target.matches('[data-attr="next"]')) {
      //按下一頁表示一定有上一頁可以按了，故宮能開啟
      previous.classList.remove("disabled");
      updatePaginationStatus(page);
      page = Number(page);
      getPageData(page + 1, displayType);
      page += 1;
      updatePaginationStatus(page);
      //下一頁按到最後一頁時，功能要關閉
      if (page === totalPages) e.parentElement.classList.add("disabled");
      //上一頁事件
    } else if (event.target.matches('[data-attr="previous"]')) {
      last.classList.remove("disabled");
      updatePaginationStatus(page);
      page = Number(page);
      getPageData(page - 1, displayType);
      page -= 1;
      updatePaginationStatus(page);
      if (page === 1) e.parentElement.classList.add("disabled");
    }
  });

  //listen to sort event
  displayMode.addEventListener("click", event => {
    if (event.target.matches(".fa-list")) {
      //點了list顯示方法後
      displayType = "list";
      getPageData(page, "list");
    } else if (event.target.matches(".fa-th")) {
      //點回來card mode
      displayType = "card";
      getPageData(page, "card");
    }
  });
})();

function updatePaginationStatus(pageNum) {
  pagination.children[pageNum].classList.toggle("active");
}
