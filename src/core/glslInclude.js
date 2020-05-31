module.exports = `
uniform vec2 iResolution;
uniform float iTime;
uniform float iTimeDelta;
uniform float iFrame;
uniform vec4 iMouse;
uniform vec4 iPlot;

float DistanceToLine(vec2 p0, vec2 p1, vec2 p)
{
    p0 = ((p0 - iPlot.xy) + iPlot.zw) / (iPlot.zw * 2.) * iResolution.xy;
    p1 = ((p1 - iPlot.xy) + iPlot.zw) / (iPlot.zw * 2.) * iResolution.xy;
    p = ((p - iPlot.xy) + iPlot.zw) / (iPlot.zw * 2.) * iResolution.xy;
    vec2 ld = p0 - p1;
    vec2 pd = p - p1;
    return length(pd - ld*clamp(dot(pd, ld)/dot(ld, ld), 0.0, 1.0)); 
}

#define DistanceToFunc(Func, p, dist)                                             \\
{                                                                                 \\
    float xDelta = iPlot.z * 2. / iResolution.x;                                  \\
    float offset = xDelta * -2.;                                                  \\
    vec2 p0 = vec2(p.x + offset, Func(p.x + offset));                             \\
    vec2 p1 = vec2(p.x + offset + xDelta, Func(p.x + offset + xDelta));           \\
    dist = DistanceToLine(p0, p1, p);                                             \\
    offset = xDelta * -1.;                                                        \\
    p0 = vec2(p.x + offset, Func(p.x + offset));                                  \\
    p1 = vec2(p.x + offset + xDelta, Func(p.x + offset + xDelta));                \\
    dist = min(dist, DistanceToLine(p0, p1, p));                                  \\
    offset = xDelta * 0.;                                                         \\
    p0 = vec2(p.x + offset, Func(p.x + offset));                                  \\
    p1 = vec2(p.x + offset + xDelta, Func(p.x + offset + xDelta));                \\
    dist = min(dist, DistanceToLine(p0, p1, p));                                  \\
    offset = xDelta * 1.;                                                         \\
    p0 = vec2(p.x + offset, Func(p.x + offset));                                  \\
    p1 = vec2(p.x + offset + xDelta, Func(p.x + offset + xDelta));                \\
    dist = min(dist, DistanceToLine(p0, p1, p));                                  \\
    offset = xDelta * 2.;                                                         \\
    p0 = vec2(p.x + offset, Func(p.x + offset));                                  \\
    p1 = vec2(p.x + offset + xDelta, Func(p.x + offset + xDelta));                \\
    dist = min(dist, DistanceToLine(p0, p1, p));                                  \\
}

#define Plot(Func, fragCoord, col)                                                \\
{                                                                                 \\
    vec2 uv = fragCoord / iResolution.xy;                                         \\
    vec2 range = vec2(iPlot.z * 2., iPlot.w * 2.);                                \\
    vec2 p = uv * range - range / 2. + iPlot.xy;                                  \\
    float dist = 0.;                                                              \\
    DistanceToFunc(Func, p, dist);                                                \\
    float intensity = smoothstep(0., 1., 1. - dist);                              \\
    col *= pow(intensity, 1./2.2);                                                \\
}

#define PlotGrid(fragCoord, col)                                                  \\
{                                                                                 \\
    vec2 uv = fragCoord / iResolution.xy;                                         \\
    vec2 p = abs(uv - 0.5 + iPlot.xy / (iPlot.zw * 2.));                          \\
    vec2 dist = 1. / iResolution * 1. - p;                                        \\
    col *= clamp(step(0., dist.x) + step(0., dist.y), 0., 1.);                    \\
}
`;
