// components/promo.tsx
"use client"

import Image from "next/image"
import { useTransform, motion, MotionValue } from "framer-motion"
import { useRef, useState, useEffect } from "react"

export default function Section({ scrollY }: { scrollY: MotionValue<number> }) {
    
    const container = useRef<HTMLDivElement>(null) 

    const [elementTop, setElementTop] = useState(0)
    const [elementHeight, setElementHeight] = useState(0)
    const [screenHeight, setScreenHeight] = useState(0)

    useEffect(() => {
        if (container.current) {
            setElementTop(container.current.offsetTop)
            setElementHeight(container.current.clientHeight)
        }
        setScreenHeight(window.innerHeight)
    }, [container]) 

    const start = elementTop - screenHeight
    const end = elementTop + elementHeight

    const scrollYProgress = useTransform(
        scrollY,
        [start, end], 
        [0, 1]        
    )

    const y = useTransform(scrollYProgress, [0, 1], ["-10vh", "10vh"])

    return (
        <div
            ref={container}
            className="relative flex items-center justify-center h-screen overflow-hidden"
            style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
        >
            <div className="fixed top-[-10vh] left-0 h-[120vh] w-full">
                <motion.div style={{ y }} className="relative w-full h-full">
                    
                    {/* Imagen de fondo nítida */}
                    <Image 
                        src="/images/aconcagua-night.png" 
                        fill 
                        alt="Carretera de noche" 
                        style={{ objectFit: "cover" }}
                    />
                </motion.div>
            </div>

            {/* Título (ya responsivo) */}
            <h3 className="absolute top-8 md:top-12 left-1/2 -translate-x-1/2 z-20 text-white text-lg sm:text-xl md:text-3xl lg:text-5xl font-extrabold uppercase text-center">
                Misión / Visión
            </h3>

            {/* Padding (ya responsivo) */}
            <div className="relative z-10 p-4 sm:p-6 md:p-12 text-white max-w-7xl w-full">
                
                <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-xl z-0 shadow-2xl"></div>

                {/* Contenedor (ya responsivo) */}
                <div className="relative z-10 flex flex-col md:flex-row justify-center items-start gap-8 md:gap-12">
                    
                    {/* Sección MISIÓN (Izquierda) */}
                    {/* 🔴 CAMBIO CLAVE: 'pr-6' ahora es 'md:pr-6' */}
                    <div className="flex-1 max-w-xl md:pr-6 py-4">
                        {/* Título (ya responsivo) */}
                        <h4 className="text-2xl md:text-4xl font-bold mb-4 uppercase">Misión</h4>
                        <p className="text-base md:text-lg leading-relaxed">
En SSGL brindamos servicios de mantención vial y aseo industrial de alta calidad, comprometidos con la satisfacción de nuestros clientes mediante soluciones innovadoras, personal calificado y una gestión responsable que prioriza la seguridad, la eficiencia operativa y el respeto por el medio ambiente, contribuyendo activamente al desarrollo, conservación y mejora continua de la infraestructura vial del país                        </p>
                    </div>

                    {/* Separador Vertical (ya responsivo) */}
                    <div className="hidden md:block border-l-2 border-white h-60"></div>

                    {/* Sección VISIÓN (Derecha) */}
                    {/* 🔴 CAMBIO CLAVE: 'pl-6' ahora es 'md:pl-6' */}
                    <div className="flex-1 max-w-xl md:pl-6 py-4">
                        {/* Título (ya responsivo) */}
                        <h4 className="text-2xl md:text-4xl font-bold mb-4 uppercase">Visión</h4>
                        <p className="text-base md:text-lg leading-relaxed">
Ser reconocidos a nivel nacional como una empresa líder en mantención vial y aseo industrial, destacando por la excelencia en la ejecución de nuestros servicios, la innovación constante, la sostenibilidad de nuestras operaciones y el compromiso de nuestro equipo humano, consolidando nuestra posición como un socio estratégico clave en la gestión y preservación de la infraestructura pública y privada del país                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}