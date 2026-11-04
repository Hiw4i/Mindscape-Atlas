/**
 * Демонстрационный контент: структура тем, теги, источники, мифы,
 * состояния, связи и идеи. Помечается флагом isDemo и может быть
 * удалён или отредактирован в админ-панели.
 */

export interface SeedTopic {
  key: string;
  slug: string;
  title: string;
  description?: string;
  icon?: string;
  parentKey?: string;
}

export const SEED_TOPICS: SeedTopic[] = [
  // Разделы
  { key: "love", slug: "love", title: `Любовь и отношения`, icon: "heart", description: `Влюблённость, симпатия, привязанность, ревность, взаимность, расставания, выбор партнёра.` },
  { key: "social", slug: "social", title: `Общение и люди`, icon: "chat", description: `Социальная тревожность, страх критики, уверенность, границы, конфликты, дружба.` },
  { key: "mind", slug: "mind", title: `Мышление и иллюзии`, icon: "brain", description: `Когнитивные искажения, самообман, убеждения, ошибки восприятия и мышления.` },
  { key: "emotion", slug: "emotion", title: `Эмоции и счастье`, icon: "smile", description: `Тревога, страхи, стыд, одиночество, счастье, смысл, принятие себя.` },
  { key: "growth", slug: "growth", title: `Развитие и прогресс`, icon: "trend", description: `Мотивация, дисциплина, прокрастинация, привычки, цели, перфекционизм.` },
  { key: "money", slug: "money", title: `Деньги и успех`, icon: "wallet", description: `Отношение к деньгам, статус, амбиции, неудачи, карьера, сравнение себя с другими.` },

  // Любовь и отношения
  { key: "simpatia", slug: "simpatia-i-vlechenie", title: `Симпатия и влечение`, parentKey: "love", description: `Как возникает интерес к человеку: контекст, близость, физиология.` },
  { key: "privyazannost", slug: "privyazannost", title: `Привязанность`, parentKey: "love", description: `Система привязанности: стратегии, тревожная и избегающая привязанность, близость.` },
  { key: "revnost", slug: "revnost", title: `Ревность`, parentKey: "love", description: `Угроза связи, самооценка и собственнические реакции.` },
  { key: "otklonenie", slug: "otklonenie-i-rasstavaniya", title: `Отвержение и расставания`, parentKey: "love", description: `Реакция на отказ, завершение отношений, восстановление.` },
  { key: "vybor-partnyora", slug: "vybor-partnyora", title: `Выбор партнёра`, parentKey: "love", description: `Сходство и совместимость, критерии, ловушки раннего периода.` },

  // Общение и люди
  { key: "sots-trevoga", slug: "sotsialnaya-trevoga", title: `Социальная тревожность`, parentKey: "social", description: `Страх оценки в присутствии других, самофокус, избегание.` },
  { key: "strah-kritiki", slug: "strah-kritiki", title: `Страх критики`, parentKey: "social", description: `Почему замечания задевают и что с этим делает самооценка.` },
  { key: "uverennost", slug: "uverennost", title: `Уверенность`, parentKey: "social", description: `Опоры уверенности: опыт, самоподдержка, право на ошибку.` },
  { key: "granitsy", slug: "granitsy", title: `Личные границы`, parentKey: "social", description: `Умение отказывать, защищать время и пространство.` },
  { key: "konflikty", slug: "konflikty", title: `Конфликты`, parentKey: "social", description: `Споры без разрушения связи: позиции, интересы, ремонт отношений.` },
  { key: "druzhba", slug: "druzhba", title: `Дружба`, parentKey: "social", description: `Как формируются и поддерживаются дружеские связи во взрослом возрасте.` },
  { key: "odobrenie", slug: "potrebnost-v-odobrenii", title: `Потребность в одобрении`, parentKey: "social", description: `Когда чужая оценка становится топливом, а когда ловушкой.` },

  // Мышление и иллюзии
  { key: "iskazheniya", slug: "kognitivnye-iskazheniya", title: `Когнитивные искажения`, parentKey: "mind", description: `Систематические ошибки мышления и их происхождение.` },
  { key: "samoobman", slug: "samoobman", title: `Самообман`, parentKey: "mind", description: `Как психика защищает образ себя и картину мира.` },
  { key: "ubezhdeniya", slug: "ubezhdeniya", title: `Убеждения`, parentKey: "mind", description: `Как формируются и держатся убеждения, включая неверные.` },
  { key: "vospriyatie", slug: "vospriyatie", title: `Восприятие реальности`, parentKey: "mind", description: `Ограничения восприятия: контекст, ожидания, память.` },

  // Эмоции и счастье
  { key: "trevoga", slug: "trevoga", title: `Тревога`, parentKey: "emotion", description: `Механизм тревоги: сигнал угрозы, тело, циклы проверки.` },
  { key: "strahi", slug: "strahi", title: `Страхи`, parentKey: "emotion", description: `Конкретные и социальные страхи, избегание и его цена.` },
  { key: "styd", slug: "styd-i-vina", title: `Стыд и вина`, parentKey: "emotion", description: `Два разных сообщения после ошибки и разные последствия.` },
  { key: "odinochestvo", slug: "odinochestvo", title: `Одиночество`, parentKey: "emotion", description: `Потребность в связи, качество контактов, хроническое одиночество.` },
  { key: "schaste", slug: "schaste", title: `Счастье`, parentKey: "emotion", description: `Что известно о благополучии: отношения, адаптация, смысл.` },
  { key: "samootsenka", slug: "samootsenka", title: `Самооценка`, parentKey: "emotion", description: `Внутренняя опора, условная ценность, отношение к себе.` },
  { key: "samoprinjatie", slug: "samoprinjatie", title: `Самопринятие`, parentKey: "emotion", description: `Принятие без смирения: работа с самокритикой.` },

  // Развитие и прогресс
  { key: "motivatsiya", slug: "motivatsiya", title: `Мотивация`, parentKey: "growth", description: `Внутренняя и внешняя мотивация, автономия, мастерство, смысл.` },
  { key: "privychki", slug: "disciplina-i-privychki", title: `Дисциплина и привычки`, parentKey: "growth", description: `Как формируются привычки и что делает дисциплину устойчивой.` },
  { key: "prokrastinatsiya", slug: "prokrastinatsiya", title: `Прокрастинация`, parentKey: "growth", description: `Откладывание как регуляция эмоций и способы запуска действия.` },
  { key: "tseli", slug: "tseli", title: `Цели`, parentKey: "growth", description: `Постановка и удержание целей, прогресс, пересмотр.` },
  { key: "perfekcionizm", slug: "perfekcionizm", title: `Перфекционизм`, parentKey: "growth", description: `Высокие стандарты и их цена: страх ошибки, откладывание.` },
  { key: "sravnenie", slug: "sravnenie-s-drugimi", title: `Сравнение с другими`, parentKey: "growth", description: `Восходящее и нисходящее сравнение, соцсети, зависть.` },

  // Деньги и успех
  { key: "dengi", slug: "dengi-i-blagopoluchie", title: `Деньги и благополучие`, parentKey: "money", description: `Что известно о связи дохода и удовлетворённости жизнью.` },
  { key: "status", slug: "status", title: `Статус`, parentKey: "money", description: `Социальное место, видимая успешность, цена статусных гонок.` },
  { key: "ambitsii", slug: "ambitsii", title: `Амбиции`, parentKey: "money", description: `Чужие и свои цели, ощущение должен добиться большего.` },
  { key: "neudachi", slug: "neudachi", title: `Неудачи`, parentKey: "money", description: `Реакция на провал, обучение на ошибках, самосострадание.` },
  { key: "karjera", slug: "karjera", title: `Карьера`, parentKey: "money", description: `Решения о работе, выгорание, смысл и деньги в труде.` },
];

