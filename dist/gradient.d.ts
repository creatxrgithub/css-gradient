type LengthPercentage = `${number}%` | `${number}px`;
type Angle = `${number}deg`;
type HorizontalAlignment = 'left' | 'right';
type VerticalAlignment = 'top' | 'bottom';
type SideOrCorner = `${HorizontalAlignment} ${VerticalAlignment}`;
type ToDirection = `to ${HorizontalAlignment | VerticalAlignment | SideOrCorner}`;
type Color = `#${string}` | 'transparent' | `rgb(${number},${number},${number})` | `rgba(${number},${number},${number},${number})`;
type ColorStop = [Color, LengthPercentage?, LengthPercentage?];
type ColorHint = [LengthPercentage];
type LinearGradientSyntax = {
    angle?: Angle;
    to?: ToDirection;
    colorStopList: (ColorStop | ColorHint)[];
};
type RepeatingLinearGradient = {
    methodName: 'repeating-linear-gradient';
    syntax: LinearGradientSyntax;
    parse: (expression: `repeating-linear-gradient(${string})`) => RepeatingLinearGradient;
    toString: () => string;
};
type Position = [LengthPercentage] | [LengthPercentage, LengthPercentage] | [`${HorizontalAlignment} ${LengthPercentage}`] | [`${VerticalAlignment} ${LengthPercentage}`] | [`${HorizontalAlignment} ${LengthPercentage}`, `${VerticalAlignment} ${LengthPercentage}`];
type FromAngle = `from ${Angle}`;
type Stringable = string | number | bigint | boolean | null | undefined;
type Join<A, Sep extends string = "", R extends string = ""> = A extends [infer First, ...infer Rest] ? Join<Rest, Sep, R extends "" ? `${First & Stringable}` : `${R}${Sep}${First & Stringable}`> : R;
type AtPosition = `at ${Join<Position, ' '>}`;
type ConicGradientSyntax = {
    from?: FromAngle;
    at?: AtPosition;
    colorStopList: (ColorStop | ColorHint)[];
};
type RepeatingConicGradient = {
    methodName: 'repeating-conic-gradient';
    syntax: ConicGradientSyntax;
    parse: (expression: `repeating-conic-gradient(${string})`) => RepeatingConicGradient;
    toString: () => string;
};
type RadialShape = 'circle' | 'ellipse';
type RadialExtent = 'closest-corner' | 'closest-side' | 'farthest-corner' | 'farthest-side';
type RadialSize = number | LengthPercentage | RadialExtent;
type RadialGradientSyntax = {
    shape?: RadialShape;
    size?: RadialSize;
    at?: AtPosition;
    colorStopList: (ColorStop | ColorHint)[];
};
type RepeatingRadialGradient = {
    methodName: 'repeating-radial-gradient';
    syntax: RadialGradientSyntax;
    parse: (expression: `repeating-radial-gradient(${string})`) => RepeatingRadialGradient;
    toString: () => string;
};
type MixGradientSyntax = LinearGradientSyntax & ConicGradientSyntax & RadialGradientSyntax;
declare class RepeatingLinearGradientImpl implements RepeatingLinearGradient {
    methodName: 'repeating-linear-gradient';
    constructor();
    syntax: LinearGradientSyntax;
    parse: (expression: `repeating-linear-gradient(${string})`) => RepeatingLinearGradient;
    toString: () => string;
}
declare class RepeatingConicGradientImpl implements RepeatingConicGradient {
    methodName: 'repeating-conic-gradient';
    constructor();
    syntax: ConicGradientSyntax;
    parse: (expression: `repeating-conic-gradient(${string})`) => RepeatingConicGradient;
    toString: () => string;
}
declare class RepeatingRadialGradientImpl implements RepeatingRadialGradient {
    methodName: 'repeating-radial-gradient';
    constructor();
    syntax: RadialGradientSyntax;
    parse: (expression: `repeating-radial-gradient(${string})`) => RepeatingRadialGradient;
    toString: () => string;
}
declare const isColor: (x: any) => x is Color;

export { type ColorHint, type ColorStop, type ConicGradientSyntax, type LinearGradientSyntax, type MixGradientSyntax, type RadialGradientSyntax, type RepeatingConicGradient, RepeatingConicGradientImpl, type RepeatingLinearGradient, RepeatingLinearGradientImpl, type RepeatingRadialGradient, RepeatingRadialGradientImpl, isColor };
