#version 330 core

out vec4 FragColor;

in vec2 TexCoords;

uniform vec2 resolution;
uniform float time;

vec3 getBubbleColor(vec2 uv) {
    // Делаем центр пузыря и перемещаем UV координаты
    vec2 center = vec2(0.5, 0.5);
    vec2 displacement = uv - center;
    
    // Переливы цвета на основе синусоидальных волн
    float dist = length(displacement);
    float wave = sin(dist * 20.0 - time * 2.0) * 0.1;
    
    // Радужный градиент
    vec3 color1 = vec3(0.2, 0.5, 1.0); // Голубой
    vec3 color2 = vec3(1.0, 0.7, 0.2); // Оранжевый
    vec3 color3 = vec3(0.9, 0.9, 1.0); // Белый
    
    vec3 rainbow = mix(color1, color2, wave + 0.5);
    rainbow = mix(rainbow, color3, dist);

    // Добавляем эффект отражения и прозрачности
    float reflection = pow(1.0 - dist, 3.0);
    vec3 reflectionColor = vec3(1.0);
    
    return mix(rainbow, reflectionColor, reflection);
}

void main() {
    // Нормализуем координаты и задаем вектор UV
    vec2 uv = TexCoords.xy / resolution.xy;
    
    // Получаем цвет для пузыря
    vec3 bubbleColor = getBubbleColor(uv);
    
    // Прозрачность по краям пузыря
    float alpha = smoothstep(0.5, 0.52, length(uv - vec2(0.5)));
    
    FragColor = vec4(bubbleColor, alpha);
}
