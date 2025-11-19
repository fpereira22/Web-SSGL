// components/header.tsx
"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation" 

export default function Header() {
  // Obtener la ruta actual
  const pathname = usePathname()
  
  // 1. Definir la ruta base para el centro de denuncias
  const denunciaPath = '/denuncias' 
  
  // 2. Determinar si estamos en el centro de denuncias
  const isInDenuncia = pathname.includes(denunciaPath)

  // 3. Seleccionar la fuente de la imagen dinámicamente
  // (Asumo que /logovertical2.png es la versión de logo para el fondo claro de /denuncias)
  const logoSrc = isInDenuncia ? "/logovertical2.png" : "/logovertical.png"
  
  // 4. Seleccionar el color del texto de navegación
  const navTextColor = isInDenuncia ? 'text-black dark:text-white' : 'text-white'


  return (
    <header className="absolute top-0 left-0 right-0 z-50 p-4 md:p-6"> 
      <div className="flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={logoSrc} 
            alt="Logo SSGL"
            width={180} 
            height={60}
            className="object-contain w-[180px] h-[60px] md:w-[240px] md:h-[80px]"
            priority
          />
        </Link>

        {/* 🟢 MODIFICACIÓN CLAVE: Solo mostrar el <nav> si NO estamos en la ruta de denuncias */}
        {!isInDenuncia && (
            <nav className="flex gap-8">
              <Link
                href="https://intranet.ssgl.cl"
                className={`${navTextColor} hover:text-neutral-400 transition-colors duration-300 uppercase text-xs sm:text-sm`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Portal Empleados
              </Link>
            </nav>
        )}
      </div>
    </header>
  )
}