# Little's Javascript Itunes Interface

A Itunes COM Object Interface Written In Typescript. 

Install via
```bash
npm i lil-js-it-interface
```

Import the interface
```js
import { ItunesInterface } from 'lil-js-it-interface'; 
```

Do stuff with the `PlayerControls`
```js
const itunesinterface = new ItunesInterface()

console.log(itunesinterface.PlayerControls.GetSong().name)
// -> Name of the currently playing song

itunesinterface.PlayerControls.Play()
// -> Plays the currently queued song

itunesinterface.PlayerControls.Pause()
// -> Pause the current song

// And theres more functions in `PlayerControls`...

```

`PlayerControls` has most of the current functions, more will be added to the actual interface sometime in the future probably.