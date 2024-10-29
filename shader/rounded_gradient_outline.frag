#version 120

uniform vec4 round;
uniform float thickness;
uniform vec2 size;
uniform vec4 color1;
uniform vec4 color2;
uniform vec4 color3;
uniform vec4 color4;

float alpha(vec2 d, vec2 d1, float round) {
    vec2 v = abs(d) - d1 + round;
    return min(max(v.x, v.y), 0.0) + length(max(v, .0f)) - round;
}

void main() {
    vec2 coord = gl_TexCoord[0].st  size;
    vec2 centre = 0.5  size;
    float alphaValue;
    vec4 color;

    if (coord.x  centre.x && coord.y  centre.y) {
        alphaValue = alpha(centre - coord, centre - 1.0, round.x);
        color = color1;
    } else if (coord.x = centre.x && coord.y  centre.y) {
        alphaValue = alpha(coord - centre, centre - 1.0, round.y);
        color = color2;
    } else if (coord.x  centre.x && coord.y = centre.y) {
        alphaValue = alpha(centre - coord, centre - 1.0, round.z);
        color = color3;
    } else {
        alphaValue = alpha(coord - centre, centre - 1.0, round.w);
        color = color4;
    }

    vec2 mixFactor = coord  size;
    vec4 topColor = mix(color1, color2, mixFactor.x);
    vec4 bottomColor = mix(color3, color4, mixFactor.x);
    vec4 finalColor = mix(topColor, bottomColor, mixFactor.y);

    vec2 smoothness = vec2(thickness - 1.5, thickness);
    gl_FragColor = vec4(finalColor.rgb, finalColor.a  (1.0 - smoothstep(smoothness.x, smoothness.y, abs(alphaValue))));
}
