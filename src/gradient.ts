
type LengthPercentage = `${number}%` | `${number}px`;
type Angle = `${number}deg`;


type RectangularColorSpace = 'srgb'|'srgb-linear'|'display-p3'|'a98-rgb'|'prophoto-rgb'|'rec2020'|'lab'|'oklab'|'xyz'|'xyz-d50'|'xyz-d65';

type HorizontalAlignment ='left'|'right';
type VerticalAlignment ='top'|'bottom';
type SideOrCorner = `${HorizontalAlignment} ${VerticalAlignment}`;
type ToDirection = `to ${ HorizontalAlignment | VerticalAlignment | SideOrCorner}`
type Color = `#${string}` | 'transparent' | `rgb(${number},${number},${number})` | `rgba(${number},${number},${number},${number})`;
type ColorStop = [ Color, LengthPercentage?, LengthPercentage? ];
type ColorHint = [ LengthPercentage ];

type LinearGradientSyntax = {
	angle?: Angle;
	to?: ToDirection;
	colorStopList: (ColorStop | ColorHint)[]; //ColorStopList must have at least two elements
}

type RepeatingLinearGradient = {
	methodName: 'repeating-linear-gradient';
	syntax: LinearGradientSyntax;
	parse: (expression: `repeating-linear-gradient(${string})`) => RepeatingLinearGradient;
	toString: () => string;
}

type Position = [LengthPercentage] | [LengthPercentage, LengthPercentage] | [`${HorizontalAlignment} ${LengthPercentage}`] | [`${VerticalAlignment} ${LengthPercentage}`] | [`${HorizontalAlignment} ${LengthPercentage}`, `${VerticalAlignment} ${LengthPercentage}`];
//if using [LengthPercentage, LengthPercentage?] the type AtPosition cannot accpet "at 10% 10%" etc, only "at 10%".

type FromAngle = `from ${Angle}`;

type Stringable = string | number | bigint | boolean | null | undefined;
type Join<A, Sep extends string = "", R extends string = ""> = A extends [infer First, ...infer Rest]
	? Join<Rest, Sep, R extends "" ? `${First & Stringable}` : `${R}${Sep}${First & Stringable}`> : R;
type AtPosition = `at ${Join<Position, ' '>}`;

type ConicGradientSyntax = {
	from?: FromAngle;
	at?: AtPosition;
	colorStopList: (ColorStop | ColorHint)[]; //ColorStopList must have at least two elements
}

type RepeatingConicGradient = {
	methodName: 'repeating-conic-gradient';
	syntax: ConicGradientSyntax;
	parse: (expression: `repeating-conic-gradient(${string})`) => RepeatingConicGradient;
	toString: () => string;
}

type RadialShape = 'circle' | 'ellipse';
type RadialExtent = 'closest-corner' | 'closest-side' | 'farthest-corner' | 'farthest-side';
const radialExtentArr: RadialExtent[] = [ 'closest-corner' , 'closest-side' , 'farthest-corner' , 'farthest-side' ];
type RadialSize = number | LengthPercentage | RadialExtent;

type RadialGradientSyntax = {
	shape?: RadialShape;
	size?: RadialSize;
	at?: AtPosition;
	colorStopList: (ColorStop | ColorHint)[]; //ColorStopList must have at least two elements
}

type RepeatingRadialGradient = {
	methodName: 'repeating-radial-gradient';
	syntax: RadialGradientSyntax;
	parse: (expression: `repeating-radial-gradient(${string})`) => RepeatingRadialGradient;
	toString: () => string;
}


type MixGradientSyntax = LinearGradientSyntax & ConicGradientSyntax & RadialGradientSyntax;


//let xxx: MixGradientSyntax = { colorStopList: [] }; let x: LinearGradientSyntax; x = xxx;


const regLinear = /(?:(?:repeating-)?linear-gradient\(.+?\))/g;
const regConic = /(?:(?:repeating-)?conic-gradient\(.+?\))/g;
const regRadial = /(?:(?:repeating-)?radial-gradient\(.+?\))/g;


class RepeatingLinearGradientImpl implements RepeatingLinearGradient {
	methodName: 'repeating-linear-gradient' = 'repeating-linear-gradient';

	constructor() {
	}

	syntax: LinearGradientSyntax = {
		angle: '0deg',  //default
		colorStopList: []
	}

	parse = (expression: `repeating-linear-gradient(${string})`): RepeatingLinearGradient => {
		if(expression.match(regLinear) === null) throw new Error('not a repeating-linear-gradient() function');
		//console.log(expression.match(/(?<=repeating-linear-gradient\().+(?=\))/)?.[0]);
		let items = expression.match(/(?<=repeating-linear-gradient\().+(?=\))/)?.[0].split(',');
		//console.log(items);
		if(items === undefined) return this;
		this.syntax.to = undefined;
		this.syntax.angle = undefined;
		this.syntax.colorStopList = [];
		if(items[0].match(/\d+deg/) !== null) {
			this.syntax.angle = items[0].match(/\d+deg/)?.toString() as Angle;
		} else if(items[0].match(/to.+/) !== null) {
			this.syntax.to = items[0].match(/to.+/)?.toString() as ToDirection;
		} else {
			//this.syntax.colorStopList = [];
			this.syntax.colorStopList.push(items[0].trim().split(/\s+/) as (ColorStop | ColorHint));
		}
		for(let i=1; i<items.length; i++) {
			this.syntax.colorStopList.push(items[i].trim().split(/\s+/) as (ColorStop | ColorHint));
		}
		//console.log(this.syntax);
		return this;
	}

