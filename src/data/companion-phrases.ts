import type { CompanionState } from "./characters";

export interface Phrase {
  text: string;
  state: CompanionState;
}

export const PHRASES: Record<string, Phrase[]> = {
  welcome: [
    {
      text: "Ты вернулась! Давай посмотрим, что сегодня предстоит. Не обязательно сделать всё идеально — главное, двигаться вперёд.",
      state: "welcome",
    },
    {
      text: "Новый день, новый шанс. Я готов сопровождать тебя сегодня!",
      state: "welcome",
    },
  ],
  taskStart: [
    {
      text: "Ну что, начинаем? Я верю, что ты справишься!",
      state: "motivation",
    },
    { text: "Один шаг за раз. Ты уже начала!", state: "motivation" },
  ],
  taskDone: [
    { text: "Отлично! Ещё одна задача позади!", state: "happy" },
    { text: "Ты справилась! Твой прогресс растёт!", state: "happy" },
    { text: "Вот это результат! Продолжай в своём темпе!", state: "happy" },
  ],
  allTasksDone: [
    {
      text: "Ты завершила сегодняшний план! Это действительно круто!",
      state: "celebrate",
    },
    {
      text: "Сегодня ты сделала многое. Не забывай, что отдых тоже часть прогресса!",
      state: "celebrate",
    },
  ],
  levelUp: [
    { text: "Уровень повышен! Твои усилия не прошли зря!", state: "levelup" },
    {
      text: "Смотри, мы стали сильнее! Следующий уровень ждёт!",
      state: "levelup",
    },
  ],
  missed: [
    {
      text: "Не всё всегда получается по плану. Давай спокойно попробуем снова.",
      state: "motivation",
    },
    {
      text: "Не нужно догонять всё сразу. Выбери одну маленькую задачу.",
      state: "motivation",
    },
  ],
  returnAfterLongAbsence: [
    {
      text: "Рада видеть тебя снова! Не нужно начинать с нуля. Продолжим с того места, где тебе удобно.",
      state: "welcome",
    },
  ],
  focusStart: [
    {
      text: "Сосредоточься на одной вещи. Остальное подождёт.",
      state: "focus",
    },
  ],
  focusDone: [
    {
      text: "Ты заслужила паузу. Отдохни и возвращайся, когда будешь готова.",
      state: "rest",
    },
    { text: "Перерыв тоже входит в твой план.", state: "rest" },
  ],
  habitDone: [
    {
      text: "Привычка выполнена! Это кирпичик в твоём фундаменте.",
      state: "happy",
    },
  ],
  achievement: [
    { text: "Новое достижение! Я горжусь тобой!", state: "celebrate" },
  ],
  motivation: [
    { text: "Ты сильнее, чем думаешь. Просто продолжай.", state: "motivation" },
    {
      text: "Помни: каждый день — ступенька. Не сдавайся.",
      state: "motivation",
    },
  ],
  idle: [{ text: "Тихо. Спокойно. Дыши.", state: "idle" }],
  streak: [
    {
      text: "Ты держишь серию! Это дисциплина в чистом виде.",
      state: "streak",
    },
  ],
};

export function pickPhrase(key: keyof typeof PHRASES): Phrase {
  const arr = PHRASES[key] || PHRASES.idle;
  return arr[Math.floor(Math.random() * arr.length)];
}
