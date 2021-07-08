import {languages, keywords} from './formaterRules.js';

const onlyUpperTokenTypes = ['keyword', 'typeword', 'operacion'];
const spacelessPunctuations = ['(', ')', '[', ']', '.'];

function tokenize(text) {
	let grammar = languages.pascal;

	let tokenList = new LinkedList();

	addAfter(tokenList, tokenList.head, text);
	matchGrammar(text, tokenList, grammar, tokenList.head, 0);
	tokenizeIdentifiers(tokenList);

	return tokenList;
}

function formatting(list) {
	const eoln = '\n';
	const space = ' ';
	const tab = '--';
	const mainCtx = {
		name: 'main',
		ending: null,
		addTab: false,
		ignorEolnUntilEnd: false,
		isOpening: true
	};
	let stack = [mainCtx];
	let currentTabAmount = 0;
	let ignorEoln = false;

	// add ';' before ends
	let node = list.head.next;

	while (node !== list.tail) {
		let currContent = node.value.content.toLowerCase();
		let prevContent = node.prev.value? node.prev.value.content.toLowerCase() : null;
		if (currContent === 'end' && prevContent !== ';' && prevContent !== eoln) {
			node = addTokenAfter(list, node.prev, 'punctuation', ';');
			continue;
		}
		node = node.next;
	}

	// basic blocking and formatting
	node = list.head.next;

	while (node !== list.tail) {
		let stackHead = stack[stack.length - 1];

		// searching closing blocks
		if(stackHead !== mainCtx && stackHead.ending) {
			let ending = stackHead.ending.find(el => el.key === node.value.content.toLowerCase());
			console.log(stackHead, node.value.content.toLowerCase(), ending);
			if (ending) {

				// debugger;
				if (stackHead.addTab)
				{
					currentTabAmount--;
					if (node.prev.value.type === 'tab') {
						node.prev.value.content = tab.repeat(currentTabAmount);
					}
				}
				if (stackHead.isOpening && !stackHead.ignorEolnUntilEnd)
				{
					createNewLine(list, node.prev);
				}
				stack.pop();

				let isGreedyEnd = ending.isGreedy;
				console.log(isGreedyEnd);

				console.log(stack.length, 'closing', stackHead.name, currentTabAmount, node.value.content);

				stackHead = stack[stack.length-1];
				ignorEoln = stackHead.ignorEolnUntilEnd;
				if (!isGreedyEnd){
					continue;
				}
			}
		}

		//remove extra tabs
		if (node.value && node.value.type === 'tab' && node.value.content !== tab.repeat(currentTabAmount) ) {
			node.value.content = tab.repeat(currentTabAmount);
		}

		// searching opening blocks
		let keyword = getKeywordByContext(node, stackHead);
		if (keyword) {
			if (keyword.eolnBefore && !stackHead.ignorEolnUntilEnd) {
				createNewLine(list, node.prev);
			}
			if (keyword.isOpening) {
				stack.push(keyword);

				if (keyword.addTab) {
					currentTabAmount++;
					if (!stackHead.ignorEolnUntilEnd) {
						createNewLine(list, node);
					}
				}
				stackHead = stack[stack.length - 1];
				console.log(stack.length, 'opening', keyword.name, currentTabAmount, node.value.content);
			}
		}

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
			if(node.next.value && node.next.value.type !== 'spaces' && node.next.value.type !== 'tab') {
				addTokenAfter(list, node, 'spaces', space);
			}
			if(node.next.value && node.prev.value.type !== 'spaces' && node.prev.value.type !== 'tab') {
				addTokenAfter(list, node.prev, 'spaces', space);
			}
		}

		if (node.value.type === 'punctuation' && !spacelessPunctuations.includes(node.value.content)) {
			if(node.next.value.type !== 'spaces' && node.next.value.type !== 'tab') {
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

		// if (node.value.content === eoln && node.next.value) {
		// 	// addTokenAfter(list, node, 'spaces', 'tab');
		// 	// console.log(node, list.length, node.value.type === 'spaces' && node.value.content === eoln);
		// 	node = node.next.next;
		// 	continue;
		// }
		node = node.next;
	}

	// remove ; before ends
	node = list.head.next;

	while (node.next !== list.tail) {
		if (node.value.content === ';') {
			var nextNonSpacesNode = nextNonSpacesToken(list, node);
			if (nextNonSpacesNode && nextNonSpacesNode.value && nextNonSpacesNode.value.content.toLowerCase() === 'end') {
				node.prev.next = node.next.next;
				node.next.next.prev = node.prev;

				node = node.prev.prev;
				continue;
			}
		}

		node = node.next;
	}

	function createNewLine(list, node) {
		if (node.next.value && (node.next.value.type === 'comment' || node.next.value.type === 'punctuation')) {
			node = node.next;
		}
		addTokenAfter(list, node, 'tab', tab.repeat(currentTabAmount));
		addTokenAfter(list, node, 'spaces', eoln);
	}

	function getKeywordByContext(node, context) {
		let keyword = null;
		if (node.value && keywords[node.value.content.toLowerCase()]) {
			let keywordName = node.value.content.toLowerCase();
			keyword = keywords[keywordName].default
			console.log(keyword);
			if (keywords[keywordName][context.name]) {
				keyword = keywords[keywordName][context.name];
				console.log(keyword);
			}
		}
		return keyword;
	}




	console.log(stack);
	toUpperTokens(list);
	return toArray(list);
}

function addTokenAfter(list, node, valueType, value) {
	var newNode = new Token(valueType, value, undefined, value);

	return addAfter(list, node, newNode);
}

function prevNonSpacesToken(list, node) {
	var newNode = node.prev;

	while (newNode !== list.head && (newNode.value.type === 'spaces' || newNode.value.type === 'tab')) {
		node = node.prev;
	}
	return newNode;
}

function nextNonSpacesToken(list, node) {
	var newNode = node.next;

	while (newNode !== list.tail && (newNode.value.type === 'spaces' || newNode.value.type === 'tab')) {
		newNode = newNode.next;
	}
	return newNode;
}

function toUpperTokens(list) {
	var node = list.head.next;
	while (node !== list.tail) {
		if (onlyUpperTokenTypes.includes(node.value.type)) {
			node.value.content = node.value.content.toUpperCase();
		}
		node = node.next;
	}
}

function LinkedList() {
	var head = { value: null, prev: null, next: null };
	var tail = { value: null, prev: head, next: null };
	head.next = tail;

	this.head = head;
	this.tail = tail;
	this.length = 0;
}

function addAfter(list, node, value) {
	// assumes that node != list.tail && values.length >= 0
	var next = node.next;
	var newNode = { value: value, prev: node, next: next };

	node.next = newNode;
	next.prev = newNode;
	list.length++;

	return newNode;
}

function tokenizeIdentifiers(list) {
	var node = list.head.next;
	while (node !== list.tail) {
		if (typeof(node.value) === 'string'){
			node.value = node.value.trim().replace(/\s+/g, ' ');
			if (node.value === '') {
				node.prev.next = node.next;
				node.next.prev = node.prev;
			}else{
				node.value = node.value[0].toUpperCase() + node.value.slice(1);
				node.value = new Token('identifier', node.value, undefined, node.value);
			};
		};
		node = node.next;
	}
}

function toArray(list) {
	var array = [];
	var node = list.head.next;
	while (node !== list.tail) {
		array.push(node.value);
		node = node.next;
	}
	return array;
}

function toString(list) {
	var str = '';
	var node = list.head.next;
	while (node !== list.tail) {
		if (typeof(node.value) === 'string'){
			str = str + ' ' + node.value.trim().replace(/\s+/g, ' ');
		} else {
			str = str + node.value.content;
		}
		node = node.next;
	}

	return str;
}

function removeRange(list, node, count) {
	var next = node.next;
	for (var i = 0; i < count && next !== list.tail; i++) {
		next = next.next;
	}
	node.next = next;
	next.prev = node;
	list.length -= i;
}

function matchPattern(pattern, pos, text, lookbehind) {
	pattern.lastIndex = pos;
	var match = pattern.exec(text);
	if (match && lookbehind && match[1]) {
		// change the match to remove the text matched by the Prism lookbehind group
		var lookbehindLength = match[1].length;
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
	for (var token in grammar) {
		if (!grammar.hasOwnProperty(token) || !grammar[token]) {
			continue;
		}

		var patterns = grammar[token];
		patterns = Array.isArray(patterns) ? patterns : [patterns];

		for (var j = 0; j < patterns.length; ++j) {
			if (rematch && rematch.cause == token + ',' + j) {
				return;
			}

			var patternObj = patterns[j];
			var inside = patternObj.inside;
			var lookbehind = !!patternObj.lookbehind;
			var greedy = !!patternObj.greedy;
			var alias = patternObj.alias;

			if (greedy && !patternObj.pattern.global) {
				// Without the global flag, lastIndex won't work
				var flags = patternObj.pattern.toString().match(/[imsuy]*$/)[0];
				patternObj.pattern = RegExp(patternObj.pattern.source, flags + 'g');
			}

			var pattern = patternObj.pattern || patternObj;

			for ( // iterate the token list and keep track of the current token/string position
				var currentNode = startNode.next, pos = startPos;
				currentNode !== tokenList.tail;
				pos += currentNode.value.length, currentNode = currentNode.next
			) {

				if (rematch && pos >= rematch.reach) {
					break;
				}

				var str = currentNode.value;

				if (tokenList.length > text.length) {
					// Something went terribly wrong, ABORT, ABORT!
					return;
				}

				if (str instanceof Token) {
					continue;
				}

				var removeCount = 1; // this is the to parameter of removeBetween
				var match;

				if (greedy) {
					match = matchPattern(pattern, pos, text, lookbehind);
					if (!match) {
						break;
					}

					var from = match.index;
					var to = match.index + match[0].length;
					var p = pos;

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
						var k = currentNode;
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
				var from = match.index;
				var matchStr = match[0];
				var before = str.slice(0, from);
				var after = str.slice(from + matchStr.length);

				var reach = pos + str.length;
				if (rematch && reach > rematch.reach) {
					rematch.reach = reach;
				}

				var removeFrom = currentNode.prev;

				if (before) {
					removeFrom = addAfter(tokenList, removeFrom, before);
					pos += before.length;
				}

				removeRange(tokenList, removeFrom, removeCount);

				var wrapped = new Token(token, inside ? tokenize(matchStr) : matchStr, alias, matchStr);
				currentNode = addAfter(tokenList, removeFrom, wrapped);

				if (after) {
					addAfter(tokenList, currentNode, after);
				}

				if (removeCount > 1) {
					// at least one Token object was removed, so we have to do some rematching
					// this can only happen if the current pattern is greedy

					var nestedRematch = {
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

export {tokenize, formatting};
