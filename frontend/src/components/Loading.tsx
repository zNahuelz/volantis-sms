import { LoadingText } from '~/constants/strings';

interface Props {
  loadMessage?: string;
  color?:
    | 'text-accent'
    | 'text-primary'
    | 'text-secondary'
    | 'text-success'
    | 'text-neutral'
    | 'text-error'
    | 'text-warning'
    | 'text-info';
}

export default function Loading({ loadMessage = LoadingText, color = 'text-primary' }: Props) {
  return (
    <div className='flex min-h-[200px] flex-col items-center justify-center py-10'>
      <span className={`loading loading-dots ${color ?? 'text-primary'} h-20 w-20`}></span>
      <h1 className='mt-4 text-2xl font-thin text-center'>{loadMessage}</h1>
    </div>
  );
}
