import React, { useState, useEffect } from 'react';
import ProductDisplay from '../../../Components/Models/Displays/ProductsDisplay';
import { toast } from 'react-toastify';

const ProductWishlist = () => {
    const [purchases, setPurchases] = useState([]);
    const userId = sessionStorage.getItem('user id');
    const userRole = sessionStorage.getItem('role');
    const [loading, setLoading] = useState(true);

    useEffect(() => {

    const fetchProductWishlist = async () => {
        try {
            if (userRole === 'tourist') {
                const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/users/product-wishlist/${userId}`);
                const data = await response.json();

                if (response.ok) {
                    const productsWithImages = data.map(product => {
                        let imageBase64 = null;
                        if (product.picture?.data && product.picture.contentType) {
                            try {
                                const byteArray = new Uint8Array(product.picture.data.data);
                                const binaryString = Array.from(byteArray).map(byte => String.fromCharCode(byte)).join('');
                                imageBase64 = `data:${product.picture.contentType};base64,${btoa(binaryString)}`;
                            } catch (error) {
                                console.error('Error converting image data to base64:', error);
                            }
                        }
                        return {
                            ...product,
                            picture: imageBase64
                        };
                    });

                    setPurchases(productsWithImages);
                } else {
                    toast.error(data.message || 'Failed to fetch products');
                }
            }
        }
        catch (error) {
            console.error('Error fetching products:', error);
            toast.error('An error occurred while fetching products');
        } finally {
            setLoading(false);
        }
    }
    fetchProductWishlist();
    }
    , [userId, userRole]);

 



    

    

    return (
        <div>
            <section className="bg-white px-4 py-10">
                <div className="container-xl lg:container m-auto">
                    <h2 className="text-3xl font-bold text-[#330577] mb-6 text-center">
                        My Wishlist
                    </h2>
                    <div className="flex flex-wrap gap-4">
                    {purchases.map((product) => (
                        <div key={product._id} className="bg-white text-[#330577] p-4 rounded-lg shadow-md w-full md:w-1/3 lg:w-1/4">
                            <ProductDisplay product={product} />
                        </div>
                    ))}
                </div>
                </div>
            </section>
        </div>
    );

}

export default ProductWishlist;

            

