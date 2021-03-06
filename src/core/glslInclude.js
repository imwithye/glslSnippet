module.exports = `
uniform vec2 iResolution;
uniform float iTime;
uniform float iTimeDelta;
uniform float iFrame;
uniform vec4 iMouse;
uniform vec4 iPlot;

float _glslSnippet_distanceToLine(vec2 p0, vec2 p1, vec2 p)
{
    p0 = (p0 - iPlot.xy + iPlot.zw) / (iPlot.zw * 2.) * iResolution.xy;
    p1 = (p1 - iPlot.xy + iPlot.zw) / (iPlot.zw * 2.) * iResolution.xy;
    p = (p - iPlot.xy + iPlot.zw) / (iPlot.zw * 2.) * iResolution.xy;
    vec2 ld = p0 - p1;
    vec2 pd = p - p1;
    return length(pd - ld*clamp(dot(pd, ld)/dot(ld, ld), 0.0, 1.0)); 
}

#define _glslSnippet_distanceToFunc_d(s, d, Func)                                 \\
{                                                                                 \\
    offset = xDelta * s;                                                          \\
    p0 = vec2(p.x + offset, Func(p.x + offset));                                  \\
    p1 = vec2(p.x + offset + xDelta, Func(p.x + offset + xDelta));                \\
    dist = min(d, _glslSnippet_distanceToLine(p0, p1, p));                        \\
}

#define _glslSnippet_distanceToFunc(Func, p, dist)                                \\
{                                                                                 \\
    float xDelta = iPlot.z * 2. / iResolution.x;                                  \\
    float offset; vec2 p0; vec2 p1;                                               \\
    float maxValue = max(iPlot.z * 2., iPlot.w * 2.);                             \\
    _glslSnippet_distanceToFunc_d(-2., maxValue, Func);                           \\
    _glslSnippet_distanceToFunc_d(-1., dist, Func);                               \\
    _glslSnippet_distanceToFunc_d( 0., dist, Func);                               \\
    _glslSnippet_distanceToFunc_d( 1., dist, Func);                               \\
    _glslSnippet_distanceToFunc_d( 2., dist, Func);                               \\
}

#define _glslSnippet_distanceToInlineFunc_d(s, d, Func)                           \\
{                                                                                 \\
    offset = xDelta * s;                                                          \\
    x = p.x + offset;                                                             \\
    p0 = vec2(p.x + offset, Func);                                                \\
    x = p.x + offset + xDelta;                                                    \\
    p1 = vec2(p.x + offset + xDelta, Func);                                       \\
    dist = min(d, _glslSnippet_distanceToLine(p0, p1, p));                        \\
}

#define _glslSnippet_distanceToInlineFunc(Func, p, dist)                          \\
{                                                                                 \\
    float xDelta = iPlot.z * 2. / iResolution.x;                                  \\
    float offset; float x; vec2 p0; vec2 p1;                                      \\
    float maxValue = max(iPlot.z * 2., iPlot.w * 2.);                             \\
    _glslSnippet_distanceToInlineFunc_d(-2., maxValue, Func);                     \\
    _glslSnippet_distanceToInlineFunc_d(-1., dist, Func);                         \\
    _glslSnippet_distanceToInlineFunc_d( 0., dist, Func);                         \\
    _glslSnippet_distanceToInlineFunc_d( 1., dist, Func);                         \\
    _glslSnippet_distanceToInlineFunc_d( 2., dist, Func);                         \\
}

float _glslSnippet_gridIntensity(vec2 fragCoord, float gridLength)
{
    vec2 uv = fragCoord / iResolution.xy;
    vec2 p = uv * iPlot.zw * 2. - iPlot.zw + iPlot.xy;
    vec2 pv = (0.5*gridLength-abs(0.5*gridLength-mod(p, gridLength))) / (iPlot.zw * 2.);
    vec2 dist = 1. / iResolution * 0.5 - pv;
    float i = clamp(step(0., dist.x) + step(0., dist.y), 0., 1.);
    pv = abs(uv - 0.5 + iPlot.xy / (iPlot.zw * 2.));
    dist = 1. / iResolution * 1. - pv;
    i += clamp(step(0., dist.x) + step(0., dist.y), 0., 1.);
    return clamp(i, 0., 1.);
}

void plotg(vec2 fragCoord, inout vec3 col)
{
    col*=_glslSnippet_gridIntensity(fragCoord, 1.0);
}

void plotg(vec2 fragCoord, inout vec4 col)
{
    col*=_glslSnippet_gridIntensity(fragCoord, 1.0);
}

#define plot(Func, fragCoord, col)                                                \\
{                                                                                 \\
    vec2 uv = fragCoord / iResolution.xy;                                         \\
    vec2 range = vec2(iPlot.z * 2., iPlot.w * 2.);                                \\
    vec2 p = uv * range - range / 2. + iPlot.xy;                                  \\
    float dist = 0.;                                                              \\
    _glslSnippet_distanceToFunc(Func, p, dist);                                   \\
    float intensity = smoothstep(0., 1., 1. - dist);                              \\
    col *= pow(intensity, 1./2.2);                                                \\
}

#define plotl(Func, fragCoord, col)                                               \\
{                                                                                 \\
    vec2 uv = fragCoord / iResolution.xy;                                         \\
    vec2 range = vec2(iPlot.z * 2., iPlot.w * 2.);                                \\
    vec2 p = uv * range - range / 2. + iPlot.xy;                                  \\
    float dist = 0.;                                                              \\
    _glslSnippet_distanceToInlineFunc(Func, p, dist);                             \\
    float intensity = smoothstep(0., 1., 1. - dist);                              \\
    col *= pow(intensity, 1./2.2);                                                \\
}
`;
