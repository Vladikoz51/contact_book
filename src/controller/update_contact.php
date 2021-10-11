<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
require_once "connect.php";

// получаем json строку из запроса
$jsonStr = file_get_contents("php://input");
// трансформируем ее в объект
$contactData = json_decode($jsonStr);

// сохраняем свойства объекта в переменные
$id = $contactData->id;
$firstName = $contactData->firstName;
$lastName = trim($contactData->lastName) === "" ? null : $contactData->lastName;
$phone = trim($contactData->phone) === "" ? null : $contactData->phone;
$email = trim($contactData->email) === "" ? null : $contactData->email;
// значение свойство other является объектом, поэтому трансформируем его обратно в строку, чтобы сохранить в БД
$other = json_encode($contactData->other, JSON_UNESCAPED_UNICODE) === "{}" ? null :
    json_encode($contactData->other, JSON_UNESCAPED_UNICODE);

try {
  // обновим данные контакта
  $conn = createConnection();
  $updateContactQuery = "UPDATE contacts SET first_name = ?, last_name = ?, phone = ?, email = ?, other = ? WHERE id = ?;";
  $stmt = $conn->prepare($updateContactQuery);
  $affectedRowsCount = $stmt->execute([$firstName, $lastName, $phone, $email, $other, $id]);

  // если данные контакта успешно обновлены
  if ($affectedRowsCount > 0) {
    echo json_encode(["connected" => true,"updated" => true]);
  }
  // если же данные обновить не удалось
  else {
    echo json_encode(["connected" => true,"updated" => false]);
  }
}
catch (PDOException $ex) {
  // если соединиться с БД не удалось отправляем json с соответствующим флагом и текстом исключения
  echo json_encode(["connected" => false, "exception" => $ex->getMessage()]);
}


