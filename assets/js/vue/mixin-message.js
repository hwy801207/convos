(function() {
  Convos.mixin.message = {
    props: ["dialog", "msg", "user"],
    methods: {
      classNames: function() {
        var msg = this.msg;
        var c = {highlight: this.msg.highlight ? true : false};

        if (!msg.type.match(/^(notice|error)$/) && this.dialog.dialog_id && !this.dialog.participants[msg.from]) {
          c["inactive-user"] = true;
        }

        if (msg.message && msg.from == msg.prev.from) {
          c["same-user"] = true;
        }
        else {
          c["changed-user"] = true;
        }

        return c;
      },
      loadOffScreen: function(html, id) {
        if (html.match(/^<a\s/)) return;

        // TODO: Add support for showing paste inline
        if (html.match(/class=".*(text-paste|text-gist-github)/)) return;

        var self = this;
        var $html = $(html);
        var $a = $('#' + id);

        $html.filter("img").add($html.find("img")).addClass("embed materialboxed");
        $a.parent().append($html).find(".materialboxed").materialbox();
      },
      message: function() {
        return this.msg.richMessage || this.msg.message.xmlEscape();
      },
      statusTooltip: function() {
        return this.dialog.participants[this.msg.from] ? "" : "Not in this channel";
      }
    },
    ready: function() {
      this.$once("visible", function() {
        var self = this;
        if (!self.settings.expandUrls) return;
        self.msg.richMessage = self.msg.message.xmlEscape().autoLink({
          target: "_blank",
          after: function(url, id) {
            $.get("/api/embed?url=" + encodeURIComponent(url), function(html, textStatus, xhr) {
              self.loadOffScreen(html, id);
            });
          }
        });
      });
    }
  };
})();
