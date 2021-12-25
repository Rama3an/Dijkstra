let priorityDict = {
    "(": 0,
    ")": 1,
    "+": 2,
    "-": 2,
    "*": 3,
    "/": 3,
    "^": 4
}

let input = process.argv.slice(2);
let lastElem = input[0][input[0].length - 1];
if (lastElem !== "(" && lastElem !== ")" && lastElem in priorityDict) {
    console.log(postfixToInfix(input));
} else {
    console.log(infixToPostFix(input));
}


function postfixToInfix(input) {
    input = input.toString().split("");
    let stack = [];
    for (let i = 0; i < input.length; i++) {
        let currentElement = input[i];
        if (!(currentElement in priorityDict)) {
            stack.push({name: currentElement, priority: 0});
            continue;
        }
        let rightOperand = stack.pop();
        let leftOperand = stack.pop();
        rightOperand = getBracesIfNeeded(rightOperand, currentElement);
        leftOperand = getBracesIfNeeded(leftOperand, currentElement);

        stack.push({
            name: leftOperand.name + currentElement + rightOperand.name,
            priority: priorityDict[currentElement]
        });
    }
    return stack.pop().name;

    function getBracesIfNeeded(operand, currentElement) {
        let output = operand;
        let bracesForOperand = checkIfBracesNeeded(output, currentElement);
        return bracesForOperand
            ? {name: "(" + output.name + ")", priority: currentElement.priority}
            : {name: output.name, priority: currentElement.priority};

        function checkIfBracesNeeded(operand, currentElement) {
            return operand.priority !== 0 && operand.priority < priorityDict[currentElement];
        }
    }

}

function infixToPostFix(input) {
    input=input.toString().split("");
    let stack = [];
    let output = "";
    let i = 0;
    let currentElem = input[i];
    while (currentElem !== undefined) {
        currentElem = input[i];
        if (priorityDict[currentElem] !== undefined) {
            if (currentElem === ")") {
                let currentOperation = stack.pop();
                while (currentOperation !== "(") {
                    output += currentOperation;
                    currentOperation = stack.pop();
                }
                i++;
                continue;
            }
            if (currentElem === "(") {
                stack.push("(");
                i++;
                continue;
            }
            if (stack.length === 0) {
                stack.push(currentElem);
                i++;
                continue;
            } else if (stack.length !== 0) {
                if (priorityDict[currentElem] > priorityDict[stack[stack.length - 1]]) {
                    stack.push(currentElem);
                    i++;
                    continue;
                } else {
                    while (stack.length > 0 && priorityDict[stack[stack.length - 1]] >= priorityDict[currentElem]) {
                        let currentOperation = stack.pop();
                        output += currentOperation;
                    }
                    stack.push(currentElem);
                    i++;
                    continue;
                }
            }
            i++
        } else if (currentElem !== undefined) {
            output += currentElem;
            i++;
        }
    }
    while (stack.length !== 0) {
        let pop = stack.pop();
        output += pop !== "(" && pop !== ")" ? pop : "";
    }

    let result = 0;

    function getOperands(Stack) {
        let TwoOperands = [];
        while (TwoOperands.length != 2)
            TwoOperands.push(Stack.pop());
        return TwoOperands;
    }

    let StackOperandResult = [];
    for (let i = 0; i < output.length; i++) {
        if (output[i] == parseInt(output[i]))
            StackOperandResult.push(parseInt(output[i]));
        else {
            let Operands = getOperands(StackOperandResult);
            switch (output[i]) {
                case '+':
                    result = (Operands[1]) + (Operands[0]);
                    StackOperandResult.push(result);
                    continue;
                case '-':
                    result = (Operands[1]) - (Operands[0]);
                    StackOperandResult.push(result);
                    continue;
                case '*':
                    result = (Operands[1]) * (Operands[0]);
                    StackOperandResult.push(result);
                    continue;
                case '/':
                    result = (Operands[1]) / (Operands[0]);
                    StackOperandResult.push(result);
                    continue;
                case '^':
                    result = Math.pow((Operands[1]), (Operands[0]));
                    StackOperandResult.push(result);
            }
        }
    }

    return `${output} = ${result}`;
}