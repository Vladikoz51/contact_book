
//--------------------------------------------------Переменные----------------------------------------------------------
// Кнопки "Register" и "Log in"
const regButton = document.querySelector("#register-btn");
const logInButton = document.querySelector("#log-in-btn");

// Элементы формы регистрации
const regFormContainer = document.querySelector(".register-container");
const regForm = document.forms["regForm"];
const regPassword = regForm["register-password"];
const regPasswordConfirm = regForm["register-password-confirm"];
const regFormSubmitBtn = document.querySelector(".register-button");
const regSuccessPopup = document.querySelector(".registration-success");
const regFailurePopup = document.querySelector(".registration-failure");

// Элементы формы аутентификации
const logInFormContainer = document.querySelector(".log-in-container");
const logInForm = document.forms["logInForm"];
const logInPassword = logInForm["log-in-password"];
const logInFormSubmitBtn = document.querySelector(".log-in-button");
const logOutIconContainer = document.querySelector("#logout-icon-container");

// Элементы раздела contacts
const addContactBtn = document.querySelector("#add-contact-btn");
const contactList = document.querySelector(".contacts-list");
const addContactFormContainer = document.querySelector(".contact-form-container");
const addContactForm = document.forms["addContactForm"];
const addFieldBtn = document.querySelector(".add-field-button");
const deleteFieldBtn = document.querySelector(".delete-field-button");

// Текст валидации пароля
const passErrorText = "The password must contain minimum eight characters and maximum 30 characters, at least one " +
    "uppercase letter, one lowercase letter and one number.";


//-----------------------------------------------------Функции----------------------------------------------------------
// функция для вывода сообщения об ошибке при валидации формы
function wrongMessage(form, text, msgClass,inputBefore) {
    if (document.querySelector("." + msgClass) === null) {
        const message = document.createElement("p");
        message.innerHTML = text
        message.className = msgClass;
        form.insertBefore(message, inputBefore);
    }
}

// функция для валидации пароля
function validatePassword(password, form, text, msgClass, insertBefore) {
    if (!password.checkValidity()) {
        wrongMessage(form, text, msgClass, insertBefore);
    }
    else {
        if (document.querySelector("." + msgClass) !== null) {
            document.querySelector("." + msgClass).remove();
        }
    }
}

// функция для валидации формы регистрации
function validateRegForm() {
    if (regPassword.value === regPasswordConfirm.value) {
        return true
    }
    else {
        wrongMessage(regForm, "Password and password repeat does not match, repeat password again.",
            "pass-mismatch-message", regFormSubmitBtn);
        return false;
    }
}

