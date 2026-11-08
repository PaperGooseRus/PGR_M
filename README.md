# PGR_M

Модульный проект на C++17 с управлением сборкой через CMake.

Три модуля `core`, `gui`, `nn` **независимы друг от друга**. Каждый включается
отдельно; только приложение `app` объединяет библиотеки при необходимости.
При отсутствии `.cpp` модуль создаётся как `INTERFACE`, при наличии — как `STATIC`.

## Структура

- `CMakeLists.txt` — общие настройки и выбор модулей.
- `cmake/CheckModuleIndependence.cmake` — защита от прямых межмодульных связей.
- `modules/core`, `modules/gui`, `modules/nn` — независимые компоненты.
- `app/` — точка входа и композиция модулей.
- `tests/` — CTest smoke-тест.
- `.github/workflows/ci.yml` — матрица платформ и конфигураций.
- `build/build.bat` — запуск локальной сборки на Windows.
- `site/` — статический сайт; при работе над CMake не изменяется.
- `docs/` — обязательные соглашения по сборке и CI.

## Быстрый старт

Windows (из корня репозитория, в cmd или PowerShell):

```bat
build\build.bat
```

В MSYS2 UCRT64 можно отдельно использовать Ninja:

```sh
cmake -S . -B build/windows/cmake -G Ninja -DCMAKE_BUILD_TYPE=Debug
cmake --build build/windows/cmake --parallel
ctest --test-dir build/windows/cmake -C Debug --output-on-failure --no-tests=error
```

Linux:

```sh
cmake -S . -B build/linux/cmake -DCMAKE_BUILD_TYPE=Debug
cmake --build build/linux/cmake --parallel
ctest --test-dir build/linux/cmake -C Debug --output-on-failure --no-tests=error
```

macOS:

```sh
cmake -S . -B build/macos/cmake -DCMAKE_BUILD_TYPE=Debug
cmake --build build/macos/cmake --parallel
ctest --test-dir build/macos/cmake -C Debug --output-on-failure --no-tests=error
```

Исполняемый файл теперь находится **в дереве сборки**, например:
`build/windows/cmake/bin/Debug/app.exe` или `build/linux/cmake/bin/Debug/app`.
Это намеренное изменение: Debug и Release больше не перезаписывают друг друга.

## Дополнительные сведения

- [Правила работы с CMake](docs/CMAKE.md).
- [Правила работы с CI и матрицей платформ](docs/CI.md).

Требования: CMake >= 3.20, компилятор с поддержкой C++17.
Прямое подключение одного модуля к другому запрещено и проверяется при конфигурации.
