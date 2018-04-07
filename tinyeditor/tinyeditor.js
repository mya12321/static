function TINY (obj) {
  var editor = this, c = [], offset = -30;
  c['bold'] = [4, 'Bold', 'a', 'bold'];
  c['italic'] = [5, 'Italic', 'a', 'italic'];
  c['underline'] = [6, 'Underline', 'a', 'underline'];
  c['strikethrough'] = [7, 'Strikethrough', 'a', 'strikethrough'];
  c['subscript'] = [8, 'Subscript', 'a', 'subscript'];
  c['superscript'] = [9, 'Superscript', 'a', 'superscript'];
  c['orderedlist'] = [10, 'Insert Ordered List', 'a', 'insertorderedlist'];
  c['unorderedlist'] = [11, 'Insert Unordered List', 'a', 'insertunorderedlist'];
  c['outdent'] = [12, 'Outdent', 'a', 'outdent'];
  c['indent'] = [13, 'Indent', 'a', 'indent'];
  c['leftalign'] = [14, 'Left Align', 'a', 'justifyleft'];
  c['centeralign'] = [15, 'Center Align', 'a', 'justifycenter'];
  c['rightalign'] = [16, 'Right Align', 'a', 'justifyright'];
  c['blockjustify'] = [17, 'Block Justify', 'a', 'justifyfull'];
  c['undo'] = [18, 'Undo', 'a', 'undo'];
  c['redo'] = [19, 'Redo', 'a', 'redo'];
  c['image'] = [20, 'Insert Image', 'i', 'insertimage', 'Enter Image URL:', 'http://'];
  c['hr'] = [21, 'Insert Horizontal Rule', 'a', 'inserthorizontalrule'];
  c['link'] = [22, 'Insert Hyperlink', 'i', 'createlink', 'Enter URL:', 'http://'];
  c['unlink'] = [23,'Remove Hyperlink','a','unlink'];
  c['unformat'] = [24, 'Remove Formatting', 'a', 'removeformat'];
  c['print'] = [25, 'Print', 'a', 'print'];
  editor = this, editor.t = document.getElementById(obj.id); editor.obj = obj; editor.xhtml = obj.xhtml;
  var p = document.createElement('div'), w = document.createElement('div'), h = document.createElement('div'),
    l = obj.controls.length, i = 0, time = new Date().getTime();
  editor.i = document.createElement('iframe');
  editor.i.width = obj.width || '500'; editor.i.height = obj.height || '250'; editor.ie = (function() {return "ActiveXObject" in window})();
  h.className = obj.rowclass || 'tinyeditor-header'; p.className = obj.cssclass || 'tinyeditor'; p.style.width = editor.i.width + 'px'; p.appendChild(h);
  for(i; i < l; i++) {
    var id = obj.controls[i];
    if(id == 'n') {
      h = document.createElement('div'); h.className = obj.rowclass || 'tinyeditor-header'; p.appendChild(h);
    } else if(id == '|') {
      var d = document.createElement('div'); d.className = obj.dividerclass || 'tinyeditor-divider'; h.appendChild(d);
    } else if(id == 'font') {
      var sel = document.createElement('select'), fonts = obj.fonts || ['Verdana', 'Arial', 'Georgia'], fl = fonts.length, x = 0;
      sel.className = 'tinyeditor-font'; sel.onchange = function(){editor.ddaction(this, "fontname");};
      sel.options[0] = new Option('Font', '');
      for(x; x < fl; x++) {
        var font = fonts[x];
        sel.options[x + 1] = new Option(font, font);
      }
      h.appendChild(sel);
    } else if(id == 'size') {
      var sel = document.createElement('select'), sizes = obj.sizes || [1, 2, 3, 4, 5, 6, 7], sl = sizes.length, x = 0;
      sel.className = 'tinyeditor-size'; sel.onchange = function(){editor.ddaction(this, "fontsize");};
      for(x; x < sl; x++) {
        var size = sizes[x];
        sel.options[x] = new Option(size, size);
        if (size == 3) {sel.options[x].selected = true;}
      }
      h.appendChild(sel);
    } else if(id == 'style') {
      var sel = document.createElement('select'),
        styles = obj.styles || [['Style', ''], ['Paragraph', '<p>'], ['Header 1', '<h1>'], ['Header 2', '<h2>'], ['Header 3', '<h3>'], ['Header 4', '<h4>'], ['Header 5', '<h5>'], ['Header 6', '<h6>']],
        sl = styles.length, x = 0;
      sel.className = 'tinyeditor-style'; sel.onchange = function(){editor.ddaction(this, "formatblock");};
      for(x; x < sl; x++) {
        var style = styles[x];
        sel.options[x] = new Option(style[0], style[1]);
      }
      h.appendChild(sel);
    } else if(c[id]) {
      (function(){
        var div = document.createElement('div'), x = c[id], func = x[2], ex, pos = x[0] * offset, arg = [];
        div.className = obj.controlclass;
        div.unselectable = 'on';
        div.style.backgroundPosition = '0px ' + pos + 'px';
        div.title = x[1];
        div.onmouseover = function(){editor.hover(this, pos, 1);};
        div.onmouseout = function(){editor.hover(this, pos, 0);};
        if (id == 'print') {
          div.onmousedown = function(){editor.print();};
        } else if (func == 'a') {
          div.onmousedown = function(){editor.action(x[3], 0, x[4] || 0);};
        } else if (id == 'image') {
          var label = document.createElement('label');
          label.htmlFor = 't_' + time;
          label.appendChild(div);
          div = label;
        } else if (id == 'link') {
          div.onmousedown = function(){editor.insertHyperlink(x[4], x[5], x[3]);};
        }
        h.appendChild(div);
      })();
    }
  }
  editor.t.parentNode.insertBefore(p, editor.t); editor.t.style.width = editor.i.width + 'px';
  w.appendChild(editor.t); w.appendChild(editor.i); p.appendChild(w); editor.t.style.display = 'none';
  if(obj.footer) {
    var f = document.createElement('div'); f.className = obj.footerclass || 'tinyeditor-footer';
    if(obj.toggle) {
      var to = obj.toggle, ts = document.createElement('div');
      ts.className = to.cssclass || 'toggle'; ts.innerHTML = to.text || 'source';
      ts.onclick = function(){editor.toggle(0, this); return false;};
      f.appendChild(ts);
    }
    if(obj.resize) {
      var ro = obj.resize, rs = document.createElement('div'); rs.className = ro.cssclass || 'resize';
      rs.onmousedown = editor.resize;
      rs.onselectstart = function() {return false;};
      f.appendChild(rs);
    }
    p.appendChild(f);
  }
  editor.e = editor.i.contentWindow.document; editor.e.open();
  var m = '<html><head>', bodyid = obj.bodyid?" id=\"" + obj.bodyid + "\"" : "";
  if(obj.cssfile) {m += '<link rel="stylesheet" href="' + obj.cssfile + '" />'}
  if(obj.css) {m += '<style type="text/css">' + obj.css + '</style>'}
  m += '</head><body' + bodyid + ' contenteditable="true" style="overflow:auto;">';
  m += (obj.content || editor.t.value) + '</body></html>';
  editor.e.write(m);
  editor.e.close(); editor.e.designMode = 'On'; editor.d = 1;
  editor.p = document.createElement('input');
  editor.p.id = 't_' + time;
  editor.p.type = 'file';
  editor.p.style.display = 'none';
  editor.p.onchange = function(){editor.insertImg(this.files[0]); this.value = "";};
  editor.t.parentNode.appendChild(editor.p);
  setTimeout(function(){
    editor.e.body.onpaste = function(e){editor.pasteImg(e);};
    editor.e.body.ondragover = function(e){editor.cancelOpenFile(e);};
    editor.e.body.ondrop = function(e){editor.dropImg(e);};
    editor.e.body.oninput = function(){editor.removeLocalImg();};
  }, 100);
  if(editor.xhtml) {
    try{editor.e.execCommand("styleWithCSS", 0, 0)}
    catch(e) {try{editor.e.execCommand("useCSS", 0, 1)}catch(e) {}}
  }
  editor.print = function() {
    editor.i.contentWindow.print();
  };
  editor.hover = function(div, pos, dir) {
    editor.getSelection();
    div.style.backgroundPosition = (dir ? '34px ' : '0px ') + (pos) + 'px';
  };
  editor.getSelection = function() {
    if(editor.ie && editor.e.getSelection) {
      editor.sel = editor.e.getSelection();
      if(editor.sel.getRangeAt && editor.sel.rangeCount) {
        editor.range = editor.sel.getRangeAt(0);
      }
    }
  };
  editor.restoreSelection = function() {
    if (editor.range && editor.ie) {
      if (editor.e.getSelection) {
        editor.sel = editor.e.getSelection();
        editor.sel.removeAllRanges();
        editor.sel.addRange(editor.range);
      }
    }
  };
  editor.ddaction = function(dd, a) {
    var i = dd.selectedIndex, v = dd.options[i].value;
    editor.action(a, v);
  };
  editor.action = function(cmd, val, ie) {
    if(ie && !editor.ie) {
      alert('Your browser does not support this function.')
    } else{
      editor.e.execCommand(cmd, 0, val || null);
      setTimeout(function(){editor.restoreSelection()}, 10);
    }
  };
  editor.insertHyperlink = function(pro, msg, cmd) {
    var val, selection, range, link, links, i;
    val = prompt(pro, msg);
    if(val != null && val != '') {
      if (editor.ie) {
        editor.restoreSelection();
        selection = editor.e.getSelection();
        if (selection.rangeCount) {
          range = selection.getRangeAt(0);
          range.collapse(false);
        } else {
          range = editor.e.createRange();
          range.setEndAfter(editor.e.body.lastChild);
          range.collapse(false);
        }
        link = editor.e.createElement('a');
        link.href = val;
        link.innerHTML = val;
        link.target = '_blank';
        link.contentEditable = 'false';
        range.insertNode(link);
        range.setEndAfter(link);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        val = '<a target="_blank" href="' + val + '">' + val + '</a>';
        editor.e.execCommand('insertHTML', 0, val);
        links = editor.e.getElementsByTagName('A');
        for (i = 0; i < links.length; i++) {
          links[i].contentEditable = 'false';
        }
      }
    }
  };
  editor.setfont = function() {
    editor.restoreSelection();
    execCommand('formatblock', 0, hType);
  };
  editor.resize = function(e) {
    editor.bcs = editor.cursor(e);
    if(editor.move) {
      editor.freeze();}
    if (editor.ie) {
      this.setCapture();
    } else {
      editor.e.addEventListener('mousemove', editor.move, 1);
      editor.e.addEventListener('mouseup', editor.freeze, 1);
    }
    document.addEventListener('mousemove', editor.move, 1);
    document.addEventListener('mouseup', editor.freeze, 1);
    return false;
  };
  editor.move = function(e) {
    var pos = editor.cursor(e);
    if (editor.d) {
      editor.i.height = parseInt(editor.i.height) + pos-editor.bcs;
    } else {
      editor.t.style.height = (parseInt(editor.t.style.height) + pos-editor.bcs) + 'px';
    }
    editor.bcs = pos;
  };
  editor.freeze = function() {
    if (editor.ie) {
      document.releaseCapture();
    } else {
      editor.e.removeEventListener('mousemove', editor.move, 1);
      editor.e.removeEventListener('mouseup', editor.freeze, 1);
    }
    document.removeEventListener('mousemove', editor.move, 1);
    document.removeEventListener('mouseup', editor.freeze, 1);
  };
  editor.enter = function(e) {
    editor.bcs = editor.cursor(e);
  };
  editor.leave = function(e) {
    editor.bcs = editor.cursor(e);
  };
  editor.toggle = function(post, div) {
    if(!editor.d) {
      var v = editor.t.value;
      if(div) {div.innerHTML = editor.obj.toggle.text || 'source'}
      if(editor.xhtml && !editor.ie) {
        v = v.replace(/<strong>(.*)<\/strong>/gi, '<span style="font-weight:bold;">$1</span>');
        v = v.replace(/<em>(.*)<\/em>/gi, '<span style="font-style:italic;">$1</span>');
      }
      editor.e.body.innerHTML = v;
      editor.i.height = parseInt(editor.t.style.height.slice(0, -2));
      editor.t.style.display = 'none'; editor.i.style.display = 'block'; editor.d = 1;
    } else{
      var v = editor.e.body.innerHTML;
      if(editor.xhtml) {
        v = v.replace(/<span class="apple-style-span">(.*)<\/span>/gi, '$1');
        v = v.replace(/ class="apple-style-span"/gi, '');
        v = v.replace(/<span style="">/gi, '');
        v = v.replace(/<br>/gi, '<br />');
        v = v.replace(/<br ?\/?>$/gi, '');
        v = v.replace(/^<br ?\/?>/gi, '');
        v = v.replace(/(<img [^>]+[^\/])>/gi, '$1 />');
        v = v.replace(/<b\b[^>]*>(.*?)<\/b[^>]*>/gi, '<strong>$1</strong>');
        v = v.replace(/<i\b[^>]*>(.*?)<\/i[^>]*>/gi, '<em>$1</em>');
        v = v.replace(/<u\b[^>]*>(.*?)<\/u[^>]*>/gi, '<span style="text-decoration:underline">$1</span>');
        v = v.replace(/<(b|strong|em|i|u) style="font-weight:normal;?">(.*)<\/(b|strong|em|i|u)>/gi, '$2');
        v = v.replace(/<(b|strong|em|i|u) style="(.*)">(.*)<\/(b|strong|em|i|u)>/gi, '<span style="$2"><$4>$3</$4></span>');
        v = v.replace(/<span style="font-weight:normal;?">(.*)<\/span>/gi, '$1');
        v = v.replace(/<span style="font-weight:bold;?">(.*)<\/span>/gi, '<strong>$1</strong>');
        v = v.replace(/<span style="font-style:italic;?">(.*)<\/span>/gi, '<em>$1</em>');
        v = v.replace(/<span style="font-weight:bold;?">(.*)<\/span>|<b\b[^>]*>(.*?)<\/b[^>]*>/gi, '<strong>$1</strong>');
      }
      if(div) {div.innerHTML = editor.obj.toggle.activetext || 'wysiwyg'}
      editor.t.value = v;
      editor.t.style.height = editor.i.height + 'px';
      editor.i.style.display = 'none'; editor.t.style.display = 'block'; editor.d = 0;
    }
  };
  editor.post = function() {
    if(editor.d) {
      editor.toggle(1);
    }
  };
  editor.insertImg = function(file) {
    var reader, selection, range, img;
    if (file && !file.type.indexOf('image/')) {
      reader = new FileReader();
      reader.onload = function() {
        if (editor.ie) {
          editor.restoreSelection();
          selection = editor.e.getSelection();
          if (selection.rangeCount) {
            range = selection.getRangeAt(0);
            range.collapse(false);
          } else {
            range = editor.e.createRange();
            range.setEndAfter(editor.e.body.lastChild);
            range.collapse(false);
          }
          img = editor.e.createElement('img');
          img.src = this.result;
          range.insertNode(img);
          range.setEndAfter(img);
          range.collapse(false);
          selection.removeAllRanges();
          selection.addRange(range);
        } else {
          editor.e.execCommand('insertimage', 0, this.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  editor.pasteImg = function(e) {
    var html, comments, style, node, item;
    if (!editor.ie) {
      html = e.clipboardData.getData('text/html');
      if (html != '') {
        comments = html.match(/\<style\>\r\n\<\!\-\-[\s\S]*?\-\-\>\r\n\<\/style\>/);
        if (comments) {
          style = comments[0].replace(/\<style\>\r\n\<\!\-\-/, '').replace(/\-\-\>\r\n\<\/style\>/, '');
          node = document.createElement('style');
          node.innerHTML = style;
          setTimeout(function(parent, node){
            parent.insertBefore(node, parent.childNodes[0]);
          }, 50, editor.e.body, node);
        }
      } else {
        item = e.clipboardData.items[0];
        if (item && !item.type.indexOf('image/')) {
          editor.insertImg(item.getAsFile());
        }
      }
    }
  };
  editor.cancelOpenFile = function(e) {
//     var files, types, i;
//     files = e.dataTransfer.files;
//     types = e.dataTransfer.types;
//     if (files.length) {
//       return false;
//     }
//     for (i = 0; i < types.length; i++) {
//       if ('Files' == types[i]) {
//         return false;
//       }
//     }
    e.preventDefault();
  };
  editor.dropImg = function(e) {
    var files, types, i;
    files = e.dataTransfer.files;
    for (i = 0; i < files.length; i++) {
      editor.insertImg(files[i]);
    }
    setTimeout(function() {editor.removeLocalImg()}, 50);
  };
  editor.removeLocalImg = function() {
    var imgs, img, src, i;
    imgs = editor.e.body.getElementsByTagName('img');
    for (i = imgs.length - 1; i >= 0; i--) {
      img = imgs[i];
      src = img.src;
      if (src && !src.indexOf('file://')) {
        img.parentNode.removeChild(img);
      }
    }
  };
  editor.cursor = function(e) {
    return e.screenY + document.body.scrollTop + document.documentElement.scrollTop;
  }
  return editor;
}

