// components/footer.tsx
import Link from "next/link"
import { Instagram, Linkedin, Mail, Twitter, ShieldAlert } from "lucide-react"

export default function Footer() {
    
  // URLs de ejemplo (reemplaza con las reales)
  const socialLinks = {
    linkedin: "https://www.linkedin.com/company/soc-servicios-generales-ltda",
    x: "https://x.com/SSGL_CL", // Usamos 'X' (antes Twitter)
    instagram: "https://www.instagram.com/tuempresa/",
    denuncias: "/denuncias", // 🔴 CAMBIO: Ruta a la nueva página de denuncias
    email: "mailto:contacto@ssgl.cl",
  }

  return (
    <div
      className="relative h-[300px] sm:h-[400px] lg:h-[500px] max-h-[500px]" 
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className="relative h-[calc(100vh+300px)] sm:h-[calc(100vh+400px)] lg:h-[calc(100vh+500px)] -top-[100vh]">
        
        <div className="h-[300px] sm:h-[400px] lg:h-[500px] sticky top-[calc(100vh-300px)] sm:top-[calc(100vh-400px)] lg:top-[calc(100vh-500px)]">
          
          <div className="bg-neutral-900 py-4 sm:py-6 lg:py-8 px-4 sm:px-6 h-full w-full flex flex-col justify-between">
            
            {/* 🔴 CAMBIO CLAVE: Este contenedor solo contendrá la columna "Contacto" */}
            <div className="flex shrink-0 gap-8 sm:gap-12 lg:gap-20">
              
              {/* Columna de Contacto (ÚNICA) */}
              <div className="flex flex-col gap-1 sm:gap-2">
                <h3 className="mb-1 sm:mb-2 uppercase text-neutral-400 text-xs sm:text-sm">Contacto</h3>
                
                {/* Email de Contacto (mailto) */}
                <a
                  href={socialLinks.email}
                  className="text-white hover:text-neutral-400 transition-colors duration-300 text-sm sm:text-base flex items-center gap-2"
                >
                  <Mail size={16} /> contacto@ssgl.cl
                </a>
                
                {/* Centro de Denuncias */}
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
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-0">
              <h1 className="text-[14vw] sm:text-[12vw] lg:text-[10vw] leading-[0.9] mt-2 sm:mt-4 lg:mt-8 text-white font-bold tracking-tight">
                SSGL.CL
              </h1>
              <p className="text-white text-sm sm:text-base">© SSGL Departamento I+D - 2025 - Todos los derechos reservados</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}