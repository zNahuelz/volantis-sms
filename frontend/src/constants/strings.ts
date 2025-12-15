import dayjs from 'dayjs';
import type { Customer } from '~/types/customer';
import type { Role } from '~/types/role';
import type { Supplier } from '~/types/supplier';
import type { User } from '~/types/user';

export const AppName = 'Volantis';
export const AppDescription = 'Sis. Gestión de Ventas';
export const AppVersion = 'Dev. Env.';

export const LoginText = 'Inicio de Sesión';
export const LoginButtonText = 'Iniciar Sesión';
export const EmailText = 'Correo Electrónico';
export const PasswordText = 'Contraseña';
export const CurrentPasswordText = 'Contraseña actual';
export const NewPasswordText = 'Nueva contraseña';
export const RepeatPasswordText = 'Repetir contraseña';
export const HomeText = 'Inicio';
export const NewSaleText = 'Nueva venta';
export const SuppliersText = 'Proveedores';
export const ProductsText = 'Productos';
export const SettingText = 'Configuración';
export const LogoutText = 'Cerrar Sesión';
export const ProfileText = 'Perfil';
export const NewText = 'Nuevo';
export const ListText = 'Listado';
export const PresentationManagementText = 'Gest. Presentaciones';
export const EmptyListText = 'No se encontraron elementos.';
export const ActionsText = 'Acciones';
export const SupplierListText = 'Listado de Proveedores';
export const LoadingText = 'Cargando...';
export const LoadingSuppliersText = 'Cargando proveedores...';
export const LoadingCustomersText = 'Cargando clientes...';
export const LoadingUsersText = 'Cargando usuarios...';
export const SuppliersNotLoaded = 'No se encontraron proveedores con el criterío ingresado.';
export const CustomersNotLoaded = 'No se encontraron clientes con el criterío ingresado.';
export const UsersNotLoaded = 'No se encontraron usuarios con el criterío ingresado.';
export const SuppliersListAreaText = `Listado de Proveedores - ${AppName}`;
export const CustomersListAreaText = `Listado de Clientes - ${AppName}`;
export const CreateSupplierAreaText = `Registro de Proveedor - ${AppName}`;
export const CreateRoleAreaText = `Registro de Rol - ${AppName}`;
export const SupplierDetailAreaText = `Detalle de Proveedor - ${AppName}`;
export const RoleDetailAreaText = `Detalle de Rol - ${AppName}`;
export const EditSupplierAreaText = `Editar Proveedor - ${AppName}`;
export const LoginAreaText = `Inicio de Sesión - ${AppName}`;
export const NameText = 'Nombre';
export const KeyText = 'Clave';
export const RucText = 'Ruc';
export const PhoneText = 'Teléfono';
export const CreatedAtText = 'Fecha de Creación';
export const UpdatedAtText = 'Ult. Mod.';
export const DeletedAtText = 'Fecha de Eliminación';
export const StateText = 'Estado';
export const EditText = 'Modificar';
export const DeleteText = 'Eliminar';
export const DisableText = 'Deshabilitar';
export const IsActiveText = 'Habilitado';
export const IsDeletedText = 'Deshabilitado';
export const SearchText = 'Buscar';
export const ReloadText = 'Recargar';
export const TableElementsMessage = (
  singularName: string,
  pluralName: string,
  total: number,
  elements: number
) => {
  return `Mostrando ${elements} ${elements > 1 ? pluralName : singularName} de un total de ${total}.`;
};
export const SupplierText = 'Proveedor';
export const RestoreText = 'Restaurar';
export const DetailsText = 'Detalles';
export const ForgotPasswordText = '¿Olvidaste tu contraseña? ';
export const ClickHereText = 'Click aquí';
export const RememberMeText = 'Recuérdame';
export const CreateSupplierText = 'Registro de Proveedor';
export const CreateCustomerText = 'Registro de Cliente';
export const EditSupplierText = 'Modificando Proveedor';
export const AddressText = 'Dirección';
export const SaveText = 'Guardar';
export const SavingText = 'Guardando...';
export const UpdateText = 'Actualizar';
export const UpdatingText = 'Actualizando...';
export const ClearText = 'Limpiar';
export const CancelText = 'Cancelar';
export const SupplierCreatedText = 'Proveedor registrado correctamente.';
export const SupplierUpdatedText = 'Proveedor actualizado correctamente.';
export const OkTagText = 'Operación completada';
export const UsernameText = 'Nombre de Usuario';
export const SupplierRucTakenText = 'El RUC ingresado ya se encuentra asignado a otro proveedor.';
export const ErrorTagText = 'Ha ocurrido un error';
export const OpRollbackText = 'Operación cancelada';
export const LoadingSupplierText = 'Cargando información de proveedor...';
export const SupplierNotFound = 'Proveedor no encontrado.';
export const IdText = '#';
export const IdTextAlt = 'ID';
export const SupplierStatusChangeMessage = (supplier: Supplier) => {
  return `¿Está seguro de <strong>${supplier.deletedAt != null ? 'restaurar' : 'eliminar'}</strong> el siguiente proveedor? <br> <strong>ID:</strong> ${supplier.id} <br> <strong>NOMBRE:</strong> ${supplier.name} <br> <strong>RUC:</strong> ${supplier.ruc}`;
};
export const UserStatusChangeMessage = (user: User) => {
  return `¿Está seguro de <strong>${user.deletedAt != null ? 'restaurar' : 'deshabilitar'}</strong> al siguiente usuario? <br> <strong>ID:</strong> ${user.id} <br> <strong>NOMBRES:</strong> ${user.names} <br> <strong>${DniText.toUpperCase()}:</strong> ${user.dni}`;
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

export const SupplierStatusUpdatedText = 'Visibilidad de proveedor actualizada correctamente.';
export const CustomerStatusUpdatedText = 'Visibilidad de cliente actualizada correctamente';
export const UserStatusUpdatedText = 'Estado de cuenta de usuario actualizada correctamente.';
export const UserProfilePictureRemovedText =
  'Foto de perfil del usuario restablecida correctamente.';
export const UserPasswordResetSuccesfullyText =
  'Contraseña del usuario restablecida correctamente, sus sesiones han sido cerradas automáticamente.';
export const SupplierStatusUpdateFailedText =
  'Fallo la actualización de visibilidad del proveedor. Intente nuevamente o comuniquese con administración.';
export const CustomerStatusUpdateFailedText =
  'Fallo la actualización de visibilidad del cliente. Intente nuevamente o comuniquese con administración.';
export const UserStatusUpdateFailedText =
  'Fallo la actualización de estado de cuenta de usuario. Intente nuevamente o comuniquese con administración.';
export const ConfirmActionText = 'Confirmar Operación';
export const LoggingInText = 'Ingresando...';
export const InvalidCredentialsText =
  'Inicio de sesión fallido, verifique sus credenciales e intente nuevamente.';
export const LoginErrorText =
  'Error durante el inicio de sesión, intente nuevamente. Si el problema persiste comuniquese con administración';
export const ClosingSessionText = 'Cerrando sesión...';
export const PleaseWaitText = 'Por favor espere';
export const GoBackText = 'Átras';
export const SupplierDetailText = 'Detalle de Proveedor';
export const NamesText = 'Nombres';
export const SurnamesText = 'Apellidos';
export const DniText = 'Dni';
export const SurnameText = 'Apellido';
export const RoleText = 'Rol';
export const AssignedStoreText = 'Tienda Asignada';
export const AdminAssignedStoreText =
  'Los usuarios con el rol de administrador pueden realizar operaciones en todas las tiendas a pesar de estar asignados a la sucursal principal.';
export const DescriptionText = 'Descripción';
export const ProfileAreaText = `Mi Perfil - ${AppName}`;
export const EmptyAbilityListText =
  'El rol del usuario no cuenta con permisos asignados. Comuniquese con administración.';
export const CurrentEmailText = 'Correo electrónico actual';
export const NewEmailText = 'Nuevo correo electrónico';
export const ConfirmEmailText = 'Repetir correo electrónico';
export const ServerErrorText =
  'Error interno del servidor, operación cancelada. Vuelva a intentarlo o comuniquese con administración';
export const UserEmailUpdatedText = (email: string) => {
  return `Correo electrónico actualizado correctamente. <br> <strong>NUEVO CORREO ELECTRÓNICO: </strong>${email}`;
};
export const UpdatePasswordAlertText =
  'Actualizar su contraseña requerira que vuelva a iniciar sesión posteriormente. Además, se cerraran todas las sesiones existentes de su cuenta.';
export const UserPasswordUpdatedText =
  'Contraseña actualizada correctamente, debe volver a iniciar sesión con sus nuevas credenciales. Todas lase sesiones abiertas con su cuenta de usuario han sido cerradas automáticamente.';
export const RegisterDateText = 'Fecha de Registro';
export const UserUpdatedAtText = 'Ult. Mod. al Usuario';
export const CurrenAvatarText = 'Foto de perfil actual';
export const PreviewText = 'Vista previa';
export const NoFileSelected = 'Sin archivo seleccionado';
export const UserAvatarUpdatedText =
  'Foto de perfil actualizada correctamente, podría tardar unos minutos en visualizarse correctamente.';
export const SystemText = 'Sistema';
export const SystemUsersText = 'Gest. Usuarios';
export const SystemRolesText = 'Gest. Roles';
export const SystemAbilitiesText = 'Gest. Permisos';
export const UsersListAreaText = `Listado de Usuarios - ${AppName}`;
export const RolesListAreaText = `Listado de Roles - ${AppName}`;
export const PresentationsListAreaText = `Listado de Presentaciones de Productos - ${AppName}`;
export const AbilitiesListAreaText = `Listado de Permisos - ${AppName}`;
export const CreateCustomerAreaText = `Registro de Cliente - ${AppName}`;
export const WelcomeAreaText = `Dashboard - ${AppName}`;
export const UserText = 'Usuario';
export const UsersText = 'Usuarios';
export const LoadingForm = 'Cargando formulario...';
export const FormLoadFailed =
  'Error durante la carga del formulario, intente nuevamente o comuniquese con administración';
export const UserUpdatedText = 'Usuario actualizado correctamente.';
export const UserCreatedText =
  'Usuario registrado correctamente. Se ha enviado un correo electrónico con la información del usuario. Recuerde que la contraseña por defecto es el DNI del empleado.';
export const UserRegisterText = 'Registro de Usuario';
export const UserEditText = 'Modificar Usuario';
export const InvalidStoreIdText =
  'La tienda seleccionada no se encuentra disponible o es inválida, intente nuevamente o comuniquese con administración';
export const InvalidRoleIdText =
  'El rol seleccionado no se encuentra disponible o es inválida, intente nuevamente o comuniquese con administración';
export const UserDniTakenText =
  'El DNI ingresado ya se encuentra asignado a otro usuario, comuniquese con administración.';
export const UserEmailTaken =
  'El correo electrónico ingresado ya se encuentra asignado a otro usuario, comuniquese con administración';
export const UsernameChangeDisabledOnEditText =
  'Modificar el DNI del empleado no actualizará su nombre de usuario, tal cambio puede realizarse de forma personal desde el apartado "Mi Perfil".';
export const LoadingUserText = 'Cargando usuario...';
export const UserNotFoundText = 'Usuario no encontrado.';
export const UserDetailText = 'Detalle de Usuario';
export const StoreText = 'Tienda';
export const StoreAddressText = 'Dirección de la Tienda';
export const RemoveProfilePictureText = 'Restablecer foto de perfil';
export const ResetPasswordText = 'Reiniciar contraseña';
export const SendPasswordRecoveryText = 'Enviar e-mail de recuperación';
export const EditRoleText = 'Editar rol';
export const UserDetailAreaText = `Detalle de Usuario -  ${AppName}`;
export const ConfirmText = 'Confirmar';
export const CustomersText = 'Clientes';
export const CustomerText = 'Cliente';
export const CustomerUpdatedText = 'Cliente actualizado correctamente.';
export const CustomerCreatedText = 'Cliente registrado correctamente.';
export const CustomerDniTakenText = 'El DNI ingresado ya se encuentra asignado a otro cliente.';
export const EditCustomerAreaText = `Editar Cliente - ${AppName}`;
export const EditCustomerText = 'Modificando Cliente';
export const CustomerNotFoundText = 'Cliente no encontrado';
export const LoadingCustomerText = 'Cargando información de cliente...';
export const CustomerDetailAreaText = `Detalle de Cliente - ${AppName}`;
export const CustomerDetailText = 'Detalle de Cliente';
export const _404Text =
  'Oops! El módulo no existe o no está disponible. Comuniquese con administración o verifique la URL.';
export const HereText = 'aquí';
export const _404AreaText = `Módulo no encontrado - ${AppName}`;
export const RolesNotLoadedText = 'No se encontraron roles con el criterío ingresado.';
export const LoadingRolesText = 'Cargando roles...';
export const TotalSystemRolesText = (amount: number) => {
  return `El sistema cuenta con ${amount} roles registrados.`;
};
export const RoleStatusUpdatedText = 'Visibilidad de rol actualizada correctamente.';
export const RoleStatusUpdateFailedText =
  'Fallo la actualización de visibilidad del rol. Intente nuevamente o comuniquese con administración.';
export const CreateRoleText = 'Registro de Rol';
export const LoadingRoleText = 'Cargando información de rol';
export const RoleNotFound = 'Rol no encontrado.';
export const EditRoleAreaText = `Editar Rol - ${AppName}`;
export const RoleCreatedText = 'Rol registrado correctamente.';
export const RoleUpdatedText = 'Rol actualizado correctamente.';
export const RoleNameTaken = 'El nombre ingresado ya pertenece a un rol registrado.';
export const RoleDetailText = 'Detalle de Rol';
export const LinkedAbilitiesText = 'Permisos Asociados';
export const AbilitiesNotLoadedText = 'No se encontraron permisos con el criterío ingresado.';
export const LoadingAbilitiesText = 'Cargando permisos...';
export const AbilityText = 'Permiso';
export const AbilitiesText = 'Permisos';
export const AbilityCreatedText = 'Permiso registrado correctamente.';
export const AbilityUpdatedText = 'Permiso actualizado correctamente.';
export const AbilityKeyTakenText = 'La CLAVE ingresada ya se encuentra asignada a otro permiso.';
export const NewAbilityText = 'Registro de Permiso';
export const AbilityEditText = 'Modificar Permiso';
export const NewAbilityAdvice =
  'Recuerde que la creación de nuevos permisos debe estar acompañada de una actualización del sistema la cual incluya las acciones correspondientes al permiso.';
export const EditAbilityAdvice =
  'IMPORTANTE: Modificar la CLAVE de un permiso puede alterar el funcionamiento del sistema, solo realice esta acción bajo supervisión de la administración.';
export const ContinueText = 'Continuar';
export const WarningText = 'Advertencia';
export const ModifySettingsWarning =
  'Estás accediendo a la configuración del sistema. Modificaciones incorrectas pueden afectar su funcionamiento. <br> <strong>Procede con precaución.</strong>';
export const BackText = 'Volver';
