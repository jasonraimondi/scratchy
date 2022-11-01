import { Injectable } from "@nestjs/common";
import mjml2html from "mjml";
import nunjucks from "nunjucks";

import { ENV } from "~/config/environment";

@Injectable()
export class EmailTemplateService {
  private readonly nunjucks = nunjucks;

  both(path: string, context: Record<string, unknown> = {}) {
    return {
      text: this.txt(path, context),
      html: this.html(path, context),
    };
  }

  txt(path: string, context: Record<string, unknown> = {}): string {
    return this.nunjucks.render(`emails/${path}.txt.njk`, this.mergeContext(context));
  }

  html(path: string, context: Record<string, unknown> = {}): string {
    let result = this.nunjucks.render(`emails/${path}.html.njk`, this.mergeContext(context));
    if (result.includes("<mjml>")) {
      const { html } = mjml2html(result);
      result = html;
    }
    return result;
  }

  private mergeContext(context: Record<string, unknown>): Record<string, unknown> {
    return {
      ...context,
      app_name: ENV.appName,
      app_url: ENV.urlWeb,
    };
  }
}
