<?php
class Contact {
  public int $id;
  public string $firstName;
  public string $lastName;
  public string $phone;
  public string $email;
  public string $other;

  public function __construct(int $id,
                              string $firstName,
                              string|null $lastName,
                              string|null $phone,
                              string|null $email,
                              string|null $other) {
    $this->id = $id;
    $this->firstName = $firstName;
    $this->lastName = $lastName === null ? "" : $lastName;
    $this->phone = $phone === null ? "" : $phone;
    $this->email = $email === null ? "" : $email;
    $this->other = $other === null ? "" : $other;
  }
}