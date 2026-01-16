import { useState, useEffect } from 'react';
import ProductScanner from '../components/ProductScanner';
import type { Customer } from '~/types/customer';
import Loading from '~/components/Loading';
import {
  CancelText,
  ContinueText,
  CreateSaleText,
  CurrentTaxValueText,
  DniText,
  EmptyCartAddProductsText,
  EmptyCartText,
  IdText,
  InfoTag,
  LoadingText,
  LowStockAlert,
  NamesText,
  NextText,
  PaymentAreaText,
  ProductText,
  QuantityText,
  SalesModuleLockedNoStores,
  SellPriceText,
  StoreText,
  SubtotalText,
  SurnamesText,
  TaxNameText,
  TotalText,
  UsingDefaultTaxMessage,
  WarningText,
} from '~/constants/strings';
import SearchCustomer from '~/features/customers/components/SearchCustomer';
import type { Store } from '~/types/store';
import Button from '~/components/Button';
import {
  ADMIN_ABILITY_KEY,
  DEFAULT_TAX_SETTING_KEY,
  DEFAULT_TAX_VALUE,
  SuccessColor,
} from '~/constants/values';
import { useAuth } from '~/context/authContext';
import StoreSelector from '~/features/stores/components/StoreSelector';
import { storeService } from '~/features/stores/services/storeService';
import { settingService } from '~/features/settings/services/settingService';
import type { Setting } from '~/types/setting';
import Swal from 'sweetalert2';
import { Icon } from '@iconify/react';
import {
  CancelIcon,
  ClearIcon,
  EditIcon,
  EmptyCartIcon,
  ErrorIcon,
  MakePaymentIcon,
  MinusIcon,
  RemoveIcon,
} from '~/constants/iconNames';
import type { StoreProduct } from '~/types/storeProduct';
import type { Product } from '~/types/product';
import { Table, type Column } from '~/components/Table';
import { formatTwoDecimals, sunatRound } from '~/utils/helpers';
import CartItemEditModal from '../components/CartItemEditModal';
import Modal from '~/components/Modal';
import MakePaymentForm, { type PrePaymentPayload } from '../components/MakePaymentForm';
import { saleService } from '../services/saleService';

export type CartItem = {
  productId: number;
  product: Product;
  sellPrice: number;
  igv: number;
  stock: number;
  salable: boolean;
  quantity: number;
};

