import { useEffect, useState } from 'react';
import appIcon from '../../../assets/images/volLogoTransparent.png';
import {
  ErrorTagText,
  InvalidOrExpiredTokenText,
  LoadingAccountRecoveryText,
  RecoverAccountText,
} from '~/constants/strings';
import SendRecoveryMailForm from '../components/SendRecoveryMailForm';
import ChangePasswordWithTokenForm from '../components/ChangePasswordWithTokenForm';
import Loading from '~/components/Loading';
import { useSearchParams } from 'react-router';
import { verifyRecoveryTokenService } from '../services/authService';
import Swal from 'sweetalert2';
import { longSwalDismissalTime } from '~/constants/values';
import { useNavigate } from 'react-router';

export default function PasswordRecoveryView() {
  const [searchParams] = useSearchParams();
  const tokenParam = searchParams.get('token');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [hasToken, setHasToken] = useState(false);
  const navigate = useNavigate();

  const verifyToken = async () => {
    if (tokenParam && tokenParam.length === 100) {
      try {
        await verifyRecoveryTokenService(tokenParam);
        setToken(tokenParam);
        setHasToken(true);
        setLoading(false);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: ErrorTagText,
          html: !error.message ? InvalidOrExpiredTokenText : error.message,
          timer: longSwalDismissalTime,
          showConfirmButton: false,
        }).then((r) => {
          if (r.dismiss) navigate('/');
        });
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  return (
    <div className='bg-secondary/10 flex min-h-screen flex-col items-center justify-center'>
      <div className='card bg-base-100 flex w-100 flex-col p-6 shadow-xl'>
        {loading && (
          <>
            <Loading loadMessage={LoadingAccountRecoveryText}></Loading>
          </>
        )}
        {!loading && (
          <>
            <h1 className='text-center text-xl font-bold'>{RecoverAccountText}</h1>
            <div className='mt-2 flex flex-col items-center'>
              <img
                alt='Volantis Logo'
                src={appIcon}
                className='h-25 w-20'
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
              />
            </div>
            {!hasToken && (
              <div className='flex flex-col items-center'>
                <SendRecoveryMailForm />
              </div>
            )}
            {hasToken && (
              <div>
                <ChangePasswordWithTokenForm token={token} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
