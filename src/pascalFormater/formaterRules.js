var languages = {};

languages.pascal = {
	'comment': [
		/\(\*[\s\S]+?\*\)/,
		/\{[\s\S]+?\}/,
		/\/\/.*/
	],
	'string': {
		pattern: /(?:'(?:''|[^'\r\n])*'(?!')|#[&$%]?[a-f\d]+)+/i,
		greedy: true
	},
	'keyword': [
		{
			// Turbo Pascal
			pattern: /(^|[^&])\b(?:absolute|array|asm|begin|case|const|constructor|destructor|do|downto|else|end|file|for|function|goto|if|implementation|inherited|inline|input|interface|label|length|nil|null|object|of|operator|output|packed|procedure|program|record|reintroduce|repeat|self|set|then|to|type|unit|until|uses|var|while|with)\b/i,
			lookbehind: true
		},
		{
			// Free Pascal
			pattern: /(^|[^&])\b(?:dispose|exit|false|new|true)\b/i,
			lookbehind: true
		},
		{
			// Object Pascal
			pattern: /(^|[^&])\b(?:class|dispinterface|except|exports|finalization|finally|initialization|inline|library|on|out|packed|property|raise|resourcestring|threadvar|try)\b/i,
			lookbehind: true
		},
		{
			// Modifiers
			pattern: /(^|[^&])\b(?:absolute|abstract|alias|assembler|bitpacked|break|cdecl|chr|continue|cppdecl|cvar|default|deprecated|dynamic|enumerator|experimental|eol|eoln|export|external|far|far16|forward|generic|helper|implements|interrupt|iochecks|local|message|name|near|nodefault|noreturn|nostackframe|oldfpccall|ord|otherwise|overload|override|pascal|platform|private|protected|public|published|read|readln|register|reintroduce|result|safecall|saveregisters|softfloat|specialize|static|stdcall|stored|strict|unaligned|unimplemented|varargs|virtual|write|writeln)\b/i,
			lookbehind: true
		}
	],
	'typeword': {
		pattern: /(^|[^&])\b(?:boolean|char|integer|real|string|text)\b/i,
		lookbehind: true
	},
	'number': [
		// Hexadecimal, octal and binary
		/(?:[&%]\d+|\$[a-f\d]+)/i,
		// Decimal
		/\b\d+(?:\.\d+)?(?:e[+-]?\d+)?/i
	],
	'operacion': {
		pattern: /(^|[^&])\b(?:and|as|div|exclude|in|include|is|mod|not|or|shl|shr|xor)\b/i,
		lookbehind: true
	},
	'operator': {
		pattern: /\.\.|\*\*|:=|<[<=>]?|>[>=]?|[+\-*\/]=?|[@=]/i
	},
	'punctuation': {
		pattern: /\(\.|\.\)|[()\[\]:;,.]/
	}
};

