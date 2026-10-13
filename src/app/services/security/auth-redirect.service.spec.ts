import { DOCUMENT } from "@angular/core";
import { BawSessionService } from "@baw-api/baw-session.service";
import { User } from "@models/User";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { ConfigService } from "@services/config/config.service";
import { generateUser } from "@test/fakes/User";
import { AuthRedirectService } from "./auth-redirect.service";

describe("AuthRedirectService", () => {
  let spec: SpectatorService<AuthRedirectService>;
  const settings: { authRedirectDomains?: string[] } = {};
  const assign = jasmine.createSpy("assign");
  const mockDocument = { defaultView: { location: { assign } } };
  const token = "test-token/+&=";
  const createService = createServiceFactory({
    service: AuthRedirectService,
    providers: [
      BawSessionService,
      { provide: ConfigService, useValue: { settings } },
      { provide: DOCUMENT, useValue: mockDocument },
    ],
  });

  beforeEach(() => {
    settings.authRedirectDomains = ["caller.example", "*.trusted.example"];
    assign.calls.reset();
    spec = createService();
    spec.inject(BawSessionService).setLoggedInUser(new User(generateUser()), token);
  });

  it("should redirect to an exact domain with an encoded token and preserve query and fragment", () => {
    const result = spec.service.redirect("https://caller.example/callback?state=abc&user_token=old#section");

    expect(result).toBeTrue();
    const url = new URL(assign.calls.mostRecent().args[0]);
    expect(url.origin).toBe("https://caller.example");
    expect(url.pathname).toBe("/callback");
    expect(url.searchParams.get("state")).toBe("abc");
    expect(url.searchParams.getAll("user_token")).toEqual([token]);
    expect(url.hash).toBe("#section");
  });

  it("should match domain names case insensitively", () => {
    settings.authRedirectDomains = ["CALLER.EXAMPLE"];

    expect(spec.service.redirect("https://CALLER.EXAMPLE/callback")).toBeTrue();
    expect(assign).toHaveBeenCalledTimes(1);
  });

  for (const hostname of ["app.trusted.example", "nested.app.trusted.example"]) {
    it(`should allow wildcard subdomain ${hostname}`, () => {
      expect(spec.service.redirect(`https://${hostname}/callback`)).toBeTrue();
      expect(assign).toHaveBeenCalledTimes(1);
    });
  }

  for (const redirect of [
    undefined,
    false,
    ["https://caller.example"],
    "/projects",
    "//caller.example/callback",
    "https://[",
    "javascript:alert(1)",
    "data:text/html,hello",
    "http://caller.example/callback",
    "https://untrusted.example/callback",
    "https://caller.example.attacker.example/callback",
    "https://notcaller.example/callback",
    "https://trusted.example/callback",
    "https://nottrusted.example/callback",
    "https://app.trusted.example.attacker.example/callback",
    "https://caller.example@attacker.example/callback",
    "https://attacker.example@caller.example/callback",
    "******caller.example/callback",
  ]) {
    it(`should reject unsafe or unapproved redirect ${JSON.stringify(redirect)}`, () => {
      expect(spec.service.redirect(redirect)).toBeFalse();
      expect(assign).not.toHaveBeenCalled();
    });
  }

  it("should disable redirects when the allowlist is omitted", () => {
    delete settings.authRedirectDomains;

    expect(spec.service.redirect("https://caller.example")).toBeFalse();
    expect(assign).not.toHaveBeenCalled();
  });

  it("should disable redirects when the allowlist is empty", () => {
    settings.authRedirectDomains = [];

    expect(spec.service.redirect("https://caller.example")).toBeFalse();
    expect(assign).not.toHaveBeenCalled();
  });

  it("should not redirect without an authentication token", async () => {
    await spec.inject(BawSessionService).clearLoggedInUser();

    expect(spec.service.redirect("https://caller.example")).toBeFalse();
    expect(assign).not.toHaveBeenCalled();
  });

  it("should not redirect during server rendering", () => {
    spec = createService({
      providers: [{ provide: DOCUMENT, useValue: { defaultView: null } }],
    });
    spec.inject(BawSessionService).setLoggedInUser(new User(generateUser()), token);

    expect(spec.service.redirect("https://caller.example")).toBeFalse();
    expect(assign).not.toHaveBeenCalled();
  });
});
