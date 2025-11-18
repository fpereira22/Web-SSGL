// components/Carousel.tsx
"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

// 🔴 MODIFICACIÓN: Rutas actualizadas a 9 imágenes en formato .webp
const images = [
  "/carousel/image1.webp",
  "/carousel/image2.webp",
  "/carousel/image3.webp",
  "/carousel/image4.webp",
  "/carousel/image5.webp",
  "/carousel/image6.webp", // Nueva imagen 6
  "/carousel/image7.webp", // Nueva imagen 7
  "/carousel/image8.webp", // Nueva imagen 8
  "/carousel/image9.webp", // Nueva imagen 9
  "/carousel/image10.webp", // Nueva imagen 9
  "/carousel/image11.webp", // Nueva imagen 9
  "/carousel/image12.webp", // Nueva imagen 9
  "/carousel/image13.webp", // Nueva imagen 9
  "/carousel/image14.webp", // Nueva imagen 9
  "/carousel/image15.webp", // Nueva imagen 9
  "/carousel/image16.webp", // Nueva imagen 9
  "/carousel/image17.webp", // Nueva imagen 9
  // "/carousel/image18.webp", // Nueva imagen 9
  // "/carousel/image19.webp", // Nueva imagen 9
  // "/carousel/image20.webp", // Nueva imagen 9
  // "/carousel/image21.webp", // Nueva imagen 9
]

// --- Configuraciones de Animación (Variants) ---
const variants = {
  // Estado para la imagen que está muy a la izquierda (oculta o casi oculta)
  hidden: (direction: number) => ({
    x: direction > 0 ? "-200%" : "200%", // Se mueve fuera del rango
    scale: 0.5,
    opacity: 0,
    filter: "blur(10px)",
    zIndex: 0,
    // 🟢 Duración de la transición es 0.2s
    transition: { duration: 0.2 }, 
  }),
  // Estado para la imagen anterior (izquierda)
  prev: {
    x: "-50%",
    scale: 0.8,
    opacity: 0.7,
    filter: "blur(4px)",
    zIndex: 10,
    // 🟢 Duración de la transición es 0.2s
    transition: { duration: 0.2 }, 
  },
  // Estado para la imagen central (actual)
  center: {
    x: "0%",
    scale: 1,
    opacity: 1,
    filter: "blur(0px)",
    zIndex: 20,
    // 🟢 Duración de la transición es 0.2s
    transition: { duration: 0.2 }, 
  },
  // Estado para la imagen siguiente (derecha)
  next: {
    x: "50%",
    scale: 0.8,
    opacity: 0.7,
    filter: "blur(4px)",
    zIndex: 10,
    // 🟢 Duración de la transición es 0.2s
    transition: { duration: 0.2 }, 
  },
}

// --- Función para obtener el estado de posición de la imagen (Sin cambios) ---
const getPosition = (i: number, currentIndex: number, arrayLength: number) => {
  if (i === currentIndex) return "center"
  
  const prevIndex = (currentIndex - 1 + arrayLength) % arrayLength
  const nextIndex = (currentIndex + 1) % arrayLength

  if (i === prevIndex) return "prev"
  if (i === nextIndex) return "next"

  return "hidden"
}


export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0) 

  const paginate = (newDirection: number) => {
    setDirection(newDirection)
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex + newDirection + images.length) % images.length
      return newIndex
    })
  }

  return (
    // CAMBIO: Padding vertical ajustado (py-16)
    <div className="min-h-screen py-16 lg:py-20 flex flex-col items-center bg-gray-900">
      
      {/* CAMBIO: Título más pequeño (text-3xl) y menos margen (mb-12) en móvil */}
      <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold uppercase mb-12 md:mb-16 text-white text-center">
        Galería de Imágenes
      </h2>

      {/* Contenedor del Carrusel */}
      <div className="relative w-full max-w-5xl h-[400px] md:h-[600px] flex items-center justify-center overflow-hidden">
        
        {/* --- IMÁGENES DEL CARRUSEL --- */}
        {images.map((src, i) => {
          const position = getPosition(i, currentIndex, images.length)
          const isGlassmorphism = position === "prev" || position === "next"
          
          return (
            <AnimatePresence initial={false} key={src} custom={direction}>
                <motion.div
                  // 🟢 Duración de la transición es 'duration-200'
                  className={`absolute w-[80%] h-full rounded-xl overflow-hidden cursor-pointer shadow-2xl transition-all duration-200 ease-in-out ${isGlassmorphism ? "bg-white/10 backdrop-blur-sm" : "bg-transparent"}`}
                  key={src}
                  custom={direction}
                  variants={variants}
                  initial={position === "center" ? "center" : direction > 0 ? "hidden" : "hidden"}
                  animate={position}
                  exit={position === "center" ? (direction > 0 ? "hidden" : "hidden") : position}
                >
                  <Image
                    src={src}
                    alt={`Galería Imagen ${i + 1}`}
                    fill
                    style={{ objectFit: "cover" }}
                    // 🟢 Duración de la transición es 'duration-200'
                    sizes="(max-width: 768px) 80vw, 900px" 
                    className={`transition-all duration-200 ease-in-out ${isGlassmorphism ? "opacity-50" : "opacity-100"}`}
                  />
                </motion.div>
            </AnimatePresence>
          )
        })}

        {/* --- CONTROLES DE NAVEGACIÓN (Flechas) --- */}
        <button
          // CAMBIO: Padding (p-2) y posición (left-2) ajustados en móvil
          className="absolute left-2 sm:left-4 z-30 p-2 sm:p-3 bg-white/30 backdrop-blur-sm rounded-full text-white hover:bg-white/50 transition-colors"
          onClick={() => paginate(-1)}
          aria-label="Imagen anterior"
        >
          {/* CAMBIO: Se usa className para tamaño responsivo (h-6 w-6) en lugar de 'size' */}
          <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
        </button>
        <button
          // CAMBIO: Padding (p-2) y posición (right-2) ajustados en móvil
          className="absolute right-2 sm:right-4 z-30 p-2 sm:p-3 bg-white/30 backdrop-blur-sm rounded-full text-white hover:bg-white/50 transition-colors"
          onClick={() => paginate(1)}
          aria-label="Imagen siguiente"
        >
          {/* CAMBIO: Se usa className para tamaño responsivo (h-6 w-6) en lugar de 'size' */}
          <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
        </button>
      </div>
    </div>
  )
}