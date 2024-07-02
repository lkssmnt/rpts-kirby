<div class="print-wrapper">
  <h1>Play the System</h1>
  
  <div class="cover-personen-titles">
    <?php foreach(page("personen")->children() as $person): ?>
      <p data-slug="<?= $person->slug() ?>"><?= $person->title() ?></p>
    <?php endforeach ?>
  </div>
</div>

<?php snippet("footer") ?>
