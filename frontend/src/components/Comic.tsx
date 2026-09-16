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

    const { serie,bedetheque,coverURL,sub_category,album,year,number } = comic;

    return (
        <div className="comic">
            <div className="image-container" onClick={() => setFullscreen(comic)} tabIndex={0}>
                <img src={coverURL} alt="cover" />
            </div>
            <p tabIndex={0}>{(serie !== 'autre' && serie !== 'special' && serie !== 'spider-man') || sub_category ? (getComicName(sub_category && sub_category !== 'none' ? sub_category : serie) + ' ') : ''}{album}</p>
            <p>{year}</p>
            {connected && <Link to="/createComic">
                <div className="modify-comic" onClick={() => sessionStorage.setItem('modifiedComic',JSON.stringify(comic))}></div>
            </Link>}
            {bedetheque && <a href={bedetheque} target="_blank" rel="noreferrer" className="bdtheque-link"><img src={logoBDtheque} alt="bedetheque" /></a>}
            {number ? <div className="comic-number"><p>{number}</p></div> : <></>}
        </div>
    )
    
}
