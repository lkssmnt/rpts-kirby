<?php snippet("head") ?>

<div class="content-wrapper">
  <div class="projekt-wrapper">
    <h1><?= $page->title() ?></h1>
    
    <div class="images">
      <?php foreach ($page->gallery()->toFiles() as $image) : ?>
        <img src="<?= $image->url() ?>" srcset="<?= $image->srcset("projectImages") ?>">
      <?php endforeach ?>
    </div>
    
    <p>Autor:innen:</p>
    <ul>
      <?php foreach ($page->author()->toPages() as $author) : ?>
        <a href="<?= $author->url() ?>"><li><?= $author->title() ?></li></a>
      <?php endforeach ?>
    </ul>
    
    <p>Kurs:</p>
    <ul>
      <?php foreach ($page->course()->toPages() as $course) : ?>
        <a href="<?= $course->url() ?>"><li><?= $course->title() ?></li></a>
      <?php endforeach ?>
    </ul>
    
    <hr>
    
    <?php if ($page->technology()->isNotEmpty()) : ?>
      <p>Technologie: <?= $page->technology(); ?></p>
    <?php endif ?>
    
    <div class="text">
      <?= $page->text()->kirbytext() ?>
    </div>
  </div>
</div>


<?php snippet("foot") ?>