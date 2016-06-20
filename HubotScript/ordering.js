var Conversation = require('hubot-conversation');


module.exports = function (robot) {

  var switchBoard = new Conversation(robot);
  var searchUrl =
  "DUMMY_URL?";


  robot.respond(/order more (.*)/, function (msg) {
    var search_terms = msg.match[1].split(" ").join(",");
    var dialog = switchBoard.startDialog(msg);
    var request = require('request');
    var response;
    request( searchUrl + "query=" + search_terms,
    function(err, res, body) {
      response = JSON.parse(body);
      var choices = "";
      for (i = 0; i < response.results.length; i++) {
        var choices = choices.concat(i + ": "+ response.results[i].price +
          " -- " + response.results[i].desc + "\n");
      }
      msg.reply("Here are previously ordered supplies: \n" + choices);
    });
    dialog.addChoice(/([0-9]+)/i, function (msg2) {
      var item = response.results[parseInt(msg2.match[1], 10)];
      if (item.ordered == "N") {
        msg2.reply("This item is already listed to be ordered");
      } else {
        msg2.reply("Ordering more of: \n" + item.desc
        + "\nHow many do you want?");
        dialog.addChoice(/([0-9]+)/i, function (msg3) {
          var count = parseInt(msg3.match[1], 10);
          item.quant = count;
          msg3.reply("Ordering " + item.quant + " more of: \n" +
          item.desc +
          "\nWho is the order for (the end user)?");
          dialog.addChoice(/^(?!cancel$).*/i, function (msg4) {
            if (/\: (.*)/i.test(msg4.match[0])) {
              var  end_user = msg4.match[0].match(/\: (.*)/i)[1];
            } else {
              var  end_user = msg4.match[0];
            }
            item.user = end_user;
            msg4.reply("Ordering " + item.quant + " more of: \n" +
            item.desc +
            "\nfor " + item.user +
            "\nReply yes to order!");
            dialog.addChoice(/yes/i, function (msg5) {
              var parameters = []
              parameters.push("sku=" + encodeURIComponent(item.sku));
              parameters.push("quant=" + encodeURIComponent(item.quant));
              parameters.push("price=" + encodeURIComponent(item.price));
              parameters.push("vend=" + encodeURIComponent(item.vend));
              parameters.push("user=" + encodeURIComponent(item.user));
              parameters.push("desc=" + encodeURIComponent(item.desc));
              parameters.push("hcname=" + encodeURIComponent(msg5.message.user.name));
              parameters.sort();
              var paramString = parameters.join('&');
              var response;
              console.dir(paramString);
              var request = require('request');
              request(searchUrl + paramString,
              function(err, res, body) {
                msg5.reply(body);
              });
            });
            dialog.addChoice(/^(?!yes$).*/i, function (msg5) {
              msg5.reply("Canceled Order");
            });
          });
          dialog.addChoice(/cancel/i, function (msg4) {
            msg4.reply("Canceled Order");
          });
        });
        dialog.addChoice(/cancel/i, function (msg3) {
          msg3.reply("Canceled Order");
        });
      }
    });
    dialog.addChoice(/cancel/i, function (msg2) {
      msg2.reply("Canceled Order");
    });
  });
};
