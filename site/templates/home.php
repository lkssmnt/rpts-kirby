<?php snippet("head") ?>

<?php
$projects = $site->find("projekte")->children();
?>

<main class="draggable">
  <div class="projekt draggable">Test</div>
  <div class="projekt draggable">Test 2</div>
</main>

<?php snippet("foot") ?>