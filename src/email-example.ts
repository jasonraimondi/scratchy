import { compile } from "handlebars";
import mjml2html from "mjml";

const template = compile(`
<mjml>
  <mj-body>
    <mj-container>
      <mj-section>
        <mj-column>
          <mj-text>{{ message }}</mj-text>
        </mj-column>
      </mj-section>
    </mj-container>
  </mj-body>
</mjml>
`);
const context = {
  message: "Hello World",
};
const mjml = template(context);
const html = mjml2html(mjml);
console.log(mjml);
