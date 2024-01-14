<?php snippet("head") ?>

<h1><?= $page->title() ?></h1>

<?php if ($page->email()->isNotEmpty()) : ?>
  <p>Email-Adresse: <?= $page->email() ?></p>
<?php endif ?>


<!-- Projekte: -->

<ul>
  <?php
  $allProjects = $site->find("projekte")->children();

  $filteredProjects = $allProjects->filter(
    fn ($projectPage) => $projectPage->author()->toPages()->has($page)
  );

  foreach ($filteredProjects as $project) : ?>
    <li>
      <a href="<?= $project->url() ?>">
        <?= $project->title() ?>
      </a>
    </li>
  <?php endforeach ?>
</ul>


<?php snippet("foot") ?>


<?php

// $projects = $allProjects->filter(function ($child) use ($page) {
//   return $child->author()->toPage()->is($page);
// });

// dump($projects);

?>