const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


function Validator(options) {
    var formElemet = $(options.form);
    if (formElemet) {
        options.rules.forEach((rule) => {
            var inputElement = formElemet.querySelector(rule.selector);
            var inputMsg = inputElement.parentNode.querySelector('.form-msg');
            if (inputElement) {
                function errorHandler(element, isTyping) {
                    var errorMsg = rule.test(element, isTyping);
                    if(errorMsg) {
                        inputElement.parentNode.classList.add('invalid');
                        inputMsg.textContent = `Fill me please`;
                    } else {
                        inputElement.parentNode.classList.remove('invalid');
                    }
                }
                
                inputElement.onblur = (e) => {
                    errorHandler(inputElement);
                }

                inputElement.oninput = (e) => {
                    errorHandler(inputElement, true);
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