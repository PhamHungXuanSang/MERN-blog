import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import blogStructure from '../context/blog/blogStructure';
import { signOutSuccess } from '../redux/user/userSlice';
import { EditorContext } from './Editor';
import { Spinner } from 'flowbite-react';
import BlogEditor from '../components/BlogEditor';
import PublishForm from '../components/PublishForm';

export default function ScheduleEditor() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let { slug } = useParams();
    const currentUser = useSelector((state) => state.user.currentUser);
    if (!currentUser.isAdmin) {
        if (currentUser.createPermission == false) {
            navigate('/offer');
            toast.error('You need to purchase a plan to use this feature', { duration: 6000 });
        }
    }
    const [blog, setBlog] = useState(blogStructure);
    const [editorState, setEditorState] = useState('editor');
    const [textEditor, setTextEditor] = useState({ isReady: false });
    const [loading, setLoading] = useState(true);

    const fetchScheduleBlog = async () => {
        if (!slug) {
            return setLoading(false);
        }

        try {
            const res = await fetch(`/api/scheduleBlog/edit-schedule-blog/${slug}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: currentUser?._id }),
            });
            const blogData = await res.json();
            if (res.status === 403) {
                setLoading(false);
                dispatch(signOutSuccess());
                return navigate('/sign-in');
            } else if (res.status === 200) {
                setBlog(blogData.blog);
                setLoading(false);
            } else if (res.status === 404) {
                return navigate('*');
            }
        } catch (error) {
            console.log(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchScheduleBlog();
    }, []);

    return (
        <EditorContext.Provider value={{ blog, setBlog, editorState, setEditorState, textEditor, setTextEditor }}>
            {loading ? (
                <Spinner className="block mx-auto mt-4" size="xl" />
            ) : editorState == 'editor' ? (
                <BlogEditor />
            ) : (
                <PublishForm />
            )}
        </EditorContext.Provider>
    );
}
