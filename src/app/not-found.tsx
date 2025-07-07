"use client"
import { usePathname } from "next/navigation"


export default function NotFound({}) {
  const path = usePathname()
  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-center font-medium text-xl">
        The requested page <code>{path}</code> does not exsits
      </p>
    </div>
  )
}
