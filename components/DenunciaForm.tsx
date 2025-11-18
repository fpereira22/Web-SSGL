// components/DenunciaForm.tsx
"use client"

import { useState, useCallback, useMemo, useEffect } from 'react'
import { Check, AlertTriangle, ArrowLeft, ArrowRight, X } from 'lucide-react'
import { useRouter } from 'next/navigation' 


// 🚨 NUEVA FUNCIÓN DE VALIDACIÓN DE TELÉFONO (Formato Chile)
const validatePhone = (phone: string): boolean => {
    if (!phone) return false;

    // 1. Limpieza de caracteres y prefijos comunes:
    let cleanPhone = phone.replace(/[^0-9]/g, ''); // Deja solo números
    
    // Eliminar prefijos comunes de Chile: (+56, 56)
    if (cleanPhone.startsWith('56')) {
        cleanPhone = cleanPhone.substring(2);
    }

    // 2. Verificar longitud:
    const length = cleanPhone.length;
    
    // Consideramos válido si tiene 8 o 9 dígitos
    return length >= 8 && length <= 9;
};

const validateEmail = (email: string): boolean => {
    if (!email) return false;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

const validateRut = (rut: string): boolean => {
    if (!rut) return false;

    const cleanRut = rut.replace(/[^0-9kK]/g, "").toUpperCase();
    if (cleanRut.length < 2) return false;

    const body = cleanRut.slice(0, -1);
    let dv = cleanRut.slice(-1);

    if (body.length < 7) return false;

    let sum = 0;
    let multiplier = 2;

    for (let i = body.length - 1; i >= 0; i--) {
        sum += parseInt(body.charAt(i), 10) * multiplier;
        multiplier++;
        if (multiplier > 7) {
            multiplier = 2; 
        }
    }

    let remainder = sum % 11;
    let dvExpected = (11 - remainder).toString();

    if (dvExpected === '10') {
        dvExpected = 'K';
    } else if (dvExpected === '11') {
        dvExpected = '0';
    }

    return dv === dvExpected;
}

const formatRut = (rut: string): string => {
    if (!rut) return '';
    const cleanRut = rut.replace(/[^0-9kK]/g, "").toUpperCase();
    if (cleanRut.length < 2) return cleanRut;

    let body = cleanRut.slice(0, -1);
    const dv = cleanRut.slice(-1);

    body = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    
    return `${body}-${dv}`;
};

// ... (Opciones y Estado Inicial)
const denunciaOptions = [
    { value: '', label: 'Seleccione un tipo de denuncia' },
    { value: 'acoso_laboral', label: 'Acoso Laboral' },
    { value: 'acoso_sexual', label: 'Acoso Sexual o Violencia en el Trabajo' },
    { value: 'fraude', label: 'Fraude, Corrupción o Conflicto de Interés' },
    { value: 'medioambiente', label: 'Incumplimiento Medioambiental' },
    { value: 'seguridad', label: 'Incumplimiento de Seguridad y Salud Ocupacional (SSO)' },
    { value: 'otro', label: 'Otro tipo de falta o delito' },
]

const initialFormData = {
    nombre: '',
    rut: '',
    email: '',
    telefono: '',
    anonimo: false,
    tipoDenuncia: '',
    denunciaDetalle: '',
    fechaIncidente: '',
    ubicacion: '',
}


export default function DenunciaForm() {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState(initialFormData)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false) 
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); 
    const [trackingId, setTrackingId] = useState<string | null>(null);
    // 🟢 ESTADO PARA ARCHIVOS
    const [files, setFiles] = useState<FileList | null>(null); 

    const router = useRouter();


    // EFECTO SECUNDARIO: Bloquea el scroll de la página cuando CUALQUIER modal está abierto
    useEffect(() => {
        if (isConfirmOpen || isSubmitting || isSuccessModalOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }
        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [isConfirmOpen, isSubmitting, isSuccessModalOpen])


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target
        
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked
            setFormData(prev => ({ 
                ...prev, 
                [name]: checked,
                ...(name === 'anonimo' && checked ? { nombre: '', rut: '', email: '', telefono: '' } : {})
            }))
        } else if (type === 'file') { // 🟢 MANEJO DE ARCHIVOS
            const fileInput = e.target as HTMLInputElement;
            setFiles(fileInput.files);
        } else {
            setFormData(prev => ({ 
                ...prev, 
                [name]: name === 'rut' ? value.replace(/[^0-9kK]/g, '') : value
            }))
        }
    }
    
    const handleRutBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (e.target.name === 'rut' && !formData.anonimo) {
            const cleanedRut = e.target.value.replace(/[^0-9kK]/g, '');
            if (cleanedRut.length > 1) {
                const formattedRut = formatRut(cleanedRut);
                setFormData(prev => ({
                    ...prev,
                    rut: formattedRut 
                }));
            }
        }
    }

    const nextStep = useCallback(() => setStep(prev => prev + 1), [])
    const prevStep = useCallback(() => setStep(prev => prev - 1), [])
    
    const handleOpenConfirm = useCallback((e: React.FormEvent) => {
        e.preventDefault() 
        if (step === 3 && formData.denunciaDetalle.length >= 10) {
            setIsConfirmOpen(true)
        }
    }, [step, formData.denunciaDetalle.length])


    const isRutValid = useMemo(() => validateRut(formData.rut), [formData.rut])
    const isEmailValid = useMemo(() => validateEmail(formData.email), [formData.email]);
    const isPhoneValid = useMemo(() => validatePhone(formData.telefono), [formData.telefono]);


    const isContactValid = useMemo(() => {
        const hasName = formData.nombre.trim().length > 0
        const hasValidRut = isRutValid
        const hasValidEmail = isEmailValid
        const hasValidPhone = isPhoneValid
        
        return (hasName && hasValidRut) || (hasValidEmail && hasValidPhone)
    }, [formData, isRutValid, isEmailValid, isPhoneValid])

    const isStep1Valid = useMemo(() => {
        return formData.anonimo || isContactValid
    }, [formData.anonimo, isContactValid])
    
    const isStep2Valid = useMemo(() => {
        return formData.tipoDenuncia !== ''
    }, [formData.tipoDenuncia])

    // FUNCIÓN DE ENVÍO FINAL (se llama desde el modal)
    const handleFinalSubmit = async () => {
        if (isSubmitting) return
        
        setIsConfirmOpen(false) 
        setIsSubmitting(true)   

        // 🟢 1. Crear el objeto FormData para enviar datos y archivos
        const submitFormData = new FormData();
        
        // 🟢 2. Añadir los campos de texto serializados como JSON (backend los parseará)
        submitFormData.append('data', JSON.stringify(formData)); 
        
        // 🟢 3. Añadir los archivos
        if (files) {
            for (let i = 0; i < files.length; i++) {
                // 'archivos' es la clave que el backend buscará para los archivos
                submitFormData.append('archivos', files[i]); 
            }
        }
        
        try {
            const apiEndpoint = "/api/submit-denuncia";
            
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                // 🚨 NO ES NECESARIO EL HEADER Content-Type: multipart/form-data. El navegador lo añade automáticamente al usar FormData.
                body: submitFormData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ detail: response.statusText }));
                throw new Error(errorData.detail || response.statusText);
            }

            const result = await response.json(); 
            
            console.log("Respuesta de la API:", result);
            
            setTrackingId(result.trackingId);
            setIsSuccessModalOpen(true);
            
            // Resetear
            setStep(1);
            setFormData(initialFormData); 
            setFiles(null); // 🟢 Limpiar archivos después del envío exitoso

        } catch (error: any) {
            console.error("Error al enviar la denuncia:", error);
            alert(`❌ Fallo el envío de la denuncia: ${error.message}. Por favor, verifique su conexión o inténtelo más tarde.`);
        } finally {
            setIsSubmitting(false) 
        }
    }
    
    const handleGoHome = () => {
        setIsSuccessModalOpen(false); 
        router.push('/'); 
    };


    const renderStep = () => {
        const showEmailError = !formData.anonimo && formData.email && !isEmailValid;
        const showPhoneError = !formData.anonimo && formData.telefono && !isPhoneValid;

        switch (step) {
            case 1:
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Privacidad</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Por favor, ingrese al menos dos datos de contacto válidos o marque el casillero anónimo.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</span>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    disabled={formData.anonimo}
                                    className={`mt-1 block w-full rounded-md border-border bg-background shadow-sm p-3 ${formData.anonimo ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                                />
                            </label>
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Rut / DNI</span>
                                <input
                                    type="text"
                                    name="rut"
                                    value={formData.rut}
                                    onChange={handleChange}
                                    onBlur={handleRutBlur} 
                                    disabled={formData.anonimo}
                                    placeholder="Ej: 20377634-9"
                                    className={`mt-1 block w-full rounded-md border-border bg-background shadow-sm p-3 
                                        ${formData.anonimo ? 'bg-gray-100 dark:bg-gray-700' : ''}
                                        ${!formData.anonimo && formData.rut && !isRutValid ? 'border-2 border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
                                    `}
                                />
                                {!formData.anonimo && formData.rut && !isRutValid && (
                                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                        <AlertTriangle size={12} /> El RUT es inválido. Verifique los números y el dígito verificador.
                                    </p>
                                )}
                            </label>
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">E-mail</span>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={formData.anonimo}
                                    className={`mt-1 block w-full rounded-md border-border bg-background shadow-sm p-3 
                                        ${formData.anonimo ? 'bg-gray-100 dark:bg-gray-700' : ''}
                                        ${showEmailError ? 'border-2 border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
                                    `}
                                />
                                {showEmailError && (
                                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                        <AlertTriangle size={12} /> Formato de correo electrónico inválido.
                                    </p>
                                )}
                            </label>
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Teléfono</span>
                                <input
                                    type="tel"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    disabled={formData.anonimo}
                                    className={`mt-1 block w-full rounded-md border-border bg-background shadow-sm p-3 
                                        ${formData.anonimo ? 'bg-gray-100 dark:bg-gray-700' : ''}
                                        ${showPhoneError ? 'border-2 border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
                                    `}
                                />
                                {showPhoneError && (
                                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                        <AlertTriangle size={12} /> Formato de teléfono inválido (debe tener 8 o 9 dígitos).
                                    </p>
                                )}
                            </label>
                        </div>
                        
                        <label className="flex items-center space-x-2 pt-4">
                            <input
                                type="checkbox"
                                name="anonimo"
                                checked={formData.anonimo}
                                onChange={handleChange}
                                className="h-4 w-4 text-primary rounded border-border focus:ring-primary"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Deseo que esta denuncia sea anónima (no dejaré datos de contacto)</span>
                        </label>
                        
                        <div className="p-4 bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 rounded-md text-sm text-yellow-700 dark:text-yellow-300">
                            <p className="font-semibold flex items-center gap-2"><AlertTriangle size={16} /> Importante</p>
                            <p className="mt-1">Para dar curso a una denuncia de acoso laboral, acoso sexual y violencia en el trabajo, es necesario poder contar con sus datos. Sin esa información no podemos realizar la investigación para solucionar el problema. Recuerde que ud. tiene garantía de indemnidad, la cual consiste en que no puede ser sujeto de represalias por efectuar una denuncia o ser testigo en un proceso de investigación.</p>
                        </div>
                    </div>
                )

            case 2:
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Tipo de Denuncia</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Seleccione la categoría que mejor describa su denuncia.
                        </p>

                        <label className="block">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de Falta a Reportar</span>
                            <select
                                name="tipoDenuncia"
                                value={formData.tipoDenuncia}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-border bg-background shadow-sm p-3"
                            >
                                {denunciaOptions.map(option => (
                                    <option key={option.value} value={option.value} disabled={option.value === ''}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </label>

                        {formData.tipoDenuncia && formData.tipoDenuncia !== '' && (
                            <div className="p-4 bg-blue-100 dark:bg-blue-900 border-l-4 border-blue-500 rounded-md text-sm text-blue-700 dark:text-blue-300">
                                <p>Ha seleccionado: **{denunciaOptions.find(o => o.value === formData.tipoDenuncia)?.label}**.</p>
                                <p className="mt-1">El siguiente paso le pedirá los detalles, incluyendo fechas y lugares.</p>
                            </div>
                        )}
                    </div>
                )

            case 3:
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Detalle de la Denuncia</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Proporcione toda la información relevante para que podamos investigar el caso.
                        </p>

                        <div className="grid grid-cols-1 gap-6">
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Descripción Detallada de la Denuncia <span className="text-red-500">*</span></span>
                                <textarea
                                    name="denunciaDetalle"
                                    value={formData.denunciaDetalle}
                                    onChange={handleChange}
                                    rows={5}
                                    required
                                    className="mt-1 block w-full rounded-md border-border bg-background shadow-sm p-3"
                                    placeholder="Describa los hechos, incluyendo fechas, lugares, personas involucradas y testigos."
                                ></textarea>
                            </label>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className="block">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Fecha del Incidente (Aproximada)</span>
                                    <input
                                        type="date"
                                        name="fechaIncidente" 
                                        value={formData.fechaIncidente} 
                                        onChange={handleChange} 
                                        className="mt-1 block w-full rounded-md border-border bg-background shadow-sm p-3"
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Ubicación del Incidente</span>
                                    <input
                                        type="text"
                                        name="ubicacion" 
                                        value={formData.ubicacion} 
                                        onChange={handleChange} 
                                        className="mt-1 block w-full rounded-md border-border bg-background shadow-sm p-3"
                                        placeholder="Sucursal, Autopista, Km, etc."
                                    />
                                </label>
                            </div>

                            <label className="block">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Archivos Adjuntos (Evidencia)</span>
                                <input
                                    type="file"
                                    name="archivos"
                                    multiple
                                    onChange={handleChange} // 🟢 Captura la lista de archivos
                                    className="mt-1 block w-full text-sm text-gray-500
                                               file:mr-4 file:py-2 file:px-4
                                               file:rounded-full file:border-0
                                               file:text-sm file:font-semibold
                                               file:bg-primary file:text-primary-foreground
                                               hover:file:bg-primary/90"
                                />
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Formatos permitidos: PDF, JPG, PNG. Máx. 10MB.</p>
                                {files && files.length > 0 && ( // 🟢 Mostrar recuento de archivos
                                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-300 font-medium">
                                        Archivos seleccionados: {files.length}
                                    </p>
                                )}
                            </label>
                            
                            <div className="p-4 bg-green-100 dark:bg-green-900 border-l-4 border-green-500 rounded-md text-sm text-green-700 dark:text-green-300">
                                <p className="font-semibold flex items-center gap-2"><Check size={16} /> Listo para Enviar</p>
                                <p className="mt-1">Al hacer clic en "Enviar Denuncia", su reporte será registrado. Le recomendamos guardar esta página o tomar una captura de pantalla.</p>
                            </div>
                        </div>
                    </div>
                )
            
            default:
                return <div>Error de Paso</div>
        }
    }


    const SuccessModal = () => (
        <div 
            className="fixed inset-0 z-50 backdrop-blur-sm bg-gray-800/30 flex justify-center items-center p-4" 
            onClick={() => setIsSuccessModalOpen(false)}
        >
            <div 
                className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl w-full max-w-md border border-border transform transition-all duration-300 scale-100"
                onClick={e => e.stopPropagation()} 
            >
                <div className="p-6 border-b border-border flex justify-between items-center bg-green-50 dark:bg-green-950 rounded-t-xl">
                    <h3 className="text-xl font-bold text-green-700 dark:text-green-300 flex items-center gap-2">
                        <Check size={20} /> Denuncia Registrada
                    </h3>
                    <button onClick={() => setIsSuccessModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6">
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                        Su denuncia ha sido enviada exitosamente.
                    </p>
                    {trackingId && (
                        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Código de Seguimiento:</p>
                            <code className="text-2xl font-extrabold text-green-600 dark:text-green-400 select-all">{trackingId}</code>
                            <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                                Por favor, guarde este código. Lo necesitará para hacer consultas sobre el estado de su reporte.
                            </p>
                        </div>
                    )}
                </div>
                <div className="p-6 bg-gray-50 dark:bg-neutral-700 border-t border-border flex justify-end space-x-3 rounded-b-xl">
                    <button
                        type="button"
                        onClick={() => setIsSuccessModalOpen(false)}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-full font-semibold hover:bg-gray-400 transition"
                    >
                        Entendido
                    </button>
                    <button
                        type="button"
                        onClick={handleGoHome}
                        className="px-4 py-2 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition"
                    >
                        Volver a la Página Principal
                    </button>
                </div>
            </div>
        </div>
    );


    return (
        <form onSubmit={handleOpenConfirm} className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="mb-8 flex justify-between items-center">
                <h1 className="text-3xl font-extrabold uppercase text-gray-800 dark:text-white">
                    Centro de Denuncias
                </h1>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Paso {step} de 3
                </div>
            </div>

            {/* Indicador de Progreso */}
            <div className="flex justify-between mb-8">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex-1 text-center relative">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 transition-colors duration-300 
                                         ${s <= step ? 'bg-primary text-primary-foreground' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                            {s < step ? <Check size={16} /> : s}
                        </div>
                        <p className={`text-xs ${s <= step ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                            {s === 1 ? 'Privacidad' : s === 2 ? 'Tipo' : 'Detalle'}
                        </p>
                    </div>
                ))}
            </div>

            {/* Contenedor del Formulario (con estilo de tarjeta) */}
            <div className="bg-white dark:bg-neutral-800 shadow-xl rounded-xl p-6 sm:p-8 border border-border">
                {renderStep()}
                
                {/* Controles de Navegación */}
                <div className="flex justify-end space-x-4 mt-8 pt-4 border-t border-border">
                    <button
                        type="button"
                        onClick={prevStep}
                        disabled={step === 1 || isSubmitting}
                        className="flex items-center gap-2 px-6 py-2 bg-gray-200 text-gray-700 rounded-full font-semibold transition-colors duration-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600"
                    >
                        <ArrowLeft size={16} /> Anterior
                    </button>

                    {step < 3 && (
                        <button
                            type="button"
                            onClick={nextStep}
                            disabled={(!isStep1Valid && step === 1) || (!isStep2Valid && step === 2) || isSubmitting}
                            className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-full font-semibold transition-colors duration-200 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Siguiente <ArrowRight size={16} />
                        </button>
                    )}

                    {step === 3 && (
                        <button
                            type="submit" 
                            disabled={formData.denunciaDetalle.length < 10 || isSubmitting} 
                            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-full font-semibold transition-colors duration-200 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Enviando...' : <><Check size={16} /> Enviar Denuncia</>}
                        </button>
                    )}
                </div>
            </div>

            {/* Modal de Confirmación de Envío (Glassmorphism Oscuro) */}
            {isConfirmOpen && (
                <div 
                    className="fixed inset-0 z-50 backdrop-blur-sm bg-gray-800/30 flex justify-center items-center p-4" 
                    onClick={() => setIsConfirmOpen(false)}
                >
                    <div 
                        className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl w-full max-w-md border border-border transform transition-all duration-300 scale-100"
                        onClick={e => e.stopPropagation()} 
                    >
                        <div className="p-6 border-b border-border flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">Confirmar Envío</h3>
                            <button onClick={() => setIsConfirmOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-700 dark:text-gray-300 mb-6 flex items-center gap-2">
                                <AlertTriangle className="text-yellow-500" size={20} />
                                ¿Estás seguro de que quieres enviar la denuncia?
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Una vez enviada, la denuncia será procesada y no podrá ser editada.
                            </p>
                        </div>
                        <div className="p-6 bg-gray-50 dark:bg-neutral-700 border-t border-border flex justify-end space-x-3 rounded-b-xl">
                            <button
                                type="button"
                                onClick={() => setIsConfirmOpen(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-full font-semibold hover:bg-gray-400 transition"
                            >
                                Seguir Editando
                            </button>
                            <button
                                type="button"
                                onClick={handleFinalSubmit}
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition disabled:opacity-50"
                            >
                                Enviar y Finalizar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Modal de Éxito */}
            {isSuccessModalOpen && <SuccessModal />}

            {/* Indicador de carga a pantalla completa (Glassmorphism Oscuro) */}
            {isSubmitting && (
                <div className="fixed inset-0 z-50 backdrop-blur-sm bg-gray-800/30 flex justify-center items-center p-4">
                    <div className="flex flex-col items-center p-8 bg-white dark:bg-neutral-800 rounded-xl shadow-2xl">
                        <svg className="animate-spin h-8 w-8 text-primary mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-gray-900 dark:text-white font-semibold">Enviando denuncia, por favor espere...</p>
                    </div>
                </div>
            )}
        </form>
    )
}