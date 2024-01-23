import { Previewer, Handler } from "../js/paged.esm.js";

let fetchThis = [];
let filterThis;
let printFlag = false;

window.addEventListener("DOMContentLoaded", () => {
  // runs if on post page
  if(document.querySelector("#add-to-collection-btn")) {
    preparePrintInterface();
    createAddToCollectionBtn("#add-to-collection-btn");
  }

  // runs if on collection page
  if(document.querySelector(".collection-wrapper")) {
    preparePrintInterface();
    createCollection(".collection-wrapper");
  }

  const allDragElements = document.querySelectorAll(".draggable");
  allDragElements.forEach((element) => dragElement(element));
  
});




function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;

  elmnt.onmousedown = dragMouseDown;

  elmnt.addEventListener("mousedown", (event) => {
    event.stopPropagation();

    console.log(elmnt);

    document.querySelectorAll(".draggable").forEach((element) => {
      element.classList.remove("active");
    });

    elmnt.classList.add("active");
  });

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;

    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    console.log("end of drag");
    document.onmouseup = null;
    document.onmousemove = null;
  }
}




/* FUNCTIONS */

function createAddToCollectionBtn(selector) {
    const addToCollectionBtn = document.querySelector("selector");
    addToCollectionBtn.addEventListener("click", () => {
      // store slug
      const slug = addToCollectionBtn.dataset.slug;

      // get all data from the buttons data-attributes
      const post = {
        slug: addToCollectionBtn.dataset.slug,
        title: addToCollectionBtn.dataset.title,
        parent: addToCollectionBtn.dataset.parent,
      }

      // get collection from local storage
      const collection = JSON.parse(localStorage.getItem("collection")) || [];

      // if already in collection end function (return)
      if (collection.find((post) => post.slug === slug)) {
        console.log("post already in collection");
        return;
      }

      // add post to collection
      collection.push(post);

      // save collection to local storage
      localStorage.setItem("collection", JSON.stringify(collection));
    })
}

function createCollection(wrapperSelector) {
  const collectionWrapper = document.querySelector(wrapperSelector);

  // get collection from local storage
  const collection = JSON.parse(localStorage.getItem("collection"));

  // loop through collection
  collection.forEach((post) => {
    // create element
    const projektElement = document.createElement("a");         
    projektElement.dataset.slug = post.slug;

    // add content and remove button
    projektElement.innerHTML = `
      <span>${post.title}</span>
      <span>${post.parent}</span>
      <span class="remove-btn">Remove from Collection</span>
    `;

    // add href and classes
    projektElement.href = post.slug;
    projektElement.className = "collection--item";

    // append to wrapper
    collectionWrapper.append(projektElement);   
  });

  // get all remove buttons
  const allRemoveBtns = document.querySelectorAll(".remove-btn");
  // loop through all remove buttons and add event listener
  allRemoveBtns.forEach(btn => {
    btn.addEventListener("click", (event) => {
      // prevent default behaviour (going to link)
      event.preventDefault(); 

      // get slug from data attribute of the buttons parent element
      const slug = btn.parentElement.dataset.slug;
      
      // get collection from local storage
      const collection = JSON.parse(localStorage.getItem("collection")) || [];

      // filter collection to remove post with matching slug 
      const newCollection = collection.filter((post) => post.slug !== slug);

      // save new collection to local storage
      localStorage.setItem("collection", JSON.stringify(newCollection));

      // remove element from DOM (the parent of the button)
      btn.parentElement.remove();

      // update fetchThis
      fetchThis = newCollection.map((collection) => {
        return [collection.slug, ".content-wrapper"];
      });
    })
  });

  // update fetchThis
  fetchThis = collection.map((collection) => {
    return [collection.slug, ".content-wrapper"];
  });
}

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
      console.log("adshndas");
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