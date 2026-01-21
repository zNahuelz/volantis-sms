import { useForm } from 'react-hook-form';
import { useState } from 'react';
import Button from '~/components/Button';
import Input from '~/components/Input';
import Select from '~/components/Select';
import { SALES_REPORT_MODES } from '~/constants/arrays';
import {
  ChartDownIcon,
  ChartUpIcon,
  CheckIcon,
  GoBackIcon,
  ReloadIcon,
} from '~/constants/iconNames';
import {
  AverageChangeText,
  AverageIgvText,
  AverageSaleText,
  AverageSubtotalText,
  AverageValuesText,
  BestSaleText,
  DateText,
  ErrorTagText,
  GenerateText,
  GeneratingReportText,
  GeneratingText,
  GoBackText,
  GoToBestSaleText,
  GoToWorstSaleText,
  MetricText,
  NoSalesErrorText,
  ReloadText,
  ReportTypeText,
  SalesByPaymentTypeText,
  SalesByVoucherTypeText,
  SalesReportText,
  TotalSalesText,
  ValueText,
  WorstSaleText,
} from '~/constants/strings';
import { reportService, type SaleReport } from '../services/reportService';
import Loading from '~/components/Loading';
import { PaymentTypesChart } from '../components/PaymentTypesChart';
import {
  buildSalesChart,
  formatReportDate,
  hasAbilities,
  resolveReportType,
} from '~/utils/helpers';
import { VoucherTypesChart } from '../components/VoucherTypesChart';
import { AverageSaleChart } from '../components/AverageSaleChart';
import Swal from 'sweetalert2';
import { longSwalDismissalTime } from '~/constants/values';
import { Table } from '~/components/Table';
import { useNavigate } from 'react-router';
import { useAuth } from '~/context/authContext';

