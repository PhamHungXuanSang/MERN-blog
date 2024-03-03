import { Button } from 'flowbite-react';

export default function NotFoundBlog({ object }) {
    return (
        <Button className="rounded-full w-full mt-4" disabled gradientDuoTone="greenToBlue">
            No {object} blogs were found
        </Button>
    );
}
