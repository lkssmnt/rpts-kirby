<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= $site->title() ?></title>

  <link href="/assets/css/reset.css" rel="stylesheet" type="text/css">
  <link href="/assets/css/pagedjs.css" rel="stylesheet" type="text/css">
  <link id="style-screen" href="/assets/css/styles.css" rel="stylesheet" type="text/css">
</head>

<body class="<?php if(($page->is("home")) || $page->is("collection")) echo "print" ?>">

<nav>
  <a href="<?= $site->url() ?>">Home</a>
  <a href="<?= url("collection") ?>">Collection</a>
</nav>