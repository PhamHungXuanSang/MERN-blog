import { createContext, useState } from 'react';
import BlogEditor from '../components/BlogEditor';
import PublishForm from '../components/PublishForm';
import blogStructure from '../context/blog/blogStructure.js';

export const EditorContext = createContext({});

export default function Editor() {
    const [blog, setBlog] = useState(blogStructure);
    const [editorState, setEditorState] = useState('editor');
    const [textEditor, setTextEditor] = useState({ isReady: false });

    return (
        <EditorContext.Provider value={{ blog, setBlog, editorState, setEditorState, textEditor, setTextEditor }}>
            {editorState == 'editor' ? <BlogEditor /> : <PublishForm />}
        </EditorContext.Provider>
    );
}
