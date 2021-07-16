import {languages, keywords} from './rules.js';

const onlyUpperTokenTypes = ['keyword', 'typeword', 'operacion'];
const spacelessPunctuations = ['(', ')', '[', ']', '.'];
const closingBrackets = [')', ']'];
const openingBrackets = ['(', '['];
const eoln = '\n';
const space = ' ';
const tabSimbol = ' ';
const tabSize = 2;

function tokenize(code) {
	let grammar = languages.pascal;

	let tokenList = new LinkedList();

	addAfter(tokenList, tokenList.head, code);
	matchGrammar(code, tokenList, grammar, tokenList.head, 0);
	tokenizeIdentifiers(tokenList);

	return tokenList;
}

function formatting(code) {
	const mainCtx = {
		name: 'main',
		ending: null,
		addTab: false,
		ignorEolnUntilEnd: false,
		isOpening: true
	};
	let list = tokenize(code);
	let stack = [mainCtx];
	let tabsStack = [0];
	let currentTabAmount = tabsStack[0];


	// add ';' before ends and implementation
	let node = list.head.next;

	// ПЕРЕДЕЛАТЬ НА prevNonSpacesToken
	while (node !== list.tail) {
		let currContent = node.value.content.toLowerCase();
		let prevContent = node.prev.value? node.prev.value.content.toLowerCase() : null;
		if ((currContent === 'end' || currContent === 'implementation') && prevContent !== ';' && prevContent !== eoln) {
			node = addTokenAfter(list, node.prev, 'punctuation', ';');
			continue;
		}
		node = node.next;
	}

	// basic blocking and formatting
	node = list.head.next;

	while (node !== list.tail) {
		let stackHead = stack[stack.length - 1];


		if (stackHead === mainCtx && node.value.content.toLowerCase() === 'end') {
			stack.push(getKeywordByContext(node, stackHead));
		}

		// searching closing blocks
		if(stackHead !== mainCtx && stackHead.ending) {
			let ending = stackHead.ending.find(el => el.key === node.value.content.toLowerCase());
			if (ending) {
				let isGreedyEnd = ending.isGreedy;

				if (stackHead.addTab)
				{
					tabsStack.pop();
					currentTabAmount = tabsStack[tabsStack.length - 1];
					if (node.prev.value.type === 'tab') {
						node.prev.value.content = tabSimbol.repeat(currentTabAmount);
					}
				}
				if (stackHead.isOpening && !isIgnorEoln())
				{
					createNewLine(list, node.prev);
				}
				// for disable floating offsets
				if (stackHead.isFloatingTabSize) {
					tabsStack.pop();
					currentTabAmount = tabsStack[tabsStack.length - 1];
				}

				stack.pop();


				console.log(stack.length, 'closing', stackHead.name, currentTabAmount, node.value.content);

				stackHead = stack[stack.length-1];
				if (!isGreedyEnd){
					continue;
				}
			}
		}

		//remove extra tabs
		if (node.value && node.value.type === 'tab' && node.value.content !== tabSimbol.repeat(currentTabAmount) ) {
			node.value.content = tabSimbol.repeat(currentTabAmount);
		}

		// searching opening blocks
		let keyword = getKeywordByContext(node, stackHead);
		if (keyword) {
			if (keyword.eolnBefore && !isIgnorEoln()) {
				createNewLine(list, node.prev);
			}
			if (keyword.isOpening) {
				stack.push(keyword);

				if (keyword.addTab) {
					// debugger;
					if (keyword.isFloatingTabSize) {
						currentTabAmount = getCurrentOffset(node);
						tabsStack.push(currentTabAmount);
					}

					currentTabAmount = currentTabAmount + tabSize;
					tabsStack.push(currentTabAmount);
					if (!isIgnorEoln()) {
						createNewLine(list, node);
					}
				}
				stackHead = stack[stack.length - 1];
				console.log(stack.length, 'opening', keyword.name, currentTabAmount, node.value.content);
			}
			if (keyword.spaceBefore && node.prev.value && node.prev.value.type !== 'spaces') {
				addTokenAfter(list, node.prev, 'spaces', space);
			}
			if (keyword.spaceAfter && node.next.value && node.next.value.type !== 'spaces') {
				addTokenAfter(list, node, 'spaces', space);
			}
		}

		if (node.value) {
			// add eoln after ';'
			if (node.value.content === ';' && node.next.value && node.next.value.type !== 'comment' && !stackHead.ignorEolnUntilEnd) {
				createNewLine(list, node);
				node = node.next;
				continue;
			}

			// add eoln after comment and ' ' before
			if (node.value.type === 'comment') {
				createNewLine(list, node);
				if (node.prev.value && node.prev.value.type !== 'spaces' && node.prev.value.type !== 'tab') {
					addTokenAfter(list, node.prev, 'spaces', space);
				}
			}
			//add spaces before and after operators/operacions
			if (node.value.type === 'operator' || node.value.type === 'operacion') {
				if(node.next.value && node.next.value.type !== 'spaces' && !closingBrackets.includes(node.next.value.content)) {
					addTokenAfter(list, node, 'spaces', space);
				}
				if(node.prev.value && node.prev.value.type !== 'spaces' && !openingBrackets.includes(node.prev.value.content)) {
					addTokenAfter(list, node.prev, 'spaces', space);
				}
			}

			if (node.value.type === 'punctuation' && !spacelessPunctuations.includes(node.value.content)) {
				if(node.next.value && node.next.value.type !== 'spaces' && node.next.value.type !== 'tab') {
					addTokenAfter(list, node, 'spaces', space);
				}
			}

			if (node.value.type === 'keyword') {
				if (node.prev.value && (node.prev.value.type !== 'spaces' && node.prev.value.type !== 'tab' && node.prev.value.type !== 'punctuation')) {
					addTokenAfter(list, node.prev, 'spaces', space);
				}
				if (node.next.value && (node.next.value.type !== 'spaces' && node.next.value.type !== 'punctuation')) {
					addTokenAfter(list, node, 'spaces', space);
				}
			}
		}
		node = node.next;
	}

	// remove ; before ends
	node = list.head.next;

	while (node !== list.tail) {
		if (node.value && node.value.content === ';') {
			let nextNonSpacesNode = nextNonSpacesToken(list, node);

			if (nextNonSpacesNode && nextNonSpacesNode.value && nextNonSpacesNode.value.content.toLowerCase() === 'end') {
				node.prev.next = node.next.next;
				node.next.next.prev = node.prev;

				node = prevNonSpacesToken(list, node); // for deleting of consecutive ";"
				continue;
			}
		}
		node = node.next;
	}

	function createNewLine(list, node) {
		if (node.value && node.next.value && node.prev.value && node.value.type !== 'comment') {
			if (node.next.value.type === 'comment' ||
				(node.value.content !== ';' && (node.next.value.content === ';' || node.next.value.content === '.'))) {
				node = node.next;
			}
			// this is for the comment after "end." stayed on the same line
			if (node.next.value && (node.value.content === '.' || node.value.content === ';') && node.next.value.type === 'comment' ) {
				node = node.next;
			}
		}
		addTokenAfter(list, node, 'tab', tabSimbol.repeat(currentTabAmount));
		addTokenAfter(list, node, 'spaces', eoln);
	}

	function getKeywordByContext(node, context) {
		let keyword = null;
		if (node.value && keywords[node.value.content.toLowerCase()]) {
			let keywordName = node.value.content.toLowerCase();
			keyword = keywords[keywordName].default
			if (keywords[keywordName][context.name]) {
				keyword = keywords[keywordName][context.name];
			}
		}
		return keyword;
	}

	function getCurrentOffset(node) {
		let offset = 0;
		let nodeLength = node.value.content.length;
		while (node !== list.head && node.value.content !== eoln) {
			offset = offset + node.value.content.length;

			node = node.prev;
		}
		console.log(offset - nodeLength);
		return offset - nodeLength;
	}

	function isIgnorEoln() {
		return stack.some(el => el.ignorEolnUntilEnd);
	}

	console.log(stack);
	toUpperTokens(list);

	return {
		code: toString(list),
		sintaxError: stack.length > 1
	};
}

