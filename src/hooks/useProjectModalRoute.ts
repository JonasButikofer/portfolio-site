import { useCallback, useEffect, useState } from 'react';

const PARAM = 'project';

function readSlugFromLocation(): string | null {
  return new URLSearchParams(window.location.search).get(PARAM);
}

/**
 * Deep-linkable modal routing (SPEC.md §5.3): opening a project pushes
 * ?project=<slug>, loading that URL opens the modal directly, and browser
 * back closes it. Falls back to replaceState when there's no synthetic
 * history entry to pop (e.g. a shared deep link was the first page load),
 * so closing never navigates the visitor away from the site.
 */
export function useProjectModalRoute() {
  const [openSlug, setOpenSlug] = useState<string | null>(() => readSlugFromLocation());

  useEffect(() => {
    const onPopState = () => setOpenSlug(readSlugFromLocation());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const open = useCallback((slug: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set(PARAM, slug);
    window.history.pushState({ portfolioModal: true }, '', url);
    setOpenSlug(slug);
  }, []);

  const close = useCallback(() => {
    const state = window.history.state as { portfolioModal?: boolean } | null;
    if (state?.portfolioModal) {
      window.history.back();
    } else {
      const url = new URL(window.location.href);
      url.searchParams.delete(PARAM);
      window.history.replaceState(null, '', url);
      setOpenSlug(null);
    }
  }, []);

  return { openSlug, open, close };
}
