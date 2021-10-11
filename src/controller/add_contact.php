<?php
header("Access-Control-Allow-Origin: *");
require_once "connect.php";

if (isset($_POST["contact-first-name"]) && isset($_POST["user-id"])) {
  $firstName = $_POST["contact-first-name"];
  $lastName = trim($_POST["contact-last-name"]) === "" ? null : $_POST["contact-last-name"];
  $phone = trim($_POST["contact-phone"]) === "" ? null : $_POST["contact-phone"];
  $email = trim($_POST["contact-email"]) === "" ? null : $_POST["contact-email"];
  $other = [];
  $userId = $_POST["user-id"];

  // извлекаем информацию о кастомных полях контакта
  for ($i = 1 ; $i <= 5; $i++) {
    if (isset($_POST["contact-custom-field-name-$i"])) {
      if (trim($_POST["contact-custom-field-name-$i"]) !== "") {
        $other[$_POST["contact-custom-field-name-$i"]] = $_POST["contact-custom-field-value-$i"];
      }
    }
    else {
      break;
    }
  }
  $other = $other === [] ? null : $other;

  try {
    // добавим контакт текущему пользователю
    $conn = createConnection();
    $addContactQuery = "INSERT INTO contacts(first_name, last_name, phone, email, other, user_id) VALUES (?, ?, ?, ?, ?, ?);";
    $stmt = $conn->prepare($addContactQuery);
    $affectedRowsCount = $other === null ? $stmt->execute([$firstName, $lastName, $phone, $email, $other, $userId]) :
        $stmt->execute([$firstName, $lastName, $phone, $email, json_encode($other), $userId]);

    // если контакт успешно добавлен
    if ($affectedRowsCount > 0) {
      echo json_encode(["connected" => true,"added" => true, "other" => $other]);
    }
    // если же контакт добавить не удалось
    else {
      echo json_encode(["connected" => true,"added" => false]);
    }
  }
  catch (PDOException $ex) {
    // если соединиться с БД не удалось отправляем json с соответствующим флагом и текстом исключения
    echo json_encode(["connected" => false, "exception" => $ex->getMessage()]);
  }
}