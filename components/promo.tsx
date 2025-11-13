"use client"

import Image from "next/image"
// 1. QUITA 'useScroll' y añade 'MotionValue'
import { useTransform, motion, MotionValue } from "framer-motion"
// 2. Importa 'useRef', 'useState', 'useEffect'
import { useRef, useState, useEffect } from "react"

// 3. Acepta 'scrollY' como prop
export default function Section({ scrollY }: { scrollY: MotionValue<number> }) {
  
  // 4. Mantenemos el ref para medir el elemento
  const container = useRef<HTMLDivElement>(null) 

  // 5. Recreamos 'scrollYProgress' manualmente
  const [elementTop, setElementTop] = useState(0)
  const [elementHeight, setElementHeight] = useState(0)
  const [screenHeight, setScreenHeight] = useState(0)

  useEffect(() => {
    // Obtenemos las métricas del DOM solo en el cliente
    // Esto se ejecuta después de que el componente se "hidrata"
    if (container.current) {
      setElementTop(container.current.offsetTop)
      setElementHeight(container.current.clientHeight)
    }
    setScreenHeight(window.innerHeight)
  }, [container]) // Depende del ref

  // 6. Recrea el 'offset: ["start end", "end start"]'
  // 'start': Cuando el 'start' (top) del elemento toca el 'end' (bottom) del viewport
  const start = elementTop - screenHeight
  // 'end': Cuando el 'end' (bottom) del elemento toca el 'start' (top) del viewport
  const end = elementTop + elementHeight

  // 7. Crea el 'scrollYProgress' (valor de 0 a 1)
  const scrollYProgress = useTransform(
    scrollY,
    [start, end], // Rango de entrada (píxeles de scroll)
    [0, 1]        // Rango de salida (progreso)
  )

  // 8. Tu animación 'y' ahora funciona
  const y = useTransform(scrollYProgress, [0, 1], ["-10vh", "10vh"])

  return (
    <div
      ref={container} // El ref se queda aquí para medir
      className="relative flex items-center justify-center h-screen overflow-hidden"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className="fixed top-[-10vh] left-0 h-[120vh] w-full">
        <motion.div style={{ y }} className="relative w-full h-full">
          <Image src="/images/spiral-circles.jpg" fill alt="Abstract spiral circles" style={{ objectFit: "cover" }} />
        </motion.div>
      </div>

      <h3 className="absolute top-12 right-6 text-white uppercase z-10 text-sm md:text-base lg:text-lg">
        Anatomy of Possibility
      </h3>

      <p className="absolute bottom-12 right-6 text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-5xl z-10">
        Every section is a frame for your story. Shape it, remix it, and let your content spill into unexpected patterns
        that keep people scrolling.
      </p>
    </div>
  )
}