/* eslint-disable react/prop-types */
import { CopyBlock, dracula } from 'react-code-blocks';

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
                <img src={block.data.file.url} className="aspect-video object-cover" />
                {block.data.caption.length && (
                    <i
                        className="mt-2 text-md text-gray-500 block text-center"
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
                    className={'text-' + block.data.alignment + ` text-xl leading-10 md:text-2xl`}
                >{`“${block.data.text}”`}</blockquote>
                {block.data.caption.length && (
                    <i
                        className="mt-2 text-md text-gray-500 block text-right"
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

    if (type === 'table' && block.data.withHeadings) {
        const numCols = block.data.content[0].length;
        return (
            <table style={{ border: '1px solid', width: '100%', tableLayout: 'fixed' }}>
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
                                    <th key={i} style={{ border: '1px solid' }}>
                                        {col}
                                    </th>
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
                                    <td key={i} style={{ border: '1px solid' }}>
                                        {col}
                                    </td>
                                ))}
                            </tr>
                        ) : null,
                    )}
                </tbody>
            </table>
        );
    } else {
        const numCols = block.data.content[0].length;
        return (
            <table style={{ border: '1px solid', width: '100%', tableLayout: 'fixed' }}>
                <colgroup>
                    {Array.from({ length: numCols }, (_, index) => (
                        <col key={index} style={{ width: `${100 / numCols}%` }} />
                    ))}
                </colgroup>
                <tbody style={{ border: '1px solid' }}>
                    {block.data.content.map((row, idx) => (
                        <tr key={idx} style={{ border: '1px solid' }}>
                            {row.map((col, i) => (
                                <td key={i} style={{ border: '1px solid' }}>
                                    {col}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }
}
