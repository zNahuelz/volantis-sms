import dayjs from 'dayjs';
import type { CartItem } from '~/features/sales/views/SaleCreateView';
import type { BuyOrder } from '~/types/buyOrder';
import type { Customer } from '~/types/customer';
import type { PaymentType } from '~/types/paymentType';
import type { Presentation } from '~/types/presentation';
import type { Product } from '~/types/product';
import type { Role } from '~/types/role';
import type { Sale } from '~/types/sale';
import type { Setting } from '~/types/setting';
import type { Store } from '~/types/store';
import type { StoreProduct } from '~/types/storeProduct';
import type { Supplier } from '~/types/supplier';
import type { User } from '~/types/user';
import type { VoucherSerie } from '~/types/voucherSerie';

// --- 1. APP IDENTITY & AREA TEXTS ---
export const AppName = 'Volantis';
export const AppDescription = 'Sis. Gestión de Ventas';
export const AppVersion = 'Dev. Env.';

export const WelcomeAreaText = `Dashboard - ${AppName}`;
export const LoginAreaText = `Inicio de Sesión - ${AppName}`;
export const ProfileAreaText = `Mi Perfil - ${AppName}`;
export const _404AreaText = `Módulo no encontrado - ${AppName}`;
export const RecoverAccountAreaText = `Recuperación de Cuenta - ${AppName}`;

// --- 2. UI LABELS & NAVIGATION ---
export const HomeText = 'Inicio';
export const NewText = 'Nuevo';
export const ListText = 'Listado';
export const ActionsText = 'Acciones';
export const SearchText = 'Buscar';
export const ReloadText = 'Recargar';
export const ClearText = 'Limpiar';
export const CancelText = 'Cancelar';
export const SaveText = 'Guardar';
export const UpdateText = 'Actualizar';
export const DeleteText = 'Eliminar';
export const DisableText = 'Deshabilitar';
export const RestoreText = 'Restaurar';
export const EditText = 'Modificar';
export const DetailsText = 'Detalles';
export const ConfirmText = 'Confirmar';
export const ContinueText = 'Continuar';
export const BackText = 'Volver';
export const GoBackText = 'Átras';
export const SelectText = 'Seleccionar';
export const AssignText = 'Asignar';
export const RemoveText = 'Quitar';
export const HereText = 'aquí';
export const ClickHereText = 'Click aquí';
export const PreviewText = 'Vista previa';
export const RegisterText = 'Registrar';
export const NextText = 'Siguiente';
export const HelpText = 'Ayuda';

// --- 3. COMMON TABLE/FORM FIELDS ---
export const IdText = '#';
export const IdTextAlt = 'ID';
export const IdTextLong = 'Identificador';
export const NameText = 'Nombre';
export const NamesText = 'Nombres';
export const SurnameText = 'Apellido';
export const SurnamesText = 'Apellidos';
export const DescriptionText = 'Descripción';
export const CreatedAtText = 'Fecha de Creación';
export const UpdatedAtText = 'Ult. Mod.';
export const DeletedAtText = 'Fecha de Eliminación';
export const RegisterDateText = 'Fecha de Registro';
export const StateText = 'Estado';
export const IsActiveText = 'Habilitado';
export const IsDeletedText = 'Deshabilitado';
export const KeyText = 'Clave';
export const ValueText = 'Valor';
export const PhoneText = 'Teléfono';
export const AddressText = 'Dirección';
export const RucText = 'Ruc';
export const DniText = 'Dni';
export const BehaviourText = 'Comportamiento';
export const ResetText = 'Restablecer';

// --- 4. AUTH & LOGIN ---
export const LoginText = 'Inicio de Sesión';
export const LoginButtonText = 'Iniciar Sesión';
export const EmailText = 'Correo Electrónico';
export const UsernameText = 'Nombre de Usuario';
export const PasswordText = 'Contraseña';
export const CurrentPasswordText = 'Contraseña actual';
export const NewPasswordText = 'Nueva contraseña';
export const RepeatPasswordText = 'Repetir contraseña';
export const ForgotPasswordText = '¿Olvidaste tu contraseña? ';
export const RememberMeText = 'Recuérdame';
export const CurrentEmailText = 'Correo electrónico actual';
export const NewEmailText = 'Nuevo correo electrónico';
export const ConfirmEmailText = 'Repetir correo electrónico';
export const LoggingInText = 'Ingresando...';
export const ClosingSessionText = 'Cerrando sesión...';
export const RecoverAccountText = 'Recuperación de Cuenta';
export const LoadingAccountRecoveryText = 'Cargando recuperación de cuenta...';
export const PasswordRecoveryMessage =
  "<p class='text-center font-light text-[14px]'>El siguiente formulario le permite recuperar el acceso a su cuenta en caso de haber olvidado su contraseña. <br>Debe llenar el formulario con un correo electrónico válido; posteriormente debe esperar un correo con instrucciones para recuperar el acceso a su cuenta.</p>";
export const ChangePasswordWithTokenMessage =
  "<p class='text-center font-light text-[14px]'>El siguiente formulario le permite recuperar el acceso a su cuenta en caso de haber olvidado su contraseña. <br>Debe llenar los campos con su nueva contraseña, posteriormente podrá iniciar sesión normalmente con sus nuevas credenciales. <br><span class='font-bold text-red-500'>Si no solicito la recuperación de su cuenta, puede salir de esta página.</span>";
export const RecoveryMailSentText =
  'Operación completada correctamente. Si el e-mail ingresado pertenece a un usuario las instrucciones para recuperar su cuenta seran enviadas.';
export const InvalidOrExpiredTokenText =
  'El token de recuperación es inválido o ha expirado, vuelva a intentarlo. Si el problema persiste comuniquese con administración.';

// --- 5. USER & PROFILE ---
export const ProfileText = 'Perfil';
export const UserText = 'Usuario';
export const UsersText = 'Usuarios';
export const SystemUsersText = 'Gest. Usuarios';
export const UsersListAreaText = `Listado de Usuarios - ${AppName}`;
export const UserRegisterText = 'Registro de Usuario';
export const UserEditText = 'Modificar Usuario';
export const UserDetailText = 'Detalle de Usuario';
export const UserDetailAreaText = `Detalle de Usuario -  ${AppName}`;
export const CurrentAvatarText = 'Foto de perfil actual';
export const RemoveProfilePictureText = 'Restablecer foto de perfil';
export const ResetPasswordText = 'Reiniciar contraseña';
export const SendPasswordRecoveryText = 'Enviar e-mail de recuperación';
export const UserUpdatedAtText = 'Ult. Mod. al Usuario';

