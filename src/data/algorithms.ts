import { AlgorithmId, AlgorithmInfo } from '../types/algorithm';

export const ALGORITHMS_DATA: AlgorithmInfo[] = [
  {
    id: 'bubble',
    nameEn: 'Bubble Sort',
    nameRu: 'Сортировка пузырьком',
    fullName: 'Bubble Sort — сортировка пузырьком',
    shortDescription:
      'Последовательно сравнивает соседние элементы и меняет их местами, если они стоят в неправильном порядке. Крупные элементы «всплывают» в конец массива.',
    detailedPrinciple:
      'Алгоритм многократно проходит по массиву слева направо, сравнивая каждую пару соседних элементов a[j] и a[j + 1]. Если элементы нарушают выбранный порядок сортировки, они меняются местами. После первого полного прохода самый большой (при сортировке по возрастанию) элемент гарантированно оказывается на последней позиции. На каждом следующем проходе область проверки сокращается на один элемент. Если за весь очередной проход не произошло ни одного обмена, алгоритм завершается досрочно.',
    stepByStepSummary: [
      'Начать проход с индекса 0 до границы неотсортированной части.',
      'Сравнить соседние элементы a[j] и a[j + 1].',
      'Если порядок нарушен — поменять их местами и отметить факт обмена.',
      'Зафиксировать крайний правый элемент текущего прохода как отсортированный.',
      'Если за весь проход не было ни одного обмена — досрочно завершить работу.',
    ],
    bestComplexity: 'O(n)',
    bestComplexityNote: 'Достигается на уже отсортированном массиве благодаря флагу раннего завершения (1 проход без обменов).',
    averageComplexity: 'O(n²)',
    worstComplexity: 'O(n²)',
    worstComplexityNote: 'На массиве, отсортированном в обратном порядке: n(n - 1)/2 сравнений и столько же обменов.',
    spaceComplexity: 'O(1)',
    spaceComplexityNote: 'Требуется только несколько вспомогательных переменных для индексов и обмена.',
    stable: true,
    stableNote: 'Устойчив: равные элементы никогда не меняются местами (обмен происходит только при строгом неравенстве).',
    inPlace: true,
    inPlaceNote: 'Сортировка выполняется непосредственно в исходном массиве без выделения дополнительной памяти.',
    difficulty: 'Начальный',
    categories: ['simple', 'in-place', 'stable'],
    advantages: [
      'Предельная простота понимания и реализации',
      'Устойчивость (сохраняет порядок равных элементов)',
      'Не требует дополнительной памяти — O(1)',
      'Способен мгновенно распознать уже отсортированный массив за O(n)',
    ],
    disadvantages: [
      'Крайне низкая производительность на средних и больших массивах — O(n²)',
      'Огромное количество избыточных обменов элементов',
    ],
    useCases: [
      'Обучение базовым концепциям алгоритмов, циклов и инвариантов',
      'Проверка, является ли массив уже отсортированным (за один проход)',
      'Крошечные массивы (до 10–15 элементов) или почти упорядоченные списки с единичной ошибкой',
    ],
    code: {
      pseudocode: `процедура bubbleSort(A, направление):
  n = длина(A)
  для i от 0 до n - 2:
    были_обмены = ложь
    для j от 0 до n - 2 - i:
      если нарушен_порядок(A[j], A[j + 1], направление):
        обменять(A[j], A[j + 1])
        были_обмены = истина
    если НЕ были_обмены:
      прервать цикл // Массив уже упорядочен
  вернуть A`,
      javascript: `function bubbleSort(arr, order = 'asc') {
  const result = [...arr];
  const n = result.length;

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;

    for (let j = 0; j < n - 1 - i; j++) {
      const shouldSwap = order === 'asc'
        ? result[j] > result[j + 1]
        : result[j] < result[j + 1];

      if (shouldSwap) {
        const temp = result[j];
        result[j] = result[j + 1];
        result[j + 1] = temp;
        swapped = true;
      }
    }

    // Оптимизация: если за проход не было обменов, массив уже отсортирован
    if (!swapped) break;
  }

  return result;
}`,
      typescript: `export function bubbleSort(arr: number[], order: 'asc' | 'desc' = 'asc'): number[] {
  const result = [...arr];
  const n = result.length;

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;

    for (let j = 0; j < n - 1 - i; j++) {
      const shouldSwap = order === 'asc'
        ? result[j] > result[j + 1]
        : result[j] < result[j + 1];

      if (shouldSwap) {
        const temp = result[j];
        result[j] = result[j + 1];
        result[j + 1] = temp;
        swapped = true;
      }
    }

    if (!swapped) break;
  }

  return result;
}`,
      lineExplanations: [
        {
          lines: 'Внешний цикл (i от 0 до n - 2)',
          explanation: 'Отвечает за номер прохода. После каждого прохода правая граница неотсортированной части уменьшается на 1.',
        },
        {
          lines: 'Флаг swapped = false',
          explanation: 'Отслеживает, произошёл ли хотя бы один обмен за текущий проход. Позволяет завершить сортировку за O(n) в лучшем случае.',
        },
        {
          lines: 'Внутренний цикл (j от 0 до n - 2 - i)',
          explanation: 'Последовательно сравнивает соседние элементы и «выталкивает» экстремальный элемент к правой границе.',
        },
      ],
    },
  },
  {
    id: 'selection',
    nameEn: 'Selection Sort',
    nameRu: 'Сортировка выбором',
    fullName: 'Selection Sort — сортировка выбором',
    shortDescription:
      'На каждом проходе находит минимальный (или максимальный) элемент в неотсортированной части и меняет его местами с первым элементом этой части.',
    detailedPrinciple:
      'Массив условно делится на две части: уже отсортированную слева и неотсортированную справа. Изначально отсортированная часть пуста. На шаге i алгоритм линейно просматривает все элементы от i до n - 1, находит среди них индекс минимального элемента (при сортировке по возрастанию) и выполняет ровно один обмен между найденным минимумом и элементом на позиции i. После этого граница отсортированной части сдвигается на один шаг вправо.',
    stepByStepSummary: [
      'Установить границу неотсортированной части на индекс i.',
      'Принять элемент a[i] за текущий минимум (или максимум).',
      'Просмотреть все элементы справа от i и обновить индекс минимума, если найден меньший элемент.',
      'Поменять местами найденный минимальный элемент с элементом a[i].',
      'Сдвинуть границу i вправо и повторить до конца массива.',
    ],
    bestComplexity: 'O(n²)',
    bestComplexityNote: 'Даже если массив уже отсортирован, алгоритм обязан полностью просмотреть оставшуюся часть, чтобы убедиться в минимуме.',
    averageComplexity: 'O(n²)',
    worstComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    stable: false,
    stableNote: 'Стандартная реализация с обменом далёких элементов неустойчива: обмен может перебросить элемент за равный ему.',
    inPlace: true,
    inPlaceNote: 'Работает на месте, требуя лишь O(1) дополнительной памяти.',
    difficulty: 'Начальный',
    categories: ['simple', 'in-place'],
    advantages: [
      'Минимальное число обменов среди квадратичных алгоритмов — не более n - 1 обменов',
      'Предсказуемое время работы, не зависящее от начального порядка данных',
      'Не требует дополнительной памяти — O(1)',
    ],
    disadvantages: [
      'Всегда выполняет O(n²) сравнений, даже на полностью отсортированном массиве',
      'Не является устойчивым в классической реализации через обмен',
    ],
    useCases: [
      'Ситуации, где операция записи/обмена в памяти очень дорога, а сравнение дешёвое (например, работа с EEPROM/Flash)',
      'Небольшие массивы, где важна простота кода и минимум записей',
    ],
    code: {
      pseudocode: `процедура selectionSort(A, направление):
  n = длина(A)
  для i от 0 до n - 2:
    индекс_экстремума = i
    для j от i + 1 до n - 1:
      если лучше(A[j], A[индекс_экстремума], направление):
        индекс_экстремума = j
    если индекс_экстремума != i:
      обменять(A[i], A[индекс_экстремума])
  вернуть A`,
      javascript: `function selectionSort(arr, order = 'asc') {
  const result = [...arr];
  const n = result.length;

  for (let i = 0; i < n - 1; i++) {
    let targetIdx = i;

    for (let j = i + 1; j < n; j++) {
      const isBetter = order === 'asc'
        ? result[j] < result[targetIdx]
        : result[j] > result[targetIdx];

      if (isBetter) {
        targetIdx = j;
      }
    }

    if (targetIdx !== i) {
      const temp = result[i];
      result[i] = result[targetIdx];
      result[targetIdx] = temp;
    }
  }

  return result;
}`,
      typescript: `export function selectionSort(arr: number[], order: 'asc' | 'desc' = 'asc'): number[] {
  const result = [...arr];
  const n = result.length;

  for (let i = 0; i < n - 1; i++) {
    let targetIdx = i;

    for (let j = i + 1; j < n; j++) {
      const isBetter = order === 'asc'
        ? result[j] < result[targetIdx]
        : result[j] > result[targetIdx];

      if (isBetter) {
        targetIdx = j;
      }
    }

    if (targetIdx !== i) {
      const temp = result[i];
      result[i] = result[targetIdx];
      result[targetIdx] = temp;
    }
  }

  return result;
}`,
      lineExplanations: [
        {
          lines: 'let targetIdx = i',
          explanation: 'В начале каждого прохода предполагаем, что первый элемент неотсортированной части является минимальным (или максимальным).',
        },
        {
          lines: 'Внутренний цикл (j от i + 1 до n - 1)',
          explanation: 'Ищет реальный минимум/максимум в оставшейся части массива без выполнения промежуточных обменов.',
        },
        {
          lines: 'if (targetIdx !== i)',
          explanation: 'Выполняет единственный обмен за весь проход, ставя найденный экстремум сразу на его финальное место.',
        },
      ],
    },
  },
  {
    id: 'insertion',
    nameEn: 'Insertion Sort',
    nameRu: 'Сортировка вставками',
    fullName: 'Insertion Sort — сортировка вставками',
    shortDescription:
      'Последовательно берёт каждый элемент и вставляет его на нужную позицию в уже отсортированную левую часть массива, подобно сортировке карт в руке.',
    detailedPrinciple:
      'Первый элемент массива самопроизвольно образует отсортированную последовательность длины 1. На каждом шаге i (от 1 до n - 1) алгоритм извлекает текущий элемент key = a[i] и сравнивает его с элементами слева (индексы j = i - 1, i - 2, ...). Все элементы, которые больше key (при сортировке по возрастанию), сдвигаются на одну позицию вправо, освобождая место. Как только находится элемент, не превышающий key (или достигается начало массива), элемент key записывается на освободившуюся позицию.',
    stepByStepSummary: [
      'Считать первый элемент [0] уже упорядоченной частью массива.',
      'Взять следующий элемент key = a[i].',
      'Сравнивать key с элементами отсортированной части справа налево.',
      'Сдвигать вправо все элементы, которые нарушают порядок относительно key.',
      'Вставить key на найденную свободную позицию.',
    ],
    bestComplexity: 'O(n)',
    bestComplexityNote: 'На уже отсортированном массиве каждый элемент сравнивается только один раз со своим левым соседом.',
    averageComplexity: 'O(n²)',
    worstComplexity: 'O(n²)',
    worstComplexityNote: 'На обратно отсортированном массиве каждый новый элемент приходится сдвигать в самое начало.',
    spaceComplexity: 'O(1)',
    stable: true,
    stableNote: 'Устойчив: сдвиг прекращается при встрече равного элемента, поэтому относительный порядок дубликатов не меняется.',
    inPlace: true,
    inPlaceNote: 'Требует лишь одну переменную key для хранения текущего вставляемого элемента.',
    difficulty: 'Начальный',
    categories: ['simple', 'in-place', 'stable'],
    advantages: [
      'Высокая адаптивность: работает за O(n) на почти отсортированных данных',
      'Устойчивый алгоритм и сортировка на месте O(1)',
      'Онлайн-алгоритм: может сортировать данные по мере их поступления',
      'Малые накладные расходы — быстрее сложных алгоритмов на малых подмассивах (n ≤ 16..32)',
    ],
    disadvantages: [
      'Квадратичная сложность O(n²) на случайных и обратно упорядоченных больших массивах',
    ],
    useCases: [
      'Почти отсортированные массивы и потоковые данные',
      'Базовый алгоритм для малых подмассивов внутри гибридных сортировок (Timsort, Introsort)',
    ],
    code: {
      pseudocode: `процедура insertionSort(A, направление):
  n = длина(A)
  для i от 1 до n - 1:
    ключ = A[i]
    j = i - 1
    пока j >= 0 И нарушен_порядок(A[j], ключ, направление):
      A[j + 1] = A[j]
      j = j - 1
    A[j + 1] = ключ
  вернуть A`,
      javascript: `function insertionSort(arr, order = 'asc') {
  const result = [...arr];
  const n = result.length;

  for (let i = 1; i < n; i++) {
    const key = result[i];
    let j = i - 1;

    while (
      j >= 0 &&
      (order === 'asc' ? result[j] > key : result[j] < key)
    ) {
      result[j + 1] = result[j];
      j--;
    }

    result[j + 1] = key;
  }

  return result;
}`,
      typescript: `export function insertionSort(arr: number[], order: 'asc' | 'desc' = 'asc'): number[] {
  const result = [...arr];
  const n = result.length;

  for (let i = 1; i < n; i++) {
    const key = result[i];
    let j = i - 1;

    while (
      j >= 0 &&
      (order === 'asc' ? result[j] > key : result[j] < key)
    ) {
      result[j + 1] = result[j];
      j--;
    }

    result[j + 1] = key;
  }

  return result;
}`,
      lineExplanations: [
        {
          lines: 'const key = result[i]',
          explanation: 'Сохраняем вставляемый элемент, чтобы его позиция могла быть перезаписана при сдвиге элементов вправо.',
        },
        {
          lines: 'Цикл while (j >= 0 && ...)',
          explanation: 'Идёт влево по уже отсортированной части и сдвигает элементы на 1 индекс вправо, пока не найдёт правильное место для key.',
        },
        {
          lines: 'result[j + 1] = key',
          explanation: 'Записывает элемент key в образовавшееся «окно» в отсортированной части.',
        },
      ],
    },
  },
  {
    id: 'merge',
    nameEn: 'Merge Sort',
    nameRu: 'Сортировка слиянием',
    fullName: 'Merge Sort — сортировка слиянием',
    shortDescription:
      'Классический алгоритм «разделяй и властвуй»: рекурсивно делит массив пополам, сортирует части и объединяет (сливает) их в один упорядоченный массив.',
    detailedPrinciple:
      'Алгоритм предложен Джоном фон Нейманом в 1945 году. Если массив содержит более одного элемента, он делится ровно посередине на левый и правый подмассивы. Каждая половина рекурсивно сортируется тем же методом до тех пор, пока длина подмассивов не станет равной 1 (массив из одного элемента уже упорядочен). Затем выполняется ключевая процедура Merge (слияние): два указателя идут по началу обоих отсортированных подмассивов, на каждом шаге выбирается меньший (или больший) из двух элементов и записывается в результирующий массив.',
    stepByStepSummary: [
      'Разделить текущий участок массива [left..right] пополам: mid = ⌊(left + right) / 2⌋.',
      'Рекурсивно отсортировать левую половину [left..mid].',
      'Рекурсивно отсортировать правую половину [mid + 1..right].',
      'Слить две упорядоченные половины в единый отсортированный участок с помощью двух указателей.',
    ],
    bestComplexity: 'O(n log n)',
    averageComplexity: 'O(n log n)',
    worstComplexity: 'O(n log n)',
    worstComplexityNote: 'Гарантированное время O(n log n) при любых входных данных: глубина дерева рекурсии равна ⌈log₂ n⌉, а на каждом уровне выполняется O(n) операций слияния.',
    spaceComplexity: 'O(n)',
    spaceComplexityNote: 'Стандартная реализация использует вспомогательный буфер размера O(n) для слияния подмассивов.',
    stable: true,
    stableNote: 'Устойчив: при равенстве элементов из левого и правого подмассивов первым всегда выбирается элемент из левого подмассива.',
    inPlace: false,
    inPlaceNote: 'Классическая реализация НЕ является сортировкой на месте, так как требует O(n) дополнительной памяти.',
    difficulty: 'Средний',
    categories: ['efficient', 'stable'],
    advantages: [
      'Гарантированная сложность O(n log n) даже в худшем случае (нет деградации до O(n²))',
      'Устойчивая сортировка (сохраняет порядок записей с одинаковыми ключами)',
      'Отлично подходит для связных списков и внешней сортировки (файлов на диске)',
    ],
    disadvantages: [
      'Требует O(n) дополнительной оперативной памяти для массивов',
      'На малых массивах уступает Insertion Sort из-за накладных расходов на рекурсию и копирование',
    ],
    useCases: [
      'Сортировка объектов и записей БД, где критически важна устойчивость и предсказуемое время',
      'Внешняя сортировка больших объёмов данных, не помещающихся целиком в ОЗУ',
    ],
    code: {
      pseudocode: `функция mergeSort(A, left, right, направление):
  если left >= right: вернуть
  mid = (left + right) div 2
  mergeSort(A, left, mid, направление)
  mergeSort(A, mid + 1, right, направление)
  merge(A, left, mid, right, направление)

процедура merge(A, left, mid, right, направление):
  создать копии L = A[left..mid] и R = A[mid+1..right]
  пока есть элементы в L и R:
    выбрать подходящий из L[i] и R[j] (при равенстве — из L)
    записать в A[k]
  дописать остатки L и R в A`,
      javascript: `function mergeSort(arr, order = 'asc') {
  if (arr.length <= 1) return [...arr];

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid), order);
  const right = mergeSort(arr.slice(mid), order);

  const merged = [];
  let i = 0, j = 0;

  while (i < left.length && j < right.length) {
    const takeLeft = order === 'asc'
      ? left[i] <= right[j]
      : left[i] >= right[j];

    if (takeLeft) {
      merged.push(left[i++]);
    } else {
      merged.push(right[j++]);
    }
  }

  return merged.concat(left.slice(i)).concat(right.slice(j));
}`,
      typescript: `export function mergeSort(arr: number[], order: 'asc' | 'desc' = 'asc'): number[] {
  if (arr.length <= 1) return [...arr];

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid), order);
  const right = mergeSort(arr.slice(mid), order);

  const merged: number[] = [];
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    // Нестрогое сравнение (<= или >=) обеспечивает устойчивость алгоритма
    const takeLeft = order === 'asc'
      ? left[i] <= right[j]
      : left[i] >= right[j];

    if (takeLeft) {
      merged.push(left[i++]);
    } else {
      merged.push(right[j++]);
    }
  }

  while (i < left.length) merged.push(left[i++]);
  while (j < right.length) merged.push(right[j++]);

  return merged;
}`,
      lineExplanations: [
        {
          lines: 'if (arr.length <= 1) return [...arr]',
          explanation: 'Базовый случай рекурсии: массив из 0 или 1 элемента уже отсортирован.',
        },
        {
          lines: 'left[i] <= right[j]',
          explanation: 'При равенстве значений выбирается элемент из левой половины, что гарантирует сохранение исходного порядка равных элементов (устойчивость).',
        },
        {
          lines: 'Дозапись остатков (while i < left.length ...)',
          explanation: 'Когда один из подмассивов закончился, оставшиеся элементы второго уже упорядочены и переносятся в конец.',
        },
      ],
    },
  },
  {
    id: 'quick',
    nameEn: 'Quick Sort',
    nameRu: 'Быстрая сортировка',
    fullName: 'Quick Sort — быстрая сортировка',
    shortDescription:
      'Выбирает опорный элемент (pivot), перераспределяет элементы меньшие по одну сторону, а большие — по другую, после чего рекурсивно сортирует обе части.',
    detailedPrinciple:
      'Разработан Тони Хоаром в 1960 году. Работает по принципу «разделяй и властвуй». На текущем отрезке [low..high] выбирается опорный элемент (pivot) — в нашей реализации берётся элемент со средним индексом ⌊(low + high) / 2⌋, что защищает от деградации на уже отсортированных массивах. Далее выполняется процедура разделения (Partition): элементы перегруппировываются так, чтобы слева от опорного оказались элементы меньше него (при сортировке по возрастанию), а справа — больше или равные. Сам опорный элемент сразу встаёт на свою окончательную позицию, после чего алгоритм рекурсивно вызывается для левой и правой частей.',
    stepByStepSummary: [
      'Выбрать опорный элемент (pivot) на участке [low..high] (стратегия: средний индекс).',
      'Провести разделение (partition): переместить элементы меньше опорного влево, а больше — вправо.',
      'Установить опорный элемент на границу между частями — эта позиция является для него финальной.',
      'Рекурсивно применить алгоритм к левому [low..pivotIdx - 1] и правому [pivotIdx + 1..high] подмассивам.',
    ],
    pivotOrGapStrategy:
      'Стратегия выбора опорного элемента: выбирается элемент со средним индексом mid = ⌊(low + high) / 2⌋. Это позволяет избежать худшего случая O(n²) на уже отсортированных или обратно отсортированных массивах.',
    bestComplexity: 'O(n log n)',
    bestComplexityNote: 'Когда опорный элемент на каждом шаге делит подмассив примерно на две равные части.',
    averageComplexity: 'O(n log n)',
    worstComplexity: 'O(n²)',
    worstComplexityNote: 'Возникает при неудачном выборе опорного элемента (когда каждый раз выбирается минимум или максимум участка).',
    spaceComplexity: 'O(log n)',
    spaceComplexityNote: 'Расходуется на стек вызовов рекурсии: в среднем O(log n), в худшем вырожденном случае — до O(n).',
    stable: false,
    stableNote: 'Стандартная in-place реализация с обменами при разделении не сохраняет относительный порядок равных элементов.',
    inPlace: true,
    inPlaceNote: 'Используется in-place разделение (partition) внутри исходного массива без создания дополнительных массивов.',
    difficulty: 'Средний',
    categories: ['efficient', 'in-place'],
    advantages: [
      'Один из самых быстрых алгоритмов общего назначения на практике благодаря отличной локальности кэша процессора',
      'Работает на месте (in-place), требуя лишь O(log n) памяти под стек рекурсии',
      'Малая константа скрытая в O(n log n)',
    ],
    disadvantages: [
      'В худшем случае время работы может деградировать до O(n²)',
      'Неустойчивый алгоритм сортировки',
    ],
    useCases: [
      'Быстрая сортировка массивов примитивов и чисел в оперативной памяти',
      'Основа стандартных библиотечных сортировок (часто в составе гибридного Introsort)',
    ],
    code: {
      pseudocode: `процедура quickSort(A, low, high, направление):
  если low >= high: вернуть
  pivotIdx = partition(A, low, high, направление)
  quickSort(A, low, pivotIdx - 1, направление)
  quickSort(A, pivotIdx + 1, high, направление)

функция partition(A, low, high, направление):
  mid = (low + high) div 2
  pivot = A[mid]
  обменять(A[mid], A[high])
  store = low
  для j от low до high - 1:
    если должен_быть_слева(A[j], pivot, направление):
      обменять(A[store], A[j])
      store = store + 1
  обменять(A[store], A[high])
  вернуть store`,
      javascript: `function quickSort(arr, order = 'asc') {
  const result = [...arr];

  function partition(low, high) {
    const mid = Math.floor((low + high) / 2);
    const pivot = result[mid];
    // Переносим опорный элемент в конец отрезка
    [result[mid], result[high]] = [result[high], result[mid]];

    let storeIdx = low;
    for (let j = low; j < high; j++) {
      const goesLeft = order === 'asc'
        ? result[j] < pivot
        : result[j] > pivot;

      if (goesLeft) {
        [result[storeIdx], result[j]] = [result[j], result[storeIdx]];
        storeIdx++;
      }
    }

    [result[storeIdx], result[high]] = [result[high], result[storeIdx]];
    return storeIdx;
  }

  function sort(low, high) {
    if (low >= high) return;
    const pivotIndex = partition(low, high);
    sort(low, pivotIndex - 1);
    sort(pivotIndex + 1, high);
  }

  sort(0, result.length - 1);
  return result;
}`,
      typescript: `export function quickSort(arr: number[], order: 'asc' | 'desc' = 'asc'): number[] {
  const result = [...arr];

  function partition(low: number, high: number): number {
    const mid = Math.floor((low + high) / 2);
    const pivot = result[mid];
    [result[mid], result[high]] = [result[high], result[mid]];

    let storeIdx = low;
    for (let j = low; j < high; j++) {
      const goesLeft = order === 'asc'
        ? result[j] < pivot
        : result[j] > pivot;

      if (goesLeft) {
        [result[storeIdx], result[j]] = [result[j], result[storeIdx]];
        storeIdx++;
      }
    }

    [result[storeIdx], result[high]] = [result[high], result[storeIdx]];
    return storeIdx;
  }

  function sort(low: number, high: number): void {
    if (low >= high) return;
    const pivotIndex = partition(low, high);
    sort(low, pivotIndex - 1);
    sort(pivotIndex + 1, high);
  }

  sort(0, result.length - 1);
  return result;
}`,
      lineExplanations: [
        {
          lines: 'const mid = Math.floor((low + high) / 2)',
          explanation: 'Выбор центрального элемента в качестве опорного предотвращает квадратичное вырождение на уже упорядоченных массивах.',
        },
        {
          lines: 'Цикл разделения (for j = low; j < high; j++)',
          explanation: 'Перемещает все элементы, которые должны стоять до опорного, в левую часть отрезка, сдвигая указатель storeIdx.',
        },
        {
          lines: 'Финальный обмен [result[storeIdx], result[high]]',
          explanation: 'Ставит опорный элемент точно на границу разделения — это его окончательная позиция в отсортированном массиве.',
        },
      ],
    },
  },
  {
    id: 'heap',
    nameEn: 'Heap Sort',
    nameRu: 'Пирамидальная сортировка',
    fullName: 'Heap Sort — пирамидальная сортировка',
    shortDescription:
      'Строит из массива двоичную кучу (binary heap), а затем последовательно извлекает корневой экстремальный элемент в конец массива.',
    detailedPrinciple:
      'Алгоритм использует структуру данных «двоичная куча» (пирамида), которая хранится прямо внутри сортируемого массива без указателей: для узла с индексом i его левый потомок находится по индексу 2i + 1, а правый — по индексу 2i + 2. Работа делится на две фазы. В первой фазе массив преобразуется в Max-Heap (при сортировке по возрастанию), где каждый родитель не меньше своих потомков, а максимум находится в корне [0]. Во второй фазе корень a[0] меняется местами с последним элементом активной кучи, размер кучи уменьшается на 1, и процедура heapify (просеивание вниз) за O(log n) восстанавливает свойство кучи.',
    stepByStepSummary: [
      'Представить массив как полное двоичное дерево (потомки узла i: 2i + 1 и 2i + 2).',
      'Построить двоичную кучу (Max-Heap или Min-Heap), вызвав heapify от середины массива к корню [0].',
      'Поменять местами корень кучи [0] с последним элементом активной кучи [end].',
      'Уменьшить размер активной кучи на 1 и восстановить свойство кучи (heapify) для нового корня.',
      'Повторять шаг извлечения, пока размер кучи не сократится до 1.',
    ],
    bestComplexity: 'O(n log n)',
    averageComplexity: 'O(n log n)',
    worstComplexity: 'O(n log n)',
    worstComplexityNote: 'Построение кучи занимает O(n), а каждое из n - 1 извлечений корня требует O(log n) операций.',
    spaceComplexity: 'O(1)',
    spaceComplexityNote: 'Двоичная куча размещается непосредственно в самом массиве, дополнительная память O(1).',
    stable: false,
    stableNote: 'Неустойчив: обмен корня с концом кучи и просеивание по дереву нарушают относительный порядок равных элементов.',
    inPlace: true,
    inPlaceNote: 'Полностью сортирует массив на месте (in-place) без выделения буферов.',
    difficulty: 'Продвинутый',
    categories: ['efficient', 'in-place'],
    advantages: [
      'Строго гарантированное время O(n log n) в худшем случае И одновременно память O(1)',
      'Не подвержен вырождению до O(n²), в отличие от Quick Sort',
      'Не требует глубокого стека рекурсии',
    ],
    disadvantages: [
      'На практике обычно работает медленнее Quick Sort из-за частых промахов кэша процессора (прыжки по индексам i → 2i + 1)',
      'Неустойчивый алгоритм',
    ],
    useCases: [
      'Встроенные системы и системы реального времени (real-time), где одновременно требуются строгая граница O(n log n) по времени и O(1) по памяти',
      'Защита от алгоритмических атак (используется как резервный алгоритм в Introsort при превышении глубины рекурсии Quick Sort)',
    ],
    code: {
      pseudocode: `процедура heapSort(A, направление):
  n = длина(A)
  // Построение кучи
  для i от (n div 2) - 1 вниз до 0:
    heapify(A, n, i, направление)
  // Извлечение элементов из кучи
  для end от n - 1 вниз до 1:
    обменять(A[0], A[end])
    heapify(A, end, 0, направление)

процедура heapify(A, size, root, направление):
  target = root; left = 2*root + 1; right = 2*root + 2
  если left < size И A[left] приоритетнее A[target]: target = left
  если right < size И A[right] приоритетнее A[target]: target = right
  если target != root:
    обменять(A[root], A[target])
    heapify(A, size, target, направление)`,
      javascript: `function heapSort(arr, order = 'asc') {
  const result = [...arr];
  const n = result.length;

  function heapify(size, root) {
    let target = root;
    const left = 2 * root + 1;
    const right = 2 * root + 2;

    if (left < size) {
      const leftBetter = order === 'asc'
        ? result[left] > result[target]
        : result[left] < result[target];
      if (leftBetter) target = left;
    }

    if (right < size) {
      const rightBetter = order === 'asc'
        ? result[right] > result[target]
        : result[right] < result[target];
      if (rightBetter) target = right;
    }

    if (target !== root) {
      [result[root], result[target]] = [result[target], result[root]];
      heapify(size, target);
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }

  for (let end = n - 1; end > 0; end--) {
    [result[0], result[end]] = [result[end], result[0]];
    heapify(end, 0);
  }

  return result;
}`,
      typescript: `export function heapSort(arr: number[], order: 'asc' | 'desc' = 'asc'): number[] {
  const result = [...arr];
  const n = result.length;

  function heapify(size: number, root: number): void {
    let target = root;
    const left = 2 * root + 1;
    const right = 2 * root + 2;

    if (left < size) {
      const leftBetter = order === 'asc'
        ? result[left] > result[target]
        : result[left] < result[target];
      if (leftBetter) target = left;
    }

    if (right < size) {
      const rightBetter = order === 'asc'
        ? result[right] > result[target]
        : result[right] < result[target];
      if (rightBetter) target = right;
    }

    if (target !== root) {
      [result[root], result[target]] = [result[target], result[root]];
      heapify(size, target);
    }
  }

  // 1. Построение кучи за O(n)
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }

  // 2. Извлечение корня кучи за O(n log n)
  for (let end = n - 1; end > 0; end--) {
    [result[0], result[end]] = [result[end], result[0]];
    heapify(end, 0);
  }

  return result;
}`,
      lineExplanations: [
        {
          lines: 'Индексы потомков: left = 2 * root + 1, right = 2 * root + 2',
          explanation: 'Позволяет представить двоичное дерево в обычном массиве без создания объектов узлов и указателей.',
        },
        {
          lines: 'Цикл построения кучи от ⌊n/2⌋ - 1 до 0',
          explanation: 'Листья дерева (индексы ≥ ⌊n/2⌋) уже являются тривиальными кучами, поэтому просеивание выполняется только для внутренних узлов.',
        },
        {
          lines: 'Обмен [result[0], result[end]] и heapify(end, 0)',
          explanation: 'Перемещает максимальный (или минимальный) элемент с вершины кучи в отсортированный хвост массива и восстанавливает кучу.',
        },
      ],
    },
  },
  {
    id: 'shell',
    nameEn: 'Shell Sort',
    nameRu: 'Сортировка Шелла',
    fullName: 'Shell Sort — сортировка Шелла',
    shortDescription:
      'Обобщение сортировки вставками: сначала сравнивает и перемещает элементы на большом расстоянии (шаге gap), постепенно уменьшая шаг до 1.',
    detailedPrinciple:
      'Предложен Дональдом Шеллом в 1959 году. Главный недостаток обычной сортировки вставками заключается в том, что элементы сдвигаются только на одну соседнюю позицию за шаг. Shell Sort устраняет эту проблему: выбирается убывающая последовательность шагов gap (например, классическая последовательность Шелла: ⌊n/2⌋, ⌊n/4⌋, ..., 1). На каждом шаге gap выполняются независимые сортировки вставками для подгрупп элементов, отстоящих друг от друга на gap позиций. Благодаря крупным прыжкам элементы быстро приближаются к своим итоговым местам, и когда gap достигает 1, массив оказывается уже почти отсортированным, а финальный проход завершается очень быстро.',
    stepByStepSummary: [
      'Выбрать начальный шаг сравнения gap = ⌊n / 2⌋.',
      'Выполнить сортировку вставками для элементов, отстоящих друг от друга на шаг gap.',
      'Уменьшить шаг вдвое: gap = ⌊gap / 2⌋.',
      'Повторять процесс, пока gap не станет равным 1 (финальный проход обычной сортировки вставками).',
    ],
    pivotOrGapStrategy:
      'Используется классическая последовательность шагов Дональда Шелла: gap = ⌊n/2⌋, ⌊n/4⌋, ⌊n/8⌋, ..., 1. Важно: асимптотическая сложность алгоритма напрямую зависит от выбранной последовательности шагов!',
    bestComplexity: 'O(n log n)',
    bestComplexityNote: 'На уже упорядоченных данных требуется по одному сравнению на элемент для каждого из log₂ n шагов.',
    averageComplexity: 'Зависит от шагов (обычно ~O(n^1.25 .. n^1.5))',
    averageComplexityNote: 'Для последовательности Шелла (n/2^k) в худшем случае O(n²), для последовательности Хиббарда — O(n^(3/2)), для Пратта — O(n log² n).',
    worstComplexity: 'O(n²) / O(n^(3/2)) (зависит от gap)',
    worstComplexityNote: 'Сложность зависит от выбранной последовательности шагов: при классическом делении пополам худший случай составляет O(n²), а при улучшенных последовательностях — O(n^(3/2)) или O(n^(4/3)).',
    spaceComplexity: 'O(1)',
    stable: false,
    stableNote: 'Неустойчив: независимые перестановки элементов с большим шагом gap могут менять порядок равных элементов.',
    inPlace: true,
    inPlaceNote: 'Выполняется полностью на месте с использованием O(1) дополнительной памяти.',
    difficulty: 'Средний',
    categories: ['efficient', 'in-place'],
    advantages: [
      'Значительно быстрее обычной сортировки вставками на массивах среднего размера (до нескольких тысяч элементов)',
      'Очень компактный нерекурсивный код и память O(1)',
      'Адаптивен к частично упорядоченным массивам',
    ],
    disadvantages: [
      'Сложность сильно зависит от выбора последовательности шагов gap',
      'Неустойчивый алгоритм сортировки',
      'На очень больших массивах уступает Quick Sort, Merge Sort и Heap Sort',
    ],
    useCases: [
      'Встроенные системы и микроконтроллеры с жёстким лимитом памяти на стек и код',
      'Сортировка массивов среднего размера (100 – 5000 элементов) без использования рекурсии',
    ],
    code: {
      pseudocode: `процедура shellSort(A, направление):
  n = длина(A)
  gap = n div 2
  пока gap > 0:
    для i от gap до n - 1:
      temp = A[i]
      j = i
      пока j >= gap И нарушен_порядок(A[j - gap], temp, направление):
        A[j] = A[j - gap]
        j = j - gap
      A[j] = temp
    gap = gap div 2
  вернуть A`,
      javascript: `function shellSort(arr, order = 'asc') {
  const result = [...arr];
  const n = result.length;

  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < n; i++) {
      const temp = result[i];
      let j = i;

      while (
        j >= gap &&
        (order === 'asc' ? result[j - gap] > temp : result[j - gap] < temp)
      ) {
        result[j] = result[j - gap];
        j -= gap;
      }

      result[j] = temp;
    }
  }

  return result;
}`,
      typescript: `export function shellSort(arr: number[], order: 'asc' | 'desc' = 'asc'): number[] {
  const result = [...arr];
  const n = result.length;

  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < n; i++) {
      const temp = result[i];
      let j = i;

      while (
        j >= gap &&
        (order === 'asc' ? result[j - gap] > temp : result[j - gap] < temp)
      ) {
        result[j] = result[j - gap];
        j -= gap;
      }

      result[j] = temp;
    }
  }

  return result;
}`,
      lineExplanations: [
        {
          lines: 'for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2))',
          explanation: 'Задаёт последовательность шагов Шелла, уменьшая расстояние между сравниваемыми элементами вдвое на каждой итерации вплоть до gap = 1.',
        },
        {
          lines: 'result[j - gap] > temp',
          explanation: 'Сравнивает элементы, отстоящие друг от друга на шаг gap, позволяя элементам быстро перемещаться через массив.',
        },
        {
          lines: 'Проход при gap === 1',
          explanation: 'Гарантирует корректность результата: это обычная сортировка вставками, но к этому моменту массив уже почти упорядочен.',
        },
      ],
    },
  },
  {
    id: 'counting',
    nameEn: 'Counting Sort',
    nameRu: 'Сортировка подсчётом',
    fullName: 'Counting Sort — сортировка подсчётом',
    shortDescription:
      'Несравнительный алгоритм для целых чисел: подсчитывает частоту вхождения каждого значения и восстанавливает упорядоченный массив за линейное время O(n + k).',
    detailedPrinciple:
      'В отличие от всех предыдущих алгоритмов, Counting Sort вообще не сравнивает элементы массива между собой! Он применим к целым числам из ограниченного диапазона [min..max]. Сначала алгоритм находит минимальное и максимальное значения, определяя размер диапазона k = max - min + 1. Затем создаётся вспомогательный массив частот count длины k. За один проход по входному массиву подсчитывается, сколько раз встретилось каждое число. После этого по таблице частот формируется отсортированный массив (или вычисляются префиксные суммы для сохранения устойчивости объектов). Благодаря сдвигу индекса на minVal (index = value - minVal) алгоритм корректно поддерживает в том числе отрицательные целые числа.',
    stepByStepSummary: [
      'Найти минимальное (min) и максимальное (max) значения в массиве, вычислить диапазон k = max - min + 1.',
      'Создать массив частот count длины k и заполнить его нулями.',
      'Пройти по исходному массиву и увеличить счётчик для каждого встреченного значения.',
      'Пройти по массиву частот (от min к max для возрастания или от max к min для убывания) и записать каждое число соответствующее количество раз.',
    ],
    bestComplexity: 'O(n + k)',
    bestComplexityNote: 'Где n — количество элементов, а k = max - min + 1 — размер диапазона значений.',
    averageComplexity: 'O(n + k)',
    worstComplexity: 'O(n + k)',
    worstComplexityNote: 'Эффективен, когда k = O(n). Если диапазон k огромный (например, от 1 до 10⁹ при n = 10), алгоритм становится неэффективным по времени и памяти.',
    spaceComplexity: 'O(n + k)',
    spaceComplexityNote: 'Требует память O(k) для массива частот (и O(n) для выходного массива в устойчивой реализации с префиксными суммами).',
    stable: true,
    stableNote: 'Может быть устойчивым при реализации через префиксные суммы и выходной массив (для примитивных чисел оба варианта дают идентичный результат).',
    inPlace: false,
    inPlaceNote: 'Не является сортировкой на месте, так как требует выделения дополнительного массива частот размера k.',
    difficulty: 'Средний',
    categories: ['efficient', 'stable', 'linear'],
    advantages: [
      'Преодолевает нижнюю границу сравнительных сортировок Ω(n log n), работая за линейное время O(n + k)',
      'Выполняет 0 попарных сравнений элементов между собой',
      'Идеален для массивов с большим количеством дубликатов в узком диапазоне целых чисел',
    ],
    disadvantages: [
      'Применим только к целым числам (или данным, приводимым к целочисленным ключам)',
      'Потребление памяти O(k) напрямую зависит от разброса значений (max - min)',
    ],
    useCases: [
      'Сортировка оценок, возрастов, кодов символов или небольших целых чисел с малым диапазоном k',
      'Базовый строительный блок для поразрядной сортировки (Radix Sort)',
    ],
    code: {
      pseudocode: `функция countingSort(A, направление):
  если A пуст: вернуть A
  min = минимум(A); max = максимум(A)
  k = max - min + 1
  count = массив из k нулей
  для каждого x в A:
    count[x - min] = count[x - min] + 1
  результат = []
  для v от min до max (или от max до min):
    повторить count[v - min] раз:
      добавить v в результат
  вернуть результат`,
      javascript: `function countingSort(arr, order = 'asc') {
  if (arr.length <= 1) return [...arr];

  let min = arr[0];
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < min) min = arr[i];
    if (arr[i] > max) max = arr[i];
  }

  const range = max - min + 1;
  const count = new Array(range).fill(0);

  // Подсчёт вхождений каждого числа (со сдвигом на min для поддержки отрицательных чисел)
  for (let i = 0; i < arr.length; i++) {
    count[arr[i] - min]++;
  }

  const result = [];
  if (order === 'asc') {
    for (let i = 0; i < range; i++) {
      while (count[i] > 0) {
        result.push(i + min);
        count[i]--;
      }
    }
  } else {
    for (let i = range - 1; i >= 0; i--) {
      while (count[i] > 0) {
        result.push(i + min);
        count[i]--;
      }
    }
  }

  return result;
}`,
      typescript: `export function countingSort(arr: number[], order: 'asc' | 'desc' = 'asc'): number[] {
  if (arr.length <= 1) return [...arr];

  let min = arr[0];
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < min) min = arr[i];
    if (arr[i] > max) max = arr[i];
  }

  const range = max - min + 1;
  const count = new Array<number>(range).fill(0);

  for (let i = 0; i < arr.length; i++) {
    count[arr[i] - min]++;
  }

  const result: number[] = [];
  if (order === 'asc') {
    for (let i = 0; i < range; i++) {
      while (count[i] > 0) {
        result.push(i + min);
        count[i]--;
      }
    }
  } else {
    for (let i = range - 1; i >= 0; i--) {
      while (count[i] > 0) {
        result.push(i + min);
        count[i]--;
      }
    }
  }

  return result;
}`,
      lineExplanations: [
        {
          lines: 'const range = max - min + 1',
          explanation: 'Определяет размер таблицы частот k. Использование смещения min позволяет корректно сортировать в том числе отрицательные числа.',
        },
        {
          lines: 'count[arr[i] - min]++',
          explanation: 'За один линейный проход O(n) подсчитывает количество вхождений каждого числа без единого сравнения элементов друг с другом.',
        },
        {
          lines: 'Восстановление массива по таблице count',
          explanation: 'Проходит по корзинам частот (в прямом или обратном порядке в зависимости от направления сортировки) и формирует результат за O(n + k).',
        },
      ],
    },
  },
];

export function getAlgorithmById(id: AlgorithmId): AlgorithmInfo {
  return ALGORITHMS_DATA.find((alg) => alg.id === id) || ALGORITHMS_DATA[0];
}

