import { EmailTemplateService } from "~/app/email/services/email_template.service";

describe(EmailTemplateService.name, () => {
  let emailTemplateService: EmailTemplateService;

  beforeAll(() => {
    emailTemplateService = new EmailTemplateService();
  });

  it("txt email templates render", async () => {
    const foo = emailTemplateService.txt("test/hello-world", { name: "World" });
    expect(foo).toBe("Hello World");
  });

  it("html email templates render", async () => {
    const foo = emailTemplateService.html("test/hello-world", { name: "World" });
    expect(foo).toBe("<p>Hello World</p>");
  });

  it("mjml email templates render", async () => {
    const foo = emailTemplateService.html("test/hello-mjml", { name: "World" });
    expect(foo.includes("<!doctype html>")).toBeTruthy();
    expect(foo.trim().endsWith("</html>")).toBeTruthy();
  });
});
