# Модуль nn полностью автономен от core и gui.
# Поддерживается постепенное развитие: сначала интерфейсная цель,
# после добавления .cpp — статическая библиотека.
file(GLOB NN_SOURCES CONFIGURE_DEPENDS "${CMAKE_CURRENT_SOURCE_DIR}/*.cpp")

if(NN_SOURCES)
    # Собираем реальные единицы трансляции в отдельную библиотеку.
    add_library(pgr_nn STATIC ${NN_SOURCES})
    target_include_directories(pgr_nn PUBLIC "${CMAKE_CURRENT_SOURCE_DIR}")
else()
    # INTERFACE не создаёт бинарного файла, но хранит include-пути.
    add_library(pgr_nn INTERFACE)
    target_include_directories(pgr_nn INTERFACE "${CMAKE_CURRENT_SOURCE_DIR}")
endif()

# Здесь допускаются ВНЕШНИЕ зависимости nn, но не pgr_core и не pgr_gui.
# Например, при появлении сторонней матричной библиотеки её следует
# подключать к pgr_nn отдельной командой после find_package().
