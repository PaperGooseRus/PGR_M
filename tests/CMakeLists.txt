# Smoke-тест запускает приложение через отдельный CMake-скрипт проверки.
# В отличие от простого PASS_REGULAR_EXPRESSION, скрипт проверяет И код
# завершения, И точную строку stdout; stderr выводится при ошибке.
# Путь $<TARGET_FILE:app> корректно разрешается в Visual Studio, Ninja, Xcode.
add_test(
    NAME pgr_app_smoke
    COMMAND "${CMAKE_COMMAND}"
        "-DAPP_PATH=$<TARGET_FILE:app>"
        -P "${CMAKE_CURRENT_SOURCE_DIR}/check_app_output.cmake"
)

# Защита от зависшего процесса и метка для выборочного запуска через ctest -L.
set_tests_properties(pgr_app_smoke PROPERTIES
    TIMEOUT 10
    LABELS smoke
)