// --- 6. SUPPLIER ---
export const SupplierText = 'Proveedor';
export const SuppliersText = 'Proveedores';
export const SupplierListText = 'Listado de Proveedores';
export const SuppliersListAreaText = `Listado de Proveedores - ${AppName}`;
export const CreateSupplierText = 'Registro de Proveedor';
export const CreateSupplierAreaText = `Registro de Proveedor - ${AppName}`;
export const EditSupplierText = 'Modificando Proveedor';
export const EditSupplierAreaText = `Editar Proveedor - ${AppName}`;
export const SupplierDetailText = 'Detalle de Proveedor';
export const SupplierDetailAreaText = `Detalle de Proveedor - ${AppName}`;

// --- 7. CUSTOMER ---
export const CustomerText = 'Cliente';
export const CustomersText = 'Clientes';
export const CreateCustomerText = 'Registro de Cliente';
export const CreateCustomerAreaText = `Registro de Cliente - ${AppName}`;
export const EditCustomerText = 'Modificando Cliente';
export const EditCustomerAreaText = `Editar Cliente - ${AppName}`;
export const CustomerDetailText = 'Detalle de Cliente';
export const CustomerDetailAreaText = `Detalle de Cliente - ${AppName}`;
export const CustomersListAreaText = `Listado de Clientes - ${AppName}`;

// --- 8. PRODUCT & PRESENTATION ---
export const ProductText = 'Producto';
export const ProductsText = 'Productos';
export const ProductsListAreaText = `Listado de Productos - ${AppName}`;
export const CreateProductText = 'Registro de Producto';
export const CreateProductAreaText = `Registro de Producto - ${AppName}`;
export const EditProductText = 'Modificar Producto';
export const EditProductAreaText = `Editar Producto - ${AppName}`;
export const ProductDetailText = `Detalle de Producto`;
export const ProductDetailAreaText = `Detalle de Producto - ${AppName}`;
export const ProductSearchText = 'Búsqueda de Producto';
export const SelectProductText = 'Seleccione un producto';
export const BarcodeText = 'Código de Barras';
export const ShortBarcodeText = 'Cód. Barras';
export const RandomizeBarcodeText = 'Aleatorizar código de barras';
export const BuyPriceText = 'Precio de Compra';
export const SellPriceText = 'Precio de Venta';
export const ProfitText = 'Ganancia';
export const StockText = 'Stock';
export const SalableText = 'Vendible';

export const PresentationText = 'Presentación';
export const PresentationsText = 'Presentaciones';
export const PresentationManagementText = 'Gest. Presentaciones';
export const PresentationsListAreaText = `Listado de Presentaciones de Productos - ${AppName}`;
export const NewPresentationText = 'Registro de Presentation de Producto';
export const EditPresentationText = 'Modificar Presentación de Producto';

// --- 9. ROLES & ABILITIES ---
export const RoleText = 'Rol';
export const SystemRolesText = 'Gest. Roles';
export const RolesListAreaText = `Listado de Roles - ${AppName}`;
export const CreateRoleText = 'Registro de Rol';
export const CreateRoleAreaText = `Registro de Rol - ${AppName}`;
export const EditRoleText = 'Editar rol';
export const EditRoleAreaText = `Editar Rol - ${AppName}`;
export const RoleDetailText = 'Detalle de Rol';
export const RoleDetailAreaText = `Detalle de Rol - ${AppName}`;

export const AbilityText = 'Permiso';
export const AbilitiesText = 'Permisos';
export const SystemAbilitiesText = 'Gest. Permisos';
export const AbilitiesListAreaText = `Listado de Permisos - ${AppName}`;
export const NewAbilityText = 'Registro de Permiso';
export const AbilityEditText = 'Modificar Permiso';
export const LinkedAbilitiesText = 'Permisos Asociados';

// --- 10. STORE & ASSIGNMENTS ---
export const StoresListAreaText = `Listado de Tiendas - ${AppName}`;
export const StoreText = 'Tienda';
export const StoresText = 'Tiendas';
export const StoreAddressText = 'Dirección de la Tienda';
export const AssignedStoreText = 'Tienda Asignada';
export const StoreIdText = '# Tienda';
export const StoreProductText = 'Asignación de producto';
export const StoreProductsText = 'Asignaciones de productos';
export const AssignmentsText = 'Asignaciones';
export const StoreProductDetailText = 'Detalle de asignación de producto';
export const StoreProductsListAreaText = `Listado de Productos Asignados - ${AppName}`;
export const StoreProductCreateAreaText = `Asignación de Productos - ${AppName}`;
export const StoreProductEditAreaText = `Gestionar Asignación de Productos - ${AppName}`;
export const StoreProductDetailAreaText = `Detalle de Asignación de Producto - ${AppName}`;
export const CreateStoreProductText = 'Asignación de Producto';
export const EditStoreProductText = 'Modificar asignación de producto';
export const AffectedByIGVText = 'Afecto al IGV';
export const CreateStoreAreaText = `Registro de Tienda - ${AppName}`;
export const StoreDetailAreaText = `Detalle de Tienda - ${AppName}`;
export const EditStoreAreaText = `Editar Tienda - ${AppName}`;
export const CreateStoreText = 'Registro de Tienda';
export const EditStoreText = 'Modificar Tienda';
export const StoreDetailText = 'Detalle de Tienda';

// --- 11. BUY ORDERS ---
export const BuyOrderText = 'Ordene de Compra';
export const BuyOrdersText = 'Ordenes de Compra';
export const NewSaleText = 'Nueva venta';
export const BuyOrdersListAreaText = `Listado de Ordenes de Compra - ${AppName}`;
export const CreateBuyOrderText = 'Registro de Orden de Compra';
export const CreateBuyOrderAreaText = `Registro de Orden de Compra - ${AppName}`;
export const EditBuyOrderText = 'Modificar Orden de Compra';
export const EditBuyOrderAreaText = `Editar Orden de Compra - ${AppName}`;
export const BuyOrderDetailText = 'Detalle de Orden de Compra';
export const BuyOrderDetailAreaText = `Detalle de Orden de Compra - ${AppName}`;
export const OrderStatusText = 'Estado de Orden';
export const StatusText = 'Estado';
export const QuantityText = 'Cantidad';
export const UnitPriceText = 'Precio Unitario';
export const SubtotalText = 'Subtotal';
export const TotalText = 'Total';
export const TaxNameText = 'Igv';
export const AddProductText = 'Añadir producto';

