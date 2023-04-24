module.exports = function (configValue) {
	const makeDynamicConfig = (obj) => {
		const dynamicKeys = [];
		const dynamicValues = [];

		// Собрать все динамические ключи и значения в отдельные массивы
		for (const key in obj) {
			if (typeof obj[key] === 'function') {
				dynamicKeys.push(key);
				dynamicValues.push(obj[key]());
			}
		}

		// Вернуть прокси-объект, который будет перехватывать обращения
		// к динамическим значениям и обновлять их при изменении конфига
		return new Proxy(obj, {
			get(target, prop, receiver) {
				if (dynamicKeys.includes(prop)) {
					return target[prop]();
				} else {
					return Reflect.get(target, prop, receiver);
				}
			},
			set(target, prop, value, receiver) {
				if (dynamicKeys.includes(prop)) {
					dynamicValues[dynamicKeys.indexOf(prop)] = value;
				} else {
					Reflect.set(target, prop, value, receiver);
				}
				return true;
			},
		});
	};

	const dynamicConfigValue = (key) => () => {
		return `${configValue(key)}`;
	};

	return {
		makeDynamicConfig,
		dynamicConfigValue,
	};
};
