import MetronomePlayer from '../public/js/MetronomePlayer';
import MetronomeEditor from '../public/js/MetronomeEditor';
import VisSettings from '../__mocks__/visualization';

describe("Testing util function", () => {
//     test("testing addcompas", () => {
//         // actual test
//         // const thePlayer = new MetronomePlayer('res/audio/',
//         //     [ 'Low_Bongo.wav', 'Clap_bright.wav',],
//         //     VisSettings);
//         const thePlayer = new MetronomePlayer('res/audio/',
//             [ 'Low_Bongo.wav', 'Clap_bright.wav',],
//             VisSettings);

// // //        addCompas2(2);
// //         const app = new MetronomeEditor();
// //         app.addCompas2(2);
//     });

    test("testing add compas", () => {
        // actual test
        const theEditor = new MetronomeEditor('res/audio/',
            [ 'Low_Bongo.wav', 'Clap_bright.wav',],
            VisSettings);
        
        // <span id="add_0" class="badge badge-info">+</span>
        // let addFromCompas1 = '<button id="add_1" class="btn-info">+ compas</button>';

        expect(theEditor.datas.length).toEqual(0) ;
        console.log('theEditor.datas.length: ', theEditor.datas.length);
        let iBtn = theEditor.CreateAddCompasBtn(0);
        console.log('iBtn: ', iBtn);
        theEditor.addCompas(iBtn);
        console.log('theEditor.datas.length: ', theEditor.datas.length);
        expect(theEditor.datas.length).toEqual(1) ;

    });
});

