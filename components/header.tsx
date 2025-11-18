// components/header.tsx
"use client"

import Link from "next/link"
import Image from "next/image"
// 🟢 Importar usePathname para saber la ruta actual
import { usePathname } from "next/navigation" 

export default function Header() {
  // 🟢 Obtener la ruta actual
  const pathname = usePathname()
  
  // 🟢 1. Definir la ruta base para el centro de denuncias
  const denunciaPath = '/denuncias' 
  
  // 🟢 2. Determinar si estamos en el centro de denuncias
  // Usamos includes para manejar subrutas si las hubiera (ej: /denuncias/paso1)
  const isInDenuncia = pathname.includes(denunciaPath)

  // 🟢 3. Seleccionar la fuente de la imagen
  const logoSrc = isInDenuncia ? "/logovertical2.png" : "/logovertical.png"
  
  // 🟢 4. Opcional: Determinar si el texto de navegación debe ser diferente (ej. si el logo es oscuro, el texto debe ser oscuro)
  // El logo original usa texto blanco, mantendremos el texto blanco por defecto (text-white)
  const navTextColor = isInDenuncia ? 'text-black dark:text-white' : 'text-white'


  return (
    <header className="absolute top-0 left-0 right-0 z-50 p-4 md:p-6"> 
      <div className="flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image
            // 🚨 Usar la fuente de imagen dinámica
            src={logoSrc} 
            alt="Logo SSGL"
            width={180} 
            height={60}
            className="object-contain w-[180px] h-[60px] md:w-[240px] md:h-[80px]"
            priority
          />
        </Link>

        <nav className="flex gap-8">
          <Link
            href="https://intranet.ssgl.cl"
            // 🚨 Usar el color de texto dinámico (Si tu logovertical2 es oscuro, esta clase podría ser text-gray-800)
            className={`${navTextColor} hover:text-neutral-400 transition-colors duration-300 uppercase text-xs sm:text-sm`}
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