// Generated by CoffeeScript 1.4.0
(function() {
  var AjaxFileUpload;

  AjaxFileUpload = (function() {
    var ajaxUpload, defaultSettings, handleAjaxProgress, handleAjaxProgressEnd, handleAjaxProgressStart, handleAjaxResponse, handleFileSelection, iframeUpload, upload, utils,
      _this = this;

    function AjaxFileUpload(input, options) {
      var _this = this;
      this.input = input;
      if (utils.validate.inputType(this.input.type === false)) {
        return;
      }
      this.settings = utils.merge(defaultSettings, options);
      utils.bind(this.input, "change", function() {
        handleFileSelection(_this.input, _this.settings);
      });
    }

    handleFileSelection = function(input, settings) {
      if (settings.autoUpload) {
        upload(input, settings);
      }
    };

    upload = function(input, settings) {
      if (utils.has.ajaxUpload) {
        ajaxUpload(input, settings);
      } else {
        iframeUpload(input, settings);
      }
    };

    ajaxUpload = function(input, settings) {
      var file, formData, url, xhr, _i, _len, _ref;
      url = settings.url;
      xhr = new XMLHttpRequest();
      xhr.open("POST", url, true);
      utils.bind(xhr, "load", handleAjaxResponse, false);
      utils.bind(xhr.upload, "progress", handleAjaxProgress, false);
      utils.bind(xhr.upload, "loadstart", handleAjaxProgressStart, false);
      utils.bind(xhr.upload, "loadend", handleAjaxProgressEnd, false);
      formData = new FormData();
      _ref = input.files;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        formData.append(file.name, file);
      }
      xhr.send(formData);
    };

    handleAjaxResponse = function(event) {
      var xhr;
      xhr = event.target;
      settings.onSuccess($.parseJSON(xhr.responseText));
      return console.log("request response: ", xhr.status, xhr.responseText);
    };

    handleAjaxProgress = function() {};

    handleAjaxProgressStart = function() {};

    handleAjaxProgressEnd = function() {};

    iframeUpload = function(input, settings) {
      var iframe, url;
      url = settings.url;
      input.form.action = url;
      input.form.target = "fu-iframe";
      input.form.method = "post";
      input.form.enctype = "multipart/form-data";
      input.form.encoding = "multipart/form-data";
      iframe = document.getElementById("fu-iframe");
      if (iframe === null) {
        iframe = document.createElement('iframe');
        iframe.id = "fu-iframe";
      }
      iframe.name = "fu-iframe";
      iframe.style.display = 'none';
      utils.bind(iframe, "load", function() {
        var data, response;
        response = window.frames["fu-iframe"].document.body.innerHTML;
        data = JSON.stringify(response);
        return settings.onSuccess(data);
      });
      if (document.getElementById("fu-iframe") === null) {
        document.body.appendChild(iframe);
      }
      input.form.submit();
    };

    defaultSettings = {
      url: "",
      autoUpload: true,
      onSuccess: function() {},
      onError: function() {},
      onSelect: function() {},
      onProgress: function() {},
      onProgressStart: function() {},
      onProgressEnd: function() {}
    };

    utils = {
      bind: function(element, eventName, callback, useCapture) {
        if (!!useCapture) {
          useCapture = true;
        }
        if (element.addEventListener != null) {
          return element.addEventListener(eventName, callback, useCapture);
        } else {
          return element.attachEvent("on" + eventName, callback);
        }
      },
      merge: function(obj1, obj2) {
        var p;
        for (p in obj2) {
          try {
            if (obj2[p].constructor === Object) {
              obj1[p] = utils.merge(obj1[p], obj2[p]);
            } else {
              obj1[p] = obj2[p];
            }
          } catch (e) {
            obj1[p] = obj2[p];
          }
        }
        return obj1;
      },
      has: {
        fileAPI: window.File && window.FileReader && window.FileList && window.Blob,
        ajaxUpload: window.XMLHttpRequestUpload
      },
      triggerEvent: function(el, type) {
        if ((el[type] || false) && typeof el[type] === "function") {
          el[type](el);
        }
      },
      validate: {
        inputType: function(type) {
          return type === "file";
        },
        fileName: function() {},
        fileSize: function() {},
        fileType: function() {}
      }
    };

    return AjaxFileUpload;

  }).call(this);

  if (window.jQuery) {
    jQuery.ajaxFileUpload = AjaxFileUpload;
    jQuery.fn.ajaxFileUpload = function(options) {
      return this.each(function(i, input) {
        new AjaxFileUpload(input, options);
      });
    };
  }

  if (typeof define === "function" && define.amd) {
    define("ajaxFileUpload", [], function() {
      return AjaxFileUpload;
    });
  } else {
    window.AjaxFileUpload = AjaxFileUpload;
  }

}).call(this);