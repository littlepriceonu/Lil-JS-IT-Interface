export namespace Itunes {
    interface Song {
        // Name of the current song
        name: string,
        // Album name of the current song
        album: string,
        // Artist of the song
        artist: string,
        // Genre of the song
        genre: string,
        // Release year of the song
        year: string,

        // Duration of the song formatted as M:SS
        time: string,
        // Duration of the song in seconds
        duration: number,
    
        // Amount of tracks in the current album
        trackCount: number,
        // Current track number in the current album
        trackNumber: number
    }
}