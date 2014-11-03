// Generated by CoffeeScript 1.8.0

/*
// ==UserScript==
// @id             lpm11/TumblrBeginmarks
// @name           TumblrBeginmarks
// @description    Add beginmarks to tumblr dashboard
// @include        http://www.tumblr.com/dashboard
// @include        https://www.tumblr.com/dashboard
// @require        http://code.jquery.com/jquery-latest.js
// @version        0.1
// @grant          none
// ==/UserScript==
 */

(function() {
  var beginmarks, first_post_id, insertionText, mo, x, _ref, _ref1;

  insertionText = function(_t) {
    var t;
    t = new Date(_t * 1000);
    return '<li class="notification single_notification alt"><div class="notification_inner clearfix"><div class="notification_sentence"><div class="hide_overflow">ここから読んでた: ' + ("" + (t.getFullYear()) + "/" + (t.getMonth()) + "/" + (t.getDay()) + " " + (t.getHours()) + ":" + (t.getMinutes()) + ":" + (t.getSeconds())) + '</div></div></div></li>';
  };

  beginmarks = JSON.parse(localStorage.getItem("TumblrBeginmarks-beginmarks"));

  console.log("TumblrBeginmarks: " + (beginmarks != null ? beginmarks.length : 0) + " record[s] found.");

  console.dir(beginmarks);

  if ((beginmarks != null)) {
    $("#posts .post[data-post-id]").each(function() {
      var b, _i, _len;
      for (_i = 0, _len = beginmarks.length; _i < _len; _i++) {
        b = beginmarks[_i];
        if ($(this).attr("data-post-id") === b["post_id"]) {
          console.log("TumblrBeginmarks: found beginmark: " + b['post_id']);
          $(this).before(insertionText(b["created_at"]));
        }
      }
    });
  } else {
    beginmarks = [];
  }

  mo = new MutationObserver(function(mutationRecords) {
    var post_container, record, _i, _j, _len, _len1, _ref;
    for (_i = 0, _len = mutationRecords.length; _i < _len; _i++) {
      record = mutationRecords[_i];
      if ((record.addedNodes != null)) {
        _ref = record.addedNodes;
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          post_container = _ref[_j];
          $(post_container).find(".post[data-post-id]").each(function() {
            var b, _k, _len2, _results;
            _results = [];
            for (_k = 0, _len2 = beginmarks.length; _k < _len2; _k++) {
              b = beginmarks[_k];
              if ($(this).attr("data-post-id") === b["post_id"]) {
                console.log("TumblrBeginmarks: found beginmark: " + b['post_id']);
                _results.push($(this).before(insertionText(b["created_at"])));
              } else {
                _results.push(void 0);
              }
            }
            return _results;
          });
        }
      }
    }
  });

  mo.observe($("#posts").get(0), {
    childList: true
  });

  first_post_id = (_ref = $("#posts .post[data-post-id]")) != null ? _ref.first().attr("data-post-id") : void 0;

  if (first_post_id) {
    x = {
      "post_id": first_post_id,
      "created_at": new Date() / 1000 | 0
    };
    if (((_ref1 = beginmarks[0]) != null ? _ref1["post_id"] : void 0) === first_post_id) {
      beginmarks[0] = x;
    } else {
      beginmarks.unshift(x);
      if (beginmarks.length > 3) {
        beginmarks.pop();
      }
    }
    localStorage.setItem("TumblrBeginmarks-beginmarks", JSON.stringify(beginmarks));
  }

}).call(this);