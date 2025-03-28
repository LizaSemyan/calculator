// файл script.js
window.onload = function(){ 

    let a = ''
    let b = ''
    let expressionResult = ''
    let selectedOperation = null
    
    outputElement = document.getElementById("result")
    
    digitButtons = document.querySelectorAll('[id ^= "btn_digit_"]')

    function updateOutput(value) {
        if (value.length > 14) {
            const [integerPart, decimalPart] = value.split('.')
            if (decimalPart && (decimalPart.length > (14 - integerPart.length - 1)) && !value.includes('e') && Math.abs(value) >= 1e-13) { 
                value = parseFloat(value).toFixed(14 - integerPart.length)
            } else {
                value = parseFloat(value).toPrecision(9)
            }
        }
        outputElement.innerHTML = value
    }
    
    function onDigitButtonClicked(digit) {
        if (!selectedOperation) {
            if (a.length == 15 && a.includes('.')) {
                return
            }
            if ((digit != '.') || (digit == '.' && !a.includes(digit) && a.length > 0)) { 
                if (a === '0' && digit != '.') {
                    a = digit; 
                } else {
                    a += digit;
                }
                updateOutput(a)
            }
            else if (digit == '.' && a.length == 0) {
                a += "0."
                updateOutput(a)
            }
        } else {
            if (b.length == 15 && b.includes('.')) {
                return
            }
            if ((digit != '.') || (digit == '.' && !b.includes(digit))) { 
                if (b === '0' && digit != '.') {
                    b = digit; 
                } else {
                    b += digit;
                }
                updateOutput(b)      
            }
        }
    }
    
    digitButtons.forEach(button => {
        button.onclick = function() {
            const digitValue = button.innerHTML
            onDigitButtonClicked(digitValue)
        }
    });
    
    document.getElementById("btn_op_mult").onclick = function() { 
        if (a === '') return
        selectedOperation = 'x'
    }
    document.getElementById("btn_op_plus").onclick = function() { 
        if (a === '') return
        selectedOperation = '+'
    }
    document.getElementById("btn_op_minus").onclick = function() { 
        if (a === '') return
        selectedOperation = '-'
    }
    document.getElementById("btn_op_div").onclick = function() { 
        if (a === '') return
        selectedOperation = '/'
    }

    document.getElementById("btn_op_percent").onclick = function() { 
        if (a === '') return
        if (b === '') {
            const decimalPlaces = (a.split('.')[1] || '').length
            expressionResult = (+a) / 100
            a = expressionResult.toFixed(decimalPlaces + 2).toString()
            updateOutput(a)
        } else {
            expressionResult = (+a) * (+b) / 100
            a = expressionResult.toString()
            b = ''
            selectedOperation = null
            updateOutput(a)
        }
    }

    document.getElementById("btn_op_backspace").onclick = function() { 
        if (a === '') 
            return
        if (selectedOperation == null || selectedOperation == '') {
            if (a.includes('e'))
                return
            if (a.length == 1) {
                a = ''
                updateOutput(0)
            } else {
                a = a.slice(0, -1)
                if (a.endsWith('.')) {
                    a = a.slice(0, -1)
                }
                updateOutput(a)
            }   
        } else {
            if (b.includes('e'))
                return
            if (b.length == 1) {
                b = ''
                updateOutput(0)
            } else {
                b = b.slice(0, -1)
                if (b.endsWith('.')) {
                    b = b.slice(0, -1)
                }
                updateOutput(b)
            }   
        }
    }
    
    document.getElementById("btn_op_clear").onclick = function() { 
        a = ''
        b = ''
        selectedOperation = ''
        expressionResult = ''
        updateOutput(0)
    }
    
    document.getElementById("btn_op_equal").onclick = function() { 
        if (a === '' || b === '' || !selectedOperation)
            return
            
        switch(selectedOperation) { 
            case 'x':
                expressionResult = (+a) * (+b)
                break;
            case '+':
                expressionResult = (+a) + (+b)
                break;
            case '-':
                expressionResult = (+a) - (+b)
                break;
            case '/':
                if (+b === 0) {
                    outputElement.innerHTML = 'Error: Division by 0'
                    a = ''
                    b = ''
                    selectedOperation = null
                    return
                }
                expressionResult = (+(+a) / (+b))
                break;
            case '%':
                expressionResult = (+a) % (+b)
                break;
        }
        a = parseFloat(expressionResult.toFixed(14)).toString()
        console.log(a)
        b = ''
        selectedOperation = null
        
        updateOutput(a)
    }
};