# Правила работы с CMake в PGR_M

## 1. Назначение и основные понятия

CMake **не является компилятором**. На стадии **конфигурации** он читает
`CMakeLists.txt` и вычисляет настройки/зависимости, на стадии **генерации**
создаёт файлы системы сборки (Ninja, Make, Visual Studio, Xcode). Затем
`cmake --build` передаёт управление этой системе сборки, которая компилирует
и связывает исполняемые файлы. `ctest` запускает зарегистрированные тесты.

Соглашения проекта: CMake >= 3.20, стандарт C++17, один корневой проект
`PGR_M`. Все новые CMake-команды сопровождаем понятными русскими комментариями:
**что** они настраивают и **почему** это делается на выбранном уровне.

## 2. Ответственность каталогов

| Путь | Ответственность |
|---|---|
| `CMakeLists.txt` | Языки, стандарт, каталоги вывода, флаги, модули, тесты |
| `cmake/CheckModuleIndependence.cmake` | Проверка отсутствия прямых CMake-связей между модулями |
| `modules/core/CMakeLists.txt` | Только библиотека `pgr_core` |
| `modules/gui/CMakeLists.txt` | Только библиотека `pgr_gui` |
| `modules/nn/CMakeLists.txt` | Только библиотека `pgr_nn` |
| `app/CMakeLists.txt` | Исполняемая цель `app`, сборка компонентов в приложение |
| `tests/CMakeLists.txt` | Регистрация тестов через CTest |
| `tests/check_app_output.cmake` | Проверка кода завершения и вывода приложения |

**Архитектурный инвариант:** `pgr_core`, `pgr_gui` и `pgr_nn` не зависят
друг от друга, ни напрямую, ни через включение чужих внутренних заголовков.
Любой модуль должен допускать сборку без двух других. Если понадобится
взаимодействие, ответственность за создание объектов, передачу параметров,
вызовы через абстракции и подключение библиотек несёт `app`.

Разрешённый граф зависимостей:

```text
          app
         / |  \
        /  |  \
    core  gui  nn

Между core, gui и nn стрелок НЕТ.
```

Внешние библиотеки разрешены внутри конкретного модуля, если необходимость
явно документирована и в CI предусмотрена установка зависимости на каждой
поддерживаемой платформе. Не делайте молчаливых предположений о путях SDK.

## 3. Почему команды корневого файла идут именно так

1. `cmake_minimum_required(VERSION 3.20)` задаёт минимальную версию и политики.
2. `project(... LANGUAGES CXX)` активирует язык и определяет компилятор.
3. `set(CMAKE_CXX_...)` задаёт параметры по умолчанию **до создания целей**.
4. `CMAKE_BUILD_TYPE` заполняется `Debug` только для одноконфигурационных
   генераторов и только если пользователь не указал своё значение.
5. `CMAKE_*_OUTPUT_DIRECTORY` задаются до `add_library`/`add_executable`.
6. `option(PGR_BUILD_...)` создаёт переключатели в кэше конфигурации.
7. `enable_testing()` включается до регистрации тестов.
8. `add_subdirectory(modules/...)` читает CMake каждого включённого модуля.
9. `pgr_check_module_independence()` проверяет известные цели.
10. `add_subdirectory(app)` связывает приложение с существующими модулями.
11. `add_subdirectory(tests)` регистрирует проверку приложения.

`add_subdirectory()` обрабатывает вложенный файл сразу. Но **порядок
компиляции определяют зависимости целей**, а не порядок строк в корневом
`CMakeLists.txt`. Порядок `core`, `gui`, `nn` не означает зависимость.

## 4. Правила для независимых библиотек

- Используйте `add_library(pgr_<name> STATIC ...)`, если есть `.cpp`.
- Для пустого/заголовочного модуля используйте `INTERFACE`.
- Для `STATIC`: `target_include_directories(... PUBLIC путь)`.
- Для `INTERFACE`: `target_include_directories(... INTERFACE путь)`.
- Не используйте `target_link_libraries(pgr_core ... pgr_gui)` и любые
  аналогичные связи между собственными модулями.
- Не используйте глобальные `include_directories()`, `link_directories()`,
  `add_definitions()` для обычного кода. Настройки должны принадлежать целям.
- Не добавляйте абсолютных путей к локальной Windows/Linux системе.
- При необходимости отдельных опций конкретной цели применяйте
  `target_compile_features()`, `target_compile_definitions()` и т. п.
- Изменяйте `app/CMakeLists.txt` только для организации приложения, а не для
  реализации сборки стороннего модуля.

**PRIVATE / PUBLIC / INTERFACE:** `PRIVATE` нужно только текущей цели,
`PUBLIC` — текущей цели и потребителям, `INTERFACE` — только потребителям.
При привязке модулей к `app` используйте `PRIVATE`.

Сейчас исходники модулей находятся через `file(GLOB ... CONFIGURE_DEPENDS)`.
Это временное удобство, пока каталоги пустые и состав исходников меняется.
Когда API стабилизируется, предпочтительно явно перечислять `.cpp` в
`target_sources()` для воспроизводимости и удобства code review. Если
добавится `src/`, обновите пути CMake и не забудьте назначить `include/`.

### Проверка архитектурного правила

