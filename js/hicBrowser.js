/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2016-2017 James Robinson
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */


var hic = (function (hic) {

    hic.createBrowser = function (parentDiv, config) {

        var browser = new hic.Browser(parentDiv, config);

        return new Promise(function (fulfill, reject) {

            browser.contactMatrixView.startSpinner();

            browser.hicReader.readHeader()
                .then(function () {
                    browser.hicReader.readFooter()
                        .then(function () {

                            browser.chromosomes = browser.hicReader.chromosomes;
                            browser.bpResolutions = browser.hicReader.bpResolutions;
                            browser.fragResolutions = browser.hicReader.fragResolutions;
                            browser.update();
                            browser.contactMatrixView.stopSpinner();
                            fulfill(browser);
                        })
                        .catch(function (error) {
                            browser.contactMatrixView.stopSpinner();
                            reject(error);
                        });
                })
                .catch(function (error) {
                    browser.contactMatrixView.stopSpinner();
                    reject(error);
                });
        });
    }

    hic.Browser = function (parentDiv, config) {

        var $content,
            $root,
            $xaxis,
            $yaxis,
            browser;

        this.hicReader = new hic.HiCReader(config);

        this.config = config;
        $root = $('<div id="hicRootDiv" class="hic-root-div">');

        $content = $('<div class="hic-content-div">');
        $root.append($content[0]);

        $xaxis = $('<div class="hic-x-axis-div">');
        $content.append($xaxis[0]);

        $yaxis = $('<div class="hic-y-axis-div">');
        $content.append($yaxis[0]);

        this.contactMatrixView = new hic.ContactMatrixView(this);
        $content.append(this.contactMatrixView.viewport);


        // phone home -- counts launches.  Count is anonymous, needed for our continued funding.  Please don't delete
        // phoneHome();

        $(parentDiv).append($root[0]);

    };

    hic.Browser.prototype.update = function () {
        this.contactMatrixView.update();
    }


    return hic;

})
(hic || {});
