import { Previewer, Handler } from "../js/paged.esm.js";

let fetchThis = [];
var filterThis;

var printFlag = false;

window.addEventListener("DOMContentLoaded", () => {
  preparePrintInterface();

  if (document.querySelector(".add-to-collection-btn")) {
    const addToCollectionBtn = document.querySelector(".add-to-collection-btn");
    addToCollectionBtn.addEventListener("click", () => {
      const slug = addToCollectionBtn.dataset.slug;
      const title = addToCollectionBtn.dataset.title;
      const parent = addToCollectionBtn.dataset.parent;

      // get collection from local storage or create new empty collection
      const collection = JSON.parse(localStorage.getItem("collection")) || [];

      // if already in collection, return
      if (collection.find((page) => page.slug === slug)) {
        console.log("page already in collection");
        return;
      }

      // else add to collection
      collection.push({ slug, title, parent });
      localStorage.setItem("collection", JSON.stringify(collection));
    });
  }

  if (document.querySelector(".collection-wrapper")) {
    fetchThis = [];

    if (localStorage.getItem("collection")) {
      const collection = JSON.parse(localStorage.getItem("collection")) || [];
      const collectionWrapper = document.querySelector(".collection-wrapper");

      fetchThis = collection.map((page) => {
        return [`${page.slug}`, ".content-wrapper"];
      });

      displayCollection(collection, collectionWrapper);
    }
  }
});

function preparePrintInterface() {
  // 1. Get content
  let content = document.body.innerHTML;
  document.body.innerHTML = "";

  // 2. Move content into #content + build printing UI
  document.body.innerHTML = `
    <header id="header-pagedjs">
      <div id="header-container">
        <button id="button-screen" class="hide"> Show on screen</button>
        <button id="button-print-preview">Make book</button>
        <button id="button-print" class="hide">Print!</button>
      </div>
    </header>
    <div id="renderbook"></div>
    <div id="content">
      <div class="content-wrapper">
        ${content}
      </div>
    </div>\'`;

  document
    .querySelector("#button-print-preview")
    .addEventListener("click", () => {
      printPreview(filterThis, fetchThis);
    });

  document
    .querySelector("#button-screen")
    .addEventListener("click", screenReload);

  document.querySelector("#button-print").addEventListener(
    "click",
    function () {
      printPdf();
    },
    false
  );
}

function displayCollection(collection, collectionWrapper) {
  collection.forEach((page) => {
    const project = document.createElement("div");
    project.classList.add("project");
    project.innerHTML = `
            <a href="${page.slug}" data-slug="${page.slug}" class="collection-row">
                <p>${page.title}</p>
                <p>${page.parent}</p>
                <p class="remove-btn">Remove from Collection</p>
            </a>
        `;
    3;
    collectionWrapper.appendChild(project);
  });

  const removeBtns = document.querySelectorAll(".remove-btn");
  removeBtns.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      const slug = btn.parentElement.dataset.slug;
      const collection = JSON.parse(localStorage.getItem("collection")) || [];
      console.log(slug);
      const newCollection = collection.filter((page) => page.slug !== slug);
      console.log(newCollection);
      localStorage.setItem("collection", JSON.stringify(newCollection));
      btn.parentElement.parentElement.remove();
    });
  });
}

//Preview book layout, make sure to include CSS files for the interface, select content by providing a query selector, falls back to #content
async function printPreview(filterTag, contentToFetch) {
  let inputPrint = document.getElementById("input-print");

  if (document.getElementById("style-screen")) {
    document
      .getElementById("style-screen")
      .setAttribute("disabled", "disabled");
  }
  let bookcontent = document.querySelector("#content");
  let content = bookcontent.innerHTML;
  if (filterTag) {
    console.log("Content filtered by " + filterTag);
    let filteredBookcontent = document.querySelector(filterTag);
    content = filteredBookcontent.outerHTML;
  }
  if (contentToFetch) {
    console.log("content to fetch");
    for (var i = 0; i < contentToFetch.length; i++) {
      content += await fetcher(contentToFetch[i][0], contentToFetch[i][1]);
    }
  }
  bookcontent.innerHTML = "";

  // 1. Create Previewer
  let previewer = new Previewer();

  // 2. Register Handlers
  previewer.registerHandlers(
    class PreviewHandler extends Handler {
      afterPreview() {
        document.querySelector("#button-screen").classList.toggle("hide");
        document
          .querySelector("#button-print-preview")
          .classList.toggle("hide");
        document.querySelector("#button-print").classList.toggle("hide");
        if (printFlag == true) {
          window.print();
        }
      }
    }
  );

  // 3. Render
  previewer.preview(
    content,
    ["/assets/css/print.css"],
    document.querySelector("#renderbook")
  );
}

// Switch to screen design aka reset page
function screenReload() {
  window.location.reload(false);
}

// Print action, if you are in Preview --> Print, if you are in screen modee --> preview --> print
async function printPdf() {
  if (
    document.querySelector("#button-print-preview").classList.contains("hide")
  ) {
    window.print();
  } else {
    await printPreview(filterThis, fetchThis);
  }
}

// A content fetcher function to asynchronously load html files on the same server i.e. create book from multiple pages
async function fetcher(contentPath, filterTag) {
  console.log(contentPath);
  const output = fetch(contentPath)
    .then(function (response) {
      console.log(response);
      return response.text();
    })
    .then(function (html) {
      // Initialize DOM parser
      var parser = new DOMParser();
      // Parse text
      var parseContent = parser.parseFromString(html, "text/html");
      // filter if needed
      if (filterTag) {
        parseContent = parseContent.querySelector(filterTag).innerHTML;
        return parseContent;
      }
      console.log("Document" + contentPath + " added to book");
      return html;
    })
    .catch(function (err) {
      console.log("Failed to fetch page: ", err);
      return err;
    });
  return output;
}