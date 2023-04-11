// Шаблонизатор

// copy:n — скопировать текущий элемент n раз и поместить новые элементы после текущего;
// remove:n — удалить n элементов, начиная со следующего. Если после текущего нет n элементов (количество_элементов_после_текущего < n), то удаляются все элементы, которые идут после текущего;
// removeChildren:n — удалить n потомков элемента, начиная с первого;
// switch:n — поменять текущий элемент местами с элементом через n шагов вперёд от текущего (стоит обратить внимание на примеры 2 и 3).

//!!!
// copy -> remove -> removeChildren -> switch
// Сначала выполняются все операции на верхнем уровне, далее — на втором уровне и т.д.
// Атрибут x-make необходимо удалять после

function solution(entry) {
	if (!entry) return;

	// actions order
	const stack = ['copy', 'remove', 'removeChildren', 'switch'];
	const currentStack = [];

	// get current stack actions on first level DOM
	let listElems = Array.from(entry.children);

	listElems.forEach((elem) => {
		if (elem.getAttribute('x-make')) {
			currentStack.push(elem.getAttribute('x-make').split(':'));
		}
	});

	// action call according to order
	stack.forEach((action) => {
		for (let i = 0; i < currentStack.length; i++) {
			if (currentStack[i][0] === action) {
				let count = currentStack[i][1];
				const elem = entry.querySelector(`[x-make="${action}:${count}"]`);

				if (elem) {
					elem.removeAttribute(`x-make`);
				}

				switch (action) {
					case 'copy':
						for (let i = 0; i < count; i++) {
							elem.insertAdjacentHTML('afterend', elem.outerHTML);
						}
						break;
					case 'remove':
						for (let i = 0; i < count; i++) {
							if (elem.nextElementSibling) {
								elem.nextElementSibling.remove();
							}
						}
						break;
					case 'removeChildren':
						let children = elem.children;

						for (let i = 0; i < count; i++) {
							if (children[0]) {
								children[0].remove();
							}
						}

						break;
					case 'switch':
						listElems = Array.from(entry.children);

						if (listElems.length - listElems.indexOf(elem) < count) {
							count = count % listElems.length;
						}

						let currentElem = listElems[listElems.indexOf(elem)],
							replaceElem =
								listElems[+listElems.indexOf(elem) + +count] ||
								listElems[listElems.length - 1];

						if (currentElem && replaceElem) {
							let nextElement = currentElem.nextElementSibling;

							if (nextElement == replaceElem) {
								currentElem.parentNode.insertBefore(replaceElem, currentElem);
								return;
							}

							entry.insertBefore(
								entry.replaceChild(currentElem, replaceElem),
								nextElement
							);
						}

						break;

					default:
						break;
				}
			}
		}
	});

	// recursion
	listElems.forEach((item) => {
		if (item.children.length !== 0) {
			solution(item);
		}
	});
}

solution(document.querySelector('entry'));
