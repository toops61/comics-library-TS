import logoBDtheque from "../assets/bdgest_mini.webp";
import { Link } from "react-router-dom";
import { comicsFields } from "../utils/interfaces";
import { useAppSelector } from "../redux/hooks";
import { getComicName } from "../utils/utilsFuncs";

interface comicProps {
    comic:comicsFields;
    setFullscreen:(comic:comicsFields|null) => void;
}

export default function Comic({comic,setFullscreen}:comicProps) {
    const connected = useAppSelector(state => state.generalParamsSlice.connected);

    return (
        <div className="comic">
            <div className="image-container" onClick={() => setFullscreen(comic)} tabIndex={0}>
                <img src={comic.coverURL} alt="cover" />
            </div>
            <p tabIndex={0}>{(comic.serie !== 'autre' && comic.serie !== 'special' && comic.serie !== 'spider-man') || comic.sub_category ? (getComicName(comic.sub_category || comic.serie) + ' ') : ''}{comic.album}</p>
            <p>{comic.year}</p>
            {connected && <Link to="/createComic">
                <div className="modify-comic" onClick={() => sessionStorage.setItem('modifiedComic',JSON.stringify(comic))}></div>
            </Link>}
            {comic.bedetheque && <a href={comic.bedetheque} target="_blank" rel="noreferrer" className="bdtheque-link"><img src={logoBDtheque} alt="bedetheque" /></a>}
        </div>
    )
    
}