function addTokenAfter(list, node, valueType, value) {
	let newNode = new Token(valueType, value, undefined, value);

	return addAfter(list, node, newNode);
}

function prevNonSpacesToken(list, node) {
	let newNode = node.prev;

	while (newNode !== list.head && (newNode.value.type === 'spaces' || newNode.value.type === 'tab' || newNode.value.type === 'comment')) {
		newNode = newNode.prev;
	}
	return newNode;
}

function nextNonSpacesToken(list, node) {
	let newNode = node.next;

	while (newNode !== list.tail && (newNode.value.type === 'spaces' || newNode.value.type === 'tab' || newNode.value.type === 'comment')) {
		newNode = newNode.next;
	}
	return newNode;
}

function toUpperTokens(list) {
	let node = list.head.next;
	while (node !== list.tail) {
		if (onlyUpperTokenTypes.includes(node.value.type)) {
			node.value.content = node.value.content.toUpperCase();
		}
		node = node.next;
	}
}

function LinkedList() {
	let head = { value: null, prev: null, next: null };
	let tail = { value: null, prev: head, next: null };
	head.next = tail;

	this.head = head;
	this.tail = tail;
	this.length = 0;
}

function addAfter(list, node, value) {
	// assumes that node != list.tail && values.length >= 0
	let next = node.next;
	let newNode = { value: value, prev: node, next: next };

	node.next = newNode;
	next.prev = newNode;
	list.length++;

	return newNode;
}