// --- 12. SETTINGS & SYSTEM ---
export const SettingText = 'Configuración';
export const SystemText = 'Sistema';
export const SysSettingText = 'Variable';
export const SysSettingsText = 'Variables';
export const SettingsListAreaText = `Configuración del Sistema - ${AppName}`;
export const NewSettingText = 'Registro de variable del sistema';
export const EditSettingText = 'Modificar variable del sistema';
export const SettingDetailText = 'Detalle de Variable del Sistema';
export const NumericValueText = 'Valor Numérico';
export const ValueType = 'Tipo de Var.';

// --- 13. LOADING & SYSTEM STATUS ---
export const LoadingText = 'Cargando...';
export const LoadingForm = 'Cargando formulario...';
export const SavingText = 'Guardando...';
export const UpdatingText = 'Actualizando...';
export const PleaseWaitText = 'Por favor espere';
export const OkTagText = 'Operación completada';
export const ErrorTagText = 'Ha ocurrido un error';
export const InfoTag = 'Información';
export const WarningText = 'Advertencia';
export const QuestionText = 'Consulta';
export const LoadingSuppliersText = 'Cargando proveedores...';
export const LoadingCustomersText = 'Cargando clientes...';
export const LoadingUsersText = 'Cargando usuarios...';
export const LoadingSupplierText = 'Cargando información de proveedor...';
export const LoadingSettingsText = 'Cargando configuración del sistema...';
export const LoadingUserText = 'Cargando usuario...';
export const LoadingCustomerText = 'Cargando información de cliente...';
export const LoadingRolesText = 'Cargando roles...';
export const LoadingRoleText = 'Cargando información de rol';
export const LoadingAbilitiesText = 'Cargando permisos...';
export const LoadingPresentationsText = 'Cargando presentaciones de productos...';
export const LoadingProductText = 'Cargando información de producto...';
export const LoadingProductsText = 'Cargando productos...';
export const LoadingBuyOrderText = 'Cargando orden de compra...';
export const LoadingBuyOrdersText = 'Cargando ordenes de compra...';
export const LoadingStoreProductText = 'Cargando detalle de asignación de producto...';
export const LoadingStoreProductsText = 'Cargando asignaciones de productos...';
export const LoadingStoresText = 'Cargando tiendas...';
export const LoadingStoreText = 'Cargando tienda...';
export const SearchingProductText = 'Buscando producto...';
export const LoadingPaymentTypesText = 'Cargando tipos de pago...';
export const LoadingPaymentTypeText = 'Cargando tipo de pago...';

// --- 14. ERRORS & EMPTY STATES ---
export const EmptyListText = 'No se encontraron elementos.';
export const SuppliersNotLoaded = 'No se encontraron proveedores con el criterío ingresado.';
export const CustomersNotLoaded = 'No se encontraron clientes con el criterío ingresado.';
export const UsersNotLoaded = 'No se encontraron usuarios con el criterío ingresado.';
export const SettingsNotLoaded =
  'No se encontraron variables del sistema con el criterío ingresado.';
export const PresentationsNotLoadedText =
  'No se encontraron presentaciones de productos con el criterío ingresado.';
export const RolesNotLoadedText = 'No se encontraron roles con el criterío ingresado.';
export const AbilitiesNotLoadedText = 'No se encontraron permisos con el criterío ingresado.';
export const ProductsNotLoaded = 'No se encontraron productos con el criterío ingresado.';
export const BuyOrdersNotLoaded = 'No se encontraron ordenes de compra con el criterío ingresado.';
export const StoreProductsNotLoaded =
  'No se encontraron asignaciones de productos con el criterío ingresado.';
export const EmptyStoreProductsListText = 'El producto no se encuentra asignado a ninguna tienda.';
export const EmptyAbilityListText =
  'El rol del usuario no cuenta con permisos asignados. Comuniquese con administración.';
export const NoFileSelected = 'Sin archivo seleccionado';

export const SupplierNotFound = 'Proveedor no encontrado.';
export const UserNotFoundText = 'Usuario no encontrado.';
export const CustomerNotFoundText = 'Cliente no encontrado';
export const RoleNotFound = 'Rol no encontrado.';
export const ProductNotFound = 'Producto no encontrado.';
export const BuyOrderNotFound = 'Orden de compra no encontrada.';
export const StoreProductNotFoundText = 'Asignación de producto no encontrada';
export const _404Text =
  'Oops! El módulo no existe o no está disponible. Comuniquese con administración o verifique la URL.';

export const FormLoadFailed =
  'Error durante la carga del formulario, intente nuevamente o comuniquese con administración';
export const InvalidCredentialsText =
  'Inicio de sesión fallido, verifique sus credenciales e intente nuevamente.';
export const LoginErrorText =
  'Error durante el inicio de sesión, intente nuevamente. Si el problema persiste comuniquese con administración';
export const AccountDisabledText =
  'Error durante el inicio de sesión, su cuenta de usuario se encuentra deshabilitada. Comuniquese con administración.';
export const ServerErrorText =
  'Error interno del servidor, operación cancelada. Vuelva a intentarlo o comuniquese con administración';
export const FetchFailedText =
  'Conexión con el servidor fallida; intente nuevamente o comuníquese con administración.';
export const ExpiredSessionText =
  'Sesión expirada o finalizada remotamente por una cuenta de administrador. Inicie sesión nuevamente.';
export const OpRollbackText = 'Operación cancelada';
export const StoresNotLoadedText = 'No se encontraron tiendas con el criterío ingresado.';
export const StoreNotFoundText = 'Tienda no encontrada.';
export const ServerConnErrorText =
  'Conexión con el servidor fallida, vuelva a intentarlo o comuniquese con administración.';
export const NoStoresAvailableText =
  'Error, no se encontraron tiendas disponibles. Comuniquese con administración.';
export const SalesModuleLockedNoStores =
  'No se encontraron tiendas disponibles para realizar la operación de ventas. El módulo se encuentra bloqueado, intente nuevamente o comuniquese con administración.';
export const PaymentTypeNotFound = 'Tipo de pago no encontrado.';

// --- 15. VALIDATION & WARNING ADVICE ---
export const SupplierRucTakenText = 'El RUC ingresado ya se encuentra asignado a otro proveedor.';
export const UserDniTakenText =
  'El DNI ingresado ya se encuentra asignado a otro usuario, comuniquese con administración.';
