// components/header.tsx
"use client" // Asegúrate de que esta línea esté si usas hooks o eventos, aunque aquí no es estrictamente necesaria, es buena práctica mantenerla si estaba.

import Link from "next/link"
import Image from "next/image"

export default function Header() {
  return (
    // CAMBIO: Padding reducido en móvil (p-4) y se mantiene en md (md:p-6)
    <header className="absolute top-0 left-0 right-0 z-50 p-4 md:p-6"> 
      <div className="flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logovertical.png" 
            alt="Logo SSGL"
            // CAMBIO: Tamaño base más pequeño para móvil
            width={180} 
            height={60}
            // CAMBIO: Aumenta el tamaño en pantallas medianas
            className="object-contain w-[180px] h-[60px] md:w-[240px] md:h-[80px]"
            priority
          />
        </Link>

        <nav className="flex gap-8">
          <Link
            href="https://intranet.ssgl.cl"
            // CAMBIO: Texto ligeramente más pequeño en móvil (text-xs)
            className="text-white hover:text-neutral-400 transition-colors duration-300 uppercase text-xs sm:text-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            Portal Empleados
          </Link>
        </nav>
      </div>
    </header>
  )
}