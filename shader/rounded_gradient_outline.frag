#version 120

uniform vec4 round;          // Радиус скругления углов
uniform float thickness;      // Толщина границы
uniform vec2 size;            // Размер объекта
uniform vec4 colorTopLeft;    // Цвет левого верхнего угла
uniform vec4 colorTopRight;   // Цвет правого верхнего угла
uniform vec4 colorBottomLeft; // Цвет левого нижнего угла
uniform vec4 colorBottomRight;// Цвет правого нижнего угла

// Функция для расчёта альфа-значения (прозрачности) на основе координат и скругления
float alpha(vec2 d, vec2 d1, float round) {
	vec2 v = abs(d) - d1 + round;
	return min(max(v.x, v.y), 0.0) + length(max(v, .0f)) - round;
}

void main() {
    // Координаты текущего фрагмента
    vec2 coord = gl_TexCoord[0].st * size;
    vec2 centre = .5f * size;
    float alphaValue;

    // Рассчитываем альфа-значение в зависимости от того, в какой четверти находится фрагмент
    if (coord.x < centre.x && coord.y < centre.y) {
        alphaValue = alpha(centre - coord, centre - 1.f, round.x);
    } else if (coord.x >= centre.x && coord.y < centre.y) {
        alphaValue = alpha(coord - centre, centre - 1.f, round.y);
    } else if (coord.x < centre.x && coord.y >= centre.y) {
        alphaValue = alpha(centre - coord, centre - 1.f, round.z);
    } else {
        alphaValue = alpha(coord - centre, centre - 1.f, round.w);
    }

    // Интерполяция цвета на основе положения фрагмента
    vec4 colorTop = mix(colorTopLeft, colorTopRight, coord.x / size.x);
    vec4 colorBottom = mix(colorBottomLeft, colorBottomRight, coord.x / size.x);
    vec4 finalColor = mix(colorBottom, colorTop, coord.y / size.y);

    // Применяем альфа-канал с плавным переходом
    vec2 smoothness = vec2(thickness - 1.5f, thickness);
    gl_FragColor = vec4(finalColor.rgb, finalColor.a * (1.f - smoothstep(smoothness.x, smoothness.y, abs(alphaValue))));
}
