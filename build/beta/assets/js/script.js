var loadDeferredStyles = function() {
  var defer, tmp, i, w = window, d=document,
  GEO = {
    center:{
      lat:35.5942238,
      long:139.7242792,
      zoom:15,
    },
  }, SUBMIT_RECENTLY = {
    show:1,
    header:'Ooops',
    body:'It looks like you already sent us a message (this is needed to prevent spam), but worry not, as soon as you close this message, you can sent me another message.'
  }, SUBMIT_SENDING = {
    show:1,
    header:'Sending Message',
    body:'Did you know, that your message is travelling via Internet to my slack channel in less than a second!'
  }, SUBMIT_INVALID = {
    show:1,
    header:'Invalid Response',
    body:'Invalid response from server, in case of emergency you can call my number.'
  }, SUBMIT_SENT = {
    show:1,
    header:'Message Sent',
    body:'Your message has been sent, please wait for the next reply.'
  }, SUBMIT_FAILED = {
    show:1,
    header:'Failed',
    body:'Unable to sent your message, probably network connection issue.'
  },
  TOKEN_MAPBOX = 'pk.eyJ1IjoiZ3VuYXdhbndpamF5YSIsImEiOiJjajM2Zm54cngwNTM3MzNxNjdqOXcxNTZ2In0.U2aHrmrL5HEht8hX2I4FzA',
  URL_GOOGLE_MAPS = 'https://www.google.co.id/maps/place/Japan,+〒143-0023+Tōkyō-to,+Ōta-ku,+Sannō,+1+Chome−２４−１+凛ｏｍｏｒｉ/@'+GEO.center.lat+','+GEO.center.long+','+GEO.center.zoom+'z/',
  URL_SLACK_WEBHOOK = 'https://hooks.slack.com/services/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';
  w.el = [];
  w.el['.hero .title span'] = one('.hero .title span');
  w.el['.hero .cover'] = one('.hero .cover');
  w.el['#contact form'] = one('#contact form');
  w.el['.menu'] = one('.menu');
  w.el['#map'] = one('#map');
  w.el['.gallery'] = all('.gallery')
  isLoaded = {};
  isLoaded.Mapbox = 0;

  gumshoe.init({selectorHeader: '[data-gumshoe]'});
  smoothScroll.init({selectorHeader: '[data-gumshoe]'});
  NProgress.done();
  removeClass(one('html'), 'jsload');

  // scrollspy + parallax
  var lastScrollTop = 0;
  function scrollax(e){
    var st = getScroll().y;
    if (getViewport().w<640) {
      if (st > lastScrollTop && st > 0 && getViewport().w/(st) < 2){
        addClass(w.el['.menu'],'folded');  // scroll down
      } else {
        removeClass(w.el['.menu'],'folded');  // scroll up
      } lastScrollTop = st;
    } else {
      removeClass(w.el['.menu'],'folded');
    }
    w.el['.hero .title span'].style.top = Math.floor(st/2)+'px';
    tryMapbox();
  }
  on(w, 'scroll resize', scrollax);
  // scrollspy + parallax

  // modal
  w.modal = {
    close: function () {
      one('.modal')?one('.modal').parentNode.removeChild(one('.modal')):0;
    },
    invoke: function (data,onClose) {
      w.modal.close();
      data = data || {};
      tmp = w.modal.data;
      if (data.show && !one('.modal')) {
        var modal=d.createElement('div');
        modal.innerHTML+= '<h1 class="header">' + (data.header?data.header:tmp.header) + '</h1>';
        modal.innerHTML+= '<div class="body">' + (data.body?data.body:tmp.body) + '</div>';
        modal.innerHTML+= '<button class="close"></button>';
        modal.className+= 'modal ' + (data.className?data.className:tmp.className);
        d.body.appendChild(modal);
        on(one('.modal .close'), 'click', function() {
          w.modal.close(); (typeof onClose=='function')?onClose():0;
        });
        on(document, 'keydown', function(e) {
          e = e || w.event; var isEscape = (e.keyCode == 27) || false;
          if (isEscape) {
            w.modal.close(); (typeof onClose=='function')?onClose():0;
          }
        });
      } tmp = {}
    },
    data : {
      "show": 0,
      "status": 0,
      "className": "",
      "header": "Header",
      "body": "Body goes here"
    }
  };
  // modal

  // hero animation
  function mouseTrigger_HeroAni(e) {
    var data = [
      'ME.SELF',
      'My.SElf',
      '_y.SEph',
      '_YOSEPH',
      '_iOS___',
      '__iOS__',
      '___iOS_',
      '____iOS',
    ];
    data = e.type=='mouseover' ? data.reverse() : data;
    function ani(el){
      if (w.stackOf_HeroAni && w.stackOf_HeroAni.length) {
        el.innerHTML = w.stackOf_HeroAni.pop();
        setTimeout(function(){ ani(el); },200);
      }
    }
    if (w.stackOf_HeroAni.length<1) {
      w.stackOf_HeroAni = data; ani(w.el['.hero .title span']);
    } else {
      w.stackOf_HeroAni = data.splice(0,w.stackOf_HeroAni.length);
    }
  }
  w.stackOf_HeroAni = [];
  on(w.el['.hero .title span'], 'mouseover mouseout', mouseTrigger_HeroAni);
  // hero animation

  // gallery
  on(all('.gallery .prev, .gallery .next'), 'click', function(e) {
    var inc = (hasClass(this, 'prev')) ? -1 : 1 ;
    var gallery = this.parentNode;
    var list = JSON.parse(gallery.dataset.img);
    var idx = 1*gallery.dataset.idx || 0;
    var img = one('img', gallery);
    idx = (idx + inc < 0) ? img.length-1 : (idx + inc > img.length-1) ? 0 : idx + inc;
    addClass(img, 'ease');
    on(img, 'load', function (data) { this.style.opacity='1'; });
    img.style.opacity='.3';
    setTimeout(function(){ img.src = list[idx]; },200);
    this.parentNode.dataset.idx = idx;
  });
  // gallery

  // mapbox
  function tryMapbox() {
    if (!isLoaded.Mapbox && isElementInViewport(w.el['#map'])) {
      mapboxgl.accessToken = TOKEN_MAPBOX;
      lnlt = [GEO.center.long, GEO.center.lat];
      map = new mapboxgl.Map({
        container: 'map',
        center: lnlt,
        zoom: GEO.center.zoom,
        attributionControl: false,
        logoPosition: 'bottom-right',
        style: 'mapbox://styles/mapbox/streets-v9'
      });
      marker = new mapboxgl.Marker().setLngLat(lnlt).addTo(map);
      on(one('.mapboxgl-marker'), 'click', function(e) {
        w.open(URL_GOOGLE_MAPS, '_blank').focus();
      }); isLoaded.Mapbox = 1;
    }
  }tryMapbox();
  // mapbox

  // lazyload gallery
  function lazyGallery() {
    var g = w.el['.gallery']; i = g.length;
    while (i--) {
      tmp = one('img',g[i]);
      if(tmp.width>0){
        tmp.src = (tmp.src.indexOf('data:image')==0) ? tmp.src = JSON.parse(g[i].dataset.img)[0] : tmp.src;
      }
    }
  }lazyGallery(); on(w,'hashchange',lazyGallery);
  // lazyload gallery

  // slack webhook
  function submitContactForm(e) {
    e.preventDefault();
    if (w.recentlySubmitted) {
      modal.invoke(SUBMIT_RECENTLY,function() {
        removeClass(w.el['#contact form'], 'recently-submitted');
        w.recentlySubmitted = !1;
      });
    } else {
      modal.invoke(SUBMIT_SENDING);
      var el = e.target.elements;
      post(
        JSON.stringify({
          "attachments": [
            {
              "fallback": "New message from — " + el.name.value + "\nJOB — " + el.job.value + "\nEMAIL — "+ el.email.value + "\nMessage — "+ el.msg.value,
              "color": "#36a64f",
              "pretext": "New message",
              "author_name": el.name.value,
              "author_link": "mailto:" + el.email.value + "",
              "author_icon": "https://www.gravatar.com/avatar/" + md5((el.email.value).trim().toLowerCase()),
              "title": "JOB — " + el.job.value + "",
              "title_link": "mailto:" + el.email.value+ "",
              "fields": [
                {
                  "title": "Message",
                  "value": el.msg.value,
                  "short": false
                }
              ],
              "text": "", "image_url": "", "thumb_url": "",
              "footer": location.href,
              "footer_icon": "https://slack.com/favicon.ico",
              "ts": Date.now()/1000
            }
          ]
        }),
        URL_SLACK_WEBHOOK,
        function(data){console.log(data);
          if (data=='ok') {
            addClass(w.el['#contact form'], 'recently-submitted');
            w.el['#contact form'].reset();
            w.recentlySubmitted = true;
            modal.invoke(SUBMIT_SENT);
          } else {
            modal.invoke(SUBMIT_INVALID);
          }
        },
        function(idata){console.log(idata);
          modal.invoke(SUBMIT_INVALID);
        },
        function(error){console.log(error);
          modal.invoke(SUBMIT_FAILED);
        },
        {},
        0
      );
    }
    return false;
  }
  on(w.el['#contact form'], 'submit', submitContactForm);
  // slack webhook

  defer = one('#deferred-styles');
  tmp = document.createElement('var');
  tmp.innerHTML = defer.textContent;
  document.head.appendChild(tmp)
  defer.parentElement.removeChild(defer);
};
var raf = requestAnimationFrame || mozRequestAnimationFrame ||
webkitRequestAnimationFrame || msRequestAnimationFrame;
if (raf) raf(function() { window.setTimeout(loadDeferredStyles, 0); });
else window.addEventListener('load', loadDeferredStyles);