export interface SeedTag {
  slug: string;
  name: string;
  synonyms?: string;
}

export const SEED_TAGS: SeedTag[] = [
  { slug: "trevoga", name: `тревога`, synonyms: `беспокойство, волнение` },
  { slug: "samootsenka", name: `самооценка`, synonyms: `уверенность в себе, ценность себя` },
  { slug: "privyazannost", name: `привязанность`, synonyms: `близость, отношения` },
  { slug: "kritika", name: `критика`, synonyms: `замечания, оценка, осуждение` },
  { slug: "motivatsiya", name: `мотивация`, synonyms: `желание, вдохновение` },
  { slug: "privychki", name: `привычки`, synonyms: `дисциплина, режим` },
  { slug: "schaste", name: `счастье`, synonyms: `удовлетворённость, благополучие` },
  { slug: "zavist", name: `зависть`, synonyms: `сравнение` },
  { slug: "styd", name: `стыд`, synonyms: `вина, самокритика` },
  { slug: "dengi", name: `деньги`, synonyms: `доход, финансы, богатство` },
  { slug: "status", name: `статус`, synonyms: `успех, признание` },
  { slug: "prokrastinatsiya", name: `прокрастинация`, synonyms: `откладывание` },
  { slug: "perfekcionizm", name: `перфекционизм`, synonyms: `идеальность, высокие стандарты` },
  { slug: "otnosheniya", name: `отношения`, synonyms: `партнёр, любовь` },
  { slug: "simpatiya", name: `симпатия`, synonyms: `нравиться, влечение, флирт` },
  { slug: "otklonenie", name: `отвержение`, synonyms: `отказ, разрыв` },
  { slug: "iskazheniya", name: `когнитивные искажения`, synonyms: `ошибки мышления, биасы` },
  { slug: "odinochestvo", name: `одиночество`, synonyms: `изоляция` },
];