export default function ReportModuleView() {
  type SalesCharts = ReturnType<typeof buildSalesChart>;
  const [report, setReport] = useState<SaleReport>();
  const [loading, setLoading] = useState(false);
  const [charts, setCharts] = useState<SalesCharts | null>(null);
  const navigate = useNavigate();
  const authStore = useAuth();

  const summaryData = [
    { label: TotalSalesText, value: report?.totalSales },
    { label: AverageSaleText, value: report?.averageSale },
    { label: AverageIgvText, value: report?.averageIgv },
    { label: AverageSubtotalText, value: report?.averageSubtotal },
    { label: AverageChangeText, value: report?.averageChange },
    { label: BestSaleText, value: `${report?.highestSale.set}-${report?.highestSale.correlative}` },
    { label: WorstSaleText, value: `${report?.lowestSale.set}-${report?.lowestSale.correlative}` },
  ];

  const summaryColumns = [
    { key: 'label', label: MetricText },
    { key: 'value', label: ValueText },
  ];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      type: SALES_REPORT_MODES[0].value,
      date: '',
    },
  });

  const submitHandler = async (data: any) => {
    try {
      setLoading(true);
      const res = await reportService.salesReport(data.type, data.date);
      setReport(res);
      setCharts(buildSalesChart(res));
    } catch (error) {
      resetReport();
      Swal.fire({
        icon: 'error',
        title: ErrorTagText,
        html: !error.message ? NoSalesErrorText : error.message,
        timer: longSwalDismissalTime,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const resetReport = () => {
    setReport(null);
    setCharts(null);
    reset();
  };

  return (
    <div className='md:m-5 md:flex md:flex-col md:items-center'>
      <div className='border-accent border w-auto md:min-w-[300px]'>
        <div className='bg-linear-to-r from-accent to-accent/70 text-white font-bold text-center md:text-start'>
          <h1 className='p-1 md:ms-3'>{SalesReportText}</h1>
        </div>
        <div className='p-4'>
          {loading && (
            <Loading loadMessage={`${GeneratingReportText}`} color='text-accent'></Loading>
          )}
          {!loading && !!!report && (
            <form className='space-y-2' onSubmit={handleSubmit(submitHandler)}>
              <fieldset className='fieldset'>
                <legend className='fieldset-legend'>{ReportTypeText}</legend>
                <Select
                  options={SALES_REPORT_MODES}
                  className='w-full'
                  {...register('type', { required: true })}
                  errorMessage={errors.type?.message}
                  disabled={isSubmitting}
                ></Select>
              </fieldset>
              <fieldset className='fieldset'>
                <legend className='fieldset-legend'>{DateText}</legend>
                <Input
                  type='date'
                  {...register('date', {
                    required: 'Debe seleccionar una fecha.',
                    validate: (value) => {
                      const selected = new Date(value);
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);

                      return selected <= today || 'La fecha no puede ser futura.';
                    },
                  })}
                  errorMessage={errors.date?.message}
                  disabled={isSubmitting}
                ></Input>
              </fieldset>
              <div className='flex flex-col items-center'>
                <div className='join join-vertical md:join-horizontal'>
                  <Button
                    className='join-item'
                    color='btn-error'
                    icon={GoBackIcon}
                    label={GoBackText}
                    type='button'
                    disabled={isSubmitting}
                    onClick={() => window.history.back()}
                  ></Button>
                  <Button
                    className='join-item'
                    color='btn-secondary'
                    icon={ReloadIcon}
                    label={ReloadText}
                    type='button'
                    onClick={() => window.location.reload()}
                    disabled={isSubmitting}
                  ></Button>
                  <Button
                    className='join-item'
                    color='btn-success'
                    icon={!isSubmitting ? CheckIcon : ''}
                    isLoading={isSubmitting}
                    label={!isSubmitting ? GenerateText : GeneratingText}
                    type='submit'
                    disabled={
                      isSubmitting ||
                      !hasAbilities(authStore?.abilityKeys, ['sys:admin', 'report:sales'])
                    }
                  ></Button>
                </div>
              </div>
            </form>
          )}
          {!loading && report && (
            <div className='grid grid-cols-1 md:grid-cols-3'>
              <div className='col-span-full'>
                <h1 className='text-center text-2xl font-bold mb-2'>{`${ReportTypeText}: ${resolveReportType(report.reportType)} - ${formatReportDate(report.reportType, report.date.toString()).toUpperCase()}`}</h1>
              </div>
              <div className='flex flex-col items-center'>
                <h1 className='text-md uppercase font-semibold'>{SalesByPaymentTypeText}</h1>
                <div className='w-80 h-80'>
                  <PaymentTypesChart data={charts.paymentChart.data}></PaymentTypesChart>
                </div>
              </div>
              <div className='flex flex-col items-center'>
                <h1 className='text-md uppercase font-semibold'>{AverageValuesText}</h1>
                <div className='w-80 h-80'>
                  <AverageSaleChart data={charts.averagesChart.data}></AverageSaleChart>
                </div>
              </div>
              <div className='flex flex-col items-center'>
                <h1 className='text-md uppercase font-semibold'>{SalesByVoucherTypeText}</h1>
                <div className='w-80 h-80'>
                  <VoucherTypesChart data={charts.voucherChart.data}></VoucherTypesChart>
                </div>
              </div>

              <div className='col-span-full mt-2'>
                <Table
                  columns={summaryColumns}
                  data={summaryData}
                  showActions={false}
                  size='table-sm'
                />
              </div>

              <div className='col-span-full flex flex-col items-center'>
                <div className='join join-vertical md:join-horizontal mt-3'>
                  <Button
                    className='join-item'
                    color='btn-error'
                    label={GoBackText}
                    onClick={() => window.history.back()}
                    icon={GoBackIcon}
                  ></Button>
                  <Button
                    className='join-item'
                    color='btn-success'
                    icon={ChartUpIcon}
                    title={GoToBestSaleText.toUpperCase()}
                    disabled={!report.highestSale?.id}
                    onClick={() => navigate(`/dashboard/sale/${report.highestSale.id}`)}
                  ></Button>
                  <Button
                    className='join-item'
                    color='btn-info'
                    icon={ChartDownIcon}
                    title={GoToWorstSaleText.toUpperCase()}
                    disabled={!report.lowestSale?.id}
                    onClick={() => navigate(`/dashboard/sale/${report.lowestSale.id}`)}
                  ></Button>
                  <Button
                    className='join-item'
                    color='btn-secondary'
                    icon={ReloadIcon}
                    label={ReloadText}
                    onClick={() => resetReport()}
                  ></Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
