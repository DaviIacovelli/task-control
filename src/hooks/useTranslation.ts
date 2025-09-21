import { formatMessage, getMessages } from "@/lib/i18n";
import { Messages } from "@/types/i18n";
import { useRouter } from "next/router";
import { useCallback, useMemo, useRef } from "react";

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

type TranslationKey = NestedKeyOf<Messages>;

export function useTranslation() {
  const router = useRouter();
  const { locale = "pt" } = router;
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const messages = useMemo(() => getMessages(locale), [locale]);

  const t = useCallback(
    (key: TranslationKey, values?: Record<string, string>): string => {
      const keys = key.split(".");
      let message: unknown = messages;

      for (const k of keys) {
        if (message && typeof message === "object" && k in message) {
          message = (message as Record<string, unknown>)[k];
        } else {
          message = undefined;
          break;
        }
      }

      if (typeof message !== "string") {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }

      return values ? formatMessage(message, values) : message;
    },
    [messages]
  );

  const changeLanguage = useCallback(
    (newLocale: string) => {
      // Clear previous debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Debounce language changes to prevent rapid consecutive changes
      debounceTimerRef.current = setTimeout(() => {
        if (newLocale !== locale) {
          router.push(router.pathname, router.asPath, { locale: newLocale });
        }
      }, 150); // 150ms debounce
    },
    [router, locale]
  );

  return { t, locale, changeLanguage, messages };
}
