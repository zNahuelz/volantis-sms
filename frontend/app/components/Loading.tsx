import { LoadingText } from '~/constants/strings';

export default function Loading({ loadMessage = LoadingText }: { loadMessage?: string }) {
  return (
    <div className='flex min-h-[200px] flex-col items-center justify-center py-10'>
      <span className='loading loading-dots text-primary h-20 w-20'></span>
      <h1 className='mt-4 text-2xl font-thin'>{loadMessage}</h1>
    </div>
  );
}
