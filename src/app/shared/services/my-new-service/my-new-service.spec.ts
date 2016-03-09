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
import {MyNewService} from './my-new-service';


describe('MyNewService Service', () => {

  beforeEachProviders(() => [MyNewService]);


  it('should ...', inject([MyNewService], (service:MyNewService) => {

  }));

});
