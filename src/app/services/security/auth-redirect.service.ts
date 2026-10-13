import { DOCUMENT, inject, Injectable } from "@angular/core";
import { BawSessionService } from "@baw-api/baw-session.service";
import { ConfigService } from "@services/config/config.service";

@Injectable({ providedIn: "root" })
export class AuthRedirectService {
  private readonly document = inject(DOCUMENT);
  private readonly config = inject(ConfigService);
  private readonly session = inject(BawSessionService);

  /** Return to an approved caller with the session token in the user_token QSP. */
  public willRedirectExternally(redirect: string): boolean {
    const browser = this.document.defaultView;
    if (!browser) {
      return this.reject("Browser navigation is unavailable during server rendering.");
    }
    if (typeof redirect !== "string") {
      return this.reject("The redirect parameter is missing or is not a string.");
    }
    if (!this.session.authToken) {
      return this.reject("No authentication token is available.");
    }

    let url: URL;
    try {
      url = new URL(redirect);
    } catch {
      return this.reject("The callback is not a valid absolute URL.");
    }

    // The callback carries an account token, so it must use encrypted transport.
    if (url.protocol !== "https:") {
      return this.reject("The callback must use HTTPS.");
    }
    // URL credentials can disguise the destination (trusted.example@attacker.example)
    // and could send unrelated Basic Auth credentials to the callback site.
    if (url.username || url.password) {
      return this.reject("The callback must not contain embedded credentials.");
    }

    const domains = this.config.settings.authRedirectDomains ?? [];
    const allowed = domains.some((domain) => {
      const pattern = domain.toLowerCase();
      if (pattern.startsWith("*.")) {
        // Include the dot boundary to exclude lookalikes and the bare parent domain.
        const suffix = pattern.slice(1);
        return url.hostname.endsWith(suffix) && url.hostname.length > suffix.length;
      }
      return url.hostname === pattern;
    });

    if (!allowed) {
      return this.reject("The callback domain is not in the authentication redirect allowlist.");
    }

    browser.location.assign(this.session.addAuthTokenToUrl(url.href));
    return true;
  }

  private reject(reason: string): false {
    // Do not log callback URLs: they may contain credentials or authentication tokens.
    console.warn(`External authentication redirect skipped: ${reason}`);
    return false;
  }
}
