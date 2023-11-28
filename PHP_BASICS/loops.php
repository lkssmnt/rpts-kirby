<?php

/*
  Loops

  Loops sind Schleifen, die einen spezfischen Codeblock (zwischen den {}) wiederholen,
  bis eine gewissen Voraussetzung eingetroffen ist.

  In Kirby brauchen wir vor allem die foreach loops. Es gibt aber auch noch andere Loops
  wie den for loop, oder den while loop.
*/


$teilnehmende = ["Finn", "Julia", "Heike", "Saskia", "Nele", "Lisanne", "Andreas", "Lukas"]; ?>

<h1>Teilnehmende des Kirby Workshops:</h1>

<?php foreach ($teilnehmende as $person) : ?>
  <p style="color: rgb(255, 0 , 0);"><?= $person ?></p>
<?php endforeach ?>


<?php /*
  In diesem Beispiel wird über den Array $teilnehmende iteriert. 
  Wir schreiben in die Klammern des foreach loops immer erst den Array
  oder das Objekt über das wir iterieren wollen und dann durch das "as"
  getrennt den Variablennamen, der für das jeweilige Element im Array stehen soll.

  Innerhalb des Loops können wir dann mithilfe dieser Variable ($person) auf
  das Element des Arrays zugreifen. In dem Fall ist es im ersten Durchlauf "Finn",
  im zweiten "Julia", und so weiter...
*/ ?>


<?php
$shoppingList = ["Äpfel", "Bananen", "Champagner", "Zahnpasta"];
?>

<h1>Einkaufsliste</h1>
<ul>
  <?php foreach ($shoppingList as $item) : ?>

    <?php
    $red = rand(0, 255);
    $green = rand(0, 255);
    $blue = rand(0, 255);
    ?>

    <li style="color: rgb(<?= $red ?>, <?= $green ?>, <?= $blue ?>);"><?= $item ?></li>
  <?php endforeach ?>
</ul>

*/ ?>


<?php
$shoppingList = ["Äpfel", "Bananen", "Champagner", "Zahnpasta"];

$colorArray = ["red", "blue", "green", "yellow", "lilac", "brown", "black"];
?>

<h1>Einkaufsliste</h1>
<ul>
  <?php foreach ($shoppingList as $item) : ?>
    <li style="color: <?= $colorArray[0] ?>"><?= $item ?></li>
  <?php endforeach ?>
</ul>