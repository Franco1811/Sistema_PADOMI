import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('📶 Procesando paquete de telemetría IoT mediante Azure Function...');

    const body = req.body;

    // 1. Validación básica de Request
    if (!body) {
        context.res = {
            status: 400,
            body: { error: "El cuerpo de la petición (JSON) está vacío." },
            headers: { 'Content-Type': 'application/json' }
        };
        return;
    }

    const { pacienteId, metricaId, valor } = body;

    if (!pacienteId || !metricaId || valor === undefined) {
        context.res = {
            status: 400,
            body: { error: "Formato de lectura inválido. Se requiere pacienteId, metricaId y valor." },
            headers: { 'Content-Type': 'application/json' }
        };
        return;
    }

    if (typeof valor !== 'number' || valor < 0) {
        context.res = {
            status: 400,
            body: { error: "El valor biométrico debe ser un número positivo." },
            headers: { 'Content-Type': 'application/json' }
        };
        return;
    }

    // 2. Obtener URL del backend desde variables de entorno
    const backendUrl = process.env.BACKEND_URL || "http://localhost:3000";
    context.log(`🔗 Delegando lectura de telemetría al Backend: ${backendUrl}/api/ingesta`);

    try {
        // 3. Reenviar lectura al API central
        const response = await fetch(`${backendUrl}/api/ingesta`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ pacienteId, metricaId, valor })
        });

        const resData = await response.json() as any;

        if (response.ok) {
            context.log(`✅ Telemetría registrada con éxito: ${resData.codigo}`);
            context.res = {
                status: 201,
                body: {
                    message: "Lectura procesada con éxito por Azure Functions y persistida en base de datos.",
                    lectura: resData
                },
                headers: { 'Content-Type': 'application/json' }
            };
        } else {
            context.log(`⚠️ Fallo en el backend al registrar lectura: ${resData.error || 'Error desconocido'}`);
            context.res = {
                status: response.status,
                body: { error: resData.error || "Error al procesar la ingesta en el backend." },
                headers: { 'Content-Type': 'application/json' }
            };
        }

    } catch (error: any) {
        context.log(`❌ Error crítico de conexión hacia el backend: ${error.message}`);
        context.res = {
            status: 500,
            body: { error: `No se pudo conectar con el backend de PADOMI: ${error.message}` },
            headers: { 'Content-Type': 'application/json' }
        };
    }
};

export default httpTrigger;