var keywords = {
	unit: {
		default: {
			name: 'unit',
			ending: [{
				key: ';',
				isGreedy: false,
			}],
			addTab: false,
			ignorEolnUntilEnd: false,
			isOpening: true,
			eolnBefore: true,
		}
	},
	implementation: {
		default: {
			name: 'implementation',
			ending: [{
				key: 'begin',
				isGreedy: false,
			}],
			addTab: true,
			ignorEolnUntilEnd: false,
			isOpening: true,
			eolnBefore: true,
		}
	},
	interface: {
		default: {
			name: 'interface',
			ending: [{
				key: 'implementation',
				isGreedy: false,
			}],
			addTab: true,
			ignorEolnUntilEnd: false,
			isOpening: true,
			eolnBefore: true,
		}
	},
	program: {
		default: {
			name: 'program',
			ending: [{
				key: '.',
				isGreedy: true,
			}],
			addTab: false,
			ignorEolnUntilEnd: false,
			isOpening: true,
			eolnBefore: true,
		}
	},
	procedure: {
		default: {
			name: 'procedure',
			ending: [{
				key: ';',
				isGreedy: false,
			}],
			addTab: false,
			ignorEolnUntilEnd: false,
			isOpening: true,
			eolnBefore: true,
		},
		interface: {
			name: 'procedure',
			ending: [{
				key: ';',
				isGreedy: false,
			}],
			addTab: false,
			ignorEolnUntilEnd: true,
			isOpening: true,
			eolnBefore: true,
		}
	},
	function: {
		default: {
			name: 'function',
			ending: [{
				key: ';',
				isGreedy: false,
			}],
			addTab: false,
			ignorEolnUntilEnd: false,
			isOpening: true,
			eolnBefore: true,
		},
		interface: {
			name: 'function',
			ending: [{
				key: ';',
				isGreedy: false,
			}],
			addTab: false,
			ignorEolnUntilEnd: true,
			isOpening: true,
			eolnBefore: true,
		}
	},
	type: {
		default: {
			name: 'type',
			ending: [{
				key: 'begin',
				isGreedy: false,
			},
			{
				key: 'const',
				isGreedy: false,
			},
			{
				key: 'var',
				isGreedy: false,
			},
			{
				key: 'procedure',
				isGreedy: false,
			},
			{
				key: 'function',
				isGreedy: false,
			}],
			addTab: true,
			ignorEolnUntilEnd: false,
			isOpening: true,
			eolnBefore: true,
		}
	},
	const: {
		default: {
			name: 'const',
			ending: [{
				key: 'begin',
				isGreedy: false,
			},
			{
				key: 'type',
				isGreedy: false,
			},
			{
				key: 'var',
				isGreedy: false,
			}],
			addTab: true,
			ignorEolnUntilEnd: false,
			isOpening: true,
			eolnBefore: true,
		}
	},
	var: {
		default: {
			name: 'var',
			ending: [{
				key: 'begin',
				isGreedy: false,
			},
			{
				key: 'const',
				isGreedy: false,
			},
			{
				key: 'type',
				isGreedy: false,
			},
			{
				key: 'procedure',
				isGreedy: false,
			},
			{
				key: 'function',
				isGreedy: false,
			}],
			addTab: true,
			ignorEolnUntilEnd: false,
			isOpening: true,
			eolnBefore: true,
		},
		'brackets': {
			name: 'var',
			ending: null,
			addTab: false,
			ignorEolnUntilEnd: true,
			isOpening: false,
			eolnBefore: false,
		}
	},
	end: {
		default: {
			name: 'end',
			ending: null,
			addTab: false,
			ignorEolnUntilEnd: true,
			eolnBefore: false,
		}
	},
	begin: {
		default: {
			name: 'begin',
			ending: [{
				key: 'end',
				isGreedy: true,
			}],
			addTab: true,
			ignorEolnUntilEnd: false,
			isOpening: true,
			eolnBefore: true,
		}
	},
	if: {
		default: {
			name: 'if',
			ending: [
				{
					key: 'else',
					isGreedy: true,
				},
				{
					key: ';',
					isGreedy: false,
				}],
			addTab: false,
			ignorEolnUntilEnd: false,
			isOpening: true,
			eolnBefore: true,
		},
	},
	then: {
		default: {
			name: 'then',
			ending: [
				{
					key: 'else',
					isGreedy: false,
				},
				{
					key: ';',
					isGreedy: false,
				}],
			addTab: true,
			ignorEolnUntilEnd: false,
			isOpening: true,
			eolnBefore: true,
		}
	},
	else: {
		default: {
			name: 'else',
			ending: [
				{
					key: 'else',
					isGreedy: false,
				},
				{
					key: ';',
					isGreedy: false,
				}],
			addTab: true,
			ignorEolnUntilEnd: false,
			isOpening: true,
			eolnBefore: true,
		},
	},
	while: {
		default: {
			name: 'while',
			ending: [{
				key: ';',
				isGreedy: false,
			}],
			addTab: false,
			ignorEolnUntilEnd: false,
			isOpening: true,
			eolnBefore: true
		}
	},
	for: {
		default: {
			name: 'for',
			ending: [{
				key: ';',
				isGreedy: false,
			}],
			addTab: false,
			ignorEolnUntilEnd: false,
			isOpening: true,
			eolnBefore: true
		}
	},
	do: {
		default: {
			name: 'do',
			ending: [{
				key: ';',
				isGreedy: false,
			}],
			addTab: true,
			ignorEolnUntilEnd: false,
			isOpening: true,
			eolnBefore: true
		}
	},
	case: {
		default: {
			name: 'case',
			ending: [{
				key: 'end',
				isGreedy: true,
			},
			{
				key: 'else',
				isGreedy: true,
			}],
			addTab: false,
			ignorEolnUntilEnd: false,
			isOpening: true,
			eolnBefore: true
		}
	},
	of: {
		default: {
			name: 'of',
			ending: null,
			addTab: false,
			ignorEolnUntilEnd: false,
			isOpening: false,
			eolnBefore: false
		},
		case: {
			name: 'of',
			ending: [{
					key: 'end',
					isGreedy: false,
				},
				{
					key: 'else',
					isGreedy: false,
				}],
			addTab: true,
			ignorEolnUntilEnd: false,
			isOpening: true,
			eolnBefore: false
		}
	},
	repeat: {
		default: {
			name: 'repeat',
			ending: [{
				key: 'until',
				isGreedy: false,
			}],
			addTab: true,
			ignorEolnUntilEnd: false,
			isOpening: true,
			eolnBefore: true
		}
	},
	until: {
		default: {
			name: 'until',
			ending: [{
				key: ';',
				isGreedy: false,
			}],
			addTab: false,
			ignorEolnUntilEnd: true,
			isOpening: true,
			eolnBefore: true
		}
	},
	'(': {
		default: {
			name: 'brackets',
			ending: [{
				key: ')',
				isGreedy: true,
			}],
			addTab: false,
			ignorEolnUntilEnd: true,
			isOpening: true,
			eolnBefore: false,
		}
	},
};

export {languages, keywords};