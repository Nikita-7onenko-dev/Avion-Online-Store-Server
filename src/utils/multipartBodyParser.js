export default function parseMultipartBody(body) {
  const parsed = {};

  for (const key in body) {
    let value = body[key];

    // Пробуем распарсить JSON, если это массив или объект
    if (typeof value === 'string' && (value.trim().startsWith('[') || value.trim().startsWith('{'))) {
      try {
        value = JSON.parse(value);
      } catch (e) {
        // если парсинг не удался, оставляем как есть
      }
    }

    // Если это число в строке — приводим к числу
    if (typeof value === 'string' && !isNaN(value) && value.trim() !== '') {
      value = Number(value);
    }

    parsed[key] = value;
  }

  return parsed;
}