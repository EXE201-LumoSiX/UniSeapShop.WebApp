import { useNavigate } from "react-router-dom";
import api from "../../config/axios"
import { useEffect, useState } from "react";
import SellItem from "./Sell";
import RegisterSupplier from "./RegisterSupplier";

const SellPage: React.FC = () => {
    const navigate = useNavigate();

   
    const user = JSON.parse(localStorage.getItem("user") || '');
    const email = user?.email || "";
    const [isAvailable, setIsAvailable] = useState(false);

    const checkSupplier = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await api.post(
                'api/Auth/check-exist-supplier',
                email,
                {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                }
            );

            setIsAvailable(!!response.data.value.data);
        } catch (error) {
        console.error("Error checking supplier:", error);
        }
    };

    useEffect(() => {
        checkSupplier();
    }, []);

    console.log(isAvailable)
    return (
        isAvailable ? 
        <SellItem/>
        :
        <RegisterSupplier/>
    )
}

export default SellPage;