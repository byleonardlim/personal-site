'use client';

import { useEffect, useRef, useState, PropsWithChildren, useLayoutEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';

interface DrawerShellProps {
  titleId?: string;
  titleText?: string;
  closeHref?: string;
}

export default function DrawerShell({
  children,
  titleId = 'drawer-title',
  titleText = 'Dialog',
  closeHref = '/',
}: PropsWithChildren<DrawerShellProps>) {
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const backdropRef = useRef<HTMLButtonElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const reducedMotionRef = useRef<boolean>(false);
  const closingRef = useRef<boolean>(false);

  // Touch swipe-to-close state
  const startXRef = useRef<number | null>(null);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);

  const navigateHome = useCallback(() => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
      return;
    }
    router.push(closeHref, { scroll: false });
  }, [router, closeHref]);

  const close = useCallback(async () => {
    if (closingRef.current) return;
    closingRef.current = true;
    if (reducedMotionRef.current) {
      navigateHome();
      return;
    }
    if (backdropRef.current) (backdropRef.current as HTMLElement).style.pointerEvents = 'none';
    if (panelRef.current) (panelRef.current as HTMLElement).style.pointerEvents = 'none';
    if (panelRef.current) panelRef.current.style.transform = '';
    const tl = gsap.timeline({ defaults: { duration: 0.2 } });
    tl.to(backdropRef.current, { opacity: 0, ease: 'power1.out' }, 0);
    tl.to(panelRef.current, { xPercent: 100, ease: 'power2.in' }, 0);
    tl.eventCallback('onComplete', () => {
      closingRef.current = false;
      navigateHome();
    });
  }, [navigateHome]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
      if (e.key === 'Tab' && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        const list = Array.from(focusables).filter(el => !el.hasAttribute('disabled'));
        if (list.length === 0) return;
        const first = list[0];
        const last = list[list.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey) {
          if (active === first || !panelRef.current?.contains(active)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (active === last || !panelRef.current?.contains(active)) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    document.addEventListener('keydown', onKey);
    const onExternalClose = () => close();
    window.addEventListener('drawer:close', onExternalClose as EventListener);
    return () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('drawer:close', onExternalClose as EventListener);
    };
  }, [close]);

  // Prevent background scroll while the drawer is open
  useEffect(() => {
    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = 'hidden';
    return () => {
      body.style.overflow = previousOverflow;
    };
  }, []);

  // Inert + aria-hidden background while drawer is mounted, but keep exempt elements interactive
  useEffect(() => {
    const overlayEl = rootRef.current;
    if (!overlayEl) return;
    const siblings = Array.from(document.body.children).filter(
      el => el !== overlayEl && !el.hasAttribute('data-drawer-exempt')
    );
    const prev: Array<{ el: Element; ariaHidden: string | null; inert: boolean; pointer: string }> = siblings.map(
      el => ({
        el,
        ariaHidden: el.getAttribute('aria-hidden'),
        inert: ((el as HTMLElement & { inert?: boolean }).inert === true),
        pointer: (el as HTMLElement).style.pointerEvents,
      })
    );
    siblings.forEach(el => {
      el.setAttribute('aria-hidden', 'true');
      (el as HTMLElement & { inert?: boolean }).inert = true;
      (el as HTMLElement).style.pointerEvents = 'none';
    });
    return () => {
      prev.forEach(({ el, ariaHidden, inert, pointer }) => {
        if (ariaHidden === null) el.removeAttribute('aria-hidden'); else el.setAttribute('aria-hidden', ariaHidden);
        (el as HTMLElement & { inert?: boolean }).inert = inert;
        (el as HTMLElement).style.pointerEvents = pointer;
      });
    };
  }, []);

  useEffect(() => {
    const to = setTimeout(() => {
      const el = panelRef.current?.querySelector<HTMLElement>('[data-autofocus]') || panelRef.current;
      el?.focus();
    }, 0);
    return () => clearTimeout(to);
  }, []);

  // GSAP animations
  useLayoutEffect(() => {
    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!panelRef.current || !backdropRef.current) return;
    if (reducedMotionRef.current) {
      backdropRef.current.style.opacity = '0.3';
      panelRef.current.style.transform = 'translateX(0)';
      return;
    }
    // Clear any inline transform before GSAP controls it
    panelRef.current.style.transform = '';
    panelRef.current.style.willChange = 'transform';
    backdropRef.current.style.willChange = 'opacity';
    const tl = gsap.timeline({ defaults: { duration: 0.3, ease: 'power2.out' } });
    tl.set(panelRef.current, { xPercent: 100 });
    tl.set(backdropRef.current, { opacity: 0 });
    tl.to(backdropRef.current, { opacity: 0.3 }, 0);
    tl.to(panelRef.current, { xPercent: 0 }, 0);
    tlRef.current = tl;
    const panelEl = panelRef.current;
    const backdropEl = backdropRef.current;
    return () => {
      if (tlRef.current) {
        tlRef.current.kill();
        tlRef.current = null;
      }
      if (panelEl) panelEl.style.willChange = '';
      if (backdropEl) backdropEl.style.willChange = '';
    };
  }, []);

  // Touch handlers for swipe-to-close
  const onTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    setDragging(true);
    if (tlRef.current && !reducedMotionRef.current) {
      tlRef.current.pause();
    }
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (startXRef.current == null) return;
    const dx = e.touches[0].clientX - startXRef.current;
    if (dx > 0) setDragX(dx > 480 ? 480 : dx);
  };
  const onTouchEnd = () => {
    const threshold = 80;
    if (dragX > threshold) {
      (async () => {
        if (reducedMotionRef.current) {
          navigateHome();
          return;
        }
        closingRef.current = true;
        if (backdropRef.current) (backdropRef.current as HTMLElement).style.pointerEvents = 'none';
        if (panelRef.current) (panelRef.current as HTMLElement).style.pointerEvents = 'none';
        const tl = gsap.timeline({ defaults: { duration: 0.2 } });
        tl.to(backdropRef.current, { opacity: 0, ease: 'power1.out' }, 0);
        tl.to(panelRef.current, { xPercent: 100, ease: 'power2.in' }, 0);
        await tl;
        navigateHome();
      })();
    } else {
      (async () => {
        if (reducedMotionRef.current) {
          setDragX(0);
          return;
        }
        if (panelRef.current) {
          await gsap.to(panelRef.current, { x: 0, xPercent: 0, duration: 0.2, ease: 'power2.out' });
        }
        setDragX(0);
        if (tlRef.current) tlRef.current.play();
      })();
    }
    setDragging(false);
    startXRef.current = null;
  };

  return (
    <div ref={rootRef} className="fixed inset-0 z-50" aria-labelledby={titleId} role="dialog" aria-modal="true">
      <button
        ref={backdropRef}
        aria-label="Close"
        onClick={close}
        className={`fixed inset-0 z-50 bg-black outline-none`}
        style={{ opacity: 0 }}
      />

      <div
        ref={panelRef}
        tabIndex={-1}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className={`fixed right-0 top-0 z-[60] h-full w-full max-w-full lg:max-w-[50vw] bg-white dark:bg-neutral-900 shadow-xl overflow-y-auto outline-none`}
        style={dragging && dragX > 0 ? { transform: `translateX(${dragX}px)` } : undefined}
      >
        <h2 id={titleId} className="sr-only">{titleText}</h2>
        <div className="px-2 py-4">{children}</div>
      </div>
    </div>
  );
}
