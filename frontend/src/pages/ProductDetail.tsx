import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    image_urls: string[];
    size: string;
}

export default function ProductDetail() {


    return (
        <>

        </>
    );
}