// функция для добавления контакта в книгу контактов
function createContactItem(id, firstName, lastName, phone, email, other) {
    const contactItem = document.createElement("li");
    contactItem.className = "contact-item";

    let content =
        `<p class="contact-item__name">${firstName} ${lastName}</p>
        <div class="contact-item__buttons-container">
          <button type="button" class="contact-item__info">Contact info</button>
          <button class="contact-item__delete-btn">Delete</button>
        </div>
        <div class="contact-item__delete-popup">
          <p>Delete this contact ?</p>
          <div class="contact-item__delete-popup-buttons-container">
            <button class="contact-item__delete-popup-yes-button" type="button">Yes</button>
            <button class="contact-item__delete-popup-no-button" type="button">No</button>
          </div>
        </div>
        <div class="contact-item-delete-connection-failure-popup">
          <p>Connection problem, cannot delete now, try again later.</p>
          <button class="contact-item-delete-connection-failure-popup__ok-button" type="button">Ok</button>
        </div>
        <div class="contact-item__contact-info-container">
          <form name="contact-info-form" id="contact-info-form" method="post">
            <input type="hidden" class="form-input" id="contact-info-id" name="contact-info-id" value="${id}" disabled>
            <div class="input-container contact-info-first-name-container">
              <label for="contact-info-first-name">First name</label>
              <input type="text" class="form-input" id="contact-info-first-name" name="contact-info-first-name" value="${firstName}" maxlength="20" required disabled>
            </div>
            <div class="input-container contact-info-last-name-container">
              <label for="contact-info-last-name">Last name</label>
              <input type="text" class="form-input" id="contact-info-last-name" name="contact-info-last-name" value="${lastName}" maxlength="20" disabled>
            </div>
            <div class="input-container contact-info-phone-container">
              <label for="contact-info-phone">Phone</label>
              <input type="tel" class="form-input" id="contact-info-phone" name="contact-info-phone" value="${phone}" pattern="[0-9]{0,11}" maxlength="11" disabled>
            </div>
            <div class="input-container contact-info-email-container">
              <label for="contact-info-email">Email</label>
              <input type="email" class="form-input" id="contact-info-email" name="contact-info-email" value="${email}" maxlength="320" disabled>
            </div>`;

    if (other !== "") {
        other = JSON.parse(other);
        let customFields = ``;
        for (const otherKey in other) {
            customFields +=
                `<div class="input-container contact-info-custom-field-container">
              <label>${otherKey}</label>
              <input type="text" class="form-input contact-info-custom-field" value="${other[otherKey]}" name="contact-info-${otherKey}" maxlength="100" disabled>
            </div>`;
        }
        content += customFields;
    }

    content +=
        `<button type="button" class="contact-info-edit-button">
          <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><g><rect fill="none" height="24" width="24"/></g><g><g><g><path d="M3,21l3.75,0L17.81,9.94l-3.75-3.75L3,17.25L3,21z M5,18.08l9.06-9.06l0.92,0.92L5.92,19L5,19L5,18.08z"/></g><g><path d="M18.37,3.29c-0.39-0.39-1.02-0.39-1.41,0l-1.83,1.83l3.75,3.75l1.83-1.83c0.39-0.39,0.39-1.02,0-1.41L18.37,3.29z"/></g></g></g></svg>
        </button>
        <div class="contact-item-save-and-add-buttons-container">
          <button type="button" class="contact-info-add-field-button">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M18 13h-5v5c0 .55-.45 1-1 1s-1-.45-1-1v-5H6c-.55 0-1-.45-1-1s.45-1 1-1h5V6c0-.55.45-1 1-1s1 .45 1 1v5h5c.55 0 1 .45 1 1s-.45 1-1 1z"/></svg>
          </button>
          <button type="submit" class="save-contact-item-button">Save</button>
        </div>
      </form>
    </div>`;

    contactItem.innerHTML = content;
    contactList.appendChild(contactItem);

    const deleteContactBtn = contactItem.querySelector(".contact-item__delete-btn");
    const deletePopupYesBtn = contactItem.querySelector(".contact-item__delete-popup-yes-button");
    const deletePopupNoBtn = contactItem.querySelector(".contact-item__delete-popup-no-button");
    const connectionFailureOkBtn = contactItem.querySelector(".contact-item-delete-connection-failure-popup__ok-button");


    const contactInfoBtn = contactItem.querySelector(".contact-item__info");
    const contactInfoContainer = contactItem.querySelector(".contact-item__contact-info-container");
    const contactInfoForm = contactItem.querySelector("#contact-info-form");
    const contactItemEditBtn = contactItem.querySelector(".contact-info-edit-button");
    const saveAndAddBtnContainer = contactItem.querySelector(".contact-item-save-and-add-buttons-container");
    const addInfoBtn = contactItem.querySelector(".contact-info-add-field-button");

    let inputsStart = contactItem.querySelectorAll(".form-input");
    let customFieldCounter = 1;

    contactInfoBtn.addEventListener("click", () => {
        if (contactInfoContainer.style.maxHeight) {
            contactInfoContainer.style.maxHeight = null;
        }
        else {
            contactInfoContainer.style.maxHeight = (contactInfoContainer.scrollHeight + 1000) + "px";
        }
    });

    contactItemEditBtn.addEventListener("click", () => {
        saveAndAddBtnContainer.style.maxHeight = saveAndAddBtnContainer.scrollHeight + "px";
        contactItemEditBtn.setAttribute("disabled", "true");

        for (const input of inputsStart) {
            input.removeAttribute("disabled");
        }

        if (inputsStart.length >= 10) {
            addInfoBtn.setAttribute("disabled", "true");
        }
    });

    addInfoBtn.addEventListener("click", () => {
        const customFieldPairContainer = document.createElement("div");
        customFieldPairContainer.innerHTML =
            `<div class="input-container contact-info-custom-field-name-container">
              <label for="contact-info-custom-field-name-${customFieldCounter}">Enter custom field name</label>
              <input type="text" class="form-input" id="contact-info-custom-field-name-${customFieldCounter}" name="contact-info-custom-field-name-${customFieldCounter}" maxlength="100"\>
            </div>
            <div class="input-container contact-info-custom-field-value-container">
              <label for="contact-info-custom-field-value-${customFieldCounter}">Enter custom field value</label>
              <input type="text" class="form-input" id="contact-info-custom-field-value-${customFieldCounter}" name="contact-info-custom-field-value-${customFieldCounter}" maxlength="100"\>
            </div>`;
        customFieldPairContainer.className = "custom-field-pair-container";
        contactInfoForm.insertBefore(customFieldPairContainer, contactItemEditBtn);

        const inputsFinal = contactItem.querySelectorAll(".form-input");
        // Изначально полей максимально 5 + 5 = 10, у нас полей x, мы можем добавить (10 - x) * 2. На отправку может уйти
        // максимально ((10 - x) * 2) + x
        if (inputsFinal.length >= ((10 - inputsStart.length) * 2) + inputsStart.length) {
            addInfoBtn.setAttribute("disabled", "true");
        }
        customFieldCounter++;
    });

    contactInfoForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const obj = {};
        obj.id = contactInfoForm["contact-info-id"].value;
        obj.firstName = contactInfoForm["contact-info-first-name"].value;
        obj.lastName = contactInfoForm["contact-info-last-name"].value;
        obj.phone = contactInfoForm["contact-info-phone"].value;
        obj.email = contactInfoForm["contact-info-email"].value;

        const other = {};
        const customFields = contactItem.querySelectorAll(".contact-info-custom-field-container");
        for (const customField of customFields) {
            const name = customField.querySelector("label").innerHTML;
            const value = customField.querySelector(".contact-info-custom-field").value;
            other[name] = value;
        }

        const newFields = contactItem.querySelectorAll(".custom-field-pair-container");
        if (newFields.length > 0) {
            let newFieldCounter = 1;
            for (const newField of newFields) {
                const name = newField.querySelector(`#contact-info-custom-field-name-${newFieldCounter}`).value;
                const value = newField.querySelector(`#contact-info-custom-field-value-${newFieldCounter}`).value;
                if (name.trim().length !== 0) {
                    other[name] = value;
                }
                newFieldCounter++;
            }
        }
        obj.other = other;
        const response = await fetch('http://localhost/contact_book/controller/update_contact.php', {
            method: "POST",
            body: JSON.stringify(obj),
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            }
        });
        const json = await response.json();

        if (json.connected) {
            const conErrMsg = contactInfoForm.querySelector(".connection-error-message");
            if (conErrMsg !== null) {
                // убираем сообщение об ошибке если оно было раньше
                conErrMsg.remove();
            }
            if (json.updated) {
                contactItem.querySelector(".contact-item__name").innerHTML = `${obj.firstName} ${obj.lastName}`;
                if (newFields.length > 0) {
                    let newFieldCounter = 1;
                    for (const newField of newFields) {
                        const name = newField.querySelector(`#contact-info-custom-field-name-${newFieldCounter}`).value;
                        const value = newField.querySelector(`#contact-info-custom-field-value-${newFieldCounter}`).value;
                        if (name.trim().length !== 0) {
                            const newFieldUpdated = document.createElement("div");
                            newFieldUpdated.className = "input-container contact-info-custom-field-container";
                            newFieldUpdated.innerHTML =
                                `<label>${name}</label>
                                <input type="text" class="form-input contact-info-custom-field" 
                                value="${value}" name="contact-info-${name}" maxlength="100">`;
                            contactInfoForm.insertBefore(newFieldUpdated,
                                contactItem.querySelector(".custom-field-pair-container"));
                        }
                        newField.remove();
                        newFieldCounter++;
                    }
                    customFieldCounter = 1;
                }
                const inputsFinal = contactItem.querySelectorAll(".form-input");
                for (const input of inputsFinal) {
                    input.setAttribute("disabled", "true");
                }
                saveAndAddBtnContainer.style.maxHeight = null;
                contactItemEditBtn.removeAttribute("disabled");
                if (inputsFinal.length < 10) {
                    addInfoBtn.removeAttribute("disabled");
                }
                inputsStart = inputsFinal;
            }
            else {
                wrongMessage(contactInfoForm, "Contact is not updated, enter valid data.",
                    "update-error-message");
            }
        }
        else {
            wrongMessage(contactInfoForm, "Connection problem, try again later",
                "connection-error-message");
            console.log(json.exception);
        }
    });

    const buttonsBlock = contactItem.querySelector(".contact-item__buttons-container");
    const deleteContactPopup = contactItem.querySelector(".contact-item__delete-popup");
    const connectionFailurePopup = contactItem.querySelector(
        ".contact-item-delete-connection-failure-popup");

    deleteContactBtn.addEventListener("click", () => {
        buttonsBlock.style.visibility = "hidden";
        deleteContactPopup.style.display = "block";
    });

    deletePopupYesBtn.addEventListener("click", async () => {
        const obj = {};
        obj.id = contactInfoForm["contact-info-id"].value;

        const response = await fetch('http://localhost/contact_book/controller/delete_contact.php', {
            method: "POST",
            body: JSON.stringify(obj),
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            }
        });
        const json = await response.json();
        if (json.connected) {
            if (json.deleted) {
                contactItem.style.display = "none";
            }
        }
        else {
            deleteContactPopup.style.display = "none";
            connectionFailurePopup.style.display = "grid";
            console.log(json.exception);
        }
    });

    deletePopupNoBtn.addEventListener("click", () => {
        buttonsBlock.style.visibility = "visible";
        deleteContactPopup.style.display = "none";
    });

    connectionFailureOkBtn.addEventListener("click", () => {
        buttonsBlock.style.visibility = "visible";
        connectionFailurePopup.style.display = "none";
    });




}


