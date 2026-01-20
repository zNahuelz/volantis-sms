import { useEffect, useState } from 'react';
import Loading from '~/components/Loading';
import { LoadingPdfText } from '~/constants/strings';
import { useAuth } from '~/context/authContext';
import type { Sale } from '~/types/sale';

type Props = {
  sale: Sale;
};

export default function VoucherPdfPreview({ sale }: Props) {
  const [url, setUrl] = useState<string | null>(null);
  const authStore = useAuth();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/report/sale-pdf/${sale.id}`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    })
      .then((res) => res.blob())
      .then((blob) => {
        setUrl(URL.createObjectURL(blob));
      });

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [sale]);

  if (!url) return <Loading loadMessage={LoadingPdfText}></Loading>;

  return <iframe src={url} width='100%' height='700px' style={{ border: 'none' }} />;
}
