<?php snippet("head") ?>

<?php
$projects = $site->find("projekte")->children();
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

<?php snippet("foot") ?>