export interface SeedSource {
  key: string;
  kind: string;
  title: string;
  author?: string;
  url?: string;
  description?: string;
}

export const SEED_SOURCES: SeedSource[] = [
  { key: "kahneman", kind: "book", title: `Думай медленно... решай быстро`, author: `Даниэль Канеман`, description: `Классическая работа о двух режимах мышления и систематических ошибках суждений. Основа статьи про когнитивные искажения.` },
  { key: "brown-gifts", kind: "book", title: `Дары несовершенства`, author: `Брене Браун`, description: `О стыде, уязвимости и самопринятии от исследовательницы, много лет изучающей эти темы.` },
  { key: "duwek", kind: "book", title: `Гибкое сознание`, author: `Кэрол Дуэк`, description: `О том, как убеждения о собственных способностях меняют поведение: модель фиксированного и растущего мышления.` },
  { key: "festinger-1959", kind: "research", title: `Cognitive consequences of forced compliance`, author: `Леон Фестингер, Джеймс Карлсмит (1959)`, url: "https://ru.wikipedia.org/wiki/Когнитивный_диссонанс", description: `Классический эксперимент о когнитивном диссонансе: люди меняют отношение к скучному делу, когда нет внешнего оправдания.` },
  { key: "dutton-aron-1974", kind: "research", title: `Ошибка атрибуции возбуждения (эксперимент с мостом)`, author: `Дональд Даттон, Артур Арон (1974)`, url: "https://en.wikipedia.org/wiki/Misattribution_of_arousal", description: `Эксперимент: физиологическое возбуждение от страха высоты ошибочно приписывается привлекательности интервьюера.` },
  { key: "waldinger-ted", kind: "video", title: `What makes a good life? Lessons from the longest study on happiness`, author: `Роберт Уолдингер, TED (2015)`, url: "https://www.ted.com/talks/robert_waldinger_what_makes_a_good_life_lessons_from_the_longest_study_on_happiness", description: `Итоги Гарвардского исследования развития взрослых: главные выводы о связях и благополучии.` },
  { key: "rozenthal-1968", kind: "research", title: `Эффект Пигмалиона`, author: `Роберт Розенталь, Ленор Джекобсон (1968)`, url: "https://ru.wikipedia.org/wiki/Эффект_Пигмалиона_(психология)", description: `Ожидания учителей меняли успеваемость учеников: сила ожиданий окружающих.` },
];

