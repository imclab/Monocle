(function () {

  with (Carlyle.Styles) {
    container.background = "none";
    container.right = "24px";
    container.left = '0';
    container.width = 'auto';
    page.top = page.bottom = "6px";
    page["-webkit-box-shadow"] = "1px 0 2px #997";
    page["-moz-box-shadow"] = "1px 0 2px #997";
    page["-webkit-border-top-left-radius"] = "26px 4px";
    page["-webkit-border-bottom-left-radius"] = "26px 4px";
    page["-moz-border-radius-topleft"] = "26px 4px";
    page["-moz-border-radius-bottomleft"] = "26px 4px";
    page['background-color'] = "#FFFEFC";
    page['background-image'] =
      "-moz-linear-gradient(0deg, #EDEAE8 0px, #FFFEFC 24px)";
    page.background =
      "-webkit-gradient(linear, 0 0, 24 0, from(#EDEAE8), to(#FFFEFC))";
    scroller.top = scroller.bottom = "2.5em";
    scroller.left = "1em";
    scroller.right = "1em";
    content.color = "#310";
    content["font-family"] = "Palatino, Georgia, serif";
    content["line-height"] = "130%";
    Controls.Magnifier.button.color = "#632";
    Controls.Magnifier.button.padding = "3px 6px";
    Controls.Magnifier.button['-webkit-border-radius'] = "3px";
    Controls.Magnifier.button.background = "#FFF";
    Controls.Magnifier.button.top = "8px";
  }

  var bookData = {
    getComponents: function () {
      var componentDiv = document.getElementById('components');
      var cmpts = [];
      for (var i = 0; i < componentDiv.childNodes.length; ++i) {
        var node = componentDiv.childNodes[i];
        if (node.nodeType == 1 && node.id) {
          cmpts.push(node.id);
        }
      }
      return cmpts;
    },
    getContents: function () {
      return [
        {
          title: "Book the First&mdash;Recalled to Life",
          src: "part1",
          children: [
            {
              title: "I. The Period",
              src: "part1#part1-I"
            },
            {
              title: "II. The Mail",
              src: "part1#part1-II"
            },
            {
              title: "III. The Night Shadows",
              src: "part1-III"
            },
            {
              title: "IV. The Preparation",
              src: "part1-IV"
            },
            {
              title: "V. The Wine-shop",
              src: "part1-V"
            },
            {
              title: "V. The Shoemaker",
              src: "part1-VI"
            }
          ]
        },
        {
          title: "Book the Second&mdash;the Golden Thread",
          src: "part2",
          children: [
            {
              title: "I. Five Years Later",
              src: "part2#part2-I"
            },
            {
              title: "II. A Sight",
              src: "part2-II"
            },
            {
              title: "III. A Disappointment",
              src: "part2-III"
            },
            {
              title: "IV. Congratulatory",
              src: "part2-IV"
            }
          ]
        }
      ]
    },
    getComponent: function (componentId) {
      return document.getElementById(componentId).innerHTML;
    },
    getMetaData: function (key) {
      return {
        title: "A Tale of Two Cities",
        creator: "Charles Dickens"
      }[key];
    }
  }


  function createToC(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    var controlLayer = document.getElementById('readerCntr');

    tocList = document.createElement('ul');
    tocList.className = 'root';
    var listBuilder = function (chp, padLvl) {
      var li = document.createElement('li');
      var span = document.createElement('span');
      span.style.paddingLeft = padLvl + "em";
      li.appendChild(span);
      span.innerHTML = chp.title;
      li.onclick = function () {
        window.reader.skipToChapter(chp.src);
        controlLayer.removeChild(controlLayer.tocMenu);
      }
      tocList.appendChild(li);
      if (chp.children) {
        for (var i = 0; i < chp.children.length; ++i) {
          listBuilder(chp.children[i], padLvl + 1);
        }
      }
    }

    var contents = bookData.getContents();
    for (var i = 0; i < contents.length; ++i) {
      listBuilder(contents[i], 0);
    }

    /*
    tocList.addEventListener(
      'touchstart',
      function (evt) {
        tocList.moveStart = evt.touches[0].pageY;
        tocList.scrollStart = tocList.scrollTop;
        evt.preventDefault();
      }
    );

    tocList.addEventListener(
      'touchmove',
      function (evt) {
        evt.preventDefault();
        var dist = evt.touches[0].pageY - tocList.moveStart;
        if (dist) {
          tocList.scrollTop = tocList.scrollStart - dist;
        }
      }
    );

    tocList.addEventListener(
      'touchend',
      function () {
        if (tocList.moveStart == evt.touches[0].pageY) {
          tocList.moveStart = null;
          tocList.scrollStart = null;
        }
      }
    );
    */

    if (!controlLayer.tocMenu) {
      controlLayer.tocMenu = document.createElement('div');
      controlLayer.tocMenu.id = "toc";
      controlLayer.tocMenu.appendChild(tocList);
      var arrow = document.createElement('div');
      arrow.className = "tocArrow";
      controlLayer.tocMenu.appendChild(arrow);
    }
    if (controlLayer.tocMenu.parentNode) {
      controlLayer.removeChild(controlLayer.tocMenu);
    } else {
      controlLayer.appendChild(controlLayer.tocMenu);
    }
  }


  // Initialize the reader element.
  window.addEventListener(
    'load',
    function () {
      window.reader = Carlyle.Reader('reader', bookData);
      window.addEventListener(
        'resize',
        function () { window.reader.resized() },
        false
      );


      /* PLACE SAVER */
      var placeSaver = new Carlyle.Controls.PlaceSaver(reader);
      reader.addControl(placeSaver, 'invisible');
      var lastPlace = placeSaver.savedPlace();
      if (lastPlace) {
        placeSaver.restorePlace();
      }


      /* MAGNIFIER CONTROL */
      var magnifier = new Carlyle.Controls.Magnifier(reader);
      reader.addControl(magnifier, 'standard');


      /* BOOK TITLE RUNNING HEAD */
      var bookTitle = {
        createControlElements: function () {
          var cntr = document.createElement('div');
          cntr.className = "bookTitle";
          var runner = document.createElement('div');
          runner.className = "runner";
          runner.innerHTML = reader.getBook().getMetaData('title');
          cntr.appendChild(runner);
          var evtType = typeof Touch == "object" ? "touchstart" : "mousedown";
          cntr.addEventListener(evtType, createToC, false);
          return cntr;
        }
      }
      reader.addControl(bookTitle, 'page');


      /* CHAPTER TITLE RUNNING HEAD */
      var chapterTitle = {
        runners: [],
        createControlElements: function () {
          var cntr = document.createElement('div');
          cntr.className = "chapterTitle";
          var runner = document.createElement('div');
          runner.className = "runner";
          cntr.appendChild(runner);
          this.runners.push(runner);
          return cntr;
        },
        update: function () {
          for (var i = 0; i < this.runners.length; ++i) {
            var place = reader.getPlace({ div: i });
            this.runners[i].innerHTML = place.chapterTitle();
          }
        }
      }
      reader.addControl(chapterTitle, 'page');
      chapterTitle.update();
      reader.addEventListener(
        'carlyle:pagechange',
        function () { chapterTitle.update(); }
      );


      /* PAGE NUMBER RUNNING HEAD */
      var pageNumber = {
        runners: [],
        createControlElements: function () {
          var cntr = document.createElement('div');
          cntr.className = "pageNumber";
          var runner = document.createElement('div');
          runner.className = "runner";
          cntr.appendChild(runner);
          this.runners.push(runner);
          return cntr;
        },
        update: function () {
          for (var i = 0; i < this.runners.length; ++i) {
            var place = reader.getPlace({ div: i });
            this.runners[i].innerHTML = place.pageNumber();
          }
        }
      }
      reader.addControl(pageNumber, 'page');
      pageNumber.update();
      reader.addEventListener(
        'carlyle:pagechange',
        function () { pageNumber.update() }
      );


      /* Scrubber */
      var scrubber = new Carlyle.Controls.Scrubber(reader);
      reader.addControl(scrubber, 'page', { hidden: true });
      var showFn = function (evt) {
        evt.stopPropagation();
        reader.showControl(scrubber);
        scrubber.updateNeedles();
      }
      var eT = (typeof(Touch) == "object" ? "touchstart" : "mousedown");
      for (var i = 0; i < 2; ++i) {
        chapterTitle.runners[i].parentNode.addEventListener(eT, showFn, false);
        pageNumber.runners[i].parentNode.addEventListener(eT, showFn, false);
      }
      var hideScrubber = function (evt) {
        evt.stopPropagation();
        reader.hideControl(scrubber);
      }
      reader.addEventListener('carlyle:lift:forward', hideScrubber);
      reader.addEventListener('carlyle:lift:backward', hideScrubber);
      reader.addEventListener('carlyle:lift:center', hideScrubber);

    },
    false
  );
})();