import { useContext, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import ModalConfirm from './ModalConfirm';
import { BlogContext } from '../pages/ReadBlog';
import { signOutSuccess } from '../redux/user/userSlice.js';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function StarRating({ currentUser, blogInfo }) {
    const [rating, setRating] = useState(null);
    const [hoverRating, setHoverRating] = useState(0);
    const [showModal, setShowModal] = useState(false);
    let { setBlog } = useContext(BlogContext);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleRatingConfirm = (currentRate) => {
        setRating(currentRate);
        setShowModal(true);
    };

    const handleConfirmRating = async () => {
        const res = await fetch(`/api/blog/rating-blog/${blogInfo._id}/${currentUser._id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rating }),
        });

        const rs = await res.json();
        if (res.status === 403) {
            dispatch(signOutSuccess());
            return navigate('/sign-in');
        } else if (res.status === 404) {
            return navigate('*');
        } else if (res.status === 200) {
            setBlog(rs.blog);
        }
    };

    const handleNoConfirmRating = () => {
        setShowModal(false);
    };

    return (
        <div className="flex flex-col gap-4 my-8">
            <i className="font-semibold text-xl">Rating for this blog</i>
            <div className="flex">
                {[...Array(5)].map((star, index) => {
                    const currentRate = index + 1;
                    return (
                        <div
                            key={index}
                            onMouseEnter={() => setHoverRating(currentRate)}
                            onMouseLeave={() => setHoverRating(0)}
                        >
                            <label>
                                <input
                                    className="hidden"
                                    type="radio"
                                    name="rate"
                                    value={currentRate}
                                    onClick={() => handleRatingConfirm(currentRate)}
                                />
                                <FaStar
                                    size={24}
                                    color={currentRate <= (hoverRating || rating) ? '#FACA15' : 'gray'}
                                    className="hover:fill-yellow-300"
                                />
                            </label>
                        </div>
                    );
                })}
            </div>
            {showModal && (
                <ModalConfirm
                    showModal={showModal}
                    setShowModal={setShowModal} // Giả định rằng setShowModal là một hàm setState từ component cha
                    title={`Please confirm your vote for this blog ${rating} stars`}
                    onConfirm={handleConfirmRating}
                    onNoConfirm={handleNoConfirmRating}
                    confirm={`Yes, ${rating} stars`}
                    noConfirm="No, let me vote again"
                />
            )}
        </div>
    );
}
