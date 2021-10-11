<?php
function createConnection() {
  return $conn = new PDO("mysql:host=localhost;dbname=contact_book", "root", "dbrnjhwjq51");
}
