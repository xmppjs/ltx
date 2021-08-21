import vows from "vows";
import assert from "assert";
import Element from "../src/Element.js";

vows
  .describe("unicode")
  .addBatch({
    "unicode forming": {
      "issue-29": () => {
        const text = "Hello ɝ";
        const element = new Element("iq");
        element.t(text);
        assert.strictEqual(element.toString(), "<iq>" + text + "</iq>");
      },
      /*
    'issue-29 test #2': function() {
       var text = '니코드<'
       var element = new Element(
           'message', { to: 'you@server.com', type: 'chat' }
       )
           .c('body').t('니코드<'.toString('utf8'))
       assert.strictEqual(element.getChildText('body'), text)
    },
    */
      "issue-29 test #3": () => {
        const text = "니코드<";
        const element = new Element("message", {
          to: "you@server.com",
          type: "chat",
        })
          .c("body")
          .t("니코드<".toString("utf8"));
        assert.strictEqual(element.getText(), text);
      },
      "issue-29 test write": () => {
        const text = "유니코드";
        let result =
          '<0message0 0to0="0-1@chat.fb.com0"0 0type0="0chat0"0>0<0body0>'.split(
            0
          );
        result.push(text);
        result = result.concat("</0body0>0</0message0>".split(0));
        const element = new Element("message", {
          to: "-1@chat.fb.com",
          type: "chat",
        });
        element.c("body").t(text.toString("utf8"));
        element.write((c) => {
          assert.strictEqual(result.shift(), c);
        });
        assert.strictEqual(result.length, 0);
      },
    },
  })
  .run();
