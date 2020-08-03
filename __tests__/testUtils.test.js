import MetronomePlayer from '../public/js/MetronomePlayer';
import MetronomeEditor from '../public/js/MetronomeEditor';
import VisSettings from '../__mocks__/visualization';

describe("Testing util function", () => {
    test("testing add compas", () => {
        // actual test
        const theEditor = new MetronomeEditor('res/audio/',
            [ 'Low_Bongo.wav', 'Clap_bright.wav',],
            VisSettings);
        
        // <span id="add_0" class="badge badge-info">+</span>
        // let addFromCompas1 = '<button id="add_1" class="btn-info">+ compas</button>';
        
        // the length should +1
        expect(theEditor.getDatas().length).toEqual(0) ;
        console.log('theEditor.datas.length: ', theEditor.getDatas().length);

        let iBtn = theEditor.CreateAddCompasBtn('0');
        // console.log('iBtn: ', iBtn);
        theEditor.addCompas(iBtn);

        console.log('theEditor.datas.length: ', theEditor.getDatas().length);
        expect(theEditor.getDatas().length).toEqual(1) ;


        theEditor.getDatas()
    });

    test("testing add compas, datas idx should be from 1 to N", () => {
        let iBtn = theEditor.CreateAddCompasBtn('0');
        theEditor.addCompas(iBtn);
        iBtn = theEditor.CreateAddCompasBtn('0');
        theEditor.addCompas(iBtn);
        iBtn = theEditor.CreateAddCompasBtn('0');
        theEditor.addCompas(iBtn);

        // the "id" of each compas should be from 1 to N.
        for (let idx = 0; idx < theEditor.getDatas().length; idx++ ) {
            let item = theEditor.getDatas()[idx];
            let idxStr = idx.toString();
            console.log('idxStr: ', idxStr, ', item: ', item);
            expect(idxStr).toEqual(item['no']);
        }
    });

});

