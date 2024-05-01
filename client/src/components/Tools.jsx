/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */
import Paragraph from '@editorjs/paragraph';
import ColorPlugin from 'editorjs-text-color-plugin';
import AlignmentBlockTune from 'editorjs-text-alignment-blocktune';
import Embed from '@editorjs/embed';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import ImageTool from '@editorjs/image';
import Quote from '@editorjs/quote';
import Marker from '@editorjs/marker';
import InlineCode from '@editorjs/inline-code';
import RawTool from '@editorjs/raw';
import CodeTool from '@editorjs/code';
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
                    toast.error('Could not upload image (File must be less than 12MB)', { duration: 6000 });
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        toast.success('Uploaded 👌', { duration: 3000 });
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
            return { success: 1, file: { url } };
        }
    });
};

export const tools = {
    textAlignment: {
        class: AlignmentBlockTune,
        config: {
            default: 'left',
            blocks: {
                header: 'center',
            },
        },
    },
    paragraph: {
        class: Paragraph,
        tunes: ['textAlignment'],
    },
    embed: {
        class: Embed,
        inlineToolbar: true,
        config: {
            services: {
                youtube: true,
                coub: true,
                codepen: {
                    regex: /https?:\/\/codepen.io\/([^\/\?\&]*)\/pen\/([^\/\?\&]*)/,
                    embedUrl:
                        'https://codepen.io/<%= remote_id %>?height=300&theme-id=0&default-tab=css,result&embed-version=2',
                    html: "<iframe height='300' scrolling='no' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'></iframe>",
                    height: 300,
                    width: 600,
                    id: (groups) => groups.join('/embed/'),
                },
            },
        },
    },
    header: {
        class: Header,
        inlineToolbar: true,
        tunes: ['textAlignment'],
        config: {
            placeholder: 'Typing a Header ...',
            levels: [1, 2, 3, 4, 5],
            defaultLevel: 1,
        },
    },
    list: {
        class: List,
        inlineToolbar: true,
    },
    image: {
        class: ImageTool,
        config: {
            uploader: { uploadByUrl: uploadImageURL, uploadByFile: uploadImageFile },
        },
    },
    quote: {
        class: Quote,
        inlineToolbar: true,
        config: {
            quotePlaceholder: 'Enter a quote',
            captionPlaceholder: "Quote's author",
        },
    },
    raw: RawTool,
    marker: Marker,
    code: CodeTool,
    inlineCode: InlineCode,
    color: {
        class: ColorPlugin,
        config: {
            colorCollections: [
                '#EC7878',
                '#9C27B0',
                '#673AB7',
                '#3F51B5',
                '#0070FF',
                '#03A9F4',
                '#00BCD4',
                '#4CAF50',
                '#8BC34A',
                '#CDDC39',
                '#FFF',
            ],
            defaultColor: '#FF1300',
            customPicker: true,
        },
    },
};
