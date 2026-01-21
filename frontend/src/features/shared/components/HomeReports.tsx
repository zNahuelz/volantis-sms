import { Icon } from '@iconify/react';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import Loading from '~/components/Loading';
import { ChartIcon } from '~/constants/iconNames';
import {
  AverageValuesText,
  DailyReportNotLoadedText,
  DailyReportText,
  SalesByPaymentTypeText,
  SalesByVoucherTypeText,
  WeeklyReportNotLoadedText,
  WeeklyReportText,
  WelcomeMessage,
} from '~/constants/strings';
import { useAuth } from '~/context/authContext';
import { AverageSaleChart } from '~/features/reports/components/AverageSaleChart';
import { PaymentTypesChart } from '~/features/reports/components/PaymentTypesChart';
import { VoucherTypesChart } from '~/features/reports/components/VoucherTypesChart';
import { reportService, type SaleReport } from '~/features/reports/services/reportService';
import { buildSalesChart, capitalizeFirst } from '~/utils/helpers';
export default function HomeReports() {
  type SalesCharts = ReturnType<typeof buildSalesChart>;
  const [loading, setLoading] = useState(true);
  const [dailyCharts, setDailyCharts] = useState<SalesCharts | null>(null);
  const [weeklyCharts, setWeeklyCharts] = useState<SalesCharts | null>(null);
  const [hideDaily, setHideDaily] = useState(false);
  const [hideWeekly, setHideWeekly] = useState(false);
  const authStore = useAuth();

  const loadReport = async (currentDate: any, type: 'by_day' | 'by_week') => {
    try {
      const res = await reportService.salesReport(type, currentDate);
      type === 'by_day'
        ? setDailyCharts(buildSalesChart(res))
        : setWeeklyCharts(buildSalesChart(res));
    } catch {
      type === 'by_day' ? setHideDaily(true) : setHideWeekly(true);
    }
  };

  const loadReports = async () => {
    const currentDate = dayjs().format('YYYY-MM-DD');
    await loadReport(currentDate, 'by_day');
    await loadReport(currentDate, 'by_week');
    setLoading(false);
  };

  useEffect(() => {
    loadReports();
  }, []);

  if (loading) {
    return <Loading loadMessage={WelcomeMessage(authStore.user)} color='text-accent'></Loading>;
  }
  return (
    <div className='grid grid-cols-1 md:grid-cols-3'>
      <div className='col-span-full'>
        <div className='divider divider-accent text-xl font-semibold'>{`${DailyReportText} - ${capitalizeFirst(dayjs().format('dddd'))} ${dayjs().format('DD')} de ${dayjs().format('MMMM')}`}</div>
      </div>
      {hideDaily && (
        <div className='col-span-full'>
          <div className='flex flex-col items-center'>
            <Icon icon={ChartIcon} className='text-[100px] text-neutral'></Icon>
            <h1 className='font-light text-xl text-center'>{DailyReportNotLoadedText}</h1>
          </div>
        </div>
      )}
      {!hideDaily && (
        <>
          <div className='flex flex-col items-center'>
            <h1 className='text-md uppercase font-semibold'>{SalesByPaymentTypeText}</h1>
            <div className='w-75 h-75'>
              <PaymentTypesChart data={dailyCharts.paymentChart.data}></PaymentTypesChart>
            </div>
          </div>
          <div className='flex flex-col items-center'>
            <h1 className='text-md uppercase font-semibold'>{AverageValuesText}</h1>
            <div className='w-75 h-75'>
              <AverageSaleChart data={dailyCharts.averagesChart.data}></AverageSaleChart>
            </div>
          </div>
          <div className='flex flex-col items-center'>
            <h1 className='text-md uppercase font-semibold'>{SalesByVoucherTypeText}</h1>
            <div className='w-75 h-75'>
              <VoucherTypesChart data={dailyCharts.voucherChart.data}></VoucherTypesChart>
            </div>
          </div>
        </>
      )}

      <div className='col-span-full'>
        <div className='divider divider-accent text-xl font-semibold'>{`${WeeklyReportText} - Semana del ${dayjs().format('DD-MM-YYYY')}`}</div>
      </div>
      {hideWeekly && (
        <div className='col-span-full'>
          <div className='flex flex-col items-center'>
            <Icon icon={ChartIcon} className='text-[100px] text-neutral'></Icon>
            <h1 className='font-light text-xl text-center'>{WeeklyReportNotLoadedText}</h1>
          </div>
        </div>
      )}
      {!hideWeekly && (
        <>
          <div className='flex flex-col items-center'>
            <h1 className='text-md uppercase font-semibold'>{SalesByPaymentTypeText}</h1>
            <div className='w-75 h-75'>
              <PaymentTypesChart data={weeklyCharts.paymentChart.data}></PaymentTypesChart>
            </div>
          </div>
          <div className='flex flex-col items-center'>
            <h1 className='text-md uppercase font-semibold'>{AverageValuesText}</h1>
            <div className='w-75 h-75'>
              <AverageSaleChart data={weeklyCharts.averagesChart.data}></AverageSaleChart>
            </div>
          </div>
          <div className='flex flex-col items-center'>
            <h1 className='text-md uppercase font-semibold'>{SalesByVoucherTypeText}</h1>
            <div className='w-75 h-75'>
              <VoucherTypesChart data={weeklyCharts.voucherChart.data}></VoucherTypesChart>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
