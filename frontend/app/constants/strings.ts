import type { Supplier } from '~/types/supplier';

export const AppName = 'Volantis';
export const AppDescription = 'Sis. Gestión de Ventas';

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
export const SuppliersNotLoaded = 'No se encontraron proveedores con el criterío ingresado.';
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
export const SupplierStatusUpdatedText = 'Visibilidad de proveedor actualizada correctamente.';
export const SupplierStatusUpdateFailedText =
  'Fallo la actualización de visibilidad del proveedor. Intente nuevamente o comuniquese con administración.';
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
