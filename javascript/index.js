function copyLink(event) {
  const input = event.target.parentNode.querySelector(".input");
  console.log(input);

  navigator.clipboard
    .writeText(input.value)
    .then(() => {
      alert("successfully copied");
    })
    .catch(() => {
      alert("something went wrong");
    });
}
window.addEventListener("load", () => {
  // setInterval(addlinklist, 1000);
  //creating new event to track storage changes

  const onStorageChange = new Event("onStorageChange");

  document.addEventListener("onStorageChange", () => {
    //display card items for local storage items
    console.log("Something happened");
    addlinklist();
  });
  //check if localstorage has data. if yes trigger onStorageChange custome event

  if (localStorage.getItem("linksrecord")) {
    document.dispatchEvent(onStorageChange);
  }
  const toggleMenuBtn = document.querySelector(".header-menu-toggle");
  //hide and showm menu button and mobile menu
  toggleMenuBtn.addEventListener("click", () => {
    const mobileMenu = document.querySelector(".mobile-menu");
    mobileMenu.classList.toggle("show");
  });
  //code to read input******
  let longlink = "";
  const inputEle = document.querySelector(".input-box");
  const Submitbtn = document.querySelector("#shortenBtn");

  //reading the input onchange
  inputEle.addEventListener("input", (event) => {
    toggleErrorStyle("remove");
    longlink = event.target.value;
    console.log(longlink);
  });

  //Submit link function
  Submitbtn.addEventListener("click", () => {
    if (longlink.length <= 0) {
      toggleErrorStyle("add");
      return;
      //add error styles and exit the function
    }
    toggleErrorStyle("remove"); //remove error styles

    //call the fetch api to generate short link
    getShortLink(longlink).then((data) => {
      shortLink = data.result.short_link;

      //check if storage is created to push new links
      if (!localStorage.getItem("linksrecord")) {
        populateStorage(longlink, shortLink);
      } else {
        insertData(longlink, shortLink);
      }
      dataObj = JSON.parse(localStorage.getItem("linksrecord"));
      // console.log(dataObj);
    });
  });
  //create storage for first time
  const populateStorage = (actualLink, shortLink) => {
    const links = [{ id: 0, actualLink: actualLink, shortLink: shortLink }];
    localStorage.setItem("linksrecord", JSON.stringify(links));
    document.dispatchEvent(onStorageChange);
  };
  //push data if storage exists
  const insertData = (actualLink, shortLink) => {
    let links = JSON.parse(localStorage.getItem("linksrecord"));
    // console.log(links);
    let id = links.length;
    links.push({
      id: id,
      actualLink: actualLink,
      shortLink: shortLink,
    });
    localStorage.setItem("linksrecord", JSON.stringify(links));
    document.dispatchEvent(onStorageChange);
  };
  //function to add or remove error on empty input
  const toggleErrorStyle = (type) => {
    if (type === "add") {
      inputEle.classList.add("no-input");
    } else {
      inputEle.classList.remove("no-input");
    }
  };
  //function to return shprt link fetched from api.shrtco.de
  async function getShortLink(longlink) {
    let res = await fetch(`https://api.shrtco.de/v2/shorten?url=${longlink}`);
    let data = await res.json();
    return await data;
  }

  function addlinklist() {
    if (localStorage.getItem("linksrecord")) {
      const cardlist = document.querySelector("#shotlink-display");
      let links = JSON.parse(localStorage.getItem("linksrecord"));
      let cards = links
        .map((card) => {
          return `<div class="short-link-card">
          <div class="actual-link-container">
             <h4 class="actual-link">${card.actualLink}</h4>
          </div>
          <div class="short-link-and-button">
            <h4 class="shorten-link">${card.shortLink}</h4>
            <div class="button-container">
            <input type="hidden" value=${card.shortLink} class="input" >
              <button class="ctc-btn large-btn" onclick="copyLink(event)">Copy</button>
            </div>
          </div>
        </div>`;
        })
        .join("");
      console.log(cards);
      cardlist.innerHTML = cards;
    }
  }
});
