const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


function Validator(options) {
    var formElemet = $(options.form);

    formElemet.onsubmit = (e) => {
        e.preventDefault()

        var isFormValid = true;
        
        options.rules.forEach((rule) => {
            var inputElement = formElemet.querySelector(rule.selector);
            var inputMsg = inputElement.parentElement.querySelector('.form-msg');
            if (inputElement) {
                function validate(element, isTyping) {
                    var errorMsg = rule.test(element, isTyping);
                    if (errorMsg) {
                        inputElement.parentElement.classList.add('invalid');
                        inputMsg.textContent = errorMsg;
                    } else {
                        inputElement.parentElement.classList.remove('invalid');
                        inputMsg.textContent = ``;
                    }
                }
                validate(inputElement);

                var isValid = validate(inputElement);
                if (!isValid) {
                    isFormValid=false
                }
                
            }
        })
        
    }

    if (formElemet) {
        options.rules.forEach((rule) => {
            var inputElement = formElemet.querySelector(rule.selector);
            var inputMsg = inputElement.parentElement.querySelector('.form-msg');
            if (inputElement) {
                function validate(element, isTyping) {
                    var errorMsg = rule.test(element, isTyping);
                    if (errorMsg) {
                        inputElement.parentElement.classList.add('invalid');
                        inputMsg.textContent = errorMsg;
                    } else {
                        inputElement.parentElement.classList.remove('invalid');
                        inputMsg.textContent = ``;
                    }
                }

                inputElement.onblur = (e) => {
                    validate(inputElement);
                }

                inputElement.oninput = (e) => {
                    validate(inputElement, true);
                }
            }
        })
    };
}

Validator.isRequired = (selector, min = 1, message = `Please enter at least ${min} characters`) => {
    return {
        selector: selector,
        test: (element, isTyping) => {
            return (element.value.trim().length < min && !isTyping) ? message : undefined;
        }
    };
}

Validator.isEmail = (selector, min = 1,  message = `Email only`) => {
    return {
        selector: selector,
        test: (element, isTyping) => {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return (regex.test(element.value) && !(element.value.trim().length < min)) ? undefined : (!isTyping ? message : undefined);
        }
    };
}

Validator.isConfirm = (selector, getConfirmValue, message = `Text does not match`) => {
    return {
        selector: selector,
        test: (element, isTyping) => {
            return (element.value === getConfirmValue()) ? undefined : (!isTyping ? message : undefined);
        }
    };
}