<?php
header("Access-Control-Allow-Origin: *");
require_once "connect.php";

if (isset($_POST["register-email"])
    && isset($_POST["register-password"])
    && isset($_POST["register-password-confirm"])) {
  // Сохраняем данные из формы регистрации в переменные
  $email = $_POST["register-email"];
  $password = $_POST["register-password"];
  $passwordConfirm = $_POST["register-password-confirm"];

  try {
    // Создаем подключение к базе данных
    $conn = createConnection();
    // проверяем есть ли уже в БД данный email
    $select = "SELECT id FROM users WHERE email = ?";
    $stmt = $conn->prepare($select);
    $stmt->execute([$email]);
    // Если есть то посылаем json ответ со значением false
    if ($stmt->rowCount() > 0) {
      // если пользователь с таким email найден в базе то отправляем json с флагом что регистрация не проводилась т.к.
      // не требуется
      echo json_encode(["connected" => true, "registered" => false]);
    }
    else {
      // если такого email в БД еще нет то пишем запрос на добавление нового пользователя в базу данных
      $insert = "INSERT INTO users(email, password) VALUES (?, ?)";
      $stmt = $conn->prepare($insert);
      $affectedRowsCount = $stmt->execute([$email, $password]);
      if ($affectedRowsCount > 0) {
        // если пользователь успешно добавлен отправляем json ответ со значением true
        echo json_encode(["connected" => true, "registered" => true]);
      }
    }
  }
  catch (PDOException $ex) {
    echo json_encode(["connected" => false, "exception" => $ex->getMessage()]);
  }
}

