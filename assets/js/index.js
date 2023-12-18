if (
  document.querySelector(".author-info") &&
  document.querySelector(".hover-image")
) {
  const authorInfo = document.querySelector(".author-info");
  const hoverImage = document.querySelector(".hover-image");
  window.addEventListener("mousemove", (e) => {
    hoverImage.style.left = e.pageX + "px";
    hoverImage.style.top = e.pageY + "px";
  });

  const projectLinks = document.querySelectorAll("li");
  projectLinks.forEach((link) => {
    link.addEventListener("mouseenter", (event) => {
      const imageUrl = event.target.dataset.imageurl;
      hoverImage.src = imageUrl;

      const author = event.target.dataset.author;
      authorInfo.innerHTML = author;
    });
  });
}