export const UserEmailTaken =
  'El correo electrónico ingresado ya se encuentra asignado a otro usuario, comuniquese con administración';
export const CustomerDniTakenText = 'El DNI ingresado ya se encuentra asignado a otro cliente.';
export const RoleNameTaken = 'El nombre ingresado ya pertenece a un rol registrado.';
export const AbilityKeyTakenText = 'La CLAVE ingresada ya se encuentra asignada a otro permiso.';
export const SysSettingKeyTakenText =
  'La clave ingresada ya se encuentra asignado a otra variable del sistema.';
export const DuplicatedPresentationText =
  'El nombre y valor numérico ingresados ya pertenecen a otra presentación de producto, puede variar el valor numérico para proceder con el registro.';
export const ProductBarcodeTaken =
  'El código de barras ingresado ya se encuentra asignado a otro producto.';
export const BarcodeGenerationFailed =
  'Error interno del servidor, generación de código de barras aleatorio fallida. Vuelva a intentarlo o comuniquese con administración';
export const InvalidSettingValueTypeText =
  'El tipo de variable solo puede ser uno de los siguientes: ENTERO, ENTERO LARGO, DECIMAL, TEXTO, LISTA, BOOLEANO u OTRO.';
export const InvalidStoreIdText =
  'La tienda seleccionada no se encuentra disponible o es inválida, intente nuevamente o comuniquese con administración';
export const InvalidSupplierIdText =
  'El proveedor seleccionado no se encuentra disponible o es inválido, intente nuevamente o comuniquese con administración';
export const InvalidRoleIdText =
  'El rol seleccionado no se encuentra disponible o es inválida, intente nuevamente o comuniquese con administración';
export const InvalidBuyOrderDetailsPayload =
  'Los productos seleccionados no se encuentran disponibles, intente nuevamente o comuniquese con administración.';

export const AdminAssignedStoreText =
  'Los usuarios con el rol de administrador pueden realizar operaciones en todas las tiendas a pesar de estar asignados a la sucursal principal.';
export const UsernameChangeDisabledOnEditText =
  'Modificar el DNI del empleado no actualizará su nombre de usuario, tal cambio puede realizarse de forma personal desde el apartado "Mi Perfil".';
export const LockStoreOnBuyOrderMgmtText =
  'INFORMACIÓN: Los usuarios sin permisos administrativos solo pueden registrar o modificar ordenes de compra de su tienda asignada.';
export const UpdatePasswordAlertText =
  'Actualizar su contraseña requerira que vuelva a iniciar sesión posteriormente. Además, se cerraran todas las sesiones existentes de su cuenta.';
export const NewAbilityAdvice =
  'Recuerde que la creación de nuevos permisos debe estar acompañada de una actualización del sistema la cual incluya las acciones correspondientes al permiso.';
export const EditAbilityAdvice =
  'IMPORTANTE: Modificar la CLAVE de un permiso puede alterar el funcionamiento del sistema, solo realice esta acción bajo supervisión del área de TI.';
export const NewSysVarAdvice =
  'Recuerde que la creación de nuevas variables del sistema deben estar acompañadas de una actualización del sistema la cual incluya las características correspondientes a la variable.';
export const EditSysVarAdvice =
  'IMPORTANTE: Modificar el valor de una variable del sistema alterara el comportamiento del mismo, solo realice esta acción bajo supervisión del área de TI.';
export const ModifySettingsWarning =
  'Estás accediendo a la configuración del sistema. Modificaciones incorrectas pueden afectar su funcionamiento. <br> <strong>Procede con precaución.</strong>';
export const NewPresentationAdviceText =
  'El campo Valor numérico acepta únicamente números enteros expresados en la unidad base del sistema (gramos o mililitros). No se admiten valores decimales ni conversiones automáticas. Ejemplo: 500 (equivale a 500 g o ml)';
export const CreateProductWarning =
  'INFORMACIÓN: Al registrar un producto, este pasará a estar disponible en todas las tiendas existentes, las cuales podrán crear órdenes de compra con los productos registrados, para posteriormente modificar sus propiedades individuales (precio, stock, realizar ventas) por cada tienda.';
export const UpdateProductWarning =
  'INFORMACIÓN: Modificar el producto actualizará sus propiedades básicas (nombre, descripción, presentación) en todas las tiendas. Para crear y modificar propiedades avanzadas/órdenes de compra, debe realizar la operación en una tienda específica.';
export const UsingDefaultTaxMessage =
  'No se pudo recuperar el valor del IGV desde la configuración. Se utilizará el valor predeterminado de 18%. Intente nuevamente, si el problema persiste comuniquese con administración.';
export const StoreRucTakenText = 'El RUC ingresado ya se encuentra asignado a otra tienda.';
export const PaymentTypeNameTakenText =
  'El nombre ingresado ya se encuentra asignado a otro tipo de pago.';

// --- 16. SUCCESS MESSAGES ---
export const SupplierCreatedText = 'Proveedor registrado correctamente.';
export const SupplierUpdatedText = 'Proveedor actualizado correctamente.';
export const SupplierStatusUpdatedText = 'Visibilidad de proveedor actualizada correctamente.';
export const CustomerCreatedText = 'Cliente registrado correctamente.';
export const CustomerUpdatedText = 'Cliente actualizado correctamente.';
export const CustomerStatusUpdatedText = 'Visibilidad de cliente actualizada correctamente';
export const UserCreatedText =
  'Usuario registrado correctamente. Se ha enviado un correo electrónico con la información del usuario. Recuerde que la contraseña por defecto es el DNI del empleado.';
export const UserUpdatedText = 'Usuario actualizado correctamente.';
export const UserStatusUpdatedText = 'Estado de cuenta de usuario actualizada correctamente.';
export const UserProfilePictureRemovedText =
  'Foto de perfil del usuario restablecida correctamente.';
export const UserPasswordResetSuccesfullyText =
  'Contraseña del usuario restablecida correctamente, sus sesiones han sido cerradas automáticamente.';
export const UserPasswordUpdatedText =
  'Contraseña actualizada correctamente, debe volver a iniciar sesión con sus nuevas credenciales. Todas las sesiones abiertas con su cuenta de usuario han sido cerradas automáticamente.';
export const UserAvatarUpdatedText =
  'Foto de perfil actualizada correctamente, podría tardar unos minutos en visualizarse correctamente.';
