import Embed from '@editorjs/embed';
import List from '@editorjs/list';
import Header from '@editorjs/header';
import Image from '@editorjs/image';
import Quote from '@editorjs/quote';
import Marker from '@editorjs/marker';
import InlineCode from '@editorjs/inline-code';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import toast from 'react-hot-toast';

const uploadImageURL = (e) => {
    let link = new Promise((resolve, reject) => {
        try {
            resolve(e);
        } catch (error) {
            reject(error);
        }
    });

    return link.then((url) => {
        console.log(url);
        return { success: 1, file: { url } };
    });
};

const uploadImageFile = (imageFile) => {
    let getUrl = new Promise((resolve, reject) => {
        try {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + imageFile.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, imageFile);
            uploadTask.on(
                'state_changed',
                (snapshot) => {},
                (error) => {
                    toast.error('Could not upload image (File must be less than 12MB)');
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        toast.success('Uploaded 👌');
                        resolve(downloadURL);
                    });
                },
            );
        } catch (error) {
            reject(error);
        }
    });
    return getUrl.then((url) => {
        if (url) {
            console.log(url);
            return { success: 1, file: { url } };
        }
    });
};

export const tools = {
    embed: Embed,
    list: {
        class: List,
        inlineToolbar: true,
    },
    header: {
        class: Header,
        config: {},
        placeholder: 'Type your blog heading ...',
        levels: [2, 3],
        defaultLevel: 2,
    },
    image: {
        class: Image,
        config: {
            uploader: { uploadByUrl: uploadImageURL, uploadByFile: uploadImageFile },
        },
    },
    quote: {
        class: Quote,
        inlineToolbar: true,
    },
    marker: Marker,
    inlineCode: InlineCode,
};
