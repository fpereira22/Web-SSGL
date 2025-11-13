// components/Carousel.tsx
"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Asegúrese de que estas imágenes existan en /public/carousel
const images = [
  "/carousel/image1.png",
  "/carousel/image2.png",
  "/carousel/image3.png",
  "/carousel/image4.png",
  "/carousel/image5.png",
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
    // 🔴 CAMBIO: Duración de la transición reducida a 0.4s
    transition: { duration: 0.4 }, 
  }),
  // Estado para la imagen anterior (izquierda)
  prev: {
    x: "-50%",
    scale: 0.8,
    opacity: 0.7,
    filter: "blur(4px)",
    zIndex: 10,
    // 🔴 CAMBIO: Duración de la transición reducida a 0.4s
    transition: { duration: 0.4 }, 
  },
  // Estado para la imagen central (actual)
  center: {
    x: "0%",
    scale: 1,
    opacity: 1,
    filter: "blur(0px)",
    zIndex: 20,
    // 🔴 CAMBIO: Duración de la transición reducida a 0.4s
    transition: { duration: 0.4 }, 
  },
  // Estado para la imagen siguiente (derecha)
  next: {
    x: "50%",
    scale: 0.8,
    opacity: 0.7,
    filter: "blur(4px)",
    zIndex: 10,
    // 🔴 CAMBIO: Duración de la transición reducida a 0.4s
    transition: { duration: 0.4 }, 
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
        Nuestra Flota y Maquinaria
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
                  // 🔴 CAMBIO: Reducida la duración de la clase 'transition-all' de Tailwind
                  className={`absolute w-[80%] h-full rounded-xl overflow-hidden cursor-pointer shadow-2xl transition-all duration-300 ease-in-out ${isGlassmorphism ? "bg-white/10 backdrop-blur-sm" : "bg-transparent"}`}
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
                    // 🔴 CAMBIO: Reducida la duración de la clase 'transition-all' de Tailwind
                    className={`transition-all duration-300 ease-in-out ${isGlassmorphism ? "opacity-50" : "opacity-100"}`}
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