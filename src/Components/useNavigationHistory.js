import { useNavigate } from 'react-router-dom';

const useNavigationHistory = () => {
    const navigate = useNavigate();

    const goToPreviousPage = () => {
        // Use browser's built-in navigation to go back to the previous page
        window.history.back();
    };

    return { goToPreviousPage };
};

export default useNavigationHistory;