export const RoleCreatedText = 'Rol registrado correctamente.';
export const RoleUpdatedText = 'Rol actualizado correctamente.';
export const RoleStatusUpdatedText = 'Visibilidad de rol actualizada correctamente.';
export const AbilityCreatedText = 'Permiso registrado correctamente.';
export const AbilityUpdatedText = 'Permiso actualizado correctamente.';
export const PresentationCreatedText = 'Presentación registrada correctamente.';
export const PresentationUpdatedText = 'Presentación actualizada correctamente.';
export const PresentationStatusUpdatedText =
  'Estado de presentación de producto actualizada correctamente.';
export const SettingCreatedText = 'Variable del sistema registrada correctamente.';
export const SettingUpdatedText = 'Variable del sistema actualizada correctamente.';
export const SettingDeletedText = 'Variable del sistema eliminada correctamente.';
export const ProductCreatedText = 'Producto registrado correctamente.';
export const ProductUpdatedText = 'Producto actualizado correctamente.';
export const ProductStatusUpdatedText = 'Visibilidad de producto actualizada correctamente.';
export const BuyOrderCreatedText = 'Orden de compra registrada correctamente.';
export const BuyOrderUpdatedText = 'Orden de compra actualizada correctamente.';
export const BuyOrderStatusUpdatedText =
  'Visibilidad de orden de compra actualizada correctamente.';
export const StoreProductCreatedText = 'Asignación de producto a tienda completada correctamente.';
export const StoreProductUpdatedText =
  'Actualización de asignación de producto a tienda completada correctamente.';
export const StoreProductStatusUpdatedText =
  'Visibilidad de asignación de producto actualizada correctamente.';
export const StoreUpdatedText = 'Tienda actualizada correctamente.';
export const StoreCreatedText = 'Tienda registrada correctamente.';
export const StoreStatusUpdatedText = 'Visibilidad de tienda actualizada correctamente.';
export const PaymentTypeStatusUpdatedText =
  'Visibilidad de tipo de pago actualizada correctamente.';

// --- 17. FAILURE MESSAGES ---
export const SupplierStatusUpdateFailedText =
  'Fallo la actualización de visibilidad del proveedor. Intente nuevamente o comuniquese con administración.';
export const CustomerStatusUpdateFailedText =
  'Fallo la actualización de visibilidad del cliente. Intente nuevamente o comuniquese con administración.';
export const UserStatusUpdateFailedText =
  'Fallo la actualización de estado de cuenta de usuario. Intente nuevamente o comuniquese con administración.';
export const RoleStatusUpdateFailedText =
  'Fallo la actualización de visibilidad del rol. Intente nuevamente o comuniquese con administración.';
export const SettingDeletionFailedText =
  'Fallo la eliminación de la variable del sistema. Intente nuevamente o comuniquese con administración.';
export const BuyOrderStatusUpdateFailedText =
  'Fallo la actualización de visibilidad de la orden de compra. Intente nuevamente o comuniquese con administración.';
export const StoreProductStatusUpdateFailedText =
  'Fallo la actualización de visibilidad de la asignación de producto. Intente nuevamente o comuniquese con administración.';
export const StoreStatusUpdateFailedText =
  'Fallo la actualización de visibilidad de la tienda. Intente nuevamente o comuniquese con administración.';
export const ProductSearchByBarcodeFailedText =
  'El producto no se encuentra asignado a la tienda o no existe, verifique los datos ingresados y vuelva a intentarlo. Si el problema persiste comuniquese con administración.';
export const CustomerNotFoundByDniText =
  'El DNI ingresado no se encuentra asignado a ningún cliente del sistema o el mismo se encuentra deshabilitado. <br> <strong>Recuerde que puede realizar ventas ingresando el DNI 0.</strong><br> ¿Desea proceder con el registro del cliente?';
export const PaymentTypeStatusUpdateFailedText =
  'Fallo la actualización de visibilidad del tipo de pago. Intente nuevamente o comuniquese con administración.';

// --- 18. DYNAMIC MESSAGES & ACTIONS ---
export const LogoutText = 'Cerrar Sesión';
export const ConfirmActionText = 'Confirmar Operación';
export const ProductIdText = '# Prod.';

export const TableElementsMessage = (
  singularName: string,
  pluralName: string,
  total: number,
  elements: number
) => {
  return `Mostrando ${elements} ${elements > 1 ? pluralName : singularName} de un total de ${total}.`;
};

export const UserEmailUpdatedText = (email: string) => {
  return `Correo electrónico actualizado correctamente. <br> <strong>NUEVO CORREO ELECTRÓNICO: </strong>${email}`;
};

export const TotalSystemRolesText = (amount: number) => {
  return `El sistema cuenta con ${amount} roles registrados.`;
};

export const CurrentTaxValueText = (tax: number, isDefault: boolean) => {
  return `Valor actual del IGV: ${tax * 100}% ${isDefault ? 'Usando el valor por defecto del sistema, vuelva a abrir el formulario o comuniquese con administración' : ''}`;
};

export const SalesModuleModeText = (mode: string) => {
  return `${mode.toLowerCase() === 'free' ? 'Modo Libre' : mode.toLowerCase() === 'strict' ? 'Modo Estricto' : 'Modo Libre'}`;
};

export const ProductFoundByBarcodeMessage = (product: Product) => {
  return `El código de barras ingresado se encuentra asignado al siguiente producto: <br> <strong>ID:</strong> ${product.id} <br> <strong>NOMBRE:</strong> ${product.name} <br> <strong>COD. BARRAS:</strong> ${product.barcode} <br> ¿Desea <strong>modificar</strong> el producto?`;
};

export const DuplicatedStoreProductMessage = (product: Product, store: Store) => {
  return `El siguiente producto: <br> <strong>ID:</strong> ${product.id} <br> <strong>COD. BARRAS:</strong> ${product.barcode} <br> <strong>NOMBRE:</strong> ${product.name} <br> <strong>DESCRIPCIÓN:</strong> ${product.description} <br> <strong>PRESENTACIÓN:</strong> ${product.presentation?.name ?? 'N/A'} <br>ya se encuentra asignado a la siguiente tienda: <br> <strong>ID:</strong> ${store.id} <br> <strong>NOMBRE:</strong> ${store.name}  <br> <strong>DIRECCIÓN:</strong> ${store.address} <br> ¿Desea modificar la asignación? También puede asignar el producto a otra tienda.`;
};