//-------------------------------------------------Регистрация------------------------------------------------------------
// показ формы регистрации при нажатии на кнопку Register
regButton.addEventListener("click", () => {
    if (regFormContainer.style.display === "none") {
        regFormContainer.style.display = "block";
        logInFormContainer.style.display = "none";
    }
    else {
        regFormContainer.style.display = "none";
    }
});

// добавляем валидацию пароля при вводе нового значения в поле "Пароль" формы регистрации
regPassword.addEventListener('change', () => {
    validatePassword(regPassword, regForm, passErrorText, "reg-pass-pattern-mismatch",
        document.querySelector(".reg-password-confirm-container"));
});

// при нажатии кнопки Register формы регистрации отправляем ajax запрос на регистрацию нового пользователя
regForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    // если форма прошла валидацию то отправляем ajax запрос
    if (validateRegForm()) {
        const response = await fetch('http://localhost/contact_book/controller/user_registration.php', {
            method: "POST",
            body: new FormData(regForm)
        });
        // ответ с сервера приходит в формате json, сохраняем ответ в виде объекта в переменную json
        const json = await response.json();

        // если свойство connected имеет значение true
        if (json.connected) {
            const conErrMsg = regForm.querySelector(".connection-error-message");
            if (conErrMsg !== null) {
                // убираем сообщение об ошибке если оно было раньше
                conErrMsg.remove();
            }
            // если данного пользователя не было в базе данных, то он успешно зарегистрирован и свойство
            // registered имеет значение true
            if (json.registered) {
                regFormContainer.style.display = "none";
                regSuccessPopup.classList.add("popup-visible");
            }
                // если пользователь с таким email уже есть в базе данных то свойство registered имеет значение false и
            // выводится соответствующее сообщение
            else {
                regFormContainer.style.display = "none";
                regFailurePopup.classList.add("popup-visible");
            }
        }
            // если не удалось установить подключение в БД то свойство connected имеет значение false и
        // выводится соответствующее сообщение
        else {
            wrongMessage(regForm, "Connection problem, try again later", "connection-error-message")
            console.log(json.exception);
        }
    }
});

