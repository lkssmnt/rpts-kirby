import { Previewer, Handler } from "../js/paged.esm.js";

window.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector("#add-to-collection-btn")) {
    createAddToCollectionBtn("#add-to-collection-btn");
  }

  if (document.querySelector(".collection-wrapper")) {
    const collection = createCollection(".collection-wrapper");

    const bookContent = [];

    // add content before collection [slug, selector]
    bookContent.push(
      ["lukas/cover", ".print-wrapper"],
      ["lukas/inhaltsverzeichnis", ".print-wrapper"]
    );

    // add collection to book
    collection.forEach((post) => {
      bookContent.push([post.slug, ".content-wrapper"]);
    });

    // add content after collection [slug, selector]
    bookContent.push(
      ["lukas/backcover", ".print-wrapper"]
    );


    document.querySelector("#button-print-preview").addEventListener("click", () => {
      printPreview(bookContent);
    });

    document.querySelector("#button-print").addEventListener("click", () => {
      window.print();
    });

    document.querySelector("#button-screen").addEventListener("click", () => window.location.reload(false));
  }
});

//Preview book layout, make sure to include CSS files for the interface, select content by providing a query selector, falls back to #content
async function printPreview(bookContent) {

  // disable screen styles
  if (document.getElementById("style-screen")) {
    document
      .getElementById("style-screen")
      .setAttribute("disabled", "disabled");
  }

  let content = "";

  for (const page of bookContent) {
    const slug = page[0];
    const selector = page[1];

    const pageContent = await fetch(slug)
      .then(response => response.text())
      .then(html => {
        const parser = new DOMParser();
        let doc = parser.parseFromString(html, "text/html");
        if (selector != "") {
          doc = doc.querySelector(selector);
        }
        return doc;
      });

    content += pageContent.outerHTML; // Make sure to use outerHTML to get the string content of the element
  }

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
        // if (printFlag == true) {
        //   window.print();
        // }
      }
    }
  );

  // 3. Render
  previewer.preview(
    content,
    ["/assets/css/printstyles.css"],
    document.querySelector("#renderbook")
  );
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

    // add content and remove-button
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
  allRemoveBtns.forEach((btn) => {
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
    });
  });

  return collection;
}

function createAddToCollectionBtn(selector) {
  const addToCollectionBtn = document.querySelector(selector);
  addToCollectionBtn.addEventListener("click", () => {
    console.log("click");

    // store slug
    const slug = addToCollectionBtn.dataset.slug;

    // get all data from the buttons data-attributes
    const post = {
      slug: addToCollectionBtn.dataset.slug,
      title: addToCollectionBtn.dataset.title,
      parent: addToCollectionBtn.dataset.parent,
      kurs: addToCollectionBtn.dataset.kurs,
      image: addToCollectionBtn.dataset.image,
    };

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
  });
}