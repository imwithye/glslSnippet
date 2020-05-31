const glslInclude = require("./glslInclude");

const VertBuffer = {
  pos: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0],
};
const VertCode = `
#version 300 es
layout(location = 0) in vec4 pos;
void main() { 
  gl_Position = pos;
}`;

const VertCodeGL1 = `
attribute vec4 pos;

void main() { 
  gl_Position = pos;
}`;

const FragCodeError = `
#version 300 es

precision highp float;

out vec4 FragColor;

void main() {
  FragColor = vec4(1, 0, 1, 1);
}`;

const FragCodeErrorGL1 = `
precision mediump float;

void main() {
  gl_FragColor = vec4(1, 0, 1, 1);
}`;

const FragCodeHeader = `
#version 300 es

#define WebGL2

precision highp float;
out vec4 FragColor;

${glslInclude}

`;

const FragCodeHeaderGL1 = `
#define WebGL1

precision highp float;

${glslInclude}

`;

const FragCodeFooter = `
  
void main() {
    mainImage(FragColor, gl_FragCoord.xy);
}
`;

const FragCodeFooterGL1 = `

void main() {
    vec4 fragColor = vec4(0, 0, 0, 1);
    vec2 fragCoord = gl_FragCoord.xy;
    mainImage(fragColor, fragCoord);
    gl_FragColor = fragColor;
}
`;

module.exports = {
  VertBuffer,
  VertCode,
  VertCodeGL1,
  FragCodeError,
  FragCodeErrorGL1,
  FragCodeHeader,
  FragCodeHeaderGL1,
  FragCodeFooter,
  FragCodeFooterGL1,
};
