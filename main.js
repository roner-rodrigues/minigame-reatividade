$(document).ready(function () {
  loadElementList();
  initGame();

  $('#btn-reset').click(function () {
    initGame();
  });

  

});


function initGame() {
  $('#blade').data('selectedElement', null);
  $('#flask').data('selectedElement', null);
  
  $('#reaction-liquid').removeClass('fill');
  $('#reaction-liquid').removeClass(function(index, className) {
    return (className.match(/(^|\s)elem-color-\S+/g) || []).join(' ');
  });

  $('#falling-blade').remove();
  
  // Inicializa o jogo induzindo o usuário a escolher primeiro o elemento da lâmina 
  $('#blade').addClass('selected');
}

function loadElementList() {
  $.getJSON("elements.json", function (elements) {
    let listaMetais = $(".lista-metais");

    elements.forEach(function (element) {
      let elemHtml = `
        <div class="div-elemento elem-name-${element.nome} elem-color-${element.id} elem-reactLevel-${element.reactLevel} form-check form-check-inline d-flex flex-column align-items-center">
          <div class="portrait-wrapper">
            <img class="portrait fixed-size-img" src="${element.imgSrc}" alt="${element.altText}">
          </div>
          <input class="form-check-input mt-2" type="radio" name="elem" id="elem-${element.nome}" value="${element.nome}">
          <label class="form-check-label" for="elem-${element.nome}">${element.nome}</label>
        </div>
      `;
      listaMetais.append(elemHtml);
    });

    $('input[name="elem"]').change(function () {
      if ($(this).is(':checked')) {
        // Find the image 'src' property for selected element
        let imgSrc = $(this).prev('.portrait-wrapper').find('img').attr('src');

        applyColorToSelectedRecipient($(this));

        updateSideBarInfo(imgSrc)
      }
    });
      
    $('[class^="div-elemento"]').click(function (event) {
      event.stopPropagation(); 
  
      // Find the child input element
      let input = $(this).find('input');

      // Find the image 'src' property for selected element
      let imgSrc = $(this).find('.portrait').attr('src');
  
      // Check the input only if it's not already checked
      if (!input.prop('checked')) {
          input.prop('checked', true);
          
          applyColorToSelectedRecipient(input);
          
          updateSideBarInfo(imgSrc);
      }
    });
  });
}

// Function to apply the color of the selected element to the selected recipient
function applyColorToSelectedRecipient(selectedInput) {
  
  // Get the color class from the selected input's parent div
  let selectedColorClass = selectedInput.closest('div').attr('class')
    .split(' ')
    .find((cls) => cls.startsWith('elem-color-'));

  // Get the reactivity level from the selected element
  let selectedReactLevel = selectedInput.closest('div').attr('class')
    .split(' ')
    .find((cls) => cls.startsWith('elem-reactLevel-'));

  // Get the element name from the selected element
  let selectedName = selectedInput.closest('div').attr('class')
    .split(' ')
    .find((cls) => cls.startsWith('elem-name-'));

  // Get the selected recipient
  let selectedRecipient = $('.selected');

  // Remove existing color classes from the selected recipient
  selectedRecipient.removeClass(function(index, className) {
    return (className.match(/(^|\s)elem-color-\S+/g) || []).join(' ');
  });
  
  // Apply the selected color class to the selected recipient
  selectedRecipient.addClass(selectedColorClass);
  
  // Remove existing reactivity level from the selected recipient
  selectedRecipient.removeClass(function(index, className) {
    return (className.match(/(^|\s)elem-reactLevel-\S+/g) || []).join(' ');
  });
  
  // Apply the selected reactivity level to the selected recipient
  selectedRecipient.addClass(selectedReactLevel);

  // Remove existing element name from the selected recipient
  selectedRecipient.removeClass(function(index, className) {
    return (className.match(/(^|\s)elem-name-\S+/g) || []).join(' ');
  });
  
  // Apply the selected element to the selected recipient
  selectedRecipient.addClass(selectedName);

  // Store the selected color class in the selected recipient's state
  selectedRecipient.data('lastSetedColorClass', selectedColorClass);

  // Uncheck and disable previously selected inputs for this recipient
  let previouslySelectedInput = selectedRecipient.data('selectedElement');
  if (previouslySelectedInput && previouslySelectedInput !== selectedInput) {
    previouslySelectedInput.prop('checked', false);
  }

  // Store the selected input in the selected recipient's state and associate the recipient with the input
  selectedRecipient.data('selectedElement', selectedInput);
}

// Recipient select handler
$(document).on('click', '.recipient', function () {
  // Verify if an previous recipient is already selected 
  let previouslySelectedRecipient = $('.selected');

  if (previouslySelectedRecipient.length > 0) {
    previouslySelectedRecipient.removeClass('selected');
  }

  // Add 'selected' class to actually selected recipient
  $(this).addClass('selected');

  // Uncheck the input elements associated with other recipients
  $('.recipient').each(function () {
    if (!$(this).hasClass('selected')) {
      let otherInput = $(this).data('selectedElement');
      if (otherInput) {
        otherInput.prop('checked', false);
      }
    }
  });

  let selectedInput = $(this).data('selectedElement');
  if (selectedInput) {
    selectedInput.prop('checked', true);
  }
});

function updateSideBarInfo(elemImgSrc) {

  $('.side-info-portrait').attr('src', elemImgSrc); 

}
