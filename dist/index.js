"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItunesPlayerControls = exports.ItunesInterface = void 0;
const child_process_1 = require("child_process");
class ItunesPlayerControls {
    constructor(Interface) {
        this.ITInterface = Interface;
        this.itunes = this.ITInterface.COMInterface.runItunesPowershellScript;
    }
    Play() {
        this.itunes("play()");
    }
    Pause() {
        this.itunes("pause()");
    }
    PreviousTrack() {
        this.itunes("BackTrack()");
    }
    NextTrack() {
        this.itunes("NextTrack()");
    }
    GetVolume() {
        return parseInt(this.itunes("SoundVolume", true));
    }
    SetVolume(volume) {
        this.itunes(`SoundVolume = ${volume}`);
    }
    GetSong() {
        const props = this.ITInterface.COMInterface.getItunesProperties(["CurrentTrack.Name", "CurrentTrack.Album", "CurrentTrack.Artist", "CurrentTrack.Duration", "CurrentTrack.Time", "CurrentTrack.Genre", "CurrentTrack.Year", "CurrentTrack.TrackCount", "CurrentTrack.TrackNumber"]);
        const songData = {
            name: props["CurrentTrack.Name"],
            album: props["CurrentTrack.Album"],
            artist: props["CurrentTrack.Artist"],
            genre: props["CurrentTrack.Genre"],
            year: props["CurrentTrack.Year"],
            time: props["CurrentTrack.Time"],
            duration: parseInt(props["CurrentTrack.Duration"]),
            trackCount: parseInt(props["CurrentTrack.TrackCount"]),
            trackNumber: parseInt(props["CurrentTrack.TrackNumber"]),
        };
        return songData;
    }
    IsMuted() {
        const muted = this.itunes(`Mute`, true);
        if (muted == "False") {
            return false;
        }
        return true;
    }
    ToggleMute() {
        if (this.IsMuted()) {
            this.itunes(`Mute = $False`);
            return;
        }
        this.itunes(`Mute = $True`);
        return;
    }
    GetPlayerPosition() {
        return parseInt(this.itunes("PlayerPosition", true));
    }
    SetPlayerPosition(position) {
        this.itunes(`PlayerPosition = ${position}`);
    }
    IsPlaying() {
        if (this.itunes(`PlayerState`) == "1") {
            return true;
        }
        return false;
    }
    IsSongReady() {
        if (this.itunes("CurrentTrack", true)) {
            return true;
        }
        return false;
    }
}
exports.ItunesPlayerControls = ItunesPlayerControls;
class ItunesCOMObjectInterface {
    constructor() {
    }
    runItunesPowershellScript(input, echo) {
        if (typeof input == "object") {
            let compiledInputString = "";
            input.forEach(prop => {
                compiledInputString += `$itunes.${prop};`;
            });
            const data = (0, child_process_1.spawnSync)(`$itunes = New-Object -ComObject iTunes.Application;${compiledInputString}`, { shell: 'powershell.exe' });
            if (echo) {
                let splitData = data.output.toString().slice(1).slice(0, -1).trimEnd().split("\r\n");
                return splitData;
            }
            return;
        }
        const data = (0, child_process_1.spawnSync)(`$itunes = New-Object -ComObject iTunes.Application;$itunes.${input}`, { shell: 'powershell.exe' });
        if (data.error) {
            console.warn(`[RUN_POWERSHELL_SCRIPT] Error running a powershell script, error recieved: ${data.error}`);
        }
        if (echo) {
            return data.output.toString().slice(1).slice(0, -1).trimEnd();
        }
    }
    getItunesProperties(props) {
        const returns = this.runItunesPowershellScript(props, true);
        var properties = {};
        returns.forEach((returned, i) => {
            properties[props[i]] = returned;
        });
        return properties;
    }
}
class ItunesInterface {
    constructor() {
        this.COMInterface = new ItunesCOMObjectInterface();
        this.PlayerControls = new ItunesPlayerControls(this);
    }
    convertSecondsToM_S(secs) {
        var x = Math.floor(secs / 60);
        var y = secs - (x * 60);
        if (y < 10) {
            return `${x}:0${y}`;
        }
        return `${x}:${y}`;
    }
}
exports.ItunesInterface = ItunesInterface;
const iti = new ItunesInterface();
console.log(iti.PlayerControls.GetSong().name);
exports.default = ItunesInterface;
//# sourceMappingURL=index.js.map