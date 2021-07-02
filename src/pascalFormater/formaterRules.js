var languages = {};

languages.pascal = {
	'comment': [
		/\(\*[\s\S]+?\*\)/,
		/\{[\s\S]+?\}/,
		/\/\/.*/
	],
	'string': {
		pattern: /(?:'(?:''|[^'\r\n])*'(?!')|#[&$%]?[a-f\d]+)+|\^[a-z]/i,
		greedy: true
	},
	'keyword': [
		{
			// Turbo Pascal
			pattern: /(^|[^&])\b(?:absolute|array|asm|begin|case|const|constructor|destructor|do|downto|else|end|file|for|function|goto|if|implementation|inherited|inline|interface|label|nil|null|object|of|operator|packed|procedure|program|record|reintroduce|repeat|self|set|then|to|type|unit|until|uses|var|while|with)\b/i,
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
		pattern: /\.\.|\*\*|:=|<[<=>]?|>[>=]?|[+\-*\/]=?|[@^=]/i
	},
	'punctuation': {
		pattern: /\(\.|\.\)|[()\[\]:;,.]/
	}
};

var keywords = {
	unit: {},
	implementation: {},
	interface: {},
	program: {},
	procedure: {},
	function: {},
	type: {},
	const: {},
	begin: {},
	end: {},
};

keywords.unit = {
	name: 'unit',
	ending: {
		including: true,
		string: ';',

	},
	addTab: false,
	addEoln: false,
	ignorUntilEnd: true,
};
keywords.implementation = {
	name: 'implementation',
	ending: null,
	addTab: true,
	ignorUntilEnd: false,
	isOpening: true,
};
keywords.interface = {
	name: 'interface',
	ending: [keywords.implementation],
	addTab: true,
	ignorUntilEnd: false,
	isOpening: true,
};
keywords.program = {
	name: 'program',
	ending: [keywords.end],
	addTab: false,
	ignorUntilEnd: true,
	isOpening: true,
};
keywords.procedure = {
	name: 'procedure',
	ending: [{name: ')'}, {name: ';'}],
	addTab: false,
	ignorUntilEnd: true,
	isOpening: true,
};
keywords.function = {
	name: 'function',
	ending: [{name: ')'}, {name: ';'}],
	addTab: false,
	ignorUntilEnd: true,
	isOpening: true,
};
keywords.type = {
	name: 'type',
	ending: ['begin', 'const'],
	addTab: false,
	ignorUntilEnd: true,
	isOpening: true,
};
keywords.const = {
	name: 'const',
	ending: ['begin', 'type'],
	addTab: false,
	ignorUntilEnd: true,
	isOpening: true,
};
keywords.end = {
	name: 'end',
	ending: null,
	addTab: false,
	ignorUntilEnd: true,
};
keywords.begin = {
	name: 'begin',
	ending: ['end'],
	addTab: true,
	ignorUntilEnd: true,
	isOpening: true,
};



export {languages, keywords};