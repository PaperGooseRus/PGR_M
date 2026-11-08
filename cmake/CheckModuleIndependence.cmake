# =============================================================================
# Контроль независимости собственных модулей PGR_M.
#
# Проверка обнаруживает ПРЯМЫЕ связи pgr_core <-> pgr_gui <-> pgr_nn,
# объявленные через target_link_libraries() (включая INTERFACE).
# Внешние библиотеки и связь app -> pgr_* разрешены.
# Это защитная проверка конфигурации, а не полноценный анализ #include в C++.
# =============================================================================

function(pgr_check_module_independence)
    # Перечень независимых целей проекта. Если цель выключена опцией,
    # она не проверяется и не требуется другим модулям.
    set(_pgr_modules pgr_core pgr_gui pgr_nn)

    foreach(_module IN LISTS _pgr_modules)
        if(NOT TARGET "${_module}")
            continue()
        endif()

        # LINK_LIBRARIES содержит зависимости при сборке конкретной цели,
        # INTERFACE_LINK_LIBRARIES — зависимости, передаваемые потребителям.
        # Проверяем обе области, чтобы не пропустить PRIVATE/PUBLIC/INTERFACE.
        foreach(_property IN ITEMS LINK_LIBRARIES INTERFACE_LINK_LIBRARIES)
            get_target_property(_links "${_module}" "${_property}")
            if(NOT _links)
                continue()
            endif()

            foreach(_other IN LISTS _pgr_modules)
                if(_other STREQUAL _module)
                    continue()
                endif()

                # Ищем имя цели с границами идентификатора, а не подстроку.
                # Это захватывает типичные записи (включая простые $<...>),
                # но не претендует на разбор произвольных генераторных выражений.
                if("${_links}" MATCHES "(^|[^A-Za-z0-9_])${_other}([^A-Za-z0-9_]|$)")
                    message(FATAL_ERROR
                        "Нарушена независимость модулей: ${_module} -> ${_other} "
                        "(свойство ${_property}). "
                        "Уберите межмодульную связь и перенесите интеграцию в app.")
                endif()
            endforeach()
        endforeach()
    endforeach()
endfunction()
