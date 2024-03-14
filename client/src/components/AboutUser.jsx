import { Link } from 'react-router-dom';
import { FaFacebookSquare, FaGithubSquare, FaTiktok, FaYoutube } from 'react-icons/fa';
import formatDate from '../utils/formatDate.js';

export default function AboutUser({
    className,
    userDesc,
    youtubeLink,
    facebookLink,
    tiktokLink,
    githubLink,
    createdAt,
}) {
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