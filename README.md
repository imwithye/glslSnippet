## glslSnippet

GLSL Snippet is an embedded pixel shader editor. It uses the [Shadertoy](https://www.shadertoy.com) compatible API and creates beautiful glsl code snippet in the blog.

![Imgur](https://imgur.com/nWJGzY5.png)

Checkout the [demo](https://yiwei.dev/post/glsl-snippet/) here!

To build the project:

```
npm install
npm run make
```

Then include the JS and CSS file into your blog:

```html
<link rel="stylesheet" href="./dist/glslSnippet.css" />
<script defer src="./dist/glslSnippet.js"></script>
```

glslSnippet will auto create snippet on the element that has `glslSnippet` class.

```html
<div class="glslSnippet">
    <pre>
void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord/iResolution.xy;
    // Time varying pixel color
    vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));
    // Output to screen
    fragColor = vec4(col,1.0);
}
    </pre>
</div>
```
