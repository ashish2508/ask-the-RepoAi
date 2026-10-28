"use client";

import { Loader2 } from "lucide-react";
import Link, { type LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { useState } from "react";

import { cn } from "@/lib/utils";

type LoadingLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    children: ReactNode;
    loadingLabel?: string;
  };

export function LoadingLink({
  children,
  className,
  loadingLabel = "Opening…",
  onClick,
  ...props
}: LoadingLinkProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      props.target === "_blank" ||
      pending
    ) {
      return;
    }

    event.preventDefault();
    setPending(true);
    router.push(String(props.href));
  }

  return (
    <Link
      {...props}
      aria-busy={pending || undefined}
      className={cn(className, pending && "pointer-events-none")}
      onClick={handleClick}
    >
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          <span>{loadingLabel}</span>
        </>
      ) : (
        children
      )}
    </Link>
  );
}
