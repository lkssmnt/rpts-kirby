<?php snippet("head") ?>

<?php
$projects = $site->find("projects")->children();
?>

<h1><?= $site->title() ?></h1>

<p class="author-info"></p>

<img class="hover-image" src="https://placehold.co/600x400">

<h2>Projekte:</h2>
<ul>
  <?php foreach ($projects as $project) : ?>
    <li data-imageurl="<?= $project->gallery()->first()->toFile()->url() ?>" data-author="<?= $project->author()->first()->toPage()->title() ?>">
      <a href="<?= $project->url() ?>">
        <?= $project->title() ?>
      </a>
    </li>
  <?php endforeach ?>
</ul>

<script>
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

</script>

<?php snippet("foot") ?>