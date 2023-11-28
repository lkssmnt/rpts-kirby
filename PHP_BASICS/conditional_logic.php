<?php

/*
  Conditional logic

  Mit If-Abfragen können wir gewisse Codeblöcke nur ausführen, wenn eine
  bestimmte Voraussetzung erfüllt ist.
*/

$loggedIn = true;

if ($loggedIn === true) {
  echo "Hello user!";
} else {
  echo "Hello! You are not logged in!";
}

/*
  In dem Beispiel haben wir einen Boolean $loggedIn, der true ist.
  Innerhalb der Klammer des If-Statements checken wir ob $loggedIn true ist.

  Die drei === stehen hier für „ist gleich”.
  Da $loggenIn true ist, steht hier sozusagen true === true und ist somit richtig.

  Stellen wir $loggenIn auf false, würde der Abgleich nicht mehr stimmen.
  In diesem Fall würde der Codeblock der hinter else kommt ausgeführt werden.
*/