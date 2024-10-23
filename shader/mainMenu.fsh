#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

struct Particle {
    vec2 position;
    vec2 velocity;
    float radius;
    vec3 color;
};

// Функция для генерации случайного числа
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// Функция для рендеринга круга
float circle(vec2 st, vec2 pos, float radius) {
    return smoothstep(radius + 0.01, radius, length(st - pos));
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    
    vec3 color = vec3(0.0);

    int numParticles = 100;
    
    for (int i = 0; i < numParticles; i++) {
        // Генерация случайных начальных позиций частиц
        vec2 pos = vec2(random(vec2(float(i), 0.0)), random(vec2(float(i), 1.0)));
        pos = pos * u_resolution.xy / u_resolution.y;
        
        // Скорость частиц
        vec2 velocity = vec2(0.5, 0.5) * (sin(u_time + float(i)) * 2.0 - 1.0);
        
        // Радиус частиц
        float radius = 0.01 + random(vec2(float(i), u_time)) * 0.02;
        
        // Смещение по времени
        pos += velocity * u_time;
        
        // Плавное соединение круга и цвета
        color += vec3(1.0, 1.0, 1.0) * circle(st, pos, radius);
    }

    gl_FragColor = vec4(color, 1.0);
}
