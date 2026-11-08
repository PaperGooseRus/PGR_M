# Модуль gui полностью автономен: не подключает ни core, ни nn.
# Если для интерфейса понадобится общее поведение, интегрируйте его через app,
# передаваемые данные или заранее определённые независимые интерфейсы.
file(GLOB GUI_SOURCES CONFIGURE_DEPENDS "${CMAKE_CURRENT_SOURCE_DIR}/*.cpp")

if(GUI_SOURCES)
    # При наличии .cpp компилируем отдельную статическую библиотеку.
    add_library(pgr_gui STATIC ${GUI_SOURCES})
    # PUBLIC сообщает клиентам, где искать публичные заголовки gui.
    target_include_directories(pgr_gui PUBLIC "${CMAKE_CURRENT_SOURCE_DIR}")
else()
    # Заголовочный/пустой модуль: достаточно интерфейсной библиотеки.
    add_library(pgr_gui INTERFACE)
    target_include_directories(pgr_gui INTERFACE "${CMAKE_CURRENT_SOURCE_DIR}")
endif()

# Межмодульные target_link_libraries() запрещены. Только app объединяет модули.
