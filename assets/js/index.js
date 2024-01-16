import { Previewer, Handler } from "../js/paged.esm.js";

let fetchThis = [];
let filterThis;
let printFlag = false;

window.addEventListener("DOMContentLoaded", () => {

  if(document.querySelector("body.print")) {
    preparePrintInterface();
  }


  // runs if on post page
  if(document.querySelector("#add-to-collection-btn")) {
    preparePrintInterface();
    const addToCollectionBtn = document.querySelector("#add-to-collection-btn");
    addToCollectionBtn.addEventListener("click", () => {
      const slug = addToCollectionBtn.dataset.slug;

      const post = {
        slug: addToCollectionBtn.dataset.slug,
        title: addToCollectionBtn.dataset.title,
        parent: addToCollectionBtn.dataset.parent,
      }

      const collection = JSON.parse(localStorage.getItem("collection")) || [];

      // // if already in collection, return
      if (collection.find((post) => post.slug === slug)) {
        console.log("post already in collection");
        return;
      }

      collection.push(post);
      localStorage.setItem("collection", JSON.stringify(collection));

      console.log(collection);
    })
  }

  // runs if on collection page
  if(document.querySelector(".collection-wrapper")) {
    preparePrintInterface();
    const collectionWrapper = document.querySelector(".collection-wrapper");
    const collection = JSON.parse(localStorage.getItem("collection"));
  
    collection.forEach((post) => {
      const projektElement = document.createElement("a");     
      projektElement.dataset.slug = post.slug;
      projektElement.innerHTML = `
        <span>${post.title}</span>
        <span>${post.parent}</span>
        <span class="remove-btn">Remove from Collection</span>
      `;
      projektElement.href = post.slug;
      // projektElement.href = slug;
      projektElement.className = "collection--item";
      collectionWrapper.append(projektElement);   
    });

    const allRemoveBtns = document.querySelectorAll(".remove-btn");
    allRemoveBtns.forEach(btn => {
      btn.addEventListener("click", (event) => {
        event.preventDefault(); 
        const slug = btn.parentElement.dataset.slug;
        
        const collection = JSON.parse(localStorage.getItem("collection")) || [];
        const newCollection = collection.filter((post) => post.slug !== slug);

        localStorage.setItem("collection", JSON.stringify(newCollection));

        btn.parentElement.remove();

        // update fetchThis
        fetchThis = newCollection.map((collection) => {
          return [collection.slug, ".content-wrapper"];
        });
      })
    });

    fetchThis = collection.map((collection) => {
      return [collection.slug, ".content-wrapper"];
    });
  }
});





/* FUNCTIONS */

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
    </div>`;

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

//Preview book layout, make sure to include CSS files for the interface, select content by providing a query selector, falls back to #content
async function printPreview(filterTag, contentToFetch) {
  let inputPrint = document.getElementById("input-print");

  // disable screen styles
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