<?php

/*
Arrays sind Sammlungen von verschiedenen Werten, Zeicheketten (Strings), Booleans oder weiteren Arrays.
*/

## Array
$myArray = ["Hello", "World"];

## Einen spezifischen Wert aus einem Array auslesen:
echo $myArray[0]; // gibt den Wert an erste Stelle zurück, also "Hello"

## count($array) gibt die Anzahl der Elemente in einem Array zurück
echo count($myArray);

## mit array_push($array) kann ein Array um eine Element erweitert werden.
## Das neue Element wird hinten angefügt.
array_push($myArray, "!");

## Multidimensional Array
## Es können auch Arrays in einem Array vorkommen
$myMultiArray = [["H", "E", "L", "L", "O"], "World", 1];
