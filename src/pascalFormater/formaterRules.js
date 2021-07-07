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
			ending: [';'],
			addTab: false,
			ignorEolnUntilEnd: false,
			isOpening: true,
		}
	},
	implementation: {
		default: {
			name: 'implementation',
			ending: ['begin'],
			addTab: true,
			ignorEolnUntilEnd: false,
			isOpening: true,
		}
	},
	interface: {
		default: {
			name: 'interface',
			ending: ['implementation'],
			addTab: true,
			ignorEolnUntilEnd: false,
			isOpening: true,
		}
	},
	program: {
		default: {
			name: 'program',
			ending: ['.'],
			addTab: false,
			ignorEolnUntilEnd: false,
			isOpening: true,
		}
	},
	procedure: {
		default: {
			name: 'procedure',
			ending: ['end'],
			addTab: false,
			ignorEolnUntilEnd: false,
			isOpening: true,
		},
		interface: {
			name: 'procedure',
			ending: [';'],
			addTab: false,
			ignorEolnUntilEnd: true,
			isOpening: true,
		}
	},
	function: {
		default: {
			name: 'function',
			ending: ['end'],
			addTab: false,
			ignorEolnUntilEnd: false,
			isOpening: true,
		},
		interface: {
			name: 'function',
			ending: [';'],
			addTab: false,
			ignorEolnUntilEnd: true,
			isOpening: true,
		}
	},
	type: {
		default: {
			name: 'type',
			ending: ['begin', 'const', 'var', 'procedure', 'function'],
			addTab: true,
			ignorEolnUntilEnd: false,
			isOpening: true,
		}
	},
	const: {
		default: {
			name: 'const',
			ending: ['begin', 'type', 'var'],
			addTab: true,
			ignorEolnUntilEnd: false,
			isOpening: true,
		}
	},
	var: {
		default: {
			name: 'var',
			ending: ['begin', 'type', 'const', 'procedure', 'function'],
			addTab: true,
			ignorEolnUntilEnd: false,
			isOpening: true,
		},
		'brackets': {
			name: 'var',
			ending: null,
			addTab: false,
			ignorEolnUntilEnd: true,
			isOpening: false,
		}
	},
	end: {
		default: {
			name: 'end',
			ending: null,
			addTab: false,
			ignorEolnUntilEnd: true,
		}
	},
	begin: {
		default: {
			name: 'begin',
			ending: ['end'],
			addTab: true,
			ignorEolnUntilEnd: false,
			isOpening: true,
		}
	},
	if: {
		default: {
			name: 'if',
			ending: [';'],
			addTab: false,
			ignorEolnUntilEnd: false,
			isOpening: true,
		}
	},
	then: {
		default: {
			name: 'then',
			ending: ['else' , ';'],
			addTab: true,
			ignorEolnUntilEnd: false,
			isOpening: true,
		}
	},
	else: {
		default: {
			name: 'else',
			ending: [';'],
			addTab: true,
			ignorEolnUntilEnd: false,
			isOpening: true,
		}
	},
	while: {
		default: {
			name: 'while',
			ending: [';'],
			addTab: false,
			ignorEolnUntilEnd: false,
			isOpening: true,
		}
	},
	for: {
		default: {
			name: 'for',
			ending: [';'],
			addTab: false,
			ignorEolnUntilEnd: false,
			isOpening: true,
		}
	},
	do: {
		default: {
			name: 'do',
			ending: [';'],
			addTab: true,
			ignorEolnUntilEnd: false,
			isOpening: true,
		}
	},
	'(': {
		default: {
			name: 'brackets',
			ending: [')'],
			addTab: false,
			ignorEolnUntilEnd: true,
			isOpening: true,
		}
	},
};

export {languages, keywords};