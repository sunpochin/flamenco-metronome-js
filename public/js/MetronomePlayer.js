import MetronomeWorker from './MetronomeWorker.js';

let self = null;
export default class MetronomePlayer {
    /**
     * 
     * @param soundFiles
     * @param sounds
     * @param visualSettings
     * @param soundIdx 
     * @param visualSelect 
     * @param startStopID
     */
    constructor(soundFiles, sounds, visualSettings, soundIdx, 
        visualSelect, startStopID) {
        // console.log('constructor: ' );
        self = this;

        this.visualSettings = visualSettings;
        this.soundIdx = soundIdx || 'soundSelect';
        this.sounds = sounds;
//        console.log('this.soundIdx: ', this.soundIdx);
        this.visualSelect = visualSelect || 'visType';
        this.startStopID = startStopID || 'metronome';

        const metroSoundListener = {
            setTempo: (t) => visualSettings.tempoBpm = t,
            setStartTime: (t) => visualSettings.startTime = t
        };
        self.metroWorker = new MetronomeWorker(soundFiles, sounds, metroSoundListener);
        //gmetroWorker = new MetronomeWorker(soundFiles, sounds, metroSoundListener);

        visualSettings.getTime = () => this.metroWorker.audioContext.currentTime;

        this.datas = [];
        this.loadJson();

        const visTypeSelect = $('#' + this.visualSelect);
        visTypeSelect.append('<option>None</option>');
        visualSettings.names.map((visTypeName, index) => {
            const sel = index === 0 ? ' selected' : '';
            visTypeSelect.append(`<option${sel}>${visTypeName}</option>`);
        });

        var btnplaymetronome = document.getElementById('playmetronome');
        btnplaymetronome.addEventListener("click", function() {
            self.startStop();
        });

    }

    setAudioContext(audio) {
        self.metroWorker.setAudioContext(audio);
    }

    SetupSelection() {
        // Setting up selection of HTML.
        // CompasPattern: AsPalo, OnBeat.
        const CompasPattern = $('#' + 'CompasPattern');
        CompasPattern.append(`<option>AsPalo</option>`);
        CompasPattern.append(`<option>OnBeat</option>`);

        console.log('cnt: ', this.datas.length)
        for (let element of this.datas) {
            const soundSelect = $('#' + this.soundIdx + element["no"]);
            console.log('soundSelect: ', soundSelect);
            for (const name of this.sounds) {
                const fileExtension = /\..*/;
                const optionText = name.replace('_', ' ').replace(fileExtension, '');
                console.log('optionText: ', optionText);
                soundSelect.append(`<option>${optionText}</option>`);
            }
            // soundSelect.append(`<option>${optionText}</option>`);
        }
    }

    async loadJson() {
        const getJson = async () => {
            return fetch("res/compas-table.json")
            .then(response => response.json())
            .then(json => {
                this.datas = json;
                // console.log('json: ', json)
                // console.log('this.datas: ', this.datas)
//                this.tableCreate();

                // this.addHeader();
                // this.rowsCreate2(this.datas);
            });
        }
        await getJson();

        this.SetupSelection();
    }
    
    onclick(e) {
        console.log('onclick! ', e);
        alert(this.constructor.name); // SomeClass
    }

    /**
     * @param bpm 
     */
    setTempo(bpm) {
        this.metroWorker.setTempo(bpm);
    }

    /**
     * Setting palo pattern.
     * @param palo 
     */
    setPalo(palo) {
        this.metroWorker.setPalo(palo);
    }

    /**
     * Sets the metronome sound.
     * @param number the one-based sound index
     */
    setSound(number) {
        this.metroWorker.setSound(number);
    }

    /**
     * @param index the visualization to use
     */
    setVisualization(index) {
        this.visualSettings.visualizationType = index;
    }

    // start of stop the beating.
    startStop() {
        this.metroWorker.startStop();
        $('#' + this.startStopID).val(this.metroWorker.running ? 'Stop' : 'Start')
    }
}

