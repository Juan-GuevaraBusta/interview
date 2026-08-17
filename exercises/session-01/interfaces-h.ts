// Session 01 — H: Interfaces (implementation & contracts)
// Escribe TÚ el código. El entrenador no implementa esta solución.
//
// ESCENARIO:
// API que retorna datos de diferentes proveedores de pagos (Stripe, PayPal, MercadoPago).
// Cada proveedor tiene métodos diferentes, pero todos cumplen el MISMO CONTRATO.
//
// TAREAS:
//
// 1. Define una interfaz PaymentProvider con:
//    - processPayment(amount: number, currency: string): Promise<{ transactionId: string }>
//    - refund(transactionId: string): Promise<{ success: boolean }>
//    - getStatus(transactionId: string): Promise<'pending' | 'success' | 'failed'>
//
// 2. Implementa dos clases:
//    - StripeProvider implements PaymentProvider
//    - PayPalProvider implements PaymentProvider
//    (No necesitan código real; console.log + mock responses.)
//
// 3. Escribe una función processOrder:
//    function processOrder(provider: PaymentProvider, amount: number): Promise<string>
//    Procesa el pago y retorna transactionId.
//
// 4. Responde:
//    a) ¿Por qué processOrder recibe PaymentProvider en lugar de StripeProvider | PayPalProvider?
//    b) ¿Qué pasa si mañana agregas GooglePayProvider?
//
// 4. Responder Q4:
/*
a) ¿Por qué processOrder recibe PaymentProvider en lugar de StripeProvider | PayPalProvider?

b) ¿Qué pasa si mañana agregas GooglePayProvider?
*/

interface PaymentProvider{
    processPayment(amount: number, currency: string): Promise<{ transactionId: string}>;
    refund(transactionId: string): Promise<{success: boolean}>;
    getStatus(transactionId: string): Promise<'pending' | 'success' | 'failed'>;
}

class StripeProvider implements PaymentProvider{
    async processPayment(amount: number, currency: string): Promise<{transactionId: string}>{
        console.log(`Processing payment of ${amount} ${currency} with stripe`);
        return { transactionId: `stripe_${Date.now()}` };
    }
    async refund(transactionId: string): Promise<{success: boolean}>{
        console.log(`Refunding transaction ${transactionId}`);
        return { success: true };
    }
    async getStatus(transactionId: string): Promise<'pending' | 'success' | 'failed'>{
        console.log(`Getting status: ${transactionId}`);
        return 'success';
    }
}

class PayPalProvider implements PaymentProvider{
    async processPayment(amount: number, currency: string): Promise<{transactionId: string}>{
        console.log(`Processing payment of ${amount} ${currency} with paypal`);
        return { transactionId: `paypal_${Date.now()}` };
    }
    async refund(transactionId: string): Promise<{success: boolean}>{
        console.log(`Refunding transaction ${transactionId}`);
        return { success: true };
    }
    async getStatus(transactionId: string): Promise<'pending' | 'success' | 'failed'>{
        console.log(`Getting status: ${transactionId}`);
        return 'pending';
    }
}

async function processOrder(provider: PaymentProvider, amount: number): Promise<string>{
    const result = await provider.processPayment(amount, 'USD');
    return result.transactionId;
}

/* 
a. processOrder recibe PaymentProvider para que sea más flexible y a futuro
si se desearan agregar más metodos de pago, no se tendría que cambiar todo
el codigo permitiendo cumplir con el contrato de la interfaz de PaymentProvider

b. si se agrega GooglePayProvider, unicamente se tendria que implementar
la interfaz de paymentProvider y no se tendría que cambiar todo el código, cumpliendo
asi el principio de responsablidad unica y el OCP

*/