function tokenizeIdentifiers(list) {
	let node = list.head.next;
	while (node !== list.tail) {
		if (typeof(node.value) === 'string'){
			node.value = node.value.trim().replace(/\s+/g, ' ');
			if (node.value === '') {
				node.prev.next = node.next;
				node.next.prev = node.prev;
			} else {
				if (node.value[0] !== '^') {
					node.value = node.value[0].toUpperCase() + node.value.slice(1);
				} else {   //if it's a pointer
					if (node.value[1]) {
						node.value = node.value[0] + node.value[1].toUpperCase() + node.value.slice(2);
					}
				}
				node.value = new Token('identifier', node.value, undefined, node.value);
			}
		}
		node = node.next;
	}
}

function toArray(list) {
	let array = [];
	let node = list.head.next;

	while (node !== list.tail) {
		array.push(node.value);
		node = node.next;
	}
	return array;
}

function toString(list) {
	const emptyOperatorsRe = new RegExp(`\\${tabSimbol}+\\;*$`, 'g');
	let code = '';
	let codeLines = [];
	let node = list.head.next;

	while (node !== list.tail) {
		if (typeof(node.value) === 'string'){
			code = code + ' ' + node.value.trim().replace(/\s+/g, ' ');
		} else {
			code = code + node.value.content;
		}
		node = node.next;
	}
	codeLines = code.split('\n').map(el => el.replace(emptyOperatorsRe, '')).filter(el => el !== '' && el !== ';');
	code = codeLines.join('\n');

	return code;
}

function removeRange(list, node, count) {
	let next = node.next;
	let i = 0;

	for (i = 0; i < count && next !== list.tail; i++) {
		next = next.next;
	}
	node.next = next;
	next.prev = node;
	list.length -= i;
}

function matchPattern(pattern, pos, text, lookbehind) {
	pattern.lastIndex = pos;
	let match = pattern.exec(text);
	if (match && lookbehind && match[1]) {
		// change the match to remove the text matched lookbehind group
		let lookbehindLength = match[1].length;
		match.index += lookbehindLength;
		match[0] = match[0].slice(lookbehindLength);
	}

	return match;
}

