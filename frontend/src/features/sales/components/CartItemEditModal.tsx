import Modal from '~/components/Modal';
import type { CartItem } from '../views/SaleCreateView';
import { useState, useEffect } from 'react';
import Button from '~/components/Button';
import {
  CancelText,
  ContinueText,
  EditQuantityText,
  LowStockAlertAlt,
  NoStockAlertAlt,
  QuantityText,
} from '~/constants/strings';
import { CheckIcon, CloseIcon, SaveIcon } from '~/constants/iconNames';
import Input from '~/components/Input';

interface Props {
  open: boolean;
  item: CartItem | null;
  mode?: string;
  onClose: () => void;
  onConfirm: (quantity: number) => void;
}

export default function CartItemEditModal({
  open,
  item,
  mode = 'free',
  onClose,
  onConfirm,
}: Props) {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (item) setQuantity(item.quantity);
  }, [item]);

  const normalizedMode = mode?.toLowerCase() ?? 'free';
  const isFreeMode = normalizedMode === 'free';
  const isStrictMode = normalizedMode === 'strict';

  if (!item) return null;

  return (
    <Modal
      open={open}
      title={`${EditQuantityText} : ${item.product.name ?? ''}`}
      onClose={onClose}
      disableClose={false}
      width='max-w-xs'
    >
      <div className='flex flex-col gap-2'>
        <fieldset className='fieldset'>
          <legend className='fieldset-legend'>{QuantityText}</legend>
          <Input
            type='number'
            min={0}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          ></Input>
        </fieldset>

        {isFreeMode && quantity > item.stock && (
          <p className='text-xs text-info text-center'>{LowStockAlertAlt(item)}</p>
        )}

        {isStrictMode && quantity > item.stock && (
          <p className='text-xs text-error text-center'>{NoStockAlertAlt(item)}</p>
        )}

        <div className='flex justify-center gap-2'>
          <div className='join join-vertical md:join-horizontal'>
            <Button
              color='btn-error'
              onClick={onClose}
              className='join-item'
              icon={CloseIcon}
              title={CancelText.toUpperCase()}
            />
            <Button
              color='btn-primary'
              className='join-item'
              onClick={() => {
                if (isStrictMode && quantity > item.stock) return;
                onConfirm(quantity);
              }}
              disabled={quantity < 0 || (isStrictMode && quantity > item.stock)}
              icon={CheckIcon}
              title={ContinueText.toUpperCase()}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
