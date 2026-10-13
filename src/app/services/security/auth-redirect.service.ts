import { DOCUMENT, inject, Injectable } from "@angular/core";
import { BawSessionService } from "@baw-api/baw-session.service";
import { ConfigService } from "@services/config/config.service";

@Injectable({ providedIn: "root" })
export class AuthRedirectService {
  private readonly document = inject(DOCUMENT);
  private readonly config = inject(ConfigService);
  private readonly session = inject(BawSessionService);

  /** Return to an approved caller with the session token in the user_token QSP. */
  public redirect(redirect: unknown): boolean {
    const browser = this.document.defaultView;
    if (!browser || typeof redirect !== "string" || !this.session.authToken) {
      return false;
    }

    let url: URL;
    try {
      url = new URL(redirect);
    } catch {
      return false;
    }

    if (url.protocol !== "https:" || url.username || url.password) {
      return false;
    }

    const domains = this.config.settings.authRedirectDomains ?? [];
    const allowed = domains.some((domain) => {
      const pattern = domain.toLowerCase();
      if (pattern.startsWith("*.")) {
        const suffix = pattern.slice(1);
        return url.hostname.endsWith(suffix) && url.hostname.length > suffix.length;
      }
      return url.hostname === pattern;
    });

    if (!allowed) {
      return false;
    }

    browser.location.assign(this.session.addAuthTokenToUrl(url.href));
    return true;
  }
}
