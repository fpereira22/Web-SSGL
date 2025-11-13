"use client"

import { useEffect } from "react"
import Lenis from "@studio-freight/lenis"
import Hero from "@/components/hero"
import Featured from "@/components/featured"
import Promo from "@/components/promo"
import Footer from "@/components/footer"

// 1. Importa useMotionValue
import { useMotionValue } from "framer-motion"

export default function Home() {
  
  // 2. Crea un MotionValue para rastrear los píxeles de scroll
  const scrollY = useMotionValue(0)

  useEffect(() => {
    const lenis = new Lenis()

    // 3. Sincroniza el scroll de Lenis con el MotionValue
    lenis.on('scroll', (e) => {
      scrollY.set(e.animatedScroll)
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Buena práctica: limpiar Lenis cuando el componente se desmonte
    return () => {
      lenis.destroy()
    }
  }, [scrollY]) // 4. Añade scrollY como dependencia

  return (
    <main>
      {/* 5. Pasa el MotionValue (scrollY) a los componentes hijos */}
      <Hero scrollY={scrollY} />
      <Featured />
      <Promo scrollY={scrollY} />
      <Footer />
    </main>
  )
}