export interface SeedMyth {
  slug: string;
  statement: string;
  verdict: string;
  whyBelieve: string;
  evidence: string;
  unknown: string;
  better: string;
  topics: string[];
  tags: string[];
}

export const SEED_MYTHS: SeedMyth[] = [
  {
    slug: "levaya-logika-pravoe-tvorchestvo",
    statement: `Левое полушарие отвечает за логику, правое - за творчество`,
    verdict: "misleading",
    whyBelieve: `Популярные публикации десятилетиями описывали деление людей на логиков и творцов. Специализация полушарий действительно существует - язык преимущественно слева, пространственная обработка справа, - и это дало правдоподобное основание для переноса идеи на личность.`,
    evidence: `Специализация полушарий касается отдельных функций, а не типов личности. МРТ-анализ более тысячи людей (Университет Юты, 2013) не нашёл людей с доминированием творческого или логического полушария в личностном смысле: сети, отвечающие за аналитику и творчество, задействуют оба полушария. Ошибка в переносе: творческий человек использует правое полушарие так же, как аналитический.`,
    unknown: `Детальная карта специализации функций продолжает уточняться. Личностных следствий межполушарных различий надёжные данные не подтверждают.`,
    better: `Полушария специализируются по отдельным функциям. Личность не делится на правополушарных и левополушарных: сложные действия, включая творчество и логику, опираются на кооперацию обоих полушарий.`,
    topics: ["vospriyatie", "mind"],
    tags: ["iskazheniya"],
  },
  {
    slug: "10-protsentov-mozga",
    statement: `Мы используем только 10% мозга`,
    verdict: "debunked",
    whyBelieve: `Формула лестная: скрытый резерв, который можно разблокировать. Она поддерживалась неточным пересказом ранней нейронауки, фантастикой и маркетингом курсов.`,
    evidence: `Нейровизуализация показывает активность почти во всех областях мозга в течение дня; ни одна область не спит. Повреждения почти любой зоны дают нарушения - картина несовместима с 90% неработающего вещества. Мозг дорог: около 20% энергопотребления тела при 2% массы; эволюция не сохраняет 90% бесполезной дорогой ткани. Появлению цифры способствовали неточные пересказы: фразы о том, что мозг ещё мало изучен, в популярном пересказе превратились в мы используем мало.`,
    unknown: `Как нейронные сети распределяют ресурсы при разных задачах - предмет активных исследований. Речь о распределении активности, а не о скрытых процентах.`,
    better: `Мозг используется весь, но не весь одновременно: разные области активны под разные задачи. Разблокировка процентов - сюжет из фантастики.`,
    topics: ["vospriyatie", "mind"],
    tags: [],
  },
  {
    slug: "vymesit-zlost",
    statement: `Злость нужно выместить, иначе она накопится и взорвётся`,
    verdict: "misleading",
    whyBelieve: `Идея восходит к гидравлической метафоре эмоций: давление внутри, нужен выпуск. Она согласуется с переживанием облегчения после выговора.`,
    evidence: `Эксперименты Бреда Бушмана и коллег: люди, вымещавшие злость (удары по груше с мыслями об обидчике), становились агрессивнее, а не спокойнее. Повторение злости с фокусом на обидчике тренирует злость. Облегчение после выговора реально, но это сдвиг настроения, а не разрядка причины. Противоположные подходы работают лучше: снижение физиологического возбуждения (пауза, дыхание, прогулка) и адресное решение проблемы.`,
    unknown: `Границы эффекта изучаются: индивидуальные различия, роль контекста.`,
    better: `Злость не накапливается как пар. Вымещение тренирует агрессивную реакцию. Полезны снижение возбуждения и работа с причиной: пауза, физическая разрядка без фокуса на обидчике, разговор о проблеме после спада.`,
    topics: ["strahi", "konflikty", "emotion"],
    tags: ["trevoga"],
  },
  {
    slug: "vizualy-audialy-kinestetiki",
    statement: `Люди делятся на визуалов, аудиалов и кинестетиков, и учить каждого нужно его стилем`,
    verdict: "misleading",
    whyBelieve: `Ощущение собственных предпочтений реально: кому-то удобнее схемы, кому-то лекции. Идея стилей обучения обещала персонализацию и распространилась в образовании быстрее проверки.`,
    evidence: `Предпочтения каналов восприятия существуют. Но гипотеза о том, что обучение эффективнее при совпадении метода со стилем, проверена в серии контролируемых исследований и в обзоре Пашлера и коллег (2008): совпадение метода со стилем не улучшает результат обучения. Лучше всего работает подстройка метода под материал: география - картами, музыка - на слух, для любого ученика. Пользу классификации данные не подтверждают; маркетинг тестов продолжает её поддерживать.`,
    unknown: `Индивидуальные различия в обучении реальны, но описываются другими измерениями: исходные знания, рабочая память, мотивация.`,
    better: `Для всех людей эффективнее обучение, подобранное под материал и опирающееся на текущие знания. Предпочтения каналов - про комфорт; данных об эффективности подбора под стиль нет.`,
    topics: ["vospriyatie", "mind"],
    tags: [],
  },
  {
    slug: "protivopolozhnosti-prityagivayutsya",
    statement: `Противоположности притягиваются`,
    verdict: "debunked",
    whyBelieve: `Случаи ярких пар-дополнений заметны и запоминаются, нарратив романтичен. Теория комплементарности (Уинч) предлагала: доминантный ищет уступчивого.`,
    evidence: `Десятилетия исследований симпатии и выбора партнёров показывают устойчивое притяжение по сходству: ценности, образование, темперамент, привычки. Мета-анализы десятков исследований находят эффект сходства надёжным, а комплементарности - не находят или находят слабый обратный эффект. Различия в парах существуют, но чаще оказываются источником конфликтов, чем притяжения.`,
    unknown: `Отдельные измерения, например доминантность в конкретных контекстах, продолжают изучаться; общий вывод устойчив.`,
    better: `Притягивается сходство: ценностей, темперамента, образа жизни. Различия не разрушают пары сами по себе, но удерживаются пары уважением и договорённостями.`,
    topics: ["vybor-partnyora", "simpatia"],
    tags: ["otnosheniya"],
  },
  {
    slug: "mbti-obyasnyaet-lichnost",
    statement: `Тесты типа MBTI точно раскрывают вашу личность`,
    verdict: "misleading",
    whyBelieve: `Тест даёт резкий, понятный типаж с положительными описаниями; идентификация с типом приятна. Распространённость в компаниях создаёт видимость научности.`,
    evidence: `Главная претензия - надёжность: при повторном прохождении через несколько недель значительная часть людей получает другой тип. Категории разрезают непрерывные измерения пополам: люди возле границы получают противоположные типы при малой разнице черт. Прогноз реального поведения от типа слабее, чем от прямых измерений черт (например, Большой пятёрки). Эффект Барнума: расплывчатые положительные описания принимаются за точность.`,
    unknown: `Практическая польза типологий в командах - организационный вопрос; научной поддержки для точного раскрытия личности нет.`,
    better: `Личность описывается непрерывными измерениями, а не четырёхбуквенными типами. Для самоанализа надёжнее инструменты с проверенной надёжностью и помощь специалиста.`,
    topics: ["mind", "samoobman"],
    tags: [],
  },
  {
    slug: "lyubov-zhivyot-tri-goda",
    statement: `Любовь живёт три года - дальше остаются привычка и обязательства`,
    verdict: "unproven",
    whyBelieve: `Ранняя страсть действительно меняется: идеализация снижается, физиология первого периода утихает. Популярная гипотеза приписала этой динамике точный срок.`,
    evidence: `Снижение интенсивности ранней страсти подтверждается. Но вывода о том, что через три года остаётся только привычка, данные не поддерживают: лонгитюдные исследования пар показывают, что удовлетворённость может оставаться высокой десятилетиями, а близость и привязанность со временем растут. Скорость изменения индивидуальна; точная цифра три года не имеет научного источника - она пришла из популярной книги.`,
    unknown: `Какие факторы удерживают удовлетворённость - предмет активных исследований: уважение, общие смыслы, справедливость быта.`,
    better: `Ранняя страсть утихает у большинства пар, и это нормальная динамика. На её место при заботе вырастают близость, привязанность и совместная история, которые сохраняются десятилетиями.`,
    topics: ["privyazannost", "love", "otklonenie"],
    tags: ["otnosheniya"],
  },
];

