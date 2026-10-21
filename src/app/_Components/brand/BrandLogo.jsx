"use client";

import Image from "next/image";
import Link from "next/link";

const LOGO = "/brand/zyro-logo.png";
const MARK = "/brand/zyro-mark.png";

/**
 * zyro brand mark / wordmark.
 * Full wordmark on dark chrome; Z-only when compact/collapsed.
 */
export default function BrandLogo({
  href = "/dashboard/statistics",
  compact = false,
  className = "",
  width,
  height,
  priority = false,
}) {
  const src = compact ? MARK : LOGO;
  const w = width ?? (compact ? 32 : 110);
  const h = height ?? (compact ? 32 : 36);

  const img = (
    <Image
      src={src}
      alt="zyro"
      width={w}
      height={h}
      className={`object-contain object-left ${className}`}
      priority={priority}
    />
  );

  if (!href) return img;
  return (
    <Link href={href} className="inline-flex shrink-0 items-center">
      {img}
    </Link>
  );
}

export { LOGO as ZYRO_LOGO, MARK as ZYRO_MARK };
