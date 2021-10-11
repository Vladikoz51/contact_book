<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
require_once "connect.php";

// получаем json строку из запроса
$jsonStr = file_get_contents("php://input");
// трансформируем ее в объект
$contactData = json_decode($jsonStr);

// сохраняем id контакта в переменную
$id = $contactData->id;

try {
  $conn = createConnection();
  $deleteContactQuery = "DELETE FROM contacts WHERE id = ?;";
  $stmt = $conn->prepare($deleteContactQuery);
  $affectedRowsCount = $stmt->execute([$id]);

  // если контакт успешно удален
  if ($affectedRowsCount > 0) {
    echo json_encode(["connected" => true,"deleted" => true]);
  }
  // если же контакт удалить не удалось
  else {
    echo json_encode(["connected" => true,"deleted" => false]);
  }
}
catch (PDOException $ex) {
  // если соединиться с БД не удалось отправляем json с соответствующим флагом и текстом исключения
  echo json_encode(["connected" => false, "exception" => $ex->getMessage()]);
}
