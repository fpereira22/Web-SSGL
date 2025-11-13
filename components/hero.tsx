"use client"
import Image from "next/image"
// 1. QUITA 'useScroll' y añade 'MotionValue'
import { useTransform, motion, MotionValue } from "framer-motion"
// 2. QUITA 'useRef' y añade 'useState', 'useEffect'
import { useState, useEffect } from "react"
import Header from "./header"

// 3. Acepta 'scrollY' como prop
export default function Hero({ scrollY }: { scrollY: MotionValue<number> }) {
  
  // 4. Recrea la animación 'y' basándote en 'scrollY' (píxeles)
  // Necesitamos la altura de la pantalla para replicar el 'scrollYProgress'
  const [screenHeight, setScreenHeight] = useState(0)

  useEffect(() => {
    // Obtenemos la altura de la pantalla solo en el cliente
    setScreenHeight(window.innerHeight)
  }, [])

  // 5. Transforma 'scrollY' (en píxeles) a 'vh'
  // El original era [0, 1] -> ["0vh", "150vh"] sobre un scroll de 100vh
  // Así que [0, screenHeight] -> ["0vh", "150vh"]
  const y = useTransform(
    scrollY,
    [0, screenHeight], // Rango de entrada (píxeles de scroll)
    ["0vh", "150vh"]  // Rango de salida (movimiento)
  )

  return (
    <div className="h-screen overflow-hidden">
      <Header />
      <motion.div style={{ y }} className="relative h-full">
        <Image
          src="/images/hero2.png"
          fill
          alt="Freeway background"
          style={{ objectFit: "cover" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>

        <div className="absolute inset-0 flex items-center justify-start z-10">
          <div className="text-left max-w-3xl px-6">
            
            {/* Título: Quitar borde y usar texto blanco simple */}
            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight text-white">
              Sociedad de Servicios Generales LTDA
            </h1>
            
            {/* Párrafo: Quitar borde y usar texto blanco simple */}
            <p className="text-sm md:text-base leading-relaxed mb-8 text-white"> 
              Líderes en servicios viales a escala nacional conectando al país!
              Somos especialistas en mantención vial y asistencia al usuario en las autopistas más importantes de Chile. Nuestra misión es garantizar la fluidez y seguridad de las rutas, asegurando la excelencia en la conservación de cada concesión y la total satisfacción de nuestros clientes
            </p>
            
          </div>
        </div>
      </motion.div>
    </div>
  )
}