export interface SeedState {
  slug: string;
  title: string;
  description: string;
  icon: string;
  articles: string[];
  topics: string[];
  myths: string[];
}

export const SEED_STATES: SeedState[] = [
  {
    slug: "mne-strashno-znakomitsya",
    title: `Мне страшно знакомиться`,
    description: `Перед подходом сердце колотится, в голове сценарии провала. Разбор: что именно пугает при знакомстве и почему избегание делает страх сильнее.`,
    icon: "users",
    articles: ["strah-kritiki"],
    topics: ["sots-trevoga", "strahi", "strah-kritiki"],
    myths: [],
  },
  {
    slug: "menya-otvergli",
    title: `Меня отвергли`,
    description: `Отказ или разрыв ощущается как приговор ценности. Разбор: почему отвержение бьёт так сильно и как выглядит восстановление.`,
    icon: "heart",
    articles: ["trevozhnaya-privyazannost"],
    topics: ["otklonenie", "privyazannost", "samootsenka"],
    myths: ["lyubov-zhivyot-tri-goda"],
  },
  {
    slug: "ya-chuvstvuyu-sebya-huzhe-drugih",
    title: `Я чувствую себя хуже других`,
    description: `Все вокруг чего-то добились, а я нет. Разбор: как работает сравнение и почему вывод я хуже почти всегда артефакт.`,
    icon: "eye",
    articles: ["sotsialnoe-sravnenie"],
    topics: ["sravnenie", "samootsenka", "status"],
    myths: [],
  },
  {
    slug: "ya-otkladyvayu-vazhnoe",
    title: `Я откладываю важное`,
    description: `Знаю, что делать, и всё равно не начинаю. Разбор: прокрастинация как защита от неприятных чувств и способы запустить действие.`,
    icon: "clock",
    articles: ["prokrastinatsiya"],
    topics: ["prokrastinatsiya", "perfekcionizm", "motivatsiya"],
    myths: [],
  },
  {
    slug: "ya-dolzhen-dobitsya-bolshego",
    title: `Я постоянно думаю, что должен добиться большего`,
    description: `Достигнутое обесценивается, отдых вызывает вину. Разбор: откуда берётся ощущение мало и когда оно чужое.`,
    icon: "target",
    articles: ["sotsialnoe-sravnenie", "motivatsiya-i-nagrady"],
    topics: ["ambitsii", "sravnenie", "samootsenka"],
    myths: [],
  },
  {
    slug: "ne-ponimayu-nravlyus-li-ya",
    title: `Не понимаю, нравлюсь ли я человеку`,
    description: `Гадание по знакам изматывает. Разбор: какие сигналы информативны, какие нет, и как выйти из неопределённости.`,
    icon: "help",
    articles: ["kak-ponyat-nravlyus-li-ya"],
    topics: ["simpatia", "odobrenie"],
    myths: [],
  },
];

