<?php snippet("head") ?>

<?php
$projects = $site->find("projects")->children();
?>

<h1><?= $site->title() ?></h1>

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

<?php snippet("foot") ?>