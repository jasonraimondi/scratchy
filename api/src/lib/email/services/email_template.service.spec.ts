import { EmailTemplateService } from "~/lib/email/services/email_template.service";

describe(EmailTemplateService.name, () => {
  let emailTemplateService: EmailTemplateService;

  beforeAll(() => {
    emailTemplateService = new EmailTemplateService();
  });

  it("txt email templates render", async () => {
    const template = emailTemplateService.txt("test/hello-world", { name: "World" });
    expect(template).toBe("Hello World");
  });

  it("html email templates render", async () => {
    const template = emailTemplateService.html("test/hello-world", { name: "World" });
    expect(template).toBe("<p>Hello World</p>");
  });

  it("mjml email templates render", async () => {
    const template = emailTemplateService.html("test/hello-mjml", { name: "World" });
    expect(template.includes("<!doctype html>")).toBeTruthy();
    expect(template.trim().endsWith("</html>")).toBeTruthy();
  });
});
