// Define the two sectors to be linked by a common ID
export interface ClientIdentitySector {
    uid: string;                 // Machine-generated unique ID
    email: string;               // 5 Cs of professional communication target
    fullName: string;            // Official name for documentation
    registrationDate: Date;      // Digital footprint entry point
    conductStatus: 'Excellent' | 'Standard' | 'Review'; // Professional conduct tracking
}

export interface OrderLogisticsSector {
    orderId: string;             // Tracking number for the client
    clientId: string;            // Link to the Identity Sector
    productSnapshot: {
        suitFile: string;          // e.g., 'suit4.jpg'
        size: 'S' | 'M' | 'L' | 'XL';
        price: string;
    };
    logistics: {
        currentStep: 1 | 2 | 3 | 4; // Dashboard progress indicator
        isStamped: boolean;         // Official digital stamp verification
        lastLocation: string;      // Current sector in the delivery pipeline
    };
}

/**
 * Function to simulate the machine recording an order.
 * Updated with Types to remove the red underline.
 */
const recordClientOrder = (
    client: { id: string; email: string; name: string },
    selection: { mainImage: string; size: 'S' | 'M' | 'L' | 'XL'; price: string }
) => {

    // Sector 1: Validate or update Identity
    // Linking to user's professional standards for digital literacy
    const identityRecord: Partial<ClientIdentitySector> = {
        uid: client.id,
        email: client.email,
        fullName: client.name,
        conductStatus: 'Excellent' // Defaulting based on professional standards
    };

    // Sector 2: Create Logistics Entry for the Orders Dashboard
    const logisticsRecord: OrderLogisticsSector = {
        orderId: `ENT-${Date.now()}`, // Unique tracking ID
        clientId: client.id,
        productSnapshot: {
            suitFile: selection.mainImage, // Matches your suitX.jpg naming
            size: selection.size,
            price: selection.price
        },
        logistics: {
            currentStep: 1, // Start at 'Confirmed'
            isStamped: false, // Pending digital stamp application
            lastLocation: 'Main Processing Center'
        }
    };

    console.log("--- LOGISTICS SECTOR UPDATED ---");
    console.log("Client ID:", identityRecord.uid);
    console.log("Order ID:", logisticsRecord.orderId);

    return { identityRecord, logisticsRecord };
};