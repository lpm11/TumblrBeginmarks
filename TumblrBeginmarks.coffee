###
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
###

insertionText = (_t) ->
  t = new Date(_t * 1000);
  return '<li class="notification single_notification alt"><div class="notification_inner clearfix"><div class="notification_sentence"><div class="hide_overflow">↓ここから読んでた: ' + "#{t.getFullYear()}/#{t.getMonth()}/#{t.getDay()} #{t.getHours()}:#{t.getMinutes()}:#{t.getSeconds()}" + '</div></div></div></li>';

beginmarks = JSON.parse(localStorage.getItem("TumblrBeginmarks-beginmarks"));
console.log("TumblrBeginmarks: #{if beginmarks? then beginmarks.length else 0} record[s] found.");
# debug
console.dir(beginmarks);

if (beginmarks?)
  # Current shown posts
  $("#posts .post[data-post-id]").each ->
    for b in beginmarks
      if ($(this).attr("data-post-id")==b["post_id"])
        console.log("TumblrBeginmarks: found beginmark: #{b['post_id']}");
        $(this).before(insertionText(b["created_at"]));
    return;
else
  beginmarks = [];

# Future shown posts
mo = new MutationObserver((mutationRecords) ->
  for record in mutationRecords
    if (record.addedNodes?)
      for post_container in record.addedNodes
        $(post_container).find(".post[data-post-id]").each ->
          for b in beginmarks
            if ($(this).attr("data-post-id")==b["post_id"])
              console.log("TumblrBeginmarks: found beginmark: #{b['post_id']}");
              $(this).parent("li").before(insertionText(b["created_at"]));
  return;
);
mo.observe($("#posts").get(0), { childList: true });

first_post_id = $("#posts .post[data-post-id]")?.first().attr("data-post-id");
if (first_post_id)
  x = { "post_id": first_post_id, "created_at": new Date()/1000|0 };
  if (beginmarks[0]?["post_id"]==first_post_id)
    beginmarks[0] = x;
  else
    beginmarks.unshift(x);
    beginmarks.pop() if (beginmarks.length > 3);
  localStorage.setItem("TumblrBeginmarks-beginmarks", JSON.stringify(beginmarks));
