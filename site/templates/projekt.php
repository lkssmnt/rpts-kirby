<?php snippet("header") ?>

<button
  id="add-to-collection-btn"
  data-slug="<?= $page->parent() ?>/<?= $page->slug() ?>"
  data-title="<?= $page->title() ?>"
  data-parent="<?= $page->parent() ?>"
  data-kurs="<?= $page->kurs()->toPages()->first()->slug() ?>"
  data-image="<?= $page->bilder()->toFiles()->first()->url() ?>"
  >Add to Collection
</button>

<div class="content-wrapper">
  <div class="projekt-wrapper">

    <div id="paged-wrapper">
      <h1><?= $page->title() ?></h1>
    </div>

    
    <div class="images">
      <?php foreach ($page->bilder()->toFiles() as $image) : ?>
        <img src="<?= $image->url() ?>" srcset="<?= $image->srcset("projectImages") ?>">
      <?php endforeach ?>
    </div>

    <?php if(count($page->autorinnen()->toPages()) > 1): ?>
    <p>Autor*innen:</p>
    <?php else: ?>
    <p>Autor*in:</p>
    <?php endif ?>

    <ul>
      <?php foreach ($page->autorinnen()->toPages() as $autorin) : ?>
        <a href="<?= $autorin->url() ?>"><li><?= $autorin->title() ?></li></a>
      <?php endforeach ?>
    </ul>
    
    <p>Kurs:</p>
    <ul>
      <?php foreach ($page->kurs()->toPages() as $kurs) : ?>
        <a href="<?= $kurs->url() ?>"><li><?= $kurs->title() ?></li></a>
      <?php endforeach ?>
    </ul>
    
    <hr>
    
    <?php if ($page->technologie()->isNotEmpty()) : ?>
      <p>Technologie: <?= $page->technologie(); ?></p>
    <?php endif ?>
    
    <div class="text">
      <?= $page->text()->kirbytext() ?>
    </div>
  </div>
</div>


<?php snippet("footer") ?>