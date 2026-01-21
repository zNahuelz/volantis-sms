import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import type { Sale } from '~/types/sale';
import { hasAbilities, isInteger } from '~/utils/helpers';
import { saleService } from '../services/saleService';
import Loading from '~/components/Loading';
import {
  DetailsText,
  DownloadPdfText,
  DownloadingText,
  ErrorTagText,
  GoBackText,
  LoadingSaleText,
  PdfDownloadFailed,
  VoucherPdfText,
} from '~/constants/strings';
import VoucherPdfPreview from '~/features/reports/components/VoucherPdfPreview';
import Button from '~/components/Button';
import { DetailsIcon, DownloadIcon, GoBackIcon } from '~/constants/iconNames';
import { useAuth } from '~/context/authContext';
import Swal from 'sweetalert2';
import { longSwalDismissalTime } from '~/constants/values';

export default function SalePdfView() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [sale, setSale] = useState<Sale | null>(null);
  const [downloading, setDownloading] = useState(false);
  const authStore = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadSale = async () => {
      if (!isInteger(id!)) {
        navigate('/dashboard/sale');
      }
      try {
        const res = await saleService.show(Number(id!));
        setSale(res);
      } catch (error) {
        navigate('/dashboard/sale');
      } finally {
        setLoading(false);
      }
    };

    loadSale();
  }, [id]);

  const downloadVoucherPdf = async () => {
    setDownloading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/report/sale-pdf/${sale.id}?download=true`,
        {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Descarga de PDF fallida: (${response.status})`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      try {
        const a = document.createElement('a');
        a.href = url;
        a.download = `${sale.set}-${sale.correlative}.pdf`;
        a.click();
      } finally {
        window.URL.revokeObjectURL(url);
      }
    } catch {
      Swal.fire({
        icon: 'error',
        title: ErrorTagText,
        html: PdfDownloadFailed,
        timer: longSwalDismissalTime,
        showConfirmButton: false,
      });
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return <Loading loadMessage={LoadingSaleText}></Loading>;
  }

  return (
    <div className='md:m-5 md:flex md:flex-col md:items-center'>
      <div className='border-primary border w-full'>
        <div className='bg-linear-to-r from-primary to-primary/75 text-white font-bold text-center md:text-start'>
          <h1 className='p-1 md:ms-3'>{VoucherPdfText(sale)}</h1>
        </div>
        <div className='p-4'>
          <div className='flex flex-col items-center md:items-end mb-3'>
            <div className='join join-horizontal'>
              <Button
                className='join-item md:btn-sm'
                color='btn-secondary'
                icon={GoBackIcon}
                title={GoBackText.toUpperCase()}
                disabled={loading || downloading}
                onClick={() => window.history.back()}
              ></Button>
              <Button
                className='join-item md:btn-sm'
                color='btn-primary'
                icon={DetailsIcon}
                title={DetailsText.toUpperCase()}
                disabled={
                  loading ||
                  downloading ||
                  !hasAbilities(authStore?.abilityKeys, ['sys:admin', 'sale:show'])
                }
                onClick={() => {
                  navigate(`/dashboard/sale/${sale.id}`);
                }}
              ></Button>
              <Button
                className='join-item md:btn-sm'
                color='btn-success'
                icon={!downloading ? DownloadIcon : ''}
                isLoading={downloading}
                title={!downloading ? DownloadPdfText.toUpperCase() : DownloadingText.toUpperCase()}
                disabled={
                  loading ||
                  downloading ||
                  !hasAbilities(authStore?.abilityKeys, ['sys:admin', 'report:salePdf'])
                }
                onClick={() => downloadVoucherPdf()}
              ></Button>
            </div>
          </div>
          <VoucherPdfPreview sale={sale} />
        </div>
      </div>
    </div>
  );
}
