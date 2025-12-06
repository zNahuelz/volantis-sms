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
export const SettingText = 'Configuración';
export const LogoutText = 'Cerrar Sesión';
export const ProfileText = 'Perfil';
export const NewText = 'Nuevo';
export const ListText = 'Listado';
export const EmptyListText = 'No se encontraron elementos.';
export const ActionsText = 'Acciones';
export const SupplierListText = 'Listado de Proveedores';
export const LoadingText = 'Cargando...';
export const LoadingSuppliersText = 'Cargando proveedores...';
export const LoadingUsersText = 'Cargando usuarios...';
export const SuppliersNotLoaded = 'No se encontraron proveedores con el criterío ingresado.';
export const UsersNotLoaded = 'No se encontraron usuarios con el criterío ingresado.';
export const SuppliersListAreaText = `Listado de Proveedores - ${AppName}`;
export const CreateSupplierAreaText = `Registro de Proveedor - ${AppName}`;
export const SupplierDetailAreaText = `Detalle de Proveedor - ${AppName}`;
export const EditSupplierAreaText = `Editar Proveedor - ${AppName}`;
export const LoginAreaText = `Inicio de Sesión - ${AppName}`;
export const NameText = 'Nombre';
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
  return `Mostrando ${elements} ${elements >= 1 ? pluralName : singularName} de un total de ${total}.`;
};
export const SupplierText = 'Proveedor';
export const RestoreText = 'Restaurar';
export const DetailsText = 'Detalles';
export const ForgotPasswordText = '¿Olvidaste tu contraseña? ';
export const ClickHereText = 'Click aquí';
export const RememberMeText = 'Recuérdame';
export const CreateSupplierText = 'Registro de Proveedor';
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
  return `¿Está seguro de ${supplier.deletedAt != null ? 'restaurar' : 'eliminar'} el siguiente proveedor? <br> <strong>ID:</strong> ${supplier.id} <br> <strong>NOMBRE:</strong> ${supplier.name} <br> <strong>RUC:</strong> ${supplier.ruc}`;
};
export const UserStatusChangeMessage = (user: User) => {
  return `Está seguro de ${user.deletedAt != null ? 'restaurar' : 'deshabilitar'} al siguiente usuario? <br> <strong>ID:</strong> ${user.id} <br> <strong>NOMBRES:</strong> ${user.names} <br> <strong>${DniText.toUpperCase()}:</strong> ${user.dni}`;
};
export const SupplierStatusUpdatedText = 'Visibilidad de proveedor actualizada correctamente.';
export const UserStatusUpdatedText = 'Estado de cuenta de usuario actualizada correctamente.';
export const SupplierStatusUpdateFailedText =
  'Fallo la actualización de visibilidad del proveedor. Intente nuevamente o comuniquese con administración.';
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
export const UsersListAreaText = `Listado de Usuarios - ${AppName}`;
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