`cmake/CheckModuleIndependence.cmake` проверяет свойства `LINK_LIBRARIES` и
`INTERFACE_LINK_LIBRARIES` всех существующих `pgr_*`. При обнаружении прямой
связи конфигурация прерывается с `FATAL_ERROR`. Проверка не анализирует C++
`#include`, генераторные выражения произвольной сложности или внешние SDK.
Поэтому контроль архитектуры при ревью кода всё равно необходим.

## 5. Каталоги исходников и результаты сборки

- `-S .` — исходный каталог с корневым `CMakeLists.txt`.
- `-B build/<platform>/cmake` — отдельный каталог с CMakeCache.txt,
  временными объектами и сгенерированными файлами.
- `-G Ninja` — необязательный выбор генератора; нельзя переиспользовать один
  и тот же каталог сборки с другим генератором без очистки.
- `-DCMAKE_BUILD_TYPE=Debug` — конфигурация для Ninja/Unix Makefiles.
- `--config Debug` — конфигурация для Visual Studio/Xcode; для прочих безопасно.
- `$<CONFIG>` — выражение, выбирающее имя активной конфигурации.

Исполняемые файлы: `<build-dir>/bin/<Config>/app[.exe]`.
Библиотеки: `<build-dir>/lib/<Config>/`. Это исключает перезапись артефактов
разными конфигурациями. Старая схема `build/windows/app.exe` больше не
используется. Платформа определяется компилятором и генератором CMake, а
не вручную через `if(WIN32)` в корневом файле.

## 6. Локальные команды

### Windows, через готовый скрипт

```bat
build\build.bat
```

### Windows, MSYS2 UCRT64, Ninja

```sh
cmake -S . -B build/windows/cmake -G Ninja -DCMAKE_BUILD_TYPE=Debug -DPGR_BUILD_TESTS=ON
cmake --build build/windows/cmake --parallel
ctest --test-dir build/windows/cmake -C Debug --output-on-failure --no-tests=error
```

### Linux

```sh
cmake -S . -B build/linux/cmake -DCMAKE_BUILD_TYPE=Release -DPGR_BUILD_TESTS=ON
cmake --build build/linux/cmake --parallel
ctest --test-dir build/linux/cmake -C Release --output-on-failure --no-tests=error
```

### macOS

```sh
cmake -S . -B build/macos/cmake -DCMAKE_BUILD_TYPE=Debug -DPGR_BUILD_TESTS=ON
cmake --build build/macos/cmake --parallel
ctest --test-dir build/macos/cmake -C Debug --output-on-failure --no-tests=error
```

### Выбор модулей

Например, только `nn`:

```sh
cmake -S . -B build/local/nn -DCMAKE_BUILD_TYPE=Debug -DPGR_BUILD_CORE=OFF -DPGR_BUILD_GUI=OFF -DPGR_BUILD_NN=ON
cmake --build build/local/nn --config Debug
ctest --test-dir build/local/nn -C Debug --output-on-failure --no-tests=error
```

Возможны все восемь сочетаний трёх флагов `PGR_BUILD_*` (в том числе
все три `OFF`). Тестирование отдельно выключается `-DPGR_BUILD_TESTS=OFF`.
Сборки с разными компиляторами/генераторами держите в отдельных папках:
CMakeCache.txt привязан к окружению, в котором был создан.

## 7. Проверка изменений и диагностика

Перед коммитом изменения CMake:

1. Выполните конфигурацию в **чистом** каталоге сборки.
2. Проверьте сборку с тремя включёнными модулями.
3. Проверьте сборку с тремя выключенными модулями и каждым по отдельности.
4. Запустите CTest, например `ctest --test-dir build/local -N` для списка
   тестов и `ctest --test-dir build/local --output-on-failure` для запуска.
5. Проверьте, что `core/gui/nn` не используют `#include` других модулей.
6. Проверьте результат CI на всех платформах и конфигурациях.

Типичные ошибки:

- **`Could not find compiler`**: установите компилятор и запустите команду
  в соответствующем окружении (например, MSYS2 UCRT64 или Developer Shell).
- **`generator ... does not match`**: используйте новую папку `-B` либо
  удалите старую сгенерированную сборку, но не исходники.
- **`No tests were found`**: включите `PGR_BUILD_TESTS=ON`, затем повторите
  конфигурацию. `--no-tests=error` намеренно считает пустой набор ошибкой.
- **`Нарушена независимость модулей`**: перенесите интеграцию из библиотеки
  в приложение, а не отключайте проверку.

## 8. Минимальные правила изменения проекта

Вносите только необходимые правки, не усложняйте систему сборки без причины,
не дублируйте флаги в каждом модуле, документируйте новые настройки и
проверяйте CTest после каждого изменения. Не подменяйте сборку прямыми
вызовами `g++`: это обходит граф зависимостей CMake и конфигурацию CI.

Официальные источники:

- <https://cmake.org/cmake/help/latest/guide/tutorial/index.html>
- <https://cmake.org/cmake/help/latest/command/add_library.html>
- <https://cmake.org/cmake/help/latest/command/target_link_libraries.html>
- <https://cmake.org/cmake/help/latest/command/enable_testing.html>
- <https://cmake.org/cmake/help/latest/manual/ctest.1.html>