	toString = (): string => {
		const colorStopList = [];
		for(const item of this.syntax.colorStopList) {
			colorStopList.push(item.join(' '));
		}
		const deg = this.syntax.angle !== undefined ? this.syntax.angle + ', '
			: this.syntax.to !== undefined ? this.syntax.to + ', '
				: '';
		const retStr = `${this.methodName}(${deg}${colorStopList.join(', ')})`;
		return retStr;
	}
}

class RepeatingConicGradientImpl implements RepeatingConicGradient {
	methodName: 'repeating-conic-gradient' = 'repeating-conic-gradient';

	constructor() {}

	syntax: ConicGradientSyntax = {
		colorStopList: []
	}

	parse = (expression: `repeating-conic-gradient(${string})`): RepeatingConicGradient => {
		if(expression.match(regConic) === null) throw new Error('not a repeating-conic-gradient() function');
		let items = expression.match(/(?<=repeating-conic-gradient\().+(?=\))/)?.[0].split(',');
		//console.log(items);
		if(items === undefined) return this;
		this.syntax.from = undefined;
		this.syntax.at = undefined;
		this.syntax.colorStopList = [];
		if((items[0].match(/from\s+\d+deg/) !== null)||(items[0].match(/at.+/) !== null)) {
			if(items[0].match(/from\s+\d+deg/) !== null) this.syntax.from = items[0].match(/from\s+\d+deg/)?.toString() as FromAngle;
			if(items[0].match(/at.+/) !== null) this.syntax.at = items[0].match(/at.+/)?.toString() as AtPosition;
		} else {
			this.syntax.colorStopList.push(items[0].trim().split(/\s+/) as (ColorStop | ColorHint));
		}
		for(let i=1; i<items.length; i++) {
			this.syntax.colorStopList.push(items[i].trim().split(/\s+/) as (ColorStop | ColorHint));
		}
		//console.log(this.syntax);
		return this;
	}

	toString = (): string => {
		const from = this.syntax.from !== undefined ? this.syntax.from + ' ' : '';
		const at = this.syntax.at !== undefined && this.syntax.at.match(/at.+/) !== null ? this.syntax.at + ' ' : '';
		const colorStopList = [];
		for(const item of this.syntax.colorStopList) {
			colorStopList.push(item.join(' '));
		}
		const fromAt = from !== '' || at !== '' ? from + at + '\, ' : from + at;
		const retStr = `${this.methodName}(${fromAt}${colorStopList.join(', ')})`;
		//console.log(retStr);
		return retStr;
	}
}

class RepeatingRadialGradientImpl implements RepeatingRadialGradient {
	methodName: 'repeating-radial-gradient' = 'repeating-radial-gradient';

	constructor() {}

	syntax: RadialGradientSyntax = {
		colorStopList: []
	}

	parse = (expression: `repeating-radial-gradient(${string})`): RepeatingRadialGradient => {
		if(expression.match(regRadial) === null) throw new Error('not a repeating-radial-gradient() function');
		let items = expression.match(/(?<=repeating-radial-gradient\().+(?=\))/)?.[0].split(',');
		//console.log(items);
		if(items === undefined) return this;
		this.syntax.shape = undefined;
		this.syntax.size = undefined;
		this.syntax.at = undefined;
		this.syntax.colorStopList = [];
		if(items[0].match(/(circle|ellipse)/i) !== null) {
			this.syntax.shape = items[0].match(/circle|ellipse/i)?.toString().trim() as RadialShape;
		}
		if(items[0].match(/at.+/) !== null) {
			this.syntax.at = items[0].match(/at.+/)?.toString().trim() as AtPosition;
		}
		const regRadialSize = /\d+(?:px|\%)\s+\d+(?:px|\%)(?=\s*at)?/;
		if(items[0].match(regRadialSize) !== null) {
			if(items[0].match(regRadialSize)?.toString().trim() !== '') {
				this.syntax.size = items[0].match(regRadialSize)?.toString().trim() as RadialSize;
			}
		}

		for(let i=1; i<items.length; i++) {
			this.syntax.colorStopList.push(items[i].trim().split(/\s+/) as (ColorStop | ColorHint));
		}
		if((this.syntax.shape === undefined || this.syntax.size === undefined) && this.syntax.at === undefined)  {
			this.syntax.colorStopList.unshift(items[0].trim().split(/\s+/) as (ColorStop | ColorHint));
		}
		//console.log(this.syntax);
		return this;
	}

