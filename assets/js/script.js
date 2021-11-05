let numberOfCards = 0;
let backlogContent = '';

function getDragAfterElement (column, y) {
    const draggableElements = [...column.querySelectorAll('.drag-box:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
            return {
                offset: offset, element: child
            }
        }
        else {
            return closest;
        }

    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

window.addEventListener('DOMContentLoaded', () => {
    const backlogContent = sessionStorage.getItem('backlogContent');
    const inProgressContent = sessionStorage.getItem('inProgressContent');
    const completeContent = sessionStorage.getItem('completeContent');
    const onHoldContent = sessionStorage.getItem('onHoldContent');
    
    if (backlogContent !== null && backlogContent !== '') {
        const backlogEl = document.querySelector('#backlog');
        backlogEl.innerHTML = backlogContent;
    }

    if (inProgressContent !== null && inProgressContent !== '') {
        const inProgressEl = document.querySelector('#in-progress');
        inProgressEl.innerHTML = inProgressContent;
    }

    if (completeContent !== null && completeContent !== '') {
        const completeEl = document.querySelector('#complete');
        completeEl.innerHTML = completeContent;
    }

    if (onHoldContent !== null && onHoldContent !== '') {
        const onHoldEl = document.querySelector('#on-hold');
        onHoldEl.innerHTML = onHoldContent;
    }

	const columns = document.querySelectorAll('.container-inner');
	for (let i = 0; i < columns.length; i++) {
		columns[i].addEventListener('dragover', e => {
			e.preventDefault();
			const afterElement = getDragAfterElement(columns[i], e.clientY);
			const draggable = document.querySelector('.dragging');
			
			if (afterElement == null) {
				columns[i].appendChild(draggable);
			}
			else {
				afterElement.parentNode.insertBefore(draggable, afterElement);
			}
		});
	}

    const elements = document.querySelectorAll('.drag-box');
    for (let i = 0; i < elements.length; i++) {
        elements[i].addEventListener('dragstart', () => {
			elements[i].classList.add('dragging');
		});
		elements[i].addEventListener('dragend', () => {
			elements[i].classList.remove('dragging');
		});
    }
});

function addNewCard(id) {
    const columnEl = document.querySelector('#' + id);

    numberOfCards++;
    const newCard = document.createElement('div');
    newCard.innerHTML = '<div contentEditable="true" class="drag-box-content"></div>';
    newCard.id = 'card-' + numberOfCards;
    newCard.classList.add('drag-box');
    newCard.draggable = 'true';

	newCard.addEventListener('dragstart', () => {
		newCard.classList.add('dragging');
	});
	newCard.addEventListener('dragend', () => {
		newCard.classList.remove('dragging');
	});

    columnEl.appendChild(newCard);
}

window.onbeforeunload = function ()
{
    const backlogEl = document.querySelector('#backlog');
    backlogContent = backlogEl.innerHTML;
    sessionStorage.setItem('backlogContent', backlogContent);

    const inProgressEl = document.querySelector('#in-progress');
    inProgressContent = inProgressEl.innerHTML;
    sessionStorage.setItem('inProgressContent', inProgressContent);

    const completeEl = document.querySelector('#complete');
    completeContent = completeEl.innerHTML;
    sessionStorage.setItem('completeContent', completeContent);

    const onHoldEl = document.querySelector('#on-hold');
    onHoldContent = onHoldEl.innerHTML;
    sessionStorage.setItem('onHoldContent', onHoldContent);
};
