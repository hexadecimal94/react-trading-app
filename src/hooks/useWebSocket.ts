// src/hooks/useWebSocket.ts
import { useEffect, useRef, useState } from 'react';

export interface Bond {
    code: string;
    name: string;
    price: number;
    yield: number;
}

export interface BondWithChange extends Bond {
    priceChange: 'up' | 'down' | 'same';
}

export const useWebSocket = (url: string) => {
    const ws = useRef<WebSocket | null>(null);
    const [bonds, setBonds] = useState<BondWithChange[]>([]);
    const previousPricesRef = useRef<Map<string, number>>(new Map());

    useEffect(() => {
        ws.current = new WebSocket(url);

        ws.current.onmessage = (event) => {
            try {
                const newData: Bond[] = JSON.parse(event.data);

                const updatedData: BondWithChange[] = newData.map((bond) => {
                    const prevPrice = previousPricesRef.current.get(bond.name);
                    let priceChange: BondWithChange['priceChange'] = 'same';

                    if (prevPrice !== undefined) {
                        priceChange = bond.price > prevPrice ? 'up' :
                                      bond.price < prevPrice ? 'down' : 'same';
                    }

                    // Update stored previous price
                    previousPricesRef.current.set(bond.name, bond.price);

                    return { ...bond, priceChange };
                });

                setBonds(updatedData);
            } catch (err) {
                console.error("Error parsing bond data:", err);
            }
        };

        return () => {
            ws.current?.close();
        };
    }, [url]);

    return { bonds };
};
