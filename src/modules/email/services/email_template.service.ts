import { Injectable, Logger } from "@nestjs/common";
import { promises } from "fs";
import { compile } from "handlebars";
import mjml2html from "mjml";

import { ENV } from "~/config/environment";

@Injectable()
export class EmailTemplateService {
  private readonly logger = new Logger(EmailTemplateService.name);
  private readonly templatesDir = ENV.emailTemplatesDir;

  async txt(path: string, context = {}): Promise<string> {
    const template = compile(await this.getFileFromPath(`${path}.txt`));
    return template(context);
  }

  async html(path: string, context = {}): Promise<string> {
    const handlebarsTemplate = compile(await this.getFileFromPath(`${path}.html`));
    const rawMJML = handlebarsTemplate(context);
    const { html } = mjml2html(rawMJML);
    return html;
  }

  private getFileFromPath(path: string) {
    path = `${this.getTemplatesDir(path)}.hbs`;
    return promises.readFile(path, "utf8"); // need to be in an async function
  }

  private getTemplatesDir(template: string) {
    return this.templatesDir + "/" + template;
  }
}
