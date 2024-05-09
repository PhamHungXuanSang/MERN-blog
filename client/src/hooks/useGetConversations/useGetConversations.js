import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { signOutSuccess } from '../../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function useGetConversations() {
    const [loading, setLoading] = useState(false);
    const [conversations, setConversations] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const getConversations = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/user/get-all-not-this-user', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                const data = await res.json();
                if (res.status === 403) {
                    dispatch(signOutSuccess());
                    return navigate('/sign-in');
                }
                if (res.status === 200) {
                    setConversations(data);
                    setLoading(false);
                } else {
                    return toast.error(data.message, { duration: 6000 });
                }
            } catch (error) {
                return toast.error(error.message);
            }
        };

        getConversations();
    }, []);
    return { loading, conversations };
}
