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
        // mimicing private variables: https://stackoverflow.com/a/28165599/720276
        let _datas = [];
        self.setDatas = function(datas) { _datas = datas; }
        self.getDatas = function() { return _datas; }
        self.getDataByIdx = function(idx) { return _datas[idx]; }
        self.insertDatas = function(idx, aCompas) { 
            _datas.splice(idx, 0, aCompas); 
        }

        self.visualSettings = visualSettings;
        self.soundIdx = soundIdx || 'soundSelect';
        self.sounds = sounds;
//        console.log('self.soundIdx: ', self.soundIdx);
        self.visualSelect = visualSelect || 'visType';
        self.startStopID = startStopID || 'metronome';

        const metroSoundListener = {
            setTempo: (t) => visualSettings.tempoBpm = t,
            setStartTime: (t) => visualSettings.startTime = t
        };
        self.metroWorker = new MetronomeWorker(soundFiles, sounds, metroSoundListener);
        //gmetroWorker = new MetronomeWorker(soundFiles, sounds, metroSoundListener);

        visualSettings.getTime = () => self.metroWorker.audioContext.currentTime;

        self.loadJson();

        const visTypeSelect = $('#' + self.visualSelect);
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


    // https://stackoverflow.com/questions/14643617/create-table-using-javascript
    // https://www.valentinog.com/blog/html-table/
    generateTableHead(table, data) {
        let thead = table.createTHead();
        let row = thead.insertRow();
        let th = document.createElement("th");
        let text = document.createTextNode('Here:');
        th.appendChild(text);
        row.appendChild(th);
        for (let key of data) {
            let th = document.createElement("th");
            let text = document.createTextNode(key);
            th.appendChild(text);
            row.appendChild(th);
        }
    }
    
    generateTable(table, data) {
        for (let element of data) {
            let row = table.insertRow();
            let cell = row.insertCell();
            for (let key in element) {
                let cell = row.insertCell();
                let text = document.createTextNode(element[key]);
                cell.appendChild(text);
            }
        }
    }
    
    tableCreate() {
        let table = document.querySelector("table");
        let firstdata = self.getDataByIdx(0);
        let data = Object.keys(firstdata);
        console.log('firstdata: ', firstdata, ', data: ', data )

        self.generateTableHead(table, data);
        self.generateTable(table, self.getDatas() );
    }


    SetupSelection() {
        // Setting up selection of HTML.
        // CompasPattern: AsPalo, OnBeat.
        const CompasPattern = $('#' + 'CompasPattern');
        CompasPattern.append(`<option>AsPalo</option>`);
        CompasPattern.append(`<option>OnBeat</option>`);

        console.log('cnt: ', self.datas.length)
        for (let element of self.datas) {
            const soundSelect = $('#' + self.soundIdx + element["no"]);
            console.log('soundSelect: ', soundSelect);
            for (const name of self.sounds) {
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
                self.setDatas(json);
                // console.log('json: ', json)
                // console.log('self.datas: ', self.datas)
                self.tableCreate();
            });
        }
        await getJson();
        self.SetupSelection();
    }
    
    /**
     * @param bpm 
     */
    setTempo(bpm) {
        self.metroWorker.setTempo(bpm);
    }

    /**
     * Setting palo pattern.
     * @param palo 
     */
    setPalo(palo) {
        self.metroWorker.setPalo(palo);
    }

    /**
     * Sets the metronome sound.
     * @param number the one-based sound index
     */
    setSound(number) {
        self.metroWorker.setSound(number);
    }

    /**
     * @param index the visualization to use
     */
    setVisualization(index) {
        self.visualSettings.visualizationType = index;
    }

    // start of stop the beating.
    startStop() {
        self.metroWorker.startStop();
        $('#' + self.startStopID).val(self.metroWorker.running ? 'Stop' : 'Start')
    }
}

