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
			pattern: /(^|[^&])\b(?:absolute|array|asm|begin|case|const|constructor|destructor|do|downto|else|end|file|for|function|goto|if|implementation|inherited|inline|input|interface|label|nil|null|object|of|operator|output|packed|procedure|program|record|reintroduce|repeat|self|set|then|to|type|unit|until|uses|var|while|with)\b/i,
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
	var: {},
};

keywords.unit = {
	default: {
		name: 'unit',
		ending: [';'],
		addTab: false,
		ignorEolnUntilEnd: false,
		isOpening: true,
	}
};

keywords.implementation = {
	default: {
		name: 'implementation',
		ending: ['begin'],
		addTab: true,
		ignorEolnUntilEnd: false,
		isOpening: true,
	}
};
keywords.interface = {
	default: {
		name: 'interface',
		ending: ['implementation'],
		addTab: true,
		ignorEolnUntilEnd: false,
		isOpening: true,
	}
};
keywords.program = {
	default: {
		name: 'program',
		ending: ['.'],
		addTab: false,
		ignorEolnUntilEnd: false,
		isOpening: true,
	}
};
keywords.procedure = {
	default: {
		name: 'procedure',
		ending: [';'],
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
};
keywords.function = {
	default: {
		name: 'function',
		ending: [';'],
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
};
keywords.type = {
	default: {
		name: 'type',
		ending: ['begin', 'const', 'var', 'procedure', 'function'],
		addTab: true,
		ignorEolnUntilEnd: false,
		isOpening: true,
	}
};
keywords.const = {
	default: {
		name: 'const',
		ending: ['begin', 'type', 'var'],
		addTab: true,
		ignorEolnUntilEnd: false,
		isOpening: true,
	}
};
keywords.var = {
	default: {
		name: 'var',
		ending: ['begin', 'type', 'const', 'procedure', 'function'],
		addTab: true,
		ignorEolnUntilEnd: false,
		isOpening: true,
	},
	procedure: {
		name: 'var',
		ending: [';', ')'],
		addTab: false,
		ignorEolnUntilEnd: true,
		isOpening: true,
	},
	function: {
		name: 'var',
		ending: [';', ')'],
		addTab: false,
		ignorEolnUntilEnd: true,
		isOpening: true,
	}
};
keywords.end = {
	default: {
		name: 'end',
		ending: null,
		addTab: false,
		ignorEolnUntilEnd: true,
	}
};
keywords.begin = {
	default: {
		name: 'begin',
		ending: ['end'],
		addTab: true,
		ignorEolnUntilEnd: false,
		isOpening: true,
	}
};
keywords.if = {
	default: {
		name: 'if',
		ending: ['then'],
		addTab: false,
		ignorEolnUntilEnd: false,
		isOpening: true,
	}
};
keywords.then = {
	default: {
		name: 'then',
		ending: ['else' , ';', 'end'],
		addTab: true,
		ignorEolnUntilEnd: false,
		isOpening: true,
	}
};
keywords.else = {
	default: {
		name: 'else',
		ending: [';', 'end'],
		addTab: true,
		ignorEolnUntilEnd: false,
		isOpening: true,
	}
};
keywords.while = {
	default: {
		name: 'while',
		ending: ['do'],
		addTab: false,
		ignorEolnUntilEnd: false,
		isOpening: true,
	}
};
keywords.for = {
	default: {
		name: 'for',
		ending: ['do'],
		addTab: false,
		ignorEolnUntilEnd: false,
		isOpening: true,
	}
};
keywords.do = {
	default: {
		name: 'do',
		ending: [';', 'end'],
		addTab: true,
		ignorEolnUntilEnd: false,
		isOpening: true,
	}
};

export {languages, keywords};