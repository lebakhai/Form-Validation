const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


function Validator(options) {
    var formElemet = $(options.form);
    if (formElemet) {
        options.rules.forEach((rule) => {
            var inputElementsSelector = rule.selector;
            if (inputElementsSelector) {
                inputElementsSelector.forEach((inputElementName) => {
                    var inputElement = formElemet.querySelector(inputElementName);
                    var inputMsg = inputElement.parentElement.querySelector('.form-msg');
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
                })

            }
        })
    };
}

Validator.isRequired = (selector, min = 1) => {
    return {
        selector: selector,
        test: (element, isTyping) => {
            return (element.value.trim().length < min && !isTyping) ? `Please enter at least ${min} charaters` : undefined;
        }
    };
}

Validator.isEmail = (selector, min = 1) => {
    return {
        selector: selector,
        test: (element, isTyping) => {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return (regex.test(element.value) && !(element.value.trim().length < min)) ? undefined : (!isTyping ? `Email only` : undefined);
        }
    };
}

Validator.isConfirm = (selector, getConfirmValue) => {
    return {
        selector: selector,
        test: (element, isTyping) => {
            return (element.value === getConfirmValue()) ? undefined : (!isTyping ? `Password does not match` : undefined);
        }
    };
}