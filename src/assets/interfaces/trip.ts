export interface Review {
    id: string;
    userId: string;
    nickname: string;
    title: string;
    purchasedDate?: string;
    comment: string;
}

export interface Trip {
    id: string;
    name: string;
    destination: string;
    startDate: Date;
    endDate: Date;
    price: number;
    maxSeats: number;
    reservedSeats: number;
    description: string;
    image: string;
    images?: string[];
    rating: [number, number, number, number, number];
    checked?: boolean;
    purchaseDate?: Date;
    status?: 'upcoming' | 'active' | 'archived';
    latitude?: number;
    longitude?: number;
    reviews?: Review[];
}
