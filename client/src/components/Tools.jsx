/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */
import Paragraph from '@editorjs/paragraph';
import AlignmentBlockTune from 'editorjs-text-alignment-blocktune';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import ImageTool from '@editorjs/image';
import Quote from '@editorjs/quote';
import Marker from '@editorjs/marker';
import InlineCode from '@editorjs/inline-code';
import RawTool from '@editorjs/raw';
import CodeTool from '@editorjs/code';
import Table from '@editorjs/table';
import Warning from '@editorjs/warning';
import Embed from '@editorjs/embed';
import Alert from 'editorjs-alert';
import Underline from '@editorjs/underline';
import ChangeCase from 'editorjs-change-case';
import Checklist from '@editorjs/checklist';
import Strikethrough from '@sotaproject/strikethrough';
import ColorPlugin from 'editorjs-text-color-plugin';
import Tooltip from 'editorjs-tooltip';
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
                image: 'center',
                quote: 'center',
                table: 'center',
                embed: 'center',
            },
        },
    },
    Color: {
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
                '#FFFFFF',
                '#000000',
                '#FFEB3B',
                '#FFC107',
                '#FF9800',
                '#FF5722',
                '#795548',
                '#9E9E9E',
                '#607D8B',
            ],
            defaultColor: '#FF1300',
            type: 'text',
            customPicker: true,
        },
    },
    Marker: {
        class: ColorPlugin,
        config: {
            defaultColor: '#FFBF00',
            type: 'marker',
            icon: `<svg fill="#000000" height="200px" width="200px" version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M17.6,6L6.9,16.7c-0.2,0.2-0.3,0.4-0.3,0.6L6,23.9c0,0.3,0.1,0.6,0.3,0.8C6.5,24.9,6.7,25,7,25c0,0,0.1,0,0.1,0l6.6-0.6 c0.2,0,0.5-0.1,0.6-0.3L25,13.4L17.6,6z"></path> <path d="M26.4,12l1.4-1.4c1.2-1.2,1.1-3.1-0.1-4.3l-3-3c-0.6-0.6-1.3-0.9-2.2-0.9c-0.8,0-1.6,0.3-2.2,0.9L19,4.6L26.4,12z"></path> </g> <g> <path d="M28,29H4c-0.6,0-1-0.4-1-1s0.4-1,1-1h24c0.6,0,1,0.4,1,1S28.6,29,28,29z"></path> </g> </g></svg>`,
        },
    },
    paragraph: {
        class: Paragraph,
        tunes: ['textAlignment'],
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
        inlineToolbar: true,
        tunes: ['textAlignment'],
        config: {
            uploader: { uploadByUrl: uploadImageURL, uploadByFile: uploadImageFile },
        },
    },
    quote: {
        class: Quote,
        inlineToolbar: true,
        tunes: ['textAlignment'],
        config: {
            quotePlaceholder: 'Enter a quote',
            captionPlaceholder: "Quote's author",
        },
    },
    raw: RawTool,
    code: CodeTool,
    inlineCode: {
        class: InlineCode,
    },
    table: {
        class: Table,
        inlineToolbar: true,
        tunes: ['textAlignment'],
        config: {
            rows: 2,
            cols: 3,
            withHeadings: true,
        },
    },
    warning: {
        class: Warning,
        inlineToolbar: true,
        shortcut: 'CMD+SHIFT+W',
        config: {
            titlePlaceholder: 'Title',
            messagePlaceholder: 'Message',
        },
    },
    embed: {
        class: Embed,
        inlineToolbar: true,
        tunes: ['textAlignment'],
        config: {
            services: {
                youtube: true,
                facebook: true,
                github: true,
                instagram: true,
                twitter: true,
                codepen: true,
            },
        },
    },
    alert: {
        class: Alert,
        inlineToolbar: true,
        shortcut: 'CMD+SHIFT+A',
        config: {
            defaultType: 'primary',
            messagePlaceholder: 'Enter something',
        },
    },
    checklist: {
        class: Checklist,
        inlineToolbar: true,
    },
    underline: {
        class: Underline,
    },
    strikethrough: {
        class: Strikethrough,
    },
    changeCase: {
        class: ChangeCase,
    },
    tooltip: {
        class: Tooltip,
        config: {
            location: 'top',
            placeholder: 'Enter a tooltip',
            // highlightColor: '#FFEFD5',
            // backgroundColor: '#154360',
            // textColor: '#FDFEFE',
            holder: 'textEditor',
        },
    },
};