export const LowStockAlert = (storeProduct: StoreProduct) => {
  return `El stock registrado en el sistema del producto: ${storeProduct.product?.name ?? ''} es de ${storeProduct.stock} unidades.
  Puede continuar con la venta si tiene los productos a mano, caso contrario disminuya la cantidad del producto e informe al cliente.
  <strong>Recuerde mantener el stock de los productos actualizado.</strong>`;
};

export const NoStockAlert = (storeProduct: StoreProduct) => {
  return `El stock registrado en el sistema del producto: ${storeProduct.product?.name ?? ''} es de ${storeProduct.stock} unidades. Al no contar con stock disponible <strong>no</strong> no será añadido al carrito/su cantidad no aumentará. <strong>Recuerde mantener el stock de los productos actualizado.</strong> <br> Este comportamiento puede ser cambiado en la configuración del sistema en la opción: <strong>MODO_VENTAS</strong>`;
};

export const NoStockAlertAlt = (cartItem: CartItem) => {
  return `El stock registrado en el sistema del producto: ${cartItem.product?.name ?? ''} es de ${cartItem.stock} unidades. Al no contar con stock disponible no no será añadido al carrito/su cantidad no aumentará. Recuerde mantener el stock de los productos actualizado. Este comportamiento puede ser cambiado en la configuración del sistema en la opción: MODO_VENTAS`;
};

export const LowStockAlertAlt = (cartItem: CartItem) => {
  return `El stock registrado en el sistema del producto: ${cartItem.product?.name ?? ''} es de ${cartItem.stock} unidades. Puede continuar si tiene los productos a mano, caso contrario disminuya la cantidad e informe al cliente.`;
};

export const PaymentTypesHelp = `El sistema posee diversos tipos de pago cuyos comportamientos se clasifican en: <br> <br> <ul><li><span class='font-bold'>- HASH REQUERIDO (o DIGITAL) :</span> <br>
Durante el proceso de registro de venta,  solicitarán el ingreso de un HASH de pago, el cual es generado por el punto de venta o aplicativo del servicio digital de pago del cliente y no requieren el ingreso del monto de pago (efectivo entregado por el usuario).</li><br><li><span class='font-bold'>- HASH NO REQUERIDO (o EFECTIVO/CASH):</span> No requieren HASH de pago y solo necesitan el monto de dinero en efectivo entregado por el cliente.</li></ul> `;

export const VoucherSeriesHelp = `<span class="font-light">Los comprobantes siguen el formato B### / F### - 000000##, por ejemplo: B004-00000045 o F003-00000012, donde:</span>
  <ul class="list-disc pl-5 mt-2 text-left font-light">
    <li>B o F indica el tipo de comprobante (Boleta o Factura).</li>
    <li>El número de serie (001–999) es único y debe estar habilitado por tipo.</li>
    <li>Solo puede existir una serie activa por tipo de comprobante.</li>
    <li>El correlativo se gestiona automáticamente por el sistema.</li>
    <li>Si el número ingresado ya fue utilizado, se ajustará al siguiente disponible de forma automática al registrar una compra.</li>
  </ul>
  <span class="font-bold text-error">No es necesario preocuparse por duplicados: el sistema garantiza la secuencia continua y única de los comprobantes.</span>`;

export const VoucherTypesHelp =
  'Los tipos de comprobantes de pago por defecto del sistema son <strong>BOLETA</strong> y <strong>FACTURA</strong>, los cuales pueden tener varias series para comprobantes de pago registradas; con una sola de ellas activa por cada tipo. <br><br> La opción <strong>RESTABLECER</strong> solo se encuentra habilitada si el sistema no tiene tipos de comprobantes de pago registrados.';

