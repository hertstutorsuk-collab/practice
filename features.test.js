import test from 'node:test';
import assert from 'node:assert/strict';
import {generateWorksheet} from './generator.js';
import {readSaved,writeSaved,SAVE_KEY} from './storage.js';
test('mixed sheets are balanced, unique and tagged at every difficulty',()=>{
  for(const difficulty of ['easy','medium','hard']) for(const count of [5,10,20]) {
    const sheet=generateWorksheet('mixed',difficulty,count);
    assert.equal(new Set(sheet.map(q=>q.prompt)).size,count);
    const counts=['fractions','percentages','algebra'].map(topic=>sheet.filter(q=>q.topic===topic).length);
    assert.ok(Math.max(...counts)-Math.min(...counts)<=1);
    assert.ok(sheet.every(q=>q.answer && q.explanation));
  }
});
test('saved worksheets round trip and invalid data is rejected',()=>{
  let value=null;const storage={getItem:()=>value,setItem:(key,v)=>{assert.equal(key,SAVE_KEY);value=v;}};
  const data={topic:'mixed',difficulty:'easy',questions:generateWorksheet('mixed','easy',5),answers:['1/2','','x = 4','5','0']};
  assert.equal(writeSaved(storage,data),true);
  assert.deepEqual(readSaved(storage),{...data,version:1});
  value='{broken';assert.equal(readSaved(storage),null);
  value=JSON.stringify({...data,version:1,answers:[]});assert.equal(readSaved(storage),null);
  value=JSON.stringify({...data,version:1,topic:'invalid'});assert.equal(readSaved(storage),null);
  assert.equal(writeSaved({setItem(){throw new Error('full');}},data),false);
  assert.equal(readSaved({getItem(){throw new Error('denied');}}),null);
});