export default function SaleCreateView() {
  const [loading, setLoading] = useState(true);
  const [customerLocked, setCustomerLocked] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<Customer>();
  const [storeLocked, setStoreLocked] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store>();
  const [stores, setStores] = useState<Store[]>([]);
  const [taxSetting, setTaxSetting] = useState<Setting>();
  const [usingDefaultTax, setUsingDefaultTax] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [lockedModuleMessage, setLockedModuleMessage] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);

  const [subtotal, setSubtotal] = useState(0.0);
  const [igv, setIgv] = useState(0.0);
  const [total, setTotal] = useState(0.0);

  const [editItem, setEditItem] = useState<CartItem | null>(null);
  const [makePaymentModalVisible, setMakePaymentModalVisible] = useState(false);
  const [prePayload, setPrePayload] = useState<PrePaymentPayload | null>();
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const authStore = useAuth();

  const isAdmin = authStore.abilityKeys?.includes(ADMIN_ABILITY_KEY) ?? false;

  const columns: Column<CartItem>[] = [
    { key: 'productId', label: IdText },
    { key: 'productName', label: ProductText, render: (row) => row.product?.name },
    { key: 'quantity', label: QuantityText },
    { key: 'sellPrice', label: SellPriceText },
    {
      key: 'subtotal',
      label: SubtotalText,
      render: (row) => formatTwoDecimals(row.quantity * row.sellPrice),
    },
  ];

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      const [storesResult, taxSettingResult] = await Promise.allSettled([
        storeService.list('available'),
        settingService.showByKey(DEFAULT_TAX_SETTING_KEY),
      ]);

      if (!mounted) return;

      const storeFailed = storesResult.status === 'rejected';
      const taxSettingFailed = taxSettingResult.status === 'rejected';

      let storesData: Store[] = [];
      let taxSettingValue: Setting = null;

      if (!storeFailed) storesData = storesResult.value;
      if (!taxSettingFailed) taxSettingValue = taxSettingResult.value;

      setStores(storesData);
      setTaxSetting(taxSettingValue);

      if (storeFailed || storesData.length === 0) {
        setIsLocked(true);
        setLockedModuleMessage(SalesModuleLockedNoStores);
      }

      if (taxSettingFailed || !taxSettingValue || Number.isNaN(Number(taxSettingValue.value))) {
        setTaxSetting(null);
        setUsingDefaultTax(true);
        showDefaultTaxAlert();
      }
      setLoading(false);
    }

    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (isAdmin) return;
    const userStore = stores.find((s) => s.id === authStore.user?.store?.id);
    if (userStore === undefined) return;
    handleStoreSelection(userStore);
  }, [stores]);

  useEffect(() => calculateCart(), [cart]);

  const calculateCart = () => {
    let subtotal = 0;
    let igv = 0;
    let total = 0;

    cart.forEach((item) => {
      const lineSubtotal = (item.sellPrice - item.igv) * item.quantity;
      const lineIgv = item.igv * item.quantity;
      const lineTotal = item.sellPrice * item.quantity;

      subtotal += sunatRound(lineSubtotal);
      igv += sunatRound(lineIgv);
      total += sunatRound(lineTotal);
    });

    setSubtotal(sunatRound(subtotal));
    setIgv(sunatRound(igv));
    setTotal(sunatRound(total));
  };

  const showDefaultTaxAlert = () => {
    Swal.fire({
      title: WarningText.toUpperCase(),
      html: UsingDefaultTaxMessage,
      icon: 'info',
      confirmButtonColor: SuccessColor,
      confirmButtonText: ContinueText.toUpperCase(),
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      reverseButtons: true,
    });
  };

  const handleCustomerResolved = (customer: Customer) => {
    setCustomerInfo(customer);
    setCustomerLocked(true);
  };

  const handleStoreSelection = (store: Store) => {
    setSelectedStore(store);
    setStoreLocked(true);
  };

  const handleProductResolved = (storeProduct: StoreProduct) => {
    if (!storeProduct) return;
    addToCart(storeProduct);
  };

  const addToCart = (sP: StoreProduct) => {
    setCart((prev) => {
      const index = prev.findIndex((e) => e.productId === sP.product?.id);
      // Product already in cart
      if (index !== -1) {
        const existing = prev[index];

        if (existing.quantity + 1 > sP.stock) {
          showStockAlert(sP);
        }

        return prev.map((item, i) =>
          i === index
            ? {
                ...item,
                sellPrice: sP.sellPrice,
                igv: sP.igv,
                product: sP.product,
                quantity: item.quantity + 1,
              }
            : item
        );
      }
      // Product not in cart
      if (sP.stock <= 0) {
        showStockAlert(sP);
      }

      return [
        ...prev,
        {
          productId: sP.product.id,
          product: sP.product,
          sellPrice: sP.sellPrice,
          igv: sP.igv,
          stock: sP.stock,
          salable: sP.salable,
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => {
      if (!prev.length) return prev;
      return prev.filter((item) => item.productId !== productId);
    });
  };

  const removeOneFromCart = (productId: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const updateCartItemQuantity = (productId: number, quantity: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item.productId === productId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const showStockAlert = (storeProduct: StoreProduct) => {
    Swal.fire(InfoTag, LowStockAlert(storeProduct), 'info');
  };

  const makePayment = () => {
    const prePayload = {
      igv: igv,
      subtotal: subtotal,
      total: total,
      storeId: selectedStore.id,
      customerId: customerInfo.id,
      userId: authStore.user?.id,
      cartItems: cart.map((e) => ({
        productId: e.productId,
        quantity: e.quantity,
        unitPrice: e.sellPrice,
      })),
    };
    setPrePayload(prePayload);
    setMakePaymentModalVisible(true);
  };

  return (
    <div className='md:m-5 md:flex md:flex-col md:items-center'>
      <div className='border-success border md:w-[600px]'>
        <div className='bg-linear-to-r from-success to-success/75 text-white font-bold text-center md:text-start'>
          <h1 className='p-1 md:ms-3'>{CreateSaleText}</h1>
        </div>
        <div className='p-4'>
          {loading && <Loading loadMessage={LoadingText} color='text-success'></Loading>}
          {!loading && isLocked && (
            <div className='flex flex-col items-center'>
              <Icon icon={ErrorIcon} className='text-[150px] text-error'></Icon>
              <h1 className='text-xl text-center font-light'>{lockedModuleMessage}</h1>
            </div>
          )}
          {!customerLocked && !loading && !isLocked && (
            <div className='flex flex-col items-center'>
              <div className='w-full md:w-75'>
                <SearchCustomer onCustomerResolved={handleCustomerResolved}></SearchCustomer>
              </div>
            </div>
          )}
          {customerLocked && !storeLocked && !loading && isAdmin && !isLocked && (
            <div className='flex flex-col items-center'>
              <div className='w-full md:w-75'>
                <StoreSelector
                  stores={stores}
                  onSelectionResolved={handleStoreSelection}
                ></StoreSelector>
              </div>
            </div>
          )}
          {customerLocked && storeLocked && !loading && !isLocked && (
            <div className='grid grid-cols-1 md:grid-cols-2'>
              <div className='col-span-full p-1'>
                <h1 className='text-center font-bold'>{`${StoreText.toUpperCase()}: ${selectedStore.name}`}</h1>
              </div>
              <div className='text-start'>
                <h1 className='text-center p-1 font-medium'>Datos del Cliente</h1>
                <span>
                  <span className='font-bold'>{NamesText}: </span>
                  {customerInfo.names}
                </span>
                <br />
                <span>
                  <span className='font-bold'>{SurnamesText}: </span>
                  {customerInfo.surnames}
                </span>
                <br />
                <span>
                  <span className='font-bold'>{DniText.toUpperCase()}: </span>
                  {customerInfo.dni}
                </span>
              </div>
              <div className='text-start p-1 font-medium'>
                <h1 className='text-center'>Datos del Vendedor</h1>
                <span>
                  <span className='font-bold'>{NamesText}: </span>
                  {authStore.user?.names ?? '-----'}
                </span>
                <br />
                <span>
                  <span className='font-bold'>{SurnamesText}: </span>
                  {authStore.user?.surnames ?? '-----'}
                </span>
                <br />
                <span>
                  <span className='font-bold'>{DniText.toUpperCase()}: </span>
                  {authStore.user?.dni ?? '-----'}
                </span>
              </div>
              <div className='col-span-full'>
                <div className='flex flex-col items-center'>
                  <div className='md:p-4 md:w-95 w-full'>
                    <ProductScanner
                      storeId={selectedStore.id}
                      onProductResolved={handleProductResolved}
                      isDisabled={editItem != null || makePaymentModalVisible}
                    ></ProductScanner>
                  </div>
                </div>
              </div>
              {cart.length <= 0 && (
                <div className='col-span-full'>
                  <div className='flex flex-col items-center'>
                    <Icon icon={EmptyCartIcon} className='text-5xl text-error'></Icon>
                    <h1 className='text-center text-md'>{EmptyCartAddProductsText}</h1>
                  </div>
                </div>
              )}
              {cart && cart.length >= 1 && (
                <div className='col-span-full'>
                  <Table
                    columns={columns}
                    data={cart}
                    size='table-sm'
                    showActions={true}
                    errorMessage={'empty cart'}
                    actions={(row) => (
                      <div className='join join-vertical md:join-horizontal'>
                        <Button
                          className='join-item btn-xs'
                          icon={RemoveIcon}
                          color='btn-error'
                          onClick={() => removeFromCart(row.productId)}
                          disabled={editItem != null || makePaymentModalVisible}
                        ></Button>
                        <Button
                          className='join-item btn-xs'
                          color='btn-neutral'
                          icon={MinusIcon}
                          disabled={editItem != null || makePaymentModalVisible}
                          onClick={() => removeOneFromCart(row.productId)}
                        ></Button>
                        <Button
                          className='join-item btn-xs'
                          color='btn-info'
                          icon={EditIcon}
                          disabled={editItem != null || makePaymentModalVisible}
                          onClick={() => setEditItem(row)}
                        ></Button>
                      </div>
                    )}
                  ></Table>
                </div>
              )}
              {cart && cart.length >= 1 && (
                <div className='col-span-full'>
                  <div className='flex flex-col items-end'>
                    <span className='text-lg font-bold'>
                      {`${SubtotalText.toUpperCase()}: `}
                      <span className='font-normal'>{formatTwoDecimals(subtotal)}</span>
                    </span>
                    <br />
                    <span className='text-lg font-bold'>
                      {`${TaxNameText.toUpperCase()}: `}
                      <span className='font-normal'>{formatTwoDecimals(igv)}</span>
                    </span>
                    <br />
                    <span className='text-lg font-bold text-error underline'>
                      {`${TotalText.toUpperCase()}: `}
                      <span className='font-normal'>{formatTwoDecimals(total)}</span>
                    </span>
                  </div>
                </div>
              )}
              <div className='col-span-full'>
                <div className='flex flex-col items-center p-4'>
                  <div className='join join-vertical md:join-horizontal'>
                    <Button
                      className='join-item'
                      color='btn-error'
                      label={CancelText}
                      icon={CancelIcon}
                      onClick={() => window.location.reload()}
                      disabled={makePaymentModalVisible}
                    ></Button>
                    <Button
                      className='join-item'
                      color='btn-secondary'
                      label={EmptyCartText}
                      icon={ClearIcon}
                      disabled={
                        !cart || cart.length <= 0 || editItem != null || makePaymentModalVisible
                      }
                      onClick={() => clearCart()}
                    ></Button>
                    <Button
                      className='join-item'
                      color='btn-success'
                      label={NextText}
                      icon={MakePaymentIcon}
                      disabled={
                        !cart ||
                        cart.length <= 0 ||
                        !customerLocked ||
                        !storeLocked ||
                        makePaymentModalVisible ||
                        isProcessingPayment
                      }
                      onClick={() => {
                        setIsProcessingPayment(true);
                        makePayment();
                      }}
                    ></Button>
                  </div>
                </div>
              </div>
              <h1 className='text-error text-xs col-span-full text-center'>
                {CurrentTaxValueText(
                  usingDefaultTax ? DEFAULT_TAX_VALUE : Number(taxSetting.value),
                  usingDefaultTax
                )}
              </h1>
            </div>
          )}
        </div>
      </div>
      {/*** Edit cart item modal */}
      <CartItemEditModal
        open={!!editItem}
        item={editItem}
        onClose={() => setEditItem(null)}
        onConfirm={(quantity) => {
          if (!editItem) return;
          updateCartItemQuantity(editItem.productId, quantity);
          setEditItem(null);
        }}
      />

      {/*** Make payment modal */}
      <Modal
        open={makePaymentModalVisible}
        title={PaymentAreaText.toUpperCase()}
        onClose={() => {
          setMakePaymentModalVisible(false);
          setIsProcessingPayment(false);
          setIsFormSubmitting(false);
        }}
        disableClose={isFormSubmitting}
        width='max-w-lg'
      >
        <MakePaymentForm
          onSubmit={(data) => saleService.create(data)}
          prePayload={prePayload}
          onSubmittingChange={setIsFormSubmitting}
          closeParentModal={() => {
            setMakePaymentModalVisible(false);
          }}
        ></MakePaymentForm>
      </Modal>
    </div>
  );
}
