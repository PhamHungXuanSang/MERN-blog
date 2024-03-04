import { Button } from 'flowbite-react';

export default function NotFound({ object }) {
    return (
        <Button className="rounded-full w-full mt-4" disabled gradientDuoTone="greenToBlue">
            {object}
        </Button>
    );
}
