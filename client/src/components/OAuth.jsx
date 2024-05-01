import { Button } from 'flowbite-react';
import { AiFillGoogleSquare } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice.js';
import { useNavigate } from 'react-router-dom';

import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase.js';
import { socket } from '../App.jsx';

export default function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async () => {
        const auth = getAuth(app);
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        try {
            dispatch(signInStart());
            const resFromGG = await signInWithPopup(auth, provider);
            if (resFromGG != null) {
                const res = await fetch('./api/auth/google', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: resFromGG.user.email,
                        username: resFromGG.user.displayName,
                        googleAvatar: resFromGG.user.photoURL,
                    }),
                });
                const data = await res.json();
                if (data.success === false) {
                    dispatch(signInFailure(data.message));
                    return;
                }
                if (res.ok) {
                    //socket.emit('newUserLogin', data._id);
                    dispatch(signInSuccess(data));
                    navigate('/');
                    socket.emit('refreshBrower', data._id);
                } else {
                    dispatch(signInFailure(data.message));
                }
            } else {
                dispatch(signInFailure(resFromGG));
            }
        } catch (error) {
            dispatch(signInFailure(error.message));
            return;
        }
    };

    return (
        <>
            <Button type="button" gradientDuoTone="greenToBlue" outline onClick={handleGoogleClick}>
                <AiFillGoogleSquare className="w-6 h-6 mr-2" />
                Continue with Google
            </Button>
        </>
    );
}
