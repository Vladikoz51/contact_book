<?php
header("Access-Control-Allow-Origin: *");
require_once "connect.php";
require_once "Contact.php";

if (isset($_POST["log-in-email"])
    && isset($_POST["log-in-password"])) {
  $email = $_POST["log-in-email"];
  $password = $_POST["log-in-password"];

  try {
    // проверим есть ли в БД пользователь с таким email
    $conn = createConnection();
    $passQuery = "SELECT id, password FROM users WHERE email = ?";
    $stmt = $conn->prepare($passQuery);
    $stmt->execute([$email]);

    // если есть то сохраняем в переменные id и пароль из БД
    if ($stmt->rowCount() > 0) {
      foreach ($stmt as $user) {
        $userId = $user["id"];
        $userPassword = $user["password"];
        // создаем пустой массив куда добавим контакты пользователя из БД
        $userContacts = [];

        // если пароль из БД совпал с введенным паролем то сделаем запрос контактов пользователя
        if ($password === $userPassword) {
          $contactsQuery = "SELECT id, first_name, last_name, phone, email, other FROM contacts WHERE user_id = ?";
          $stmt = $conn->prepare($contactsQuery);
          $stmt->execute([$userId]);

          // если у пользователя есть контакты, то для каждой строчки результата запроса создаем объект класса Contact с
          // соответствующими свойствами и добавляем этот объект в массив $userContacts
          if ($stmt->rowCount() > 0) {
            foreach ($stmt as $contact) {
              $userContacts[] = new Contact(
                  $contact["id"],
                  $contact["first_name"],
                  $contact["last_name"],
                  $contact["phone"],
                  $contact["email"],
                  $contact["other"]);
            }
          }
          // отправляем запрос с флагами об успешном подключении, о том что пользователь уже зарегистрирован и прошел
          // аутентификацию, а также email и массив со всеми контактами пользователя (ощути мощь json!!!)
          echo json_encode(
              ["connected" => true,
              "registered" => true,
              "authenticated" => true,
              "email" => $email,
              "id" => $userId,
              "contacts" => $userContacts]
          );
        }
        // если же пароли не совпали то отправляем json с флагом о неудачной аутентификации
        else {
          echo json_encode(["connected" => true, "registered" => true, "authenticated" => false]);
        }
      }
    }
    // если пользователя с данным email в базе нет то отправляем ответ в виде json, с флагом что пользователь не
    // зарегистрирован.
    else {
      echo json_encode(["connected" => true, "registered" => false]);
    }
  }
  catch (PDOException $ex) {
    // если соединиться с БД не удалось отправляем json с соответствующим флагом и текстом исключения
    echo json_encode(["connected" => false, "exception" => $ex->getMessage()]);
  }

}
