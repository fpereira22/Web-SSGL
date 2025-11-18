// components/featured.tsx
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

export default function Featured() {
    
    // Estado principal: controla si el mapa ha sido activado por el usuario (clic inicial)
    const [mapActive, setMapActive] = useState(false) 
    
    // Estado: controla si el bloqueo del scroll está ACTIVO (toggle de Ctrl/Cmd)
    const [scrollLockActive, setScrollLockActive] = useState(false) 

    // LÓGICA PARA ESCUCHAR LA TECLA CTRL/CMD (Como interruptor)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Verificamos si es Ctrl (Windows/Linux) o Meta (Cmd en Mac)
            if (e.key === "Control" || e.metaKey) {
                if (mapActive) {
                    // Interruptor (Toggle)
                    setScrollLockActive(prev => !prev) 
                }
            }
        }

        if (mapActive) {
            window.addEventListener('keydown', handleKeyDown)
        } 

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [mapActive]) 

    // La interacción es permitida SOLAMENTE si mapActive es TRUE Y scrollLockActive es FALSE
    const allowMapInteraction = mapActive && !scrollLockActive;

    // Datos de las empresas de las que somos socios/proveedores
    const companies = [
        { name: "Autopista Central", img: "/images/partners/autopista-central.webp", services: ["Conservación Global"] },
        { name: "Autopista Nueva Aconcagua", img: "/images/partners/autopista-aconcagua.webp", services: ["Conservación Global"] },
        { name: "Autopista Nororiente", img: "/images/partners/autopista-nororiente.webp", services: ["Asistencia al Usuario"] },
        { name: "Autopista Litoral Central", img: "/images/partners/autopista-litoral-central.webp", services: ["Asistencia al Usuario"] },
        { name: "Autopista Los Libertadores", img: "/images/partners/autopista-los-libertadores.webp", services: ["Operadores de Grúa", "Aseo de Instalaciones"] },
        { name: "Autopista Los Andes", img: "/images/partners/autopista-los-andes.webp", services: ["Operadores de Grúa", "Aseo de Instalaciones"] },
    ];


    const mapEmbedUrl = "/folium_map.html"; 

    return (
        // CAMBIO: Padding horizontal (px-4) y vertical (py-16) ajustado para móvil
        <div className="min-h-screen px-4 py-16 sm:px-6 lg:py-20 flex flex-col items-center bg-gray-50">
            
            {/* CAMBIO: Título más pequeño (text-3xl) y menos margen inferior (mb-10) en móvil */}
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold uppercase mb-10 md:mb-12 text-gray-800">
                Experiencia
            </h2>

            {/* Contenedor Principal (Dos Columnas) */}
            <div className="flex flex-col lg:flex-row max-w-7xl w-full bg-white shadow-xl rounded-xl overflow-hidden lg:items-start border-4 border-solid border-[#0A9345]">
                
                {/* Columna Izquierda: Experiencia Profesional y Texto */}
                <div className="flex-1 p-6 md:p-12 flex flex-col justify-start">
                    {/* CAMBIO: Subtítulo más pequeño (text-2xl) en móvil */}
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 uppercase text-gray-900">
                        Experiencia Profesional
                    </h3>
                    <p className="text-base md:text-lg leading-relaxed text-gray-600 mb-8">
                        Contamos con una sólida trayectoria en la conservación, mantenimiento y asistencia de las principales concesiones viales del país. Nuestro compromiso con la excelencia operativa y la seguridad nos ha consolidado como un socio estratégico clave en la gestión de infraestructura. Actualmente, prestamos servicios especializados en las siguientes autopistas:
                    </p>

                    {/* 🔴 NUEVO: Grid de Empresas */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
                        {companies.map((company) => (
                            <div key={company.name} className="flex flex-col items-center text-center">
                                {/* Contenedor de Imagen con Borde Verde */}
                                <div className="relative w-full h-20 sm:h-24 mb-2 p-2 border-4 border-solid border-[#0A9345] rounded-lg bg-white overflow-hidden shadow-md">
                                    <Image
                                        // 🔴 CLASES AGREGADAS AQUÍ PARA EL EFECTO DE ZOOM
                                        className="transition-transform duration-500 ease-in-out hover:scale-110" 
                                        src={company.img} 
                                        alt={company.name}
                                        fill
                                        style={{ objectFit: "contain" }}
                                    />
                                </div>
                                {/* Nombre de la Empresa */}
                                <p className="text-sm font-semibold text-gray-800 leading-tight">
                                    {company.name}
                                </p>
                                {/* Servicios */}
                                <ul className="text-xs text-gray-500 leading-snug mt-1 space-y-0.5">
                                    {company.services.map((service, index) => (
                                        <li key={index}>{service}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Separador Vertical (en pantallas grandes) */}
                <div className="hidden lg:block border-l-2 border-white h-auto bg-white" style={{ width: '2px' }}></div>

                {/* Columna Derecha: Mapa */}
                {/* CAMBIO: Altura reducida en móvil (h-[400px]) y aumentada en lg (lg:h-[800px]) */}
                <div className="flex-1 h-[400px] lg:h-[800px] bg-gray-200 relative"> 
                    <h3 className="text-center bg-gray-700 text-white py-2 text-lg font-semibold uppercase">
                        Cobertura y Zonas de Operación
                    </h3>
                    
                    {/* Contenedor Relativo para la Superposición */}
                    <div className="relative w-full h-full">

                        {/* Contenedor del Mapa (Iframe de Folium) */}
                        <iframe
                            src={mapEmbedUrl}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Mapa Interactivo de Zonas de Operación"
                            className={`${allowMapInteraction ? "pointer-events-auto" : "pointer-events-none"}`}
                        ></iframe>

                        {/* SUPERPOSICIÓN INICIAL */}
                        {!mapActive && (
                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 text-white p-4 cursor-pointer"
                                 onClick={() => setMapActive(true)} 
                            >
                                <div className="text-center">
                                    <p className="text-lg md:text-xl font-bold mb-2">
                                        Haga clic para interactuar con el mapa
                                    </p>
                                    <p className="text-sm">
                                        (Deshabilitado para evitar conflictos de scroll)
                                    </p>
                                    <button className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-semibold transition-colors">
                                        Activar Mapa
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* SUPERPOSICIÓN DE BLOQUEO (Ctrl/Cmd Toggle) */}
                        {mapActive && scrollLockActive && (
                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/70 text-white p-4">
                                <p className="text-xl md:text-2xl font-bold">
                                    Scroll de la página activado
                                </p>
                                <p className="text-sm">
                                    Presione Ctrl / Cmd para volver a interactuar con el mapa.
                                </p>
                            </div>
                        )}

                        {/* SUPERPOSICIÓN PEQUEÑA (Instrucción) */}
                        {mapActive && !scrollLockActive && (
                             <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 bg-black/70 text-white text-xs py-1 px-3 rounded-full shadow-lg">
                                 Presione Ctrl / Cmd para activar el scroll de la página.
                             </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}