# Модуль core полностью автономен от gui и nn.
# Пока в модуле нет .cpp, он существует как INTERFACE-библиотека:
# её можно подключать к app ради заголовков без создания пустого архива.
# CONFIGURE_DEPENDS просит CMake пересканировать список .cpp при сборке.
file(GLOB CORE_SOURCES CONFIGURE_DEPENDS "${CMAKE_CURRENT_SOURCE_DIR}/*.cpp")

if(CORE_SOURCES)
    # Настоящая статическая библиотека, когда появились единицы трансляции.
    add_library(pgr_core STATIC ${CORE_SOURCES})
    # PUBLIC: путь нужен как самому core, так и потребителю библиотеки.
    target_include_directories(pgr_core PUBLIC "${CMAKE_CURRENT_SOURCE_DIR}")
else()
    # Интерфейсная цель не компилирует исходники, а передаёт свойства клиенту.
    add_library(pgr_core INTERFACE)
    # У INTERFACE-цели нельзя использовать PUBLIC/PRIVATE.
    target_include_directories(pgr_core INTERFACE "${CMAKE_CURRENT_SOURCE_DIR}")
endif()

# НЕ добавлять target_link_libraries(pgr_core ... pgr_gui/pgr_nn):
# независимость модулей является архитектурным требованием.
