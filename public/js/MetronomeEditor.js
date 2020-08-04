import MetronomeWorker from './MetronomeWorker.js';

let self = null;
export default class MetronomeEditor {
    /**
     * Creates a MetronomeEditor.
     * @param soundsPath the path used to fetch the sound files
     * @param sounds an array of sound file names
     * @param visSettings settings for the visualizer
     * @param soundSelectId the ID of the HTML select control for the sounds
     * @param visTypeSelectId the ID of the HTML select control for the visualization types
     * @param startStopId the ID of the HTML button to start and stop the metronome
     */
    constructor(soundsPath, sounds, visSettings, soundSelectId, 
        visTypeSelectId, startStopId) {
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

        self.visSettings = visSettings;
        self.soundSelectId = soundSelectId || 'soundSelect';
//        console.log('this.soundSelectId: ', this.soundSelectId);
        self.visTypeSelectId = visTypeSelectId || 'visType';
        self.startStopId = startStopId || 'metronome';
        const metroSoundListener = {
            setTempo: (t) => visSettings.tempoBpm = t,
            setStartTime: (t) => visSettings.startTime = t
        };
        self.metroWorker = new MetronomeWorker(soundsPath, sounds, metroSoundListener);

        visSettings.getTime = () => self.metroWorker.audioContext.currentTime;
        self.loadJson();
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

        console.log('cnt: ', this._datas.length)
        for (let element of this._datas) {
            const soundSelect = $('#' + this.soundSelectId + element["no"]);
            console.log('soundSelect: ', soundSelect);
            // for (const name of sounds) {
            //     const fileExtension = /\..*/;
            //     const optionText = name.replace('_', ' ').replace(fileExtension, '');
            //     console.log('optionText: ', optionText);
            //     soundSelect.append(`<option>${optionText}</option>`);
            // }
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
                // console.log('this.datas: ', this.datas)
                this.addHeader();
                this.rowsCreate2(self.getDatas() );
            });
        }
        await getJson();
        this.SetupSelection();
    }


    AddToRow(iEle, iRow) {
        iEle.className = "badge badge-danger";
        var iCol = document.createElement('div');
        iCol.className = "col-md-2";
        iCol.appendChild(iEle);
        iRow.appendChild(iCol);
    }

    // adding the header
    addHeader() {
        // adding compas sheet
        var myParent = document.body;
        var iCompasSheet = document.createElement('div');
        iCompasSheet.className="container";
        iCompasSheet.id="compassheet-header"
        myParent.appendChild(iCompasSheet);
        
        var iEle, iRow, iNo, iCol, iBtn;
        var colID = "", iSelect = "", option = "";
        // adding row.
        iRow = document.createElement('div');
        iRow.className = "row";

        // compas no.
        iEle = document.createElement('span');
        colID = "no_0" ;
        iEle.setAttribute("id", colID);
        iEle.textContent = "Compas No. ";
        iEle.addEventListener("change", function() {
            self.setSound(this.selectedIndex + 1);
        });
//        iEle.setAttribute('style', 'height:40px; width:180px');
        this.AddToRow(iEle, iRow);

        // Palo
        iEle = document.createElement('span');
        colID = "add_0" ;
        iEle.setAttribute("id", colID);
        iEle.textContent = "Palo"
        this.AddToRow(iEle, iRow);

        // Speed
        iEle = document.createElement('span');
        colID = "speed_0" ;
        iEle.setAttribute("id", colID);
        iEle.textContent = "Speed"
        this.AddToRow(iEle, iRow);

        // Subida
        iEle = document.createElement('span');
        colID = "speedtype_0" ;
        iEle.setAttribute("id", colID);
        iEle.textContent = "Subida"
        this.AddToRow(iEle, iRow);

        // add compas
        iEle = document.createElement('button');
        colID = "add_0" ;
        iEle.setAttribute("id", colID);
        iEle.className = "btn btn-info";
        iEle.textContent = "+"
        iEle.addEventListener("click", function() {
//            console.log('event: this', this, ', gmetroWorker: ', gmetroWorker);
            self.addCompas(this);
        });

        this.AddToRow(iEle, iRow);
        iCompasSheet.appendChild(iRow);
    }
    
    //https://stackoverflow.com/questions/17001961/how-to-add-drop-down-list-select-programmatically
    //https://stackoverflow.com/questions/14643617/create-table-using-javascript
    rowsCreate2(data) {
        // clear first.
        // parent = document.getElementById('Palo_2');
        // console.log("Palo_2: ", parent)
        var iCompasSheet = document.getElementById('compassheet');
        while (iCompasSheet && iCompasSheet.firstChild) {
//            console.log("parent.firstChild.remove(): " );
            iCompasSheet.firstChild.remove();
        }

        if (null === iCompasSheet) {
            console.log("iCompasSheet: ", iCompasSheet)

            iCompasSheet = document.createElement('div');
            iCompasSheet.className="container";
            iCompasSheet.id="compassheet"
            var myParent = document.body;
            myParent.appendChild(iCompasSheet);
        }

        console.log("compassheet: ", iCompasSheet)
        // var iCompasSheet = document.createElement('div');
        var arrayPalo = ["Alegrias", "Tangos", "Soleares", "Bulerias"];
        var arraySpeedType = ["Constant", "Inc. by Beat", "Inc. by Compas", "Dec. by Beat", "Dec. by Compas"];
        for (let element of this.getDatas() ) {
            console.log('element: ', element);
            var iRow, iNo, iCol, iBtn;
            var colID = "", iSelect = "", option = "";
            // adding row.
            iRow = document.createElement('div');
            iRow.className = "row";

            iNo = document.createElement('button');
            colID = "no_" + element["no"];
            // console.log('colID: ', colID);
            iNo.setAttribute("id", colID);
            iNo.className = "btn-info";
            iNo.textContent = colID;
            iNo.addEventListener("change", function() {
                self.setSound(this.selectedIndex + 1);
            });
                
            iCol = document.createElement('div');
            iCol.className = "col-md-2";
            iCol.appendChild(iNo);            
            iRow.appendChild(iCol);


            iSelect = document.createElement('select');
            colID = "Palo_" + element["no"];
            iSelect.setAttribute("id", colID);
            iSelect.setAttribute("class", "form-control-sm");
            iSelect.addEventListener("change", function() {
                self.setSound(this.selectedIndex + 1);
            });
            for (var i = 0; i < arrayPalo.length; i++) {
                option = document.createElement("option");
                option.value = arrayPalo[i];
                option.text = arrayPalo[i];
                iSelect.appendChild(option);
            }

            iCol = document.createElement('div');
            iCol.className = "col-md-2";
            // console.log('colID: ', colID);
            iCol.setAttribute("id", colID);
            iCol.appendChild(iSelect);            
            iRow.appendChild(iCol);

            
            var iInput = document.createElement('input');
            colID = "Speed_" + element["no"];
            iInput.setAttribute("id", colID);
            iInput.setAttribute("type", "text");
            iInput.setAttribute("class", "form-control");

            iCol = document.createElement('div');
            iCol.className = "col-md-2";
            // console.log('colID: ', colID);
            iCol.setAttribute("id", colID);
            iCol.appendChild(iInput);            
            iRow.appendChild(iCol);


            iSelect = document.createElement('select');
            // iSelect.setAttribute("id", rowID);
            colID = "soundSelect_" + element["no"];
            iSelect.setAttribute("id", colID);
            iSelect.setAttribute("class", "form-control-sm");
            iSelect.addEventListener("change", function() {
                self.setSound(this.selectedIndex + 1);
            });

            iCol = document.createElement('div');
            iCol.className = "col-md-2";
            // console.log('colID: ', colID);
            iCol.setAttribute("id", colID);
            iCol.appendChild(iSelect);            
            iRow.appendChild(iCol);

            // create + compas btn.
            let rowIdx = element["no"];
            iBtn = this.CreateAddCompasBtn(rowIdx);
            iCol = document.createElement('div');
            iCol.className = "col-md-2";
            iCol.appendChild(iBtn);
            iRow.appendChild(iCol);
            iCompasSheet.appendChild(iRow);
        }
    }

    CreateAddCompasBtn(rowIdx) {
        let rowID = "add_" + rowIdx;
        console.log('rowID: ', rowID);
        let iBtn = document.createElement('button');
        iBtn.setAttribute("id", rowID);
        iBtn.className = "btn-info";
        iBtn.textContent = "+ compas"
        iBtn.addEventListener("click", function() {
            self.addCompas(this);
        });
//            iBtn.setAttribute("class", "form-control");
        return iBtn;
    }

    /**
     * Sets the tempo.
     * @param bpm tempo in beats per minute
     */
    setTempo(bpm) {
        this.metroWorker.setTempo(bpm);
    }

    /**
     * Setting palo pattern.
     * @param bpm tempo in beats per minute
     */
    setPalo(type) {
        this.metroWorker.setPalo(type);
    }

    addCompas(element) {
//        console.log('addCompas element: ', element);
        const toStr = (element.id).toString();

        const compasIdx = parseInt(toStr.replace('add_', '') );
        console.log('addCompas, compasNo: ', element.id, 
            ', toStr: ', toStr, ', compasIdx: ', compasIdx);
        let aJson = {
            "CompasPattern": "Alegrias", 
            "Speed": 300, 
            "Subida": "Constant"
        };
        aJson['no'] = compasIdx;
    
        self.insertDatas(compasIdx, aJson);
        for (let idx = compasIdx + 1; idx < self.getDatas().length; idx++ ) {
            console.log('idx: ', idx, ', self.getDataByIdx(idx): ', 
                self.getDataByIdx(idx) );
            let oldNo = parseInt(self.getDataByIdx(idx)['no'], 10);
            self.getDataByIdx(idx)['no'] = oldNo + 1;
        }
        self.rowsCreate2(this.getDatas() );
    }

    /**
     * Sets the metronome sound.
     * @param number the one-based sound index
     */
    setSound(number) {
        this.metroWorker.setSound(number);
    }

    /**
     * Sets the visualization type.
     * @param index a 0-based number specifying the visualization to use
     */
    setVisualization(index) {
        this.visSettings.visualizationType = index;
    }

}