// события для закрытия popup
document.querySelector(".registration-success button").addEventListener("click", () => {
    regSuccessPopup.classList.remove("popup-visible");
});
document.querySelector(".registration-failure button").addEventListener("click", () => {
    regFailurePopup.classList.remove("popup-visible");
});


//-----------------------------------------------Аутентификация---------------------------------------------------------

// показ формы аутентификации при нажатии на кнопку Log in
logInButton.addEventListener("click", () => {
    if (logInFormContainer.style.display === "none") {
        logInFormContainer.style.display = "block";
        regFormContainer.style.display = "none";
    }
    else {
        logInFormContainer.style.display = "none";
    }
});

// добавляем валидацию пароля при вводе нового значения в поле "Пароль" формы аутентификации
logInPassword.addEventListener('change', () => {
    validatePassword(logInPassword, logInForm, passErrorText, "login-pass-pattern-mismatch",
        logInFormSubmitBtn);
});

// при нажатии кнопки Log in формы аутентификации отправляем ajax запрос на аутентификацию пользователя
logInForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const response = await fetch('http://localhost/contact_book/controller/user_log_in.php', {
        method: "POST",
        body: new FormData(logInForm)
    });

    // с сервера получаем ответ в виде json содержащий флаги и контакты пользователя (если флаг authenticated равен
    // true)
    const json = await response.json();
    console.log(json);

    // если соединение с БД было успешным флаг connected выставляется в true
    if (json.connected) {
        // если пользователь с данным еmail найден в БД, значит он уже зарегистрирован и флаг registered выставляется в
        // значение true
        if (json.registered) {
            // если введенный пароль совпадает с паролем в БД значит аутентификация пройдена успешно и нужно вернуть
            // контакты пользователя
            if (json.authenticated) {
                logInFormContainer.style.display = "none";
                regButton.style.display = "none";
                logInButton.style.display = "none";

                // создание приветственного сообщения
                const welcomeMsg = document.createElement("p");
                welcomeMsg.className = "welcome-message";
                const login = json.email.substring(0, json.email.search("@"));
                welcomeMsg.innerHTML = `Welcome <b>${login}</b>, manage your contacts.`
                document.querySelector(".authorisation").insertBefore(welcomeMsg, logOutIconContainer);
                logOutIconContainer.style.display = "block";

                // генерация html кода для контактов
                const contacts = json.contacts;
                for (let contactData of contacts) {
                    createContactItem(
                        contactData.id,
                        contactData.firstName,
                        contactData.lastName,
                        contactData.phone,
                        contactData.email,
                        contactData.other
                    );
                }
                addContactBtn.style.display = "block";

                // сохранение id и email аутентифицированного пользователя
                sessionStorage.setItem("id", json.id);
                sessionStorage.setItem("email", json.email);
            }
            // если введенный пароль и пароль в БД не совпали то флаг authenticated выставляется в значение true и
            // генерируется соответствующее сообщение в форме аутентификации
            else {
                wrongMessage(logInForm,
                    "Wrong password entered, enter the password again.",
                    "wrong-password-message",
                    logInFormSubmitBtn);
            }
        }
        // если введенный email не найден в БД, то флаг registered выставляется в значение false и генерируется
        // соответствующее сообщение в форме аутентификации
        else {
            wrongMessage(logInForm,
                " The user is not registered, please register first.",
                "not-registered-message",
                document.querySelector(".login-password-container"));
        }
    }
    // если соединиться с БД не удалось, то флаг connected выставляется в значение false и генерируется
    // соответствующее сообщение в форме аутентификации
    else {
        wrongMessage(regForm, "Connection problem, try again later", "connection-error-message")
        console.log(json.exception);
    }
});


