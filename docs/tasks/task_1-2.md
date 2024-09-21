# Архитектура микросервисов

## Разделение на микросервисы

-   **Микросервис управления отоплением (Heating Service)**

    -   Управление устройствами отопления
    -   Включение/выключение отопления
    -   Установка и поддержание целевой температуры

-   **Микросервис Телеметрии**

    -   Мониторинг текущей температуры

-   **Микросервис пользователей (User Service)**

    -   Аутентификация и авторизация пользователей
    -   Управление данными пользователей

-   **Микросервис управления устройствами (Device Service)**

    -   Регистрация новых устройств
    -   Архивация неактивный устройств
    -   Отправление команд на обновление настроек устройств

-   **Микросервис уведомлений (Notification Service)**

    -   Отправка уведомлений пользователям

-   **API Gateway**

    -   Точка входа для клиентских приложений
    -   Маршрутизация запросов к микросервисам
    -   Мониторинг

-   **Kafka**

    -   Асинхронное взаимодействие между микросервисами
    -   Обработка событий в реальном времени

-   **Базы данных**

    Каждый микросервис владеет собственной базой данных, обеспечивая изоляцию данных и независимость сервисов

## Диаграммы

Мной были составлены диаграммы для наглядной визуализации архитектуры

### Уровень контейнеров

![containers](../diagrams/out/task_2/smart_home_container.png)

### Уровень сервисов

#### User Service

![User Service](../diagrams/out/task_2/user_service_component.png)

#### Notification Service

![Notification Service](../diagrams/out/task_2/notification_service_component.png)

#### House Service

![House Service](../diagrams/out/task_2/house_service_component.png)

#### Telemetry Service

![Telemetry Service](../diagrams/out/task_2/telemetry_service_component.png)

#### Heating Service

![Heating Service](../diagrams/out/task_2/heating_service_component.png)

#### Device Service

![Device Service](../diagrams/out/task_2/device_service_component.png)

##### Взаимодействие Device Service и Heating Service

Здесь наглядно видно, как будут обновляться данные на устройствах

![HeatingUpdate](../diagrams/out/task_2/device_update_distributed_tracing.png)

### Уровень кода

#### Heating Service Code

![Heating Service Code](../diagrams/out/task_2/heating_service_code.png)
