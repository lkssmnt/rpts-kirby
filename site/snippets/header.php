<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= $site->title() ?></title>
  <?= css('assets/css/reset.css') ?>
  <?= css('assets/css/pagedjs.css') ?>
  <?= css('assets/css/screen.css', ['id' => 'style-screen']) ?>
</head>
<body data-url="<?= $site->url() ?>">

<button class="collection-btn">
  <a href="<?= page("collection")->url() ?>">Collection</a>
</button>