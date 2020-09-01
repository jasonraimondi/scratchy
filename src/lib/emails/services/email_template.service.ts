import { Injectable, Logger } from "@nestjs/common";
import { promises } from "fs";
import { compile } from "handlebars";
import mjml2html from "mjml";

import { ENV } from "~/lib/config/environment";

@Injectable()
export class EmailTemplateService {
  private readonly logger = new Logger(EmailTemplateService.name);
  private templatesDir = ENV.emailTemplatesDir;

  async txt(path: string, context = {}): Promise<string> {
    const handlebarsTemplate = compile(await this.getFileFromPath(`${path}.txt`));
    return handlebarsTemplate(this.mergeContext(context));
  }

  async html(path: string, context = {}): Promise<string> {
    const handlebarsTemplate = compile(await this.getFileFromPath(`${path}.html`));
    let result = handlebarsTemplate(this.mergeContext(context));
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

  private async getFileFromPath(path: string) {
    path = `${this.getTemplatesDir(path)}.hbs`;
    return promises.readFile(path, "utf8");
  }

  private getTemplatesDir(template: string) {
    return this.templatesDir + "/" + template;
  }
}
