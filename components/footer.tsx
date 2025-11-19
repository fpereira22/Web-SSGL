// components/footer.tsx
import Link from "next/link"
import { Instagram, Linkedin, Mail, Twitter, ShieldAlert } from "lucide-react"

export default function Footer() {
    
  const socialLinks = {
    linkedin: "https://www.linkedin.com/company/soc-servicios-generales-ltda",
    x: "https://x.com/SSGL_CL", 
    instagram: "https://www.instagram.com/tuempresa/",
    denuncias: "/denuncias", 
    email: "mailto:contacto@ssgl.cl",
  }

  return (
    <footer className="bg-neutral-900 py-8 sm:py-12 px-4 sm:px-6 w-full"> 
        
        {/* 🟢 MODIFICACIÓN 1: Usamos max-w-7xl y mx-auto para el padding lateral. */}
        {/* 🟢 MODIFICACIÓN 2: Usamos grid para alinear el bloque de contacto a la izquierda */}
        <div className="max-w-7xl mx-auto flex flex-col justify-between">
            
            {/* Bloque Superior: Contacto y Redes */}
            {/* 🟢 MODIFICACIÓN 3: En lugar de flex con gap, usamos un grid en md para que se alinee a la izquierda y use el espacio. */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 lg:gap-20">
              
              {/* Columna de Contacto (Va a la Izquierda) */}
              <div className="flex flex-col gap-1 sm:gap-2">
                <h3 className="mb-1 sm:mb-2 uppercase text-neutral-400 text-xs sm:text-sm">Contacto</h3>
                
                <a
                  href={socialLinks.email}
                  className="text-white hover:text-neutral-400 transition-colors duration-300 text-sm sm:text-base flex items-center gap-2"
                >
                  <Mail size={16} /> contacto@ssgl.cl
                </a>
                
                <Link
                  href={socialLinks.denuncias}
                  className="text-white hover:text-neutral-400 transition-colors duration-300 text-sm sm:text-base flex items-center gap-2"
                >
                  <ShieldAlert size={16} /> Centro de Denuncias
                </Link>
                
                {/* Contenedor de Redes Sociales */}
                <div className="flex gap-4 mt-3">
                    <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn SSGL"
                       className="text-white hover:text-blue-500 transition-colors duration-300"
                    >
                        <Linkedin size={24} />
                    </a>
                    <a href={socialLinks.x} target="_blank" rel="noopener noreferrer" aria-label="X (Twitter) SSGL"
                       className="text-white hover:text-neutral-400 transition-colors duration-300"
                    >
                        <Twitter size={24} />
                    </a>
                    <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram SSGL"
                       className="text-white hover:text-pink-500 transition-colors duration-300"
                    >
                        <Instagram size={24} />
                    </a>
                </div>
              </div>
              
              {/* La segunda columna del grid queda vacía en md:grid-cols-2, empujando el contenido a la izquierda. */}
            </div>

            {/* Separador */}
            <hr className="border-neutral-700 my-6" />

            {/* Bloque Inferior: Logo y Copyright */}
            {/* 🟢 MODIFICACIÓN 4: flex justify-between asegura que el logo y el copyright se separen a los extremos. */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
              <h1 className="text-xl sm:text-2xl text-white font-bold tracking-tight">
                SSGL.CL
              </h1>
              <p className="text-white text-sm sm:text-base">© SSGL Departamento I+D - 2025 - Todos los derechos reservados</p>
            </div>
        </div>
    </footer>
  )
}