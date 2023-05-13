const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


function Validator(options) {
    var formElemet = $(options.form);
    if (formElemet) {
        options.rules.forEach((rule) => {
            var inputElement = formElemet.querySelector(rule.selector);
            var inputMsg = inputElement.parentElement.querySelector('.form-msg');
            if (inputElement) {
                function validate(element, isTyping) {
                    var errorMsg = rule.test(element, isTyping);
                    if(errorMsg) {
                        inputElement.parentElement.classList.add('invalid');
                        inputMsg.textContent = `Fill me please`;
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

Validator.isRequired = (selector) => {
    return {
        selector: selector,
        test: (element, isTyping) => {
            return (element.value.trim().length <= 0 && !isTyping) ? `Fill me please` : undefined;
        }
    };
}

Validator.isEmail = (selector) => {
    return {
        selector: selector,
        test: () => {
            
        }
    };
}