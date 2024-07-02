<?php snippet("header") ?>

<?php
$projects = $site->find("projekte")->children();
?>

<h1><?= $site->title() ?></h1>

<p class="author-info"></p>

<h2>Projekte:</h2>
<ul>
  <?php foreach ($projects as $project) : ?>
    <li>
      <a href="<?= $project->url() ?>">
        <?= $project->title() ?>
      </a>
    </li>
  <?php endforeach ?>
</ul>

<?php snippet("footer") ?>