// --- 19. STATUS CHANGE DIALOGS ---
export const SupplierStatusChangeMessage = (supplier: Supplier) => {
  return `¿Está seguro de <strong>${supplier.deletedAt != null ? 'restaurar' : 'eliminar'}</strong> el siguiente proveedor? <br> <strong>ID:</strong> ${supplier.id} <br> <strong>NOMBRE:</strong> ${supplier.name} <br> <strong>RUC:</strong> ${supplier.ruc}`;
};
export const UserStatusChangeMessage = (user: User) => {
  return `¿Está seguro de <strong>${user.deletedAt != null ? 'restaurar' : 'deshabilitar'}</strong> al siguiente usuario? <br> <strong>ID:</strong> ${user.id} <br> <strong>NOMBRES:</strong> ${user.names} <br> <strong>${DniText.toUpperCase()}:</strong> ${user.dni} <br> ${user.deletedAt == null ? 'El acceso al sistema por parte del usuario se verá restringido y sus sesiones serán cerradas.' : 'El usuario podrá volver a acceder al sistema con normalidad.'}`;
};
export const CustomerStatusChangeMessage = (customer: Customer) => {
  return `¿Está seguro de <strong>${customer.deletedAt != null ? 'restaurar' : 'eliminar'}</strong> el siguiente cliente? <br> <strong>ID:</strong> ${customer.id} <br> <strong>NOMBRE:</strong> ${customer.names} <br> <strong>DNI:</strong> ${customer.dni}`;
};
export const RoleStatusChangeMessage = (role: Role) => {
  return `¿Está seguro de <strong>${role.deletedAt != null ? 'restaurar' : 'eliminar'}</strong> el siguiente rol? <br> <strong>ID:</strong> ${role.id} <br> <strong>NOMBRE:</strong> ${role.name}`;
};
export const RemoveProfilePictureMessage = (user: User) => {
  return `¿Está seguro que desea <strong>restablecer</strong> la foto de perfil del siguiente usuario? <br> <strong>ID:</strong> ${user.id} <br> <strong>NOMBRES:</strong> ${user.names} <br> <strong>${DniText.toUpperCase()}:</strong> ${user.dni} <br> <strong>Esta acción no se puede revertir.</strong>`;
};
export const ResetPasswordRemotelyMessage = (user: User) => {
  return `¿Está seguro que desea <strong>restablecer</strong> la contraseña del siguiente usuario? <br> <strong>ID:</strong> ${user.id} <br> <strong>NOMBRES:</strong> ${user.names} <br> <strong>${DniText.toUpperCase()}:</strong> ${user.dni} <br> <strong>La nueva contraseña será el DNI del usuario (de estar disponible) o la fecha actual (DÍA-MES-AÑO): ${dayjs().format('DDMMYYYY')}</strong>`;
};
export const PresentationStatusChangeMessage = (presentation: Presentation) => {
  return `¿Está seguro de <strong>${presentation.deletedAt != null ? 'restaurar' : 'deshabilitar'}</strong> la siguiente presentación de producto? <br> <strong>ID:</strong> ${presentation.id} <br> <strong>NOMBRE:</strong> ${presentation.name} <br> <strong>VAL. NUMÉRICO:</strong> ${presentation.numericValue} <br> <strong>DESCRIPCIÓN</strong> ${presentation.description}`;
};
export const SettingDeletionMessage = (setting: Setting) => {
  return `¿Está seguro de <strong>eliminar</strong> la siguiente variable del sistema? <br> <strong>ID:</strong> ${setting.id} <br> <strong>CLAVE:</strong> ${setting.key} <br> <strong>VALOR:</strong> ${setting.value} <br> <strong>DESCRIPCIÓN</strong> ${setting.description} <br> <strong class='text-error'>Esta operación NO es reversible, deberá volver a crear la variable de ser requerida posteriormente.</strong>`;
};
export const BuyOrderStatusChangeMessage = (buyOrder: BuyOrder) => {
  return `¿Está seguro de <strong>${buyOrder.deletedAt != null ? 'restaurar' : 'eliminar'}</strong> la siguiente orden de compra? <br> <strong>ID:</strong> ${buyOrder.id} <br> <strong>PROVEEDOR:</strong> ${buyOrder.supplier?.name ?? ''} <br> <strong>TIENDA:</strong> ${buyOrder.store?.name ?? ''} <br> <strong>SUBTOTAL:</strong> ${buyOrder.subtotal} <br> <strong>TOTAL:</strong> ${buyOrder.total}`;
};
export const ProductStatusChangeMessage = (product: Product) => {
  return `¿Está seguro de <strong>${product.deletedAt != null ? 'restaurar' : 'deshabilitar'}</strong> el siguiente producto? <br> <strong>ID:</strong> ${product.id} <br> <strong>NOMBRE:</strong> ${product.name} <br> <strong>COD. BARRAS:</strong> ${product.barcode} <br> <strong>DESCRIPCIÓN</strong> ${product.description}`;
};
export const StoreProductStatusChangeMessage = (storeProduct: StoreProduct) => {
  return `¿Está seguro de <strong>${storeProduct.deletedAt != null ? 'restaurar' : 'deshabilitar'}</strong> la siguiente asignación de producto? <br> <strong>ID TIENDA:</strong> ${storeProduct.storeId} <br> <strong>ID PRODUCTO:</strong> ${storeProduct.productId} <br> <strong>COD. BARRAS:</strong> ${storeProduct.product?.barcode ?? 'N/A'} <br> <strong>DESCRIPCIÓN</strong> ${storeProduct.product?.description ?? 'N/A'}`;
};
export const StoreStatusChangeMessage = (store: Store) => {
  return `¿Está seguro de <strong>${store.deletedAt != null ? 'restaurar' : 'deshabilitar'}</strong> la siguiente tienda? <br> <strong>ID:</strong> ${store.id} <br> <strong>NOMBRE:</strong> ${store.name} <br> <strong>DIRECCIÓN:</strong> ${store.address} <br> ${store.deletedAt == null ? 'Se deshabilitaran <strong>todas</strong> las cuentas de usuario asociadas a la tienda, a excepción de las que poseen permisos administrativos. <strong>Está operación es revertible.</strong>' : 'Las cuentas de usuario deshabilitadas volverán a estar disponibles inmediatamente.'}`;
};
export const PaymentTypeStatusChangeMessage = (paymentType: PaymentType) => {
  return `¿Está seguro de <strong>${paymentType.deletedAt != null ? 'restaurar' : 'eliminar'}</strong> el siguiente tipo de pago? <br> <strong>ID:</strong> ${paymentType.id} <br> <strong>NOMBRE:</strong> ${paymentType.name} <br> Está operación es <strong>reversible,</strong> tendrá efecto inmediato.`;
};
export const VoucherSerieStatusChangeMessage = (voucherSerie: VoucherSerie) => {
  return `¿Está seguro de ${voucherSerie.isActive ? 'deshabilitar' : 'habilitar'} la siguiente serie? <br>
    SERIE: ${voucherSerie.seriesCode} - CORRELATIVO: ${voucherSerie.currentNumber} <br>
    ${!voucherSerie.isActive ? 'Los nuevos comprobantes de pago serán generados siguiendo ese patrón.' : 'Los comprobantes de pago dejarán de generarse usando ese patrón.'}`;
};

// --- 20. SALES ---
export const SalesListAreaText = `Listado de Ventas - ${AppName}`;
export const CreateSaleAreaText = `Nueva Venta - ${AppName}`;
export const CreateSaleText = 'Registro de Venta';
export const EmptyCartText = 'Vaciar carrito';
export const EmptyCartAddProductsText =
  'Carrito de compras vacio, escanee productos para continuar.';
export const EditQuantityText = 'Editar cantidad';
export const LoadingPaymentModal = 'Cargando formulario de pago...';

// --- 21. PAYMENT TYPES ---
export const PaymentTypeText = 'Tipo de Pago';
export const PaymentTypesText = 'Tipos de Pago';
export const PaymentTypesListAreaText = `Listado de Tipos de Pago - ${AppName}`;
export const CreatePaymentTypeAreaText = `Registro de Tipo de Pago - ${AppName}`;
export const EditPaymentTypeAreaText = `Editar Tipo de Pago - ${AppName}`;
export const SystemPaymentTypes = 'Gest. Tipos de Pago';
export const PaymentTypesNotLoaded = 'No se encontraron tipos de pago con el criterío ingresado.';
export const PaymentTypeUpdatedText = 'Tipo de pago actualizado correctamente.';
export const PaymentTypeCreatedText = 'Tipo de pago registrado correctamente.';
export const CreatePaymentTypeText = 'Registro de Tipo de Pago';
export const EditPaymentTypeText = 'Modificando Tipo de Pago';

// --- 22. VOUCHERS ---
export const SeriesCodeText = 'Cod. Serie';
export const CurrentCorrelativeText = 'Correlativo Actual';
export const VoucherSeriesNotLoadedText =
  'No se encontraron series de comprobantes de pago con el criterío ingresado.';
export const VoucherTypesNotLoadedText =
  'No se encontraron tipos de comprobantes de pago con el criterío ingresado.';
