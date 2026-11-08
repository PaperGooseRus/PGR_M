@echo off
setlocal
rem ========================================================================
rem Локальная сборка PGR_M в Windows через CMake.
rem Скрипт не вызывает g++ напрямую: CMake сам выбирает установленный
rem генератор и компилятор, исходя из окружения (MSVC, MinGW и т. д.).
rem ========================================================================

rem %~dp0 — каталог этого скрипта, поэтому запуск возможен из любой папки.
set "ROOT=%~dp0.."
set "BUILD_DIR=%~dp0windows\cmake"
set "CONFIG=Debug"

rem Раздельное дерево сборки не смешивается с исходными файлами.
rem Для Ninja/Make нужен CMAKE_BUILD_TYPE, для Visual Studio — --config.
cmake -S "%ROOT%" -B "%BUILD_DIR%" -DCMAKE_BUILD_TYPE=%CONFIG% -DPGR_BUILD_TESTS=ON
if errorlevel 1 exit /b %errorlevel%

rem --config учитывает многоконфигурационные генераторы (Visual Studio).
cmake --build "%BUILD_DIR%" --config %CONFIG% --parallel 2
if errorlevel 1 exit /b %errorlevel%

rem Не считаем отсутствие тестов успехом; печатаем вывод упавших тестов.
ctest --test-dir "%BUILD_DIR%" -C %CONFIG% --output-on-failure --no-tests=error
exit /b %errorlevel%
