export const PAGINATION_LIMITS = [
  { label: '10 | Pág', value: 10 },
  { label: '25 | Pág', value: 25 },
  { label: '50 | Pág', value: 50 },
  { label: '100 | Pág', value: 100 },
];

export const SUPPLIER_SEARCH_TYPES = [
  { label: 'POR ID', value: 'id' },
  { label: 'POR RUC', value: 'ruc' },
  { label: 'POR NOMBRE', value: 'name' },
];

export const USER_SEARCH_TYPES = [
  { label: 'POR ID', value: 'id' },
  { label: 'POR DNI', value: 'dni' },
  { label: 'POR NOMBRES', value: 'names' },
  { label: 'POR NOMBRE DE USUARIO', value: 'username' },
  { label: 'POR CORREO ELECTRÓNICO', value: 'email' },
];

export const CUSTOMER_SEARCH_TYPES = [
  { label: 'POR ID', value: 'id' },
  { label: 'POR DNI', value: 'dni' },
  { label: 'POR NOMBRES', value: 'names' },
];

export const ABILITY_SEARCH_TYPES = [
  { label: 'POR ID', value: 'id' },
  { label: 'POR NOMBRE', value: 'name' },
  { label: 'POR CLAVE', value: 'key' },
  { label: 'POR DESCRIPCIÓN', value: 'description' },
];

export const PRESENTATION_SEARCH_TYPES = [
  { label: 'POR ID', value: 'id' },
  { label: 'POR NOMBRE', value: 'name' },
  { label: 'POR DESCRIPCIÓN', value: 'description' },
];

export const PRODUCT_SEARCH_TYPES = [
  { label: 'POR ID', value: 'id' },
  { label: 'POR COD. BARRAS', value: 'barcode' },
  { label: 'POR NOMBRE', value: 'name' },
  { label: 'POR DESCRIPCIÓN', value: 'description' },
];

export const SETTING_SEARCH_TYPES = [
  { label: 'POR ID', value: 'id' },
  { label: 'POR CLAVE', value: 'key' },
  { label: 'POR VALOR', value: 'value' },
  { label: 'POR TIPO DE VARIABLE', value: 'valueType' },
  { label: 'POR DESCRIPCIÓN', value: 'description' },
];

export const SYSTEM_VAR_TYPES = [
  { label: 'ENTERO LARGO', value: 'double' },
  { label: 'DECIMAL', value: 'decimal' },
  { label: 'TEXTO', value: 'string' },
  { label: 'LISTA', value: 'array' },
  { label: 'ENTERO', value: 'integer' },
  { label: 'BOOLEANO', value: 'boolean' },
  { label: 'OTRO', value: 'other' },
];

export const DEFAULT_STATUS_TYPES = [
  { label: 'TODOS', value: 'all' },
  { label: 'SOLO HABILITADOS', value: 'available' },
  { label: 'SOLO DESHABILITADOS', value: 'deleted' },
];

export const DEFAULT_BUY_ORDER_STATUS = [
  { label: 'SOLICITUD PENDIENTE', value: 'PENDIENTE' },
  { label: 'ENTREGA PENDIENTE', value: 'ENVIADO' },
  { label: 'ORDEN COMPLETADA', value: 'FINALIZADA' },
  { label: 'CANCELADA', value: 'CANCELADA' },
];

export const DEFAULT_BUY_ORDER_SEARCH_TYPES = [
  { label: 'POR ID', value: 'id' },
  { label: 'POR ESTADO', value: 'status' },
  { label: 'POR PROVEEDOR', value: 'supplierId' },
  { label: 'POR POR TIENDA', value: 'storeId' },
];

export const DEFAULT_STORE_PRODUCT_SALE_STATUS = [
  { label: 'VENTA HABILITADA', value: 'true' },
  { label: 'VENTA DESHABILITADA', value: 'false' },
];

export const DEFAULT_STORE_PRODUCT_SEARCH_TYPES = [
  { label: 'POR ID TIENDA', value: 'storeId' },
  { label: 'POR ID PRODUCTO', value: 'productId' },
  { label: 'POR COD. BARRAS', value: 'barcode' },
];
