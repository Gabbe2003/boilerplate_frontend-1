"use client"

import Image, { type ImageProps } from "next/image"
import { useState, useEffect } from "react"
import clsx from "clsx"

type Props = ImageProps

export default function ImageWithFallback({ src, alt, className, ...props }: Props) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setHasError(false)
  }, [src])

  if (hasError) {
    if ('fill' in props && props.fill) {
      return (
        <div className={clsx("absolute inset-0 bg-gray-200 rounded-[16px]", className)} />
      )
    }

    return (
      <div
        className={clsx(
          "bg-gray-200 rounded-[16px]",
          className
        )}
        style={{
          width: props.width,
          height: props.height,
        }}
      />
    )
  }

  return (
    <Image
      {...props}
      className={className}
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
    />
  )
}
