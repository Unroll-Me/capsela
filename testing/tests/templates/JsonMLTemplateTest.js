/**
 * Copyright (C) 2011 Sitelier Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * Author: Seth Purcell
 * Date: 11/8/11
 */

"use strict";

var testbench = require(__dirname + '/../../TestBench');
var testCase = require('nodeunit').testCase;

var capsela = require('capsela');
var JsonMLTemplate = capsela.templates.JsonMLTemplate;
var mp = require('capsela-util').MonkeyPatcher;

var jsontemplate = require('../../../deps/json-template');

var template =
'<!--ENV\n\
 { "title": "Goodbye, cruel world!", "complete": true }\n\
 -->\n\
xyz';

module.exports["basics"] = testCase({

    setUp: mp.setUp,
    tearDown: mp.tearDown,

    "test init": function(test) {

        var obj = [];
        var t = new JsonMLTemplate(obj);

        test.deepEqual(t.template, obj);
        test.done();
    },

    "test rendering": function(test) {

        var obj = 'hi';
        test.equal(JsonMLTemplate.renderJsonMl(obj), 'hi');

        // tag only
        obj = ['html'];
        test.equal(JsonMLTemplate.renderJsonMl(obj), '<html></html>');

        // with multiple text children
        obj = ['p', 'As Gregor Samsa', 'awoke one morning','from uneasy dreams','he found himself'];
        test.equal(JsonMLTemplate.renderJsonMl(obj), '<p>As Gregor Samsa\nawoke one morning\nfrom uneasy dreams\nhe found himself\n</p>');

        // tag with attributes
        obj = ['body', {style: 'height: 100%; background: #fff;', 'class': 'ie8'}];
        test.equal(JsonMLTemplate.renderJsonMl(obj), '<body style="height: 100%; background: #fff;" class="ie8"></body>');

        // empty tags
        obj = ['body', ['img', {src: 'image1.png'}], ['br'], ['img', {src: 'image2.jpg'}]];
        test.equal(JsonMLTemplate.renderJsonMl(obj), '<body><img src="image1.png"/>\n<br/>\n<img src="image2.jpg"/>\n</body>');

        // uppercase
        obj = ['BODY', ['IMG', {src: 'image1.png'}], ['BR'], ['IMG', {src: 'image2.jpg'}]];
        test.equal(JsonMLTemplate.renderJsonMl(obj), '<BODY><IMG src="image1.png"/>\n<BR/>\n<IMG src="image2.jpg"/>\n</BODY>');

        // trailing strings
        obj = ['div', ['p', 'hi', 'there'], '   '];
        test.equal(JsonMLTemplate.renderJsonMl(obj), '<div><p>hi\nthere\n</p>\n   \n</div>');

        test.done();
    }
});