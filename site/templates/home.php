<?php snippet("header") ?>

<?php
$projects = $site->find("projekte")->children();
?>

<h1><?= $site->title() ?></h1>

<p class="author-info"></p>

<div class="filters">
  <button class="filter-button" data-type="all">Alle</button>
  <button class="filter-button" data-type="website">Website</button>
  <button class="filter-button" data-type="bewegt">Bewegt</button>
</div>

<h2>Projekte:</h2>
<ul class="projekt-liste">
  <?php foreach ($projects as $project) : ?>
    <li class="projekt" data-type="<?= $project->medium() ?>">
      <a href="<?= $project->url() ?>">
        <?= $project->title() ?>
      </a>
    </li>
  <?php endforeach ?>
</ul>

<?php snippet("footer") ?>