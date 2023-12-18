<?php snippet("head") ?>

<h1><?= $page->title() ?></h1>

<div class="images">
  <?php foreach ($page->gallery()->toFiles() as $image) : ?>
    <img src="<?= $image->url() ?>" srcset="<?= $image->srcset("projectImages") ?>">
  <?php endforeach ?>
</div>

<p>Autor:innen:</p>
<ul>
  <?php foreach ($page->author()->toPages() as $author) : ?>
    <li><?= $author->title() ?></li>
  <?php endforeach ?>
</ul>

<hr>

<?php if ($page->technology()->isNotEmpty()) : ?>
  <p>Technologie: <?= $page->technology(); ?></p>
<?php endif ?>

<div class="text">
  <?= $page->text()->kirbytext() ?>
</div>

<?php snippet("foot") ?>