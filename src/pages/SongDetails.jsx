import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { DetailsHeader, Error, Loader, RelatedSongs } from "../components";
import { setActiveSong, playPause } from "../redux/features/playerSlice";
import { useGetSongDetailsQuery, useGetSongsRelatedQuery } from "../redux/services/shazamCore";
const SongDetails = () => {
    const dispatch = useDispatch();
    const { songid } = useParams();
    const { activeSong, isPlaying } = useSelector((state) => state.player);
    const { data: dataSong, isFetching: isFetchingSongDetails } = useGetSongDetailsQuery({
        songid,
    });
    const { data, isFetching: isFetchingSongRelated, error } = useGetSongsRelatedQuery({ songid });

    const handlePlayClick = (song, i) => {
        dispatch(playPause(true));
        dispatch(setActiveSong({ song, data, i }));
    };
    const handlePauseClick = () => {
        dispatch(playPause(false));
    };

    if (isFetchingSongRelated || isFetchingSongDetails)
        return <Loader title="Loading songs details ..." />;
    if (error) return <Error />;

    return (
        <div className="flex flex-col">
            <DetailsHeader artistId="" songData={dataSong} />
            <div className="mt-10">
                <h2 className="text-white text-3xl font-bold">Lyrics:</h2>
                <div className="mt-5">
                    {dataSong?.sections[1].type === "LYRICS" ? (
                        dataSong?.sections[1].text.map((line, i) => (
                            <p className="text-base text-gray-400 my-1" key={i}>
                                {line}
                            </p>
                        ))
                    ) : (
                        <p className="text-base text-gray-400 my-1">Sorry,lyrics not found</p>
                    )}
                </div>
            </div>

            <RelatedSongs
                data={data}
                //  artistId={artistId}
                isPlaying={isPlaying}
                activeSong={activeSong}
                handlePauseClick={handlePauseClick}
                handlePlayClick={handlePlayClick}
            />
        </div>
    );
};

export default SongDetails;
