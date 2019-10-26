import $ from 'jquery';
import _ from 'lodash';

const timeout = ms => {
  return new Promise(resolve => setTimeout(() => resolve('complete!'), ms));
};

const asyncTimeout = async () => {
  try {
    const res = await timeout(2500);
    $('h1').append(`<small><sup> Async/Await ${res}</sup></small>`);
  } catch (err) {
    $('h1').append(`<small><sup> Async/Await failed!</sup></small>`);
  }
};

timeout(2500)
  .then(data => $('h1').append(`<small><sup> Promise ${data}</sup></small>`))
  .catch(err => $('h1').append(`<small><sup> Promise failed!</sup></small>`));

asyncTimeout();
