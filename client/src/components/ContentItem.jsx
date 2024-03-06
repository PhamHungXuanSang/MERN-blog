import { CodeBlock, CopyBlock, dracula } from 'react-code-blocks';

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

    if (type == 'list') {
        return (
            <ul>
                {block.data.items.map((item, i) => {
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
        return <CodeBlock text={block.data.html} showLineNumbers={true} theme={dracula} wrapLines />;
    }
}
