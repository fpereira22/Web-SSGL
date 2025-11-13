import Link from "next/link"
import Image from "next/image"

export default function Header() {
  return (
    // CORRECCIÓN: z-index cambiado a z-50 para asegurar que el link sea clickeable.
    <header className="absolute top-0 left-0 right-0 z-50 p-6"> 
      <div className="flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logovertical.png" // ruta del logo (guárdalo en /public)
            alt="Logo SSGL"
            width={240} // ajusta el tamaño a gusto
            height={80}
            className="object-contain"
            priority
          />
        </Link>

        <nav className="flex gap-8">
          <Link
            href="https://intranet.ssgl.cl"
            className="text-white hover:text-neutral-400 transition-colors duration-300 uppercase text-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            PortalEmpleados
          </Link>
        </nav>
      </div>
    </header>
  )
}