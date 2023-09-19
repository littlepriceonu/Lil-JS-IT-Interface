import { spawnSync } from 'child_process';
import { Itunes } from './types';

class ItunesPlayerControls {
    ITInterface: ItunesInterface;
    itunes: Function;

    constructor (Interface: ItunesInterface) {
        this.ITInterface = Interface
        this.itunes = this.ITInterface.COMInterface.runItunesPowershellScript
    }

    Play() {
        this.itunes("play()")
    }

    Pause() {
        this.itunes("pause()")
    }

    PreviousTrack() {
        this.itunes("BackTrack()")
    }

    NextTrack() {
        this.itunes("NextTrack()")
    }

    GetVolume() {
        return parseInt(this.itunes("SoundVolume", true))
    }

    SetVolume(volume: number) {
        this.itunes(`SoundVolume = ${volume}`)
    }

    GetSong(): Itunes.Song {
        const props = this.ITInterface.COMInterface.getItunesProperties(["CurrentTrack.Name", "CurrentTrack.Album", "CurrentTrack.Artist", "CurrentTrack.Duration", "CurrentTrack.Time", "CurrentTrack.Genre", "CurrentTrack.Year", "CurrentTrack.TrackCount", "CurrentTrack.TrackNumber"])

        const songData: Itunes.Song = {
            name: props["CurrentTrack.Name"],
            album: props["CurrentTrack.Album"],
            artist: props["CurrentTrack.Artist"],
            genre: props["CurrentTrack.Genre"],
            year: props["CurrentTrack.Year"],
            
            time: props["CurrentTrack.Time"],
            duration: parseInt(props["CurrentTrack.Duration"]),

            trackCount: parseInt(props["CurrentTrack.TrackCount"]),
            trackNumber: parseInt(props["CurrentTrack.TrackNumber"]),
        }

        return songData
    
    }

    IsMuted(): boolean {
        const muted = this.itunes(`Mute`, true)

        if (muted == "False") {
            return false
        }

        return true
    }

    ToggleMute() {
        if (this.IsMuted()) {
            this.itunes(`Mute = $False`)
            return
        }

        this.itunes(`Mute = $True`)
        return
    }

    GetPlayerPosition(): number {
        return parseInt(this.itunes("PlayerPosition", true))
    }

    SetPlayerPosition(position: number) {
        this.itunes(`PlayerPosition = ${position}`)
    }

    IsPlaying(): boolean {
        if (this.itunes(`PlayerState`) == "1") {
            return true
        }
        return false
    }

    IsSongReady(): boolean {
        if (this.itunes("CurrentTrack", true)) {
            return true
        }

        return false
    }
}

// This is for interal usage only, `ItunesInterface` contains an instance of this class anyway.
class ItunesCOMObjectInterface {
    constructor () {
        
    }

    /**
     * Runs a powershell script with the itunes object preloaded
     * i.e. if you input `"play()"` the itunes music will play, and if you input `["pause()", "play()"]` it will quickly pause then play again.
     * @param input A string with the property you want to get/run or a string array with the properties you want to get/run
     * @param echo A boolean that tells the script weither or not it should return the response of the powershell script
     * @returns an array of whats returned if you input an array, or a string if you input a string 
     */
    runItunesPowershellScript(input: string | string[], echo?: boolean | undefined): string | string[] {
        if (typeof input == "object") {
            let compiledInputString = ""

            input.forEach(prop => {
                compiledInputString += `$itunes.${prop};`
            })

            const data = spawnSync(`$itunes = New-Object -ComObject iTunes.Application;${compiledInputString}`, {shell: 'powershell.exe'})

            if (echo) {
                let splitData = data.output.toString().slice(1).slice(0, -1).trimEnd().split("\r\n")

                return splitData
            }

            return 
        }

        const data = spawnSync(`$itunes = New-Object -ComObject iTunes.Application;$itunes.${input}`, {shell: 'powershell.exe'})

        if (data.error) {
            console.warn(`[RUN_POWERSHELL_SCRIPT] Error running a powershell script, error recieved: ${data.error}`)
        }

        if (echo) {
            return data.output.toString().slice(1).slice(0, -1).trimEnd()
        }
    }

    /**
     * Assumes that all the properties exist and actually return something.
     * @param props A list of properties to get from the Itunes object
     * @returns A dict of the requested properties as the keys with the values as returned from Itunes 
     */
    getItunesProperties(props: string[]): {[prop: string]: string} {
        const returns = <string[]>this.runItunesPowershellScript(props, true)
        
        var properties: {[prop: string]: string} = {}

        returns.forEach((returned, i)=>{
            properties[props[i]] = returned
        })

        return properties
    }
}

class ItunesInterface {
    PlayerControls: ItunesPlayerControls;
    COMInterface: ItunesCOMObjectInterface;

    constructor () {
        this.COMInterface = new ItunesCOMObjectInterface()
        this.PlayerControls = new ItunesPlayerControls(this)
    }

    /**
     * Converts Seconds into a M:SS format
     * @param secs Seconds
     * @returns Formatted String
     */
    convertSecondsToM_S(secs: number): string {
        var x = Math.floor(secs/60)
        var y = secs - (x*60)

        if (y < 10) {
            return `${x}:0${y}`
        }

        return `${x}:${y}`
    }
}

export {ItunesInterface, ItunesPlayerControls}
export default ItunesInterface