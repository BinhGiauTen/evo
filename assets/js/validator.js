function Validator(options) {

    function getParent(element,selector){
        while(element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement;
            }
            element=element.parentElement;
        }
    }
    var selectorRules={};
    //Hàm thực hiện validate
    function validate(inputElement, rule) {

        
        
        var errorMessage;
        var errorElement = getParent(inputElement,options.formGroupSelector).querySelector(options.errorSelector);

        // Lấy ra các rules của selector
        var rules= selectorRules[rule.selector];
        
        //Lặp qua từng rules và kiểm tra
        // Nếu có lỗi thì dừng việc kiểm tra
        for(var i=0;i<rules.length; ++i){
            switch(inputElement.type){
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i](
                        formElement.querySelector(rule.selector + ':checked')
                    );
                    break;
                default:
                    errorMessage = rules[i](inputElement.value);
            }
            
            if(errorMessage)
                break;
        }
        if (errorMessage) {
            errorElement.innerText = errorMessage;
            getParent(inputElement,options.formGroupSelector).classList.add('invalid');
        } else {
            errorElement.innerText = '';
            getParent(inputElement,options.formGroupSelector).classList.remove('invalid');
        }
        return !errorMessage;
    }
    // Lấy element của form cần validate
    var formElement = document.querySelector(options.form);
    if (formElement) {
        formElement.onsubmit=function(e){
            e.preventDefault();

            var isFormValid=true;

            // Lặp qua từng rules và validate
            options.rules.forEach(function (rule){
                var inputElement = formElement.querySelector(rule.selector);

                var isValid = validate(inputElement, rule);
                if(!isValid){
                    isFormValid=false;
                }
            });

           

            if(isFormValid){

                // Trường hợp submit với Javascript
                if(options.onSubmit==='function'){

                    var enableInputs=formElement.querySelectorAll('[name]:not([disabled])');

                    var formValues=Array.from(enableInputs).reduce(function(values,input){
                        
                        switch(input.type){
                            case 'radio':
                                values[input.name]=formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                                break;
                            case 'checkbox':
                                if(!input.matches(':checked')) return values;
                                if(!Array.isArray(values[input.name])){
                                    values[input.name]=[];
                                }
                                values[input.name].push(input.value);
                                break;
                            case 'file':
                                values[input.name]=input.files;
                                break;
                            default:
                                values[input.name]=input.value;
                        }
                        return values;
                    },{});
                    options.onSubmit(formValues);
                }
                // Trường hợp submit với hành vi mặc định
                else{
                    formElement.submit();
                }
            }
        }
        // Lặp qua mỗi rule và xử lý (Lắng nghe sự kiện...)
        options.rules.forEach(function (rule) {

            // Lưu lại các rule cho mỗi input
            if(Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test);
            }else{
                selectorRules[rule.selector]=[rule.test];
            }

            var inputElements = formElement.querySelectorAll(rule.selector);

            Array.from(inputElements).forEach(function(inputElement){
                // Xử lý trường hợp blur khỏi input
                inputElement.onblur = function () {
                    validate(inputElement, rule);
                }

                // Xử lý mỗi khi người dùng nhập vào input
                inputElement.oninput=function(){
                    var errorElement = getParent(inputElement,options.formGroupSelector).querySelector(options.errorSelector);
                    errorElement.innerText = '';
                    getParent(inputElement,options.formGroupSelector).classList.remove('invalid');
                }
            });
        });
    }
}
// Định nghĩa rules
// Có lỗi trả về lỗi không có lỗi trả về undefined
Validator.isRequired = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            return value ? undefined : 'Vui lòng nhập trường này'
        }
    }
}
Validator.isTen = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            // Biểu thức chính quy kiểm tra tên.
            var regex= /^([A-Z]+[A-Za-z]*)*(\s+[A-Z]+[A-Za-z]*)*$/;
            return regex.test(value) ? undefined : "Trường này phải có ký tự đầu viết hoa";
        }
    }
}
Validator.isEmail = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            // Biểu thức chính quy kiểm tra email.
            var regex= /^\w+([\.-]?\w+)*@gmail\.com$/;
            return regex.test(value) ? undefined : "Trường này phải là email";
        }
    }
}

Validator.isSdt = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            // Biểu thức chính quy kiểm tra sdt.
            var regex= /^0{1}[2-9]{1}\d{8}$/;
            return regex.test(value) ? undefined : "Trường này phải là sdt";
        }
    }
}

Validator.isMatKhau = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            var regex=/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{6}$/;
            return regex.test(value) ? undefined : "Phải là mật khẩu mạnh";
        }
    }
}

Validator.minLength = function (selector,min) {
    return {
        selector: selector,
        test: function (value) {
            return value.length>=min ? undefined : `Vui lòng nhập tối thiểu ${min} kí tự`;
        }
    }
}
Validator.isConfirmed=function(selector,getConfirmValue,message){
    return{
        selector:selector,
        test: function(value){
            return value===getConfirmValue() ? undefined : message || 'Giá trị nhập vào không chính xác';
        }
    }
}