//---------------------------------------------Добавление контакта------------------------------------------------------

// при нажатии кнопки Add Contact отображается форма для добавления контакта
addContactBtn.addEventListener("click", () => {
    addContactFormContainer.style.display === "none" ?
        addContactFormContainer.style.display = "block" :
        addContactFormContainer.style.display = "none";
});

// при нажатии + в форме добавления контакта в форму добавляются поля для сохранения пары ключ значение
addFieldBtn.addEventListener("click", () => {
    let fieldsCount = document.getElementsByClassName("custom-field-pair-container").length;
     if (fieldsCount < 5) {
         const customFieldPairContainer = document.createElement("div");
         customFieldPairContainer.innerHTML =
             "<div class=\"input-container contact-custom-field-name-container\">\n" +
                "<label for=\"contact-custom-field-name\">Enter custom field name</label>\n" +
                `<input type=\"text\" class=\"form-input\" id=\"contact-custom-field-name-${fieldsCount + 1}\" name=\"contact-custom-field-name-${fieldsCount + 1}\" maxlength=\"100\">\n` +
             "</div>\n" +
             "<div class=\"input-container contact-custom-field-value-container\">\n" +
                "<label for=\"contact-custom-field-value\">Enter custom field value</label>\n" +
                `<input type=\"text\" class=\"form-input\" id=\"contact-custom-field-value-${fieldsCount + 1}\" name=\"contact-custom-field-value-${fieldsCount + 1}\" maxlength=\"100\">\n` +
             "</div>";
         customFieldPairContainer.className = "custom-field-pair-container";
         addContactForm.insertBefore(customFieldPairContainer, addFieldBtn);
         fieldsCount++;
         if (fieldsCount === 5) {
             addFieldBtn.disabled = true;
         }
         deleteFieldBtn.disabled = false;
     }
});

