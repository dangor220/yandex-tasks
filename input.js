module.exports = function getI18nText({
	stringTokens,
	variables,
	translations,
	locale,
}) {
	let i18nText = '';

	let lang;

	if (translations) {
		lang = translations[locale];
	}

	for (let item of stringTokens) {
		if (typeof item !== 'object') {

      if (item[0] === '#') {
        i18nText += lang[item.substring(1)]
      } else if (item[0] === '$') {
        i18nText += variables[item.substring(1)]
      } else {
        i18nText += item;
      }
		} else {
			const [func, value, option] = item;

			switch (func) {
				case '@date':
					i18nText += new Intl.DateTimeFormat(locale, {
						weekday: 'long',
						year: 'numeric',
						month: 'long',
						day: 'numeric',
						hour: 'numeric',
						minute: 'numeric',
						second: 'numeric',
						timeZoneName: 'short',
					}).format(new Date(value));
					break;
				case '@number':
					let num;

					typeof value === 'number'
						? (num = value)
						: (num = variables[value.substring(1)]);

					i18nText += new Intl.NumberFormat(locale, {
						style: 'currency',
						currency: option,
					}).format(num);
					break;
				case '@list':
					const items = item.slice(1);

					let res = [];

					items.forEach((name) => {
						if (name[0] !== '$' && name[0] !== '#') {
							res.push(name);
						}
						if (name[0] === '$') {
							res.push(variables[name.substring(1)]);
						}
						if (name[0] === '#') {
							res.push(lang[name.substring(1)]);
						}
					});

					i18nText += new Intl.ListFormat('en', {
						style: 'long',
						type: 'conjunction',
					}).format(res);

					break;
				case '@plural':
					i18nText +=
						variables[option.substring(1)] +
						lang[value.substring(1)][
							new Intl.PluralRules(locale).select(
								Math.floor(variables[option.substring(1)])
							)
						];
					break;
				case '@relativeTime':
					i18nText += new Intl.RelativeTimeFormat(locale, {
						style: 'long',
					}).format(value, option);
					break;
				default:
					break;
			}
		}
	}

	return i18nText;
};