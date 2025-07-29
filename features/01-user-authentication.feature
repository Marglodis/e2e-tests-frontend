@authentication @punto5
Feature: Autenticación de Usuario No Registrado
  Como usuario no registrado del sistema
  Quiero validar que no puedo acceder al sistema
  Para garantizar la seguridad y control de acceso

  Background:
    Given que navego a la página de login del sistema

  @negative @security @smoke
  Scenario: Usuario no registrado no puede acceder con credenciales incorrectas
    When intento iniciar sesión con credenciales incorrectas
    Then debería ver un mensaje de error de credenciales inválidas
    And no debería poder acceder al sistema
    And debería permanecer en la página de login

  @negative @validation
  Scenario: Validación de campos obligatorios vacíos
    When intento iniciar sesión sin proporcionar email
    Then no debería poder acceder al sistema
    And debería permanecer en la página de login

  @negative @validation  
  Scenario: Validación de contraseña obligatoria
    When intento iniciar sesión sin proporcionar contraseña
    Then no debería poder acceder al sistema
    And debería permanecer en la página de login

  @negative @security
  Scenario: Acceso directo a página protegida sin autenticación
    When intento acceder directamente a la página de productos sin estar autenticado
    Then debería ser redirigido a la página de login
    And debería ver un mensaje indicando que se requiere autenticación
