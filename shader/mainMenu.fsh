// Author: Patricio Gonzalez Vivo
// Title: PICES


#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define PI 3.14159265359	
#define TWO_PI 6.28318530718


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;




vec2 polarCoords(vec2 st) {
	st = vec2(0.5)-st;
    float r = dot(st,st);
    float a = atan(st.y,st.x);
    return vec2(a,r);
}

float cosLine(vec2 st, float freq, float width) {
    float d = (cos(st.x*50.)*.727*freq)+0.9;
    return smoothstep(d-width,d,st.y)-smoothstep(d,d+width,st.y);
}

void main() {
	vec2 st = gl_FragCoord.xy/resolution.xy;
    st = (st-.5)*2.360+.5;
    if (resolution.y > resolution.x ) {
        st.y *= resolution.y/resolution.x;
        st.y -= (resolution.y*.5-resolution.x*.5)/resolution.x;
    } else {
        st.x *= resolution.x/resolution.y;
        st.x -= (resolution.x*.5-resolution.y*.5)/resolution.y;
    }
    
	vec3 color = vec3(0.0);
    
    float width = 0.02;
    float t = time*.2;
    
    vec2 polar = polarCoords(st);
    
    float m = abs(mod(polar.x+t,PI))/PI;
    color += cosLine(polar,m,0.02)-m;

    polar.x += .31415;
    color = max(color,vec3(1.0)*cosLine(polar,m,0.022)*(1.-m));
    
    polar.x += .31415;
    color = max(color,vec3(1.0)*cosLine(polar,m,0.025)*(1.-m));
    

	gl_FragColor = vec4( color, 1.0 );
}
