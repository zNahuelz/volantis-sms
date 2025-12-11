import { useMatches } from 'react-router';
import { useEffect } from 'react';

export function TitleSync() {
  const matches = useMatches();

  const matchWithTitle = [...matches].reverse().find((m) => m.handle?.title);
  const title = matchWithTitle?.handle?.title;

  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);

  return null;
}
