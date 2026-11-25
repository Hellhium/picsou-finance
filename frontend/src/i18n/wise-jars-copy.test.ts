import { describe, expect, it } from 'vitest'
import de from './locales/de.json'
import en from './locales/en.json'
import es from './locales/es.json'
import fr from './locales/fr.json'

// Enable Banking lists a Wise jar once it is selected in its Control Panel, and the Wise Jars
// connector can bring the same jar: linking both counts it twice (#761). No Wise copy may say the
// bank connection cannot see the jars; the lines that send a member from one source to the other
// warn about the double count, and the one shown once both may be linked says how to undo it.
const twice = { fr: /deux fois/, en: /counts? twice/, de: /doppelt/, es: /dos veces/ }
const cannotSee = {
  fr: /ne (les )?voit pas|non couvertes|ne passent pas|ne passent jamais/,
  en: /can'?not see|can't see|do not come through|never come|never reach/,
  de: /nicht sieht|sieht sie nicht|kommen nicht|nie über|nicht sichtbar/,
  es: /no (los )?ve\b|no llegan|nunca llegan/,
}
// The Wise Jars copy is the one to delete: its `wise_jar_` id is stable, while an Enable Banking
// jar has no IBAN, so a deleted one comes back when Enable Banking rotates the account uid.
const remedy = {
  fr: /supprimez (alors )?son compte Wise Jars/,
  en: /delete its Wise Jars account/,
  de: /sein Wise-Jars-Konto/,
  es: /elimina su cuenta de Wise Jars/,
}

describe('Wise Jars copy', () => {
  it.each(Object.entries({ fr, en, de, es }))(
    '%s never says the bank connection cannot see the Jars',
    (lang, locale) => {
      const texts = [
        locale.addAccount.desc.wise,
        locale.sync.banks.wiseJarsEitherWay,
        locale.sync.banks.wiseJarsConnected,
        locale.sync.wise.intro,
      ]
      for (const text of texts) {
        expect(text).not.toMatch(cannotSee[lang as keyof typeof cannotSee])
      }
    },
  )

  it.each(Object.entries({ fr, en, de, es }))(
    '%s warns that a jar linked through both connections counts twice',
    (lang, locale) => {
      const texts = [
        locale.sync.banks.wiseJarsEitherWay,
        locale.sync.banks.wiseJarsConnected,
        locale.sync.wise.intro,
      ]
      for (const text of texts) {
        expect(text).toMatch(twice[lang as keyof typeof twice])
      }
    },
  )

  it.each(Object.entries({ fr, en, de, es }))(
    '%s tells which Enable Banking setting brings the Jars, and how to undo a double count',
    (lang, locale) => {
      expect(locale.sync.banks.wiseJarsEitherWay).toContain('Control Panel')
      expect(locale.sync.banks.wiseJarsConnected).toContain('Control Panel')
      expect(locale.sync.banks.wiseJarsConnected).toMatch(remedy[lang as keyof typeof remedy])
    },
  )
})