export interface SeedLink {
  from: string;
  to: string;
  kind: string;
  note?: string;
}

export const SEED_LINKS: SeedLink[] = [
  { from: "strah-kritiki", to: "sots-trevoga", kind: "related" },
  { from: "styd", to: "strah-kritiki", kind: "influences", note: `Стыд превращает замечание в приговор` },
  { from: "strah-kritiki", to: "samootsenka", kind: "related", note: `Слабая внутренняя опора усиливает реакцию на оценку` },
  { from: "strah-kritiki", to: "odobrenie", kind: "related" },
  { from: "sots-trevoga", to: "odinochestvo", kind: "influences", note: `Избегание контактов ведёт к изоляции` },
  { from: "sots-trevoga", to: "trevoga", kind: "similar" },
  { from: "odobrenie", to: "samootsenka", kind: "related" },
  { from: "privyazannost", to: "otklonenie", kind: "related" },
  { from: "privyazannost", to: "samootsenka", kind: "related", note: `Тревожная привязанность ищет доказательства ценности` },
  { from: "simpatia", to: "vospriyatie", kind: "related", note: `Контекст искажает восприятие привлекательности` },
  { from: "simpatia", to: "vybor-partnyora", kind: "related" },
  { from: "otklonenie", to: "odinochestvo", kind: "related" },
  { from: "iskazheniya", to: "samoobman", kind: "related" },
  { from: "iskazheniya", to: "vospriyatie", kind: "influences" },
  { from: "ubezhdeniya", to: "samoobman", kind: "related" },
  { from: "samootsenka", to: "sravnenie", kind: "influences", note: `Сравнение сдвигает точку отсчёта самооценки` },
  { from: "sravnenie", to: "status", kind: "related" },
  { from: "sravnenie", to: "dengi", kind: "related" },
  { from: "motivatsiya", to: "privychki", kind: "related" },
  { from: "prokrastinatsiya", to: "perfekcionizm", kind: "influences", note: `Высокий порог старта делает откладывание почти неизбежным` },
  { from: "prokrastinatsiya", to: "styd", kind: "influences", note: `Стыд за откладывание усиливает избегание` },
  { from: "perfekcionizm", to: "samootsenka", kind: "related", note: `Стандарты становятся условием собственной ценности` },
  { from: "tseli", to: "ambitsii", kind: "related" },
  { from: "ambitsii", to: "sravnenie", kind: "related", note: `Ощущение мало часто рождается из сравнения` },
  { from: "status", to: "samootsenka", kind: "related" },
  { from: "neudachi", to: "samoprinjatie", kind: "related" },
  { from: "neudachi", to: "perfekcionizm", kind: "related" },
  { from: "schaste", to: "dengi", kind: "related" },
  { from: "odinochestvo", to: "druzhba", kind: "related" },
  { from: "styd", to: "samoprinjatie", kind: "related" },
  { from: "trevoga", to: "strahi", kind: "related" },
];

