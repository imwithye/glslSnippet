module.exports = `
uniform vec2 iResolution;
uniform float iTime;
uniform float iTimeDelta;
uniform float iFrame;
uniform vec4 iMouse;

vec4 iPlot = vec4(0., 0., 1, 1);

float DistanceToLine(vec2 p0, vec2 p1, vec2 p)
{
    vec2 ld = p0 - p1;
    vec2 pd = p - p1;
    return length(pd - ld*dot(pd, ld)/dot(ld, ld));    
}

#define DistanceToFunc(Func, p, dist)                                             \\
{                                                                                 \\
    float xDelta = iPlot.z * 2. / iResolution.x;                                  \\
    float offset = xDelta * -3.;                                                  \\
    vec2 p0 = vec2(p.x + offset, Func(p.x + offset));                             \\
    vec2 p1 = vec2(p.x + offset + xDelta, Func(p.x + offset + xDelta));           \\
    dist = DistanceToLine(p0, p1, p);                                             \\
    offset = xDelta * -2.;                                                        \\
    p0 = vec2(p.x + offset, Func(p.x + offset));                                  \\
    p1 = vec2(p.x + offset + xDelta, Func(p.x + offset + xDelta));                \\
    dist = DistanceToLine(p0, p1, p);                                             \\
    offset = xDelta * -1.;                                                        \\
    p0 = vec2(p.x + offset, Func(p.x + offset));                                  \\
    p1 = vec2(p.x + offset + xDelta, Func(p.x + offset + xDelta));                \\
    dist = DistanceToLine(p0, p1, p);                                             \\
    offset = xDelta * 0.;                                                         \\
    p0 = vec2(p.x + offset, Func(p.x + offset));                                  \\
    p1 = vec2(p.x + offset + xDelta, Func(p.x + offset + xDelta));                \\
    dist = DistanceToLine(p0, p1, p);                                             \\
    offset = xDelta * 1.;                                                         \\
    p0 = vec2(p.x + offset, Func(p.x + offset));                                  \\
    p1 = vec2(p.x + offset + xDelta, Func(p.x + offset + xDelta));                \\
    dist = DistanceToLine(p0, p1, p);                                             \\
    offset = xDelta * 2.;                                                         \\
    p0 = vec2(p.x + offset, Func(p.x + offset));                                  \\
    p1 = vec2(p.x + offset + xDelta, Func(p.x + offset + xDelta));                \\
    dist = DistanceToLine(p0, p1, p);                                             \\
    offset = xDelta * 3.;                                                         \\
    p0 = vec2(p.x + offset, Func(p.x + offset));                                  \\
    p1 = vec2(p.x + offset + xDelta, Func(p.x + offset + xDelta));                \\
    dist = DistanceToLine(p0, p1, p);                                             \\
}

#define Plot(Func, fragCoord, col)                                                \\
{                                                                                 \\
    vec2 uv = fragCoord / iResolution.xy;                                         \\
    vec2 range = vec2(iPlot.z * 2., iPlot.w * 2.);                                \\
    vec2 p = uv * range - range / 2. + iPlot.xy;                                  \\
    vec2 f = vec2(p.x, Func(p.x));                                                \\
    vec2 pv = uv * iResolution.xy;                                                \\
    vec2 fv = ((f - iPlot.xy) + range / 2.) / range * iResolution.xy;             \\
    float distp = length(pv - fv);                                                \\
    float dist = 0.;                                                              \\
    DistanceToFunc(Func, p, dist);                                                \\
    float intensity = smoothstep(0., 1., 1. - distp / 1.2);                       \\
    col *= pow(intensity, 1./2.2);                                                \\
}
`;