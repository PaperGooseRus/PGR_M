# =============================================================================
# PGR_M: корневая конфигурация CMake.
#
# Обязанности файла:
#   1) определить общие правила компиляции;
#   2) разрешить включать и выключать независимые модули;
#   3) создать приложение, которое при необходимости объединяет модули;
#   4) подключить тестирование.
#
# ВАЖНО: core, gui и nn не имеют зависимостей друг от друга. Только приложение
# может связываться с несколькими модулями одновременно.
# Подробности: docs/CMAKE.md, docs/CI.md.
# =============================================================================

# Минимальная проверенная для проекта версия. Эта команда должна быть раньше
# project(), поскольку задаёт совместимость с поведением команд CMake.
cmake_minimum_required(VERSION 3.20)

# Объявляем имя/версию проекта и активируем поддержку C++.
# Отдельные исходные файлы .c в будущем потребуют LANGUAGES C CXX.
project(PGR_M VERSION 0.1.0 LANGUAGES CXX)

# Общий стандарт для целей, создаваемых ниже. OFF отключает необязательные
# расширения компилятора (например, -std=gnu++17 вместо -std=c++17).
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# Одноконфигурационные генераторы (Ninja, Unix Makefiles) используют
# CMAKE_BUILD_TYPE. Если пользователь не выбрал конфигурацию, берём Debug.
# Многоконфигурационные генераторы (Visual Studio, Xcode) выбирают её при
# сборке через --config, поэтому принудительно менять её для них нельзя.
if(NOT CMAKE_CONFIGURATION_TYPES AND NOT CMAKE_BUILD_TYPE)
    set(CMAKE_BUILD_TYPE Debug CACHE STRING "Тип сборки" FORCE)
    set_property(CACHE CMAKE_BUILD_TYPE PROPERTY STRINGS
        Debug Release RelWithDebInfo MinSizeRel)
endif()

# Все результаты остаются в КАТАЛОГЕ СБОРКИ (CMAKE_BINARY_DIR), а не в исходниках.
# Генераторное выражение $<CONFIG> вычисляется при генерации: Debug, Release...
# Оно также не даёт Visual Studio/Xcode повторно добавить имя конфигурации.
# Примеры: build/windows/cmake/bin/Debug/app.exe, build/linux/cmake/bin/Release/app.
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/bin/$<CONFIG>")
set(CMAKE_LIBRARY_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/lib/$<CONFIG>")
set(CMAKE_ARCHIVE_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/lib/$<CONFIG>")

# Настраиваемые параметры сохраняются в CMakeCache.txt каждого дерева сборки.
# Все три модуля опциональны: разрешены любые комбинации ON/OFF.
option(PGR_BUILD_CORE "Собирать независимый модуль core" ON)
option(PGR_BUILD_GUI "Собирать независимый модуль gui" ON)
option(PGR_BUILD_NN "Собирать независимый модуль nn" ON)
option(PGR_BUILD_TESTS "Регистрировать тесты CTest" ON)

# Включаем тестовый механизм из корневого каталога, как требует CTest.
# Используем один переключатель PGR_BUILD_TESTS: дополнительный BUILD_TESTING
# от include(CTest) здесь не нужен. Команда ctest доступна и без include(CTest).
if(PGR_BUILD_TESTS)
    enable_testing()
endif()

# Каждая директория объявляет ТОЛЬКО свою библиотеку и собственные include-пути.
# Взаимное расположение модулей здесь не задаёт связи между ними.
if(PGR_BUILD_CORE)
    add_subdirectory(modules/core)
endif()
if(PGR_BUILD_GUI)
    add_subdirectory(modules/gui)
endif()
if(PGR_BUILD_NN)
    add_subdirectory(modules/nn)
endif()

# Дополнительная архитектурная защита: конфигурация завершится ошибкой,
# если кто-то добавит зависимость одного pgr-модуля от другого.
include(cmake/CheckModuleIndependence.cmake)
pgr_check_module_independence()

# Приложение отвечает за композицию независимых библиотек. Оно создаётся
# после модулей, чтобы ссылки на их цели уже были известны CMake.
add_subdirectory(app)

# Тесты регистрируются после создания приложения, поскольку smoke-тест
# использует цель app. При отключении тестов приложение всё равно собирается.
if(PGR_BUILD_TESTS)
    add_subdirectory(tests)
endif()
