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

/**
 * To be used for internal lil-js-it-interface only, unless you know what you're doing. Never NEVER pass any user input into any of the functions in this class.
 */
declare class ItunesCOMObjectInterface {
    /**
     * Runs a powershell script with the itunes object preloaded
     * i.e. if you input `"play()"` the itunes music will play, and if you input `["pause()", "play()"]` it will quickly pause then play again.
     * @param input A string with the property you want to get/run or a string array with the properties you want to get/run
     * @param echo A boolean that tells the script weither or not it should return the response of the powershell script
     * @returns an array of whats returned if you input an array, or a string if you input a string 
     */
    runItunesPowershellScript(input: string | string[], echo?: boolean | undefined): string | string[]

    /**
     * Assumes that all the properties exist and actually return something.
     * @param props A list of properties to get from the Itunes object
     * @returns A dict of the requested properties as the keys with the values as returned from Itunes 
     */
    getItunesProperties(props: string[]): {[prop: string]: string}
}

/**
 * Player Controls Interface For Itunes (PCIFI)
 * Lets you see and control (most) stuff that would be in Player Controls within Itunes 
 */
declare class ItunesPlayerControls {
    /** Parent Itunes Interface */
    ITInterface: ItunesInterface;
    /** Function for passing commands to Itunes */
    itunes: Function;

    /**
     * Plays the currently queued song
     */
    Play(): void;

    /**
     * Pauses the currently queued song
     */
    Pause(): void;

    /**Starts the previous track */
    PreviousTrack(): void;

    /**
     * Starts the next track
     */
    NextTrack(): void;

    /**
     * Gets the current volume
     */
    GetVolume(): number;

    /**
     * Sets the current volume
     * @param volume Volume of which to pass to itunes
     */
    SetVolume(volume: number): void;

    /**
     * Gets the currently playing song
     */
    GetSong(): Itunes.Song;

    /** 
     * Checks if the audio from itunes is muted
     * */ 
    IsMuted(): boolean;

    /**
     * Toggles the mute for itunes, see `IsMuted`
     */
    ToggleMute(): void;

    /**
     * Gets the current player position of the song returned in seconds
     */
    GetPlayerPosition(): number;

    /**
     * Sets the current player position in Itunes
     * @param position Position to pass to itunes
     */
    SetPlayerPosition(position: number): void;

    /**
     * Returns a boolean of whether or not the current song is playing
     */
    IsPlaying(): boolean;

    /**
     * Returns a boolean of whether or not a song is currently playing/queued to play
     */
    IsSongReady(): boolean;
}   

export default class ItunesInterface {
    PlayerControls: ItunesPlayerControls;
    COMObject: ItunesCOMObjectInterface;

    /**
     * Converts Seconds into a M:SS format
     * @param secs Seconds
     * @returns Formatted String
     */
    convertSecondsToM_S(secs: number): string
}