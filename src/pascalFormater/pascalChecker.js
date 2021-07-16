import { formatting } from './pascalFormater'

function checkFormating(code, errorShowing) {
	const lineEndingSpacesRe = new RegExp(`\\s+$`, 'g');
	const allCommentsRe = new RegExp(`\\{[\\s\\S]*?\\}`, 'g');
	const maxEmptyLines = 1;
	let checkResult = true;
	let error = {
		line: '',
		explanation: '',
		generateMsg: function(errorShowing) {
			let msg = '';
			if (errorShowing) {
				if (errorShowing.line) {
					msg = msg + this.line;
				}
				if (errorShowing.expected) {
					msg = msg + this.explanation;
				}
			}
			return msg;
		}
	};

	code = code.replace(allCommentsRe, ''); //delete all comments
	let codeLines = code.split('\n').map(line => line.replace(lineEndingSpacesRe, '')); // split lines and delete spaces at line-end
	let resultFormating = formatting(code);
	let formatingCode = resultFormating.code;
	let formatingCodeLines = formatingCode.split('\n');

	checkResult = checkResult && !resultFormating.sintaxError;

	if (!checkResult) {
		error.line = `on line: 0:\n`;
		error.explanation = `Sintax error`;
	}


	console.log(codeLines);
	console.log(formatingCode);
	for(let i = 0, j = 0, emptyLines = 0; i < codeLines.length && checkResult; i++) {
		if (codeLines[i] === "") { // ignore empty line or generate error
			emptyLines++;
			if (emptyLines > maxEmptyLines) {
				checkResult = false;
				error.line = `on line: ${(i+1)}:\n`;
				error.explanation =	`Too many empty lines`;
			}
			continue;
		} else {
			emptyLines = 0;
		}
		// compare code line and formating code line
		checkResult = checkResult && codeLines[i] === formatingCodeLines[j];
		if (!checkResult) {
			error.line = `on line: ${(i+1)}:\n'${codeLines[i]}',\n`;
			error.explanation = `'${formatingCodeLines[j]}' expected`;
		}
		j++;
	}
	return {
		result: checkResult,
		error: error.generateMsg(errorShowing),
	};
}

export { checkFormating };
