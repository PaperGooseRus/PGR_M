# Выполняется отдельным процессом CMake из теста pgr_app_smoke.
# Проверяем именно наблюдаемое поведение приложения, не подключая GTest.
if(NOT DEFINED APP_PATH OR NOT EXISTS "${APP_PATH}")
    message(FATAL_ERROR "Не найден исполняемый файл приложения: ${APP_PATH}")
endif()

# TIMEOUT защищает от зависания, а отдельный stderr помогает искать ошибки.
execute_process(
    COMMAND "${APP_PATH}"
    RESULT_VARIABLE _exit_code
    OUTPUT_VARIABLE _stdout
    ERROR_VARIABLE _stderr
    OUTPUT_STRIP_TRAILING_WHITESPACE
    TIMEOUT 5
)

# Ненулевой код завершения нельзя считать успехом даже при правильном stdout.
if(NOT "${_exit_code}" STREQUAL "0")
    message(FATAL_ERROR
        "Приложение завершилось с кодом '${_exit_code}'. stderr: ${_stderr}")
endif()

# Сверяем точный результат (включая отсутствие дополнительных строк).
if(NOT "${_stdout}" STREQUAL "Hello, World!")
    message(FATAL_ERROR
        "Неожиданный stdout: '${_stdout}'. stderr: ${_stderr}")
endif()
