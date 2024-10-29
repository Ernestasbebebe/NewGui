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
    vec2 coord = gl_TexCoord[0].st * size;
    vec2 centre = .5f * size;
    float alphaValue;

    if (coord.x < centre.x && coord.y < centre.y) {
        alphaValue = alpha(centre - coord, centre - 1.f, round.x);
    } else if (coord.x >= centre.x && coord.y < centre.y) {
        alphaValue = alpha(coord - centre, centre - 1.f, round.y);
    } else if (coord.x < centre.x && coord.y >= centre.y) {
        alphaValue = alpha(centre - coord, centre - 1.f, round.z);
    } else {
        alphaValue = alpha(coord - centre, centre - 1.f, round.w);
    }

    vec4 topColor = mix(color1, color2, smoothstep(0.0, 1.0, coord.x / size.x));
    vec4 bottomColor = mix(color3, color4, smoothstep(0.0, 1.0, coord.x / size.x));
    vec4 finalColor = mix(topColor, bottomColor, smoothstep(0.0, 1.0, coord.y / size.y));

    gl_FragColor = vec4(finalColor.rgb, finalColor.a * (1.f - smoothstep(smoothness.x, smoothness.y, abs(alphaValue))));
}