export const VoucherTypeText = 'Tipo de Comp. Pago';
export const VoucherTypeAltText = 'Tipo de comprobante de pago';
export const VoucherTypesText = 'Tipos de comprobantes de pago';
export const VoucherSeriesListAreaText = `Listado de Series de Comp. de Pago - ${AppName}`;
export const VoucherTypesListAreaText = `Listado de Tipos de Comp. de Pago - ${AppName}`;
export const SystemVoucherSeries = 'Gest. Series Comp. Pago';
export const SystemVoucherTypes = 'Gest. Tipos Comp. Pago';
export const VoucherSerieText = 'Serie de comprobante de pago';
export const VoucherSeriesText = 'Series de comprobantes de pago';
export const LoadingVoucherSeriesText = 'Cargando series de comprobantes de pago...';
export const VoucherSerieCreatedText = 'Serie de comprobante de pago registrada correctamente.';
export const VoucherSerieUpdatedText = 'Serie de comprobante de pago actualizada correctamente.';
export const DuplicatedVoucherSerieText =
  'La serie ingresada ya se encuentra registrada en el sistema o tiene formato inválido.';
export const CorrelativeText = 'Correlativo';
export const NewVoucherSerieText = 'Registro de serie de comp. de pago';
export const EditVoucherSerieText = 'Modificar serie de comp. de pago';
export const EnableText = 'Habilitar';
export const VoucherSerieStatusChangedText =
  'Serie de comprobantes de pago habilitada correctamente.';
export const VoucherSerieStatusChangeFailedText =
  'Fallo la modificación del estado de la serie de comprobante de pago. Intente nuevamente o comuniquese con administración.';
export const SeriesAmountText = 'Cant. Series';
export const LoadingVoucherTypesText = 'Cargando tipos de comprobantes de pago...';
export const VoucherTypeDetailText = 'Detalle de Tipo de Comp. de Pago';
export const VoucherTypesRestorationCompText =
  'Los tipos de comprobantes de pago han sido regenerados correctamente.';
export const VoucherTypesRestorationFailText =
  'Error durante la regeneración de tipos de comprobantes de pago, esta opción solo puede realizarse cuando el sistema <strong>NO PRESENTA</strong> tipos de comprobantes de pago registrados. Comuniquese con administración.';
export const VoucherTypeRestorationMessage =
  '¿Está seguro de que desea regenerar los tipos de comprobantes de pago? Está acción solo puede realizarse cuando el sistema <strong>NO</strong> cuenta con estos tipos registrados, caso contrario la operación sera cancelada. Comuniquese con administración.';
export const CashReceivedText = 'Monto Recibido';
export const PaymentHashText = 'Hash de Pago';
export const ChangeText = 'Cambio';
export const FinishSaleText = 'Finalizar Venta';
export const SaleSavedText =
  'Compra registrada correctamente, será redigirido al comprobante de pago...';
export const PaymentProcessFailedText =
  'Error durante el registro de la venta, intente nuevamente. <br> <strong>Comuniquese con administración si el problema persiste.</strong>';
export const PaymentAreaText = 'Área de Pagos';
export const SalesText = 'Ventas';
export const SaleText = 'Venta';
export const SaleTextAlt = 'Comprobante de venta';
export const SalesTextAlt = 'Comprobantes de venta';
export const VoucherText = 'Comprobante de Pago';
export const VouchersText = 'Comprobantes de Pago';
export const VoucherAltText = 'Comp. Venta';
export const VouchersAltText = 'Comps. Venta';
export const SalesNotLoadedText =
  'No se encontraron comprobantes de venta con el criterío ingresado.';
export const LoadingSalesText = 'Cargando comprobantes de venta...';
export const SaleNotFoundText = 'Comprobante de venta no encontrado.';
export const LoadingSaleText = 'Cargando comprobante de venta';
export const SaleDetailAreaText = `Detalle de Venta - ${AppName}`;
export const SalePdfAreaText = `Visor de Comprobante de Venta - ${AppName}`;
export const SaleDetailText = 'Detalle de Comprobante de Pago';
export const SoldByText = 'Vendido por';
export const EmptySaleText =
  'El comprobante de venta no contiene productos, intente nuevamente o comuniquese con administración.';
export const MakePaymentLockedText =
  'Error durante la carga de tipos de comprobantes de pago o tipos de pago, intente nuevamente (cierre y vuelva a abrir está interfaz) o comuniquese con administración. Recuerde que el sistema debe contar con tipos de comprobantes de pago, series y tipos de pago activos para realizar el proceso de venta.';

// --- 23. REPORTS ---
export const LoadingPdfText = 'Cargando PDF...';
export const VoucherPdfText = (sale: Sale) => {
  return `Detalle de Comprobante de Venta #${sale.id} -  ${sale.set}-${sale.correlative}`;
};
export const DownloadPdfText = 'Descargar Pdf';
export const GoToPdfText = 'Ver Pdf';
export const DownloadingText = 'Descargando...';
export const PdfDownloadFailed =
  'Error durante la descarga del archivo PDF. Intente nuevamente, si el problema persiste comuniquese con administración.';
export const ReportsAreaText = `Área de Reportes - ${AppName}`;
export const ReportsText = 'Reportes';
export const SalesReportText = 'Área de Reportes';
export const ReportTypeText = 'Tipo de Reporte';
export const DateText = 'Fecha';
export const GenerateText = 'Generar';
export const GeneratingText = 'Generando...';
export const GeneratingReportText = 'Generando reporte...';
export const NoSalesErrorText =
  'No se encontraron ventas registradas durante el período ingresado. Vuelva a intentarlo seleccionando un período distinto o registre algunas ventas.';
export const SalesByPaymentTypeText = 'Ventas por Tipo de Pago';
export const SalesByVoucherTypeText = 'Ventas por Tipo de Comprobante';
export const AverageValuesText = 'Valores Promedio';
export const MetricText = 'Métrica';
export const TotalSalesText = 'Total (Ventas)';
export const AverageSaleText = 'Venta Promedio (S./)';
export const AverageIgvText = 'Impuesto Promedio (S./)';
export const AverageSubtotalText = 'Subtotal Promedio (S./)';
export const AverageChangeText = 'Cambio Promedio (S./)';
export const BestSaleText = 'Mejor Venta';
export const WorstSaleText = 'Peor Venta';
export const GoToBestSaleText = 'Ir a mejor venta';
export const GoToWorstSaleText = 'Ir a peor venta';
