/**
 * Copyright 2010 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var cb = cb || {};

cb.Brush = Class.extend({
  init: function() {},
  reset: function() {
    this.init();
  },
  setPresenter: function(presenter) {
    this.presenter = presenter;
  },
  onMouseDown: function(x, y, layer, evt) {},
  onMouseUp: function(x, y, layer, evt) {},
  onMouseMove: function(x, y, layer, evt) {}
});

cb.PencilBrush = cb.Brush.extend({
  init: function() {
    this.drawing = false;
  },
  onMouseDown: function(x, y, evt) {
    this.drawing = true;
    var layer = this.presenter.getCurrentLayer();
    layer.paintPixel(x, y, cb.PixelSize, '#36b');
  },
  onMouseUp: function(x, y, evt) {
    this.drawing = false;
  },
  onMouseMove: function(x, y, evt) {
    if (this.drawing) {
      var layer = this.presenter.getCurrentLayer();
      layer.paintPixel(x, y, cb.PixelSize, '#36b');
    }
  }
});

cb.PenBrush = cb.Brush.extend({
  init: function() {
    this.startX = this.startY = null;
  },
  onMouseDown: function(x, y, evt) {
    var layer = this.presenter.getCurrentLayer();
    layer.paintPixel(x, y, cb.PixelSize, '#36b');
    this.previousX = x;
    this.previousY = y;
  },
  onMouseUp: function(x, y, layer, evt) {
    this.previousX = this.previousY = null;
  },
  onMouseMove: function(x, y, evt) {
    if (!this.previousX) { return; }
    var layer = this.presenter.getCurrentLayer();
    layer.paintLine(this.previousX, this.previousY, x, y, cb.PixelSize, '#36b');
    this.previousX = x;
    this.previousY = y;
  }
});

cb.EraserBrush = cb.Brush.extend({
  init: function() {
    this.drawing = false;
  },
  onMouseDown: function(x, y, evt) {
    this.drawing = true;
    layer.erasePixel(x, y, cb.PixelSize * 4);
  },
  onMouseUp: function(x, y, evt) {
    this.drawing = false;
  },
  onMouseMove: function(x, y, evt) {
    if (this.drawing) {
      var layer = this.presenter.getCurrentLayer();
      layer.erasePixel(x, y, cb.PixelSize * 4);
    }
  }
});

cb.LineBrush = cb.Brush.extend({
  init: function() {
    this.startX = this.startY = null;
  },
  onMouseDown: function(x, y, evt) {
    var layer = this.presenter.getCurrentLayer();
    if (x < 0 || x >= layer.width || y < 0 || y >= layer.height) {
      return;
    }

    if (this.startX) {
      // Draw a line.
      this.presenter.getToolLayer().clear();
      layer.paintLine(
          this.startX, 
          this.startY, 
          x, 
          y, 
          cb.PixelSize, 
          '#36b');

      if (!evt.shiftKey) {
        // End of line.
        this.startX = this.startY = null;
        return;
      }
    }
    this.startX = x;
    this.startY = y;
  },
  onMouseMove: function(x, y, evt) {
    if (!this.startX) { return; }
    this.presenter.getToolLayer().clear();
    this.presenter.getToolLayer().paintLine(
        this.startX, 
        this.startY, 
        x, 
        y, 
        2, 
        '#c48');
  }
});

cb.FillBrush = cb.Brush.extend({
  onMouseDown: function(x, y, evt) {
    var layer = this.presenter.getCurrentLayer();
    if (x < 0 || x >= layer.width || y < 0 || y >= layer.height) {
      return;
    }
    layer.paintFill(x, y, cb.PixelSize, '#4c8');
  }
});

