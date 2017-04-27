/*
 *  The MIT License (MIT)
 *
 * Copyright (c) 2016-2017 The Regents of the University of California
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
 * associated documentation files (the "Software"), to deal in the Software without restriction, including 
 * without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
 * copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the 
 * following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial 
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING 
 * BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,  FITNESS FOR A PARTICULAR PURPOSE AND 
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY 
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, 
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
 * THE SOFTWARE.
 *
 */

/**
 * Created by dat on 3/14/17.
 */
var hic = (function (hic) {

    hic.SweepZoom = function (browser) {

        this.browser = browser;

        this.$rulerSweeper = $('<div>');
        this.$rulerSweeper.hide();

        this.sweepRect = {};

    };

    hic.SweepZoom.prototype.reset = function () {
        this.coordinateFrame = this.$rulerSweeper.parent().offset();
        this.aspectRatio = this.browser.contactMatrixView.getViewDimensions().width / this.browser.contactMatrixView.getViewDimensions().height;
        this.sweepRect.origin = {x: 0, y: 0};
        this.sweepRect.size = { width: 1, height: 1 };
    };

    hic.SweepZoom.prototype.update = function (mouseDown, coords, viewportBBox) {
        var delta,
            aspectRatioScale,
            xMax,
            yMax,
            str,
            left,
            top;

        this.sweepRect.origin.x = mouseDown.x;
        this.sweepRect.origin.y = mouseDown.y;

        delta =
            {
                x: (coords.x - mouseDown.x),
                y: (coords.y - mouseDown.y)
            };

        this.dominantAxis = delta.x > delta.y ? 'x' : 'y';

        if ('x' === this.dominantAxis) {

            this.sweepRect.size =
                {
                    width: delta.x,
                    height: delta.x / this.aspectRatio
                };

        } else {

            this.sweepRect.size =
                {
                    width: delta.y * this.aspectRatio,
                    height: delta.y
                };
        }

        this.sweepRect.origin.x  = Math.min(this.sweepRect.origin.x, this.sweepRect.origin.x + this.sweepRect.size.width);
        this.sweepRect.origin.y  = Math.min(this.sweepRect.origin.y, this.sweepRect.origin.y + this.sweepRect.size.height);
        this.sweepRect.size.width = Math.abs(this.sweepRect.size.width);
        this.sweepRect.size.height = Math.abs(this.sweepRect.size.height);

        this.$rulerSweeper.width( this.sweepRect.size.width);
        this.$rulerSweeper.height(this.sweepRect.size.height);

        this.$rulerSweeper.offset({ left: this.coordinateFrame.left + this.sweepRect.origin.x, top: this.coordinateFrame.top + this.sweepRect.origin.y });
        this.$rulerSweeper.show();

    };

    hic.SweepZoom.prototype.dismiss = function () {
        var s = this.browser.state,
            bpResolution = this.browser.resolution(),
            bpX = (s.x + this.sweepRect.origin.x / s.pixelSize) * bpResolution,
            bpY = (s.y + this.sweepRect.origin.y / s.pixelSize) * bpResolution,
            bpXMax = bpX + (this.sweepRect.size.width / s.pixelSize) * bpResolution,
            bpYMax = bpY + (this.sweepRect.size.height / s.pixelSize) * bpResolution;

        this.$rulerSweeper.hide();
        this.browser.goto(bpX, bpXMax, bpY, bpYMax);

    };

    return hic;
})(hic || {});
