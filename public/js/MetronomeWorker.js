
let endtime = new Date().getTime();
// let beatAlegriasTraditional = [1.5, 0.5, 1, 1.5, 0.5, 1,
//     1.0, 0.5, 0.5, 1.0, 0.5, 0.5, 1.0, 1.0 ];

let beatAlegriasTraditional = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0];
    
let beatTangos = [0, 1.0, 0.5, 0.5, 1.0, 1.0];
//let compasTempoPair = [(1, 140), (4, 180), (7, 140), (8, 70) ];
var compasTempoMap = new Map([
//    [1, 140], [2, 180], [7, 140], [8, 70]] );
//    [1, 5140], [2, 5180], [7, 5140], [8, 570]] );
    [1, 70], [5, 80], [7, 90], [11, 100],
    [13, 120], [15, 120], [17, 120],
    [29, 140], [30, 160], [31, 180], [32, 200],
    [33, 200],
] );

export default class MetronomeCore {
    constructor(soundsPath, sounds, listener) {
        this.soundsPath = soundsPath;
        const dummyListener = { setTempo: (t) => {}, setStartTime: (t) => {} };
        this.listener = listener || dummyListener;
        this.running = false;
        this.tempoBpm = 140;
        this.soundNum = 1;
        this.sounds = sounds;
        // this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        // const urls = sounds.map(name => this.soundsPath + name);
        // this.soundFiles = new AudioFiles(this.audioContext, urls);
        this.compasNo = 1;
    }

    /**
     * @param bpm tempo in beats per minute
     */
    setTempo(bpm) {
        console.log('in setTempo');
        this.tempoBpm = bpm;
    }


    setAudioContext(audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const urls = this.sounds.map(name => this.soundsPath + name);
        this.soundFiles = new AudioFiles(this.audioContext, urls);
    }

    /**
     * @param number the one-based sound index
     */
    setSound(number) {
        this.soundNum = number;
    }

    setPalo(paloType) {
        this.paloType = paloType;
    }

    updateCompasIndicator() {
        let compasTable = document.getElementById('compas-table');
        console.log('updateCompasIndicator: ', this.compasNo, ', compasTable: ', compasTable);
        let cell = compasTable.rows[this.compasNo].cells[0];
        cell.innerHTML = "==>";
    }

    playMetronome() {
        const self = this;
        let beatCounter = 0;    //
        self.updateCompasIndicator();

        // An array to represent the beating pattern of different palos.
        var beatPattern = beatAlegriasTraditional;

        let nextStart = self.audioContext.currentTime;
        function schedule() {
            const speed = compasTempoMap.get( self.compasNo );
            // console.log('typeof', typeof(self.compasNo), ' ,compas no: ', self.compasNo, ', speed: ', speed);
            // console.log('speed: ', speed)
            if (undefined !== speed ) {
                // change speed only when it's a valid Map.get() result.
                self.tempoBpm = speed;
            }
            // console.log('self.compasNo', self.compasNo, ' ,speed: ', speed, ' ,self.tempoBpm: ', self.tempoBpm);
            if (!self.running) {
                return;
            }

            self.listener.setStartTime(nextStart);
            self.listener.setTempo(self.tempoBpm);
            let bufIndex = 1; // non-heavy beat sound.
            if (bufIndex >= self.soundFiles.buffers.length) {
                alert('Sound files are not yet loaded')
            } else if (self.tempoBpm) {
                beatCounter++;
                // change compas
                if (beatPattern.length == beatCounter) {
                    beatCounter = beatCounter % beatPattern.length;
                    self.compasNo += 1;
                    self.updateCompasIndicator();
                }
                // if (beatCounter == 2 || beatCounter == 5 || beatCounter == 8 
                //     || 11 == beatCounter || 14 == beatCounter
                //     // || 0 == beatCounter
                // //     ) {
                //     // if (beatCounter == 1 || beatCounter == 4 || beatCounter == 7 
                //     //     || 10 == beatCounter || 13 == beatCounter
                if (beatCounter == 0 
                    ) {
                    bufIndex = 0;
                }
                console.log('beatCounter: ', beatCounter, ' ,bufIndex: ', bufIndex);

                self.source = self.audioContext.createBufferSource();
                self.source.buffer = self.soundFiles.buffers[bufIndex];
                self.source.connect(self.audioContext.destination);
                self.source.onended = schedule;

                nextStart += (60 / self.tempoBpm) * beatPattern[beatCounter];
                self.source.start(nextStart);

                // debugging.
                let diff = new Date().getTime() - endtime;
                endtime = new Date().getTime();
//                console.log('endtime: ', endtime, ', diff: ', diff);
            }
        }
        schedule();
    }

    startStop() {
        const ms = this;

        if (this.running = !this.running) {
            this.playMetronome();
        } else {
            this.listener.setTempo(0);
            if (this.source) {
                this.source.disconnect();
                this.source = undefined;
            }
        }
    }
}

class AudioFiles {
    constructor(context, urlList) {
        const self = this;
        self.buffers = [];

        urlList.forEach((url, index) => {
            const xhr = new XMLHttpRequest();
            xhr.responseType = "arraybuffer";
            xhr.onload = () => context.decodeAudioData(xhr.response,
                (buffer) => self.buffers[index] = buffer,
                (error) => console.error('decode Audio Data error', error));
            xhr.open("GET", url);
            xhr.send();
        });
    }
}