export interface SeedIdea {
  key: string;
  title: string;
  text: string;
  quote?: string;
  sourceKey?: string;
  topics: string[];
}

export const SEED_IDEAS: SeedIdea[] = [
  {
    key: "two-systems",
    title: `Быстрое мышление работает по умолчанию`,
    text: `Мышление имеет два режима: быстрый автоматический и медленный внимательный. Большинство суждений выдаёт быстрый режим, потому что полный анализ слишком дорог. Ошибки - побочный эффект экономии усилий.`,
    sourceKey: "kahneman",
    topics: ["iskazheniya", "vospriyatie"],
  },
  {
    key: "anchoring",
    title: `Якорение: первая цифра сдвигает оценку`,
    text: `Первая увиденная или случайно названная цифра смещает последующую оценку, даже когда человек понимает её случайность. Быстрый режим принимает её за точку отсчёта.`,
    sourceKey: "kahneman",
    topics: ["iskazheniya", "vospriyatie"],
  },
  {
    key: "two-happiness",
    title: `Счастье в моменте и удовлетворённость жизнью - разные измерения`,
    text: `Эмоциональное состояние дня и оценка жизни при обдумывании - два разных измерения благополучия с разными предсказателями. Их смешение порождает противоречивые советы о счастье.`,
    sourceKey: "kahneman",
    topics: ["schaste", "emotion"],
  },
  {
    key: "shame-guilt",
    title: `Стыд говорит я плохой, вина - я сделал плохо`,
    text: `Вина обращена к поступку и двигает к исправлению. Стыд обращён к личности и двигает к сокрытию и уходу. Различение двух состояний определяет, что делать после ошибки.`,
    sourceKey: "brown-gifts",
    topics: ["styd", "samootsenka", "strah-kritiki"],
  },
  {
    key: "vulnerability",
    title: `Уязвимость - условие близости`,
    text: `Близость требует открытости о своих чувствах и слабых местах. Попытка быть безупречной защищает от стыда, но перекрывает дорогу к настоящему контакту.`,
    sourceKey: "brown-gifts",
    topics: ["privyazannost", "druzhba", "samoprinjatie"],
  },
  {
    key: "dissonance",
    title: `Без внешнего оправдания люди меняют отношение к делу`,
    text: `В эксперименте Фестингера и Карлсмита люди, получившие малую награду за скучную работу, оценивали её интереснее - противоречие снималось изменением убеждения. Так работает когнитивный диссонанс.`,
    sourceKey: "festinger-1959",
    topics: ["ubezhdeniya", "motivatsiya"],
  },
  {
    key: "misattribution",
    title: `Возбуждение можно ошибочно приписать другому человеку`,
    text: `Физиология страха и симпатии частично совпадает. В эксперименте с подвесным мостом испытуемые, встретившие интервьюера на высоте, чаще звонили ему после: возбуждение от высоты читалось как влечение.`,
    sourceKey: "dutton-aron-1974",
    topics: ["simpatia", "vospriyatie"],
  },
  {
    key: "relationships-health",
    title: `Качество близких связей предсказывает здоровье в старости`,
    text: `Главный вывод Гарвардского исследования развития взрослых: надёжность близких отношений в середине жизни предсказывает физическое здоровье и память в старости сильнее известных медицинских показателей.`,
    sourceKey: "waldinger-ted",
    topics: ["schaste", "druzhba", "odinochestvo"],
  },
  {
    key: "fixed-mindset",
    title: `Вера в неизменные способности повышает страх ошибки`,
    text: `Если способности считаются фиксированными, каждая задача становится проверкой ценности, и человек уходит от сложных задач. Вера в развитие делает ошибку информацией, а не приговором.`,
    sourceKey: "duwek",
    topics: ["motivatsiya", "neudachi", "perfekcionizm"],
  },
  {
    key: "pygmalion",
    title: `Ожидания окружающих меняют результат человека`,
    text: `Учители, которым сказали, что отдельные дети особо перспективны, реально повышали их успеваемость: ожидание меняло поведение взрослого, а затем и ребёнка.`,
    sourceKey: "rozenthal-1968",
    topics: ["samootsenka", "ubezhdeniya", "odobrenie"],
  },
  {
    key: "avoidance-cost",
    title: `Цена избегания всегда запаздывающая`,
    text: `Избегание приносит мгновенное облегчение и долгий рост страха. Из-за запаздывания связи мозг выбирает избегание снова и снова, не видя накопления. Личное наблюдение.`,
    topics: ["trevoga", "strahi", "prokrastinatsiya"],
  },
  {
    key: "foreign-ambition",
    title: `Ощущение должен добиться большего часто чужое`,
    text: `Список большего нередко собран из чужих достижений, замеченных в сравнении. Проверка чему именно я рад был бы отделяет свои цели от присвоенных. Личное наблюдение.`,
    topics: ["ambitsii", "sravnenie", "tseli"],
  },
];

export interface SeedIdeaRelation {
  from: string;
  to: string;
  kind: string;
}

export const SEED_IDEA_RELATIONS: SeedIdeaRelation[] = [
  { from: "anchoring", to: "two-systems", kind: "develops" },
  { from: "avoidance-cost", to: "shame-guilt", kind: "develops" },
  { from: "relationships-health", to: "vulnerability", kind: "complements" },
  { from: "misattribution", to: "anchoring", kind: "complements" },
  { from: "foreign-ambition", to: "fixed-mindset", kind: "challenges" },
];
