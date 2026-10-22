import test from 'node:test';
import assert from 'node:assert/strict';
import {loadMistakes,saveMistakes,validEntry} from './mistake-store.js';
const entry={id:'test-1',source:'SCSA Q12',topic:'calculus',question:'Find the gradient',reason:'Forgot the chain rule',plan:'Differentiate the inside',marks:2,resolved:false,created:'2026-10-22T10:00:00Z'};
test('mistake records round trip with details and resolved state',()=>{
 let raw=null;const storage={getItem:()=>raw,setItem:(_,value)=>raw=value};
 assert.deepEqual(loadMistakes(storage),{entries:[],error:false});
 assert.equal(saveMistakes(storage,[entry]),true);assert.deepEqual(loadMistakes(storage).entries,[entry]);
 assert.equal(saveMistakes(storage,[{...entry,resolved:true}]),true);assert.equal(loadMistakes(storage).entries[0].resolved,true);
});
test('malformed records and failed storage are handled without overwriting data',()=>{
 for(const patch of [{marks:-1},{marks:1.5},{topic:'invalid'},{reason:' '},{created:'bad'},{source:''}])assert.equal(validEntry({...entry,...patch}),false);
 const storage={getItem:()=>'{bad',setItem(){throw new Error('denied');}};
 assert.equal(loadMistakes(storage).error,true);assert.equal(saveMistakes(storage,[entry]),false);
 assert.equal(loadMistakes({getItem:()=>JSON.stringify({version:1,entries:[entry,entry]})}).error,true);
});
