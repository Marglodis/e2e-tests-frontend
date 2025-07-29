@products @query @punto1
Feature: Consulta de Productos por Usuario Registrado
  Como usuario registrado del sistema
  Quiero poder acceder al sistema y realizar consultas de productos
  Para visualizar y buscar productos en el catálogo

  Background:
    Given que soy un usuario registrado en el sistema
    And que he iniciado sesión correctamente
    And que navego a la página de productos

  @positive @smoke @crud-read
  Scenario: Consultar lista completa de productos
    When consulto la lista de productos disponibles
    Then debería ver la página de productos cargada correctamente
    And debería visualizar la tabla de productos

  @positive @search
  Scenario: Buscar producto específico existente
    Given que existen productos en el sistema
    When busco un producto específico por su nombre
    Then debería ver los detalles del producto en los resultados


  @negative @search
  Scenario: Buscar producto inexistente
    When busco un producto que no existe en el sistema
    Then debería ver un mensaje indicando que no se encontraron resultados
    And la tabla debería mostrar que no hay productos que coincidan