	toString = (): string => {
		const shape = this.syntax.shape !== undefined ? this.syntax.shape + ' ' : '';
		const size = this.syntax.size !== undefined && this.syntax.size !== null ? this.syntax.size + ' ' : '';
		const at = this.syntax.at !== undefined && this.syntax.at.match(/at.+/) !== null ? this.syntax.at + ' ' : '';
		const colorStopList = [];
		for(const item of this.syntax.colorStopList) {
			colorStopList.push(item.join(' '));
		}
		const shapeOrSize = size !== '' ? size : shape;
		//const shapeSizeAt = shapeOrSize || at !== '' ? shapeOrSize + at + '\, ' : shapeOrSize + at;
		const shapeSizeAt = (shapeOrSize + at).trim().length > 0 ? shapeOrSize + at + '\, ' : shapeOrSize + at;
		const retStr = `${this.methodName}(${shapeSizeAt}${colorStopList.join(', ')})`;
		//console.log(retStr);
		return retStr;
	}
}


const isColor = (x: any): x is Color => x.match(/#.+|transparent/) !== null;


export type { RepeatingLinearGradient, LinearGradientSyntax, RepeatingConicGradient, ConicGradientSyntax, RepeatingRadialGradient, RadialGradientSyntax, MixGradientSyntax, ColorStop, ColorHint };
export { RepeatingLinearGradientImpl, RepeatingConicGradientImpl, RepeatingRadialGradientImpl, isColor };


/*//https://developer.mozilla.org/en-US/docs/Web/CSS/gradient/repeating-linear-gradient

<repeating-linear-gradient()> =
  repeating-linear-gradient( [ <linear-gradient-syntax> ] )

<linear-gradient-syntax> =
  [ <angle> | to <side-or-corner> ]? , <color-stop-list>

<side-or-corner> =
  [ left | right ]  ||
  [ top | bottom ]

<color-stop-list> =
  <linear-color-stop> , [ <linear-color-hint>? , <linear-color-stop> ]#

<linear-color-stop> =
  <color> <length-percentage>?

<linear-color-hint> =
  <length-percentage>

<length-percentage> =
  <length>      |
  <percentage>
*/





/*//https://developer.mozilla.org/en-US/docs/Web/CSS/gradient/repeating-conic-gradient

<repeating-conic-gradient()> =
  repeating-conic-gradient( [ <conic-gradient-syntax> ] )

<conic-gradient-syntax> =
  [ [ [ from <angle> ]? [ at <position> ]? ] || <color-interpolation-method> ]? , <angular-color-stop-list>

<position> =
  [ left | center | right | top | bottom | <length-percentage> ]  |
  [ left | center | right ] && [ top | center | bottom ]  |
  [ left | center | right | <length-percentage> ] [ top | center | bottom | <length-percentage> ]  |
  [ [ left | right ] <length-percentage> ] && [ [ top | bottom ] <length-percentage> ]

<color-interpolation-method> =
  in [ <rectangular-color-space> | <polar-color-space> <hue-interpolation-method>? ]

<angular-color-stop-list> =
  <angular-color-stop> , [ <angular-color-hint>? , <angular-color-stop> ]#

<length-percentage> =
  <length>      |
  <percentage>

<rectangular-color-space> =
  srgb          |
  srgb-linear   |
  display-p3    |
  a98-rgb       |
  prophoto-rgb  |
  rec2020       |
  lab           |
  oklab         |
  xyz           |
  xyz-d50       |
  xyz-d65

<polar-color-space> =
  hsl    |
  hwb    |
  lch    |
  oklch

<hue-interpolation-method> =
  [ shorter | longer | increasing | decreasing ] hue

<angular-color-stop> =
  <color> <color-stop-angle>?

<angular-color-hint> =
  <angle-percentage>

<color-stop-angle> =
  <angle-percentage>{1,2}

<angle-percentage> =
  <angle>       |
  <percentage>

*/





/*//https://developer.mozilla.org/en-US/docs/Web/CSS/gradient/repeating-radial-gradient

<repeating-radial-gradient()> =
  repeating-radial-gradient( [ <radial-gradient-syntax> ] )

<radial-gradient-syntax> =
  [ <radial-shape> || <radial-size> ]? [ at <position> ]? , <color-stop-list>

<radial-shape> =
  circle   |
  ellipse

<radial-size> =
  <radial-extent>               |
  <length [0,∞]>                |
  <length-percentage [0,∞]>{2}

<position> =
  [ left | center | right | top | bottom | <length-percentage> ]  |
  [ left | center | right ] && [ top | center | bottom ]  |
  [ left | center | right | <length-percentage> ] [ top | center | bottom | <length-percentage> ]  |
  [ [ left | right ] <length-percentage> ] && [ [ top | bottom ] <length-percentage> ]

<color-stop-list> =
  <linear-color-stop> , [ <linear-color-hint>? , <linear-color-stop> ]#

<radial-extent> =
  closest-corner   |
  closest-side     |
  farthest-corner  |
  farthest-side

<length-percentage> =
  <length>      |
  <percentage>

<linear-color-stop> =
  <color> <length-percentage>?

<linear-color-hint> =
  <length-percentage>
*/
