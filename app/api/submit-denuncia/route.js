// app/api/submit-denuncia/route.js

// Usamos import en lugar de require, que es el estándar de Next.js (ES Modules)
import { BlobServiceClient } from "@azure/storage-blob";

// La cadena de conexión se lee automáticamente de las Variables de Entorno configuradas en Azure
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING_SSGL; 
const containerName = "denuncias"; 

/**
 * Maneja la solicitud POST para registrar una nueva denuncia.
 * * @param {Request} request El objeto Request de Next.js que contiene el cuerpo JSON.
 * @returns {Response} Un objeto Response de Next.js con el resultado de la operación.
 */
export async function POST(request) {
    
    // Next.js usa el objeto global Response y el método POST(request)
    try {
        // 1. Obtener los datos del cuerpo de la solicitud
        const formData = await request.json(); 
        
        // 2. Generar ID único y nombre de archivo (Lógica copiada de su index.js)
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const trackingId = Math.random().toString(36).substring(2, 11).toUpperCase(); 
        const fileName = `${formData.tipoDenuncia || 'general'}-${timestamp}-${trackingId}.json`;

        // 3. Conectar al Blob Service
        if (!connectionString) {
             // Si falta la conexión, devolvemos 500 con detalle.
             return Response.json(
                 { error: "Error de configuración: La cadena de conexión a Azure Storage no está configurada." }, 
                 { status: 500 }
             );
        }
        
        const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
        const containerClient = blobServiceClient.getContainerClient(containerName);

        // 4. Crear el cliente del Blob y subir los datos
        const blockBlobClient = containerClient.getBlockBlobClient(fileName);

        const dataToSave = {
            ...formData,
            trackingId: trackingId,
            receivedAt: timestamp
        };

        const content = JSON.stringify(dataToSave, null, 2);
        // Usamos Buffer.byteLength para obtener la longitud del contenido en bytes
        await blockBlobClient.upload(content, Buffer.byteLength(content));

        // 5. Devolver éxito al cliente (el frontend DenunciaForm.tsx)
        return Response.json(
            { 
                message: "Denuncia registrada con éxito.",
                trackingId: trackingId,
                fileName: fileName
            }, 
            { status: 200 }
        );

    } catch (error) {
        // Log del error en la consola del servidor de Azure
        console.error("Error al procesar la denuncia:", error); 
        
        // Devolver el error al frontend
        return Response.json(
            { 
                error: "Error interno del servidor al guardar la denuncia.", 
                detail: error.message 
            }, 
            { status: 500 }
        );
    }
}

// Opcional: Bloquear otros métodos HTTP
export async function GET() {
    return Response.json({ error: "Método GET no permitido para esta ruta. Use POST." }, { status: 405 });
}