console.clear();

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
var outputData = {};

function Validator(formSelector) {  
    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    function handleValidate(e) {
        var rules = formRules[e.target.name];
        var errorMsg;

        for (rule of rules) {
            errorMsg = rule(e.target);
            if (errorMsg) {
                break;
            }
        }

        rules.find((rule) => {
            return errorMsg
        });

        var formGroup = getParent(e.target, ".form-group");
        if(errorMsg) {
            formGroup.classList.add('invalid')
            
            if(!formGroup) return;
            var formMsg = formGroup.querySelector('.form-msg');
            if (formMsg) {
                formMsg.textContent = errorMsg;
            }
        }

        return !errorMsg;

    }

    var formRules = {};
    var validatorRules = {
        required: (value) => {
            return value.value ? undefined : `Please enter this`
        },
        email: (value) => {
            const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return regex.test(value.value) ? undefined : `Please enter valid email`
        },
        min: (min) => {
            return function (value) {
                return value.value.length >= min ? undefined : `Please type least at ${min} characters`
            }
        },
        password: (minMax) => {
            minMax = minMax.split(',')
            var min = minMax[0];
            var max = minMax[1];

            const regex = /^(?=.*[a-zA-Z])(?=.*\d).*$/;
            return function(value) {
                if (!value.value || value.value.length <= 0) {
                    return `Please enter password`
                } else if (value.value.length < min) {
                    return `Password must be at least ${min} characters`
                } else if (value.value.length > max) {
                    return `Password must be at most ${max} characters`
                } else if(!/[a-zA-Z]/.test(value.value)) {
                    return `Password must be ar least 1 letter`
                } else if (!(/[0-9]/.test(value.value))) {
                    return `Password must be ar least 1 number`
                } else if(regex.test(value.value)) {
                    return undefined;
                } else  {
                    return `Please check your password again or contact support`
                }
            }
        },
        confirm: (compareValue) => {
            var compareValue = $(compareValue);
            return function (value) {
                return compareValue.value === value.value ? undefined : `Not matches`
            }
        }
    }
    var formElement = $(formSelector);
    var inputs = formElement.querySelectorAll('[name][rules]');
    
    if (formElement) {
        inputs.forEach((input, index) => {
            var rules = input.getAttribute('rules').split('|');
            rules.forEach((rule, index) => {
                var ruleInfo;
                var ruleIsHasValue = rule.includes(':');

                if(ruleIsHasValue) {
                    ruleInfo = rule.split(':');
                    rule = ruleInfo[0]
                };
                
                var ruleFunc = validatorRules[rule];

                if (ruleIsHasValue) {
                    ruleFunc = ruleFunc(ruleInfo[1]);  
                }

                if (Array.isArray(formRules[input.name])) {
                    formRules[input.name].push(ruleFunc)
                } else {
                    formRules[input.name] = [ruleFunc];
                }

            })
            input.onblur = handleValidate;
            input.oninput = handleClear;

            function handleClear(e) {
                var formGroup = getParent(e.target, ".form-group");
                if (formGroup.classList.contains('invalid')) {
                    formGroup.classList.remove('invalid');
                    var formMsg = formGroup.querySelector('.form-msg');

                    if (formMsg) {
                        formMsg.textContent = ''
                    }
                }
            }
            
        })
    }

    function getOutputData() {
        inputs.forEach((input, index) => {
            outputData[input.name] = input.value;
        })
        return outputData;
    }

    formElement.onsubmit = (e) => {
        e.preventDefault();
        var inputs = formElement.querySelectorAll('[name][rules]');
        var isValid = true;

        inputs.forEach((input, index) => {
            if (!handleValidate({target: input,})) {
                isValid = false;
            }
        })

        if (isValid) {
            if (this.onSubmit) {
                this.onSubmit(getOutputData());
            } else {
                formElement.submit();
            }
        }
    }

}