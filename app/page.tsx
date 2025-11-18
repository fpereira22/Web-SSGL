// page.tsx
"use client"

import { useEffect } from "react"
import Lenis from "@studio-freight/lenis"
import Hero from "@/components/hero"
import Featured from "@/components/featured"
import Promo from "@/components/promo"
import Footer from "@/components/footer"
import Carousel from "@/components/Carousel" 

import { useMotionValue } from "framer-motion"

export default function Home() {
  
  const scrollY = useMotionValue(0)

  useEffect(() => {
    const lenis = new Lenis()

    lenis.on('scroll', (e) => {
      scrollY.set(e.animatedScroll)
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [scrollY])

  return (
    <main>
      {/* 1. Hero 
          🔴 CAMBIO CLAVE: Se elimina la prop scrollY en Hero */}
      <Hero /> 

      {/* 2. Promo */}
      <Promo scrollY={scrollY} />

      {/* 3. Featured */}
      <Featured />

      {/* 🔴 NUEVA SECCIÓN: Galería de Carrusel */}
      <Carousel /> 

      {/* 4. Footer */}
      <Footer />
    </main>
  )
}