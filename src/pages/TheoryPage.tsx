import React from 'react';
import { BigOVisualizer } from '../components/BigOVisualizer';
import { ComplexityTable } from '../components/ComplexityTable';
import { TooltipTerm } from '../components/TooltipTerm';
import { GLOSSARY_TERMS } from '../data/glossary';
import {
  BookOpen,
  Layers,
  Database,
  Clock,
  HardDrive,
  ShieldCheck,
  Zap,
  Compass,
  Scale,
  HelpCircle,
} from 'lucide-react';

export const TheoryPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Заголовок */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F59E0B]/15 border border-[#F59E0B]/30 text-xs font-semibold text-[#F59E0B]">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Теоретический справочник</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#F3F4F6]">
          Основы алгоритмов сортировки
        </h1>
        <p className="text-sm sm:text-base text-[#9CA3AF] max-w-3xl leading-relaxed">
          Структурированное руководство по теории сортировки для курса «Алгоритмы и структуры данных». Наводите курсор (или нажимайте) на подчёркнутые термины для просмотра всплывающих подсказок.
        </p>
      </div>

      {/* 1. Что такое сортировка и 2. Зачем нужна сортировка */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#171D29] border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-[#F3F4F6] flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-[#8B5CF6]" />
            <span>1. Что такое сортировка?</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
            <strong className="text-[#F3F4F6]">Сортировка</strong> — это процесс перестановки элементов набора данных (массива, списка или файла) в определённом порядке в соответствии с заданным правилом <TooltipTerm termKey="comparison">сравнения</TooltipTerm> ключей.
          </p>
          <div className="bg-[#121620] border border-white/5 rounded-xl p-4 space-y-2 text-xs">
            <div className="font-semibold text-[#F3F4F6]">Типичные примеры сортировки:</div>
            <ul className="space-y-1.5 text-[#9CA3AF]">
              <li>• <strong className="text-[#8B5CF6]">Числа по возрастанию:</strong> [42, 7, 19, 3] → [3, 7, 19, 42]</li>
              <li>• <strong className="text-[#06B6D4]">Числа по убыванию:</strong> [42, 7, 19, 3] → [42, 19, 7, 3]</li>
              <li>• <strong className="text-[#22C55E]">Имена по алфавиту:</strong> [«Яковлев», «Алексеев», «Борисов»] → [«Алексеев», «Борисов», «Яковлев»]</li>
              <li>• <strong className="text-[#F59E0B]">Записи по дате:</strong> хронологическая лента событий или транзакций</li>
              <li>• <strong className="text-[#EC4899]">Товары по цене:</strong> фильтрация каталога интернет-магазина</li>
            </ul>
          </div>
        </div>

        <div className="bg-[#171D29] border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-[#F3F4F6] flex items-center gap-2.5">
            <Database className="w-5 h-5 text-[#06B6D4]" />
            <span>2. Зачем нужна сортировка в программировании?</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
            Сортировка — одна из фундаментальных операций информатики, на которую опирается большинство алгоритмов обработки данных:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#121620] border border-white/5">
              <div className="font-bold text-[#F3F4F6]">Быстрый поиск данных</div>
              <p className="text-[#9CA3AF] mt-1">
                В отсортированном массиве двоичный поиск (Binary Search) находит элемент за O(log n) вместо полного перебора O(n).
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[#121620] border border-white/5">
              <div className="font-bold text-[#F3F4F6]">Базы данных (СУБД)</div>
              <p className="text-[#9CA3AF] mt-1">
                Индексы B-деревьев, операции ORDER BY, GROUP BY и соединение таблиц (Merge Join) напрямую используют сортировку.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[#121620] border border-white/5">
              <div className="font-bold text-[#F3F4F6]">Анализ и дедупликация</div>
              <p className="text-[#9CA3AF] mt-1">
                Поиск дубликатов, медианы, квантилей и частотных аномалий в упорядоченном массиве выполняется за один линейный проход.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[#121620] border border-white/5">
              <div className="font-bold text-[#F3F4F6]">Системные алгоритмы</div>
              <p className="text-[#9CA3AF] mt-1">
                Жадные алгоритмы (например, алгоритм Краскала для графов), планировщики задач ОС и компьютерная графика.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Временная сложность Big O и случаи */}
      <div className="bg-[#171D29] border border-white/10 rounded-2xl p-6 space-y-5">
        <h2 className="text-lg sm:text-xl font-bold text-[#F3F4F6] flex items-center gap-2.5">
          <Clock className="w-5 h-5 text-[#22C55E]" />
          <span>3. Временная сложность и нотация Big O</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
          Нотация <TooltipTerm termKey="bigO">Big O</TooltipTerm> описывает, как масштабируется число элементарных операций алгоритма при росте количества элементов <code className="text-[#06B6D4]">n</code>. При анализе различают три сценария:
          <strong className="text-[#22C55E]"> лучший случай</strong> (наиболее благоприятный вход),
          <strong className="text-[#F59E0B]"> средний случай</strong> (математическое ожидание на случайных данных) и
          <strong className="text-[#EF4444]"> худший случай</strong> (верхняя гарантия времени работы на самых неудобных данных).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-[#121620] border border-[#22C55E]/30 space-y-1.5">
            <div className="font-mono text-base font-bold text-[#22C55E]">O(1)</div>
            <div className="font-semibold text-[#F3F4F6]">Константная</div>
            <p className="text-[#9CA3AF]">
              Время не зависит от размера массива. Пример: чтение элемента по индексу <code className="text-[#F3F4F6]">arr[i]</code> или обмен двух переменных.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#121620] border border-[#06B6D4]/30 space-y-1.5">
            <div className="font-mono text-base font-bold text-[#06B6D4]">O(log n)</div>
            <div className="font-semibold text-[#F3F4F6]">Логарифмическая</div>
            <p className="text-[#9CA3AF]">
              Задача уменьшается вдвое на каждом шаге. Пример: двоичный поиск или просеивание одного узла в <TooltipTerm termKey="binaryHeap">двоичной куче</TooltipTerm>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#121620] border border-[#8B5CF6]/30 space-y-1.5">
            <div className="font-mono text-base font-bold text-[#8B5CF6]">O(n)</div>
            <div className="font-semibold text-[#F3F4F6]">Линейная</div>
            <p className="text-[#9CA3AF]">
              Однократный проход по массиву. Пример: лучший случай Bubble/Insertion Sort, а также Counting Sort при малом диапазоне k.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#121620] border border-[#F59E0B]/30 space-y-1.5">
            <div className="font-mono text-base font-bold text-[#F59E0B]">O(n log n)</div>
            <div className="font-semibold text-[#F3F4F6]">Линейно-логарифмическая</div>
            <p className="text-[#9CA3AF]">
              Оптимальный класс для универсальных сравнительных сортировок: Merge Sort, Heap Sort и средний случай Quick Sort.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#121620] border border-[#EF4444]/30 space-y-1.5">
            <div className="font-mono text-base font-bold text-[#EF4444]">O(n²)</div>
            <div className="font-semibold text-[#F3F4F6]">Квадратичная</div>
            <p className="text-[#9CA3AF]">
              Вложенные проходы по массиву. Пример: Bubble Sort, Selection Sort, Insertion Sort в среднем и худшем случаях.
            </p>
          </div>
        </div>
      </div>

      {/* Интерактивный график Big O (Раздел 20) */}
      <BigOVisualizer />

      {/* 4. Пространственная сложность, 5. Устойчивость, 6. Адаптивность, 7. In-place */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#171D29] border border-white/10 rounded-2xl p-6 space-y-3">
          <h3 className="text-base font-bold text-[#F3F4F6] flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-[#06B6D4]" />
            <span>4. Пространственная сложность и сортировка на месте (In-place)</span>
          </h3>
          <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
            <strong className="text-[#F3F4F6]">Пространственная сложность</strong> показывает, сколько дополнительной памяти сверх исходного массива требует алгоритм.
          </p>
          <ul className="space-y-2 text-xs text-[#9CA3AF]">
            <li>
              • <TooltipTerm termKey="inPlace">Сортировка на месте (In-place)</TooltipTerm> — алгоритмы <strong className="text-[#F3F4F6]">Bubble, Selection, Insertion, Heap, Shell Sort</strong> используют только <code className="text-[#22C55E]">O(1)</code> памяти (несколько переменных для индексов).
            </li>
            <li>
              • <strong className="text-[#F3F4F6]">Quick Sort</strong> переставляет элементы на месте, но расходует память на стек вызовов <TooltipTerm termKey="recursion">рекурсии</TooltipTerm>: <code className="text-[#06B6D4]">O(log n)</code> в среднем и до <code className="text-[#EF4444]">O(n)</code> в худшем случае.
            </li>
            <li>
              • <strong className="text-[#F3F4F6]">Сортировка с дополнительным массивом</strong>: классический <strong className="text-[#F3F4F6]">Merge Sort</strong> требует <code className="text-[#F59E0B]">O(n)</code> памяти для временных подмассивов при <TooltipTerm termKey="merge">слиянии</TooltipTerm>, а <strong className="text-[#F3F4F6]">Counting Sort</strong> — <code className="text-[#F59E0B]">O(n + k)</code>.
            </li>
          </ul>
        </div>

        <div className="bg-[#171D29] border border-white/10 rounded-2xl p-6 space-y-3">
          <h3 className="text-base font-bold text-[#F3F4F6] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#22C55E]" />
            <span>5. Устойчивость сортировки (Stability)</span>
          </h3>
          <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
            Алгоритм называется <TooltipTerm termKey="stability">устойчивым</TooltipTerm>, если он сохраняет взаимный порядок элементов с одинаковыми ключами.
          </p>
          <div className="p-3.5 rounded-xl bg-[#121620] border border-white/5 space-y-2 text-xs">
            <div className="font-bold text-[#F3F4F6]">Наглядный пример со студентами:</div>
            <p className="text-[#9CA3AF]">
              Исходный список по алфавиту: <code className="text-[#06B6D4]">[Анна (5), Борис (4), Виктор (5)]</code>.
              Мы сортируем список по убыванию оценки:
            </p>
            <div className="text-[#22C55E]">
              ✓ <strong>Устойчивый алгоритм (Bubble, Insertion, Merge):</strong> [Анна (5), Виктор (5), Борис (4)] — Анна осталась перед Виктором.
            </div>
            <div className="text-[#EF4444]">
              ✕ <strong>Неустойчивый алгоритм (Selection, Quick, Heap, Shell):</strong> может выдать [Виктор (5), Анна (5), Борис (4)], нарушив алфавитный порядок отличников.
            </div>
          </div>
        </div>

        <div className="bg-[#171D29] border border-white/10 rounded-2xl p-6 space-y-3">
          <h3 className="text-base font-bold text-[#F3F4F6] flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#F59E0B]" />
            <span>6. Адаптивность алгоритмов</span>
          </h3>
          <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
            <TooltipTerm termKey="adaptivity">Адаптивный алгоритм</TooltipTerm> использует существующий порядок во входном массиве для сокращения числа операций.
          </p>
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            Например, на почти отсортированном массиве <strong className="text-[#F3F4F6]">Insertion Sort</strong> и <strong className="text-[#F3F4F6]">Bubble Sort (с флагом обмена)</strong> выполняются почти за линейное время <code className="text-[#22C55E]">O(n)</code>, тогда как неадаптивный <strong className="text-[#F3F4F6]">Selection Sort</strong> не замечает упорядоченности и всегда делает все <code className="text-[#EF4444]">n(n - 1)/2</code> сравнений.
          </p>
        </div>

        <div className="bg-[#171D29] border border-white/10 rounded-2xl p-6 space-y-3">
          <h3 className="text-base font-bold text-[#F3F4F6] flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#8B5CF6]" />
            <span>7. Нижняя граница сравнительной сортировки Ω(n log n)</span>
          </h3>
          <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
            Любой алгоритм, который узнаёт о порядке элементов <strong className="text-[#F3F4F6]">только путём попарных сравнений</strong> (<code className="text-[#06B6D4]">a[i] &lt; a[j]</code>), в худшем случае обязан выполнить не менее <code className="text-[#F59E0B]">Ω(n log n)</code> сравнений.
          </p>
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            Почему? У массива из <code className="text-[#F3F4F6]">n</code> элементов существует <code className="text-[#F3F4F6]">n!</code> различных перестановок. Каждое сравнение имеет 2 исхода и делит множество возможных перестановок максимум пополам. Высота такого двоичного дерева решений не меньше <code className="text-[#06B6D4]">log₂(n!) ≈ n log₂ n</code>.
            При этом эта граница относится только к сравнительной модели и не запрещает линейные алгоритмы вроде <strong className="text-[#22C55E]">Counting Sort O(n + k)</strong>, использующие целочисленную структуру ключей.
          </p>
        </div>
      </div>

      {/* 8. Как выбрать подходящий алгоритм */}
      <div className="bg-[#171D29] border border-white/10 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-[#F3F4F6] flex items-center gap-2">
          <Compass className="w-5 h-5 text-[#06B6D4]" />
          <span>8. Практические рекомендации: как выбрать алгоритм сортировки?</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#121620] border border-white/5 space-y-1">
            <div className="font-bold text-[#8B5CF6]">1. Малый размер массива (n ≤ 20..32)</div>
            <p className="text-[#9CA3AF]">
              Выбирайте <strong className="text-[#F3F4F6]">Insertion Sort</strong>: минимальные накладные расходы, простота кода и отличная работа с кэшем.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#121620] border border-white/5 space-y-1">
            <div className="font-bold text-[#22C55E]">2. Почти отсортированные данные</div>
            <p className="text-[#9CA3AF]">
              <strong className="text-[#F3F4F6]">Insertion Sort</strong> мгновенно доупорядочит массив за время, близкое к O(n).
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#121620] border border-white/5 space-y-1">
            <div className="font-bold text-[#06B6D4]">3. Большие массивы общего назначения</div>
            <p className="text-[#9CA3AF]">
              <strong className="text-[#F3F4F6]">Quick Sort</strong> (с хорошим выбором <TooltipTerm termKey="pivot">опорного элемента</TooltipTerm>) обеспечивает лучшую среднюю скорость в оперативной памяти.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#121620] border border-white/5 space-y-1">
            <div className="font-bold text-[#F59E0B]">4. Требуется устойчивость (Stability)</div>
            <p className="text-[#9CA3AF]">
              Используйте <strong className="text-[#F3F4F6]">Merge Sort</strong> — гарантирует O(n log n) и сохраняет порядок записей с равными ключами.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#121620] border border-white/5 space-y-1">
            <div className="font-bold text-[#EC4899]">5. Строгий лимит памяти O(1) и гарантия O(n log n)</div>
            <p className="text-[#9CA3AF]">
              Выбирайте <strong className="text-[#F3F4F6]">Heap Sort</strong> — не требует доп. массивов и никогда не замедляется до O(n²).
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#121620] border border-white/5 space-y-1">
            <div className="font-bold text-[#22C55E]">6. Целые числа в узком диапазоне k</div>
            <p className="text-[#9CA3AF]">
              <strong className="text-[#F3F4F6]">Counting Sort</strong> отсортирует массив за линейное время O(n + k) без сравнений.
            </p>
          </div>
        </div>
      </div>

      {/* Полная таблица сложности (Раздел 15) */}
      <ComplexityTable />

      {/* Словарь терминов (Раздел 21) */}
      <div className="bg-[#171D29] border border-white/10 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-[#F3F4F6] flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#8B5CF6]" />
          <span>Словарь ключевых терминов</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.values(GLOSSARY_TERMS).map((item) => (
            <div
              key={item.key}
              className="p-3.5 rounded-xl bg-[#121620] border border-white/5 space-y-1"
            >
              <div className="text-xs font-bold text-[#8B5CF6]">{item.term}</div>
              <p className="text-xs text-[#F3F4F6]/90 leading-relaxed">
                {item.shortDefinition}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

