/* eslint-disable react/prop-types */
import { CopyBlock, dracula } from 'react-code-blocks';
import { IoIosWarning } from 'react-icons/io';

export default function ContentItem({ type, block }) {
    if (type == 'header') {
        switch (block.data.level) {
            case 1:
                return (
                    <h1
                        dangerouslySetInnerHTML={{ __html: block.data.text }}
                        className={'text-3xl font-bold text-' + `${block.tunes.textAlignment.alignment}`}
                    ></h1>
                );
            case 2:
                return (
                    <h2
                        dangerouslySetInnerHTML={{ __html: block.data.text }}
                        className={'text-2xl font-bold text-' + `${block.tunes.textAlignment.alignment}`}
                    ></h2>
                );
            case 3:
                return (
                    <h3
                        dangerouslySetInnerHTML={{ __html: block.data.text }}
                        className={'text-xl font-bold text-' + `${block.tunes.textAlignment.alignment}`}
                    ></h3>
                );
            case 4:
                return (
                    <h4
                        dangerouslySetInnerHTML={{ __html: block.data.text }}
                        className={'text-lg font-bold text-' + `${block.tunes.textAlignment.alignment}`}
                    ></h4>
                );
            case 5:
                return (
                    <h5
                        dangerouslySetInnerHTML={{ __html: block.data.text }}
                        className={'text-base font-bold text-' + `${block.tunes.textAlignment.alignment}`}
                    ></h5>
                );
        }
    }

    if (type == 'paragraph') {
        return (
            <p
                dangerouslySetInnerHTML={{ __html: block.data.text }}
                className={'text-' + `${block.tunes.textAlignment.alignment}`}
            ></p>
        );
    }

    if (type == 'list' && block.data.style == 'ordered') {
        return (
            <ul>
                {block.data.items.map((item, i) => {
                    item = i + 1 + '. ' + item;
                    return <li key={i} dangerouslySetInnerHTML={{ __html: item }}></li>;
                })}
            </ul>
        );
    } else if (type == 'list' && block.data.style != 'ordered') {
        return (
            <ul>
                {block.data.items.map((item, i) => {
                    item = '• ' + item;
                    return <li key={i} dangerouslySetInnerHTML={{ __html: item }}></li>;
                })}
            </ul>
        );
    }

    if (type == 'image') {
        return (
            <>
                <div className={block.data.withBackground ? 'w-full bg-[#cdd1e0]' : 'w-fit'}>
                    <img
                        src={block.data.file.url}
                        className={
                            (block.data.withBorder ? 'border dark:border-white border-slate-700 ' : '') +
                            'aspect-video object-cover mx-auto' +
                            (block.data.stretched ? ' w-full' : '')
                        }
                    />
                </div>
                {block.data.caption.length && (
                    <i
                        className={'text-' + block.tunes.textAlignment.alignment + ' mt-2 text-md block'}
                        dangerouslySetInnerHTML={{ __html: block.data.caption }}
                    ></i>
                )}
            </>
        );
    }

    if (type == 'quote') {
        return (
            <>
                <blockquote
                    className={'text-' + block.data.alignment + ' text-xl leading-10 md:text-2xl'}
                    dangerouslySetInnerHTML={{ __html: `“${block.data.text}”` }}
                ></blockquote>
                {block.data.caption.length && (
                    <i
                        className={'text-' + block.tunes.textAlignment.alignment + ' mt-2 text-md block'}
                        dangerouslySetInnerHTML={{ __html: block.data.caption }}
                    ></i>
                )}
            </>
        );
    }

    if (type == 'raw') {
        return <CopyBlock text={block.data.html} codeBlock />;
    }

    if (type == 'code') {
        return <CopyBlock text={block.data.code} showLineNumbers={true} theme={dracula} codeBlock />;
    }

    if (type == 'warning') {
        return (
            <div className="flex gap-2 dark:bg-slate-800 bg-slate-100 md:p-4 p-1 rounded-xl shadow-md">
                <IoIosWarning size={32} fill="yellow" className="min-w-8" />
                <b dangerouslySetInnerHTML={{ __html: block.data.title }} className="text-lg min-w-20 w-fit"></b>
                <p dangerouslySetInnerHTML={{ __html: block.data.message }} className="text-base"></p>
            </div>
        );
    }

    if (type === 'table' && block.data.withHeadings) {
        const numCols = block.data.content[0].length;
        return (
            <table
                style={{ border: '1px solid', width: '100%', tableLayout: 'fixed' }}
                className={'text-' + block.tunes.textAlignment.alignment}
            >
                <colgroup>
                    {Array.from({ length: numCols }, (_, index) => (
                        <col key={index} style={{ width: `${100 / numCols}%` }} />
                    ))}
                </colgroup>
                <thead style={{ border: '1px solid' }}>
                    {block.data.content.map((row, idx) =>
                        idx === 0 ? (
                            <tr key={idx} style={{ border: '1px solid' }}>
                                {row.map((col, i) => (
                                    <th
                                        key={i}
                                        style={{ border: '1px solid' }}
                                        dangerouslySetInnerHTML={{ __html: col }}
                                    ></th>
                                ))}
                            </tr>
                        ) : null,
                    )}
                </thead>
                <tbody style={{ border: '1px solid' }}>
                    {block.data.content.map((row, idx) =>
                        idx > 0 ? (
                            <tr key={idx} style={{ border: '1px solid' }}>
                                {row.map((col, i) => (
                                    <td
                                        key={i}
                                        style={{ border: '1px solid' }}
                                        dangerouslySetInnerHTML={{ __html: col }}
                                    ></td>
                                ))}
                            </tr>
                        ) : null,
                    )}
                </tbody>
            </table>
        );
    } else if (type === 'table') {
        const numCols = block.data.content[0].length;
        return (
            <table
                style={{ border: '1px solid', width: '100%', tableLayout: 'fixed' }}
                className={'text-' + block.tunes.textAlignment.alignment}
            >
                <colgroup>
                    {Array.from({ length: numCols }, (_, index) => (
                        <col key={index} style={{ width: `${100 / numCols}%` }} />
                    ))}
                </colgroup>
                <tbody style={{ border: '1px solid' }}>
                    {block.data.content.map((row, idx) => (
                        <tr key={idx} style={{ border: '1px solid' }}>
                            {row.map((col, i) => (
                                <td
                                    key={i}
                                    style={{ border: '1px solid' }}
                                    dangerouslySetInnerHTML={{ __html: col }}
                                ></td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    if (type == 'embed') {
        return (
            <div className={`text-${block.tunes.textAlignment.alignment}`}>
                <div className="inline-block">
                    <iframe
                        src={block.data.embed}
                        width={block.data.width}
                        height={block.data.height}
                        allowFullScreen={true}
                        style={{ maxWidth: '100%', maxHeight: '100%' }}
                    ></iframe>
                </div>
                <i className="mt-2 text-md block" dangerouslySetInnerHTML={{ __html: block.data.caption }}></i>
            </div>
        );
    }

    if (type === 'alert') {
        const alertTypes = {
            primary: 'border-[#4299e1] bg-[#ebf8ff] text-[#2b6cb0]',
            secondary: 'border-[#cbd5e0] bg-[#f7fafc] text-[#222731]',
            info: 'border-[#4cd4ce] bg-[#e6fdff] text-[#00727c]',
            success: 'border-[#68d391] bg-[#f0fff4] text-[#2f855a]',
            warning: 'border-[#ed8936] bg-[#fffaf0] text-[#c05621]',
            danger: 'border-[#fc8181] bg-[#fff5f5] text-[#c53030]',
            light: 'border-[#edf2f7] bg-[#fff] text-[#1a202c]',
            dark: 'border-[#1a202c] bg-[#2d3748] text-[#d3d3d3]',
        };
        const alignClass = {
            left: 'text-left',
            center: 'text-center',
            right: 'text-right',
        };
        const alertType = alertTypes[block.data.type] || alertTypes.primary;
        const alignment = alignClass[block.data.align] || alignClass.left;

        return (
            <div
                className={`p-[10px] rounded-[5px] mb-[10px] border ${alertType} ${alignment}`}
                dangerouslySetInnerHTML={{ __html: block.data.message }}
            ></div>
        );
    }

    if (type == 'checklist') {
        let listItems = '';
        block.data.items.forEach((item) => {
            listItems += `
                <li class='list-group-item'>
                    <input
                        class='form-check-input me-2'
                        type='checkbox'
                        ${item.checked && 'checked'}
                    />
                    <label class='form-check-label'>
                        ${item.text}
                    </label>
                </li>
            `;
        });
        return <ul className="list-group mb-3" dangerouslySetInnerHTML={{ __html: listItems }}></ul>;
    }
}
