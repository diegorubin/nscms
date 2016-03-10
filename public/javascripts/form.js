function Form() {
  var _this = this;

  _this.init = function(resource) {

    _this.resource = resource;

    document.getElementById('save-template').onclick = _this.submit;
    document.getElementById('update-preview').onclick = _this.update_preview;
    document.getElementById('add-parameter').onclick = _this.add_parameter;

    _this.last_save = document.getElementById('last-save');
    _this.key = document.getElementById('key');
    _this.content = document.getElementById('content');
    _this.result = document.getElementById('result');
    _this.parameters_wrap = document.getElementById('parameters-wrap');

  }

  _this.submit = function(event){
    event.preventDefault();

    var xhttp = new XMLHttpRequest();
    xhttp.open('POST', '/api/' + _this.resource, true);

    xhttp.onreadystatechange = function() {
        if(xhttp.readyState == 4 && xhttp.status == 200) {
          _this.last_save.innerHTML = new Date();
        }
    };

    var data = {
      key: _this.key.value,
      content: _this.content.value
    };

    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(data));
  }

  _this.update_preview = function(event) {
    event.preventDefault();

    var parameters = {};
    var keys = document.getElementsByClassName("key");
    var values = document.getElementsByClassName("value");

    for(var i = 0; i < keys.length; i++) {
      parameters[keys[i].value] = values[i].value;
    }

    var raw = _this.content.value;
    var re = /\{\{#def.([\w_]+)\}\}/g;
    var def = {};

    var xhttp = new XMLHttpRequest();

    var m;
    do {
        m = re.exec(raw);
        if (m) {
          var partial = m[1];
          xhttp.open('GET', '/partials/' + partial, false);
          xhttp.onreadystatechange = function() {
              if(xhttp.readyState == 4 && xhttp.status == 200) {
                def[partial] = JSON.parse(xhttp.responseText).content;
              }
          };
          xhttp.send();
        }

    } while (m);

    var template = doT.compile(raw, def);
    var content = template(parameters);

    _this.result.src = "data:text/html;charset=utf-8," + escape(content);
  }

  _this.add_parameter = function(event) {
    event.preventDefault();
    var line = document.createElement('p');

    var key_label = document.createElement('label');
    key_label.innerHTML = "Key: ";
    line.appendChild(key_label);

    var key_field = document.createElement('input');
    key_field.className = "key";
    key_field.type = "text";
    line.appendChild(key_field);

    var value_label = document.createElement('label');
    value_label.innerHTML = "Value: ";
    line.appendChild(value_label);

    var value_field = document.createElement('input');
    value_field.className = "value";
    value_field.type = "text";
    line.appendChild(value_field);

    _this.parameters_wrap.appendChild(line);

  }

}