// при нажатии + в форме добавления контакта в форму добавляются поля для сохранения пары ключ значение
deleteFieldBtn.addEventListener("click", () => {
    let fieldsCount = document.getElementsByClassName("custom-field-pair-container").length;
    if (fieldsCount > 0) {
        document.querySelector(".custom-field-pair-container:last-of-type").remove();
        if (fieldsCount - 1 === 0) {
            deleteFieldBtn.disabled = true;
        }
        addFieldBtn.disabled = false;
    }
});

addContactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    addContactForm.querySelector("#contact-user-id-hidden").value = sessionStorage.getItem("id");

    const response = await fetch('http://localhost/contact_book/controller/add_contact.php', {
        method: "POST",
        body: new FormData(addContactForm)
    });
    const json = await response.json();
    console.log(json);

    if (json.connected) {
        // если новый контакт добавлен в БД флаг added выставляется в значение true
        if (json.added) {
            const id = addContactForm.querySelector("#contact-user-id-hidden").value;
            const firstName = addContactForm.querySelector("#contact-first-name").value;
            const lastName = addContactForm.querySelector("#contact-last-name").value;
            const phone = addContactForm.querySelector("#contact-phone").value;
            const email = addContactForm.querySelector("#contact-email").value;
            const other = JSON.stringify(json.other);
            createContactItem(id, firstName, lastName, phone, email, other);
            addContactFormContainer.style.display = "none";

            const inputs = addContactForm.querySelectorAll(".form-input");
            for (const input of inputs) {
                input.value = null;
            }
        }
        else {
            wrongMessage(addContactForm, "Contact is not added, enter valid field values",
                "add-contact-error-message");
        }
    }
    // если соединиться с БД не удалось, то флаг connected выставляется в значение false и генерируется
    // соответствующее сообщение в форме добавления контакта
    else {
        wrongMessage(addContactForm, "Connection problem, try again later", "connection-error-message");
        console.log(json.exception);
    }
});