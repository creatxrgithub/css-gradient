# css-gradient
css gradient encapsulation

https://developer.mozilla.org/en-US/docs/Web/CSS/gradient/repeating-linear-gradient

https://developer.mozilla.org/en-US/docs/Web/CSS/gradient/repeating-conic-gradient

https://developer.mozilla.org/en-US/docs/Web/CSS/gradient/repeating-radial-gradient

## export from gradient.ts
method parse() is to convert css function string to syntax object.
method toString() is to output function string for css.
```
type RepeatingLinearGradient = {
	methodName: 'repeating-linear-gradient';
	syntax: LinearGradientSyntax;
	parse: (expression: `repeating-linear-gradient(${string})`) => RepeatingLinearGradient;
	toString: () => string;
}

type RepeatingConicGradient = {
	methodName: 'repeating-conic-gradient';
	syntax: ConicGradientSyntax;
	parse: (expression: `repeating-conic-gradient(${string})`) => RepeatingConicGradient;
	toString: () => string;
}

type RepeatingRadialGradient = {
	methodName: 'repeating-radial-gradient';
	syntax: RadialGradientSyntax;
	parse: (expression: `repeating-radial-gradient(${string})`) => RepeatingRadialGradient;
	toString: () => string;
}

... ...

export type { RepeatingLinearGradient, LinearGradientSyntax, RepeatingConicGradient, ConicGradientSyntax, RepeatingRadialGradient, RadialGradientSyntax, MixGradientSyntax, ColorStop, ColorHint };
export { RepeatingLinearGradientImpl, RepeatingConicGradientImpl, RepeatingRadialGradientImpl, isColor };
```

## use case
```
const mixGradientSyntax: MixGradientSyntax = reactive({
	angle: undefined,
	to: undefined,
	from: undefined,
	at: undefined,
	shape: undefined,
	size: undefined,
	colorStopList: [['#ff0000', '10%', '20%'], ['50%'], ['#00ff00', '30%'], ['transparent'], ['#0000ff']]
});


watch([curGradient, mixGradientSyntax], async(newVal, oldVal) => {
	//console.log(newVal, oldVal);
	switch(curGradient.value) {
		case 'repeating-conic-gradient':
			const conic = new RepeatingConicGradientImpl();
			conic.syntax = mixGradientSyntax;
			gradientEffect.backgroundImage = conic.toString();
			//console.log('conic......', conic.toString());
			break;
		case 'repeating-linear-gradient':
			const linear = new RepeatingLinearGradientImpl();
			linear.syntax = mixGradientSyntax;
			gradientEffect.backgroundImage = linear.toString();
			//console.log('linear......', linear.toString());
			break;
		case 'repeating-radial-gradient':
			const radial = new RepeatingRadialGradientImpl();
			radial.syntax = mixGradientSyntax;
			gradientEffect.backgroundImage = radial.toString();
			//console.log('radial......', radial.toString());
			break;
	}
}, { deep: true });
```
