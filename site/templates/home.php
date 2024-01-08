<?php snippet("head") ?>
<?php snippet("nav") ?>

<?php
$projects = $site->find("projects")->children();
?>

<!-- <p class="author-info"></p>

<img class="hover-image" src="https://placehold.co/600x400"> -->

<main id="swup" class="home-container transition-fade">
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
</main>


<?php snippet("foot") ?>