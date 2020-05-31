module.exports = `
uniform vec2 iResolution;
uniform float iTime;
uniform float iTimeDelta;
uniform float iFrame;
uniform vec4 iMouse;

float glslSnippet_DistanceToLineSegment(vec2 p0, vec2 p1, vec2 p)
{
    vec2 ld = p0 - p1;
    vec2 pd = p - p1;
    return length(pd - ld*dot(pd, ld)/dot(ld, ld));    
}
`;