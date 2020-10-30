import { Injectable } from "@nestjs/common";
import mjml2html from "mjml";
import nunjucks from "nunjucks";

import { ENV } from "~/config/environment";

@Injectable()
export class EmailTemplateService {
  private readonly nunjucks = nunjucks.configure(ENV.templatesDir, {
    autoescape: true,
  });

  txt(path: string, context = {}): string {
    return this.nunjucks.render(`emails/${path}.txt.njk`, this.mergeContext(context))
  }

  html(path: string, context = {}): string {
    let result = this.nunjucks.render(`emails/${path}.html.njk`, this.mergeContext(context));
    if (result.includes("<mjml>")) {
      const { html } = mjml2html(result);
      result = html;
    }
    return result;
  }

  private mergeContext(context: any): any {
    return {
      ...context,
      app_name: "Scratchy",
      app_homepage: "https://jasonraimondi.com",
    };
  }
}