function Token(type, content, alias, matchedStr) {
	this.type = type;
	this.content = content;
	this.alias = alias;
	this.length = (matchedStr || '').length | 0;
}

function matchGrammar(text, tokenList, grammar, startNode, startPos, rematch) {
	for (let token in grammar) {
		if (!grammar.hasOwnProperty(token) || !grammar[token]) {
			continue;
		}

		let patterns = grammar[token];
		patterns = Array.isArray(patterns) ? patterns : [patterns];

		for (let j = 0; j < patterns.length; ++j) {
			if (rematch && rematch.cause == token + ',' + j) {
				return;
			}

			let patternObj = patterns[j];
			let inside = patternObj.inside;
			let lookbehind = !!patternObj.lookbehind;
			let greedy = !!patternObj.greedy;
			let alias = patternObj.alias;

			if (greedy && !patternObj.pattern.global) {
				// Without the global flag, lastIndex won't work
				let flags = patternObj.pattern.toString().match(/[imsuy]*$/)[0];
				patternObj.pattern = RegExp(patternObj.pattern.source, flags + 'g');
			}

			let pattern = patternObj.pattern || patternObj;

			for ( // iterate the token list and keep track of the current token/string position
				let currentNode = startNode.next, pos = startPos;
				currentNode !== tokenList.tail;
				pos += currentNode.value.length, currentNode = currentNode.next
			) {

				if (rematch && pos >= rematch.reach) {
					break;
				}

				let str = currentNode.value;

				if (tokenList.length > text.length) {
					// Something went terribly wrong, ABORT, ABORT!
					return;
				}

				if (str instanceof Token) {
					continue;
				}

				let removeCount = 1; // this is the to parameter of removeBetween
				let match;

				if (greedy) {
					match = matchPattern(pattern, pos, text, lookbehind);
					if (!match) {
						break;
					}

					let from = match.index;
					let to = match.index + match[0].length;
					let p = pos;

					// find the node that contains the match
					p += currentNode.value.length;
					while (from >= p) {
						currentNode = currentNode.next;
						p += currentNode.value.length;
					}
					// adjust pos (and p)
					p -= currentNode.value.length;
					pos = p;

					// the current node is a Token, then the match starts inside another Token, which is invalid
					if (currentNode.value instanceof Token) {
						continue;
					}

					// find the last node which is affected by this match
					for (
						let k = currentNode;
						k !== tokenList.tail && (p < to || typeof k.value === 'string');
						k = k.next
					) {
						removeCount++;
						p += k.value.length;
					}
					removeCount--;

					// replace with the new match
					str = text.slice(pos, p);
					match.index -= pos;
				} else {
					match = matchPattern(pattern, 0, str, lookbehind);
					if (!match) {
						continue;
					}
				}

				// eslint-disable-next-line no-redeclare
				let from = match.index;
				let matchStr = match[0];
				let before = str.slice(0, from);
				let after = str.slice(from + matchStr.length);

				let reach = pos + str.length;
				if (rematch && reach > rematch.reach) {
					rematch.reach = reach;
				}

				let removeFrom = currentNode.prev;

				if (before) {
					removeFrom = addAfter(tokenList, removeFrom, before);
					pos += before.length;
				}

				removeRange(tokenList, removeFrom, removeCount);

				let wrapped = new Token(token, inside ? tokenize(matchStr) : matchStr, alias, matchStr);
				currentNode = addAfter(tokenList, removeFrom, wrapped);

				if (after) {
					addAfter(tokenList, currentNode, after);
				}

				if (removeCount > 1) {
					// at least one Token object was removed, so we have to do some rematching
					// this can only happen if the current pattern is greedy

					let nestedRematch = {
						cause: token + ',' + j,
						reach: reach
					};
					matchGrammar(text, tokenList, grammar, currentNode.prev, pos, nestedRematch);

					// the reach might have been extended because of the rematching
					if (rematch && nestedRematch.reach > rematch.reach) {
						rematch.reach = nestedRematch.reach;
					}
				}
			}
		}
	}
}

export {formatting};
