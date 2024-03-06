import { Link } from 'react-router-dom';
import { FaFacebookSquare, FaGithubSquare, FaTiktok, FaYoutube } from 'react-icons/fa';

export default function AboutUser({
    className,
    userDesc,
    youtubeLink,
    facebookLink,
    tiktokLink,
    githubLink,
    createdAt,
}) {
    const formatDate = (dateString) => {
        const options = { timeZone: 'Asia/Ho_Chi_Minh' };
        const formattedDate = new Date(dateString).toLocaleDateString('en-US', options);
        const date = new Date(formattedDate);
        const day = date.getDate();
        const monthIndex = date.getMonth();
        const year = date.getFullYear();

        const months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];

        return `${day < 10 ? '0' + day : day} ${months[monthIndex]} ${year}`;
    };

    return (
        <div className={'md:w-[90%] md:mt-7 ' + className}>
            <p className="text-xl leading-7">{userDesc.length ? userDesc : 'No description about this account'}</p>
            <div className="flex gap-x-7 gap-y-2 flex-wrap my-7 items-center text-gray-300">
                {youtubeLink ? (
                    <Link to={youtubeLink} target="_blank">
                        <FaYoutube size={28} />
                    </Link>
                ) : (
                    ''
                )}
                {facebookLink ? (
                    <Link to={facebookLink} target="_blank">
                        <FaFacebookSquare size={28} />
                    </Link>
                ) : (
                    ''
                )}
                {tiktokLink ? (
                    <Link to={tiktokLink} target="_blank">
                        <FaTiktok size={28} />
                    </Link>
                ) : (
                    ''
                )}
                {githubLink ? (
                    <Link to={githubLink} target="_blank">
                        <FaGithubSquare size={28} />
                    </Link>
                ) : (
                    ''
                )}
            </div>
            <i>Joined on {formatDate(createdAt)}</i>
        </div>
    );
}
