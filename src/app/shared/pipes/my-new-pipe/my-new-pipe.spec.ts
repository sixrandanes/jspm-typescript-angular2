
 import {
 it,
 iit,
 describe,
 ddescribe,
 expect,
 inject,
 injectAsync,
 TestComponentBuilder,
 beforeEachProviders
 } from 'angular2/testing';
 import {provide} from 'angular2/core';
 import {MyNewPipe} from './my-new-pipe';


 describe('MyNewPipe Pipe', () => {

 beforeEachProviders(() => [MyNewPipe]);


 it('should transform the input', inject([MyNewPipe], (pipe:MyNewPipe) => {
 expect(pipe.transform(true)).toBe(null);
 }));

 });
